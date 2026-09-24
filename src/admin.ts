import {
  getPosts,
  getAuthors,
  getPostBySlug,
  savePost,
  deletePost,
  saveAuthor,
  deleteAuthor,
  exportDatabase,
  resetToBaseline,
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  updateAdminCredentials,
  Post,
  Author
} from './data/store';
import categoriesData from './data/categories.json';

const app = document.getElementById('app');

let activeTab: 'articles' | 'authors' | 'settings' = 'articles';
let searchQuery = '';
let selectedCategoryFilter = 'ALL';
let selectedAuthorFilter = 'ALL';
let editingPostSlug: string | null = null;
let editingAuthorName: string | null = null;
let deleteTargetSlug: string | null = null;
let deleteTargetAuthor: string | null = null;
let toastMessage: string | null = null;
let toastTimeout: any = null;

function showToast(msg: string) {
  toastMessage = msg;
  render();
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMessage = null;
    const toastEl = document.getElementById('adminToast');
    if (toastEl) toastEl.classList.remove('show');
  }, 3200);
}

function render() {
  if (!app) return;

  if (!isAdminLoggedIn()) {
    renderLoginGate();
    return;
  }

  renderDashboard();
}

function renderLoginGate() {
  if (!app) return;
  app.innerHTML = `
    <div class="admin-login-wrapper">
      <div class="admin-login-card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="brand-monogram" style="width: 56px; height: 56px; font-size: 2.8rem; margin: 0 auto 1rem;">𝔊</div>
          <h1 class="font-collegiate" style="font-size: 2.2rem; letter-spacing: 0.05em; color: var(--c-ink); margin: 0 0 0.25rem;">THE GRATICULE</h1>
          <span style="font-family: var(--font-sans); font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-emerald); font-weight: 700;">EDITORIAL DISPATCH CONSOLE</span>
        </div>

        <form id="adminLoginForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div id="loginErrorAlert" class="admin-alert admin-alert-error" style="display: none;"></div>

          <div class="form-group">
            <label class="font-collegiate" style="font-size: 0.9rem; letter-spacing: 0.06em; color: var(--c-ink); display: block; margin-bottom: 0.4rem;">
              EDITORIAL USERNAME
            </label>
            <input 
              type="text" 
              id="adminUsernameInput" 
              class="admin-input" 
              value="admin" 
              placeholder="Enter admin username" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="font-collegiate" style="font-size: 0.9rem; letter-spacing: 0.06em; color: var(--c-ink); display: block; margin-bottom: 0.4rem;">
              PASSWORD
            </label>
            <div style="position: relative;">
              <input 
                type="password" 
                id="adminPasswordInput" 
                class="admin-input" 
                value="graticule2021" 
                placeholder="Enter password" 
                required 
              />
              <button 
                type="button" 
                id="togglePassBtn" 
                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--c-ink-muted); cursor: pointer; font-size: 0.8rem;"
              >
                Show
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-dark" style="width: 100%; justify-content: center; font-size: 1.05rem; padding: 0.85rem; margin-top: 0.5rem;">
            <span>Sign In to Dashboard &rarr;</span>
          </button>
        </form>

        <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px dashed var(--c-border); text-align: center; font-size: 0.85rem; color: var(--c-ink-muted);">
          <div style="display: inline-block; background: var(--c-paper-warm); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--c-border); font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 0.75rem;">
            Default credentials: admin / graticule2021
          </div>
          <div>
            <a href="/" style="color: var(--c-emerald); text-decoration: none; font-weight: 600;">&larr; Return to The Graticule Homepage</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('adminLoginForm') as HTMLFormElement;
  const errorBox = document.getElementById('loginErrorAlert');
  const toggleBtn = document.getElementById('togglePassBtn');
  const passInput = document.getElementById('adminPasswordInput') as HTMLInputElement;

  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = (document.getElementById('adminUsernameInput') as HTMLInputElement).value;
      const pass = passInput.value;
      if (adminLogin(user, pass)) {
        render();
      } else {
        if (errorBox) {
          errorBox.textContent = 'Invalid credentials. Please verify your username and password.';
          errorBox.style.display = 'block';
        }
      }
    });
  }
}

function renderDashboard() {
  if (!app) return;

  const posts = getPosts();
  const authorsObj = getAuthors();
  const authorsList = Object.values(authorsObj);
  const categoriesList = categoriesData.filter(c => c !== 'All Posts');

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.author.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.categories.some(c => c.toLowerCase().includes(q));

    const matchesCat = selectedCategoryFilter === 'ALL' || 
      p.categories.some(c => c.toLowerCase() === selectedCategoryFilter.toLowerCase());

    const matchesAuthor = selectedAuthorFilter === 'ALL' || 
      p.author.toLowerCase() === selectedAuthorFilter.toLowerCase();

    return matchesSearch && matchesCat && matchesAuthor;
  });

  // Filter authors
  const filteredAuthors = authorsList.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      a.name.toLowerCase().includes(q) || 
      a.title.toLowerCase().includes(q) || 
      a.affiliation.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q);
  });

  app.innerHTML = `
    <div class="admin-shell">
      <!-- Admin Masthead Bar -->
      <header class="admin-header">
        <div class="admin-header-inner">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="brand-monogram" style="width: 40px; height: 40px; font-size: 2rem;">𝔊</div>
            <div>
              <div class="font-collegiate" style="font-size: 1.4rem; letter-spacing: 0.05em; color: var(--c-ink); line-height: 1;">THE GRATICULE</div>
              <span style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-emerald); font-weight: 700;">EDITORIAL CONTROL CENTER</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <a href="/" target="_blank" class="btn btn-outline btn-sm" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <span>View Live Journal ↗</span>
            </a>
            <div class="admin-user-badge">
              <span class="pill-dot" style="background: var(--c-emerald);"></span>
              <span>Lead Editor (Admin)</span>
            </div>
            <button id="adminSignOutBtn" class="btn btn-dark btn-sm" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <!-- KPI Summary Header -->
      <div class="admin-kpi-bar">
        <div class="container" style="max-width: 1400px;">
          <div class="admin-kpi-grid">
            <div class="admin-kpi-card">
              <span class="kpi-num font-collegiate">${posts.length}</span>
              <span class="kpi-label">PUBLISHED ARTICLES</span>
            </div>
            <div class="admin-kpi-card">
              <span class="kpi-num font-collegiate">${authorsList.length}</span>
              <span class="kpi-label">CONTRIBUTORS / AUTHORS</span>
            </div>
            <div class="admin-kpi-card">
              <span class="kpi-num font-collegiate">${categoriesList.length}</span>
              <span class="kpi-label">ACADEMIC DISCIPLINES</span>
            </div>
            <div class="admin-kpi-card">
              <span class="kpi-num font-collegiate" style="font-size: 1.6rem; color: var(--c-emerald-hover);">
                ${posts[0] ? new Date(posts[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </span>
              <span class="kpi-label">LATEST DISPATCH DATE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Admin Content Area -->
      <main class="container" style="max-width: 1400px; padding: 2rem 1.5rem 5rem;">
        <!-- Admin Navigation Tabs -->
        <div class="admin-tabs">
          <button class="admin-tab-btn ${activeTab === 'articles' ? 'active' : ''}" data-tab="articles">
            <span>📰 Articles Management (${posts.length})</span>
          </button>
          <button class="admin-tab-btn ${activeTab === 'authors' ? 'active' : ''}" data-tab="authors">
            <span>👥 Contributor Directory (${authorsList.length})</span>
          </button>
          <button class="admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
            <span>⚙️ Backup & Settings</span>
          </button>
        </div>

        <!-- TAB 1: ARTICLES MANAGEMENT -->
        ${activeTab === 'articles' ? `
          <div class="admin-tab-content">
            <!-- Action Strip -->
            <div class="admin-toolbar">
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; flex: 1;">
                <input 
                  type="text" 
                  id="articleSearchInput" 
                  class="admin-input" 
                  style="max-width: 320px;" 
                  placeholder="Search dispatches by title, author, keyword..." 
                  value="${searchQuery}"
                />
                <select id="articleCategorySelect" class="admin-input" style="max-width: 220px;">
                  <option value="ALL">All Categories (${categoriesList.length})</option>
                  ${categoriesList.map(c => `
                    <option value="${c}" ${selectedCategoryFilter === c ? 'selected' : ''}>${c}</option>
                  `).join('')}
                </select>
                <select id="articleAuthorSelect" class="admin-input" style="max-width: 200px;">
                  <option value="ALL">All Authors (${authorsList.length})</option>
                  ${authorsList.map(a => `
                    <option value="${a.name}" ${selectedAuthorFilter === a.name ? 'selected' : ''}>${a.name}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <button id="openNewArticleModalBtn" class="btn btn-primary" style="font-size: 0.95rem; padding: 0.65rem 1.25rem;">
                  <span>+ New Dispatch</span>
                </button>
              </div>
            </div>

            <!-- Articles Table -->
            <div class="admin-table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th style="width: 70px;">Media</th>
                    <th>Article Title & Categories</th>
                    <th>Author & Title</th>
                    <th>Date & Read Time</th>
                    <th style="text-align: right; width: 180px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredPosts.length === 0 ? `
                    <tr>
                      <td colspan="5" style="text-align: center; padding: 3rem; color: var(--c-ink-muted);">
                        No articles match the current filter criteria.
                      </td>
                    </tr>
                  ` : filteredPosts.map(p => `
                    <tr>
                      <td>
                        <div class="admin-thumb-box">
                          <img src="${p.coverImage || '/images/logo-g.svg'}" alt="" onerror="this.src='/images/logo-g.svg'" />
                        </div>
                      </td>
                      <td>
                        <div style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; color: var(--c-ink); margin-bottom: 0.35rem;">
                          ${p.title}
                        </div>
                        <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                          ${p.categories.map(c => `
                            <span class="admin-badge-category">${c}</span>
                          `).join('')}
                        </div>
                      </td>
                      <td>
                        <div style="font-weight: 600; color: var(--c-ink);">${p.author}</div>
                        <div style="font-size: 0.78rem; color: var(--c-emerald-hover); font-weight: 600;">${p.authorTitle || 'Contributor'}</div>
                      </td>
                      <td>
                        <div style="font-size: 0.85rem; color: var(--c-ink);">${new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div style="font-size: 0.78rem; color: var(--c-ink-muted);">${p.readTime}</div>
                      </td>
                      <td style="text-align: right;">
                        <div style="display: inline-flex; gap: 0.4rem;">
                          <a href="/post/?slug=${encodeURIComponent(p.slug)}" target="_blank" class="admin-btn-action" title="View Live Reader">
                            👁️
                          </a>
                          <button class="admin-btn-action edit-post-btn" data-slug="${p.slug}" title="Edit Dispatch">
                            ✏️
                          </button>
                          <button class="admin-btn-action admin-btn-danger delete-post-btn" data-slug="${p.slug}" title="Delete Dispatch">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        <!-- TAB 2: AUTHORS DIRECTORY -->
        ${activeTab === 'authors' ? `
          <div class="admin-tab-content">
            <div class="admin-toolbar">
              <input 
                type="text" 
                id="authorSearchInput" 
                class="admin-input" 
                style="max-width: 380px;" 
                placeholder="Search contributors by name, role, department..." 
                value="${searchQuery}"
              />
              <button id="openNewAuthorModalBtn" class="btn btn-primary" style="font-size: 0.95rem; padding: 0.65rem 1.25rem;">
                <span>+ Add Contributor</span>
              </button>
            </div>

            <div class="admin-authors-grid">
              ${filteredAuthors.map(author => {
                const authorPostsCount = posts.filter(p => p.author.toLowerCase() === author.name.toLowerCase()).length;
                return `
                  <div class="admin-author-card">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                      <div class="byline-avatar-monogram" style="width: 48px; height: 48px; font-size: 1.3rem;">
                        ${author.name.charAt(0).toUpperCase()}
                      </div>
                      <div style="flex: 1;">
                        <h3 class="font-collegiate" style="font-size: 1.35rem; margin: 0; color: var(--c-ink); line-height: 1.1;">
                          ${author.name}
                        </h3>
                        <span style="font-size: 0.8rem; font-weight: 700; color: var(--c-emerald-hover); display: block; margin-top: 2px;">
                          ${author.title}
                        </span>
                      </div>
                    </div>

                    <div style="font-size: 0.8rem; color: var(--c-ink-muted); margin-bottom: 0.75rem;">
                      📍 ${author.affiliation}
                    </div>

                    <p style="font-size: 0.88rem; line-height: 1.5; color: var(--c-ink-soft); margin-bottom: 1.25rem; flex: 1;">
                      ${author.bio || 'Contributing researcher and scholar at Queen\'s University Belfast Geography Society.'}
                    </p>

                    <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed var(--c-border); padding-top: 0.85rem; margin-top: auto;">
                      <span class="admin-badge-count">
                        ${authorPostsCount} Published ${authorPostsCount === 1 ? 'Dispatch' : 'Dispatches'}
                      </span>
                      <div style="display: flex; gap: 0.4rem;">
                        <button class="admin-btn-action edit-author-btn" data-name="${author.name}" title="Edit Profile">
                          ✏️ Edit
                        </button>
                        <button class="admin-btn-action admin-btn-danger delete-author-btn" data-name="${author.name}" title="Remove Author">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB 3: BACKUP & SETTINGS -->
        ${activeTab === 'settings' ? `
          <div class="admin-tab-content">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 2rem;">
              <!-- Data Export & Backup Card -->
              <div class="admin-settings-card">
                <div class="font-collegiate" style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--c-ink);">
                  💾 DATABASE BACKUP & EXPORT
                </div>
                <p style="font-size: 0.9rem; color: var(--c-ink-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Export a complete JSON backup containing all ${posts.length} articles, metadata, and contributor profiles. You can archive this backup or sync it back to your source repository.
                </p>
                <button id="exportDatabaseBtn" class="btn btn-dark" style="font-size: 0.95rem; padding: 0.65rem 1.25rem;">
                  <span>Download Database Backup (JSON) &darr;</span>
                </button>
              </div>

              <!-- Reset to Baseline Card -->
              <div class="admin-settings-card">
                <div class="font-collegiate" style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #b91c1c;">
                  ⚠️ RESET TO EDITORIAL BASELINE
                </div>
                <p style="font-size: 0.9rem; color: var(--c-ink-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                  Revert all modifications and restore the clean 47 baseline articles and verified contributor directory extracted from the original journal archive.
                </p>
                <button id="resetBaselineBtn" class="btn btn-outline" style="border-color: #b91c1c; color: #b91c1c; font-size: 0.95rem; padding: 0.65rem 1.25rem;">
                  <span>Reset All to Editorial Baseline</span>
                </button>
              </div>

              <!-- Admin Credentials Update Card -->
              <div class="admin-settings-card">
                <div class="font-collegiate" style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--c-ink);">
                  🔑 UPDATE ADMIN CREDENTIALS
                </div>
                <form id="updateCredsForm" style="display: flex; flex-direction: column; gap: 0.85rem;">
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: var(--c-ink); margin-bottom: 0.25rem; display: block;">NEW USERNAME</label>
                    <input type="text" id="newUsernameInput" class="admin-input" placeholder="admin" required />
                  </div>
                  <div class="form-group">
                    <label style="font-size: 0.82rem; font-weight: 700; color: var(--c-ink); margin-bottom: 0.25rem; display: block;">NEW PASSWORD</label>
                    <input type="password" id="newPasswordInput" class="admin-input" placeholder="Enter new password" required />
                  </div>
                  <button type="submit" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.55rem 1rem; align-self: flex-start;">
                    Save Credentials
                  </button>
                </form>
              </div>
            </div>
          </div>
        ` : ''}
      </main>

      <!-- Toast Notification Container -->
      <div id="adminToast" class="admin-toast ${toastMessage ? 'show' : ''}">
        ${toastMessage || ''}
      </div>

      <!-- ARTICLE EDITOR MODAL -->
      <div id="articleModal" class="admin-modal ${editingPostSlug !== null ? 'active' : ''}">
        <div class="admin-modal-card admin-modal-lg">
          <div class="admin-modal-header">
            <h2 class="font-collegiate" style="font-size: 1.6rem; color: var(--c-ink); margin: 0;">
              ${editingPostSlug === '__NEW__' ? '+ CREATE NEW DISPATCH' : 'EDIT DISPATCH'}
            </h2>
            <button id="closeArticleModalBtn" class="admin-modal-close">&times;</button>
          </div>

          <form id="articleForm" class="admin-modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group" style="grid-column: span 2;">
                <label class="admin-label">ARTICLE TITLE *</label>
                <input type="text" id="formPostTitle" class="admin-input" required placeholder="e.g. Geopolitics of the Arctic Ocean" />
              </div>

              <div class="form-group">
                <label class="admin-label">URL SLUG (AUTO-GENERATED)</label>
                <input type="text" id="formPostSlug" class="admin-input" placeholder="geopolitics-of-the-arctic-ocean" />
              </div>

              <div class="form-group">
                <label class="admin-label">AUTHOR / CONTRIBUTOR *</label>
                <select id="formPostAuthor" class="admin-input" required>
                  ${authorsList.map(a => `
                    <option value="${a.name}">${a.name} (${a.title})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group" style="grid-column: span 2;">
                <label class="admin-label">PRIMARY & SECONDARY CATEGORIES (COMMA SEPARATED) *</label>
                <input type="text" id="formPostCategories" class="admin-input" required placeholder="e.g. Political Geography & Geopolitics, Climate Change & Environmental Systems" />
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.4rem;">
                  <span style="font-size: 0.72rem; color: var(--c-ink-muted); align-self: center;">Quick suggestions:</span>
                  ${categoriesList.slice(0, 6).map(c => `
                    <button type="button" class="admin-chip-quick" data-cat="${c}">+${c}</button>
                  `).join('')}
                </div>
              </div>

              <div class="form-group" style="grid-column: span 2;">
                <label class="admin-label">EXCERPT / ABSTRACT *</label>
                <textarea id="formPostExcerpt" class="admin-input" rows="2" required placeholder="Brief introductory synopsis..."></textarea>
              </div>

              <div class="form-group">
                <label class="admin-label">COVER IMAGE URL</label>
                <input type="text" id="formPostCoverImage" class="admin-input" placeholder="https://..." />
              </div>

              <div class="form-group">
                <label class="admin-label">ESTIMATED READ TIME</label>
                <input type="text" id="formPostReadTime" class="admin-input" placeholder="e.g. 5 min read" />
              </div>
            </div>

            <!-- Full Body Editor with Preview Toggle -->
            <div style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="admin-label" style="margin: 0;">FULL ARTICLE BODY CONTENT</label>
                <div class="admin-editor-tabs">
                  <button type="button" id="tabWriteBody" class="admin-editor-tab-btn active">Write HTML / Content</button>
                  <button type="button" id="tabPreviewBody" class="admin-editor-tab-btn">Live Article Preview</button>
                </div>
              </div>

              <div id="editorWriteContainer">
                <textarea 
                  id="formPostBodyHtml" 
                  class="admin-input admin-code-textarea" 
                  rows="14" 
                  placeholder="Enter full article HTML or paragraphs... e.g. <p>First paragraph text...</p><h2>Subheading</h2><p>Second paragraph...</p>"
                ></textarea>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.4rem; flex-wrap: wrap;">
                  <button type="button" class="admin-btn-tag" data-tag="p">+ Paragraph</button>
                  <button type="button" class="admin-btn-tag" data-tag="h2">+ Subheading</button>
                  <button type="button" class="admin-btn-tag" data-tag="blockquote">+ Blockquote</button>
                  <button type="button" class="admin-btn-tag" data-tag="bib">+ Bibliography</button>
                </div>
              </div>

              <div id="editorPreviewContainer" class="article-reading-container admin-preview-box" style="display: none;">
                <!-- Live preview injected here -->
              </div>
            </div>

            <div class="admin-modal-footer">
              <button type="button" id="cancelArticleModalBtn" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Save & Publish Dispatch</button>
            </div>
          </form>
        </div>
      </div>

      <!-- AUTHOR EDITOR MODAL -->
      <div id="authorModal" class="admin-modal ${editingAuthorName !== null ? 'active' : ''}">
        <div class="admin-modal-card">
          <div class="admin-modal-header">
            <h2 class="font-collegiate" style="font-size: 1.5rem; color: var(--c-ink); margin: 0;">
              ${editingAuthorName === '__NEW__' ? '+ ADD CONTRIBUTOR' : 'EDIT CONTRIBUTOR PROFILE'}
            </h2>
            <button id="closeAuthorModalBtn" class="admin-modal-close">&times;</button>
          </div>

          <form id="authorForm" class="admin-modal-body">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="admin-label">FULL NAME (WITH ACADEMIC TITLE IF APPLICABLE) *</label>
              <input type="text" id="formAuthorName" class="admin-input" required placeholder="e.g. Dr Estelle Lowry or Emma Denton" />
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="admin-label">ACADEMIC ROLE / RESEARCH TITLE *</label>
              <input type="text" id="formAuthorTitle" class="admin-input" required placeholder="e.g. Research Fellow in Health Geography" />
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="admin-label">INSTITUTIONAL / DEPARTMENTAL AFFILIATION *</label>
              <input type="text" id="formAuthorAffiliation" class="admin-input" required placeholder="e.g. School of Natural and Built Environment, Queen's University Belfast" />
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label class="admin-label">BIOGRAPHICAL RESEARCH STATEMENT</label>
              <textarea id="formAuthorBio" class="admin-input" rows="4" placeholder="Brief biographical overview of research areas and student/faculty contributions..."></textarea>
            </div>

            <div class="admin-modal-footer">
              <button type="button" id="cancelAuthorModalBtn" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Contributor Profile</button>
            </div>
          </form>
        </div>
      </div>

      <!-- DELETE CONFIRMATION MODAL -->
      <div id="deleteModal" class="admin-modal ${deleteTargetSlug || deleteTargetAuthor ? 'active' : ''}">
        <div class="admin-modal-card" style="max-width: 480px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🗑️</div>
          <h3 class="font-collegiate" style="font-size: 1.6rem; color: var(--c-ink); margin: 0 0 0.5rem;">
            CONFIRM PERMANENT DELETION
          </h3>
          <p style="font-size: 0.92rem; color: var(--c-ink-muted); margin-bottom: 1.5rem; line-height: 1.5;">
            Are you sure you want to delete this ${deleteTargetSlug ? 'dispatch' : 'contributor'}? This action cannot be undone.
          </p>

          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button id="cancelDeleteBtn" class="btn btn-outline">Cancel</button>
            <button id="confirmDeleteBtn" class="btn btn-dark" style="background: #b91c1c; border-color: #b91c1c;">
              Yes, Permanently Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Dashboard Event Listeners
  attachDashboardEvents();
}

function attachDashboardEvents() {
  // Sign Out
  const signOutBtn = document.getElementById('adminSignOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      adminLogout();
      render();
    });
  }

  // Tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
      searchQuery = '';
      render();
    });
  });

  // Search & Filters
  const searchInput = document.getElementById('articleSearchInput') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      render();
      const el = document.getElementById('articleSearchInput') as HTMLInputElement;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  const authorSearchInput = document.getElementById('authorSearchInput') as HTMLInputElement;
  if (authorSearchInput) {
    authorSearchInput.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      render();
      const el = document.getElementById('authorSearchInput') as HTMLInputElement;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  const catSelect = document.getElementById('articleCategorySelect') as HTMLSelectElement;
  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      selectedCategoryFilter = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  const authorSelect = document.getElementById('articleAuthorSelect') as HTMLSelectElement;
  if (authorSelect) {
    authorSelect.addEventListener('change', (e) => {
      selectedAuthorFilter = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  // New Article Modal
  const newArticleBtn = document.getElementById('openNewArticleModalBtn');
  if (newArticleBtn) {
    newArticleBtn.addEventListener('click', () => {
      editingPostSlug = '__NEW__';
      render();
      populateArticleForm(null);
    });
  }

  // Edit Article Buttons
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const slug = (e.currentTarget as HTMLElement).getAttribute('data-slug')!;
      editingPostSlug = slug;
      render();
      const post = await getPostBySlug(slug);
      populateArticleForm(post);
    });
  });

  // Delete Article Buttons
  document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteTargetSlug = (e.currentTarget as HTMLElement).getAttribute('data-slug')!;
      render();
    });
  });

  // New Author Modal
  const newAuthorBtn = document.getElementById('openNewAuthorModalBtn');
  if (newAuthorBtn) {
    newAuthorBtn.addEventListener('click', () => {
      editingAuthorName = '__NEW__';
      render();
      populateAuthorForm(null);
    });
  }

  // Edit Author Buttons
  document.querySelectorAll('.edit-author-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = (e.currentTarget as HTMLElement).getAttribute('data-name')!;
      editingAuthorName = name;
      render();
      const author = getAuthors()[name];
      populateAuthorForm(author);
    });
  });

  // Delete Author Buttons
  document.querySelectorAll('.delete-author-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteTargetAuthor = (e.currentTarget as HTMLElement).getAttribute('data-name')!;
      render();
    });
  });

  // Close Modals
  const closeArticleBtn = document.getElementById('closeArticleModalBtn');
  const cancelArticleBtn = document.getElementById('cancelArticleModalBtn');
  const closeArticle = () => { editingPostSlug = null; render(); };
  if (closeArticleBtn) closeArticleBtn.addEventListener('click', closeArticle);
  if (cancelArticleBtn) cancelArticleBtn.addEventListener('click', closeArticle);

  const closeAuthorBtn = document.getElementById('closeAuthorModalBtn');
  const cancelAuthorBtn = document.getElementById('cancelAuthorModalBtn');
  const closeAuthor = () => { editingAuthorName = null; render(); };
  if (closeAuthorBtn) closeAuthorBtn.addEventListener('click', closeAuthor);
  if (cancelAuthorBtn) cancelAuthorBtn.addEventListener('click', closeAuthor);

  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteTargetSlug = null;
      deleteTargetAuthor = null;
      render();
    });
  }

  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (deleteTargetSlug) {
        deletePost(deleteTargetSlug);
        showToast('✓ Article dispatch successfully deleted.');
        deleteTargetSlug = null;
      } else if (deleteTargetAuthor) {
        deleteAuthor(deleteTargetAuthor);
        showToast('✓ Contributor profile successfully removed.');
        deleteTargetAuthor = null;
      }
      render();
    });
  }

  // Export DB
  const exportBtn = document.getElementById('exportDatabaseBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `graticule_database_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✓ Database backup downloaded successfully!');
    });
  }

  // Reset Baseline
  const resetBtn = document.getElementById('resetBaselineBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all posts and authors to the original 47 editorial baseline? All local changes will be replaced.')) {
        resetToBaseline();
        showToast('✓ Restored editorial baseline (47 articles).');
        render();
      }
    });
  }

  // Update Credentials
  const credsForm = document.getElementById('updateCredsForm');
  if (credsForm) {
    credsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = (document.getElementById('newUsernameInput') as HTMLInputElement).value;
      const p = (document.getElementById('newPasswordInput') as HTMLInputElement).value;
      if (u && p) {
        updateAdminCredentials(u, p);
        showToast('✓ Admin credentials updated successfully.');
        (credsForm as HTMLFormElement).reset();
      }
    });
  }

  // Article Form Submit
  const articleForm = document.getElementById('articleForm');
  if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (document.getElementById('formPostTitle') as HTMLInputElement).value;
      const slugInput = (document.getElementById('formPostSlug') as HTMLInputElement).value;
      const author = (document.getElementById('formPostAuthor') as HTMLSelectElement).value;
      const catInput = (document.getElementById('formPostCategories') as HTMLInputElement).value;
      const excerpt = (document.getElementById('formPostExcerpt') as HTMLTextAreaElement).value;
      const coverImage = (document.getElementById('formPostCoverImage') as HTMLInputElement).value;
      const readTime = (document.getElementById('formPostReadTime') as HTMLInputElement).value;
      const bodyHtml = (document.getElementById('formPostBodyHtml') as HTMLTextAreaElement).value;

      const categories = catInput.split(',').map(s => s.trim()).filter(Boolean);

      savePost({
        title,
        slug: slugInput || undefined,
        author,
        categories,
        excerpt,
        coverImage,
        readTime: readTime || undefined
      }, bodyHtml);

      editingPostSlug = null;
      showToast('✓ Dispatch published and saved successfully!');
      render();
    });
  }

  // Author Form Submit
  const authorForm = document.getElementById('authorForm');
  if (authorForm) {
    authorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('formAuthorName') as HTMLInputElement).value;
      const title = (document.getElementById('formAuthorTitle') as HTMLInputElement).value;
      const affiliation = (document.getElementById('formAuthorAffiliation') as HTMLInputElement).value;
      const bio = (document.getElementById('formAuthorBio') as HTMLTextAreaElement).value;

      saveAuthor({
        name,
        title,
        affiliation,
        bio
      });

      editingAuthorName = null;
      showToast('✓ Contributor profile saved successfully!');
      render();
    });
  }

  // Editor Tabs (Write / Preview)
  const tabWrite = document.getElementById('tabWriteBody');
  const tabPreview = document.getElementById('tabPreviewBody');
  const writeBox = document.getElementById('editorWriteContainer');
  const previewBox = document.getElementById('editorPreviewContainer');

  if (tabWrite && tabPreview && writeBox && previewBox) {
    tabWrite.addEventListener('click', () => {
      tabWrite.classList.add('active');
      tabPreview.classList.remove('active');
      writeBox.style.display = 'block';
      previewBox.style.display = 'none';
    });

    tabPreview.addEventListener('click', () => {
      tabPreview.classList.add('active');
      tabWrite.classList.remove('active');
      writeBox.style.display = 'none';
      previewBox.style.display = 'block';
      const bodyVal = (document.getElementById('formPostBodyHtml') as HTMLTextAreaElement).value;
      previewBox.innerHTML = bodyVal || '<p>No content written yet.</p>';
    });
  }

  // Quick category tags in article modal
  document.querySelectorAll('.admin-chip-quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat')!;
      const input = document.getElementById('formPostCategories') as HTMLInputElement;
      if (input) {
        const current = input.value.split(',').map(s => s.trim()).filter(Boolean);
        if (!current.includes(cat)) {
          current.push(cat);
          input.value = current.join(', ');
        }
      }
    });
  });

  // Snippet tags in editor
  document.querySelectorAll('.admin-btn-tag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tag = (e.currentTarget as HTMLElement).getAttribute('data-tag');
      const textarea = document.getElementById('formPostBodyHtml') as HTMLTextAreaElement;
      if (!textarea) return;

      let snippet = '';
      if (tag === 'p') snippet = '<p>New paragraph of text...</p>\n';
      if (tag === 'h2') snippet = '<h2>Section Heading</h2>\n';
      if (tag === 'blockquote') snippet = '<blockquote>\n  “A notable academic quotation or insight from the research...”\n</blockquote>\n';
      if (tag === 'bib') snippet = '<h3>Bibliography</h3>\n<p>Author, A., 2024. Publication title. Journal Name, 10(2), pp.1-15.</p>\n';

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + snippet + textarea.value.substring(end);
      textarea.focus();
    });
  });

  // Auto-slug generator on typing title in create mode
  const titleInput = document.getElementById('formPostTitle') as HTMLInputElement;
  const slugInput = document.getElementById('formPostSlug') as HTMLInputElement;
  if (titleInput && slugInput && editingPostSlug === '__NEW__') {
    titleInput.addEventListener('input', () => {
      slugInput.value = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    });
  }
}

