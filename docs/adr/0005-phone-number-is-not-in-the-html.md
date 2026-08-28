# 5. The phone number is assembled in the browser

- Status: accepted
- Date: 2026-08-28

## Context

The design puts a personal mobile number in plain text into a page whose whole
purpose is to be indexed. Address harvesters scrape rendered HTML at scale;
publishing a number that way reliably produces spam calls, SMS fraud and
recruiter cold-calls from lists that were never opted into.

Removing it entirely costs a real recruiter the fastest route to a conversation.

## Decision

`RevealPhone.astro` ships the number reversed then base64-encoded in a `data-`
attribute. A visitor clicks "Show phone number", ~10 lines of inline script
decode it, and the button is replaced by a focused `tel:` link.

The button starts with the `hidden` attribute and the same script removes it, so
a visitor without JavaScript sees no dead control — email and LinkedIn still
work. (`[hidden] { display: none !important }` is required: `.btn` sets
`display: inline-flex` and would otherwise win.)

The number is also **absent from the `Person` JSON-LD**, which would hand it
straight back to any crawler.

This is friction, not cryptography. A crawler that executes JavaScript can still
read it. The point is that nearly none of them do.

## Consequences

- The number is not in the HTML source of either page — asserted for `/` and
  `/fr/`, in the structured data, and in every content string.
- One click for a human; the tel: link keeps working on mobile.
- No-JavaScript visitors do not get the number from the site at all.
- **The protection stops at the HTML.** Both CV PDFs are public downloads and
  carry the number, the email and the full commune in plain text — the same
  details the page deliberately hides or narrows. A harvester that fetches PDFs
  gets all three. Closing that gap means regenerating the PDFs without them,
  which is a decision about how Thomas wants to be reached, not a code change.
