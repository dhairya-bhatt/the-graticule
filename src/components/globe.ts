import worldData from '../data/world-boundaries.json';

export interface GlobeMarker {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
}

interface BoundaryVertex {
  cosLat: number;
  sinLat: number;
  lonRad: number;
  lon: number;
}

const deg2rad = Math.PI / 180;
const prepLines = (lines: number[][][]): BoundaryVertex[][] => {
  return lines.map(line => line.map(([lat, lon]) => ({
    cosLat: Math.cos(lat * deg2rad),
    sinLat: Math.sin(lat * deg2rad),
    lonRad: lon * deg2rad,
    lon
  })));
};

// Precompute trigonometric constants for all Natural Earth coastlines & borders once
const precomputedCoastlines: BoundaryVertex[][] = prepLines(worldData.coastlines as number[][][]);
const precomputedBorders: BoundaryVertex[][] = prepLines(worldData.borders as number[][][]);


export const GLOBE_MARKERS: GlobeMarker[] = [
  {
    id: 'belfast',
    name: 'Belfast (QUB HQ)',
    region: 'Northern Ireland',
    lat: 54.5844,
    lon: -5.9340,
    title: 'Editorial HQ & Urban Segregation Research',
    excerpt: 'The home of The Graticule at Queen’s University Belfast. Exploring contested spaces, peace walls, and Cillíní burial sites.',
    category: 'Belfast & Segregation',
    slug: 'the-locations-origins-and-influences-behind-cillíní-an-overview-of-a-phd-dissertation-project'
  },
  {
    id: 'svalbard',
    name: 'Svalbard (High North)',
    region: 'Arctic Archipelago',
    lat: 78.2232,
    lon: 15.6469,
    title: "The 'Cold Edge' of the Arctic: Norwegian & Russian Tensions",
    excerpt: 'High North geopolitics, sovereignty dynamics, and Arctic military posture as sea ice retreats.',
    category: 'Geopolitics',
    slug: 'the-cold-edge-of-the-arctic-norwegian-and-russian-tensions-concerning-svalbard'
  },
  {
    id: 'greenland',
    name: 'Greenland & Nunavut',
    region: 'North American Arctic',
    lat: 67.01,
    lon: -50.69,
    title: 'A Journey to the Arctic: Students on Ice Expedition',
    excerpt: 'QUB geography student Emma Denton’s field report on glacial runoff, ice sheet retreat, and indigenous knowledge.',
    category: 'Physical Geography',
    slug: 'a-journey-to-the-arctic'
  },
  {
    id: 'fordlandia',
    name: 'Fordlândia (Amazon)',
    region: 'Tapajós Basin, Brazil',
    lat: -3.83,
    lon: -55.49,
    title: 'A Geographical Analysis of Fordlândia',
    excerpt: 'Critical geography of Henry Ford’s failed rubber plantation utopia deep within the Amazonian rainforest.',
    category: 'Human Geography',
    slug: 'a-geographical-analysis-of-fordlândia'
  },
  {
    id: 'jordan',
    name: 'Jordan River Basin',
    region: 'Levant & Middle East',
    lat: 31.95,
    lon: 35.56,
    title: 'Water and Riparian Geopolitics in the Levant',
    excerpt: 'Transboundary hydrology, aquifer politics, and spatial water scarcity in the Jordan valley.',
    category: 'Geopolitics',
    slug: 'the-deus-and-the-machina-the-political-materiality-of-geoengineering'
  },
  {
    id: 'iceland',
    name: 'Iceland (Vatnajökull)',
    region: 'North Atlantic',
    lat: 64.14,
    lon: -21.94,
    title: 'Glacial Geomorphology & Volcanic Sub-surfaces',
    excerpt: 'Sub-glacial eruptions, jökulhlaup meltwater channels, and volcanic soil variability across dynamic terrains.',
    category: 'Physical Geography',
    slug: 'quantifying-the-degree-of-in-field-variability-in-soil-nutrient-content'
  },
  {
    id: 'barrier-reef',
    name: 'Great Barrier Reef',
    region: 'Coral Sea, Australia',
    lat: -18.28,
    lon: 147.69,
    title: 'Marine Biogeography & Ocean Acidification',
    excerpt: 'Thermal stress regimes, coral bleaching vectors, and geospatial conservation along the world’s largest reef system.',
    category: 'Climate Change',
    slug: 'the-deus-and-the-machina-the-political-materiality-of-geoengineering'
  },
  {
    id: 'sierra-leone',
    name: 'Freetown & Diamond Corridors',
    region: 'West Africa',
    lat: 8.46,
    lon: -11.77,
    title: 'Resource Extraction & Mineral Geographies',
    excerpt: 'Critical spatial analysis of alluvial diamond basins, commodity flows, and post-conflict political geography.',
    category: 'Political Geography',
    slug: 'the-cold-edge-of-the-arctic-norwegian-and-russian-tensions-concerning-svalbard'
  }
];

