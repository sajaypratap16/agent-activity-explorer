const { pageSize, tickerIntervalMs, tickerVisibleRows, storageKey } = window.APP_CONFIG;

const grid = document.getElementById('agents');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const resultsCount = document.getElementById('results-count');
const topbar = document.querySelector('.topbar');
const backToTop = document.getElementById('back-to-top');
const progress = document.getElementById('read-progress');
const tickerToggle = document.getElementById('ticker-toggle');
const preview = document.getElementById('row-preview');
const scrollContext = document.getElementById('scroll-context');

const minCardHeight = 220;

// Prepare immutable lookup data once instead of rebuilding it on every interaction.
const sortedActivity = window.ACTIVITY.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
const searchableActivity = sortedActivity.map((event) => ({
  event,
  text: [event.id, event.timestamp, event.agent, event.tool, event.status, event.latencyMs, event.summary]
    .join(' ').toLowerCase(),
}));
const callsByMinute = new Map();
for (const event of window.ACTIVITY) {
  const minute = event.timestamp.slice(11, 16);
  callsByMinute.set(minute, (callsByMinute.get(minute) || 0) + 1);
}
let scrollFrame = 0;
let tickerInterval = null;
let tickerKeyHandler = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' });
}

function countByAgent(events) {
  const counts = {};
  events.forEach((event) => {
    counts[event.agent] = (counts[event.agent] || 0) + 1;
  });
  return counts;
}

function renderAgents() {
  const counts = countByAgent(window.ACTIVITY);
  grid.innerHTML = window.AGENTS.map((agent, index) => {
    const image = 'assets/agents/agent-' + String((index % 12) + 1).padStart(2, '0') + '.png';
    return (
      '<article class="agent-card">' +
      '<img class="agent-avatar" src="' + image + '" alt="">' +
      '<h3>' + escapeHtml(agent.name) + '</h3>' +
      '<p class="agent-owner">' + escapeHtml(agent.owner) + '</p>' +
      '<p class="agent-description">' + escapeHtml(agent.description) + '</p>' +
      '<p class="agent-count">' + (counts[agent.name] || 0).toLocaleString() + ' calls today</p>' +
      '</article>'
    );
  }).join('');
  grid.querySelectorAll('img').forEach((img) => img.addEventListener('load', equalizeCardHeights));
}

function equalizeCardHeights() {
  const cards = Array.from(grid.querySelectorAll('.agent-card'));
  // Reset first, then measure once per card and group cards by their visual row.
  cards.forEach((card) => { card.style.height = ''; });
  const rows = new Map();
  cards.forEach((card) => {
    const top = card.offsetTop;
    const height = Math.max(card.offsetHeight, minCardHeight);
    const row = rows.get(top) || [];
    row.push({ card, height });
    rows.set(top, row);
  });
  rows.forEach((row) => {
    const height = Math.max(...row.map((item) => item.height));
    row.forEach(({ card }) => { card.style.height = height + 'px'; });
  });
}

function loadViewed() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function rememberViewed(items) {
  const viewed = loadViewed();
  for (const item of items) {
    if (!viewed.includes(item.id)) {
      viewed.push(item.id);
    }
  }
  if (items.length) localStorage.setItem(storageKey, JSON.stringify(viewed));
}

function search(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return sortedActivity;
  return searchableActivity.filter((item) => item.text.includes(needle)).map((item) => item.event);
}

function renderResults(query) {
  const matches = search(query);
  const page = matches.slice(0, pageSize);
  const viewed = loadViewed();
  resultsCount.textContent = matches.length.toLocaleString() + ' matching tool calls';
  resultsList.innerHTML = page.map((event) => {
    const isNew = !viewed.includes(event.id);
    return (
      '<li class="result-row status-' + event.status + '" data-id="' + event.id + '" data-minute="' + event.timestamp.slice(11, 16) + '">' +
      '<span class="result-time">' + formatTime(event.timestamp) + '</span>' +
      '<span class="result-agent">' + escapeHtml(event.agent) + '</span>' +
      '<span class="result-tool">' + escapeHtml(event.tool) + '</span>' +
      '<span class="result-status">' + event.status + '</span>' +
      '<span class="result-latency">' + event.latencyMs + ' ms</span>' +
      '<span class="result-summary">' + escapeHtml(event.summary) + '</span>' +
      (isNew ? '<span class="badge-new">New</span>' : '') +
      '</li>'
    );
  }).join('');
  rememberViewed(page);
}


