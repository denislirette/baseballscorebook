# QA Pipeline: How It Works

## Local Development Flow

```
You write code
      |
      v
npm run qa  (or npm test)
      |
      +---> 1. ESLint ---------> Scans all .js files
      |         |                   - Unused variables
      |         |                   - Browser compat (eslint-plugin-compat)
      |         |                   - Code quality (===, const, etc.)
      |         |
      |         +-- FAIL? --> Fix code, re-run
      |
      +---> 2. Spellcheck -----> Scans .html .js .css .md files
      |         |                   - Checks against a standard English dictionary
      |         |                   - Also checks against cspell-baseball.txt,
      |         |                     which has baseball terms, player names,
      |         |                     and project-specific words
      |         |
      |         +-- FAIL? --> Fix the typo, or add the word
      |                       to cspell-baseball.txt if it's legit
      |
      +---> 3. Accessibility --> Starts the Vite dev server automatically
      |         |                   |
      |         |                   v
      |         |                Playwright opens 10 pages
      |         |                in 3 browsers (Chromium, Firefox, WebKit)
      |         |                   |
      |         |                   v
      |         |                axe-core scans each page for
      |         |                WCAG 2.2 AA violations:
      |         |                contrast, ARIA, headings, labels, focus, etc.
      |         |                   |
      |         |                The game page waits for the SVG scorecard
      |         |                to fully render from the ?dev fixture data
      |         |                before scanning
      |         |
      |         +-- FAIL? --> Fix the a11y violation
      |
      +---> 4. Visual Regression --> Same Vite server, still running
                |                       |
                |                       v
                |                    Playwright takes screenshots of 10 pages
                |                    at 3 viewport widths (1440, 768, 375px)
                |                    across 3 browsers = 90 screenshots total
                |                       |
                |                       v
                |                    Each screenshot gets compared pixel by pixel
                |                    against the golden baselines stored in
                |                    tests/screenshots/ (0.1% diff threshold)
                |                       |
                |                       +-- MATCH --> PASS
                |                       +-- DIFF  --> FAIL + generates a diff image
                |
                +-- FAIL? --> Was the change intentional?
                                YES --> npm run test:visual:update
                                        (regenerates goldens, commit them)
                                NO  --> Fix your CSS or layout
```

## Pull Request Flow (GitHub Actions)

```
You push your branch and open a PR to master
                |
                v
    GitHub Actions picks up .github/workflows/qa.yml
                |
                v
    A fresh ubuntu runner spins up
                |
    +-----------+-----------+
    |                       |
    v                       v
  npm ci              Install Playwright
  (dependencies)      browsers and system deps
                |
                v
    The same 4 checks run in order:
    lint --> spellcheck --> a11y --> visual
                |
        +-------+-------+
        |               |
        v               v
    ALL PASS         ANY FAIL
        |               |
        v               v
    Green check      Red X on your PR
    PR can merge     PR is blocked
                        |
                        v
                     Artifacts get uploaded:
                     - playwright-report/  (full HTML report)
                     - test-results/       (diff images)
                     You can download these from the Actions tab
```

## File Relationships

```
package.json
  |-- "lint"            --> eslint.config.js -----------> scans js/*.js
  |-- "spellcheck"      --> cspell.json ----------------> cspell-baseball.txt
  |-- "test:a11y"       --> playwright.config.js -------> tests/a11y/all-pages.spec.js
  |-- "test:visual"     --> playwright.config.js -------> tests/visual/all-pages.spec.js
  |-- "test:visual:update"  (same thing, with --update-snapshots)
  |-- "qa"              --> runs all 4 above in order
  |-- "test"            --> alias for "qa"
  |
  +-- browserslist: ["last 2 Chrome/Firefox/Safari/Edge versions"]
         |
         used by eslint-plugin-compat to flag unsupported JS APIs

playwright.config.js
  |-- webServer: starts "npx vite --port 5173" automatically
  |-- projects: [chromium, firefox, webkit]
  |-- snapshotPathTemplate: tests/screenshots/{browser}/{name}.png
  |-- expect.toHaveScreenshot.maxDiffPixelRatio: 0.001

tests/
  |-- a11y/all-pages.spec.js     10 pages x 3 browsers = 30 tests
  |-- visual/all-pages.spec.js   10 pages x 3 viewports x 3 browsers = 90 tests
  |-- screenshots/
        |-- chromium/   (30 golden .png baselines)
        |-- firefox/    (30 golden .png baselines)
        |-- webkit/     (30 golden .png baselines)

.github/workflows/qa.yml          Runs on every PR to master
```

## What Each Check Catches

```
Check             Catches                              Example
-----------       --------------------------------     ---------------------------
ESLint            Unused code, bad patterns,           Using .includes() which
                  browser compat issues                Safari 12 doesn't support

Spellcheck        Typos in any content file            misspelled words in HTML,
                                                       JS, CSS, or Markdown

Accessibility     WCAG 2.2 AA violations               Low contrast text (needs
                  on all pages, including the          4.5:1 ratio), missing
                  SVG scorecard, in 3 browsers         labels, broken focus order

Visual            Any pixel-level change to any        Moving an element 2px,
Regression        page at any viewport in any          changing a font size,
                  browser                              altering a color
```
