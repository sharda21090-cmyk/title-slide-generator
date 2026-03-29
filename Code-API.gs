/*
 * Supercoaching Title Slide Generator - API Backend
 * 
 * This version exposes HTTP endpoints for the Vercel frontend.
 * Deploy as Web App with "Execute as: Me" and "Access: Anyone"
 */

// ── CONFIG ──────────────────────────────────────────────────
var SPREADSHEET_ID           = '1CpgtjeKNxhQmqKSkqnwe-IHZmjI1ENypBAyClxjbkUs';
var FACULTY_SHEET            = 'FacultyData';
var COURSE_SHEET             = 'AllCourse';
var TEMPLATE_PRESENTATION_ID = '1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk';
var TEMPLATE_SLIDE_ID        = 'g3d776b36914_4_75';
var OUTPUT_FOLDER_NAME       = 'Supercoaching Title Slides';

var EL = {
  COURSE_NAME:  'g3d7e9597ed0_1_1',
  TITLE_EN:     'g3d7e9597ed0_1_2',
  FACULTY_NAME: 'g3d7e9597ed0_1_3',
  TITLE_HI:     'g3d7e9597ed0_1_4',
  EXPERIENCE:   'g3d7e9597ed0_1_5',
  LOGO:         'g3d7e9597ed0_1_6',
  PHOTO:        'g3d7e9597ed0_1_8'
};

var BUILT_IN_LOGOS = [
  { name: 'Supercoaching',  id: '1yHVsmLTkq85UGZskdFo_SgShx4xCVFF4' },
  { name: 'Superpass Live', id: '1bYWWZNbCVxt6ZC--fLnYG0foeYKwPHrB' }
];

// ── API ENDPOINTS ───────────────────────────────────────────

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Supercoaching Title Slide Generator API',
    version: '2.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var action = e.parameter.action;
    var result;
    
    switch(action) {
      case 'getFormOptions':
        result = getFormOptions();
        break;
      case 'getAvailableLogos':
        result = getAvailableLogos();
        break;
      case 'getLogoPreview':
        var data = JSON.parse(e.parameter.data || '{}');
        result = getLogoPreview(data.fileId);
        break;
      case 'generateTitleSlide':
        var formData = JSON.parse(e.parameter.data || '{}');
        result = generateTitleSlide(formData);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message || 'Server error'
    })).setMimeType(ContentService.MimeType.JSON);
  }
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
    var nameIdx = 0, photoIdx = -1, achievementIdx = -1;

    for (var h = 0; h < header.length; h++) {
      var k = (header[h] || '').toString().trim().toLowerCase();
      if (k === 'name' || k === 'faculty name' || k === '_id') nameIdx = h;
      if (k === 'photo' || k === 'faculty photo' || k === 'image') photoIdx = h;
      if (k === 'achievement') achievementIdx = h;
    }

    var faculties = [];
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
  CacheService.getScriptCache().remove('formOptions_v3');
  Logger.log('Cache cleared.');
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

// ── GENERATE SLIDE ──────────────────────────────────────────
function generateTitleSlide(formData) {
  try {
    var titleEn      = (formData.titleEn      || '').trim() || 'Untitled Topic';
    var titleHi      = (formData.titleHi      || '').trim();
    var courseName   = (formData.courseName   || '').trim();
    var facultyName  = (formData.facultyName  || '').trim() || 'Faculty';
    var experience   = (formData.achievement   || formData.experience || '').trim();
    var facultyPhoto = (formData.facultyPhoto || '').trim();

    var copy  = DriveApp.getFileById(TEMPLATE_PRESENTATION_ID)
                        .makeCopy('Supercoaching – ' + titleEn);
    var pres  = SlidesApp.openById(copy.getId());
    var slide = _findSlide(pres, TEMPLATE_SLIDE_ID) || pres.getSlides()[0];

    var slides = pres.getSlides();
    for (var i = slides.length - 1; i >= 0; i--) {
      if (slides[i].getObjectId() !== slide.getObjectId()) slides[i].remove();
    }

    var el = {};
    slide.getPageElements().forEach(function(e) { el[e.getObjectId()] = e; });

    _setText(el[EL.COURSE_NAME],  courseName);
    _setText(el[EL.TITLE_EN],     titleEn);
    _setText(el[EL.TITLE_HI],     titleHi);
    _setText(el[EL.FACULTY_NAME], facultyName);
    _setText(el[EL.EXPERIENCE],   experience);

    if (formData.logoFileId) {
      _swapImage(slide, el[EL.LOGO], DriveApp.getFileById(formData.logoFileId).getBlob());
    }

    if (facultyPhoto) {
      var photoBlob = _fetchImageBlob(facultyPhoto);
      if (photoBlob) {
        var ph = el[EL.PHOTO];
        if (ph) slide.insertImage(photoBlob, ph.getLeft(), ph.getTop(), ph.getWidth(), ph.getHeight());
      }
    }

    pres.saveAndClose();
    var presId  = copy.getId();
    var slideId = slide.getObjectId();

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

// ── HELPERS ─────────────────────────────────────────────────
function _setText(element, text) {
  if (!element) return;
  try { element.asShape().getText().setText(text || ''); } catch (_) {}
}

function _swapImage(slide, element, blob) {
  if (!element || !blob) return;
  var l = element.getLeft(), t = element.getTop();
  var w = element.getWidth(), h = element.getHeight();
  element.remove();
  slide.insertImage(blob, l, t, w, h);
}

function _exportPng(presId, slideId) {
  return 'https://docs.google.com/presentation/d/' + presId +
         '/export/png?pageid=' + encodeURIComponent(slideId);
}

function _fetchImageBlob(ref) {
  var val = (ref || '').trim();
  if (!val) return null;
  var m = val.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || val.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  var fid = m ? m[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(val) ? val : '');
  if (fid) {
    try { return DriveApp.getFileById(fid).getBlob(); } catch (_) { return null; }
  }
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
