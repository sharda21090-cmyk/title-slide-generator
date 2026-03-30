/*
 * Supercoaching Title Slide Generator - API Backend
 * 
 * This version exposes HTTP endpoints for the Vercel frontend.
 * Deploy as Web App with "Execute as: Me" and "Access: Anyone"
 */

// CONFIG
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
  { name: 'Supercoaching',  id: '1uk0WDNEixfIVXiVFKC74RIZqN_ZyJBHT' },
  { name: 'Superpass Live', id: '1yHVsmLTkq85UGZskdFo_SgShx4xCVFF4' }
];

// API ENDPOINTS

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
      case 'diagnoseTemplate':
        result = { success: true, message: diagnoseTemplateElements() };
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

// SHEET DATA (cached 6 h)
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
      if (k === 'achievement' || k === 'experience' || k === 'achievements') achievementIdx = h;
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
      // Filter out courses with "Removed" anywhere in the name
      if (c && !c.match(/Removed/i)) {
        courses.push(c);
      }
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

// LOGOS
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

// GENERATE SLIDE
function generateTitleSlide(formData) {
  try {
    Logger.log('=== GENERATE TITLE SLIDE START ===');
    Logger.log('Received formData: ' + JSON.stringify(formData));
    
    var titleEn      = (formData.titleEn || '').trim() || 'Untitled Topic';
    var titleHi      = (formData.titleHi || '').trim();
    var courseName   = (formData.courseName || '').trim();
    var facultyName  = (formData.facultyName || '').trim() || 'Faculty';
    var experience   = (formData.achievement || formData.experience || '').trim();
    var facultyPhoto = (formData.facultyPhoto || '').trim();
    
    Logger.log('Parsed values:');
    Logger.log('  - Experience: ' + experience);
    Logger.log('  - Photo URL: ' + facultyPhoto);
    Logger.log('  - Logo File ID: ' + (formData.logoFileId || 'none'));

    Logger.log('Creating presentation copy...');
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    var fileName = facultyName + '_' + timestamp;
    var copy  = DriveApp.getFileById(TEMPLATE_PRESENTATION_ID)
                        .makeCopy(fileName);
    var pres  = SlidesApp.openById(copy.getId());
    var slide = _findSlide(pres, TEMPLATE_SLIDE_ID) || pres.getSlides()[0];

    Logger.log('Removing extra slides...');
    var slides = pres.getSlides();
    for (var i = slides.length - 1; i >= 0; i--) {
      if (slides[i].getObjectId() !== slide.getObjectId()) slides[i].remove();
    }

    Logger.log('Building element map...');
    // Build element map
    var el = {};
    slide.getPageElements().forEach(function(e) { el[e.getObjectId()] = e; });
    
    Logger.log('Elements found:');
    Logger.log('  - COURSE_NAME: ' + !!el[EL.COURSE_NAME]);
    Logger.log('  - TITLE_EN: ' + !!el[EL.TITLE_EN]);
    Logger.log('  - TITLE_HI: ' + !!el[EL.TITLE_HI]);
    Logger.log('  - FACULTY_NAME: ' + !!el[EL.FACULTY_NAME]);
    Logger.log('  - EXPERIENCE: ' + !!el[EL.EXPERIENCE]);
    Logger.log('  - LOGO: ' + !!el[EL.LOGO]);
    Logger.log('  - PHOTO: ' + !!el[EL.PHOTO]);

    // Update text elements
    _setText(el[EL.COURSE_NAME],  courseName);
    _setText(el[EL.TITLE_EN],     titleEn);
    _setText(el[EL.TITLE_HI],     titleHi);
    _setText(el[EL.FACULTY_NAME], facultyName);
    
    // EXPERIENCE Fallback - track actual element ID used
    var expElement = el[EL.EXPERIENCE];
    var expElementId = EL.EXPERIENCE;
    if (!expElement) {
      Logger.log('Experience element ID not found, searching by position...');
      var elements = slide.getPageElements();
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].getPageElementType() == SlidesApp.PageElementType.SHAPE) {
          var t = elements[i].getTop();
          var l = elements[i].getLeft();
          if (t > 280 && l > 420) {
            expElement = elements[i];
            expElementId = elements[i].getObjectId();
            Logger.log('Found experience element at T:' + t + ' L:' + l);
            break;
          }
        }
      }
    }
    _setText(expElement, experience);

    // Swap logo if provided
    if (formData.logoFileId) {
      Logger.log('Swapping logo with file ID: ' + formData.logoFileId);
      try {
        var logoBlob = DriveApp.getFileById(formData.logoFileId).getBlob();
        _swapImage(slide, el[EL.LOGO], logoBlob);
      } catch (e) {
        Logger.log('Logo swap failed: ' + e.message);
      }
    }

    // Swap faculty photo if provided
    if (facultyPhoto) {
      Logger.log('Swapping faculty photo: ' + facultyPhoto);
      try {
        var photoBlob = _fetchImageBlob(facultyPhoto);
        if (photoBlob) {
          var photoElement = el[EL.PHOTO];
          if (photoElement) {
            // Get dimensions before swap
            var photoLeft = photoElement.getLeft();
            var photoTop = photoElement.getTop();
            var photoWidth = photoElement.getWidth();
            var photoHeight = photoElement.getHeight();
            
            // Remove placeholder
            photoElement.remove();
            
            // Insert and constrain to original size
            var newPhoto = slide.insertImage(photoBlob, photoLeft, photoTop, photoWidth, photoHeight);
            newPhoto.setLeft(photoLeft);
            newPhoto.setTop(photoTop);
            newPhoto.setWidth(photoWidth);
            newPhoto.setHeight(photoHeight);
            
            Logger.log('Faculty photo swapped successfully');
          } else {
            Logger.log('Photo element not found');
          }
        } else {
          Logger.log('Failed to fetch photo blob');
        }
      } catch (e) {
        Logger.log('Photo swap failed: ' + e.message);
      }
    }
    
    var presId  = copy.getId();
    var slideId = slide.getObjectId();

    // Apply autofit BEFORE closing
    _setTextAutoFit(presId, [EL.COURSE_NAME, EL.TITLE_EN, EL.TITLE_HI, EL.FACULTY_NAME, expElementId]);

    // Save changes after all modifications
    pres.saveAndClose();

    var folder = _getOrCreateFolder(OUTPUT_FOLDER_NAME);
    if (folder) { folder.addFile(copy); DriveApp.getRootFolder().removeFile(copy); }

    var pngUrl = _exportPng(presId, slideId);
    var pptxUrl = _exportPptx(presId);

    return {
      success: true,
      url: 'https://docs.google.com/presentation/d/' + presId + '/edit',
      pngUrl: pngUrl,
      pptxUrl: pptxUrl,
      presentationId: presId
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// HELPERS
function _setText(element, text) {
  if (!element) return;
  try { 
    var cleanText = _stripHtml(text || '');
    element.asShape().getText().setText(cleanText); 
  } catch (_) {}
}

function _stripHtml(html) {
  if (!html) return '';
  var text = html.toString();
  
  // Convert common HTML elements to preserve structure
  text = text.replace(/<br\s*\/?>/gi, '\n');           // <br> to newline
  text = text.replace(/<\/p>/gi, '\n');                // </p> to newline
  text = text.replace(/<p[^>]*>/gi, '');               // Remove <p> tags
  text = text.replace(/<ul[^>]*>/gi, '\n');            // <ul> to newline (start list)
  text = text.replace(/<ol[^>]*>/gi, '\n');            // <ol> to newline (start list)
  text = text.replace(/<li[^>]*>/gi, '\n• ');          // <li> to newline + bullet
  text = text.replace(/<\/li>/gi, '');                 // Remove </li>
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

function _swapImage(slide, element, blob) {
  if (!element || !blob) {
    Logger.log('_swapImage skipped - element: ' + !!element + ', blob: ' + !!blob);
    return null;
  }
  try {
    var l = element.getLeft(), t = element.getTop();
    var w = element.getWidth(), h = element.getHeight();
    var oldId = element.getObjectId();
    Logger.log('Swapping element ' + oldId + ' at L:' + l + ' T:' + t);
    element.remove();
    var newImage = slide.insertImage(blob, l, t, w, h);
    Logger.log('Inserted new image, ID: ' + newImage.getObjectId());
    return newImage;
  } catch (e) {
    Logger.log('_swapImage error: ' + e.message);
    return null;
  }
}

function _exportPng(presId, slideId) {
  // Export at high resolution for PowerPoint (16:9 aspect ratio)
  // Using size parameter to ensure proper dimensions
  return 'https://docs.google.com/presentation/d/' + presId +
         '/export/png?id=' + presId + 
         '&pageid=' + encodeURIComponent(slideId) +
         '&size=1920,1080';
}

function _exportPptx(presId) {
  // Export as PowerPoint file - maintains exact slide dimensions
  return 'https://docs.google.com/presentation/d/' + presId + '/export/pptx';
}

function _fetchImageBlob(ref) {
  var val = (ref || '').trim();
  Logger.log('_fetchImageBlob called with: ' + val);
  
  if (!val) {
    Logger.log('_fetchImageBlob: empty value');
    return null;
  }
  
  // Fix protocol-relative URLs (//cdn.example.com -> https://cdn.example.com)
  if (val.indexOf('//') === 0) {
    val = 'https:' + val;
    Logger.log('_fetchImageBlob: fixed protocol-relative URL to: ' + val);
  }
  
  // Try to extract Drive file ID
  var m = val.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || val.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  var fid = m ? m[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(val) ? val : '');
  
  if (fid) {
    Logger.log('_fetchImageBlob: extracted file ID: ' + fid);
    try {
      var blob = DriveApp.getFileById(fid).getBlob();
      Logger.log('_fetchImageBlob: successfully fetched from Drive');
      return blob;
    } catch (e) {
      Logger.log('_fetchImageBlob: Drive fetch failed: ' + e.message);
      return null;
    }
  }
  
  // Try as direct URL
  if (/^https?:\/\//i.test(val)) {
    Logger.log('_fetchImageBlob: trying as direct URL');
    try {
      var r = UrlFetchApp.fetch(val, { muteHttpExceptions: true, followRedirects: true });
      var code = r.getResponseCode();
      Logger.log('_fetchImageBlob: URL fetch response code: ' + code);
      if (code === 200) {
        Logger.log('_fetchImageBlob: successfully fetched from URL');
        return r.getBlob();
      }
    } catch (e) {
      Logger.log('_fetchImageBlob: URL fetch failed: ' + e.message);
      return null;
    }
  }
  
  Logger.log('_fetchImageBlob: no valid format found');
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
            shapeProperties: { 
              autofit: { 
                autofitType: 'SHAPE_AUTOFIT',
                fontScale: 1.0
              } 
            },
            fields: 'autofit'
          }
        };
      });
    if (requests.length) Slides.Presentations.batchUpdate({ requests: requests }, presId);
  } catch (e) {
    Logger.log('Auto-fit (non-fatal): ' + e.message);
  }
}


