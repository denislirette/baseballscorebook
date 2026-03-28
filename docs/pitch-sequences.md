# Pitch Sequences

Every pitch thrown during an at-bat is recorded and displayed in the play cell's right column.

## Display format

Each pitch renders as a single line showing the speed and pitch type code:

`94 FF` = 94 mph four-seam fastball
`87 CH` = 87 mph changeup
`81 SL` = 81 mph slider

Speed is on the left, type code on the right. The color of the text tells you what happened on that pitch.

## Pitch call codes

| Code | Meaning | Color |
|------|---------|-------|
| `B` | Ball | Dark (default) |
| `C` | Called strike | Red |
| `S` | Swinging strike | Red |
| `F` | Foul ball | Red |
| `X` | Ball in play | In-play (green in light, green in dark; bold) |
| `D` | In play, double play | In-play (green in light, green in dark; bold) |
| `E` | In play, error | In-play (green in light, green in dark; bold) |
| `T` | Foul tip | Red |
| `H` | Hit by pitch | Dark |
| `M` | Missed bunt attempt | Red |
| `W` | Swinging strike (blocked) | Red |
| `*` | Pitchout / other | Dark |
| `I` | Intentional ball | Dark |
| `L` | Foul line drive | Red |
| `Q` | Swinging strike (blocked) | Red |
| `R` | Foul on bunt attempt | Red |
| `P` | Pitch out | Dark |

In-play pitches (X, D, E) are rendered in bold to visually mark the pitch that ended the at-bat.

Note: `W` is a swinging strike where the catcher blocked the ball but did not catch it cleanly. On strike three, this means the batter may attempt to reach first base (dropped third strike rule). It is NOT a ball or wild pitch -- it is scored as a strike and renders in red.

## Pitch type codes

| Code | Pitch | Code | Pitch |
|------|-------|------|-------|
| FF | Four-seam Fastball | SL | Slider |
| SI | Sinker | ST | Sweeper |
| FC | Cutter | FS | Splitter |
| CH | Changeup | KC | Knuckle Curve |
| CU | Curveball | FO | Forkball |

## Mini strike zone

When 10 or fewer pitches are thrown in an at-bat, a mini strike zone appears at the bottom-right of the cell. Each pitch is plotted as a dot at its actual location relative to the strike zone box.

- Zone horizontal range: +/-1.2 feet from center
- Zone vertical range: 1.0 to 4.2 feet
- The zone box dimensions adjust per batter using the actual strike zone top/bottom from the data
- Faded batter and pitcher silhouettes at 25% opacity show handedness

## ABS challenge badges

ABS is not active in every MLB game. It is used in select games as part of MLB's ongoing evaluation of the technology. When a game does not use ABS, no challenge badges will appear.

When a pitch is challenged through the Automated Ball-Strike (ABS) system, a purple square badge appears next to the pitch:

- **W** = challenge won (call overturned)
- **L** = challenge lost (call stands)
- Badge text is always white for contrast in both light and dark mode

## Pitch arsenal

Each pitcher's season repertoire is shown in the pitcher stats tables. The data comes from the MLB pitchArsenal API and represents their full-season usage:

`FF (48%, 93.6)` = four-seam fastball, used 48% of the time, averaging 93.6 mph

The system always prefers season arsenal data over in-game data. A pitcher's established repertoire doesn't change game to game. If they have a slider, it shows even if they didn't throw one today. At the start of a new season, the system falls back to the previous year's data until enough current-season data is available.
