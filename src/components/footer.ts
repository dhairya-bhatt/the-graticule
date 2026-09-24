import { getUrl } from '../utils/url';

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Identity -->
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="footer-monogram">G</div>
              <div>
                <div class="footer-title">THE GRATICULE</div>
                <div class="footer-tagline">A Student-led Geography Journal</div>
              </div>
            </div>
            <p class="footer-desc">
              Founded and edited by the Queen's University Belfast Geography Society. Exploring critical, human, and physical geographies, spatial dynamics, and environmental systems from Belfast to the cosmos.
            </p>
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--c-emerald); font-family: var(--font-collegiate); font-size: 0.9rem; letter-spacing: 0.08em;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              <span>QUEEN'S UNIVERSITY BELFAST &bull; 54.5844° N, 5.9340° W</span>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div>
            <h4 class="footer-col-title">DISPATCHES & PAGES</h4>
            <ul class="footer-links">
              <li><a href="${getUrl('/')}" class="footer-link">Home (Frontpage)</a></li>
              <li><a href="${getUrl('/journal/')}" class="footer-link">The Journal (All 47 Articles)</a></li>
              <li><a href="${getUrl('/about/')}" class="footer-link">About Us & Acknowledgements</a></li>
              <li><a href="${getUrl('/first-edition/')}" class="footer-link">First Edition (Inaugural Print PDF)</a></li>
              <li><a href="${getUrl('/editorial-team/')}" class="footer-link">Editorial Team Directory</a></li>
              <li><a href="${getUrl('/disclaimer/')}" class="footer-link">Submission Requirements & Disclaimers</a></li>
              <li><a href="${getUrl('/faq/')}" class="footer-link">Frequently Asked Questions</a></li>
              <li><a href="${getUrl('/contact/')}" class="footer-link">Submissions & Contact</a></li>
            </ul>
          </div>

          <!-- Col 3: Support & Socials -->
          <div>
            <h4 class="footer-col-title">COMMUNITY & WELFARE</h4>
            <ul class="footer-links" style="margin-bottom: 1.5rem;">
              <li><a href="${getUrl('/help-resources/')}" class="footer-link" style="color: var(--c-emerald); font-weight: 600;">Support Directory & Help Resources &rarr;</a></li>
              <li><a href="https://reportandsupport.qub.ac.uk" target="_blank" rel="noopener" class="footer-link">QUB Report & Support</a></li>
              <li><a href="mailto:thegraticule@outlook.com" class="footer-link">thegraticule@outlook.com</a></li>
              <li><a href="mailto:geography-society@qub.ac.uk" class="footer-link">geography-society@qub.ac.uk</a></li>
            </ul>

            <h4 class="footer-col-title" style="font-size: 1.1rem;">CONNECT WITH US</h4>
            <div class="footer-socials">
              <a href="https://twitter.com/TheGraticule" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Follow us on Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="http://instagram.com/thegraticule" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Follow us on Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.facebook.com/thegraticule" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Find us on Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/the-graticule/" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Connect on LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer Bottom: Full Disclaimer -->
        <div class="footer-bottom">
          <p class="footer-disclaimer-text">
            <strong>Disclaimer:</strong> Articles posted on 'The Graticule' represent the views and opinion of the author and may not reflect the views and opinion of the editorial board, other contributors or Queen's University Belfast.
          </p>
          <p style="white-space: nowrap;">
            &copy; ${new Date().getFullYear()} The Graticule &bull; All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  `;
}
