import { describe, expect, it } from 'vitest';
import {
  groupForDisplay,
  NO_CONTACT,
  orderOptions,
  type SurveyQuestion,
  type SurveyStructure,
  shownContact,
  validateAnswers,
  validateContact,
  visibleQuestions,
  visibleSections,
} from '../src/lib/survey/index.ts';

/*
 * The field study's form logic (src/lib/survey), ported from Thomas's own
 * survey engine with its tests, and the back office's two changes to it. The
 * back office runs the same rules again on what it receives (its
 * AnswersValidationTest and ContactTest); the two must agree, so these cases
 * are the contract.
 */

const question = (partial: Partial<SurveyQuestion> & { code: string }): SurveyQuestion => ({
  type: 'single',
  label: partial.code,
  required: false,
  options: [],
  ...partial,
});

/** Section B is only for manufacturers: the branch the real questionnaire takes on the profile. */
const structure = (): SurveyStructure => ({
  slug: 'test',
  title: 'Test',
  status: 'published',
  intro: {},
  sections: [
    {
      code: 'A',
      title: 'Qui répond',
      questions: [
        question({
          code: 'A1',
          required: true,
          options: [
            { value: 'industrie', label: 'Industrie' },
            { value: 'sante', label: 'Santé' },
            { value: 'collectivite', label: 'Collectivité' },
          ],
        }),
        question({
          code: 'A2',
          type: 'multi',
          options: [
            { value: 'tableur', label: 'Tableur' },
            { value: 'erp', label: 'ERP' },
            { value: 'autre', label: 'Autre', revealsText: true, textMaxlength: 10 },
            { value: 'aucun', label: 'Aucun outil', exclusive: true },
          ],
        }),
        question({
          code: 'A3',
          options: [
            { value: 'seul', label: 'Seul' },
            { value: 'autre', label: 'Autre', revealsText: true },
          ],
        }),
      ],
    },
    {
      code: 'B',
      title: 'Production',
      displayIf: { question: 'A1', in: ['industrie'] },
      questions: [
        question({
          code: 'B1',
          type: 'multi',
          maxSelections: 2,
          options: [
            { value: 'o1', label: 'Stock' },
            { value: 'o2', label: 'Planning' },
            { value: 'o3', label: 'Qualité' },
          ],
        }),
      ],
    },
    {
      code: 'C',
      title: 'Votre avis',
      questions: [
        question({
          code: 'C1',
          type: 'scale',
          scaleMin: 1,
          scaleMax: 5,
          allowNoOpinion: true,
        }),
        question({
          code: 'C2',
          type: 'single_with_text',
          options: [
            { value: 'oui', label: 'Oui', revealsText: true, textMaxlength: 20 },
            { value: 'non', label: 'Non' },
          ],
        }),
        question({ code: 'C3', type: 'text', maxlength: 30 }),
        question({ code: 'C4', type: 'boolean' }),
        question({ code: 'C5', displayIf: { question: 'C2', in: ['oui'] } }),
      ],
    },
  ],
});

const validate = (answers: Parameters<typeof validateAnswers>[1]) =>
  validateAnswers(structure(), answers);
const base = { A1: { options: ['sante'] } };

describe('the field study form: which questions show (src/lib/survey)', () => {
  const codes = (answers: Parameters<typeof visibleQuestions>[1]) =>
    visibleQuestions(structure(), answers).map((q) => q.code);

  it('shows a branch only to the profile it is for', () => {
    expect(codes({})).not.toContain('B1');
    expect(codes({ A1: { options: ['industrie'] } })).toContain('B1');
    expect(codes(base)).not.toContain('B1');
  });

  it('drops a section left with no visible question, and keeps the others', () => {
    expect(visibleSections(structure(), base).map((s) => s.code)).toEqual(['A', 'C']);
  });

  it('shows a follow-up question only on the option that opens it', () => {
    expect(codes({ C2: { options: ['oui'] } })).toContain('C5');
    expect(codes({ C2: { options: ['non'] } })).not.toContain('C5');
  });

  it('ignores a condition on a question nobody answered', () => {
    expect(codes({})).not.toContain('C5');
  });

  it('keeps a follow-up with the question it belongs to', () => {
    const groups = groupForDisplay([
      question({ code: 'A2' }),
      question({ code: 'A2b', type: 'boolean', displayGroup: 'A2' }),
      question({ code: 'A3' }),
    ]);
    expect(groups.map((g) => g.map((q) => q.code))).toEqual([['A2', 'A2b'], ['A3']]);
  });
});

