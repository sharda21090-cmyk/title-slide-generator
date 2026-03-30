// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// API Client
const api = {
  async call(action, data = {}) {
    const formData = new URLSearchParams();
    formData.append('action', action);
    if (data && Object.keys(data).length) {
      formData.append('data', JSON.stringify(data));
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  getFormOptions() {
    return this.call('getFormOptions');
  },
  
  getAvailableLogos() {
    return this.call('getAvailableLogos');
  },
  
  getLogoPreview(fileId) {
    return this.call('getLogoPreview', { fileId });
  },
  
  generateTitleSlide(formData) {
    return this.call('generateTitleSlide', formData);
  }
};

// State
let selectedCourse = '';
let selectedFaculty = '';
let facultyMap = {};

// DOM Elements
const enInput = document.getElementById('titleEn');
const hiInput = document.getElementById('titleHi');
const expInput = document.getElementById('experience');
const logoSelect = document.getElementById('logoSelect');

// Searchable dropdown builder
function buildDropdown(searchId, listId, tagId, items, onSelect) {
  const search = document.getElementById(searchId);
  const list = document.getElementById(listId);
  const tag = document.getElementById(tagId);
  let timer = null;
  const MAX = 120;

  const indexed = (items || []).map(it => ({
    label: it.label,
    value: it.value,
    lc: (it.label || '').toLowerCase()
  }));

  function populate(q) {
    list.innerHTML = '';
    q = (q || '').toLowerCase();
    let n = 0;
    
    for (let i = 0; i < indexed.length && n < MAX; i++) {
      if (!q || indexed[i].lc.indexOf(q) !== -1) {
        const o = document.createElement('option');
        o.value = indexed[i].value;
        o.textContent = indexed[i].label;
        list.appendChild(o);
        n++;
      }
    }
    
    if (n >= MAX) {
      const m = document.createElement('option');
      m.disabled = true;
      m.textContent = 'Keep typing to narrow…';
      list.appendChild(m);
    }
    
    list.classList.toggle('hidden', n === 0);
  }

  function pick(val, label) {
    list.classList.add('hidden');
    search.value = '';
    tag.innerHTML = `${label} <button type="button" aria-label="Clear">×</button>`;
    tag.classList.remove('hidden');
    onSelect(val, label);
  }

  function clear() {
    tag.classList.add('hidden');
    tag.innerHTML = '';
    search.value = '';
    list.classList.add('hidden');
    onSelect('', '');
  }

  search.addEventListener('focus', () => populate(search.value));
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => populate(search.value), 90);
  });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && list.options.length) {
      e.preventDefault();
      const f = list.options[0];
      if (f && !f.disabled) pick(f.value, f.textContent);
    }
  });
  search.addEventListener('blur', () => {
    setTimeout(() => list.classList.add('hidden'), 220);
  });
  list.addEventListener('change', () => {
    const o = list.options[list.selectedIndex];
    if (o && !o.disabled) pick(o.value, o.textContent);
  });
  tag.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') clear();
  });
}

// Preview auto-sizing
function pvAutoSize(el, basePx, minPx, threshold) {
  const len = (el.textContent || '').length;
  if (len <= threshold) {
    el.style.fontSize = '';
    return;
  }
  const size = Math.max(minPx, Math.round(basePx * threshold / len * 10) / 10);
  el.style.fontSize = size + 'px';
}

