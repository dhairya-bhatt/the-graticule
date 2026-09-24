import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import teamData from './data/team.json';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('team')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="max-width: 800px; margin: 0 auto 4rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">EDITORIAL BOARD &bull; STUDENT INITIATIVE</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 5vw, 4.2rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
            MEET THE TEAM 2021/22
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            The student editorial team at Queen's University Belfast responsible for the re-establishment, editing, and curation of The Graticule.
          </p>
        </div>

        <!-- Team Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2.25rem; max-width: 1100px; margin: 0 auto;">
          ${teamData.map(member => `
            <div class="article-card" style="text-align: center; padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center;">
              <div style="position: relative; width: 140px; height: 140px; margin-bottom: 1.5rem;">
                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 3px solid var(--c-ink); box-shadow: var(--shadow-crisp-sm); background: var(--c-paper-warm);">
                  <img 
                    src="${member.image}" 
                    alt="${member.name}" 
                    style="width: 100%; height: 100%; object-fit: cover;"
                    loading="lazy"
                    onerror="this.src='/images/logo-g.svg'"
                  />
                </div>
                <div style="position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--c-emerald); border: 2px solid var(--c-ink); display: flex; align-items: center; justify-content: center; color: var(--c-ink);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
              </div>

              <h2 class="font-collegiate" style="font-size: 1.65rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                ${member.name}
              </h2>

              <span class="font-gothic" style="font-size: 1.15rem; color: var(--c-emerald-hover); letter-spacing: 0.04em; margin-bottom: 0.75rem;">
                ${member.role}
              </span>

              <div style="margin-top: auto; padding-top: 1rem; border-top: 1px dashed var(--c-border); width: 100%; font-size: 0.82rem; color: var(--c-ink-muted);">
                Queen's University Belfast &bull; ${member.year}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
