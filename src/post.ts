import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import { getPosts, getPostBySlug, Post } from './data/store';

const postsList: Post[] = getPosts();

const urlParams = new URLSearchParams(window.location.search);
let slug = urlParams.get('slug') || '';

if (!slug) {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length > 1 && parts[0] === 'post') {
    slug = decodeURIComponent(parts[1]);
  }
}

// Fallback to first post if invalid
const foundPost = postsList.find(p => p.slug === slug);
if (!foundPost) {
  slug = postsList[0].slug;
}

const postMeta = postsList.find(p => p.slug === slug) || postsList[0];
const currentIndex = postsList.findIndex(p => p.slug === slug);
const prevPost = currentIndex > 0 ? postsList[currentIndex - 1] : null;
const nextPost = currentIndex < postsList.length - 1 ? postsList[currentIndex + 1] : null;

document.title = `${postMeta.title} | The Graticule`;

const app = document.getElementById('app');

async function loadPostContent(): Promise<Post> {
  return await getPostBySlug(slug);
}

function cleanArticleContent(postData: any): string {
  const rawHtml = postData.bodyHtml || '';
  if (!rawHtml) {
    return `<p>${postData.excerpt || ''}</p><p>${postData.bodyText || ''}</p>`;
  }

  // 1. Extract content from post-description if available
  let contentHtml = rawHtml;
  const descIdx = rawHtml.indexOf('data-hook="post-description"');
  if (descIdx !== -1) {
    const openTag = rawHtml.lastIndexOf('<', descIdx);
    const footerIdx = rawHtml.indexOf('data-hook="post-footer"', descIdx);
    const endIdx = footerIdx !== -1 ? rawHtml.lastIndexOf('<', footerIdx) : rawHtml.length;
    contentHtml = rawHtml.substring(openTag, endIdx);
  }

  // 2. Parse into DOM to clean unwanted Wix UI artifacts
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentHtml, 'text/html');

  // Remove Wix UI action bars, skeletons, more buttons, and footers
  doc.querySelectorAll('[data-hook="more-button"], [data-hook="skeleton-loader"], [data-hook="post-main-actions-desktop"], [data-hook="post-footer"], [data-hook="post-header"]').forEach(el => el.remove());

  // Unwrap buttons that contain images (such as gallery items with lightbox triggers) rather than deleting them
  doc.querySelectorAll('button').forEach(btn => {
    if (btn.querySelector('img, figure')) {
      const parent = btn.parentNode;
      if (parent) {
        while (btn.firstChild) {
          parent.insertBefore(btn.firstChild, btn);
        }
      }
      btn.remove();
    } else {
      btn.remove();
    }
  });

  // Upgrade all images to full crisp high resolution
  doc.querySelectorAll('img').forEach(img => {
    // If it's a writer avatar or icon, remove it
    if (img.getAttribute('alt')?.includes('Writer:') || img.getAttribute('role') === 'img') {
      const parent = img.closest('[data-hook="post-header"], .writer-info, [data-hook="user-profile-image"]');
      if (parent) {
        parent.remove();
        return;
      }
    }

    const pinMedia = img.getAttribute('data-pin-media');
    const srcSet = img.getAttribute('srcset') || img.getAttribute('srcSet') || '';
    const currentSrc = img.getAttribute('src') || '';

    let highResUrl = '';

    // If data-pin-media is present, it contains Wix's crisp high-resolution fill
    if (pinMedia && pinMedia.startsWith('http')) {
      highResUrl = pinMedia;
    } else if (srcSet) {
      // Find the highest resolution descriptor in srcset (e.g. 960w, 1200w, etc.)
      const entries = srcSet.split(',').map(s => s.trim().split(/\s+/));
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry[0] && lastEntry[0].startsWith('http')) {
          highResUrl = lastEntry[0];
        }
      }
    }

    if (!highResUrl && currentSrc.includes('static.wixstatic.com/media/')) {
      // Extract the media file identifier and construct full original URL or high-res fill
      const wixMatch = currentSrc.match(/https:\/\/static\.wixstatic\.com\/media\/([^/]+)/);
      if (wixMatch) {
        const fileId = wixMatch[1];
        highResUrl = `https://static.wixstatic.com/media/${fileId}`;
      }
    }

    if (highResUrl) {
      img.setAttribute('src', highResUrl);
    }

    // Clean obsolete attributes and set full-width body image class
    img.removeAttribute('data-pin-media');
    img.removeAttribute('data-pin-url');
    img.removeAttribute('srcset');
    img.removeAttribute('srcSet');
    img.removeAttribute('sizes');
    img.removeAttribute('draggable');
    img.removeAttribute('loading');
    img.setAttribute('loading', 'lazy');
    img.classList.add('article-body-img');
  });

  // Clean and simplify figure structures so images match the reading text width
  doc.querySelectorAll('figure').forEach(fig => {
    fig.classList.add('article-body-figure');

    // Extract caption text if present
    const captionEl = fig.querySelector('figcaption, [id*="caption"], .s-wIz, ._4pYSO');
    const captionText = captionEl ? captionEl.textContent?.trim() : '';

    // Find the image inside
    const img = fig.querySelector('img');
    if (img) {
      // Clear out nested arbitrary Wix layout wrappers
      fig.innerHTML = '';
      fig.appendChild(img);
      if (captionText) {
        const figcap = doc.createElement('figcaption');
        figcap.className = 'article-figure-caption';
        figcap.textContent = captionText;
        fig.appendChild(figcap);
      }
    }
  });

  // Handle gallery containers (e.g., in photo essays)
  doc.querySelectorAll('[data-hook="gallery-grid"], [data-hook="gallery-viewer"], ul.m4BVE').forEach(gal => {
    gal.classList.add('article-gallery-grid');
  });

  // Clean empty paragraphs or empty spacers
  doc.querySelectorAll('div[type="first"], div[type="paragraph"], div[type="last"]').forEach(el => {
    if (!el.textContent?.trim() && el.children.length === 0) {
      el.remove();
    }
  });

  // Sanitize inline styles that override text colors or font families
  doc.querySelectorAll('*').forEach(el => {
    if (el instanceof HTMLElement) {
      el.removeAttribute('data-hook');
      el.removeAttribute('data-rce-version');
      el.removeAttribute('dir');
      el.removeAttribute('tabindex');

      const style = el.getAttribute('style') || '';
      const textAlign = el.style.textAlign;
      const isItalic = style.includes('italic');
      const isUnderline = style.includes('underline');
      
      el.removeAttribute('style');
      if (textAlign && textAlign !== 'left' && textAlign !== 'start') {
        el.style.textAlign = textAlign;
      }
      if (isItalic) {
        el.style.fontStyle = 'italic';
      }
      if (isUnderline) {
        el.style.textDecoration = 'underline';
      }
    }
  });

  // Classify paragraphs: mark first paragraph for Old English drop cap,
  // mark body paragraphs for standout initial letter,
  // and detect bibliography/references to mark citations and PREVENT standout initial letter.
  let inBibliography = false;
  let firstParagraphTagged = false;
  const blocks = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6');

  blocks.forEach(el => {
    const rawText = el.textContent?.trim() || '';
    if (!rawText) return;

    // Detect if this element starts the bibliography section
    if (/^(?:bibliography|references|reference list|works cited|sources)[:\s]*$/i.test(rawText)) {
      inBibliography = true;
      el.classList.add('article-bibliography-title');
      return;
    }

    if (inBibliography) {
      if (el.tagName.toLowerCase() === 'p') {
        el.classList.add('citation-entry');
      }
    } else {
      // Check if this paragraph acts as an in-text subheading
      const isSubheading =
        el.matches('h1, h2, h3, h4, h5, h6') ||
        (rawText.length < 90 &&
          !/[.!?]$/.test(rawText) &&
          (Boolean(el.querySelector('strong, b, em, i')) || rawText === rawText.toUpperCase()));

      if (isSubheading) {
        el.classList.add('article-subheading');
      } else if (el.tagName.toLowerCase() === 'p') {
        if (!firstParagraphTagged && rawText.length > 25) {
          el.classList.add('article-first-paragraph');
          firstParagraphTagged = true;
        } else if (rawText.length > 25) {
          el.classList.add('article-body-paragraph');
        }
      }
    }
  });

  const cleaned = doc.body.innerHTML.trim();
  if (!cleaned) {
    return `<p class="article-first-paragraph">${postData.excerpt || ''}</p><p class="article-body-paragraph">${postData.bodyText || ''}</p>`;
  }

  return cleaned;
}

