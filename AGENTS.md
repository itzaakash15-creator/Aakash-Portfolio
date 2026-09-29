# Project essentials

- React portfolio built with Vite. Start with `npm install` and `npm run dev`.
- Production verification: `npm run build`.
- Browser checks: start the dev server on port 5173, then run `npm test`. If Chromium is missing, run `npx playwright install chromium`.
- Source content comes from `refined.txt`, `unreifnedd datas.txt`, and `rawdatas.txt`. Do not invent project outcomes or describe engineering prototypes as deployed products.
- Project and timeline data live in `src/data.js`; page components are in `src/App.jsx`; visual tokens and responsive styles are in `src/styles.css`.
- Images were sourced from the portfolio owner's existing public site and are stored in `public/images`.
- GSAP effects must have cleanup and respect reduced motion. Keep keyboard navigation, native dialog focus management, theme persistence, and mobile layouts working.
- New agent configuration belongs under `.devin/`.