function populateArticleForm(post: Post | null) {
  const titleEl = document.getElementById('formPostTitle') as HTMLInputElement;
  const slugEl = document.getElementById('formPostSlug') as HTMLInputElement;
  const authorEl = document.getElementById('formPostAuthor') as HTMLSelectElement;
  const catEl = document.getElementById('formPostCategories') as HTMLInputElement;
  const excerptEl = document.getElementById('formPostExcerpt') as HTMLTextAreaElement;
  const imgEl = document.getElementById('formPostCoverImage') as HTMLInputElement;
  const readEl = document.getElementById('formPostReadTime') as HTMLInputElement;
  const bodyEl = document.getElementById('formPostBodyHtml') as HTMLTextAreaElement;

  if (post) {
    if (titleEl) titleEl.value = post.title;
    if (slugEl) { slugEl.value = post.slug; slugEl.readOnly = true; }
    if (authorEl) authorEl.value = post.author;
    if (catEl) catEl.value = post.categories.join(', ');
    if (excerptEl) excerptEl.value = post.excerpt;
    if (imgEl) imgEl.value = post.coverImage || '';
    if (readEl) readEl.value = post.readTime || '';
    if (bodyEl) bodyEl.value = post.bodyHtml || `<p>${post.excerpt}</p>`;
  } else {
    if (titleEl) titleEl.value = '';
    if (slugEl) { slugEl.value = ''; slugEl.readOnly = false; }
    if (catEl) catEl.value = 'Physical Geography & Glaciology';
    if (excerptEl) excerptEl.value = '';
    if (imgEl) imgEl.value = '';
    if (readEl) readEl.value = '';
    if (bodyEl) bodyEl.value = '<p>Initial introductory paragraph for this dispatch...</p>';
  }
}

function populateAuthorForm(author: Author | null) {
  const nameEl = document.getElementById('formAuthorName') as HTMLInputElement;
  const titleEl = document.getElementById('formAuthorTitle') as HTMLInputElement;
  const affilEl = document.getElementById('formAuthorAffiliation') as HTMLInputElement;
  const bioEl = document.getElementById('formAuthorBio') as HTMLTextAreaElement;

  if (author) {
    if (nameEl) { nameEl.value = author.name; nameEl.readOnly = true; }
    if (titleEl) titleEl.value = author.title;
    if (affilEl) affilEl.value = author.affiliation;
    if (bioEl) bioEl.value = author.bio || '';
  } else {
    if (nameEl) { nameEl.value = ''; nameEl.readOnly = false; }
    if (titleEl) titleEl.value = 'Contributing Researcher';
    if (affilEl) affilEl.value = 'School of Natural and Built Environment, Queen\'s University Belfast';
    if (bioEl) bioEl.value = '';
  }
}

// Initial render
render();
