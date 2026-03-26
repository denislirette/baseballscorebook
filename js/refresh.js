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

  // Restore saved preferences
  const savedInterval = localStorage.getItem('refresh-interval');
  const savedUnit = localStorage.getItem('refresh-unit');
  const savedEnabled = localStorage.getItem('refresh-enabled');
  if (savedInterval) intervalInput.value = savedInterval;
  if (savedUnit) unitSelect.value = savedUnit;

  function savePrefs() {
    localStorage.setItem('refresh-interval', intervalInput.value);
    localStorage.setItem('refresh-unit', unitSelect.value);
    localStorage.setItem('refresh-enabled', running ? 'true' : 'false');
  }

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

  function updateToggle() {
    toggleBtn.checked = running;
    const bar = toggleBtn.closest('.refresh-controls');
    if (bar) bar.classList.toggle('refresh-active', running);
  }

  async function doRefresh() {
    await refreshFn();
    lastRefresh = new Date();
    updateStatus();

    const state = getGameState();
    if (state === 'Final') {
      stop();
      statusEl.textContent += ' (Game Final)';
    }
  }

  function start() {
    stop();
    running = true;
    updateToggle();
    savePrefs();
    refreshTimer = setInterval(doRefresh, getIntervalMs());
  }

  function stop() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    running = false;
    updateToggle();
    savePrefs();
  }

  toggleBtn.addEventListener('change', () => {
    if (toggleBtn.checked) {
      start();
    } else {
      stop();
    }
  });

  intervalInput.addEventListener('change', () => {
    savePrefs();
    if (running) start();
  });
  unitSelect.addEventListener('change', () => {
    savePrefs();
    if (running) start();
  });

  // Auto-start if user previously had it enabled
  if (savedEnabled === 'true') {
    start();
  }
}
