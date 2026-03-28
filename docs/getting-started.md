# Getting Started

A quick walkthrough of using BaseballScorecard.org.

## Pick a date

The home page shows today's MLB games by default. Use the date picker at the top to navigate to any date in the current season. Past games render from completed data; live games update automatically.

## Pick a game

Each game card shows the two teams, the score (if in progress or final), and a mini scorecard thumbnail. Click any card to open the full scorecard.

## Read the scorecard

The scorecard page shows two full scorecards (away team on top, home team below), each with:

- **Lineup column** on the left: player names, positions, and batting averages
- **Play cells** in the grid: one cell per at-bat, showing pitch sequence, scoring notation, and diamond with base paths
- **Pitcher stats** below each scorecard: IP, H, R, ER, BB, K, pitch counts
- **Game header** at the top: team records, final score, winning/losing/save pitchers, venue, date, and weather

If you are new to scorekeeping notation, start with [How to Read a Scorecard](scoring-notation.md).

## Toggle dark mode

Click the theme toggle in the top navigation bar to switch between light and dark mode. Your preference is saved and persists across visits.

## Dev mode

Developers can add `?dev` to any URL to load fixture data instead of calling the live MLB API. This is useful for testing without depending on live game availability.
