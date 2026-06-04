/**
 * Shared catalog logic for both before/after demos.
 * Generates 300 products, renders the grid, handles category filtering.
 * Measures and displays initial render time in the page banner.
 */

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', color: '#7c6af7', dark: '#3a2a7a',
    emojis: ['💻','⌨️','🖥️','🎧','📱','🖱️','💾','🔌'],
    names: ['Wireless Headphones','USB-C Hub 7-in-1','Mechanical Keyboard','Smart Speaker',
            '4K Webcam','Portable SSD 1TB','Gaming Mouse RGB','LED Monitor 27"',
            'USB Microphone','Laptop Stand','HDMI Switch 4K','Phone Charger 65W'] },
  { id: 'books', label: 'Books', color: '#f7a76a', dark: '#7a4a2a',
    emojis: ['📚','📖','📕','📗','📘','📙'],
    names: ['Clean Architecture','The Pragmatic Programmer','Designing Data-Intensive Apps',
            'You Don\'t Know JS','Web Performance in Action','CSS Secrets',
            'Refactoring 2nd Ed','The Phoenix Project','Domain-Driven Design',
            'Site Reliability Engineering','Staff Engineer','A Philosophy of Software Design'] },
  { id: 'clothing', label: 'Clothing', color: '#6ad4f7', dark: '#1a5a7a',
    emojis: ['👕','👟','🧥','👖','🧢','🧤'],
    names: ['Hoodie Classic','Tech T-Shirt Merino','Cargo Pants','Running Shoes',
            'Waterproof Jacket','Merino Wool Sweater','Slim Denim Jeans','Low-Top Sneakers',
            'Baseball Cap','Compression Shorts','Polo Shirt','Winter Gloves'] },
  { id: 'sports', label: 'Sports', color: '#52c07a', dark: '#1a5a38',
    emojis: ['🏃','🧘','🏋️','⚽','🎾','🚴'],
    names: ['Yoga Mat Premium','Resistance Bands Set','Jump Rope Pro','Foam Roller',
            'Pull-Up Bar','Dumbbells 5 kg Pair','Exercise Ball 65cm','Kettlebell 16 kg',
            'Boxing Gloves 12oz','Bike Helmet MIPS','Running Armband','Gym Bag 40L'] },
  { id: 'home', label: 'Home & Garden', color: '#f7d76a', dark: '#7a5a1a',
    emojis: ['🏠','🌿','☕','🍳','🕯️','🧺'],
    names: ['Air Purifier HEPA','Robot Vacuum Mapping','Smart Thermostat','LED Strip 10m',
            'Pour-Over Coffee Set','Stand Mixer 5qt','Knife Block Set 7pc','Cast Iron Skillet',
            'Bamboo Cutting Board','Stainless Compost Bin','Plant Pots Set 3','Desk Organizer Bamboo'] },
  { id: 'beauty', label: 'Beauty', color: '#f76a9e', dark: '#7a1a4a',
    emojis: ['💄','🧴','💅','🌸','🌺','✨'],
    names: ['Vitamin C Serum 20%','Moisturizer SPF 50','Retinol Night Cream','Sheet Mask Set 10pk',
            'Eye Cream Peptide','Mineral Sunscreen SPF50','Hydrating Toner','Argan Hair Oil',
            'Tinted Lip Balm','Shea Hand Cream','Body Lotion Fragrance-Free','AHA Exfoliating Scrub'] },
  { id: 'toys', label: 'Toys', color: '#f76a6a', dark: '#7a1a1a',
    emojis: ['🎮','🤖','🧩','🎯','🚀','🎨'],
    names: ['LEGO City Police Station','Mini Drone FPV','Puzzle 1000 pcs','Strategy Board Game',
            'Watercolor Set 48','Science Lab Kit','Refractor Telescope','Coding Robot Kids',
            'Party Card Game','Magnetic Tiles 120pc','Model Rocket Kit','Pro Sketchbook A3'] },
  { id: 'food', label: 'Food & Drink', color: '#6af7b4', dark: '#1a7a4a',
    emojis: ['🍵','☕','🍫','🫒','🍯','🌿'],
    names: ['Ethiopian Coffee Beans 500g','Ceremonial Matcha 30g','Dark Chocolate 85% 200g','Extra Virgin Olive Oil 1L',
            'Himalayan Pink Salt','Raw Organic Honey 500g','Tricolor Quinoa 1kg','Almond Butter Crunchy',
            'Sencha Green Tea 100g','Artisan Granola 400g','Vanilla Protein Powder 1kg','Hot Sauce Collection 6-pack'] },
];

