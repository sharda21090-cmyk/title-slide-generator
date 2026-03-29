/*
 * Supercoaching Title Slide Generator
 *
 * WORKFLOW:
 *   1. User fills in the form (course, title EN/HI, faculty, logo)
 *   2. Script copies the template presentation
 *   3. Finds elements by their known object IDs
 *   4. Sets text / swaps images directly — no tokens, no guessing
 *   5. Exports PNG, returns Slide URL + PNG URL
 *
 * SETUP:
 *   1. script.google.com → New Project → paste this as Code.gs
 *   2. File > New > HTML → name "index" → paste index.html
 *   3. Enable "Google Sheets API" under Services (left sidebar, +)
 *   4. Deploy > New deployment > Web app > Execute as Me > Anyone
 *   5. Authorise when prompted
 *
 * AFTER UPDATING SHEET DATA:
 *   Run clearFormOptionsCache() from the editor to refresh.
 */

// ── CONFIG ──────────────────────────────────────────────────
var SPREADSHEET_ID           = '1CpgtjeKNxhQmqKSkqnwe-IHZmjI1ENypBAyClxjbkUs';
var FACULTY_SHEET            = 'FacultyData';
var COURSE_SHEET             = 'AllCourse';
var TEMPLATE_PRESENTATION_ID = '1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk';
var TEMPLATE_SLIDE_ID        = 'g3d776b36914_4_75';
var OUTPUT_FOLDER_NAME       = 'Supercoaching Title Slides';

// Element object IDs on the template slide (from analyzeTemplateSlide)
// These are preserved when the presentation is copied.
var EL = {
  COURSE_NAME:  'g3d7e9597ed0_1_1',  // SHAPE "Course Name"   128,76  183×32
  TITLE_EN:     'g3d7e9597ed0_1_2',  // SHAPE "Title English"  51,156 309×29
  FACULTY_NAME: 'g3d7e9597ed0_1_3',  // SHAPE "Faculty Name"  504,301 201×23
  TITLE_HI:     'g3d7e9597ed0_1_4',  // SHAPE "Title Hindi"    51,196 282×29
  EXPERIENCE:   'g3d7e9597ed0_1_5',  // SHAPE "Experience"    504,332 201×21
  LOGO:         'g3d7e9597ed0_1_6',  // IMAGE  logo            66,340 108×37
  PHOTO:        'g3d7e9597ed0_1_8'   // SHAPE  photo area     507,6  213×278
};

var BUILT_IN_LOGOS = [
  { name: 'Supercoaching',  id: '1yHVsmLTkq85UGZskdFo_SgShx4xCVFF4' },
  { name: 'Superpass Live', id: '1bYWWZNbCVxt6ZC--fLnYG0foeYKwPHrB' }
];

// ── WEB APP ─────────────────────────────────────────────────
function doGet() {
  var tpl = HtmlService.createTemplateFromFile('index');
  try {
    tpl.initialData = JSON.stringify(getFormOptions());
  } catch (e) {
    tpl.initialData = JSON.stringify({ success: false, faculties: [], courses: [] });
  }
  return tpl.evaluate()
    .setTitle('Supercoaching Title Slide Generator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── SHEET DATA (cached 6 h) ────────────────────────────────
function getFormOptions() {
  var cache  = CacheService.getScriptCache();
  var cached = cache.get('formOptions_v3');
  if (cached) return JSON.parse(cached);

  try {
    var facResp = Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, FACULTY_SHEET + '!A1:Z');
    var crsResp = Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, COURSE_SHEET + '!A2:A');

    var facData = facResp.values || [];
    var header  = facData.length ? facData[0] : [];
    var nameIdx = 0, photoIdx = -1;

    for (var h = 0; h < header.length; h++) {
      var k = (header[h] || '').toString().trim().toLowerCase();
      if (k === 'name' || k === 'faculty name' || k === '_id') nameIdx = h;
      if (k === 'photo' || k === 'faculty photo' || k === 'image') photoIdx = h;
    }

    var faculties = [];
    // Find achievement column index
    var achievementIdx = -1;
    for (var h = 0; h < header.length; h++) {
      var k = (header[h] || '').toString().trim().toLowerCase();
      if (k === 'achievement') achievementIdx = h;
    }
    for (var i = 1; i < facData.length; i++) {
      var row  = facData[i] || [];
      var name = (row[nameIdx] || '').toString().trim();
      if (name) faculties.push({
        name: name,
        achievement: achievementIdx >= 0 ? (row[achievementIdx] || '').toString().trim() : '',
        photo: photoIdx >= 0 ? (row[photoIdx] || '').toString().trim() : ''
      });
    }

    var courses = [];
    var crsData = crsResp.values || [];
    for (var j = 0; j < crsData.length; j++) {
      var c = (crsData[j][0] || '').toString().trim();
      if (c) courses.push(c);
    }

    var result = { success: true, faculties: faculties, courses: courses };
    var json   = JSON.stringify(result);
    if (json.length <= 90000) cache.put('formOptions_v3', json, 21600);
    return result;
  } catch (e) {
    return { success: false, error: e.message, faculties: [], courses: [] };
  }
}

