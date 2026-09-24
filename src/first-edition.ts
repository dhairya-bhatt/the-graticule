import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('first edition')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="max-width: 880px; margin: 0 auto 3.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">INAUGURAL PUBLICATION &bull; 2021/22</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.4rem, 5vw, 4rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
            FIRST EDITION (PDF)
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            The complete, uncompressed inaugural print volume of The Graticule, published by the Queen's University Belfast Geography Society.
          </p>
        </div>

        <!-- Cover & Download Callout -->
        <div style="max-width: 880px; margin: 0 auto 4rem; background: var(--c-paper-warm); border: 2px solid var(--c-ink); border-radius: var(--radius-md); padding: clamp(2rem, 5vw, 3.5rem); box-shadow: var(--shadow-crisp); display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center;" class="first-edition-grid">
          <div style="display: flex; justify-content: center;">
            <a href="/documents/first_edition.pdf" target="_blank" download="The_Graticule_First_Edition_2021_22.pdf" title="Click to download The Graticule First Edition PDF" style="display: block; position: relative; max-width: 320px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid var(--c-ink); box-shadow: var(--shadow-crisp); transition: transform var(--tr-base);">
              <img 
                src="https://static.wixstatic.com/media/c7bda6_5b0794debc054281801a59ac0a843ce0~mv2.png/v1/fill/w_600,h_849,al_c,q_85,enc_avif,quality_auto/c7bda6_5b0794debc054281801a59ac0a843ce0~mv2.png" 
                alt="The Graticule First Edition Cover"
                style="width: 100%; height: auto;" 
                onerror="this.src='/images/logo-g.svg'"
              />
              <div style="position: absolute; inset: 0; background: rgba(13, 30, 24, 0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--tr-fast); color: #ffffff;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span class="font-collegiate" style="font-size: 1.1rem; letter-spacing: 0.08em; margin-top: 0.5rem;">CLICK TO DOWNLOAD</span>
              </div>
            </a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <h2 class="font-collegiate" style="font-size: clamp(1.8rem, 3.5vw, 2.5rem); line-height: 1.05; letter-spacing: 0.04em; color: var(--c-ink);">
              CLICK ON THE COVER TO DOWNLOAD THE FIRST EDITION OF THE GRATICULE
            </h2>

            <p class="font-serif" style="font-size: 1.1rem; color: var(--c-ink-soft); line-height: 1.6;">
              Featuring undergraduate and postgraduate research papers, student field reports, faculty interviews, and cartographic analysis celebrating the re-launch of the journal.
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
              <a href="/documents/first_edition.pdf" target="_blank" download="The_Graticule_First_Edition_2021_22.pdf" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download PDF (74.5 MB)</span>
              </a>
              <a href="#pdfViewerSection" class="btn btn-outline">
                <span>View Online Below &darr;</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Section Divider -->
        <div class="graticule-divider" id="pdfViewerSection">
          <div class="graticule-line"></div>
          <div class="graticule-badge">
            <span class="font-collegiate" style="font-size: 1.15rem; color: var(--c-ink);">OR SCROLL DOWN AND VIEW IT HERE</span>
          </div>
        </div>

        <!-- Embedded Interactive PDF Viewer -->
        <div style="max-width: 980px; margin: 3rem auto 0; border: 2px solid var(--c-ink); border-radius: var(--radius-md); overflow: hidden; background: #525659; box-shadow: var(--shadow-crisp);">
          <div style="background-color: var(--c-ink); color: var(--c-paper); padding: 0.75rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--c-emerald);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="brand-monogram" style="width: 26px; height: 26px; font-size: 1.3rem;">𝔊</div>
              <span class="font-collegiate" style="font-size: 1.1rem; letter-spacing: 0.06em; color: var(--c-emerald);">
                THE GRATICULE &bull; 2021/22 INAUGURAL ISSUE
              </span>
            </div>
            <a href="/documents/first_edition.pdf" target="_blank" style="color: var(--c-paper); font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.35rem; text-decoration: underline;">
              <span>Open in New Tab</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          <iframe 
            src="/documents/first_edition.pdf#toolbar=1&navpanes=1" 
            title="The Graticule First Edition PDF Viewer" 
            style="width: 100%; height: 820px; border: none; display: block; background: #ffffff;"
            loading="lazy"
          >
            <div style="padding: 3rem; text-align: center; background: var(--c-paper);">
              <p>Your browser does not support inline PDF viewing.</p>
              <a href="/documents/first_edition.pdf" class="btn btn-primary" style="margin-top: 1rem;">
                Download The Graticule PDF (74.5 MB)
              </a>
            </div>
          </iframe>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
