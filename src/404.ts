import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar()}

    <main style="padding: 6rem 0; min-height: 75vh; display: flex; align-items: center;">
      <div class="container" style="max-width: 720px; text-align: center;">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: rgba(40, 178, 111, 0.15); border: 2.5px solid var(--c-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: var(--c-emerald);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </div>

        <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;" class="stamp-chip">
          <span style="color: var(--c-emerald);">&#10022;</span>
          <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">ERROR 404 &bull; TERRA INCOGNITA</span>
        </div>

        <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
          YOU'VE WANDERED OFF THE MAP
        </h1>

        <p class="font-serif" style="font-size: 1.25rem; line-height: 1.6; color: var(--c-ink-soft); margin-bottom: 2.5rem;">
          The coordinate or meridian you are searching for does not exist in our charts. Let's recalculate your bearings back to known territory.
        </p>

        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/" class="btn btn-primary">
            <span>&larr; Return to Base Camp (Home)</span>
          </a>
          <a href="/journal/" class="btn btn-outline">
            <span>Browse The Journal Archive</span>
          </a>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();
}