function renderShareBar(shareUrl: string, title: string) {
  return `
    <div class="article-share-strip">
      <div class="share-strip-label font-collegiate">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span>SHARE DISPATCH</span>
      </div>

      <div class="share-actions-group">
        <!-- Native Web Share (shown on supported devices/mobile) -->
        <button 
          type="button"
          class="share-btn share-native-btn" 
          style="display: none;"
          title="Share via device..."
          aria-label="Share via device"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>Share...</span>
        </button>

        <!-- X / Twitter -->
        <a 
          href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="share-btn" 
          title="Share on X / Twitter"
          aria-label="Share on X / Twitter"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X / Twitter</span>
        </a>

        <!-- LinkedIn -->
        <a 
          href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="share-btn" 
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72.77-1.72 1.72s.77 1.73 1.72 1.73a1.73 1.73 0 0 0 1.73-1.73c0-.95-.78-1.72-1.73-1.72m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
          </svg>
          <span>LinkedIn</span>
        </a>

        <!-- Facebook -->
        <a 
          href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="share-btn" 
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/>
          </svg>
          <span>Facebook</span>
        </a>

        <!-- Copy Link -->
        <button 
          type="button"
          class="share-btn share-copy-btn" 
          title="Copy Dispatch URL to Clipboard"
          aria-label="Copy Dispatch URL to Clipboard"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span class="copy-link-label">Copy Link</span>
        </button>

        <!-- Email -->
        <a 
          href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Read this dispatch from The Graticule: ' + shareUrl)}" 
          class="share-btn" 
          title="Share via Email"
          aria-label="Share via Email"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <span>Email</span>
        </a>

        <!-- Print -->
        <button 
          type="button"
          class="share-btn share-print-btn" 
          title="Print Article Dispatch"
          aria-label="Print Article Dispatch"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print</span>
        </button>
      </div>
    </div>
  `;
}

