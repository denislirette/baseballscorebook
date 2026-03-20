// Auto-refresh controller

let refreshTimer = null;
let lastRefresh = null;

/**
 * Set up refresh control listeners and auto-refresh behavior.
 * @param {Function} refreshFn - The function to call on refresh (e.g., loadGame)
 * @param {Function} getGameState - Returns the current abstractGameState
 */
export function renderRefreshControls(refreshFn, getGameState) {
  const toggleBtn = document.getElementById('refresh-toggle');
  const intervalInput = document.getElementById('refresh-interval');
  const unitSelect = document.getElementById('refresh-unit');
  const statusEl = document.getElementById('refresh-status');

  let running = false;

  function getIntervalMs() {
    const val = parseInt(intervalInput.value, 10) || 10;
    const unit = unitSelect.value;
    if (unit === 'minutes') return val * 60 * 1000;
    return val * 1000;
  }

  function updateStatus() {
    if (!lastRefresh) return;
    statusEl.textContent = `Last updated: ${lastRefresh.toLocaleTimeString()}`;
  }

  async function doRefresh() {
    await refreshFn();
    lastRefresh = new Date();
    updateStatus();

    // Stop auto-refresh if game is final
    const state = getGameState();
    if (state === 'Final') {
      stop();
      statusEl.textContent += ' (Game Final)';
    }
  }

  function start() {
    stop();
    running = true;
    toggleBtn.textContent = 'Stop';
    toggleBtn.setAttribute('aria-pressed', 'true');
    refreshTimer = setInterval(doRefresh, getIntervalMs());
  }

  function stop() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    running = false;
    toggleBtn.textContent = 'Start';
    toggleBtn.setAttribute('aria-pressed', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    if (running) {
      stop();
    } else {
      start();
    }
  });

  // Restart with new interval when user changes the values
  intervalInput.addEventListener('change', () => {
    if (running) start();
  });
  unitSelect.addEventListener('change', () => {
    if (running) start();
  });
}
