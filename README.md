# Palm Springs by Nakheel — Prop-AI lead page

Mobile-first landing page for Prop-AI's Palm Springs campaign. Content follows the "Palm Springs: Our 3 Picks" report (Nov 2026). Offer: the full report, sent on WhatsApp.

Live (GitHub Pages): https://ryanpagador-bit.github.io/palm-springs-landing/

## Files

| Path | What it is |
|---|---|
| `index.html` | The live page. **Generated** by `src/build.py` — don't edit it directly. |
| `src/body.html` | Page markup with placeholders (`@IMG:name@`, `@LOGO@`, `@VID@`, `@OPEN@`, `@WA@`). Edit copy here. |
| `src/build.py` | Builds `index.html` and the one-file copy. Holds `GTM_ID`, page title and meta description. Python 3, no packages. |
| `assets/css/styles.css` | All styles. Brand tokens in `:root`. |
| `assets/js/form.js` | Lead form, validation, webhook submit, WhatsApp links, GTM dataLayer events. Config at the top. |
| `assets/img/`, `assets/video/` | Nakheel renders, masterplan map, Prop-AI logo, hero video loops. |
| `dist/palm-springs-landing-v3-standalone.html` | Same page as one file (~8 MB) with everything inlined, for sharing. |

## Rebuild

```
python3 src/build.py
```

Then open `index.html` to check, commit and push to `main`.

## Setup before ads go live

1. **GTM** — set `GTM_ID` in `src/build.py` to the campaign container (e.g. `GTM-ABC1234`) and rebuild. The snippet goes into `<head>` and right after `<body>` on both builds. With the placeholder `GTM-XXXXXXX`, no GTM code is added.
2. **Form webhook** — set `SUBMIT_ENDPOINT` in `assets/js/form.js`. It POSTs JSON: `name, cc, phone, unit, budget, purpose, handover_payment, consent, project, offer, source` (`source` = full page URL incl. UTMs). Non-2xx responses show an error and keep the form open. Empty = demo mode (nothing is sent).
3. **WhatsApp** — set `WHATSAPP_NUMBER` in `assets/js/form.js` and replace `9715XXXXXXXX` in `src/build.py`, then rebuild.
4. **Trakheesi permit** — replace `XXXX` in the footer in `src/body.html`. ORN 36372 is in.
5. **Privacy policy** — `#privacy` links need the real policy URL.
6. **Domain** — point the Prop-AI subdomain at the site.

## GTM events (dataLayer)

| Event | When | Fields |
|---|---|---|
| `form_open` | Any "Get the full report" / "See why" button opens the form | `form_name` |
| `generate_lead` | Form submitted and the webhook returned 2xx | `form_name, project, unit, budget, purpose, handover_payment` |

No name or phone number goes into the dataLayer. In GTM, fire the Meta Pixel `Lead` and GA4 `generate_lead` tags from a Custom Event trigger on `generate_lead`. The page no longer calls `fbq` directly, so there's no double counting.

## Content rules

Prices, areas and payment figures come from Nakheel and the Nov 2026 report — don't add or round numbers. Keep the "subject to Nakheel confirmation", "artist's impression", "not investment advice", ORN and Trakheesi lines. Use only Nakheel-approved renders. Check copy changes with marketing.
