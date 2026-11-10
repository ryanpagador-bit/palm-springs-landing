# Palm Springs by Nakheel — Prop-AI lead page (V3)

Mobile-first landing page for the Palm Springs pre-launch Meta ads campaign. Offer: **"Get Prop-AI's Palm Springs analysis: which unit we'd buy and why."** Copy and figures follow the Palm Springs marketing brief (10 Nov 2026).

## What's in here

| Path | What it is |
|---|---|
| `index.html` | The page. Loads its CSS, JS, images and video from `assets/`. Use this for hosting. |
| `dist/palm-springs-landing-v3-standalone.html` | The same page as one file with every image and the video built in (~8 MB). For sharing or previewing by email/WhatsApp. |
| `assets/css/styles.css` | All styles (Prop-AI brand: #2964D9, #5096F2, #0F1B26, #FAFAFA; Montserrat + Inter). |
| `assets/js/form.js` | 5-field lead form (bottom sheet on mobile), validation, success state, WhatsApp links. |
| `assets/img/` | Nakheel-approved renders + Prop-AI logo. |
| `assets/video/` | Hero loop: 1280 px landscape (desktop) and 540 px portrait (mobile), plus poster image. |
| `src/body.html` | Page markup with placeholders (`@IMG:…@`, `@LOGO@`, `@VID@` …). Edit this, not `index.html`. |
| `src/build.py` | Rebuilds `index.html` and the standalone file from `src/` + `assets/`. |

## Editing

1. Change text in `src/body.html`, styles in `assets/css/styles.css`, form behaviour in `assets/js/form.js`.
2. Run `python3 src/build.py` (Python 3, no packages needed).
3. Open `index.html` in a browser to check.

## Before going live

- [ ] **Form endpoint:** set `SUBMIT_ENDPOINT` at the top of `assets/js/form.js` (Respond.io / CRM webhook). Empty = demo mode, nothing is sent.
- [ ] **WhatsApp number:** set `WHATSAPP_NUMBER` in `assets/js/form.js` (digits only, country code first) and replace `9715XXXXXXXX` in `src/build.py`, then rebuild.
- [ ] **Trakheesi permit + ORN:** replace the `XXXX` placeholders in the footer.
- [ ] **Hero video:** cut from Nakheel's Townhouses product film with the top cropped (removes their watermark) — get Nakheel's OK before use.
- [ ] **Prices:** confirm with Nakheel; every price line says "subject to Nakheel confirmation".
- [ ] **Meta Pixel / analytics:** not added yet.
- [ ] Open items in copy: hero line "from day one of the masterplan"; "382 ha" label.

## Hosting

Any static host works (GitHub Pages, Netlify, Vercel, S3). This repo is private — GitHub Pages on a private repo needs a paid GitHub plan; otherwise deploy the folder to Netlify/Vercel.
