// Deterministic news feed — 50 articles across 6 categories.
// Used by both before/ and after/ demos.

const FEED_CATEGORIES = [
  { id: 'performance', label: 'Performance', color: '#7c6af7', emoji: '⚡' },
  { id: 'architecture', label: 'Architecture', color: '#52c07a', emoji: '🏛️' },
  { id: 'css', label: 'CSS', color: '#6ad4f7', emoji: '🎨' },
  { id: 'javascript', label: 'JavaScript', color: '#f7d76a', emoji: '⚙️' },
  { id: 'accessibility', label: 'Accessibility', color: '#f76a9e', emoji: '♿' },
  { id: 'browsers', label: 'Browsers', color: '#f7a76a', emoji: '🌐' },
];

const ARTICLE_TITLES = [
  // Performance
  'Why Your LCP Is Slow (And It\'s Not Your Images)',
  'INP: The Metric That Replaced FID and Why It Matters',
  'HTTP Archive Report: Only 48% of Sites Pass Core Web Vitals',
  'Speculation Rules API: Prerender Before the Click',
  'The Real Cost of JavaScript: Parse, Compile, Execute',
  'TTFB Deep Dive: DNS, Connection, and Server Time',
  'Measuring Performance in the Real World With CrUX',
  'Long Tasks Are Killing Your INP',
  // Architecture
  'Islands Architecture: The End of Monolithic Hydration',
  'Partial Prerendering: Static Shell + Dynamic Holes',
  'Edge SSR: Rendering Close to the User',
  'Resumability vs Hydration: A Fair Comparison',
  'When to Use SSG, SSR, CSR, and ISR',
  'HTTP Streaming: Why Your Server Should Not Wait',
  'On-Demand ISR: Fresh Content Without Idle Serverless',
  'The Hydration Problem Nobody Talks About',
  // CSS
  'content-visibility: The Most Underrated CSS Property',
  'CSS Containment: Isolate Reflows to the Component',
  '@layer and the Future of CSS Architecture',
  'View Transitions API: Native Animations Are Here',
  'Container Queries Are Finally Here. Now What?',
  'CSS Scroll-Driven Animations Without JavaScript',
  'Subgrid: The CSS Feature Designers Have Been Waiting For',
  'Color-mix() and the New CSS Color Functions',
  // JavaScript
  'Module Federation 2.0: What Changed',
  'Signals Are Coming to the Web Platform',
  'Web Workers and the Main Thread: A Practical Guide',
  'Import Maps Are Now Baseline. Start Using Them.',
  'The Problem with useEffect',
  'Async Generators: The Underused JavaScript Feature',
  'WeakRef and FinalizationRegistry in Practice',
  'structuredClone: Stop Writing Deep Clone Functions',
  // Accessibility
  'ARIA Roles You\'re Using Wrong',
  'Focus Management in Single Page Applications',
  'Color Contrast: Why 4.5:1 Is Not Always Enough',
  'The Accessibility Tree: What Screen Readers Actually See',
  'Keyboard Navigation in Complex Widgets',
  'Accessible Loading States: Beyond the Spinner',
  'WCAG 2.2: What Changed and What It Means for You',
  'Skip Navigation Links Are Not Optional',
  // Browsers
  'bfcache: The Free Performance Win You\'re Probably Breaking',
  'Chrome 125: View Transitions for Cross-Document Navigation',
  'The Browser Event Loop: A Visual Guide',
  'Compositor Thread vs Main Thread: The Full Picture',
  'Storage Buckets API: Organizing Origin Storage',
  'Popover API: Native Tooltips Without JavaScript',
  'Declarative Shadow DOM Is Now Baseline',
  'The Fugu Project: What Web APIs Are Coming Next',
  'CSS Anchor Positioning: Goodbye Popper.js',
  'Scroll Snap: Better Than You Remember',
];

const AUTHORS = ['Ivan Akulov', 'Addy Osmani', 'Alex Russell', 'Rachel Andrew',
                 'Léonie Watson', 'Jake Archibald', 'Surma', 'Paul Irish',
                 'Una Kravets', 'Jen Simmons', 'Tab Atkins', 'Lyza Gardner'];

function generateFeed() {
  return ARTICLE_TITLES.map((title, i) => {
    const cat = FEED_CATEGORIES[i % FEED_CATEGORIES.length];
    const author = AUTHORS[(i * 3 + 1) % AUTHORS.length];
    const daysAgo = (i * 2 + 1);
    const readTime = 3 + (i % 8);
    const date = new Date(Date.now() - daysAgo * 86400000)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { id: i + 1, title, category: cat.id, categoryLabel: cat.label,
             categoryColor: cat.color, emoji: cat.emoji,
             author, date, readTime };
  });
}

window.FEED_DATA = generateFeed();
