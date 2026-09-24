import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import { getUrl } from './utils/url';
import faqData from './data/faq.json';

const app = document.getElementById('app');

if (app) {
  app.innerHTML = `
    ${renderNavbar('faq')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="max-width: 800px; margin: 0 auto 3.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">CONTRIBUTOR GUIDANCE</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 5vw, 4.2rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
            FREQUENTLY ASKED QUESTIONS
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            Clarifications on contributing, disciplinary criteria, formats, and journal operations.
          </p>
        </div>

        <!-- Accordion Container -->
        <div style="max-width: 840px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
          ${faqData.map((item, idx) => `
            <div class="faq-item" style="background: #ffffff; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); overflow: hidden; box-shadow: var(--shadow-sm); transition: border-color var(--tr-fast);">
              <button 
                class="faq-trigger" 
                aria-expanded="${idx === 0 ? 'true' : 'false'}" 
                style="width: 100%; padding: 1.5rem 1.75rem; text-align: left; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 1rem;"
              >
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <span class="font-gothic" style="font-size: 1.4rem; color: var(--c-emerald); line-height: 1;">
                    0${idx + 1}
                  </span>
                  <span class="font-collegiate" style="font-size: 1.4rem; letter-spacing: 0.05em; color: var(--c-ink);">
                    ${item.question}
                  </span>
                </div>
                <div class="faq-chevron" style="width: 28px; height: 28px; border-radius: 50%; background: var(--c-paper-warm); display: flex; align-items: center; justify-content: center; color: var(--c-ink); transition: transform 250ms ease; flex-shrink: 0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>

              <div class="faq-content" style="max-height: ${idx === 0 ? '500px' : '0'}; overflow: hidden; transition: max-height 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease; opacity: ${idx === 0 ? '1' : '0'};">
                <div style="padding: 0 1.75rem 1.75rem 3.6rem;">
                  <p class="font-serif" style="font-size: 1.15rem; line-height: 1.7; color: var(--c-ink-soft); margin: 0; border-top: 1px dashed var(--c-border-faint); padding-top: 1rem;">
                    ${item.answer}
                  </p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Still have questions? -->
        <div style="max-width: 640px; margin: 4rem auto 0; text-align: center; background: var(--c-paper-warm); border: 1px dashed var(--c-border); border-radius: var(--radius-sm); padding: 2rem;">
          <h3 class="font-collegiate" style="font-size: 1.6rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.5rem;">
            STILL HAVE QUESTIONS?
          </h3>
          <p style="font-size: 0.95rem; color: var(--c-ink-muted); margin-bottom: 1.25rem;">
            Reach out directly to the editorial board or contact us through our official society channels.
          </p>
          <a href="${getUrl('/contact/')}" class="btn btn-primary" style="font-size: 1.05rem;">
            <span>Contact The Editorial Team &rarr;</span>
          </a>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();

  // Accordion Logic
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const item = btn.closest('.faq-item');
      if (!item) return;

      const content = item.querySelector('.faq-content') as HTMLElement;
      const chevron = item.querySelector('.faq-chevron') as HTMLElement;

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (content) {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
        }
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (content) {
          content.style.maxHeight = `${content.scrollHeight + 50}px`;
          content.style.opacity = '1';
        }
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      }
    });
  });
}
