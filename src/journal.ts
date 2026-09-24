import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import { getPosts, Post } from './data/store';
import categoriesData from './data/categories.json';

const posts: Post[] = getPosts();

// URL params
const urlParams = new URLSearchParams(window.location.search);
let selectedCategory = urlParams.get('category') || 'All Posts';
let searchQuery = urlParams.get('q') || '';
let currentPage = parseInt(urlParams.get('page') || '1', 10);
const PAGE_SIZE = 9;

const app = document.getElementById('app');

function render() {
  if (!app) return;

  // Filter posts
  const filtered = posts.filter(post => {
    const matchesCategory =
      selectedCategory === 'All Posts' ||
      post.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.categories.some(c => c.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  app.innerHTML = `
    ${renderNavbar('journal')}

    <main style="padding: 3.5rem 0 5rem; min-height: 80vh;">
      <div class="container">
        <!-- Archive Header -->
        <div style="margin-bottom: 2.5rem; text-align: center; max-width: 800px; margin-inline: auto;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">COMPLETE ARCHIVE &bull; 47 ARTICLES</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1rem;">
            THE GEOGRAPHICAL ARCHIVE
          </h1>

          <p class="font-serif" style="font-size: 1.15rem; color: var(--c-ink-soft); line-height: 1.6;">
            Every dispatch, critical paper, and field report published by The Graticule at Queen's University Belfast. Filter by domain or search across authors and themes.
          </p>
        </div>

        <!-- Controls: Search & Category Chips -->
        <div style="margin-bottom: 3rem; background-color: var(--c-paper-warm); border: 1.5px solid var(--c-border); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm);">
          <!-- Live Search Bar -->
          <div style="position: relative; margin-bottom: 1.5rem;">
            <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--c-ink-muted); display: flex; align-items: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search by title, author, field, or topic..." 
              value="${searchQuery}" 
              style="width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; font-size: 1.05rem; background: #ffffff; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); outline: none; transition: border-color var(--tr-fast);"
            />
            ${searchQuery ? `
              <button id="clearSearchBtn" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.25rem; color: var(--c-ink-muted); cursor: pointer;" aria-label="Clear Search">&times;</button>
            ` : ''}
          </div>

          <!-- Category Chips -->
          <div>
            <div style="font-family: var(--font-collegiate); font-size: 0.95rem; letter-spacing: 0.08em; color: var(--c-ink-muted); margin-bottom: 0.75rem;">
              FILTER BY CATEGORY (${categoriesData.length}):
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;" id="categoryChipsContainer">
              ${categoriesData.map(cat => `
                <button 
                  class="stamp-chip category-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}" 
                  data-category="${cat}"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Results Counter & Active Filter Badge -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1.5px solid var(--c-border); padding-bottom: 0.75rem;">
          <div style="font-family: var(--font-collegiate); font-size: 1.15rem; letter-spacing: 0.06em; color: var(--c-ink);">
            SHOWING <span style="color: var(--c-emerald); font-weight: 700;">${filtered.length}</span> DISPATCH${filtered.length === 1 ? '' : 'ES'}
            ${selectedCategory !== 'All Posts' ? `IN <span style="color: var(--c-ocean);">${selectedCategory.toUpperCase()}</span>` : ''}
          </div>

          ${(selectedCategory !== 'All Posts' || searchQuery) ? `
            <button id="resetFiltersBtn" class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">
              Reset Filters
            </button>
          ` : ''}
        </div>

        <!-- Article Grid or Empty State -->
        ${filtered.length > 0 ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.25rem;">
            ${pagePosts.map(post => `
              <article class="article-card">
                <a href="/post/?slug=${encodeURIComponent(post.slug)}" style="display: flex; flex-direction: column; height: 100%;">
                  <div class="article-card-media">
                    <img 
                      src="${post.coverImage || '/images/logo-g.svg'}" 
                      alt="${post.title}" 
                      class="article-card-img" 
                      loading="lazy"
                      onerror="this.src='/images/logo-g.svg'"
                    />
                    <div class="article-card-stamp">${post.categories[0] || 'Geography'}</div>
                  </div>
                  <div class="article-card-body">
                    <div class="article-card-meta">
                      <span>${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>&bull;</span>
                      <span>${post.readTime}</span>
                    </div>
                    <h2 class="article-card-title">${post.title}</h2>
                    <p class="article-card-excerpt">${post.excerpt}</p>
                    <div class="article-card-footer">
                      <span class="article-author">${post.author}</span>
                      <span class="article-readmore">Read Article &rarr;</span>
                    </div>
                  </div>
                </a>
              </article>
            `).join('')}
          </div>

          <!-- Pagination -->
          ${totalPages > 1 ? `
            <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 3.5rem;">
              <button 
                class="btn btn-outline pagination-btn" 
                data-page="${currentPage - 1}" 
                ${currentPage === 1 ? 'disabled style="opacity: 0.4; pointer-events: none;"' : ''}
              >
                &larr; Prev
              </button>

              <div style="display: flex; gap: 0.35rem;">
                ${Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => `
                  <button 
                    class="btn ${pageNum === currentPage ? 'btn-primary' : 'btn-outline'} pagination-btn" 
                    data-page="${pageNum}"
                    style="min-width: 44px; padding: 0.5rem;"
                  >
                    ${pageNum}
                  </button>
                `).join('')}
              </div>

              <button 
                class="btn btn-outline pagination-btn" 
                data-page="${currentPage + 1}" 
                ${currentPage === totalPages ? 'disabled style="opacity: 0.4; pointer-events: none;"' : ''}
              >
                Next &rarr;
              </button>
            </div>
          ` : ''}
        ` : `
          <!-- Designed Cartographic Empty State -->
          <div style="text-align: center; padding: 5rem 2rem; background: var(--c-paper-warm); border: 2px dashed var(--c-border); border-radius: var(--radius-md); max-width: 680px; margin: 2rem auto;">
            <div style="width: 72px; height: 72px; margin: 0 auto 1.5rem; border-radius: 50%; background: rgba(40, 178, 111, 0.15); border: 2px solid var(--c-emerald); display: flex; align-items: center; justify-content: center; color: var(--c-emerald);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m4.93 4.93 4.24 4.24"></path>
                <path d="m14.83 9.17 4.24-4.24"></path>
                <path d="m14.83 14.83 4.24 4.24"></path>
                <path d="m9.17 14.83-4.24 4.24"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <h3 class="font-collegiate" style="font-size: 2rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.75rem;">
              TERRA INCOGNITA: NO EXPEDITIONS FOUND
            </h3>
            <p class="font-serif" style="font-size: 1.1rem; color: var(--c-ink-muted); margin-bottom: 1.75rem;">
              No dispatches currently match the query <em>"${searchQuery}"</em> in category <em>"${selectedCategory}"</em>.
            </p>
            <button id="emptyStateResetBtn" class="btn btn-primary">
              Clear Search & Show All Articles
            </button>
          </div>
        `}
      </div>
    </main>

    ${renderFooter()}
  `;

  // Attach event listeners
  initNavbarInteractions();

  // Search input with debounce
  const input = document.getElementById('searchInput') as HTMLInputElement;
  if (input) {
    if (searchQuery) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
    input.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      currentPage = 1;
      updateUrlAndRerender();
    });
  }

  // Clear search
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      currentPage = 1;
      updateUrlAndRerender();
    });
  }

  // Category buttons
  const catButtons = document.querySelectorAll('.category-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      selectedCategory = target.getAttribute('data-category') || 'All Posts';
      currentPage = 1;
      updateUrlAndRerender();
    });
  });

  // Reset filter buttons
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchQuery = '';
      selectedCategory = 'All Posts';
      currentPage = 1;
      updateUrlAndRerender();
    });
  }

  const emptyResetBtn = document.getElementById('emptyStateResetBtn');
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      searchQuery = '';
      selectedCategory = 'All Posts';
      currentPage = 1;
      updateUrlAndRerender();
    });
  }

  // Pagination buttons
  const pageButtons = document.querySelectorAll('.pagination-btn');
  pageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const page = parseInt(target.getAttribute('data-page') || '1', 10);
      if (!isNaN(page)) {
        currentPage = page;
        updateUrlAndRerender();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

function updateUrlAndRerender() {
  const params = new URLSearchParams();
  if (selectedCategory !== 'All Posts') params.set('category', selectedCategory);
  if (searchQuery) params.set('q', searchQuery);
  if (currentPage > 1) params.set('page', String(currentPage));

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
  render();
}

render();