describe('the field study form: what it accepts (src/lib/survey)', () => {
  it('asks for the visible required questions', () => {
    expect(validate({}).errors).toEqual({ A1: 'Cette question est obligatoire.' });
  });

  it('accepts a valid set of answers, cleaned', () => {
    const { errors, answers } = validate({
      A1: { options: ['industrie'] },
      B1: { options: ['o1', 'o1', 'o2'] },
      C1: { echelle: 4 },
      C3: { texte: '  un avis  ' },
    });
    expect(errors).toEqual({});
    expect(answers).toEqual({
      A1: { options: ['industrie'] },
      B1: { options: ['o1', 'o2'] },
      C1: { echelle: 4 },
      C3: { texte: 'un avis' },
    });
  });

  it('drops the answers to questions a changed answer has hidden', () => {
    const { errors, answers } = validate({ ...base, B1: { options: ['o1'] } });
    expect(errors).toEqual({});
    expect(answers.B1).toBeUndefined();
  });

  it('refuses more choices than allowed, and an exclusive option combined', () => {
    expect(
      validate({ A1: { options: ['industrie'] }, B1: { options: ['o1', 'o2', 'o3'] } }).errors.B1,
    ).toBe('2 réponses au maximum.');
    expect(validate({ ...base, A2: { options: ['aucun', 'erp'] } }).errors.A2).toContain(
      'ne se combine avec aucune autre réponse',
    );
    expect(validate({ ...base, A2: { options: ['aucun'] } }).errors).toEqual({});
  });

  it('refuses an unknown option, and two answers to a single choice', () => {
    expect(validate({ A1: { options: ['forge'] } }).errors.A1).toContain('Réponse inconnue');
    expect(validate({ A1: { options: ['sante', 'industrie'] } }).errors.A1).toBe(
      'Une seule réponse est possible.',
    );
  });

  it('bounds the scale, and takes « sans avis » only where it is offered', () => {
    expect(validate({ ...base, C1: { echelle: 7 } }).errors.C1).toBe(
      'Choisissez une valeur entre 1 et 5.',
    );
    expect(validate({ ...base, C1: { echelle: 2.5 } }).errors.C1).toBeDefined();
    expect(validate({ ...base, C1: { sansAvis: true } }).answers.C1).toEqual({ sansAvis: true });
  });

  it('bounds free text, and keeps revealed text only on the option that reveals it', () => {
    expect(validate({ ...base, C3: { texte: 'x'.repeat(31) } }).errors.C3).toBe(
      '30 caractères au maximum.',
    );
    expect(validate({ ...base, C2: { options: ['non'], texte: 'glissé' } }).answers.C2).toEqual({
      options: ['non'],
    });
    expect(validate({ ...base, C2: { options: ['oui'], texte: 'y'.repeat(21) } }).errors.C2).toBe(
      '20 caractères au maximum.',
    );
  });

  it('keeps the text an option reveals, on a single or a multi question too (back office)', () => {
    expect(
      validate({ ...base, A3: { options: ['autre'], texte: ' Une SCOP ' } }).answers.A3,
    ).toEqual({ options: ['autre'], texte: 'Une SCOP' });
    expect(
      validate({ ...base, A2: { options: ['erp', 'autre'], texte: 'Un MES' } }).answers.A2,
    ).toEqual({ options: ['erp', 'autre'], texte: 'Un MES' });
    expect(validate({ ...base, A2: { options: ['erp'], texte: 'glissé' } }).answers.A2).toEqual({
      options: ['erp'],
    });
    expect(validate({ ...base, A2: { options: ['autre'], texte: 'x'.repeat(11) } }).errors.A2).toBe(
      '10 caractères au maximum.',
    );
  });

  it('counts a text in characters, as the back office does, not in UTF-16 units', () => {
    expect(validate({ ...base, C2: { options: ['oui'], texte: '🙂'.repeat(20) } }).errors).toEqual(
      {},
    );
  });

  it('keeps the revealed text it was given, trimmed', () => {
    expect(
      validate({ ...base, C2: { options: ['oui'], texte: ' il manque X ' } }).answers.C2,
    ).toEqual({ options: ['oui'], texte: 'il manque X' });
  });

  it('ignores unknown question codes and an unticked box', () => {
    const { answers } = validate({ ...base, ZZ: { options: ['x'] }, C4: { booleen: false } });
    expect(answers.ZZ).toBeUndefined();
    expect(answers.C4).toBeUndefined();
  });

  it('checks only the current step when asked to, while visibility follows every answer', () => {
    const { errors } = validateAnswers(
      structure(),
      { A1: { options: ['industrie'] }, B1: { options: ['o1', 'o2', 'o3'] } },
      new Set(['A1', 'A2']),
    );
    expect(errors).toEqual({});
  });
});