// ── DIAGNOSTIC FUNCTIONS ────────────────────────────────────
function diagnoseTemplateElements() {
  try {
    var pres = SlidesApp.openById(TEMPLATE_PRESENTATION_ID);
    var slides = pres.getSlides();
    
    var targetSlide = null;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].getObjectId() === TEMPLATE_SLIDE_ID) {
        targetSlide = slides[i];
        break;
      }
    }
    
    if (!targetSlide) {
      Logger.log('ERROR: Template slide not found');
      return 'ERROR: Template slide not found';
    }
    
    var elements = targetSlide.getPageElements();
    Logger.log('=== ALL ELEMENTS IN TEMPLATE ===');
    Logger.log('Total elements: ' + elements.length + '\n');
    
    var report = [];
    
    for (var j = 0; j < elements.length; j++) {
      var el = elements[j];
      var id = el.getObjectId();
      var type = el.getPageElementType();
      var left = el.getLeft();
      var top = el.getTop();
      var width = el.getWidth();
      var height = el.getHeight();
      
      var info = 'Element ' + j + ':\n' +
                 '  ID: ' + id + '\n' +
                 '  Type: ' + type + '\n' +
                 '  Position: L=' + left.toFixed(1) + ' T=' + top.toFixed(1) + '\n' +
                 '  Size: W=' + width.toFixed(1) + ' H=' + height.toFixed(1);
      
      if (type == SlidesApp.PageElementType.SHAPE) {
        try {
          var text = el.asShape().getText().asString();
          info += '\n  Text: "' + text.substring(0, 50) + (text.length > 50 ? '...' : '') + '"';
        } catch (e) {}
      }
      
      // Check if this matches our expected IDs
      var matched = '';
      if (id === EL.COURSE_NAME) matched = ' [COURSE_NAME]';
      if (id === EL.TITLE_EN) matched = ' [TITLE_EN]';
      if (id === EL.TITLE_HI) matched = ' [TITLE_HI]';
      if (id === EL.FACULTY_NAME) matched = ' [FACULTY_NAME]';
      if (id === EL.EXPERIENCE) matched = ' [EXPERIENCE]';
      if (id === EL.LOGO) matched = ' [LOGO]';
      if (id === EL.PHOTO) matched = ' [PHOTO]';
      
      info += matched;
      
      Logger.log(info + '\n');
      report.push(info);
    }
    
    Logger.log('\n=== EXPECTED ELEMENT IDs ===');
    Logger.log('COURSE_NAME: ' + EL.COURSE_NAME);
    Logger.log('TITLE_EN: ' + EL.TITLE_EN);
    Logger.log('TITLE_HI: ' + EL.TITLE_HI);
    Logger.log('FACULTY_NAME: ' + EL.FACULTY_NAME);
    Logger.log('EXPERIENCE: ' + EL.EXPERIENCE);
    Logger.log('LOGO: ' + EL.LOGO);
    Logger.log('PHOTO: ' + EL.PHOTO);
    
    return 'Check logs for details';
    
  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    return 'ERROR: ' + e.message;
  }
}


