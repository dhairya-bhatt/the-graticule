export function initLoadingScreen() {
  // Check if already shown in this session
  const hasLoaded = sessionStorage.getItem('graticule_loaded');
  if (hasLoaded) return;

  const loaderEl = document.createElement('div');
  loaderEl.id = 'graticuleLoader';
  loaderEl.className = 'graticule-loader-overlay';
  loaderEl.innerHTML = `
    <div class="loader-content">
      <div class="loader-emblem-wrap">
        <svg class="loader-svg" viewBox="0 0 120 120" fill="none">
          <!-- Outer Calibrated Arcs -->
          <circle cx="60" cy="60" r="54" stroke="#0d1e18" stroke-width="2.5" class="draw-line-1" stroke-dasharray="340" stroke-dashoffset="340" />
          <circle cx="60" cy="60" r="48" stroke="rgba(13,30,24,0.4)" stroke-width="1.5" class="draw-line-2" stroke-dasharray="302" stroke-dashoffset="302" />
          
          <!-- Graticule Meridians & Parallels -->
          <ellipse cx="60" cy="60" rx="32" ry="48" stroke="rgba(13,30,24,0.5)" stroke-width="1.2" class="draw-line-3" stroke-dasharray="260" stroke-dashoffset="260" />
          <ellipse cx="60" cy="60" rx="16" ry="48" stroke="rgba(13,30,24,0.5)" stroke-width="1.2" class="draw-line-3" stroke-dasharray="260" stroke-dashoffset="260" />
          <line x1="60" y1="12" x2="60" y2="108" stroke="#0d1e18" stroke-width="1.5" class="draw-line-2" stroke-dasharray="96" stroke-dashoffset="96" />
          <line x1="12" y1="60" x2="108" y2="60" stroke="#0d1e18" stroke-width="2" class="draw-line-1" stroke-dasharray="96" stroke-dashoffset="96" />
          
          <!-- Compass Needle Spinning & Settling North -->
          <g class="loader-needle-group">
            <polygon points="60,18 64,60 56,60" fill="#0d1e18" />
            <polygon points="60,102 64,60 56,60" fill="rgba(13,30,24,0.4)" />
            <circle cx="60" cy="60" r="3.5" fill="#ffffff" stroke="#0d1e18" stroke-width="2" />
          </g>
        </svg>

        <!-- Ornate Monogram Stamp in Center -->
        <div class="loader-center-monogram">𝔊</div>
      </div>
      
      <div class="loader-text">
        <span class="loader-brand-title">The Graticule</span>
        <span class="font-collegiate loader-brand-sub">STUDENT-LED GEOGRAPHY JOURNAL &bull; QUB</span>
        <span class="font-collegiate loader-coords-tag">CALIBRATING ARCHIVE &bull; 54.58° N, 5.93° W</span>
      </div>

      <button id="skipLoaderBtn" class="loader-skip-btn">ENTER ARCHIVE &rarr;</button>
    </div>
  `;

  document.body.appendChild(loaderEl);

  const dismiss = () => {
    loaderEl.classList.add('blend-out');
    sessionStorage.setItem('graticule_loaded', 'true');
    setTimeout(() => {
      loaderEl.remove();
    }, 700);
  };

  const skipBtn = document.getElementById('skipLoaderBtn');
  if (skipBtn) skipBtn.addEventListener('click', dismiss);

  // Auto-dismiss smoothly into the landing page
  setTimeout(dismiss, 1600);
}
