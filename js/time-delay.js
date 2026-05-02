// Stream delay: when Live mode is on, render the scorecard 45 seconds behind
// real-time so the page doesn't spoil what just happened on the broadcast.
// The cutoff is computed from the local clock on every call, so a 1s
// re-render ticker can trickle each pitch in at its true delayed timestamp
// (no 15s blocky updates). Final games are not delayed.

const DELAY_MS = 45_000;

/** Returns true when delay should be applied — Live toggle on, game in progress. */
function shouldDelay(gumbo) {
  if (!window.isLiveMode?.()) return false;
  const state = gumbo?.gameData?.status?.abstractGameState;
  return state === 'Live';
}

function cutoffISO() {
  return new Date(Date.now() - DELAY_MS).toISOString();
}

function filterPlays(allPlays, cutoff) {
  const out = [];
  for (const play of allPlays) {
    const startTime = play.about?.startTime;
    // Play hasn't started in our delayed view — drop entirely.
    if (startTime && startTime > cutoff) continue;

    // Trim playEvents to those whose pitch has actually arrived in our
    // delayed view. Each event has its own startTime; events without one
    // (rare metadata) are kept.
    const events = play.playEvents || [];
    const visible = events.filter(ev => !ev.startTime || ev.startTime <= cutoff);

    // If the play's startTime says it should be visible but no events have
    // crossed yet, we still keep the play with an empty event list so the
    // active-cell highlight tracks correctly.
    const endTime = play.about?.endTime;
    const playInProgress = !endTime || endTime > cutoff;

    if (!playInProgress) {
      // Play already finished from the viewer's perspective — keep as-is
      // with the trimmed events (should equal full set, but be defensive).
      out.push({ ...play, playEvents: visible });
      continue;
    }

    // Play is still in progress in the delayed view: pitches yes, but the
    // result/outcome must stay hidden until endTime crosses the cutoff.
    // Strip result fields and runner advances, mark not-complete.
    out.push({
      ...play,
      playEvents: visible,
      result: {
        ...(play.result || {}),
        event: '',
        eventType: '',
        description: '',
        rbi: 0,
        awayScore: undefined,
        homeScore: undefined,
        isOut: false,
      },
      runners: [],
      about: {
        ...(play.about || {}),
        isComplete: false,
        isScoringPlay: false,
        hasOut: false,
      },
    });
  }
  return out;
}

function filterLinescore(linescore, allPlays, cutoff) {
  if (!linescore) return linescore;
  let lastInning = 0;
  let lastHalf = 'top';
  for (const play of allPlays) {
    const endTime = play.about?.endTime;
    if (!endTime || endTime > cutoff) continue;
    if (play.about.inning > lastInning ||
        (play.about.inning === lastInning && play.about.halfInning === 'bottom')) {
      lastInning = play.about.inning;
      lastHalf = play.about.halfInning;
    }
  }

  const innings = [];
  if (linescore.innings) {
    for (let i = 0; i < linescore.innings.length; i++) {
      const innNum = i + 1;
      if (innNum > lastInning) break;
      if (innNum === lastInning && lastHalf === 'top') {
        innings.push({ ...linescore.innings[i], home: {} });
      } else {
        innings.push({ ...linescore.innings[i] });
      }
    }
  }

  return {
    ...linescore,
    innings,
    teams: {
      away: { ...linescore.teams?.away },
      home: { ...linescore.teams?.home },
    },
  };
}

/** Mutates gumbo in place. Caller is responsible for deep-copying first if needed. */
export function applyStreamDelay(gumbo) {
  if (!shouldDelay(gumbo)) return gumbo;
  const cutoff = cutoffISO();
  const allPlays = gumbo.liveData?.plays?.allPlays || [];
  const filtered = filterPlays(allPlays, cutoff);
  gumbo.liveData.plays.allPlays = filtered;

  // currentPlay drives the active-cell highlight in the renderer. In our
  // delayed view it should be the last-visible play — whose `result` is
  // already stripped if the play is still in progress past the cutoff.
  gumbo.liveData.plays.currentPlay = filtered.length
    ? filtered[filtered.length - 1]
    : null;

  gumbo.liveData.linescore = filterLinescore(
    gumbo.liveData.linescore,
    gumbo.liveData.plays.allPlays,
    cutoff
  );
  return gumbo;
}