function clearFormOptionsCache() {
  CacheService.getScriptCache().remove('formOptions_v2');
  Logger.log('Cache cleared.');
}

// ── ONE-TIME SETUP ──────────────────────────────────────────
// Run this ONCE from the Apps Script editor (▶ Run button).
// It forces a re-authorization that includes the UrlFetchApp scope.
// Only needs to be done once per Google account.
function setupPermissions() {
  UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true });
  DriveApp.getRootFolder();
  Logger.log('✅ All permissions authorized. You can now deploy and use the app.');
}

// ── LOGOS ───────────────────────────────────────────────────
function getAvailableLogos() {
  return { logos: BUILT_IN_LOGOS.slice() };
}

function getLogoPreview(fileId) {
  try {
    var blob = DriveApp.getFileById(fileId).getBlob();
    return {
      success: true,
      dataUrl: 'data:' + blob.getContentType() + ';base64,' +
               Utilities.base64Encode(blob.getBytes())
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════
//  GENERATE SLIDE
//
//  Step 1: Copy template, keep only target slide
//  Step 2: Map elements by known object ID
//  Step 3: Set text on 5 text shapes
//  Step 4: Swap logo image (if selected)
//  Step 5: Overlay faculty photo (if available)
//  Step 6: Save, export PNG, return URLs
// ═══════════════════════════════════════════════════════════
function generateTitleSlide(formData) {
  try {
    var titleEn      = (formData.titleEn      || '').trim() || 'Untitled Topic';
    var titleHi      = (formData.titleHi      || '').trim();
    var courseName   = (formData.courseName   || '').trim();
    var facultyName  = (formData.facultyName  || '').trim() || 'Faculty';
    var experience   = (formData.achievement   || formData.experience || '').trim();
    var facultyPhoto = (formData.facultyPhoto || '').trim();

    // Step 1: Copy template, keep only target slide
    var copy  = DriveApp.getFileById(TEMPLATE_PRESENTATION_ID)
                        .makeCopy('Supercoaching – ' + titleEn);
    var pres  = SlidesApp.openById(copy.getId());
    var slide = _findSlide(pres, TEMPLATE_SLIDE_ID) || pres.getSlides()[0];

    var slides = pres.getSlides();
    for (var i = slides.length - 1; i >= 0; i--) {
      if (slides[i].getObjectId() !== slide.getObjectId()) slides[i].remove();
    }

    // Step 2: Build element map  { objectId → pageElement }
    var el = {};
    slide.getPageElements().forEach(function(e) { el[e.getObjectId()] = e; });

    // Step 3: Set text (5 shapes)
    _setText(el[EL.COURSE_NAME],  courseName);
    _setText(el[EL.TITLE_EN],     titleEn);
    _setText(el[EL.TITLE_HI],     titleHi);
    _setText(el[EL.FACULTY_NAME], facultyName);
    _setText(el[EL.EXPERIENCE],   experience);

    // Step 4: Swap logo (only if user chose one; otherwise keep template default)
    if (formData.logoFileId) {
      _swapImage(slide, el[EL.LOGO], DriveApp.getFileById(formData.logoFileId).getBlob());
    }

    // Step 5: Faculty photo — insert on top of photo-area shape
    if (facultyPhoto) {
      var photoBlob = _fetchImageBlob(facultyPhoto);
      if (photoBlob) {
        var ph = el[EL.PHOTO];
        if (ph) slide.insertImage(photoBlob, ph.getLeft(), ph.getTop(), ph.getWidth(), ph.getHeight());
      }
    }

    // Step 6: Save, export, return
    pres.saveAndClose();
    var presId  = copy.getId();
    var slideId = slide.getObjectId();

    // Step 6b: Enable TEXT_AUTOFIT on all text shapes so long titles shrink to fit
    _setTextAutoFit(presId, [EL.COURSE_NAME, EL.TITLE_EN, EL.TITLE_HI, EL.FACULTY_NAME, EL.EXPERIENCE]);

    var folder = _getOrCreateFolder(OUTPUT_FOLDER_NAME);
    if (folder) { folder.addFile(copy); DriveApp.getRootFolder().removeFile(copy); }

    var pngUrl = _exportPng(presId, slideId);

    return {
      success: true,
      url: 'https://docs.google.com/presentation/d/' + presId + '/edit',
      pngUrl: pngUrl,
      presentationId: presId
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ═══════════════════════════════════════════════════════════
//  DEBUG: Run this from the editor to inspect the template.
// ═══════════════════════════════════════════════════════════
function analyzeTemplateSlide() {
  var pres  = SlidesApp.openById(TEMPLATE_PRESENTATION_ID);
  var slide = _findSlide(pres, TEMPLATE_SLIDE_ID);
  if (!slide) {
    var ids = pres.getSlides().map(function(s, i) { return i + ': ' + s.getObjectId(); });
    Logger.log('Slide ID not found. Available:\n' + ids.join('\n'));
    return;
  }

  var out = [
    '=== TEMPLATE SLIDE ANALYSIS ===',
    'Slide: ' + slide.getObjectId(),
    'Dimensions: ' + pres.getPageWidth() + ' x ' + pres.getPageHeight() + ' pt',
    'Elements: ' + slide.getPageElements().length, ''
  ];

  slide.getPageElements().forEach(function(el, idx) {
    var t = el.getPageElementType().toString();
    out.push('--- [' + idx + '] ' + t + ' id=' + el.getObjectId());
    out.push('    pos: left=' + Math.round(el.getLeft()) + ' top=' + Math.round(el.getTop()) +
             ' w=' + Math.round(el.getWidth()) + ' h=' + Math.round(el.getHeight()));
    if (t === 'SHAPE') {
      try {
        var shape = el.asShape();
        var txt = shape.getText().asString();
        out.push('    text: ' + JSON.stringify(txt));
        shape.getText().getParagraphs().forEach(function(p, pi) {
          var pt = p.getRange().asString();
          if (!pt.trim()) return;
          var s = p.getRange().getTextStyle();
          out.push('    p[' + pi + ']: ' + JSON.stringify(pt) +
            ' font=' + _safe(function(){return s.getFontFamily()}) +
            ' size=' + _safe(function(){return s.getFontSize()}) +
            ' bold=' + _safe(function(){return s.isBold()}) +
            ' color=' + _safe(function(){
              var c=s.getForegroundColor(); if(!c)return null;
              if(c.getColorType().toString()==='RGB'){var r=c.asRgbColor();return 'rgb('+r.getRed()+','+r.getGreen()+','+r.getBlue()+')';}
              return c.getColorType().toString();
            }));
        });
        try {
          var f = shape.getFill();
          if (f.getType().toString() === 'SOLID') {
            var fc = f.getSolidFill().getColor().asRgbColor();
            out.push('    fill: rgb(' + fc.getRed() + ',' + fc.getGreen() + ',' + fc.getBlue() + ')');
          }
        } catch(_){}
      } catch(e) { out.push('    (error: '+e.message+')'); }
    } else if (t === 'IMAGE') {
      try { out.push('    alt: ' + (el.asImage().getDescription()||'(none)')); } catch(_){}
    } else if (t === 'GROUP') {
      try {
        el.asGroup().getChildren().forEach(function(c, ci) {
          var ct = c.getPageElementType().toString();
          var cTxt = '';
          if (ct==='SHAPE') try{cTxt=' text='+JSON.stringify(c.asShape().getText().asString())}catch(_){}
          out.push('    child['+ci+']: '+ct+' left='+Math.round(c.getLeft())+' top='+Math.round(c.getTop())+
                   ' w='+Math.round(c.getWidth())+' h='+Math.round(c.getHeight())+cTxt);
        });
      } catch(_){}
    }
  });

  Logger.log(out.join('\n'));
  return out.join('\n');
}

// ── HELPERS ─────────────────────────────────────────────────

// Set text on a shape element (no-op if element missing)
function _setText(element, text) {
  if (!element) return;
  try { element.asShape().getText().setText(text || ''); } catch (_) {}
}

// Remove an element and insert an image at the same position/size
function _swapImage(slide, element, blob) {
  if (!element || !blob) return;
  var l = element.getLeft(), t = element.getTop();
  var w = element.getWidth(), h = element.getHeight();
  element.remove();
  slide.insertImage(blob, l, t, w, h);
}

// Return a direct PNG export URL (no UrlFetchApp needed — user clicks to download)
function _exportPng(presId, slideId) {
  return 'https://docs.google.com/presentation/d/' + presId +
         '/export/png?pageid=' + encodeURIComponent(slideId);
}

// Resolve a photo reference (Drive file ID, Drive URL, or HTTP URL) to a Blob
function _fetchImageBlob(ref) {
  var val = (ref || '').trim();
  if (!val) return null;
  // Drive file ID or URL
  var m = val.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || val.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  var fid = m ? m[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(val) ? val : '');
  if (fid) {
    try { return DriveApp.getFileById(fid).getBlob(); } catch (_) { return null; }
  }
  // HTTP URL (e.g. lh3.googleusercontent.com photos)
  if (/^https?:\/\//i.test(val)) {
    try {
      var r = UrlFetchApp.fetch(val, { muteHttpExceptions: true, followRedirects: true });
      if (r.getResponseCode() === 200) return r.getBlob();
    } catch (_) { return null; }
  }
  return null;
}

function _findSlide(pres, id) {
  var slides = pres.getSlides();
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].getObjectId() === id) return slides[i];
  }
  return null;
}

function _getOrCreateFolder(name) {
  try {
    var it = DriveApp.getFoldersByName(name);
    return it.hasNext() ? it.next() : DriveApp.createFolder(name);
  } catch (_) { return null; }
}

function _safeName(s) { return (s || 'Slide').replace(/[\\/:*?"<>|]+/g, ' ').trim(); }

function _safe(fn) { try { return fn(); } catch (_) { return null; } }

// Apply TEXT_AUTOFIT to a list of shape object IDs so text shrinks to fit the box.
// Requires the Advanced Slides Service (Slides API) to be enabled:
//   Apps Script editor → Services (left sidebar) → Google Slides API → Add
function _setTextAutoFit(presId, objectIds) {
  if (!objectIds || !objectIds.length) return;
  try {
    var requests = objectIds
      .filter(function(id) { return !!id; })
      .map(function(id) {
        return {
          updateShapeProperties: {
            objectId: id,
            shapeProperties: { autofit: { autofitType: 'TEXT_AUTOFIT' } },
            fields: 'autofit'
          }
        };
      });
    if (requests.length) Slides.Presentations.batchUpdate({ requests: requests }, presId);
  } catch (e) {
    Logger.log('Auto-fit (non-fatal): ' + e.message);
  }
}