function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
  scrollFrame = 0;
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  topbar.classList.toggle('topbar-raised', scrolled > 8);
  topbar.style.paddingBlock = Math.max(6, 12 - scrolled / 20) + 'px';
  backToTop.classList.toggle('visible', scrolled > window.innerHeight);
  resultsList.querySelectorAll('.result-row').forEach((row) => {
    row.classList.remove('in-focus');
    const rect = row.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.3 && rect.top < window.innerHeight * 0.6) {
      row.classList.add('in-focus');
    }
  });
  const focused = resultsList.querySelector('.in-focus');
  if (focused) {
    const minute = focused.dataset.minute;
    const sameMinute = callsByMinute.get(minute) || 0;
    scrollContext.textContent = minute + ' UTC · ' + sameMinute + ' calls that minute';
  } else {
    scrollContext.textContent = '';
  }
  });
}

function hidePreview() {
  preview.hidden = true;
}

function showPreview(event) {
  const row = event.target.closest('.result-row');
  if (!row) return;
  const item = window.ACTIVITY.find((candidate) => candidate.id === row.dataset.id);
  if (!item) return;
  preview.textContent = item.summary;
  preview.style.top = event.clientY + 12 + 'px';
  preview.style.left = event.clientX + 12 + 'px';
  preview.hidden = false;
}

const renderedTickerRows = new Map();
let tickerPanel = null;

function tickerRow(event) {
  if (renderedTickerRows.has(event.id)) {
    return renderedTickerRows.get(event.id).cloneNode(true);
  }
  const row = document.createElement('li');
  row.className = 'ticker-row status-' + event.status;
  row.innerHTML =
    '<span class="ticker-time">' + formatTime(event.timestamp) + '</span>' +
    '<span class="ticker-agent">' + escapeHtml(event.agent) + '</span>' +
    '<span class="ticker-tool">' + escapeHtml(event.tool) + '</span>';
  renderedTickerRows.set(event.id, row);
  return row.cloneNode(true);
}

function positionTicker() {
  if (!tickerPanel) return;
  tickerPanel.style.maxHeight = window.innerHeight - 120 + 'px';
}

function openTicker() {
  const panel = document.createElement('aside');
  panel.className = 'ticker';
  panel.innerHTML = '<header class="ticker-header">Live tool calls</header><ul class="ticker-list"></ul>';
  document.body.appendChild(panel);
  tickerPanel = panel;
  const list = panel.querySelector('.ticker-list');

  tickerInterval = setInterval(() => {
    const event = window.ACTIVITY[Math.floor(Math.random() * window.ACTIVITY.length)];
    list.prepend(tickerRow(event));
    while (list.children.length > tickerVisibleRows) {
      list.lastElementChild.remove();
    }
  }, tickerIntervalMs);

  window.addEventListener('resize', positionTicker);
  tickerKeyHandler = (event) => {
    if (event.key === 'Escape') closeTicker();
  };
  window.addEventListener('keydown', tickerKeyHandler);
  positionTicker();
  tickerToggle.setAttribute('aria-pressed', 'true');
  tickerToggle.textContent = 'Hide live calls';
}

function closeTicker() {
  if (!tickerPanel) return;
  tickerPanel.remove();
  tickerPanel = null;
  tickerToggle.setAttribute('aria-pressed', 'false');
  tickerToggle.textContent = 'Show live calls';
}

searchInput.addEventListener('input', () => renderResults(searchInput.value));
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', equalizeCardHeights);
resultsList.addEventListener('mousemove', showPreview);
resultsList.addEventListener('mouseleave', hidePreview);
resultsList.addEventListener('wheel', hidePreview);
resultsList.addEventListener('touchstart', hidePreview);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
tickerToggle.addEventListener('click', () => (tickerPanel ? closeTicker() : openTicker()));

renderAgents();
equalizeCardHeights();
renderResults('');