describe('the field study form: the order of options (src/lib/survey)', () => {
  const q = (randomize: boolean) =>
    question({
      code: 'B4',
      type: 'multi',
      randomizeOptions: randomize,
      options: [
        { value: 'a', label: 'a' },
        { value: 'b', label: 'b' },
        { value: 'c', label: 'c' },
        { value: 'autre', label: 'Autre', pinLast: true },
        { value: 'aucun', label: 'Aucun', exclusive: true, pinLast: true },
      ],
    });

  it('keeps the given order unless asked to shuffle', () => {
    expect(orderOptions(q(false), () => 0).map((o) => o.value)).toEqual([
      'a',
      'b',
      'c',
      'autre',
      'aucun',
    ]);
  });

  it('changes the order from one call to the next', () => {
    const sequence = [0.9, 0.1, 0.5, 0.2, 0.7, 0.3];
    let i = 0;
    const order = orderOptions(q(true), () => sequence[i++ % sequence.length] ?? 0).map(
      (o) => o.value,
    );
    expect(order).not.toEqual(['a', 'b', 'c', 'autre', 'aucun']);
    expect(order).toHaveLength(5);
  });

  it('shuffles, and keeps the pinned options last, in their order, without touching the question', () => {
    const original = q(true);
    const order = orderOptions(original, () => 0).map((o) => o.value);
    expect(order.slice(-2)).toEqual(['autre', 'aucun']);
    expect([...order.slice(0, 3)].sort()).toEqual(['a', 'b', 'c']);
    expect(original.options.map((o) => o.value)).toEqual(['a', 'b', 'c', 'autre', 'aucun']);
  });
});

describe('the field study form: the optional contact (src/lib/survey)', () => {
  it('asks nothing of a respondent who leaves nothing', () => {
    expect(validateContact(NO_CONTACT)).toEqual({ errors: {} });
    expect(validateContact({ ...NO_CONTACT, name: '  ' })).toEqual({ errors: {} });
  });

  it('sends the synthesis on an e-mail address alone, which is no consent to be contacted', () => {
    expect(
      validateContact({ ...NO_CONTACT, email: ' camille@example.com ', wantsSynthesis: true }),
    ).toEqual({
      errors: {},
      contact: { ...NO_CONTACT, email: 'camille@example.com', wantsSynthesis: true },
    });
  });

  it('takes a meeting with an e-mail address and the consent', () => {
    const meeting = {
      email: 'camille@example.com',
      name: 'Camille Exemple',
      wantsSynthesis: false,
      wantsMeeting: true,
      contactConsent: true,
    };
    expect(validateContact(meeting)).toEqual({ errors: {}, contact: meeting });
  });

  it('takes a name and an organisation on the consent alone', () => {
    const consent = {
      ...NO_CONTACT,
      name: 'Camille',
      organisation: 'CCI Exemple',
      contactConsent: true,
    };
    expect(validateContact(consent)).toEqual({ errors: {}, contact: consent });
  });

  const refusals: [string, Parameters<typeof validateContact>[0], Record<string, string>][] = [
    [
      'the synthesis without an address',
      { ...NO_CONTACT, wantsSynthesis: true },
      { email: 'Indiquez votre adresse e-mail pour recevoir la synthèse.' },
    ],
    [
      'a meeting without an address nor the consent',
      { ...NO_CONTACT, wantsMeeting: true },
      {
        email: 'Indiquez votre adresse e-mail pour être recontacté.',
        contactConsent: 'Votre accord est nécessaire pour être recontacté.',
      },
    ],
    [
      'a meeting without the consent',
      { ...NO_CONTACT, wantsMeeting: true, email: 'a@example.com' },
      { contactConsent: 'Votre accord est nécessaire pour être recontacté.' },
    ],
    [
      'a name without the consent',
      { ...NO_CONTACT, name: 'Camille', email: 'a@example.com', wantsSynthesis: true },
      { contactConsent: 'Votre accord est nécessaire pour conserver ces coordonnées.' },
    ],
    [
      'an address for nothing',
      { ...NO_CONTACT, email: 'a@example.com' },
      { email: 'Cochez ce que vous souhaitez recevoir, ou retirez l’adresse.' },
    ],
    [
      'an address that is not one',
      { ...NO_CONTACT, email: 'pas une adresse', wantsSynthesis: true },
      { email: 'Cette adresse e-mail n’est pas valide.' },
    ],
    [
      'an organisation too long',
      { ...NO_CONTACT, organisation: 'o'.repeat(161), contactConsent: true },
      { organisation: '160 caractères au maximum.' },
    ],
  ];
  for (const [name, input, errors] of refusals) {
    it(`refuses ${name}, as the back office does`, () => {
      expect(validateContact(input)).toEqual({ errors });
    });
  }

  it('drops the name and the organisation once the consent box that shows them is unticked', () => {
    const typed = { ...NO_CONTACT, email: 'a@example.com', wantsSynthesis: true };
    expect(shownContact({ ...typed, name: 'Camille', organisation: 'CCI' })).toEqual(typed);
    const consented = { ...typed, name: 'Camille', contactConsent: true };
    expect(shownContact(consented)).toEqual(consented);
  });
});
