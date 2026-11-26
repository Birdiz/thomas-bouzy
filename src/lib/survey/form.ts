import type { SurveyFormLabels } from '../../content/types.ts';
import { frenchSpacing } from '../french-spacing.ts';
import { validateContact } from './contact.ts';
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
 * The field study's form (ADR 34), in plain DOM: one section of the
 * questionnaire per step, then an optional contact step. The questionnaire
 * comes from the back office at runtime; nothing here knows its questions.
 *
 * What the browser checks, the back office checks again: this is a comfort,
 * not a guard. Answers to questions a later answer hides are dropped before
 * sending (validateAnswers). Progress survives a reload in sessionStorage.
 */

export interface FormConfig {
  root: HTMLElement;
  /** '' to call the page's own origin. */
  apiOrigin: string;
  slug: string;
  booking: string;
  labels: SurveyFormLabels;
}

type Contact = SurveyContact;
type ContactField = Exclude<keyof Contact, 'wantsMeeting' | 'contactConsent'>;
const CONTACT_FIELDS: readonly ContactField[] = ['name', 'organisation', 'role', 'email', 'phone'];
const CONTACT_INPUT: Record<ContactField, { type: string; autocomplete: string }> = {
  name: { type: 'text', autocomplete: 'name' },
  organisation: { type: 'text', autocomplete: 'organization' },
  role: { type: 'text', autocomplete: 'organization-title' },
  email: { type: 'email', autocomplete: 'email' },
  phone: { type: 'tel', autocomplete: 'tel' },
};
const DEFAULT_TEXT_MAXLENGTH = 1000;

