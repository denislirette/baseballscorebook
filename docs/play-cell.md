# The Play Cell

Each play cell represents one batter's plate appearance in one inning. It's the fundamental unit of the scorecard.

## Examples

These are rendered using the actual rendering engine. Same code, same colors, same stroke widths as the live site.

<ClientOnly><div class="live-preview">
  <LivePlayCell notation="G6-3" :out="1" label="Groundout" description="Ground ball to SS, thrown to 1B"
    :pitches="[{call:'S',speed:94,type:'FF'},{call:'B',speed:87,type:'CH'},{call:'F',speed:91,type:'SL'},{call:'X',speed:96,type:'FF'}]"/>
  <LivePlayCell notation="K" :out="2" label="Strikeout" description="Swinging strikeout"
    :pitches="[{call:'B',speed:95,type:'FF'},{call:'C',speed:88,type:'CH'},{call:'S',speed:95,type:'FF'},{call:'S',speed:82,type:'CU'}]"/>
  <LivePlayCell notation="BB" label="Walk" description="Base on balls (4 balls)"
    :pitches="[{call:'B',speed:93,type:'FF'},{call:'C',speed:87,type:'CH'},{call:'B',speed:94,type:'FF'},{call:'B',speed:92,type:'FF'},{call:'B',speed:88,type:'CH'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'}],currentBase:'1B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="F8" :out="1" label="Fly Out" description="Fly ball caught by CF"
    :pitches="[{call:'C',speed:94,type:'FF'},{call:'B',speed:80,type:'CU'},{call:'X',speed:93,type:'FF'}]"/>
</div></ClientOnly>

## Hits

<ClientOnly><div class="live-preview">
  <LivePlayCell notation="1B" label="Single" description="1 hash mark on HP-1B path"
    :pitches="[{call:'X',speed:93,type:'FF'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'}],currentBase:'1B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="2B" :rbi="1" label="Double" description="2 hash marks, path to 2B"
    :pitches="[{call:'C',speed:94,type:'FF'},{call:'X',speed:89,type:'SL'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'},{from:'1B',to:'2B'}],currentBase:'2B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="3B" :rbi="2" label="Triple" description="3 hash marks, path to 3B"
    :pitches="[{call:'X',speed:93,type:'FF'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'},{from:'1B',to:'2B'},{from:'2B',to:'3B'}],currentBase:'3B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="HR" :rbi="2" label="Home Run" description="Solid filled diamond"
    :pitches="[{call:'B',speed:94,type:'FF'},{call:'S',speed:87,type:'SL'},{call:'X',speed:88,type:'CH'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'},{from:'1B',to:'2B'},{from:'2B',to:'3B'},{from:'3B',to:'HP'}],currentBase:null,scored:true,isOut:false}]"/>
</div></ClientOnly>

## Scored Runners

<ClientOnly><div class="live-preview">
  <LivePlayCell notation="1B" label="Scored (not HR)" description="3 diagonal hatch lines inside the diamond"
    :pitches="[{call:'B',speed:91,type:'SI'},{call:'F',speed:93,type:'FF'},{call:'X',speed:87,type:'CH'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'},{from:'1B',to:'2B'},{from:'2B',to:'3B'},{from:'3B',to:'HP'}],currentBase:null,scored:true,isOut:false}]"
    :rbi="1"/>
  <LivePlayCell notation="HR" :rbi="4" label="Grand Slam" description="Solid diamond, 4 RBI"
    :pitches="[{call:'B',speed:94,type:'FF'},{call:'S',speed:87,type:'SL'},{call:'B',speed:95,type:'FF'},{call:'X',speed:92,type:'FF'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'},{from:'1B',to:'2B'},{from:'2B',to:'3B'},{from:'3B',to:'HP'}],currentBase:null,scored:true,isOut:false}]"/>
</div></ClientOnly>

## Other Common Results

<ClientOnly><div class="live-preview">
  <LivePlayCell notation="HBP" label="Hit By Pitch" description="Batter awarded first base"
    :pitches="[{call:'B',speed:93,type:'FF'},{call:'H',speed:88,type:'SL'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'}],currentBase:'1B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="E6" label="Error" description="Batter reaches on fielding mistake"
    :pitches="[{call:'S',speed:94,type:'FF'},{call:'X',speed:89,type:'SL'}]"
    :runners="[{playerId:1,segments:[{from:'HP',to:'1B'}],currentBase:'1B',scored:false,isOut:false}]"/>
  <LivePlayCell notation="SF8" :out="1" :rbi="1" label="Sac Fly" description="Fly out that scores a runner"
    :pitches="[{call:'B',speed:92,type:'FF'},{call:'X',speed:88,type:'CH'}]"/>
  <LivePlayCell notation="L7" :out="2" label="Line Out" description="Line drive caught by LF"
    :pitches="[{call:'X',speed:91,type:'SI'}]"/>
</div></ClientOnly>

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
