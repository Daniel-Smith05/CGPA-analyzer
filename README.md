# Student Result & CGPA Analytics Portal

A responsive, single-page academic result management and 5.00-scale CGPA analytics web portal built strictly with **HTML5, Tailwind CSS (CDN), Vanilla ES6+ JavaScript, and Chart.js (CDN)** — no frontend framework required.

## Core Architecture

- **`/index.html`**: Semantic single-page layout containing the fixed sidebar, top header, 4 summary metric cards, academic-year grouped session cards, interactive course editor, Chart.js analytics canvases, printable transcript preview, Student Profile page, and print preview modal.
- **`/src/styles.css`**: Print stylesheet (`@media print`), reduced-motion accessibility rules, and tabular numeric styling.
- **`/src/calculator.js`**: Pure, unit-tested business logic for:
  - 5.00 grading scale (`A=5, B=4, C=3, D=2, E=1, F=0`)
  - Consecutive academic year formatting & validation (`YYYY/(YYYY+1)` e.g. `2023/2024`, `2024/2025`)
  - Deterministic Entry Year ↔ Level ↔ Academic Year mapping (`100 Level`–`600 Level`) and session realignment
  - Course validation (`1–6` integer credit units, non-empty code & title, grade `A–F`)
  - Semester GPA, multi-year Year GPA, Cumulative CGPA, Academic Standing classification, and CSV export
- **`/src/unnCatalog.js`**: University of Nigeria, Nsukka (UNN) catalog containing 17 official faculties, cascading departments, degree prefixes, General Studies (`GSP`) + departmental course quick-add options, and optional demonstration profiles.
- **`/src/storage.js`**: Safe browser `localStorage` persistence (`cgpa_portal_state_v3`) starting completely bare (`sessions: []`, blank student profile) until data is entered or a demo profile is loaded.
- **`/src/charts.js`**: Chart.js Bar/Doughnut grade distribution and Semester GPA trend line renderers synced with Light/Dark themes.
- **`/src/main.js`**: Vanilla ES6+ DOM controller, event delegation, client-side avatar resizing (`200×200` JPEG stored in `localStorage`), and live state synchronization.

## Grading & Standing Rules (5.00 Scale)

- **Semester GPA**: `Σ(Credit Units × Grade Point) / Σ(Credit Units)`
- **Cumulative CGPA**: Total Quality Points across all valid courses in all semesters divided by Total Cumulative Units.
- **Academic Standing Thresholds**:
  - `4.50 – 5.00`: First Class
  - `3.50 – 4.49`: Second Class Upper
  - `2.40 – 3.49`: Second Class Lower
  - `1.50 – 2.39`: Good Standing (3rd Class)
  - `1.00 – 1.49`: Academic Warning
  - `< 1.00`: Probation
  - `0` evaluated units: Not Evaluated
- **Registration Number Format**: `YYYY/XXXXXX` (4-digit year, `/`, 6 digits — e.g. `2023/256558`).

## Local Commands

```bash
# Start local development server (port 3000)
npm run dev

# Run unit tests
npx tsx --test src/calculator.test.ts

# Type-check & build production bundle
npm run lint
npm run build
```

## GitHub Pages Deployment

The repository includes `.github/workflows/deploy.yml` for automated deployment to GitHub Pages:

1. Push the repository to GitHub with `main` as the default branch.
2. In GitHub **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Every push to `main` (or manual trigger via **Actions → Deploy to GitHub Pages → Run workflow**) builds `dist/` with Bun + Vite using the automatic Pages `base_path` and deploys directly.
