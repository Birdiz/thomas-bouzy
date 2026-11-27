import type { SurveyContact } from './types.ts';

/**
 * The optional contact, checked as the back office checks it (its
 * `App\Survey\Contact`), with its messages: the browser blocks what the back
 * office would refuse, and the back office decides.
 */

/** The longest each field may be, in characters, as the back office allows. */
export const CONTACT_MAXLENGTHS = { name: 120, organisation: 160, email: 180 } as const;

export type ContactField = keyof typeof CONTACT_MAXLENGTHS;
export type ContactFlag = 'wantsSynthesis' | 'wantsMeeting' | 'contactConsent';
/** What an error can be attached to: a field or a box. The API prefixes it with `contact.`. */
export type ContactKey = ContactField | ContactFlag;

export const CONTACT_FIELDS: readonly ContactField[] = ['name', 'organisation', 'email'];
export const CONTACT_FLAGS: readonly ContactFlag[] = [
  'wantsSynthesis',
  'wantsMeeting',
  'contactConsent',
];

export const NO_CONTACT: SurveyContact = {
  wantsSynthesis: false,
  wantsMeeting: false,
  contactConsent: false,
};

/** Loose on purpose: the back office checks the address properly and says so. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Counted in characters, as the back office counts them, not in UTF-16 units. */
export const lengthOf = (text: string) => [...text].length;

/**
 * What the form shows is what it sends: the name and the organisation are
 * asked only once the consent box is ticked, so unticking it drops them, as a
 * hidden question's answer is dropped.
 */
export function shownContact(contact: SurveyContact): SurveyContact {
  if (contact.contactConsent) return contact;
  const { name: _name, organisation: _organisation, ...rest } = contact;
  return rest;
}

/**
 * Errors keyed by field or box, and the trimmed contact to send, or none when
 * the respondent left nothing.
 *
 * - the synthesis needs an e-mail address, and nothing else: it is not a
 *   consent to be contacted again;
 * - the meeting needs the address and the consent;
 * - the name and the organisation need the consent;
 * - an address with no box ticked is refused: it would be kept for nothing.
 */
export function validateContact(input: SurveyContact): {
  errors: Partial<Record<ContactKey, string>>;
  contact?: SurveyContact;
} {
  const errors: Partial<Record<ContactKey, string>> = {};
  const contact: SurveyContact = {
    wantsSynthesis: input.wantsSynthesis === true,
    wantsMeeting: input.wantsMeeting === true,
    contactConsent: input.contactConsent === true,
  };
  for (const field of CONTACT_FIELDS) {
    const value = input[field]?.trim();
    if (!value) continue;
    const max = CONTACT_MAXLENGTHS[field];
    if (lengthOf(value) > max) errors[field] = `${max} caractères au maximum.`;
    else contact[field] = value;
  }
  if (Object.keys(errors).length > 0) return { errors };

  const { email, wantsSynthesis, wantsMeeting, contactConsent } = contact;
  if (email && !EMAIL.test(email)) {
    errors.email = 'Cette adresse e-mail n’est pas valide.';
  } else if (!email && wantsSynthesis) {
    errors.email = 'Indiquez votre adresse e-mail pour recevoir la synthèse.';
  } else if (!email && wantsMeeting) {
    errors.email = 'Indiquez votre adresse e-mail pour être recontacté.';
  } else if (email && !wantsSynthesis && !wantsMeeting && !contactConsent) {
    errors.email = 'Cochez ce que vous souhaitez recevoir, ou retirez l’adresse.';
  }
  if (!contactConsent) {
    if (wantsMeeting) {
      errors.contactConsent = 'Votre accord est nécessaire pour être recontacté.';
    } else if (contact.name || contact.organisation) {
      errors.contactConsent = 'Votre accord est nécessaire pour conserver ces coordonnées.';
    }
  }
  if (Object.keys(errors).length > 0) return { errors };

  const empty = !email && !contact.name && !contact.organisation;
  const ticked = wantsSynthesis || wantsMeeting || contactConsent;
  return empty && !ticked ? { errors } : { errors, contact };
}
