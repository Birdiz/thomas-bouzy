import type { SurveyFormLabels } from '../../content/types.ts';
import { frenchSpacing } from '../french-spacing.ts';
import {
  CONTACT_FIELDS,
  CONTACT_FLAGS,
  CONTACT_MAXLENGTHS,
  type ContactField,
  type ContactFlag,
  type ContactKey,
  lengthOf,
  NO_CONTACT,
  shownContact,
  validateContact,
} from './contact.ts';
import { orderOptions } from './options.ts';
import type {
  Answer,
  Answers,
  SurveyContact,
  SurveyOption,
  SurveyQuestion,
  SurveySection,
  SurveyStructure,
} from './types.ts';
import { validateAnswers } from './validation.ts';
import { conditionMet, groupForDisplay, visibleSections } from './visibility.ts';

/**
 * The field study's form (ADR 34), in plain DOM: the questionnaire's
 * introduction, one section per step, then an optional contact step. The
 * questionnaire comes from the back office at runtime; nothing here knows its
 * questions, and nothing here says how long it takes: `estimatedMinutes` is
 * never read.
 *
 * What the browser checks, the back office checks again: this is a comfort,
 * not a guard. Answers to questions a later answer hides are dropped before
 * sending (validateAnswers). Progress survives a reload in sessionStorage, and
 * is forgotten once sent.
 */

export interface FormConfig {
  root: HTMLElement;
  /** '' to call the page's own origin. */
  apiOrigin: string;
  slug: string;
  labels: SurveyFormLabels;
}

const CONTACT_INPUT: Record<ContactField, { type: string; autocomplete: string }> = {
  name: { type: 'text', autocomplete: 'name' },
  organisation: { type: 'text', autocomplete: 'organization' },
  email: { type: 'email', autocomplete: 'email' },
};
const DEFAULT_TEXT_MAXLENGTH = 1000;

interface Saved {
  answers: Answers;
  contact: SurveyContact;
  step: number;
}

const fr = (text: string | null | undefined) => frenchSpacing(text ?? '');

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, string | boolean | undefined> = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'text') node.textContent = String(value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children) if (child) node.append(child);
  return node;
}

const describedBy = (...ids: (string | false | undefined)[]) =>
  ids.filter(Boolean).join(' ') || undefined;

