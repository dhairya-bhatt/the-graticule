import { getUrl } from '../utils/url';

export function renderNavbar(activePage: string = '') {
  const navItems = [
    { label: 'Home', href: getUrl('/') },
    { label: 'Journal', href: getUrl('/journal/') },
    { label: 'About', href: getUrl('/about/') },
    { label: 'First Edition', href: getUrl('/first-edition/') },
    { label: 'Team', href: getUrl('/editorial-team/') },
    { label: 'FAQ', href: getUrl('/faq/') },
    { label: 'Help Resources', href: getUrl('/help-resources/') },
    { label: 'Contact', href: getUrl('/contact/') },
  ];

  return `
    <header class="site-header" id="siteHeader">
      <div class="container header-inner" style="max-width: 1400px;">
        <!-- Left: Dignified Masthead with Old English Monogram -->
        <div class="header-brand-wrap">
          <a href="${getUrl('/')}" class="brand-link" aria-label="The Graticule Homepage">
            <div class="brand-monogram">G</div>
            <div class="brand-titles">
              <span class="brand-title">THE GRATICULE</span>
              <span class="brand-subtitle">STUDENT-LED GEOGRAPHY JOURNAL &bull; QUEEN'S UNIVERSITY BELFAST</span>
            </div>
          </a>
        </div>

        <!-- Right: Sleek Cartographic Menu Trigger -->
        <div class="header-actions">
          <button class="mobile-globe-btn header-globe-btn" id="mobileGlobeBtn" aria-label="Toggle Full Navigation Menu" aria-expanded="false" title="Open Navigation Menu">
            <div class="mobile-globe-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <span class="header-globe-text font-collegiate">MENU</span>
          </button>
        </div>
      </div>

      <!-- Full Background Overlay Menu -->
      <div class="mobile-overlay" id="mobileOverlay" aria-hidden="true">
        <div style="position: absolute; top: 1.5rem; right: 2rem; display: flex; align-items: center; gap: 1rem;">
          <button id="closeOverlayBtn" style="background: none; border: 1.5px solid rgba(20, 226, 129, 0.4); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--c-neon-green); cursor: pointer; transition: all var(--tr-fast);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="footer-monogram" style="font-size: 2.2rem; width: 44px; height: 44px;">G</div>
            <div>
              <span class="font-collegiate" style="font-size: 1.8rem; letter-spacing: 0.08em; color: var(--c-paper);">THE GRATICULE</span>
              <span style="display: block; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--c-emerald); font-weight: 700;">Navigation Chart &bull; QUB</span>
            </div>
          </div>
        </div>

        <div class="mobile-nav-links">
          ${navItems.map((item, idx) => `
            <a href="${item.href}" class="mobile-nav-link ${activePage === item.label.toLowerCase() ? 'active' : ''}">
              <span>${item.label}</span>
              <span class="font-old-english" style="font-size: 1.5rem; color: var(--c-emerald); opacity: 0.8;">0${idx + 1}</span>
            </a>
          `).join('')}
        </div>

        <div class="mobile-overlay-footer">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span class="font-collegiate" style="color: var(--c-emerald); font-size: 1.15rem; letter-spacing: 0.05em;">QUB GEOGRAPHY SOCIETY</span>
            <span style="font-family: var(--font-collegiate); letter-spacing: 0.05em; color: var(--c-paper);">BELFAST &bull; NORTHERN IRELAND</span>
          </div>
          <p style="font-size: 0.82rem; opacity: 0.75; color: rgba(251, 249, 244, 0.7);">
            Queen's University Belfast &bull; The Graticule Editorial Board
          </p>
        </div>
      </div>
    </header>
  `;
}

export function initNavbarInteractions() {
  const btn = document.getElementById('mobileGlobeBtn');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeOverlayBtn');

  const toggleOverlay = (open?: boolean) => {
    if (!btn || !overlay) return;
    const shouldOpen = open !== undefined ? open : !overlay.classList.contains('active');
    btn.classList.toggle('open', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    btn.setAttribute('aria-expanded', String(shouldOpen));
    overlay.setAttribute('aria-hidden', String(!shouldOpen));
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (btn) btn.addEventListener('click', () => toggleOverlay());
  if (closeBtn) closeBtn.addEventListener('click', () => toggleOverlay(false));

  // Close menu on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('active')) {
      toggleOverlay(false);
    }
  });
}