// TEST FUNCTION - Test image swapping with sample data
function testImageSwap() {
  var testData = {
    titleEn: 'Test Topic',
    titleHi: 'परीक्षण विषय',
    courseName: 'Test Course',
    facultyName: 'Test Faculty',
    achievement: 'Test experience text',
    // Test with protocol-relative URL (like your actual data)
    facultyPhoto: '//cdn.testbook.com/resources/productionimages/Capture%20-%20Anahad%20Sharma%20_All_1649772456.png',
    // Use Supercoaching logo
    logoFileId: '1uk0WDNEixfIVXiVFKC74RIZqN_ZyJBHT'
  };
  
  Logger.log('Running test with protocol-relative URL for faculty photo...');
  var result = generateTitleSlide(testData);
  Logger.log('Test result: ' + JSON.stringify(result));
  
  if (result.success) {
    Logger.log('SUCCESS! Check the slide at: ' + result.url);
    Logger.log('You should see:');
    Logger.log('  - Supercoaching logo at bottom-left');
    Logger.log('  - Faculty photo at top-right');
  } else {
    Logger.log('FAILED: ' + result.error);
  }
  
  return result;
}


// TEST FUNCTION - Check faculty photo URLs from sheet
function checkFacultyPhotos() {
  try {
    var facResp = Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, FACULTY_SHEET + '!A1:Z');
    var facData = facResp.values || [];
    var header  = facData.length ? facData[0] : [];
    
    var nameIdx = 0, photoIdx = -1;
    
    for (var h = 0; h < header.length; h++) {
      var k = (header[h] || '').toString().trim().toLowerCase();
      if (k === 'name' || k === 'faculty name' || k === '_id') nameIdx = h;
      if (k === 'photo' || k === 'faculty photo' || k === 'image') photoIdx = h;
    }
    
    Logger.log('Photo column index: ' + photoIdx);
    Logger.log('\n=== FACULTY PHOTOS (first 5) ===');
    
    for (var i = 1; i < Math.min(6, facData.length); i++) {
      var row = facData[i] || [];
      var name = (row[nameIdx] || '').toString().trim();
      var photo = photoIdx >= 0 ? (row[photoIdx] || '').toString().trim() : '';
      
      Logger.log('\nFaculty: ' + name);
      Logger.log('Photo URL: ' + photo);
      
      if (photo) {
        var blob = _fetchImageBlob(photo);
        Logger.log('Blob fetch result: ' + (blob ? 'SUCCESS' : 'FAILED'));
      }
    }
    
    return 'Check logs';
  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    return 'ERROR: ' + e.message;
  }
}


