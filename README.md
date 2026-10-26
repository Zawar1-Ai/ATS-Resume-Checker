# ATS Resume Checker

A dependency-free, client-side resume checker. Resume and job-description text are processed in the browser.

## Project structure

- `index.html` — page content and accessible form markup
- `assets/css/styles.css` — page styling and responsive layouts
- `assets/js/app.js` — resume analysis, results, and report actions

## Run locally

Open `index.html` in a browser. No build step or package installation is required.

The page loads web fonts from Google Fonts when online; it still works without them.

The score is a transparent checklist estimate, not a real ATS ranking. Keyword matching supports a short list of common equivalents; matched alternatives are identified on the keyword pills. All resume analysis stays in the browser.
