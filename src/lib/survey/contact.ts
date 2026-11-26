import type { SurveyContact } from './types.ts';

export const CONTACT_MAXLENGTH = 200;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Whether the respondent left anything to be called back on. */
export function hasContact(contact: SurveyContact): boolean {
  return (
    contact.wantsMeeting ||
    [contact.name, contact.organisation, contact.role, contact.email, contact.phone].some((field) =>
      Boolean(field?.trim()),
    )
  );
}

/**
 * The contact block is optional, but once someone fills it in, it has to be
 * usable and consented to: a way to reach them, and their explicit yes.
 * Returns French messages keyed by field, and the trimmed contact, or none.
 */
export function validateContact(contact: SurveyContact): {
  errors: Partial<Record<keyof SurveyContact, string>>;
  contact?: SurveyContact;
} {
  if (!hasContact(contact)) return { errors: {} };
  const clean: SurveyContact = {
    wantsMeeting: contact.wantsMeeting,
    contactConsent: contact.contactConsent,
  };
  const errors: Partial<Record<keyof SurveyContact, string>> = {};
  for (const key of ['name', 'organisation', 'role', 'email', 'phone'] as const) {
    const value = contact[key]?.trim();
    if (!value) continue;
    if (value.length > CONTACT_MAXLENGTH)
      errors[key] = `${CONTACT_MAXLENGTH} caractères au maximum.`;
    else clean[key] = value;
  }
  if (clean.email && !EMAIL.test(clean.email))
    errors.email = 'Cette adresse e-mail semble incomplète.';
  if (!clean.email && !clean.phone && !errors.email && !errors.phone) {
    errors.email = 'Indiquez un e-mail ou un téléphone pour que je puisse vous recontacter.';
  }
  if (!contact.contactConsent) {
    errors.contactConsent = 'Cochez cette case pour que je puisse vous recontacter.';
  }
  return Object.keys(errors).length > 0 ? { errors } : { errors, contact: clean };
}