interface Saved {
  answers: Answers;
  contact: Contact;
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

export function mountSurvey(config: FormConfig): void {
  const { root, labels, slug } = config;
  const endpoint = `${config.apiOrigin}/api/surveys/${encodeURIComponent(slug)}`;
  const storageKey = `survey:${slug}`;

  let structure: SurveyStructure | undefined;
  let answers: Answers = {};
  let contact: Contact = { wantsMeeting: false, contactConsent: false };
  let step = 0;
  let errors: Record<string, string> = {};
  let contactErrors: Partial<Record<keyof Contact, string>> = {};
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

  function status(text: string, action?: { label: string; run: () => void }) {
    const heading = el('p', { class: 'survey__message', tabindex: '-1', text });
    view.replaceChildren(
      heading,
      action
        ? el('p', {}, button(action.label, 'btn btn-secondary', action.run))
        : el(
            'p',
            {},
            el('a', {
              href: config.booking,
              target: '_blank',
              rel: 'noopener',
              class: 'btn btn-primary',
              text: labels.book,
            }),
          ),
    );
    return heading;
  }

  function button(text: string, cls: string, onClick: () => void, type = 'button') {
    const node = el('button', { type, class: cls, text });
    node.addEventListener('click', onClick);
    return node;
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

  function render(moveFocus: boolean) {
    const list = sections();
    const isContact = step >= list.length;
    const section = list[step];
    const heading = el('h2', {
      class: 'survey__title',
      tabindex: '-1',
      text: isContact ? labels.contact.title : fr(section?.title),
    });
    const current = String(step + 1);
    const progress = el(
      'div',
      { class: 'survey__progress' },
      el('p', {
        class: 'survey__step',
        text: labels.progress.replace('{current}', current).replace('{total}', String(total())),
      }),
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

    view.replaceChildren(progress, heading, form);
    refreshVisibility();
    if (moveFocus) heading.focus();
  }

  /** Shows or hides the questions of the step that depend on answers given on it. */
  function refreshVisibility() {
    if (!structure) return;
    for (const section of structure.sections) {
      for (const question of section.questions) {
        const node = view.querySelector<HTMLElement>(`[data-question="${question.code}"]`);
        if (!node) continue;
        node.hidden = !(
          conditionMet(section.displayIf, answers) && conditionMet(question.displayIf, answers)
        );
      }
    }
    // A branch taken on this step can add or remove steps after it.
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
    if (errors[code]) clearError(code);
    refreshVisibility();
    save();
  }

  function clearError(code: string) {
    delete errors[code];
    const node = view.querySelector<HTMLElement>(`[data-question="${code}"]`);
    node?.querySelector('.survey__error')?.replaceChildren();
    for (const input of node?.querySelectorAll('[aria-invalid]') ?? []) {
      input.removeAttribute('aria-invalid');
    }
  }

  function describedBy(...ids: (string | false | undefined)[]) {
    return ids.filter(Boolean).join(' ') || undefined;
  }

  function field(question: SurveyQuestion): HTMLElement {
    const id = `q-${question.code}`;
    const helpId = question.help ? `${id}-help` : undefined;
    const errorId = `${id}-error`;
    const error = errors[question.code];
    const marker = question.required
      ? null
      : el('span', { class: 'survey__optional', text: ` (${labels.optional})` });
    const help = helpId
      ? el('p', { id: helpId, class: 'survey__help', text: fr(question.help) })
      : null;
    const errorNode = el('p', { id: errorId, class: 'survey__error' }, error ? fr(error) : '');
    const invalid = error ? 'true' : undefined;
    const answer = answers[question.code] ?? {};
    const wrapper = (inner: HTMLElement) => {
      inner.dataset.question = question.code;
      inner.classList.add('survey__question');
      return inner;
    };

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
            .replace('{count}', String(area.value.length))
            .replace('{max}', String(max));
        };
        count();
        area.addEventListener('input', () => {
          count();
          setAnswer(question.code, area.value.trim() ? { texte: area.value } : undefined);
        });
        return wrapper(
          el(
            'div',
            {},
            el('label', { for: id, class: 'survey__label' }, fr(question.label), marker),
            help,
            area,
            counter,
            errorNode,
          ),
        );
      }

      case 'select': {
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
        select.addEventListener('change', () => {
          setAnswer(question.code, select.value ? { options: [select.value] } : undefined);
        });
        return wrapper(
          el(
            'div',
            {},
            el('label', { for: id, class: 'survey__label' }, fr(question.label), marker),
            help,
            select,
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
        return wrapper(
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
        return wrapper(
          choices(question, {
            legend: el('legend', { class: 'survey__label' }, fr(question.label), marker),
            help,
            errorNode,
            describedBy: describedBy(helpId, errorId),
            invalid,
          }),
        );
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

  /** Radios or checkboxes in a fieldset: single, multi, scale, single_with_text. */
  function choices(
    question: SurveyQuestion,
    parts: {
      legend: HTMLElement;
      help: HTMLElement | null;
      errorNode: HTMLElement;
      describedBy: string | undefined;
      invalid: string | undefined;
    },
  ): HTMLElement {
    const id = `q-${question.code}`;
    const answer = answers[question.code] ?? {};
    const multi = question.type === 'multi';
    const set = el('fieldset', {
      class: 'survey__fieldset',
      'aria-describedby': parts.describedBy,
      'aria-invalid': parts.invalid,
    });
    set.append(parts.legend);
    if (parts.help) set.append(parts.help);
    if (multi && question.maxSelections) {
      set.append(
        el('p', {
          class: 'survey__help',
          text: labels.maxSelections.replace('{max}', String(question.maxSelections)),
        }),
      );
    }

    const list = el('div', {
      class: question.type === 'scale' ? 'survey__scale' : 'survey__choices',
    });
    const inputs: HTMLInputElement[] = [];
    /** The free-text box an option opens (single_with_text), open only while that option is picked. */
    let reveal: HTMLInputElement | undefined;
    let revealOwner: HTMLInputElement | undefined;
    let revealBox: HTMLElement | undefined;
    const syncReveal = () => {
      if (revealBox) revealBox.hidden = !revealOwner?.checked;
    };

    const read = (): Answer | undefined => {
      if (question.type === 'scale') {
        const picked = inputs.find((input) => input.checked);
        if (!picked) return undefined;
        return picked.value === '' ? { sansAvis: true } : { echelle: Number(picked.value) };
      }
      const values = inputs.filter((input) => input.checked).map((input) => input.value);
      if (values.length === 0) return undefined;
      const result: Answer = { options: values };
      const option = question.options.find((candidate) => candidate.value === values[0]);
      if (question.type === 'single_with_text' && option?.revealsText && reveal?.value.trim()) {
        result.texte = reveal.value;
      }
      return result;
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
      });
      if (question.type === 'scale') {
        input.checked =
          choice.value === '' ? answer.sansAvis === true : answer.echelle === Number(choice.value);
      } else {
        input.checked = (answer.options ?? []).includes(choice.value);
      }
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
        const textId = `${inputId}-text`;
        const max = choice.option.textMaxlength ?? DEFAULT_TEXT_MAXLENGTH;
        const input2 = el('input', {
          type: 'text',
          id: textId,
          maxlength: String(max),
          class: 'survey__reveal-input',
        });
        input2.value = answer.texte ?? '';
        input2.addEventListener('input', () => setAnswer(question.code, read()));
        reveal = input2;
        revealOwner = input;
        revealBox = el(
          'div',
          { class: 'survey__reveal' },
          el('label', {
            for: textId,
            class: 'survey__help',
            text: fr(choice.option.textHelp ?? choice.option.label),
          }),
          input2,
        );
        item.append(revealBox);
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
        syncReveal();
        setAnswer(question.code, read());
      });
      list.append(item);
    });
    syncReveal();
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

  function contactStep(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(el('p', { class: 'survey__help', text: labels.contact.intro }));
    for (const key of CONTACT_FIELDS) {
      const id = `contact-${key}`;
      const errorId = `${id}-error`;
      const input = el('input', {
        id,
        name: key,
        type: CONTACT_INPUT[key].type,
        autocomplete: CONTACT_INPUT[key].autocomplete,
        maxlength: '200',
        'aria-describedby': errorId,
        'aria-invalid': contactErrors[key] ? 'true' : undefined,
      });
      input.value = contact[key] ?? '';
      input.addEventListener('input', () => {
        contact = { ...contact, [key]: input.value };
        save();
      });
      fragment.append(
        el(
          'div',
          { class: 'survey__question', 'data-contact': key },
          el('label', { for: id, class: 'survey__label', text: labels.contact[key] }),
          input,
          el('p', { id: errorId, class: 'survey__error', text: contactErrors[key] }),
        ),
      );
    }

    for (const key of ['wantsMeeting', 'contactConsent'] as const) {
      const id = `contact-${key}`;
      const errorId = `${id}-error`;
      const noticeId = key === 'contactConsent' ? 'contact-notice' : undefined;
      const box = el('input', {
        type: 'checkbox',
        id,
        name: key,
        'aria-describedby': describedBy(noticeId, errorId),
        'aria-invalid': contactErrors[key] ? 'true' : undefined,
      });
      box.checked = contact[key];
      box.addEventListener('change', () => {
        contact = { ...contact, [key]: box.checked };
        save();
      });
      fragment.append(
        el(
          'div',
          { class: 'survey__question', 'data-contact': key },
          el(
            'label',
            { class: 'survey__choice', for: id },
            box,
            el('span', {
              text: key === 'wantsMeeting' ? labels.contact.wantsMeeting : labels.contact.consent,
            }),
          ),
          noticeId
            ? el('p', { id: noticeId, class: 'survey__help', text: labels.contact.notice })
            : null,
          el('p', { id: errorId, class: 'survey__error', text: contactErrors[key] }),
        ),
      );
    }

    // A field no person sees or reaches: a bot that fills it is refused.
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

  function showErrors() {
    render(false);
    announce(labels.fixErrors);
    const first = view.querySelector<HTMLElement>('[aria-invalid="true"]');
    const target =
      first?.tagName === 'FIELDSET' ? first.querySelector<HTMLElement>('input') : first;
    target?.focus();
  }

  function next() {
    if (!structure) return;
    const result = validateAnswers(structure, answers, stepCodes(step));
    errors = result.errors;
    if (Object.keys(errors).length > 0) {
      showErrors();
      return;
    }
    step = Math.min(step + 1, total() - 1);
    save();
    render(true);
  }

  function back() {
    step = Math.max(step - 1, 0);
    save();
    render(true);
  }

  /** The first step holding one of these errors, or the contact step. */
  function stepOf(codes: string[]): number {
    const list = sections();
    const index = list.findIndex((section) =>
      section.questions.some((question) => codes.includes(question.code)),
    );
    return index === -1 ? list.length : index;
  }

  let sending = false;

  async function submit() {
    if (!structure || sending) return;
    const checked = validateAnswers(structure, answers);
    const checkedContact = validateContact(contact);
    errors = checked.errors;
    contactErrors = checkedContact.errors;
    if (Object.keys(errors).length > 0 || Object.keys(contactErrors).length > 0) {
      step = Object.keys(errors).length > 0 ? stepOf(Object.keys(errors)) : sections().length;
      showErrors();
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
      if (response.status !== 422) void response.body?.cancel();
      if (response.status === 201 || response.ok) {
        forget();
        thanks();
        return;
      }
      if (response.status === 404 || response.status === 410) {
        forget();
        status(labels.closed).focus();
        return;
      }
      if (response.status === 422) {
        const body = (await response.json().catch(() => ({}))) as {
          errors?: Record<string, string>;
        };
        receiveErrors(body.errors ?? {});
        return;
      }
      throw new Error(String(response.status));
    } catch {
      announce(labels.unreachable);
      const nav = view.querySelector('.survey__nav');
      const message = el('p', { class: 'survey__error', role: 'alert', text: labels.unreachable });
      view.querySelector('.survey__form > .survey__error[role="alert"]')?.remove();
      nav?.before(message);
    } finally {
      sending = false;
      if (submitButton?.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = labels.submit;
      }
    }
  }

  /** Errors from the back office: by question code, or by contact field (`email` or `contact.email`). */
  function receiveErrors(received: Record<string, string>) {
    errors = {};
    contactErrors = {};
    for (const [key, message] of Object.entries(received)) {
      const field = key.replace(/^contact\./, '');
      if ((CONTACT_FIELDS as readonly string[]).includes(field) || field === 'contactConsent') {
        contactErrors[field as keyof Contact] = message;
      } else {
        errors[key] = message;
      }
    }
    step = Object.keys(errors).length > 0 ? stepOf(Object.keys(errors)) : sections().length;
    showErrors();
  }

  function thanks() {
    const heading = el('h2', { class: 'survey__title', tabindex: '-1', text: labels.thanks.title });
    view.replaceChildren(
      heading,
      el('p', { class: 'survey__help', text: labels.thanks.text }),
      el(
        'p',
        {},
        el('a', {
          href: config.booking,
          target: '_blank',
          rel: 'noopener',
          class: 'btn btn-primary',
          text: labels.thanks.booking,
        }),
      ),
    );
    heading.focus();
  }

  void load();
}
