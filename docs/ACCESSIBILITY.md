# Accessibility

Everyone should be able to use this site. Whether you rely on a screen reader, navigate by keyboard, zoom in to 400%, or are on a slow connection at the ballpark, the experience should work.

Scorecards are inherently visual, and making dense SVG grids truly accessible is hard. But it matters, and it's actively being worked on.

## Target

The site targets [WCAG 2.2 Level AA](https://www.w3.org/WAI/standards-guidelines/wcag/). In practice:

- Keyboard navigation works everywhere: date picker, game cards, theme toggle
- Color contrast meets AA in both light and dark themes
- Color alone never carries meaning. Pitch types, outs, and play results always have text alongside visual indicators
- Plain HTML, CSS, and vanilla JS. No heavy framework. Loads fast and works on anything with a browser

## What works well

- **Date picker**: full ARIA grid pattern with arrow keys, Home/End, Page Up/Down, Escape to close
- **Theme toggle**: label updates to describe the target state ("Switch to dark mode" / "Switch to light mode")
- **Mobile nav**: hamburger button announces expanded/collapsed state
- **Focus indicators**: visible outlines on all interactive elements
- **Keyboard shortcuts**: D for dark mode, L for light mode, arrow keys for date navigation
- **Thumbnail SVGs**: have `role="img"` and `aria-label`

## Known issues

All known accessibility gaps are tracked as GitHub issues with the `accessibility` label:

[View open accessibility issues](https://github.com/denislirette/baseballscorecard/issues?q=is%3Aissue+label%3Aaccessibility)

If you find something that doesn't work, [open an issue](https://github.com/denislirette/baseballscorecard/issues/new) and mention what assistive technology you're using and what went wrong. Even a quick "this didn't work" is useful.

## External content

External links (MLB data, GitHub) are outside the project's control and may not meet the same bar.