export class GraticuleGlobe {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tooltipEl: HTMLElement;
  private coordsBadgeEl: HTMLElement;

  private radius: number = 190;
  private cachedSize: number = 400;
  private cachedCx: number = 200;
  private cachedCy: number = 200;
  private yaw: number = 0.35; // Longitude rotation (radians)
  private pitch: number = 0.28; // Latitude tilt (radians)

  // Drag interaction state
  private isDragging: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private velYaw: number = 0.0025;
  private velPitch: number = 0;
  private targetYaw: number | null = null;
  private targetPitch: number | null = null;

  // Hover & selection
  private hoveredMarker: GlobeMarker | null = null;
  private activeMarker: GlobeMarker | null = null;
  private pulsePhase: number = 0;

  private animId: number = 0;
  private lastTime: number = 0;
  private isReducedMotion: boolean = false;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container #${containerId} not found`);
    this.container = container;
    this.container.style.position = 'relative';

    // Canvas Setup
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'graticule-globe-canvas';
    this.canvas.setAttribute('aria-label', 'Interactive Graticule 3D Globe with Geographic Article Dispatches');
    this.canvas.setAttribute('role', 'img');
    this.canvas.style.cursor = 'grab';
    this.canvas.style.display = 'block';
    this.canvas.style.userSelect = 'none';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;

    // HUD Tooltip Element
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'globe-hud-tooltip';
    this.tooltipEl.style.position = 'absolute';
    this.tooltipEl.style.pointerEvents = 'auto';
    this.tooltipEl.style.opacity = '0';
    this.tooltipEl.style.transform = 'translate(-50%, -100%) translateY(-12px)';
    this.tooltipEl.style.transition = 'opacity 200ms ease, transform 200ms ease';
    this.tooltipEl.style.zIndex = '20';
    this.container.appendChild(this.tooltipEl);

