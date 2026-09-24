import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import { GraticuleGlobe } from './components/globe';
import { initLoadingScreen } from './components/loader';
import { getUrl } from './utils/url';

import { getPosts } from './data/store';
import categoriesData from './data/categories.json';
import aboutData from './data/about.json';

const app = document.getElementById('app');

if (app) {
  // Sort all posts with latest date first from store
  const sortedPosts = getPosts();
  // Select latest 6 posts
  const recentPosts = sortedPosts.slice(0, 6);
  // Filter out "All Posts" for category chips showcase
  const categoryChips = categoriesData.filter(c => c !== 'All Posts');

  app.innerHTML = `
    ${renderNavbar('home')}

    <main>
      <!-- Minimal Neon Green Landing Hero -->
      <section class="hero-minimal-green">
        <div class="container" style="max-width: 1260px;">
          <div class="hero-landscape-grid">
            <!-- Left Column: Title, Tagline, CTAs & Dispatches -->
            <div class="hero-left-column">
              <!-- Top Society Kicker -->
              <div style="margin-bottom: 0.85rem;">
                <span class="font-collegiate" style="color: var(--c-ink); font-size: 0.92rem; letter-spacing: 0.14em; font-weight: 700; display: inline-block; border-bottom: 1.5px solid var(--c-ink); padding-bottom: 3px;">
                  QUEEN'S UNIVERSITY BELFAST &bull; EST. 2021
                </span>
              </div>

              <!-- Title in Old English Font -->
              <h1 class="hero-minimal-title">
                The Graticule
              </h1>

              <!-- Tagline without coordinates -->
              <p class="hero-minimal-tagline">
                A Student-Led Geography Journal &bull; Queen's University Belfast
              </p>

              <!-- Brief Mission Statement -->
              <p class="font-serif" style="font-size: 1.15rem; line-height: 1.6; color: var(--c-ink-soft); margin: 0.85rem 0 0; max-width: 520px;">
                Challenging the perception of what geography can offer — exploring critical, human, and physical spatial dynamics from Belfast to the cosmos.
              </p>

              <!-- Front Action Links -->
              <div class="hero-actions-row" style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem;">
                <a href="${getUrl('/journal/')}" class="btn btn-dark" style="font-size: 1.05rem; padding: 0.75rem 1.5rem;">
                  <span>Explore 47 Articles</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
                <a href="${getUrl('/first-edition/')}" class="btn btn-outline" style="border-color: var(--c-ink); background: rgba(251, 249, 244, 0.65); font-size: 1.05rem; padding: 0.75rem 1.4rem;">
                  <span>First Edition PDF</span>
                </a>
                <a href="${getUrl('/contact/')}" class="btn btn-outline" style="border-color: var(--c-ink); background: rgba(251, 249, 244, 0.65); font-size: 1.05rem; padding: 0.75rem 1.4rem;">
                  <span>Submit Work</span>
                </a>
              </div>
            </div>

            <!-- Right Column: Interactive & Informative 3D Wireframe Globe -->
            <div class="globe-stage">
              <div id="heroGlobeContainer" style="width: 100%; max-width: 480px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative;">
                <!-- 3D Canvas & HUD tooltips injected here -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Departmental Support / Mentorship Strip (No reference image, strictly Old English G monogram) -->
      <section style="background-color: var(--c-ink); color: var(--c-paper); padding: 2.25rem 0; border-bottom: 2px solid var(--c-emerald);">
        <div class="container">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div class="brand-monogram" style="width: 44px; height: 44px; font-size: 2rem;">G</div>
              <div>
                <span class="font-collegiate" style="font-size: 1.15rem; letter-spacing: 0.06em; color: var(--c-emerald); display: block;">A GEOGRAPHY SOCIETY STUDENT INITIATIVE</span>
                <span style="font-size: 0.85rem; color: var(--c-ink-faint);">Queen's University Belfast &bull; Faculty Mentorship & Departmental Backing</span>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; font-size: 0.88rem;">
              <span style="color: var(--c-ink-faint);">Special Departmental Thanks:</span>
              <span style="font-weight: 600; color: var(--c-paper); border-left: 2px solid var(--c-emerald); padding-left: 0.6rem;">Dr Diarmid Finnegan</span>
              <span style="font-weight: 600; color: var(--c-paper); border-left: 2px solid var(--c-emerald); padding-left: 0.6rem;">Dr Tristan Sturm</span>
              <span style="font-weight: 600; color: var(--c-paper); border-left: 2px solid var(--c-emerald); padding-left: 0.6rem;">Dr Oliver Dunnett</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission Creed Section -->
      <section style="padding: 5.5rem 0 4.5rem; background-color: var(--c-paper-warm); border-bottom: 1.5px solid var(--c-border);">
        <div class="container">
          <div style="max-width: 920px; margin: 0 auto; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
              <span class="font-collegiate" style="font-size: 0.88rem; letter-spacing: 0.12em; color: var(--c-emerald-hover); font-weight: 700;">
                EDITORIAL CREED &bull; ISSUE 2021/22
              </span>
            </div>
            <blockquote class="font-serif" style="font-size: clamp(1.25rem, 2.2vw, 1.75rem); line-height: 1.6; color: var(--c-ink); font-style: italic; margin-bottom: 1.75rem;">
              “${aboutData.missionParagraph2}”
            </blockquote>
            <cite class="font-collegiate" style="font-size: 0.92rem; letter-spacing: 0.08em; color: var(--c-ink-soft); display: block; font-style: normal; margin-bottom: 1.75rem;">
              THE GRATICULE EDITORIAL BOARD &bull; SCHOOL OF NATURAL AND BUILT ENVIRONMENT
            </cite>
            <div>
              <a href="${getUrl('/about/')}" class="btn btn-outline" style="border-color: var(--c-ink); font-size: 1rem;">
                <span>Read Full Mission Statement & Archive Scans &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent / Featured Articles -->
      <section style="padding: 5rem 0; background-color: var(--c-paper);">
        <div class="container">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="font-gothic" style="font-size: 1.3rem; color: var(--c-emerald);">&#10022;</span>
                <span class="font-collegiate" style="font-size: 1rem; letter-spacing: 0.1em; color: var(--c-emerald); font-weight: 700;">RECENT DISPATCHES</span>
              </div>
              <h2 class="font-collegiate" style="font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1; letter-spacing: 0.05em; color: var(--c-ink);">
                LATEST ARTICLES FROM THE ARCHIVE
              </h2>
            </div>
            <a href="${getUrl('/journal/')}" class="btn btn-primary" style="font-size: 1.05rem;">
              <span>View All 47 Articles &rarr;</span>
            </a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
            ${recentPosts.map((post) => `
              <article class="article-card">
                <a href="${getUrl('/post/?slug=' + encodeURIComponent(post.slug))}" style="display: flex; flex-direction: column; height: 100%;">
                  <div class="article-card-media">
                    <img 
                      src="${post.coverImage || getUrl('/images/logo-g.svg')}" 
                      alt="${post.title}" 
                      class="article-card-img" 
                      loading="lazy"
                      onerror="this.src='${getUrl('/images/logo-g.svg')}'"
                    />
                    <div class="article-card-stamp">${post.categories[0] || 'Geography'}</div>
                  </div>
                  <div class="article-card-body">
                    <div class="article-card-meta">
                      <span>${new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>&bull;</span>
                      <span>${post.readTime}</span>
                    </div>
                    <h3 class="article-card-title">${post.title}</h3>
                    <p class="article-card-excerpt">${post.excerpt}</p>
                    <div class="article-card-footer">
                      <span class="article-author">${post.author}</span>
                      <span class="article-readmore">Read Article &rarr;</span>
                    </div>
                  </div>
                </a>
              </article>
            `).join('')}
          </div>
        </div>
      </section>


      <!-- First Edition Teaser Section -->
      <section style="padding: 5.5rem 0; background-color: var(--c-ink); color: var(--c-paper); border-bottom: 2px solid var(--c-emerald);">
        <div class="container">
          <div style="display: grid; grid-template-columns: 1fr; gap: 3.5rem; align-items: center;" class="first-edition-grid">
            <div style="display: flex; justify-content: center;">
              <div style="position: relative; max-width: 360px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); border-radius: var(--radius-sm); border: 2px solid var(--c-emerald); overflow: hidden;">
                <img 
                  src="https://static.wixstatic.com/media/c7bda6_5b0794debc054281801a59ac0a843ce0~mv2.png/v1/fill/w_600,h_849,al_c,q_85,enc_avif,quality_auto/c7bda6_5b0794debc054281801a59ac0a843ce0~mv2.png" 
                  alt="First Edition Cover Preview" 
                  style="width: 100%; height: auto;"
                  onerror="this.src='/images/logo-g.svg'"
                />
                <div style="position: absolute; bottom: 0; inset-inline: 0; background: linear-gradient(to top, rgba(13,30,24,0.95), transparent); padding: 1.5rem 1rem 1rem; text-align: center;">
                  <span class="font-collegiate" style="color: var(--c-emerald); font-size: 1.1rem; letter-spacing: 0.08em;">INAUGURAL PRINT VOLUME &bull; 2021/22</span>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 620px;">
              <div style="display: inline-flex; align-items: center; gap: 0.5rem; width: fit-content; background: rgba(40, 178, 111, 0.15); border: 1px solid var(--c-emerald); padding: 0.35rem 0.85rem; border-radius: var(--radius-sm);">
                <span class="font-collegiate" style="color: var(--c-emerald); font-size: 0.85rem; letter-spacing: 0.08em;">HISTORIC PUBLICATION ARCHIVE</span>
              </div>

              <h2 class="font-collegiate" style="font-size: clamp(2.2rem, 5vw, 3.6rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-paper);">
                THE FIRST EDITION (2021/22 PRINT VOLUME)
              </h2>

              <p class="font-serif" style="font-size: 1.15rem; line-height: 1.6; color: rgba(251, 249, 244, 0.85);">
                The physical inaugural publication that marked the re-establishment of The Graticule at Queen's University Belfast. Complete with student field dispatches, academic commentary, and original cartographic work.
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
                <a href="${getUrl('/first-edition/')}" class="btn btn-primary">
                  <span>View Interactive Viewer & Details</span>
                </a>
                <a href="${getUrl('/documents/first_edition.pdf')}" target="_blank" download class="btn btn-ocean">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download Full PDF (74.5 MB)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;

  // Initialize interactive components
  initLoadingScreen();
  initNavbarInteractions();
  
  const globe = new GraticuleGlobe('heroGlobeContainer');
}

