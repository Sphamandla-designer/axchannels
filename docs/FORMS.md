# Taking the enquiry forms live

**Current state: awaiting activation.** No form provider is configured, so the
three enquiry drawers (Discuss A Project, Partner With Us, Just Want To Say Hi)
still hand off to the visitor's email application. That works, but it depends on
the visitor having a mail app set up and pressing send there, so it is not
reliable lead capture. Nothing is recorded on the site's side.

The integration is built and waiting for one value.

## What to do

1. Create a free account with **one** of these providers:

   - **Formspree** — <https://formspree.io>. Create a form; it gives you a
     submit URL shaped like `https://formspree.io/f/abcdwxyz`.
   - **Web3Forms** — <https://web3forms.com>. Enter the address that should
     receive enquiries; it emails you an access key. The submit URL is always
     `https://api.web3forms.com/submit`.

2. Open `assets/js/home.js` and find the `FORM_ENDPOINT` block (search for
   `lead capture: submit`). Fill in:

   ```js
   // Formspree
   var FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   var FORM_ACCESS_KEY = "";

   // or Web3Forms
   var FORM_ENDPOINT = "https://api.web3forms.com/submit";
   var FORM_ACCESS_KEY = "your-access-key";
   ```

3. Bump the cache-buster on `home.js` in every page that loads it, so returning
   visitors get the new script:

   ```
   grep -rn 'home.js?v=' --include=index.html .
   ```

   Raise the `v=` number in each of those lines by one.

4. Add `axchannels.co.za` (and `www.axchannels.co.za`) to the provider's allowed
   domains, if it offers that setting, so nobody else can post to your form.

5. Commit and push. The forms go live on deploy — nothing else changes.

## What happens after that

- Submission POSTs JSON to the provider and waits for its answer.
- A success message appears **only** when the provider confirms the submission.
  A non-2xx response, a `success: false`, or an `errors` array all show a
  failure message with the email address as a fallback, and the visitor's
  answers are left in the form so nothing is lost.
- The fine print under each form switches automatically from "Opens in your
  email app…" to the live wording. Both versions live in the markup
  (`data-fine-live`), so the page never describes behaviour it does not have.
- A duplicate-submit guard blocks a second POST while one is in flight.
- A hidden honeypot field (`_gotcha`, also sent as `botcheck`) is passed to the
  provider, which is the field both providers use to reject bots server-side.

## Notes on keys and secrets

A Formspree form ID and a Web3Forms access key are **public submit keys**. They
are designed to sit in client-side code and they cannot read your submissions or
your account. No private API key, token or password belongs in this repository —
if a provider gives you one of those, it means you are using a server-side API
that this static site cannot call, and you need a different product from them.

## Where submissions land

Both providers email each submission to the address on the account and keep a
copy in their dashboard. **Confirm which address that is before launch** — the
site tells visitors that enquiries reach `info@axchannels.co.za`.
