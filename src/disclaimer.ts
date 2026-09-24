import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import disclaimerData from './data/disclaimer.json';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('disclaimer')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container" style="max-width: 860px;">
        <!-- Header -->
        <div style="margin-bottom: 3.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">ACADEMIC & EDITORIAL STANDARDS</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.4rem, 5vw, 4rem); line-height: 0.95; letter-spacing: 0.04em; color: var(--c-ink); margin-bottom: 1.25rem;">
            DISCLAIMER &amp; SUBMISSION REQUIREMENTS
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            Essential guidelines for authors, researchers, and contributors submitting work to The Graticule.
          </p>
        </div>

        <!-- Disclaimer Box -->
        <section style="background: #ffffff; border: 2px solid var(--c-ink); border-radius: var(--radius-md); padding: 2.25rem; margin-bottom: 3rem; box-shadow: var(--shadow-crisp);">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--c-ink); color: var(--c-emerald); display: flex; align-items: center; justify-content: center;">
              <span class="font-gothic" style="font-size: 1.2rem;">&sect;</span>
            </div>
            <h2 class="font-collegiate" style="font-size: 1.6rem; letter-spacing: 0.05em; color: var(--c-ink); margin: 0;">
              DISCLAIMER
            </h2>
          </div>

          <blockquote class="font-serif" style="font-size: 1.2rem; line-height: 1.7; color: var(--c-ink-soft); font-style: italic; border-left: 3px solid var(--c-emerald); padding-left: 1.25rem; margin: 0;">
            ${disclaimerData.disclaimer}
          </blockquote>
        </section>

        <!-- Requirements Box -->
        <section style="background: var(--c-paper-warm); border: 2px solid var(--c-ink); border-radius: var(--radius-md); padding: clamp(2rem, 4vw, 3rem); box-shadow: var(--shadow-crisp);">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem; border-bottom: 1.5px solid var(--c-border); padding-bottom: 1rem;">
            <div class="brand-monogram" style="width: 32px; height: 32px; font-size: 1.5rem;">𝔊</div>
            <h2 class="font-collegiate" style="font-size: 1.8rem; letter-spacing: 0.05em; color: var(--c-ink); margin: 0;">
              SUBMISSION REQUIREMENTS
            </h2>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${disclaimerData.requirements.map((req, idx) => `
              <div style="display: flex; gap: 1rem; align-items: flex-start; background: #ffffff; padding: 1.25rem 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--c-border); box-shadow: var(--shadow-sm);">
                <div style="width: 28px; height: 28px; border-radius: var(--radius-sm); background: var(--c-ink); color: var(--c-emerald); display: flex; align-items: center; justify-content: center; font-family: var(--font-collegiate); font-size: 1.1rem; flex-shrink: 0;">
                  0${idx + 1}
                </div>
                <p class="font-serif" style="font-size: 1.15rem; line-height: 1.6; color: var(--c-ink); margin: 0;">
                  ${req}
                </p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 2.5rem; text-align: center;">
            <a href="/contact/" class="btn btn-primary" style="font-size: 1.15rem; padding: 0.85rem 2rem;">
              <span>Proceed to Submission Form &rarr;</span>
            </a>
          </div>
        </section>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
