const COLUMNS = [
  { id: 'backlog',      title: 'Backlog',      color: '#888'    },
  { id: 'in-progress',  title: 'In Progress',  color: '#7c6af7' },
  { id: 'review',       title: 'Review',       color: '#f0a04a' },
  { id: 'testing',      title: 'Testing',      color: '#7ab8f0' },
  { id: 'done',         title: 'Done',         color: '#52c07a' },
];

const PEOPLE = [
  { initials: 'AL', color: '#7c6af7' },
  { initials: 'MR', color: '#f0a04a' },
  { initials: 'SK', color: '#52c07a' },
  { initials: 'JP', color: '#e05252' },
  { initials: 'CL', color: '#7ab8f0' },
  { initials: 'RB', color: '#c07aff' },
  { initials: 'TN', color: '#f07a7a' },
  { initials: 'VK', color: '#7af0f0' },
];

const TAGS = [
  'frontend','backend','api','design','infra',
  'testing','perf','security','mobile','docs',
];

const PRIORITIES = ['low','medium','high','critical'];

const TITLES = [
  'Implement pagination for search results',
  'Fix layout shift on mobile navigation',
  'Add rate limiting to public API endpoints',
  'Migrate auth tokens to short-lived JWTs',
  'Optimize LCP for product landing pages',
  'Add keyboard navigation to modal dialogs',
  'Refactor user onboarding flow',
  'Set up E2E testing pipeline',
  'Resolve memory leak in WebSocket handler',
  'Design new checkout flow mockups',
  'Add dark mode support to dashboard',
  'Audit and fix broken backlinks in sitemap',
  'Implement virtual scroll for activity feed',
  'Update API documentation for v2 endpoints',
  'Add input validation to account settings form',
  'Fix CLS caused by late-loading web fonts',
  'Set up CDN distribution for static assets',
  'Implement Speculation Rules on product pages',
  'Add export to CSV functionality in reports',
  'Investigate INP regression in Kanban view',
];

const DATES = [
  'Jun 10','Jun 12','Jun 15','Jun 18','Jun 20',
  'Jun 25','Jul 1','Jul 5','Jul 10','Jul 15',
];

let cardSeq = 0;

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function createCard() {
  cardSeq++;
  const id       = `BRD-${String(cardSeq).padStart(3, '0')}`;
  const person   = pick(PEOPLE);
  const priority = pick(PRIORITIES);
  const title    = TITLES[(cardSeq - 1) % TITLES.length];
  const progress = randInt(0, 100);
  const due      = pick(DATES);

  const pool = [...TAGS];
  const tags = [];
  for (let i = 0, n = randInt(1, 3); i < n; i++) {
    tags.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }

  const card = document.createElement('article');
  card.className = 'kanban-card';
  card.dataset.cardId = id;

  card.innerHTML = `
    <div class="card-top">
      <span class="card-avatar" style="background:${person.color}">${person.initials}</span>
      <span class="card-id">${id}</span>
      <span class="priority-badge priority-${priority}">${priority}</span>
    </div>
    <textarea class="card-title" rows="2" spellcheck="false">${title}</textarea>
    <div class="card-tags">${tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join('')}</div>
    <div class="card-footer">
      <div class="card-progress">
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        <span class="progress-label">${progress}%</span>
      </div>
      <span class="card-due">${due}</span>
    </div>
  `;

  const textarea = card.querySelector('.card-title');
  textarea.addEventListener('input', onCardInput);
  return card;
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// Simulates what a drag-and-drop library does on any card change:
// reads the position of every card to rebuild a position index for drop targets.
// This is a WRITE (autoResize) followed by a READ (getBoundingClientRect × 100).
//
// Without contain: layout — the write invalidates the entire page layout.
// The browser recalculates all 100 cards before serving any read.
//
// With contain: layout — the write invalidates only the column where the edit happened.
// Cards in other columns return cached layout data without recalculation.
function onCardInput(event) {
  autoResize(event.target);

  performance.mark('pos-index-start');

  const cards = document.querySelectorAll('.kanban-card');
  // Reading getBoundingClientRect forces layout. Without containment this
  // flushes all pending layout work for the whole page. With containment
  // it flushes only the affected column's pending layout work.
  cards.forEach(card => void card.getBoundingClientRect());

  performance.mark('pos-index-end');
  const duration = performance.measure('pos-index', 'pos-index-start', 'pos-index-end').duration;

  const el = document.getElementById('reflow-time');
  if (!el) return;
  el.textContent = duration.toFixed(1) + ' ms';
  el.className = 'reflow-time ' + (duration > 8 ? 'slow' : 'fast');
}

function buildBoard() {
  const board = document.getElementById('kanban-board');

  COLUMNS.forEach(col => {
    const column = document.createElement('div');
    column.className = 'kanban-column';
    column.dataset.col = col.id;

    column.innerHTML = `
      <div class="column-header">
        <h2 class="column-title" style="color:${col.color}">${col.title}</h2>
        <span class="column-count">20</span>
      </div>
    `;

    for (let i = 0; i < 20; i++) column.appendChild(createCard());

    board.appendChild(column);
  });
}

function trackLongTasks() {
  if (!('PerformanceObserver' in window)) return;
  try {
    new PerformanceObserver(list => {
      const el = document.getElementById('long-tasks');
      if (!el) return;
      el.textContent = parseInt(el.textContent || '0') + list.getEntries().length;
    }).observe({ entryTypes: ['longtask'] });
  } catch (_) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { buildBoard(); trackLongTasks(); });
} else {
  buildBoard();
  trackLongTasks();
}
