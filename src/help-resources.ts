import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import resourcesData from './data/resources.json';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('help resources')}

    <main style="padding: 3.5rem 0 6rem; background-color: var(--c-paper);">
      <div class="container" style="max-width: 920px;">
        <!-- Header: Calmer, restrained, high-legibility -->
        <div style="margin-bottom: 3.5rem; text-align: left; border-bottom: 2px solid var(--c-ink); padding-bottom: 2rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--c-ocean);"></span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">SUPPORT DIRECTORY &bull; COMMUNITY CARE</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 0.95; letter-spacing: 0.04em; color: var(--c-ink); margin-bottom: 1rem;">
            HELP & SUPPORT RESOURCES
          </h1>

          <p class="font-serif" style="font-size: 1.25rem; color: var(--c-ink-soft); line-height: 1.6; max-width: 780px;">
            A verified directory of campus, regional, and national support organizations. If you or someone you know is in distress or needs confidential advice, these services are available.
          </p>

          <!-- Emergency banner -->
          <div style="margin-top: 1.75rem; background-color: #ffffff; border-left: 4px solid var(--c-ocean); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; padding: 1rem 1.25rem; border-top: 1px solid var(--c-border); border-right: 1px solid var(--c-border); border-bottom: 1px solid var(--c-border);">
            <p style="font-size: 0.95rem; color: var(--c-ink); margin: 0; line-height: 1.5;">
              <strong>Immediate danger:</strong> In an emergency, please call <strong>999</strong> (UK & Northern Ireland) immediately.
            </p>
          </div>
        </div>

        <!-- Categorized Sections -->
        <div style="display: flex; flex-direction: column; gap: 3.5rem;">
          ${resourcesData.categories.map(cat => `
            <section style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div style="border-bottom: 1.5px solid var(--c-border); padding-bottom: 0.5rem;">
                <h2 class="font-collegiate" style="font-size: 1.85rem; letter-spacing: 0.06em; color: var(--c-ink); margin-bottom: 0.25rem;">
                  ${cat.title}
                </h2>
                <p style="font-size: 0.95rem; color: var(--c-ink-muted);">
                  ${cat.description}
                </p>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${cat.items.map(item => `
                  <div style="background-color: #ffffff; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); padding: 1.5rem; transition: border-color var(--tr-fast); display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 0.5rem;">
                      <h3 class="font-collegiate" style="font-size: 1.35rem; letter-spacing: 0.05em; color: var(--c-ink);">
                        ${item.name}
                      </h3>
                      ${item.badge ? `
                        <span style="font-family: var(--font-collegiate); font-size: 0.75rem; letter-spacing: 0.08em; background-color: var(--c-paper-warm); color: var(--c-ink); border: 1px solid var(--c-border); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">
                          ${item.badge}
                        </span>
                      ` : ''}
                    </div>

                    <p style="font-size: 0.95rem; color: var(--c-ink-soft); line-height: 1.6; margin: 0;">
                      ${item.description}
                    </p>

                    <!-- Contact Details Actions -->
                    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 0.25rem; font-size: 0.9rem;">
                      ${item.phone ? `
                        <a href="tel:${item.phone.replace(/\s+/g, '')}" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.9rem; border-color: var(--c-emerald); color: var(--c-ink);">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                          <span>${item.phone}</span>
                        </a>
                      ` : ''}

                      ${item.email ? `
                        <a href="mailto:${item.email}" class="btn btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.9rem; border-color: var(--c-ink); color: var(--c-ink);">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          <span>${item.email}</span>
                        </a>
                      ` : ''}

                      ${item.url ? `
                        <a href="${item.url}" target="_blank" rel="noopener" style="color: var(--c-ocean); font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: underline; text-underline-offset: 3px;">
                          <span>Visit Website &rarr;</span>
                        </a>
                      ` : ''}

                      <span style="color: var(--c-ink-faint); font-size: 0.85rem; margin-left: auto;">
                        ${item.contact}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>

        <!-- Footer Notice from live page -->
        <div style="margin-top: 4rem; padding: 1.75rem; background-color: var(--c-paper-warm); border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); text-align: center;">
          <p style="font-family: var(--font-collegiate); font-size: 1.15rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.5rem;">
            ${resourcesData.footerNotice}
          </p>
          <a href="/contact/" style="color: var(--c-emerald-hover); font-weight: 700; font-size: 0.95rem; text-decoration: underline;">
            Contact The Graticule Editorial Board &rarr;
          </a>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