// TEST FUNCTION - Verify both logos are accessible
function testBothLogos() {
  Logger.log('=== TESTING BOTH LOGOS ===\n');
  
  for (var i = 0; i < BUILT_IN_LOGOS.length; i++) {
    var logo = BUILT_IN_LOGOS[i];
    Logger.log('Testing: ' + logo.name);
    Logger.log('File ID: ' + logo.id);
    
    try {
      var file = DriveApp.getFileById(logo.id);
      Logger.log('✓ File found: ' + file.getName());
      Logger.log('  MIME type: ' + file.getMimeType());
      Logger.log('  Size: ' + file.getSize() + ' bytes');
      
      var blob = file.getBlob();
      Logger.log('✓ Blob fetched successfully');
      Logger.log('  Content type: ' + blob.getContentType());
      
    } catch (e) {
      Logger.log('✗ ERROR: ' + e.message);
    }
    Logger.log('');
  }
  
  // Now test generating slides with each logo
  Logger.log('\n=== TESTING SLIDE GENERATION WITH EACH LOGO ===\n');
  
  for (var j = 0; j < BUILT_IN_LOGOS.length; j++) {
    var testLogo = BUILT_IN_LOGOS[j];
    Logger.log('Generating slide with: ' + testLogo.name);
    
    var testData = {
      titleEn: 'Test with ' + testLogo.name,
      titleHi: 'परीक्षण',
      courseName: 'Test Course',
      facultyName: 'Test Faculty',
      achievement: 'Test experience',
      facultyPhoto: '//cdn.testbook.com/resources/productionimages/Capture%20-%20Anahad%20Sharma%20_All_1649772456.png',
      logoFileId: testLogo.id
    };
    
    var result = generateTitleSlide(testData);
    
    if (result.success) {
      Logger.log('✓ SUCCESS: ' + result.url);
    } else {
      Logger.log('✗ FAILED: ' + result.error);
    }
    Logger.log('');
  }
  
  return 'Check logs for details';
}
