# The Play Cell

Each play cell represents one batter's plate appearance in one inning. It's the fundamental unit of the scorecard.

## Examples

These are rendered using the actual rendering engine from the live site. Same code, same colors, same stroke widths. If the rendering changes, these examples change.

<ClientOnly>
<div class="live-preview">
  <LivePlayCell example="groundout" />
  <LivePlayCell example="strikeout" />
  <LivePlayCell example="walk" />
  <LivePlayCell example="flyout" />
</div>
</ClientOnly>

## Hits

<ClientOnly>
<div class="live-preview">
  <LivePlayCell example="single" />
  <LivePlayCell example="double" />
  <LivePlayCell example="triple" />
  <LivePlayCell example="hr" />
</div>
</ClientOnly>

## Scored Runners

When a runner scores, the diamond is filled with 3 diagonal hatch lines (not a solid color). Home runs get a solid black diamond instead.

<ClientOnly>
<div class="live-preview">
  <LivePlayCell example="scored" />
  <LivePlayCell example="grandsalam" />
</div>
</ClientOnly>

## Other Common Results

<ClientOnly>
<div class="live-preview">
  <LivePlayCell example="hbp" />
  <LivePlayCell example="error" />
  <LivePlayCell example="sacfly" />
  <LivePlayCell example="lineout" />
</div>
</ClientOnly>

## Double Play

<ClientOnly>
<div class="live-preview">
  <LivePlayCell example="dp" />
  <LivePlayCell example="called-k" />
</div>
</ClientOnly>

## Zones

| Zone | Location | Content |
|------|----------|---------|
| Top-left | Out badge | Numbered circle (1, 2, or 3) |
| Top-right | Count + pitches | Balls-strikes and pitch sequence with speed/type |
| Center | Diamond or notation | Base paths for hits, large text for outs |
| Bottom-left | RBI | Small filled diamonds, one per RBI |
| Bottom-right | Strike zone | Mini zone with pitch dots (10 or fewer pitches) |
| Left edge | PH line | Dotted squares, sub before at-bat |
| Right edge | PR line | Dotted squares, sub after at-bat |
| Bottom edge | Pitcher line | Dotted squares with departing pitcher stats |

## Count

Displays as `B-S` (balls-strikes) at the moment the at-bat ended.

**Rules:**
- Balls: count `B` and `*` pitch codes
- Strikes: count `C`, `S`, `F`, `W`, `T`, capped at 2
- Foul balls after 2 strikes do not increment

## Third-Out Notch

A diagonal line in the bottom-right corner of the cell where the third out occurs. Traditional scorekeeping convention that marks where each half-inning ended.
