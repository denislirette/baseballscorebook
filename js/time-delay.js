// Stream delay: when Live mode is on, render the scorecard 60 seconds behind
// real-time so the page doesn't spoil what just happened on the broadcast.
// Filters are applied at fetch time only — the next auto-refresh advances the
// cutoff window. Final games are not delayed.

const DELAY_MS = 60_000;

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
  return allPlays.filter(play => {
    const startTime = play.about?.startTime;
    if (!startTime) return true;
    return startTime <= cutoff;
  });
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
  gumbo.liveData.plays.allPlays = filterPlays(allPlays, cutoff);
  gumbo.liveData.linescore = filterLinescore(
    gumbo.liveData.linescore,
    gumbo.liveData.plays.allPlays,
    cutoff
  );
  return gumbo;
}
