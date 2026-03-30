// COMPREHENSIVE DIAGNOSTIC - Run this to see ALL elements in template
function diagnoseTemplateElements() {
  var TEMPLATE_PRESENTATION_ID = '1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk';
  var TEMPLATE_SLIDE_ID = 'g3d776b36914_4_75';
  
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
      return;
    }
    
    var elements = targetSlide.getPageElements();
    Logger.log('=== ALL ELEMENTS IN TEMPLATE ===\n');
    
    var images = [];
    var shapes = [];
    
    for (var j = 0; j < elements.length; j++) {
      var el = elements[j];
      var id = el.getObjectId();
      var type = el.getPageElementType();
      var left = el.getLeft();
      var top = el.getTop();
      var width = el.getWidth();
      var height = el.getHeight();
      
      var info = 'ID: ' + id + '\n  Type: ' + type + '\n  Position: L=' + left.toFixed(1) + ' T=' + top.toFixed(1) + '\n  Size: W=' + width.toFixed(1) + ' H=' + height.toFixed(1);
      
      if (type == SlidesApp.PageElementType.SHAPE) {
        try {
          var text = el.asShape().getText().asString();
          info += '\n  Text: "' + text.substring(0, 50) + (text.length > 50 ? '...' : '') + '"';
        } catch (e) {}
        shapes.push(info);
      } else if (type == SlidesApp.PageElementType.IMAGE) {
        images.push(info);
      }
      
      Logger.log(info + '\n');
    }
    
    Logger.log('\n=== SUMMARY ===');
    Logger.log('Total Images: ' + images.length);
    Logger.log('Total Shapes: ' + shapes.length);
    
  } catch (e) {
    Logger.log('ERROR: ' + e.message);
  }
}

// TEST FUNCTION - Run this in Apps Script to verify template elements
function testTemplateElements() {
  var TEMPLATE_PRESENTATION_ID = '1v2hScTPtBkXVJq_swTFcwnIn_BdAr-DofBOOO7ozpfk';
  var TEMPLATE_SLIDE_ID = 'g3d776b36914_4_75';
  
  var EL = {
    COURSE_NAME:  'g3d7e9597ed0_1_1',
    TITLE_EN:     'g3d7e9597ed0_1_2',
    FACULTY_NAME: 'g3d7e9597ed0_1_3',
    TITLE_HI:     'g3d7e9597ed0_1_4',
    EXPERIENCE:   'g3d7e9597ed0_1_5',
    LOGO:         'g3d7e9597ed0_1_6',
    PHOTO:        'g3d7e9597ed0_1_8'
  };
  
  try {
    var pres = SlidesApp.openById(TEMPLATE_PRESENTATION_ID);
    var slides = pres.getSlides();
    
    Logger.log('Total slides in template: ' + slides.length);
    
    var targetSlide = null;
    for (var i = 0; i < slides.length; i++) {
      Logger.log('Slide ' + i + ' ID: ' + slides[i].getObjectId());
      if (slides[i].getObjectId() === TEMPLATE_SLIDE_ID) {
        targetSlide = slides[i];
      }
    }
    
    if (!targetSlide) {
      Logger.log('ERROR: Template slide not found with ID: ' + TEMPLATE_SLIDE_ID);
      return;
    }
    
    Logger.log('Found template slide!');
    
    var elements = targetSlide.getPageElements();
    Logger.log('Total elements on slide: ' + elements.length);
    
    var foundElements = {};
    
    for (var j = 0; j < elements.length; j++) {
      var el = elements[j];
      var id = el.getObjectId();
      var type = el.getPageElementType().toString();
      
      Logger.log('Element ' + j + ': ID=' + id + ', Type=' + type);
      
      // Check if this is one of our target elements
      for (var key in EL) {
        if (EL[key] === id) {
          foundElements[key] = true;
          Logger.log('  -> FOUND: ' + key);
        }
      }
    }
    
    Logger.log('\n=== RESULTS ===');
    Logger.log('COURSE_NAME found: ' + !!foundElements.COURSE_NAME);
    Logger.log('TITLE_EN found: ' + !!foundElements.TITLE_EN);
    Logger.log('TITLE_HI found: ' + !!foundElements.TITLE_HI);
    Logger.log('FACULTY_NAME found: ' + !!foundElements.FACULTY_NAME);
    Logger.log('EXPERIENCE found: ' + !!foundElements.EXPERIENCE);
    Logger.log('LOGO found: ' + !!foundElements.LOGO);
    Logger.log('PHOTO found: ' + !!foundElements.PHOTO);
    
    if (!foundElements.EXPERIENCE) {
      Logger.log('\nERROR: EXPERIENCE element not found! Check element ID.');
    }
    
    if (!foundElements.PHOTO) {
      Logger.log('\nERROR: PHOTO element not found! Check element ID.');
    }
    
  } catch (e) {
    Logger.log('ERROR: ' + e.message);
  }
}
