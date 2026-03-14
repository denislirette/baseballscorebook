// Auto-refresh controller

let refreshTimer = null;
let lastRefresh = null;
let statusPrefix = '';

/**
 * Set up refresh control listeners and auto-refresh behavior.
 * @param {Function} refreshFn - The function to call on refresh (e.g., loadGame)
 * @param {Function} getGameState - Returns the current abstractGameState
 */
export function renderRefreshControls(refreshFn, getGameState) {
  const autoRefreshCheckbox = document.getElementById('auto-refresh');
  const intervalInput = document.getElementById('refresh-interval');
  const saveBtn = document.getElementById('save-interval-btn');
  const statusEl = document.getElementById('refresh-status');

  let activeInterval = (parseInt(intervalInput.value, 10) || 1) * 1000;

  function updateStatusFull() {
    if (!lastRefresh) return;
    const timeStr = lastRefresh.toLocaleTimeString();
    statusEl.textContent = `Last updated: ${timeStr}`;
    // Cache prefix (everything except seconds) for fast updates
    const lastColon = timeStr.lastIndexOf(':');
    statusPrefix = `Last updated: ${timeStr.slice(0, lastColon + 1)}`;
  }

  function updateStatusSeconds() {
    if (!lastRefresh || !statusPrefix) return;
    const now = new Date();
    const secs = String(now.getSeconds()).padStart(2, '0');
    const suffix = now.toLocaleTimeString().slice(now.toLocaleTimeString().lastIndexOf(':') + 3);
    statusEl.textContent = `${statusPrefix}${secs}${suffix}`;
  }

  async function doRefresh() {
    await refreshFn();
    lastRefresh = new Date();
    if (activeInterval < 10000) {
      updateStatusSeconds();
    } else {
      updateStatusFull();
    }

    // Stop auto-refresh if game is final
    const state = getGameState();
    if (state === 'Final') {
      stopAutoRefresh();
      autoRefreshCheckbox.checked = false;
      updateStatusFull();
      statusEl.textContent += ' (Game Final)';
    }
  }

  function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(doRefresh, activeInterval);
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  saveBtn.addEventListener('click', () => {
    activeInterval = (parseInt(intervalInput.value, 10) || 1) * 1000;
    if (autoRefreshCheckbox.checked) {
      startAutoRefresh();
    }
  });

  autoRefreshCheckbox.addEventListener('change', () => {
    if (autoRefreshCheckbox.checked) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  });

  // Start auto-refresh by default for live games
  if (autoRefreshCheckbox.checked) {
    startAutoRefresh();
  }
}
