# Test FDE portfolio

Static site: HTML, CSS, vanilla JS. No build step, no backend, no secrets.

## Run locally
    python3 -m http.server 8000   # then open http://localhost:8000

## Edit
- `js/main.js` → `CONFIG`: LinkedIn URL, availability text, email.
- `index.html`: replace tags/levels in Capabilities and Stack with what you can defend.
- `js/main.js` → `CASES`: the three case studies open with "To complete" fields. Fill them with real facts only.
- Add `assets/images/og.png` (1200x630) and a photo in the About section.

## Deploy
- GitHub Pages: push to a repo, Settings → Pages → deploy from branch `main`, root.
- Netlify: drag the folder into app.netlify.com/drop.

## Contact form
No form service is connected: the form opens the visitor's email client (mailto). To send directly, connect Formspree/Netlify Forms and update the submit handler.