export function mountSurvey(config: FormConfig): void {
  const { root, labels, slug } = config;
  const endpoint = `${config.apiOrigin}/api/surveys/${encodeURIComponent(slug)}`;
  const storageKey = `survey:${slug}`;

  let structure: SurveyStructure | undefined;
  let answers: Answers = {};
  let contact: SurveyContact = { ...NO_CONTACT };
  let step = 0;
  let errors: Record<string, string> = {};
  let contactErrors: Partial<Record<ContactKey, string>> = {};
  /** A refusal the back office tied to no question nor field (`answers`, `contact`). */
  let formError = '';
  /** Each question's options in the order first shown: a re-render must not reshuffle them. */
  const orders = new Map<string, SurveyOption[]>();

  const live = el('p', { class: 'visually-hidden', 'aria-live': 'polite' });
  const view = el('div', { class: 'survey__view' });
  root.replaceChildren(view, live);

  const announce = (text: string) => {
    live.textContent = '';
    // A change the screen reader will notice even when the text repeats.
    requestAnimationFrame(() => {
      live.textContent = text;
    });
  };

  // — progress kept in the tab ————————————————————————————————————————————

  function save() {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ answers, contact, step } satisfies Saved),
      );
    } catch {
      // Private mode or storage disabled: progress is simply not kept.
    }
  }

  function restore() {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<Saved>;
      if (saved.answers && typeof saved.answers === 'object') answers = saved.answers;
      if (saved.contact && typeof saved.contact === 'object')
        contact = { ...contact, ...saved.contact };
      if (typeof saved.step === 'number') step = saved.step;
    } catch {
      // Unreadable: start afresh.
    }
  }

  function forget() {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Nothing to forget.
    }
  }

  /** The steps: the visible sections, then the contact. */
  const sections = (): SurveySection[] => (structure ? visibleSections(structure, answers) : []);
  const total = () => sections().length + 1;

  function button(text: string, cls: string, onClick: () => void) {
    const node = el('button', { type: 'button', class: cls, text });
    node.addEventListener('click', onClick);
    return node;
  }

  /** A state with no form: loading, closed, unreachable. Returns what to focus. */
  function status(text: string, action?: { label: string; run: () => void }) {
    const message = el('p', { class: 'survey__message', tabindex: '-1', text });
    view.replaceChildren(
      message,
      ...(action ? [el('p', {}, button(action.label, 'btn btn-secondary', action.run))] : []),
    );
    return message;
  }

  async function load() {
    view.replaceChildren(
      el('p', { class: 'survey__message', role: 'status', text: labels.loading }),
    );
    try {
      const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
      // A body left unread holds the request open; nothing waits on it.
      if (!response.ok) void response.body?.cancel();
      if (response.status === 404 || response.status === 410) {
        status(labels.closed);
        return;
      }
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as SurveyStructure;
      const closed =
        data.status !== 'published' || (data.closesAt && Date.parse(data.closesAt) < Date.now());
      if (closed) {
        status(labels.closed);
        return;
      }
      structure = data;
      restore();
      step = Math.min(Math.max(step, 0), total() - 1);
      render(false);
    } catch {
      status(labels.unreachable, { label: labels.retry, run: load }).focus();
    }
  }

  // — rendering ———————————————————————————————————————————————————————————

  /**
   * The questionnaire's own introduction, above the first step: it is where
   * the study says what it is about and whom it asks, words the page itself
   * never holds (ADR 34).
   */
  function intro(): HTMLElement | null {
    const heading = structure?.intro.heading;
    const body = structure?.intro.body ?? [];
    if (!heading && body.length === 0) return null;
    return el(
      'div',
      { class: 'survey__intro' },
      heading ? el('h2', { class: 'survey__intro-heading', text: fr(heading) }) : null,
      ...body.map((paragraph) => el('p', { text: fr(paragraph) })),
    );
  }

  function render(moveFocus: boolean) {
    const list = sections();
    const isContact = step >= list.length;
    const section = list[step];
    const heading = el('h2', {
      class: 'survey__title',
      tabindex: '-1',
      text: isContact ? labels.contact.title : fr(section?.title),
    });
    const progress = el(
      'div',
      { class: 'survey__progress' },
      el('p', { class: 'survey__step' }),
      el('div', { class: 'survey__bar', 'aria-hidden': 'true' }, el('span')),
    );

    const form = el('form', { class: 'survey__form', novalidate: true });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (isContact) void submit();
      else next();
    });

    if (isContact) {
      form.append(contactStep());
    } else if (section && structure) {
      // Every question of the section, even those hidden by an answer on this
      // same step: they are shown or hidden in place, so typing keeps focus.
      const all = structure.sections.find((candidate) => candidate.code === section.code);
      for (const group of groupForDisplay(all?.questions ?? [])) {
        const box = el('div', { class: 'survey__group' });
        for (const question of group) box.append(field(question));
        form.append(box);
      }
    }

    if (formError) {
      form.append(el('p', { class: 'survey__error survey__form-error', text: fr(formError) }));
    }

    const nav = el('div', { class: 'survey__nav' });
    if (step > 0) nav.append(button(labels.back, 'btn btn-secondary', back));
    nav.append(
      el('button', {
        type: 'submit',
        class: 'btn btn-primary',
        text: isContact ? labels.submit : labels.next,
      }),
    );
    form.append(nav);

    view.replaceChildren(...[step === 0 ? intro() : null, progress, heading, form].filter(isNode));
    refresh();
    if (moveFocus) heading.focus();
  }

  /**
   * Shows or hides what depends on answers given on this step: the questions
   * a condition hides, the field an option reveals, the contact fields the
   * consent shows. A branch taken here also adds or removes steps after it.
   */
  function refresh() {
    if (structure) {
      for (const section of structure.sections) {
        for (const question of section.questions) {
          const node = view.querySelector<HTMLElement>(`[data-question="${question.code}"]`);
          if (!node) continue;
          node.hidden = !(
            conditionMet(section.displayIf, answers) && conditionMet(question.displayIf, answers)
          );
        }
      }
    }
    for (const reveal of view.querySelectorAll<HTMLElement>('[data-reveals]')) {
      const [code, value] = (reveal.dataset.reveals ?? '').split(':');
      reveal.hidden = !(code && value && answers[code]?.options?.includes(value));
    }
    for (const node of view.querySelectorAll<HTMLElement>('[data-consent-only]')) {
      node.hidden = !contact.contactConsent;
    }
    const stepText = view.querySelector('.survey__step');
    if (stepText) {
      stepText.textContent = labels.progress
        .replace('{current}', String(step + 1))
        .replace('{total}', String(total()));
    }
    // Set through the CSSOM, which the CSP allows, never as a style attribute, which it refuses.
    view
      .querySelector<HTMLElement>('.survey__bar span')
      ?.style.setProperty('--ratio', String((step + 1) / total()));
  }

  function setAnswer(code: string, answer: Answer | undefined) {
    if (answer && Object.keys(answer).length > 0) answers[code] = answer;
    else delete answers[code];
    if (errors[code]) clearError(`[data-question="${code}"]`, () => delete errors[code]);
    refresh();
    save();
  }

  function setContact(key: ContactKey, value: string | boolean) {
    contact = { ...contact, [key]: value };
    if (contactErrors[key]) {
      clearError(`[data-contact="${key}"]`, () => delete contactErrors[key]);
    }
    refresh();
    save();
  }

  function clearError(selector: string, forgetIt: () => void) {
    forgetIt();
    const node = view.querySelector<HTMLElement>(selector);
    node?.querySelector('.survey__error')?.replaceChildren();
    for (const input of node?.querySelectorAll('[aria-invalid]') ?? []) {
      input.removeAttribute('aria-invalid');
    }
  }

  /** The text field an option opens, shown only while that option is chosen. */
  function revealField(
    question: SurveyQuestion,
    option: SurveyOption,
    read: () => Answer | undefined,
    errorId: string,
  ): HTMLElement {
    const id = `q-${question.code}-text`;
    const input = el('input', {
      type: 'text',
      id,
      maxlength: String(option.textMaxlength ?? DEFAULT_TEXT_MAXLENGTH),
      'aria-describedby': errorId,
      class: 'survey__reveal-input',
    });
    input.value = answers[question.code]?.texte ?? '';
    input.dataset.revealText = question.code;
    input.addEventListener('input', () => setAnswer(question.code, read()));
    return el(
      'div',
      { class: 'survey__reveal', 'data-reveals': `${question.code}:${option.value}` },
      el('label', { for: id, class: 'survey__help', text: fr(option.textHelp ?? option.label) }),
      input,
    );
  }

  /** The revealed text of a question, if its field is on the page and filled. */
  const revealedText = (code: string) =>
    view.querySelector<HTMLInputElement>(`[data-reveal-text="${code}"]`)?.value ?? '';

  function field(question: SurveyQuestion): HTMLElement {
    const id = `q-${question.code}`;
    const helpId = question.help ? `${id}-help` : undefined;
    const errorId = `${id}-error`;
    const error = errors[question.code];
    const invalid = error ? 'true' : undefined;
    const marker = question.required
      ? null
      : el('span', { class: 'survey__optional', text: ` (${labels.optional})` });
    const help = helpId
      ? el('p', { id: helpId, class: 'survey__help', text: fr(question.help) })
      : null;
    const errorNode = el('p', { id: errorId, class: 'survey__error' }, error ? fr(error) : '');
    const answer = answers[question.code] ?? {};
    const wrap = (inner: HTMLElement) => {
      inner.dataset.question = question.code;
      inner.classList.add('survey__question');
      return inner;
    };
    const label = () =>
      el('label', { for: id, class: 'survey__label' }, fr(question.label), marker);

    switch (question.type) {
      case 'text': {
        const max = question.maxlength ?? DEFAULT_TEXT_MAXLENGTH;
        const counterId = `${id}-counter`;
        const area = el('textarea', {
          id,
          name: question.code,
          rows: '4',
          maxlength: String(max),
          'aria-describedby': describedBy(helpId, counterId, errorId),
          'aria-invalid': invalid,
          required: question.required,
        });
        area.value = answer.texte ?? '';
        const counter = el('p', { id: counterId, class: 'survey__counter' });
        const count = () => {
          counter.textContent = labels.counter
            .replace('{count}', String(lengthOf(area.value)))
            .replace('{max}', String(max));
        };
        count();
        area.addEventListener('input', () => {
          count();
          setAnswer(question.code, area.value.trim() ? { texte: area.value } : undefined);
        });
        return wrap(el('div', {}, label(), help, area, counter, errorNode));
      }

      case 'select': {
        const revealing = question.options.find((option) => option.revealsText);
        const select = el(
          'select',
          {
            id,
            name: question.code,
            'aria-describedby': describedBy(helpId, errorId),
            'aria-invalid': invalid,
            required: question.required,
          },
          el('option', { value: '', text: labels.selectPlaceholder }),
          ...optionsOf(question).map((option) =>
            el('option', { value: option.value, text: fr(option.label) }),
          ),
        );
        select.value = answer.options?.[0] ?? '';
        const read = (): Answer | undefined => {
          if (!select.value) return undefined;
          const texte = select.value === revealing?.value ? revealedText(question.code) : '';
          return { options: [select.value], ...(texte.trim() && { texte }) };
        };
        select.addEventListener('change', () => setAnswer(question.code, read()));
        return wrap(
          el(
            'div',
            {},
            label(),
            help,
            select,
            revealing ? revealField(question, revealing, read, errorId) : null,
            errorNode,
          ),
        );
      }

      case 'boolean': {
        const box = el('input', {
          type: 'checkbox',
          id,
          name: question.code,
          'aria-describedby': describedBy(helpId, errorId),
          'aria-invalid': invalid,
        });
        box.checked = answer.booleen === true;
        box.addEventListener('change', () => {
          setAnswer(question.code, box.checked ? { booleen: true } : undefined);
        });
        return wrap(
          el(
            'div',
            {},
            el(
              'label',
              { class: 'survey__choice', for: id },
              box,
              el('span', {}, fr(question.label), marker),
            ),
            help,
            errorNode,
          ),
        );
      }

      default:
        return wrap(choices(question, { marker, help, errorNode, helpId, errorId, invalid }));
    }
  }

  function optionsOf(question: SurveyQuestion): SurveyOption[] {
    let order = orders.get(question.code);
    if (!order) {
      order = orderOptions(question);
      orders.set(question.code, order);
    }
    return order;
  }

  /** Radios or checkboxes in a fieldset, named by its legend: single, multi, scale, single_with_text. */
  function choices(
    question: SurveyQuestion,
    parts: {
      marker: HTMLElement | null;
      help: HTMLElement | null;
      errorNode: HTMLElement;
      helpId: string | undefined;
      errorId: string;
      invalid: string | undefined;
    },
  ): HTMLElement {
    const id = `q-${question.code}`;
    const answer = answers[question.code] ?? {};
    const multi = question.type === 'multi';
    const set = el(
      'fieldset',
      { class: 'survey__fieldset' },
      el('legend', { class: 'survey__label' }, fr(question.label), parts.marker),
      parts.help,
    );
    const limitId = multi && question.maxSelections ? `${id}-limit` : undefined;
    if (limitId) {
      set.append(
        el('p', {
          id: limitId,
          class: 'survey__help',
          text: labels.maxSelections.replace('{max}', String(question.maxSelections)),
        }),
      );
    }

    const list = el('div', {
      class: question.type === 'scale' ? 'survey__scale' : 'survey__choices',
    });
    const inputs: HTMLInputElement[] = [];
    const revealing = question.options.find((option) => option.revealsText);

    const read = (): Answer | undefined => {
      if (question.type === 'scale') {
        const picked = inputs.find((input) => input.checked);
        if (!picked) return undefined;
        return picked.value === '' ? { sansAvis: true } : { echelle: Number(picked.value) };
      }
      const values = inputs.filter((input) => input.checked).map((input) => input.value);
      if (values.length === 0) return undefined;
      const texte =
        revealing && values.includes(revealing.value) ? revealedText(question.code) : '';
      return { options: values, ...(texte.trim() && { texte }) };
    };

    const options: { value: string; label: string; option?: SurveyOption }[] =
      question.type === 'scale'
        ? scaleOptions(question)
        : optionsOf(question).map((option) => ({
            value: option.value,
            label: fr(option.label),
            option,
          }));

    options.forEach((choice, i) => {
      const inputId = `${id}-${i}`;
      const input = el('input', {
        type: multi ? 'checkbox' : 'radio',
        id: inputId,
        name: question.code,
        value: choice.value,
        required: !multi && question.required,
        'aria-describedby': describedBy(parts.helpId, limitId, parts.errorId),
        'aria-invalid': parts.invalid,
      });
      input.checked =
        question.type === 'scale'
          ? choice.value === ''
            ? answer.sansAvis === true
            : answer.echelle === Number(choice.value)
          : (answer.options ?? []).includes(choice.value);
      inputs.push(input);
      const item = el(
        'div',
        { class: 'survey__item' },
        el(
          'label',
          { class: 'survey__choice', for: inputId },
          input,
          el('span', { text: choice.label }),
        ),
      );
      if (choice.option?.revealsText) {
        item.append(revealField(question, choice.option, read, parts.errorId));
      }

      input.addEventListener('change', () => {
        if (multi && input.checked) {
          // An exclusive option (« Aucun ») unticks the others, and the reverse.
          const exclusive = choice.option?.exclusive;
          for (const [j, other] of inputs.entries()) {
            if (other === input) continue;
            if (exclusive || options[j]?.option?.exclusive) other.checked = false;
          }
        }
        setAnswer(question.code, read());
      });
      list.append(item);
    });
    set.append(list, parts.errorNode);
    return set;
  }

  function scaleOptions(question: SurveyQuestion) {
    const min = question.scaleMin ?? 1;
    const max = question.scaleMax ?? 5;
    const items: { value: string; label: string }[] = [];
    for (let value = min; value <= max; value++) {
      const anchor =
        value === min ? question.anchorMin : value === max ? question.anchorMax : undefined;
      items.push({
        value: String(value),
        label: anchor ? `${value} — ${fr(anchor)}` : String(value),
      });
    }
    if (question.allowNoOpinion) {
      items.push({ value: '', label: fr(question.noOpinionLabel ?? labels.noOpinion) });
    }
    return items;
  }

  /**
   * The optional last step: three independent boxes, then the address they
   * need, and, once the consent box is ticked, a name and an organisation.
   * Each box says what it implies, and the consent box carries its notice.
   */
  function contactStep(): DocumentFragment {
    const text = labels.contact;
    const fragment = document.createDocumentFragment();
    fragment.append(el('p', { class: 'survey__help', text: text.intro }));

    const help: Record<ContactFlag, string> = {
      wantsSynthesis: text.synthesisHelp,
      wantsMeeting: text.meetingHelp,
      contactConsent: text.notice,
    };
    for (const key of CONTACT_FLAGS) {
      const id = `contact-${key}`;
      const helpId = `${id}-help`;
      const errorId = `${id}-error`;
      const box = el('input', {
        type: 'checkbox',
        id,
        name: key,
        'aria-describedby': describedBy(helpId, errorId),
        'aria-invalid': contactErrors[key] ? 'true' : undefined,
      });
      box.checked = contact[key];
      box.addEventListener('change', () => setContact(key, box.checked));
      fragment.append(
        el(
          'div',
          { class: 'survey__question', 'data-contact': key },
          el('label', { class: 'survey__choice', for: id }, box, el('span', { text: text[key] })),
          el('p', { id: helpId, class: 'survey__help survey__aside', text: help[key] }),
          el('p', { id: errorId, class: 'survey__error', text: contactErrors[key] }),
        ),
      );
    }

    for (const key of CONTACT_FIELDS) {
      const id = `contact-${key}`;
      const helpId = key === 'email' ? `${id}-help` : undefined;
      const errorId = `${id}-error`;
      const input = el('input', {
        id,
        name: key,
        type: CONTACT_INPUT[key].type,
        autocomplete: CONTACT_INPUT[key].autocomplete,
        maxlength: String(CONTACT_MAXLENGTHS[key]),
        'aria-describedby': describedBy(helpId, errorId),
        'aria-invalid': contactErrors[key] ? 'true' : undefined,
      });
      input.value = contact[key] ?? '';
      input.addEventListener('input', () => setContact(key, input.value));
      fragment.append(
        el(
          'div',
          {
            class: 'survey__question',
            'data-contact': key,
            'data-consent-only': key === 'email' ? undefined : '',
          },
          el('label', { for: id, class: 'survey__label', text: text[key] }),
          helpId ? el('p', { id: helpId, class: 'survey__help', text: text.emailHelp }) : null,
          input,
          el('p', { id: errorId, class: 'survey__error', text: contactErrors[key] }),
        ),
      );
    }

    // A field no person sees or reaches: a bot that fills it is told all went
    // well by the back office, and nothing is kept.
    fragment.append(
      el(
        'div',
        { class: 'survey__trap', 'aria-hidden': 'true' },
        el('label', { for: 'contact-website', text: 'Website' }),
        el('input', {
          id: 'contact-website',
          name: 'website',
          type: 'text',
          tabindex: '-1',
          autocomplete: 'off',
        }),
      ),
    );
    return fragment;
  }

  // — moving ——————————————————————————————————————————————————————————————

  function stepCodes(index: number): Set<string> {
    return new Set(sections()[index]?.questions.map((question) => question.code) ?? []);
  }

  /** Re-renders the step with its errors, says so, and puts the cursor on the first. */
  function showErrors() {
    render(false);
    announce(labels.fixErrors);
    const first =
      view.querySelector<HTMLElement>('[aria-invalid="true"]') ??
      view.querySelector<HTMLElement>('.survey__form-error');
    if (first?.classList.contains('survey__form-error')) first.tabIndex = -1;
    first?.focus();
  }

  function next() {
    if (!structure) return;
    const result = validateAnswers(structure, answers, stepCodes(step));
    errors = result.errors;
    formError = '';
    if (Object.keys(errors).length > 0) {
      showErrors();
      return;
    }
    step = Math.min(step + 1, total() - 1);
    save();
    render(true);
  }

  function back() {
    formError = '';
    step = Math.max(step - 1, 0);
    save();
    render(true);
  }

  /** The first step holding one of these question codes, or the contact step. */
  function stepOf(codes: string[]): number {
    const list = sections();
    const index = list.findIndex((section) =>
      section.questions.some((question) => codes.includes(question.code)),
    );
    return index === -1 ? list.length : index;
  }

  /** Puts the cursor back on the step where the errors are. */
  function goToErrors() {
    step = Object.keys(errors).length > 0 ? stepOf(Object.keys(errors)) : sections().length;
    showErrors();
  }

  let sending = false;

  async function submit() {
    if (!structure || sending) return;
    const checked = validateAnswers(structure, answers);
    const checkedContact = validateContact(shownContact(contact));
    errors = checked.errors;
    contactErrors = checkedContact.errors;
    formError = '';
    if (Object.keys(errors).length > 0 || Object.keys(contactErrors).length > 0) {
      goToErrors();
      return;
    }

    const trap = view.querySelector<HTMLInputElement>('#contact-website');
    const submitButton = view.querySelector<HTMLButtonElement>('button[type="submit"]');
    sending = true;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = labels.sending;
    }
    announce(labels.sending);

    try {
      const response = await fetch(`${endpoint}/responses`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          answers: checked.answers,
          ...(checkedContact.contact && { contact: checkedContact.contact }),
          website: trap?.value ?? '',
        }),
      });
      if (response.status === 201) {
        void response.body?.cancel();
        forget();
        thanks();
        return;
      }
      if (response.status === 404 || response.status === 410) {
        void response.body?.cancel();
        forget();
        status(labels.closed).focus();
        return;
      }
      const body = (await response.json().catch(() => ({}))) as {
        errors?: Record<string, string>;
        error?: string;
      };
      if (response.status === 422 && body.errors) {
        receiveErrors(body.errors);
        return;
      }
      // 429 and the like: the back office says why, in French, ready to show.
      sendFailed(typeof body.error === 'string' ? body.error : labels.sendFailed);
    } catch {
      sendFailed(labels.sendFailed);
    } finally {
      sending = false;
      if (submitButton?.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = labels.submit;
      }
    }
  }

  /** The answers are still on the page: say what went wrong, above the buttons. */
  function sendFailed(message: string) {
    view.querySelector('.survey__send-error')?.remove();
    const alert = el('p', {
      class: 'survey__error survey__send-error',
      role: 'alert',
      text: fr(message),
    });
    view.querySelector('.survey__nav')?.before(alert);
  }

  /**
   * The back office's refusals, each put back where it belongs: a question
   * code on its step, `contact.<field>` on the contact step, and anything else
   * (`answers`, `contact`, a question no step shows) above the buttons of the
   * contact step.
   */
  function receiveErrors(received: Record<string, string>) {
    errors = {};
    contactErrors = {};
    const shown = new Set(sections().flatMap((section) => section.questions.map((q) => q.code)));
    const keys = new Set<string>([...CONTACT_FIELDS, ...CONTACT_FLAGS]);
    const loose: string[] = [];
    for (const [key, message] of Object.entries(received)) {
      const field = key.startsWith('contact.') ? key.slice('contact.'.length) : undefined;
      if (field && keys.has(field)) contactErrors[field as ContactKey] = message;
      else if (shown.has(key)) errors[key] = message;
      else loose.push(message);
    }
    formError = loose.join(' ');
    goToErrors();
  }

  function thanks() {
    const heading = el('h2', { class: 'survey__title', tabindex: '-1', text: labels.thanks.title });
    view.replaceChildren(heading, el('p', { class: 'survey__message', text: labels.thanks.text }));
    heading.focus();
  }

  void load();
}

const isNode = (node: HTMLElement | null): node is HTMLElement => node !== null;
