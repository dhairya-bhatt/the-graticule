import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import aboutData from './data/about.json';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('about')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="max-width: 820px; margin: 0 auto 3.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">MISSION & DEPARTMENTAL ORIGINS</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 5vw, 4.2rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
            ABOUT THE GRATICULE
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            The student-led geography journal founded by Queen's University Belfast Geography Society.
          </p>
        </div>

        <!-- Mission Statement Box -->
        <section style="max-width: 880px; margin: 0 auto 5rem; background-color: #ffffff; border: 2px solid var(--c-ink); border-radius: var(--radius-md); padding: clamp(2rem, 5vw, 3.5rem); box-shadow: var(--shadow-crisp);">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; border-bottom: 2px solid var(--c-emerald); padding-bottom: 1rem;">
            <div class="brand-monogram" style="width: 38px; height: 38px; font-size: 1.8rem;">𝔊</div>
            <h2 class="font-collegiate" style="font-size: 2rem; letter-spacing: 0.06em; color: var(--c-ink); margin: 0;">
              OUR MISSION
            </h2>
          </div>

          <div class="font-serif" style="font-size: 1.25rem; line-height: 1.8; color: var(--c-ink); display: flex; flex-direction: column; gap: 1.75rem;">
            <p>${aboutData.missionParagraph1}</p>
            <p>${aboutData.missionParagraph2}</p>
          </div>
        </section>

        <!-- Departmental Acknowledgements -->
        <section style="max-width: 880px; margin: 0 auto 5rem;">
          <div style="text-align: center; margin-bottom: 2.5rem;">
            <h2 class="font-collegiate" style="font-size: 2.6rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.75rem;">
              FACULTY ACKNOWLEDGEMENTS
            </h2>
            <p class="font-serif" style="font-size: 1.15rem; color: var(--c-ink-soft); line-height: 1.7; max-width: 780px; margin: 0 auto;">
              ${aboutData.acknowledgements}
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            ${aboutData.faculty.map(prof => `
              <div style="background-color: var(--c-paper-warm); border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); padding: 1.75rem; text-align: center; box-shadow: var(--shadow-sm); transition: transform var(--tr-fast);">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--c-ink); color: var(--c-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; border: 2px solid var(--c-emerald);">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <h3 class="font-collegiate" style="font-size: 1.45rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  ${prof.name}
                </h3>
                <p style="font-size: 0.88rem; color: var(--c-ink-muted);">
                  ${prof.role}
                </p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Print Edition Scans Gallery -->
        <section style="max-width: 1040px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
              <span class="font-gothic" style="color: var(--c-emerald);">&sect;</span>
              <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">HISTORIC PHYSICAL RELEASES</span>
            </div>
            <h2 class="font-collegiate" style="font-size: 2.8rem; letter-spacing: 0.05em; color: var(--c-ink);">
              SCANNED PRINT EDITION ARCHIVE
            </h2>
            <p class="font-serif" style="font-size: 1.15rem; color: var(--c-ink-muted); margin-top: 0.5rem;">
              Original print edition covers and historic publication pages preserved from the archives.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${aboutData.scans.map((scan, i) => `
              <div style="background-color: #ffffff; border: 1.5px solid var(--c-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform var(--tr-base);" class="article-card">
                <div style="aspect-ratio: 3 / 4; overflow: hidden; background: var(--c-paper-warm); cursor: pointer;" class="scan-img-container" data-idx="${i}">
                  <img 
                    src="${scan.url}" 
                    alt="${scan.title}" 
                    style="width: 100%; height: 100%; object-fit: cover;"
                    loading="lazy"
                  />
                </div>
                <div style="padding: 1.25rem; text-align: center; border-top: 1px solid var(--c-border-faint);">
                  <h3 class="font-collegiate" style="font-size: 1.3rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.25rem;">
                    ${scan.title}
                  </h3>
                  <p style="font-size: 0.88rem; color: var(--c-ink-muted); font-style: italic;">
                    ${scan.caption}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