// Strip HTML tags and entities while preserving newlines and bullets
function stripHtml(html) {
  if (!html) return '';
  
  let text = html.toString();
  
  // Convert common HTML elements to preserve structure
  text = text.replace(/<br\s*\/?>/gi, '\n');           // <br> to newline
  text = text.replace(/<\/p>/gi, '\n');                // </p> to newline
  text = text.replace(/<p[^>]*>/gi, '');               // Remove <p> tags
  text = text.replace(/<li[^>]*>/gi, '• ');            // <li> to bullet
  text = text.replace(/<\/li>/gi, '\n');               // </li> to newline
  text = text.replace(/<\/ul>/gi, '\n');               // </ul> to newline
  text = text.replace(/<\/ol>/gi, '\n');               // </ol> to newline
  text = text.replace(/<[^>]*>/g, '');                 // Remove remaining tags
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&apos;/g, "'");
  text = text.replace(/&bull;/g, '•');
  
  // Clean up excessive whitespace but preserve single newlines
  text = text.replace(/[ \t]+/g, ' ');                 // Multiple spaces/tabs to single space
  text = text.replace(/\n\s+/g, '\n');                 // Remove spaces after newlines
  text = text.replace(/\n{3,}/g, '\n\n');              // Max 2 consecutive newlines
  
  return text.trim();
}

// Update preview
function updatePreview() {
  const course = selectedCourse;
  const en = enInput.value.trim();
  const hi = hiInput.value.trim();
  const name = selectedFaculty;
  // Strip HTML from experience for preview display
  const exp = stripHtml(expInput.value.trim());

  const pvCourse = document.getElementById('pvCourse');
  const pvEn = document.getElementById('pvEn');
  const pvHi = document.getElementById('pvHi');
  const pvName = document.getElementById('pvName');
  const pvExp = document.getElementById('pvExp');

  if (course) {
    pvCourse.textContent = course;
    pvCourse.classList.remove('hidden');
  } else {
    pvCourse.classList.add('hidden');
  }

  pvEn.textContent = en || 'Topic title will appear here';

  if (hi) {
    pvHi.textContent = hi;
    pvHi.classList.remove('hidden');
  } else {
    pvHi.classList.add('hidden');
  }

  pvName.textContent = name || 'Faculty Name';
  
  if (exp) {
    pvExp.textContent = exp;
    pvExp.classList.remove('hidden');
  } else {
    pvExp.classList.add('hidden');
  }

  pvAutoSize(pvEn, 13, 7, 28);
  pvAutoSize(pvHi, 11, 6, 28);
  pvAutoSize(pvCourse, 13, 7, 28);
  pvAutoSize(pvName, 11, 7, 20);
}

// Show status message
function showStatus(type, html) {
  const el = document.getElementById('status');
  el.className = type;
  el.innerHTML = html;
}

// Initialize app
async function init() {
  try {
    // Load form options
    const data = await api.getFormOptions();
    
    if (data.success) {
      // Setup course dropdown
      const courseItems = (data.courses || []).map(c => ({ label: c, value: c }));
      buildDropdown('courseSearch', 'courseName', 'courseSelected', courseItems, (v) => {
        selectedCourse = v;
        updatePreview();
      });
      document.getElementById('courseSearch').placeholder = 
        courseItems.length ? `Search ${courseItems.length} courses…` : 'Type a course name';

      // Setup faculty dropdown
      const facItems = (data.faculties || []).map(f => {
        // Strip HTML but don't truncate - let autofit handle it
        const cleanExp = stripHtml(f.achievement || '');
        
        facultyMap[f.name] = {
          experience: cleanExp,
          photo: f.photo || ''
        };
        return { label: f.name, value: f.name };
      });
      
      buildDropdown('facultySearch', 'facultyName', 'facultySelected', facItems, (v) => {
        selectedFaculty = v;
        const img = document.getElementById('pvPhotoImg');
        const icon = document.getElementById('pvPhotoIcon');
        
        if (v && facultyMap[v]) {
          // Use full experience text - autofit will handle sizing
          expInput.value = facultyMap[v].experience || '';
          let photo = (facultyMap[v].photo || '').trim();
          
          // Fix protocol-relative URLs
          if (photo.startsWith('//')) {
            photo = 'https:' + photo;
          }
          
          if (photo) {
            img.src = photo;
            img.classList.add('visible');
            icon.style.display = 'none';
          } else {
            img.classList.remove('visible');
            img.src = '';
            icon.style.display = '';
          }
        } else {
          img.classList.remove('visible');
          img.src = '';
          icon.style.display = '';
        }
        
        updatePreview();
      });
      
      document.getElementById('facultySearch').placeholder = 
        facItems.length ? `Search ${facItems.length} faculty…` : 'Type faculty name';
    }

    // Load logos
    const logoData = await api.getAvailableLogos();
    logoSelect.innerHTML = '<option value="">— No logo —</option>';
    
    if (logoData.logos && logoData.logos.length) {
      logoData.logos.forEach(l => {
        const o = document.createElement('option');
        o.value = l.id;
        o.textContent = l.name;
        logoSelect.appendChild(o);
      });
      document.getElementById('logoHint').textContent = 
        `${logoData.logos.length} logo(s) available. Select one to preview.`;
    }
  } catch (error) {
    console.error('Initialization error:', error);
    showStatus('error', '⚠️ Failed to load data. Please refresh the page.');
  }
}