const BADGES = [null, null, null, null, 'Sale', 'New', 'Best Seller'];

function generateProducts(count = 300) {
  const products = [];
  const variants = ['', ' Pro', ' Max', ' Lite', ' Plus', ' SE', ' v2', ' XL',
                    ' Mini', ' Ultra', ' Black', ' White', ' Limited', ' Bundle',
                    ' Kit', ' Pack', ' 2024', ' Certified', ' Enhanced', ' Advanced',
                    ' Special', ' Premium', ' Essential', ' Complete', ' Advanced'];
  let id = 1;
  for (let i = 0; i < count; i++, id++) {
    const cat = CATEGORIES[i % CATEGORIES.length];
    const slot = Math.floor(i / CATEGORIES.length);
    const name = cat.names[slot % cat.names.length] + variants[slot % variants.length];
    const emoji = cat.emojis[id % cat.emojis.length];
    const price = ((id * 17 + 43) % 9900 + 99) / 100;
    const rating = ((id * 7 + 31) % 20 + 30) / 10;
    const reviews = ((id * 113 + 7) % 4990) + 10;
    const badge = BADGES[(id * 3 + 1) % BADGES.length];
    products.push({ id, name, emoji, category: cat.id, categoryLabel: cat.label,
                    categoryColor: cat.color, categoryDark: cat.dark,
                    price, rating, reviews, badge });
  }
  return products;
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function renderCard(p) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = p.category;
  card.style.setProperty('--cat-color', p.categoryColor);
  card.style.setProperty('--cat-dark', p.categoryDark);
  card.innerHTML = `
    <div class="product-thumbnail" aria-hidden="true">
      <span class="product-emoji">${p.emoji}</span>
    </div>
    <div class="product-body">
      ${p.badge ? `<span class="product-badge badge-${p.badge.toLowerCase().replace(' ', '-')}">${p.badge}</span>` : ''}
      <h2 class="product-name">${p.name}</h2>
      <p class="product-category">${p.categoryLabel}</p>
      <div class="product-rating">
        <span class="stars" aria-label="${p.rating} out of 5">${stars(p.rating)}</span>
        <span class="review-count">(${p.reviews.toLocaleString()})</span>
      </div>
      <div class="product-footer">
        <span class="product-price">$${p.price.toFixed(2)}</span>
        <button class="add-to-cart">Add to cart</button>
      </div>
    </div>
  `;
  return card;
}

function initCatalog() {
  const grid = document.getElementById('grid');
  const renderTimeEl = document.getElementById('render-time');
  const filterBtns = document.querySelectorAll('[data-filter]');

  const t0 = performance.now();
  const products = generateProducts(300);
  const fragment = document.createDocumentFragment();
  products.forEach(p => fragment.appendChild(renderCard(p)));
  grid.appendChild(fragment);
  const renderMs = Math.round(performance.now() - t0);

  if (renderTimeEl) {
    renderTimeEl.textContent = `Grid rendered in ${renderMs} ms`;
    renderTimeEl.classList.add(renderMs < 30 ? 'fast' : renderMs < 100 ? 'ok' : 'slow');
  }

  const cards = Array.from(grid.querySelectorAll('.product-card'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      // Synchronous style change across all cards — this is what triggers
      // the full reflow in the before version (no content-visibility).
      cards.forEach(card => {
        card.hidden = cat !== 'all' && card.dataset.category !== cat;
      });
      // Force a synchronous layout read so the browser accounts for
      // all the style recalculation work in the current INP entry.
      grid.getBoundingClientRect();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
