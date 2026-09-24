import { renderNavbar, initNavbarInteractions } from './components/navbar';
import { renderFooter } from './components/footer';
import categoriesData from './data/categories.json';

const app = document.getElementById('app');

if (app) {
  const categories = categoriesData.filter(c => c !== 'All Posts');

  app.innerHTML = `
    ${renderNavbar('contact')}

    <main style="padding: 3.5rem 0 6rem;">
      <div class="container">
        <!-- Header -->
        <div style="max-width: 800px; margin: 0 auto 3.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;" class="stamp-chip">
            <span style="color: var(--c-emerald);">&#10022;</span>
            <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.08em;">CONTRIBUTE &bull; SUBMISSION PORTAL</span>
          </div>

          <h1 class="font-collegiate" style="font-size: clamp(2.5rem, 5vw, 4.2rem); line-height: 0.95; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 1.25rem;">
            SUBMISSIONS &amp; CONTACT
          </h1>

          <p class="font-serif" style="font-size: 1.2rem; color: var(--c-ink-muted); line-height: 1.6;">
            We welcome articles, essays, research abstracts, and creative geography submissions from students and researchers across disciplines.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 3rem; max-width: 1080px; margin: 0 auto;" class="contact-grid">
          <!-- Left: Submission Form -->
          <div style="background: #ffffff; border: 2px solid var(--c-ink); border-radius: var(--radius-md); padding: clamp(1.75rem, 4vw, 2.75rem); box-shadow: var(--shadow-crisp);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; border-bottom: 1.5px solid var(--c-border); padding-bottom: 1rem;">
              <h2 class="font-collegiate" style="font-size: 1.8rem; letter-spacing: 0.05em; color: var(--c-ink); margin: 0;">
                SUBMIT YOUR DRAFT
              </h2>
              <span class="stamp-chip" style="font-size: 0.78rem;">15MB MAX &bull; WORD / PDF</span>
            </div>

            <form id="submissionForm" style="display: flex; flex-direction: column; gap: 1.35rem;">
              <div>
                <label for="authorName" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  AUTHOR NAME(S) *
                </label>
                <input 
                  type="text" 
                  id="authorName" 
                  required 
                  placeholder="e.g. Emma Denton" 
                  style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; outline: none; transition: border-color var(--tr-fast);"
                />
              </div>

              <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;" class="form-row-2">
                <div>
                  <label for="authorEmail" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                    EMAIL ADDRESS *
                  </label>
                  <input 
                    type="email" 
                    id="authorEmail" 
                    required 
                    placeholder="student@qub.ac.uk" 
                    style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; outline: none;"
                  />
                </div>
                <div>
                  <label for="affiliation" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                    AFFILIATION / DEGREE
                  </label>
                  <input 
                    type="text" 
                    id="affiliation" 
                    placeholder="e.g. BSc Geography Year 3" 
                    style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; outline: none;"
                  />
                </div>
              </div>

              <div>
                <label for="articleTitle" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  ARTICLE OR ESSAY TITLE *
                </label>
                <input 
                  type="text" 
                  id="articleTitle" 
                  required 
                  placeholder="Title of your submission..." 
                  style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; outline: none;"
                />
              </div>

              <div>
                <label for="categorySelect" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  PRIMARY DISCIPLINE / CATEGORY *
                </label>
                <select 
                  id="categorySelect" 
                  required 
                  style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; background: #ffffff; outline: none;"
                >
                  <option value="" disabled selected>Select a category...</option>
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>

              <div>
                <label for="abstract" style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  ABSTRACT / SUMMARY
                </label>
                <textarea 
                  id="abstract" 
                  rows="3" 
                  placeholder="Brief synopsis of your piece (approx 100-200 words)..." 
                  style="width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--c-border); border-radius: var(--radius-sm); font-size: 1rem; outline: none; resize: vertical;"
                ></textarea>
              </div>

              <!-- File Upload Dropzone -->
              <div>
                <label style="display: block; font-family: var(--font-collegiate); font-size: 1.05rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.35rem;">
                  FILE ATTACHMENT (.DOC, .DOCX, .PDF &bull; MAX 15MB) *
                </label>
                <div 
                  id="dropzone" 
                  style="border: 2px dashed var(--c-border); border-radius: var(--radius-sm); padding: 2rem 1.5rem; text-align: center; background: var(--c-paper-warm); cursor: pointer; transition: all var(--tr-fast);"
                >
                  <input type="file" id="fileInput" accept=".pdf,.doc,.docx" required style="display: none;" />
                  <div style="width: 44px; height: 44px; margin: 0 auto 0.75rem; border-radius: 50%; background: rgba(40, 178, 111, 0.15); display: flex; align-items: center; justify-content: center; color: var(--c-emerald);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <div id="fileUploadPrompt">
                    <p style="font-weight: 600; color: var(--c-ink); margin-bottom: 0.25rem;">
                      Click to choose file or drag and drop here
                    </p>
                    <p style="font-size: 0.8rem; color: var(--c-ink-muted);">
                      Maximum file size: 15MB (Microsoft Word or PDF)
                    </p>
                  </div>
                  <div id="fileSelectedInfo" style="display: none;">
                    <p style="font-weight: 700; color: var(--c-emerald);" id="selectedFileName"></p>
                    <p style="font-size: 0.8rem; color: var(--c-ink-muted);" id="selectedFileSize"></p>
                    <button type="button" id="removeFileBtn" style="font-size: 0.8rem; color: #dc2626; background: none; border: none; text-decoration: underline; margin-top: 0.5rem; cursor: pointer;">Remove file</button>
                  </div>
                </div>
                <div id="fileError" style="color: #dc2626; font-size: 0.85rem; margin-top: 0.4rem; display: none;"></div>
              </div>

              <button type="submit" id="submitBtn" class="btn btn-primary" style="margin-top: 0.5rem; font-size: 1.15rem; padding: 0.85rem;">
                <span>Submit Contribution &rarr;</span>
              </button>
            </form>

            <div id="formSuccessMessage" style="display: none; padding: 2.5rem; text-align: center; background: var(--c-emerald-light); border: 2px solid var(--c-emerald); border-radius: var(--radius-sm); margin-top: 1.5rem;">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--c-emerald); color: var(--c-ink); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 class="font-collegiate" style="font-size: 1.8rem; letter-spacing: 0.05em; color: var(--c-ink); margin-bottom: 0.5rem;">
                THANKS FOR SUBMITTING!
              </h3>
              <p class="font-serif" style="font-size: 1.1rem; color: var(--c-ink-soft); line-height: 1.6; margin-bottom: 1.5rem;">
                Your manuscript has been safely received. The editorial board will review your submission and contact you via your provided email address.
              </p>
              <button id="submitAnotherBtn" class="btn btn-outline" style="font-size: 0.95rem;">
                Submit Another Contribution
              </button>
            </div>
          </div>

          <!-- Right: Direct Contact & Socials -->
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <!-- Editorial Email Card -->
            <div style="background: var(--c-ink); color: var(--c-paper); border-radius: var(--radius-md); padding: 2.25rem; border: 2px solid var(--c-emerald); box-shadow: var(--shadow-crisp);">
              <span class="font-collegiate" style="font-size: 0.85rem; letter-spacing: 0.1em; color: var(--c-emerald); display: block; margin-bottom: 0.5rem;">DIRECT EDITORIAL INQUIRIES</span>
              <h2 style="font-family: var(--font-collegiate); font-size: 2.2rem; letter-spacing: 0.05em; color: var(--c-paper); margin-bottom: 1rem; text-transform: none;">
                thegraticule@outlook.com
              </h2>
              <p class="font-serif" style="font-size: 1.05rem; line-height: 1.6; color: rgba(251, 249, 244, 0.8); margin-bottom: 1.5rem;">
                For files larger than 15MB, general inquiries, collaboration ideas, or academic responses, email the editorial desk directly.
              </p>
              <a href="mailto:thegraticule@outlook.com" class="btn btn-primary" style="font-size: 1rem;">
                <span>Send Direct Email &rarr;</span>
              </a>
            </div>

            <!-- Society Information -->
            <div style="background: var(--c-paper-warm); border: 1.5px solid var(--c-border); border-radius: var(--radius-md); padding: 2rem; box-shadow: var(--shadow-sm);">
              <h3 class="font-collegiate" style="font-size: 1.45rem; letter-spacing: 0.06em; color: var(--c-ink); margin-bottom: 0.5rem;">
                QUB GEOGRAPHY SOCIETY
              </h3>
              <p style="font-size: 0.95rem; color: var(--c-ink-muted); margin-bottom: 1.25rem; line-height: 1.5;">
                Department of Geography, School of Natural and Built Environment, Queen's University Belfast, University Road, Belfast, BT7 1NN.
              </p>
              <p style="font-size: 0.95rem; color: var(--c-ink); font-weight: 600;">
                Society Email: <a href="mailto:geography-society@qub.ac.uk" style="color: var(--c-ocean); text-decoration: underline;">geography-society@qub.ac.uk</a>
              </p>
            </div>

            <!-- Social Media Sitewide Box -->
            <div style="background: #ffffff; border: 1.5px solid var(--c-border); border-radius: var(--radius-md); padding: 2rem; box-shadow: var(--shadow-sm);">
              <h3 class="font-collegiate" style="font-size: 1.45rem; letter-spacing: 0.06em; color: var(--c-ink); margin-bottom: 0.75rem;">
                SOCIAL MEDIA
              </h3>
              <p style="font-size: 0.92rem; color: var(--c-ink-muted); margin-bottom: 1.25rem;">
                Follow our official accounts for issue launches, call-for-papers, events, and fieldwork spotlights.
              </p>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="https://twitter.com/TheGraticule" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--c-border); border-radius: var(--radius-sm); transition: border-color var(--tr-fast);">
                  <span style="font-weight: 600;">Twitter / X</span>
                  <span style="color: var(--c-emerald); font-family: var(--font-collegiate); font-size: 0.95rem;">@TheGraticule &rarr;</span>
                </a>
                <a href="http://instagram.com/thegraticule" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--c-border); border-radius: var(--radius-sm); transition: border-color var(--tr-fast);">
                  <span style="font-weight: 600;">Instagram</span>
                  <span style="color: var(--c-emerald); font-family: var(--font-collegiate); font-size: 0.95rem;">@thegraticule &rarr;</span>
                </a>
                <a href="https://www.facebook.com/thegraticule" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--c-border); border-radius: var(--radius-sm); transition: border-color var(--tr-fast);">
                  <span style="font-weight: 600;">Facebook</span>
                  <span style="color: var(--c-emerald); font-family: var(--font-collegiate); font-size: 0.95rem;">/thegraticule &rarr;</span>
                </a>
                <a href="https://www.linkedin.com/company/the-graticule/" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border: 1px solid var(--c-border); border-radius: var(--radius-sm); transition: border-color var(--tr-fast);">
                  <span style="font-weight: 600;">LinkedIn</span>
                  <span style="color: var(--c-emerald); font-family: var(--font-collegiate); font-size: 0.95rem;">The Graticule &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    ${renderFooter()}
  `;

  initNavbarInteractions();

  // File Upload Handling
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const promptEl = document.getElementById('fileUploadPrompt');
  const infoEl = document.getElementById('fileSelectedInfo');
  const nameEl = document.getElementById('selectedFileName');
  const sizeEl = document.getElementById('selectedFileSize');
  const errorEl = document.getElementById('fileError');
  const removeBtn = document.getElementById('removeFileBtn');
  const form = document.getElementById('submissionForm') as HTMLFormElement;
  const successBox = document.getElementById('formSuccessMessage');
  const submitAnotherBtn = document.getElementById('submitAnotherBtn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--c-emerald)';
      dropzone.style.backgroundColor = 'var(--c-emerald-wash)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--c-border)';
      dropzone.style.backgroundColor = 'var(--c-paper-warm)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--c-border)';
      dropzone.style.backgroundColor = 'var(--c-paper-warm)';
      if (e.dataTransfer?.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files?.length) {
        handleFile(fileInput.files[0]);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        if (promptEl) promptEl.style.display = 'block';
        if (infoEl) infoEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
      });
    }
  }

  function handleFile(file: File) {
    if (!errorEl || !promptEl || !infoEl || !nameEl || !sizeEl) return;

    errorEl.style.display = 'none';
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB

    if (file.size > MAX_SIZE) {
      errorEl.innerText = `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 15MB. Please email larger files to thegraticule@outlook.com.`;
      errorEl.style.display = 'block';
      fileInput.value = '';
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      errorEl.innerText = `Invalid file type (.${ext}). Please submit a Word document (.doc, .docx) or PDF.`;
      errorEl.style.display = 'block';
      fileInput.value = '';
      return;
    }

    nameEl.innerText = file.name;
    sizeEl.innerText = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    promptEl.style.display = 'none';
    infoEl.style.display = 'block';
  }

  // Form submission
  if (form && successBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      successBox.style.display = 'block';
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    });
  }

  if (submitAnotherBtn && form && successBox) {
    submitAnotherBtn.addEventListener('click', () => {
      form.reset();
      if (promptEl) promptEl.style.display = 'block';
      if (infoEl) infoEl.style.display = 'none';
      form.style.display = 'flex';
      successBox.style.display = 'none';
    });
  }
}