// Logo change handler
logoSelect.addEventListener('change', async () => {
  const fid = logoSelect.value;
  const thumb = document.getElementById('logoThumb');
  const pvLogo = document.getElementById('pvLogo');
  const pvImg = document.getElementById('pvLogoImg');
  const pvBrand = document.getElementById('pvBrand');

  if (!fid) {
    thumb.classList.remove('visible');
    pvLogo.style.display = 'none';
    pvBrand.classList.remove('hidden');
    return;
  }
  
  pvBrand.classList.add('hidden');

  try {
    const res = await api.getLogoPreview(fid);
    if (res.success) {
      thumb.src = res.dataUrl;
      thumb.classList.add('visible');
      pvImg.src = res.dataUrl;
      pvLogo.style.display = 'block';
    }
  } catch (error) {
    console.error('Logo preview error:', error);
  }
});

// Preview update listeners
[enInput, hiInput, expInput].forEach(el => {
  el.addEventListener('input', updatePreview);
});

// Form submit
document.getElementById('slideForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const titleEn = enInput.value.trim();
  const facultyName = selectedFaculty || document.getElementById('facultySearch').value.trim();

  if (!titleEn) {
    showStatus('error', 'Please enter the topic title in English.');
    enInput.focus();
    return;
  }
  
  if (!facultyName) {
    showStatus('error', 'Please select or type a faculty name.');
    document.getElementById('facultySearch').focus();
    return;
  }

  const formData = {
    courseName: selectedCourse || document.getElementById('courseSearch').value.trim(),
    titleEn,
    titleHi: hiInput.value.trim(),
    facultyName,
    achievement: expInput.value.trim(),
    facultyPhoto: (() => {
      let photo = (facultyMap[facultyName] && facultyMap[facultyName].photo) || '';
      // Fix protocol-relative URLs
      if (photo.startsWith('//')) {
        photo = 'https:' + photo;
      }
      return photo;
    })(),
    logoFileId: logoSelect.value
  };
  
  console.log('Sending formData:', formData);
  console.log('Experience value:', formData.achievement);
  console.log('Photo URL:', formData.facultyPhoto);

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Generating slide…';
  document.getElementById('status').className = '';
  document.getElementById('status').style.display = '';

  try {
    const result = await api.generateTitleSlide(formData);
    
    btn.disabled = false;
    btn.innerHTML = '✦ Generate Google Slide';
    
    if (result.success) {
      let msg = `✅ Slide ready! <a href="${result.url}" target="_blank">Open Slide →</a>`;
      if (result.pptxUrl) {
        msg += ` &nbsp;|&nbsp; <a href="${result.pptxUrl}" download>Download PowerPoint →</a>`;
      }
      if (result.pngUrl) {
        msg += ` &nbsp;|&nbsp; <a href="${result.pngUrl}" target="_blank">Download PNG →</a>`;
      }
      showStatus('success', msg);
    } else {
      showStatus('error', `❌ ${result.error}`);
    }
  } catch (error) {
    btn.disabled = false;
    btn.innerHTML = '✦ Generate Google Slide';
    showStatus('error', `❌ ${error.message || 'Something went wrong.'}`);
  }
});

// Initialize on load
updatePreview();
init();