    // Live Coordinates Readout Badge
    this.coordsBadgeEl = document.createElement('div');
    this.coordsBadgeEl.className = 'globe-coords-readout';
    this.coordsBadgeEl.style.position = 'absolute';
    this.coordsBadgeEl.style.bottom = '8px';
    this.coordsBadgeEl.style.left = '50%';
    this.coordsBadgeEl.style.transform = 'translateX(-50%)';
    this.coordsBadgeEl.style.fontFamily = 'var(--font-collegiate)';
    this.coordsBadgeEl.style.fontSize = '0.78rem';
    this.coordsBadgeEl.style.letterSpacing = '0.08em';
    this.coordsBadgeEl.style.color = '#0D1E18';
    this.coordsBadgeEl.style.background = 'rgba(255, 255, 255, 0.85)';
    this.coordsBadgeEl.style.padding = '3px 10px';
    this.coordsBadgeEl.style.borderRadius = '20px';
    this.coordsBadgeEl.style.border = '1px solid rgba(13, 30, 24, 0.2)';
    this.coordsBadgeEl.style.backdropFilter = 'blur(4px)';
    this.coordsBadgeEl.style.pointerEvents = 'none';
    this.coordsBadgeEl.innerText = 'DRAG TO ROTATE • HOVER PINS';
    this.container.appendChild(this.coordsBadgeEl);

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.bindEvents();

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.startLoop();
  }

  private handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.container.getBoundingClientRect();
    const size = Math.min(rect.width || 460, 480);

    this.cachedSize = size;
    this.cachedCx = size / 2;
    this.cachedCy = size / 2;

    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;

    this.radius = (size / 2) * 0.74;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private bindEvents() {
    // Mouse Dragging
    const onMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.canvas.style.cursor = 'grabbing';
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.targetYaw = null;
      this.targetPitch = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        const sensitivity = 0.0065;
        this.yaw += dx * sensitivity;
        this.pitch += dy * sensitivity;

        // Clamp pitch so globe doesn't invert
        this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch));

        this.velYaw = dx * sensitivity * 0.6;
        this.velPitch = dy * sensitivity * 0.6;

        this.updateCoordsBadge(mouseX, mouseY);
      } else {
        // Check hover over markers
        this.checkMarkerHover(mouseX, mouseY);
      }
    };

    const onMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
      }
    };

    this.canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Click on marker
    this.canvas.addEventListener('click', (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const hit = this.getMarkerAt(mouseX, mouseY);
      if (hit) {
        this.selectMarker(hit);
      }
    });

    // Touch Support
    this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
        this.targetYaw = null;
        this.targetPitch = null;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;

        const sensitivity = 0.007;
        this.yaw += dx * sensitivity;
        this.pitch += dy * sensitivity;
        this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch));

        this.velYaw = dx * sensitivity * 0.6;
        this.velPitch = dy * sensitivity * 0.6;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Leave container hides tooltip if not locked
    this.container.addEventListener('mouseleave', () => {
      if (!this.activeMarker) {
        this.hoveredMarker = null;
        this.hideTooltip();
      }
    });
  }

  private updateCoordsBadge(mouseX: number, mouseY: number) {
    const cx = this.cachedCx;
    const cy = this.cachedCy;

    const dx = (mouseX - cx) / this.radius;
    const dy = (cy - mouseY) / this.radius;

    if (dx * dx + dy * dy <= 1) {
      const approxLat = Math.round(Math.asin(Math.max(-1, Math.min(1, dy))) * (180 / Math.PI));
      const approxLon = Math.round((-this.yaw * (180 / Math.PI)) % 360);
      const latStr = approxLat >= 0 ? `${approxLat}° N` : `${Math.abs(approxLat)}° S`;
      const lonNorm = ((approxLon + 180) % 360) - 180;
      const lonStr = lonNorm >= 0 ? `${lonNorm}° E` : `${Math.abs(lonNorm)}° W`;
      this.coordsBadgeEl.innerText = `${latStr} • ${lonStr}`;
    }
  }

  // 3D Spherical Projection Function for Arbitrary Coordinates
  private project3D(latDeg: number, lonDeg: number): { x: number; y: number; z: number; visible: boolean } {
    const latRad = (latDeg * Math.PI) / 180;
    const lonRad = (lonDeg * Math.PI) / 180;

    // Unit sphere coords with yaw rotation
    const x0 = Math.cos(latRad) * Math.sin(lonRad + this.yaw);
    const y0 = Math.sin(latRad);
    const z0 = Math.cos(latRad) * Math.cos(lonRad + this.yaw);

    // Tilt (pitch) rotation around X-axis
    const x = x0;
    const y = y0 * Math.cos(this.pitch) - z0 * Math.sin(this.pitch);
    const z = y0 * Math.sin(this.pitch) + z0 * Math.cos(this.pitch);

    const screenX = this.cachedCx + x * this.radius;
    const screenY = this.cachedCy - y * this.radius;

    return {
      x: screenX,
      y: screenY,
      z,
      visible: z > 0.02
    };
  }

  // Fast Projection for Precomputed Boundary Vertices
  private projectVertex(v: BoundaryVertex, cosPitch: number, sinPitch: number): { x: number; y: number; visible: boolean } {
    const rad = v.lonRad + this.yaw;
    const sinRad = Math.sin(rad);
    const cosRad = Math.cos(rad);

    const x0 = v.cosLat * sinRad;
    const y0 = v.sinLat;
    const z0 = v.cosLat * cosRad;

    const y = y0 * cosPitch - z0 * sinPitch;
    const z = y0 * sinPitch + z0 * cosPitch;

    return {
      x: this.cachedCx + x0 * this.radius,
      y: this.cachedCy - y * this.radius,
      visible: z > 0.02
    };
  }

  // Draw Natural Earth Coastlines and Sovereign Country Borders
  private drawWorldBoundaries(cosPitch: number, sinPitch: number) {
    // 1. Coastlines (Landmass Outlines)
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(20, 226, 129, 0.85)';
    this.ctx.lineWidth = 1.35;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    for (let l = 0; l < precomputedCoastlines.length; l++) {
      const line = precomputedCoastlines[l];
      let inPath = false;
      for (let i = 0; i < line.length - 1; i++) {
        const v1 = line[i];
        const v2 = line[i + 1];

        // Antimeridian wrap: break path if longitude jumps > 180°
        if (Math.abs(v1.lon - v2.lon) > 180) {
          inPath = false;
          continue;
        }

        const p1 = this.projectVertex(v1, cosPitch, sinPitch);
        const p2 = this.projectVertex(v2, cosPitch, sinPitch);

        if (p1.visible && p2.visible) {
          if (!inPath) {
            this.ctx.moveTo(p1.x, p1.y);
            inPath = true;
          }
          this.ctx.lineTo(p2.x, p2.y);
        } else {
          inPath = false;
        }
      }
    }
    this.ctx.stroke();

    // 2. Country Borders (Political Boundaries)
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
    this.ctx.lineWidth = 0.9;
    this.ctx.setLineDash([2.5, 3]);

    for (let l = 0; l < precomputedBorders.length; l++) {
      const line = precomputedBorders[l];
      let inPath = false;
      for (let i = 0; i < line.length - 1; i++) {
        const v1 = line[i];
        const v2 = line[i + 1];

        if (Math.abs(v1.lon - v2.lon) > 180) {
          inPath = false;
          continue;
        }

        const p1 = this.projectVertex(v1, cosPitch, sinPitch);
        const p2 = this.projectVertex(v2, cosPitch, sinPitch);

        if (p1.visible && p2.visible) {
          if (!inPath) {
            this.ctx.moveTo(p1.x, p1.y);
            inPath = true;
          }
          this.ctx.lineTo(p2.x, p2.y);
        } else {
          inPath = false;
        }
      }
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private checkMarkerHover(mouseX: number, mouseY: number) {
    const hit = this.getMarkerAt(mouseX, mouseY);
    if (hit !== this.hoveredMarker) {
      this.hoveredMarker = hit;
      if (hit) {
        this.showTooltip(hit);
        this.canvas.style.cursor = 'pointer';
      } else if (!this.activeMarker) {
        this.hideTooltip();
        this.canvas.style.cursor = 'grab';
      }
    }
  }

  private getMarkerAt(mouseX: number, mouseY: number): GlobeMarker | null {
    for (const marker of GLOBE_MARKERS) {
      const proj = this.project3D(marker.lat, marker.lon);
      if (proj.visible) {
        const dist = Math.hypot(mouseX - proj.x, mouseY - proj.y);
        if (dist <= 16) {
          return marker;
        }
      }
    }
    return null;
  }

  public selectMarker(marker: GlobeMarker) {
    this.activeMarker = marker;
    this.showTooltip(marker);
    // Smoothly rotate globe towards marker
    this.rotateTo(marker.lat, marker.lon);
  }

  public rotateTo(targetLat: number, targetLon: number) {
    const targetLonRad = -(targetLon * Math.PI) / 180;
    const targetLatRad = (targetLat * Math.PI) / 180 * 0.4;

    this.targetYaw = targetLonRad;
    this.targetPitch = Math.max(-0.6, Math.min(0.6, targetLatRad));
  }

  private showTooltip(marker: GlobeMarker) {
    const proj = this.project3D(marker.lat, marker.lon);
    const latStr = marker.lat >= 0 ? `${marker.lat.toFixed(2)}° N` : `${Math.abs(marker.lat).toFixed(2)}° S`;
    const lonStr = marker.lon >= 0 ? `${marker.lon.toFixed(2)}° E` : `${Math.abs(marker.lon).toFixed(2)}° W`;

    this.tooltipEl.innerHTML = `
      <div style="background: #0D1E18; color: #FBF9F4; border: 2px solid #28B26F; border-radius: 8px; padding: 12px 14px; width: 260px; box-shadow: 0 12px 30px rgba(0,0,0,0.45); font-family: var(--font-sans);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: var(--font-collegiate); font-size: 0.72rem; letter-spacing: 0.08em; color: #28B26F; font-weight: 700;">
            ${marker.category.toUpperCase()}
          </span>
          <span style="font-family: var(--font-collegiate); font-size: 0.68rem; color: rgba(251,249,244,0.7); letter-spacing: 0.05em;">
            ${latStr}, ${lonStr}
          </span>
        </div>
        <h4 style="font-family: var(--font-collegiate); font-size: 1.05rem; line-height: 1.15; color: #ffffff; margin: 0 0 6px; letter-spacing: 0.03em;">
          ${marker.title}
        </h4>
        <p style="font-size: 0.8rem; line-height: 1.4; color: rgba(251,249,244,0.85); margin: 0 0 10px;">
          ${marker.excerpt.slice(0, 110)}...
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(40,178,111,0.3); padding-top: 8px;">
          <span style="font-size: 0.75rem; color: #28B26F; font-weight: 600;">${marker.name}</span>
          <a href="/post/?slug=${encodeURIComponent(marker.slug)}" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <span>Read Dispatch</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    `;

    this.tooltipEl.style.left = `${proj.x}px`;
    this.tooltipEl.style.top = `${proj.y}px`;
    this.tooltipEl.style.opacity = '1';
    this.tooltipEl.style.transform = 'translate(-50%, -100%) translateY(-14px)';
  }

  private hideTooltip() {
    this.tooltipEl.style.opacity = '0';
    this.tooltipEl.style.transform = 'translate(-50%, -100%) translateY(-6px)';
  }

  private startLoop() {
    const loop = (time: number) => {
      const dt = this.lastTime ? (time - this.lastTime) / 1000 : 0.016;
      this.lastTime = time;

      this.updatePhysics(dt);
      this.drawFrame();

      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  private updatePhysics(dt: number) {
    this.pulsePhase += dt * 3.5;

    // Handle smooth interpolation if target coordinates set
    if (this.targetYaw !== null && this.targetPitch !== null) {
      const dy = this.targetYaw - this.yaw;
      const dp = this.targetPitch - this.pitch;
      this.yaw += dy * 0.08;
      this.pitch += dp * 0.08;
      if (Math.abs(dy) < 0.005 && Math.abs(dp) < 0.005) {
        this.targetYaw = null;
        this.targetPitch = null;
      }
    } else if (!this.isDragging) {
      // Inertia damping
      this.yaw += this.velYaw;
      this.pitch += this.velPitch;
      this.velYaw *= 0.94;
      this.velPitch *= 0.94;

      // Gentle auto-rotation when user releases
      if (Math.abs(this.velYaw) < 0.0008 && !this.hoveredMarker && !this.activeMarker && !this.isReducedMotion) {
        this.yaw += 0.0025;
      }
    }

    // Keep active tooltip tracking marker position during spin
    const currentMarker = this.hoveredMarker || this.activeMarker;
    if (currentMarker) {
      const proj = this.project3D(currentMarker.lat, currentMarker.lon);
      if (proj.visible) {
        this.tooltipEl.style.left = `${proj.x}px`;
        this.tooltipEl.style.top = `${proj.y}px`;
        this.tooltipEl.style.opacity = '1';
      } else {
        this.tooltipEl.style.opacity = '0';
      }
    }
  }

  private drawFrame() {
    const cx = this.cachedCx;
    const cy = this.cachedCy;
    const size = this.cachedSize;

    this.ctx.clearRect(0, 0, size, size);

    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);

    // 1. Globe Ambient Core Glow (Dark Forest Green Core contrasting against neon emerald background)
    const radGlow = this.ctx.createRadialGradient(cx, cy, this.radius * 0.15, cx, cy, this.radius);
    radGlow.addColorStop(0, 'rgba(13, 30, 24, 0.52)');
    radGlow.addColorStop(0.65, 'rgba(13, 30, 24, 0.75)');
    radGlow.addColorStop(1, 'rgba(13, 30, 24, 0.96)');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = radGlow;
    this.ctx.fill();

    // Clip all spherical surface features strictly inside the globe disk
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.radius - 0.5, 0, Math.PI * 2);
    this.ctx.clip();

    // 2. Parallels (Cartographic Latitude Graticule)
    const latBands = [-60, -40, -20, 0, 20, 40, 60];
    latBands.forEach(latDeg => {
      this.ctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 6) {
        const proj = this.project3D(latDeg, lon);
        if (proj.visible) {
          if (first) {
            this.ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            this.ctx.lineTo(proj.x, proj.y);
          }
        } else {
          first = true;
        }
      }
      if (latDeg === 0) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        this.ctx.lineWidth = 1.4;
        this.ctx.setLineDash([]);
      } else {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 0.75;
        this.ctx.setLineDash([3, 4]);
      }
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    // 3. Meridians (Cartographic Longitude Graticule)
    for (let lonDeg = -180; lonDeg < 180; lonDeg += 30) {
      this.ctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 5) {
        const proj = this.project3D(lat, lonDeg);
        if (proj.visible) {
          if (first) {
            this.ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            this.ctx.lineTo(proj.x, proj.y);
          }
        } else {
          first = true;
        }
      }

      const isPrime = lonDeg === 0;
      this.ctx.strokeStyle = isPrime ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.16)';
      this.ctx.lineWidth = isPrime ? 1.4 : 0.75;
      this.ctx.stroke();
    }

    // 4. Natural Earth Country Boundaries & Coastlines
    this.drawWorldBoundaries(cosPitch, sinPitch);

    // 5. Cardinal Marks & North Pole Indicator
    const northPole = this.project3D(90, 0);
    if (northPole.visible) {
      this.ctx.font = '700 9px var(--font-sans)';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('NORTH POLE 90°N', northPole.x, northPole.y - 8);
    }

    this.ctx.restore(); // End sphere clipping

    // 6. Crisp Outer Rim Circle Ring
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#0D1E18';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // 7. Iconic Angled Equatorial Crest Ring
    this.ctx.beginPath();
    this.ctx.ellipse(
      cx,
      cy,
      this.radius * 1.28,
      this.radius * 0.44,
      -0.26, // -15 deg angle
      0,
      Math.PI * 2
    );
    this.ctx.strokeStyle = 'rgba(13, 30, 24, 0.95)';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // 8. Geographic Article Markers (Informative Interactive Pins)
    GLOBE_MARKERS.forEach(marker => {
      const proj = this.project3D(marker.lat, marker.lon);
      if (!proj.visible) return;

      const isHovered = (this.hoveredMarker && this.hoveredMarker.id === marker.id) ||
                        (this.activeMarker && this.activeMarker.id === marker.id);

      // Depth intensity factor (fade slightly towards globe edge)
      const depthAlpha = Math.max(0.35, Math.min(1, proj.z * 1.4));

      // Outer Pulse Ring
      const pulseSize = 6 + (Math.sin(this.pulsePhase + marker.lat) * 0.5 + 0.5) * 6;
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, pulseSize, 0, Math.PI * 2);
      this.ctx.strokeStyle = isHovered ? '#ffffff' : `rgba(255, 225, 117, ${0.75 * depthAlpha})`;
      this.ctx.lineWidth = isHovered ? 2 : 1.2;
      this.ctx.stroke();

      // Core Marker Dot
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, isHovered ? 5.5 : 4, 0, Math.PI * 2);
      this.ctx.fillStyle = isHovered ? '#ffffff' : '#FFE175';
      this.ctx.fill();
      this.ctx.strokeStyle = '#0D1E18';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Pin Label Tag (Crisp collegiate font)
      this.ctx.font = isHovered ? '700 11px var(--font-collegiate)' : '600 10px var(--font-collegiate)';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      const labelText = marker.name;
      const textX = proj.x + 8;
      const textY = proj.y - 1;

      // Label background pill
      const textWidth = this.ctx.measureText(labelText).width;
      this.ctx.fillStyle = isHovered ? '#0D1E18' : `rgba(13, 30, 24, ${0.8 * depthAlpha})`;
      this.ctx.fillRect(textX - 3, textY - 7, textWidth + 6, 14);

      this.ctx.fillStyle = isHovered ? '#ffffff' : `rgba(251, 249, 244, ${depthAlpha})`;
      this.ctx.fillText(labelText, textX, textY);
    });
  }

  public destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
