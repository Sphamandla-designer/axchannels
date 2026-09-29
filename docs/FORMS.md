# Enquiry forms

**Live, pending one check.** The three enquiry forms (Start a Project, Partner
With Us, Just Want To Say Hi) POST JSON to Web3Forms and show a success only
when Web3Forms confirms one.

```
assets/js/home.js
  FORM_ENDPOINT   = "https://api.web3forms.com/submit"
  FORM_ACCESS_KEY = "de412576-cf13-442b-981c-5a69b59c43c4"
```

## The one thing still to check

**Send a real test submission and confirm the email arrives.** The access key
could not be exercised from the environment this was built in — outbound
requests to `api.web3forms.com` are refused by that environment's network
policy. Every branch of the code is tested against a stubbed provider, which
proves the code is right; it does not prove the key is valid or that the
mailbox receives anything.

So, once deployed: open each of the three forms, submit one, and confirm it
lands. If the key is wrong, Web3Forms answers `success: false` and the form
shows its error state rather than a false success, so nothing is lost quietly.

Also confirm **which inbox** Web3Forms delivers to. The site tells visitors
their enquiry reaches `info@axchannels.co.za`.

## What each submission carries

| Field | Value |
|---|---|
| `access_key` | the key above |
| `subject` | the form's own subject, e.g. "Website Project" |
| `form_name` | which form was used: Start a Project / Partner With Us / Just Want To Say Hi |
| `page` | the path the visitor submitted from |
| named fields | First Name, Last Name, Email, Service, Budget Range, and the message |
| `Mailing list opt-in` | `Yes` or `No` — recorded either way, so a declined opt-in is on record |
| `botcheck` / `_gotcha` | the honeypot, checked server-side by the provider |

## Behaviour

- Success appears **only** on a confirmed submission. A non-2xx, a
  `success: false`, or an `errors` array all show the error state, keep the
  visitor's answers in the form, and offer a `mailto:` fallback link.
- A duplicate-submit guard blocks a second POST while one is in flight.
- Invalid fields get `aria-invalid`, cleared as each is corrected, and focus
  moves to the first bad control.
- The mailing-list opt-in is unchecked by default and is never pre-ticked.

## About the key

A Web3Forms access key is a **public submit key**. It can only deliver a form
to the inbox on its own account; it cannot read submissions or reach the
account. It belongs in client-side code. If you are ever handed a private API
key or token, that is a server-side product this static site cannot use.

To rotate it, change `FORM_ACCESS_KEY` and bump the `home.js?v=` cache-buster
on every page (`grep -rn 'home.js?v=' --include=index.html .`).