async function render() {
  if (!app) return;

  const pubDate = new Date(postMeta.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const shareUrl = window.location.href;

  // Render initial frame with metadata
  app.innerHTML = `
    <!-- Sticky Reading Progress Bar -->
    <div id="readingProgress" class="reading-progress-indicator" aria-hidden="true"></div>

    ${renderNavbar('journal')}

    <main style="padding: 2.5rem 0 5rem;">
      <article class="container">
        <!-- Breadcrumbs -->
        <nav style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--c-ink-muted); margin-bottom: 2rem;" aria-label="Breadcrumb">
          <a href="/" style="color: var(--c-ink-muted);">Home</a>
          <span>/</span>
          <a href="/journal/" style="color: var(--c-ink-muted);">Journal</a>
          <span>/</span>
          <a href="/journal/?category=${encodeURIComponent(postMeta.categories[0] || 'Geography')}" style="color: var(--c-emerald); font-weight: 600;">
            ${postMeta.categories[0] || 'Geography'}
          </a>
        </nav>

        <!-- Article Header -->
        <header style="max-width: 900px; margin: 0 auto 2.5rem; text-align: center;">
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1.25rem;">
            ${postMeta.categories.map((cat: string) => `
              <a href="/journal/?category=${encodeURIComponent(cat)}" class="stamp-chip" style="font-size: 0.88rem;">
                <span>${cat}</span>
              </a>
            `).join('')}
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.3rem, 4.8vw, 4rem); line-height: 1.02; letter-spacing: 0.03em; color: var(--c-ink); margin-bottom: 1.75rem;">
            ${postMeta.title}
          </h1>

          <!-- Author Byline Card with Academic Title & Affiliation -->
          <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
            <div class="article-byline-card">
              <div class="byline-avatar-monogram">
                ${postMeta.author.charAt(0).toUpperCase()}
              </div>
              <div class="byline-info-col">
                <div class="byline-author-name">
                  <span class="font-collegiate">${postMeta.author}</span>
                  ${postMeta.authorTitle ? `<span class="byline-author-title">&bull; ${postMeta.authorTitle}</span>` : ''}
                </div>
                <div class="byline-meta-row">
                  <span class="byline-affiliation">${postMeta.authorAffiliation || "Queen's University Belfast"}</span>
                  <span class="meta-sep">&bull;</span>
                  <time datetime="${postMeta.date}">${pubDate}</time>
                  <span class="meta-sep">&bull;</span>
                  <span class="byline-read-time">${postMeta.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Share Utility Bar -->
          ${renderShareBar(shareUrl, postMeta.title)}
        </header>

        <!-- Hero Cover Image -->
        ${postMeta.coverImage ? `
          <div style="max-width: 920px; margin: 0 auto 3.5rem; border-radius: var(--radius-md); overflow: hidden; border: 2px solid var(--c-ink); box-shadow: var(--shadow-crisp);">
            <img 
              src="${postMeta.coverImage}" 
              alt="${postMeta.title}" 
              style="width: 100%; max-height: 520px; object-fit: cover;"
              onerror="this.style.display='none'"
            />
          </div>
        ` : ''}

        <!-- Verbatim Article Body Container -->
        <div class="article-reading-container" id="postBodyContainer">
          <div style="padding: 3rem 0; text-align: center; color: var(--c-ink-muted); font-size: 1.05rem;">
            <span class="font-collegiate" style="letter-spacing: 0.08em;">LOADING ARTICLE TEXT...</span>
          </div>
        </div>

        <!-- Dedicated Author Biography Box at bottom of article -->
        <div class="author-biography-box">
          <div class="author-bio-header">
            <div class="author-bio-avatar">${postMeta.author.charAt(0).toUpperCase()}</div>
            <div>
              <span class="author-bio-kicker font-collegiate">ABOUT THE CONTRIBUTOR</span>
              <h3 class="author-bio-name font-collegiate">${postMeta.author}</h3>
              <p class="author-bio-title">${postMeta.authorTitle || 'Contributing Author, QUB Geography Society'}</p>
              <p class="author-bio-affiliation font-sans">${postMeta.authorAffiliation || "School of Natural and Built Environment, Queen's University Belfast"}</p>
            </div>
          </div>
          <p class="author-bio-text">
            ${postMeta.authorBio || `${postMeta.author} is a researcher and contributor to The Graticule, the student-led geography journal at Queen's University Belfast.`}
          </p>
          <div class="author-bio-footer">
            <a href="/journal/?author=${encodeURIComponent(postMeta.author)}" class="btn btn-outline" style="font-size: 0.82rem; padding: 0.5rem 1rem;">
              VIEW ALL ARTICLES BY ${postMeta.author.toUpperCase()} &rarr;
            </a>
          </div>
        </div>

        <!-- Secondary Bottom Share Bar -->
        <div style="max-width: 800px; margin: 3rem auto 0;">
          ${renderShareBar(shareUrl, postMeta.title)}
        </div>

        <!-- Editorial Footnote -->
        <div style="max-width: 800px; margin: 2rem auto 0; padding-top: 1.5rem; border-top: 1.5px solid var(--c-border);">
          <div style="display: flex; align-items: center; gap: 0.85rem; background: var(--c-paper-warm); padding: 1.25rem 1.5rem; border-radius: var(--radius-sm); border: 1px dashed var(--c-border);">
            <div class="brand-monogram" style="width: 36px; height: 36px; font-size: 1.7rem; flex-shrink: 0;">𝔊</div>
            <p style="font-size: 0.88rem; color: var(--c-ink-muted); margin: 0; line-height: 1.55;">
              <strong>The Graticule Editorial Board:</strong> Articles published in The Graticule represent the scholarly views and analysis of the contributing author and do not necessarily reflect the official positions of the Queen's University Belfast Geography Society or the School of Natural and Built Environment.
            </p>
          </div>
        </div>

        <!-- Next / Previous Article Navigation -->
        <div style="max-width: 800px; margin: 3.5rem auto 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; padding-top: 2rem; border-top: 2px solid var(--c-ink);">
          ${prevPost ? `
            <a href="/post/?slug=${encodeURIComponent(prevPost.slug)}" class="btn btn-outline" style="text-align: left; display: flex; flex-direction: column; align-items: flex-start; padding: 1.25rem; height: auto;">
              <span style="font-size: 0.75rem; letter-spacing: 0.1em; color: var(--c-emerald-hover); font-weight: 700;">&larr; PREVIOUS DISPATCH</span>
              <span class="font-serif" style="font-size: 1.05rem; font-weight: 700; color: var(--c-ink); margin-top: 0.25rem;">${prevPost.title}</span>
            </a>
          ` : '<div></div>'}

          ${nextPost ? `
            <a href="/post/?slug=${encodeURIComponent(nextPost.slug)}" class="btn btn-outline" style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; padding: 1.25rem; height: auto;">
              <span style="font-size: 0.75rem; letter-spacing: 0.1em; color: var(--c-emerald-hover); font-weight: 700;">NEXT DISPATCH &rarr;</span>
              <span class="font-serif" style="font-size: 1.05rem; font-weight: 700; color: var(--c-ink); margin-top: 0.25rem;">${nextPost.title}</span>
            </a>
          ` : '<div></div>'}
        </div>
      </article>
    </main>

    <!-- Toast Notification for Copy Link -->
    <div id="shareToast" class="share-toast" role="status" aria-live="polite">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Dispatch link copied to clipboard!</span>
    </div>

    ${renderFooter()}
  `;

  initNavbarInteractions();

  // Wire up reading progress bar
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        progressBar.style.width = `${percent}%`;
      }
    }, { passive: true });
  }

  // Wire up copy link buttons with tactile instant feedback & floating toast
  const toast = document.getElementById('shareToast');
  const showToast = (message: string = 'Dispatch link copied to clipboard!') => {
    if (!toast) return;
    const msgEl = toast.querySelector('span');
    if (msgEl) msgEl.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  document.querySelectorAll('.share-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const label = btn.querySelector('.copy-link-label');
      const origText = label?.textContent || 'Copy Link';

      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        // Fallback for older browsers / iframe contexts
        const dummy = document.createElement('input');
        dummy.value = window.location.href;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }

      if (label) label.textContent = '✓ Copied!';
      btn.classList.add('btn-copied');
      showToast('✓ Dispatch link copied to clipboard!');

      setTimeout(() => {
        if (label) label.textContent = origText;
        btn.classList.remove('btn-copied');
      }, 2000);
    });
  });

  // Wire up native Web Share (mobile / modern devices)
  if (navigator.share) {
    document.querySelectorAll('.share-native-btn').forEach(btn => {
      (btn as HTMLElement).style.display = 'inline-flex';
      btn.addEventListener('click', async () => {
        try {
          await navigator.share({
            title: postMeta.title,
            text: postMeta.excerpt || postMeta.title,
            url: window.location.href
          });
        } catch {
          // User dismissed or share aborted
        }
      });
    });
  }

  // Wire up print buttons
  document.querySelectorAll('.share-print-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // Load and inject cleaned article body
  const postData = await loadPostContent();
  const bodyContainer = document.getElementById('postBodyContainer');
  if (bodyContainer) {
    bodyContainer.innerHTML = cleanArticleContent(postData);
  }
}

render();

