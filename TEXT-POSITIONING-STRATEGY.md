# Text Positioning & Overflow Strategy

## Problem
Titles, course names, and faculty names vary in length, causing:
- Text overflow outside text boxes
- Inconsistent appearance
- Poor readability

## Current Implementation
The code uses `_setTextAutoFit()` which applies `TEXT_AUTOFIT` to shrink text. However, this may not be sufficient for very long text.

## Comprehensive Solution Strategy

### Strategy 1: Enhanced Auto-Fit (Recommended)
Combine multiple techniques for robust text handling:

#### A. Text Auto-Fit (Already Implemented)
```javascript
function _setTextAutoFit(presId, objectIds) {
  var requests = objectIds.map(function(id) {
    return {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: { 
          autofit: { autofitType: 'TEXT_AUTOFIT' }  // Shrinks text to fit
        },
        fields: 'autofit'
      }
    };
  });
  Slides.Presentations.batchUpdate({ requests: requests }, presId);
}
```

#### B. Add Text Truncation (Fallback)
For extremely long text, truncate with ellipsis:

```javascript
function _truncateText(text, maxLength) {
  if (!text) return '';
  text = text.trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

#### C. Smart Text Sizing
Calculate appropriate font size based on text length:

```javascript
function _getOptimalFontSize(text, baseSize, maxLength) {
  var len = (text || '').length;
  if (len <= maxLength) return baseSize;
  
  // Reduce font size proportionally
  var ratio = maxLength / len;
  var newSize = Math.max(baseSize * ratio, baseSize * 0.5); // Min 50% of base
  return Math.round(newSize);
}
```

### Strategy 2: Dynamic Text Box Sizing
Adjust text box dimensions based on content:

```javascript
function _adjustTextBoxSize(shape, text) {
  var textLength = (text || '').length;
  
  // Get current dimensions
  var width = shape.getWidth();
  var height = shape.getHeight();
  
  // Expand height if text is long
  if (textLength > 100) {
    var newHeight = height * 1.5;
    shape.setHeight(newHeight);
  }
}
```

### Strategy 3: Multi-Line Text Wrapping
Enable word wrap and adjust line spacing:

```javascript
function _setTextWrapping(presId, objectId) {
  var requests = [{
    updateParagraphStyle: {
      objectId: objectId,
      style: {
        lineSpacing: 100,  // 100% line spacing
        spaceAbove: { magnitude: 0, unit: 'PT' },
        spaceBelow: { magnitude: 0, unit: 'PT' }
      },
      fields: 'lineSpacing,spaceAbove,spaceBelow'
    }
  }];
  Slides.Presentations.batchUpdate({ requests: requests }, presId);
}
```

### Strategy 4: Character Limits with Validation
Set maximum character limits per field:

```javascript
var TEXT_LIMITS = {
  COURSE_NAME: 50,    // "UPSC CSE Prelims 2025"
  TITLE_EN: 80,       // Main title
  TITLE_HI: 80,       // Hindi title
  FACULTY_NAME: 30,   // "Dr. Rajesh Kumar"
  EXPERIENCE: 40      // "15+ Years Experience"
};

function _validateAndTruncate(formData) {
  return {
    courseName: _truncateText(formData.courseName, TEXT_LIMITS.COURSE_NAME),
    titleEn: _truncateText(formData.titleEn, TEXT_LIMITS.TITLE_EN),
    titleHi: _truncateText(formData.titleHi, TEXT_LIMITS.TITLE_HI),
    facultyName: _truncateText(formData.facultyName, TEXT_LIMITS.FACULTY_NAME),
    achievement: _truncateText(formData.achievement, TEXT_LIMITS.EXPERIENCE)
  };
}
```

### Strategy 5: Template Design Guidelines
Optimize the template slide itself:

#### Text Box Sizing:
- **Course Name**: 200pt width × 40pt height
- **Title EN**: 350pt width × 60pt height (allow 2-3 lines)
- **Title HI**: 350pt width × 50pt height
- **Faculty Name**: 220pt width × 30pt height
- **Experience**: 220pt width × 25pt height

#### Font Sizes:
- **Course Name**: 18pt (bold)
- **Title EN**: 24pt (bold)
- **Title HI**: 20pt (bold)
- **Faculty Name**: 16pt (bold)
- **Experience**: 14pt (regular)

#### Margins & Padding:
- Add 10pt padding inside each text box
- Ensure 15pt minimum spacing between elements

## Recommended Implementation

### Phase 1: Immediate Fix (Use Now)
```javascript
function generateTitleSlide(formData) {
  try {
    // Validate and truncate text
    var titleEn = _truncateText(formData.titleEn || '', 80);
    var titleHi = _truncateText(formData.titleHi || '', 80);
    var courseName = _truncateText(formData.courseName || '', 50);
    var facultyName = _truncateText(formData.facultyName || '', 30);
    var experience = _truncateText(formData.achievement || '', 40);
    
    // ... rest of slide generation code ...
    
    // Apply autofit to all text elements
    _setTextAutoFit(presId, [
      EL.COURSE_NAME, 
      EL.TITLE_EN, 
      EL.TITLE_HI, 
      EL.FACULTY_NAME, 
      EL.EXPERIENCE
    ]);
    
    return { success: true, url: slideUrl, pngUrl: pngUrl };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function _truncateText(text, maxLength) {
  if (!text) return '';
  text = text.trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

### Phase 2: Enhanced Solution (Future)
Add dynamic font sizing:

```javascript
function _setDynamicFontSize(presId, objectId, text, baseFontSize, maxLength) {
  var fontSize = _getOptimalFontSize(text, baseFontSize, maxLength);
  
  var requests = [{
    updateTextStyle: {
      objectId: objectId,
      style: { fontSize: { magnitude: fontSize, unit: 'PT' } },
      fields: 'fontSize'
    }
  }];
  
  Slides.Presentations.batchUpdate({ requests: requests }, presId);
}
```

### Phase 3: Frontend Validation (Best UX)
Add character counters in the frontend:

```javascript
// In frontend/app.js
function updateCharacterCount(inputId, maxLength) {
  const input = document.getElementById(inputId);
  const counter = document.createElement('span');
  counter.className = 'char-counter';
  
  input.addEventListener('input', () => {
    const remaining = maxLength - input.value.length;
    counter.textContent = `${remaining} characters remaining`;
    counter.style.color = remaining < 10 ? 'red' : '#999';
  });
  
  input.parentElement.appendChild(counter);
}
```

## Testing Strategy

### Test Cases:
1. **Short text** (10-20 chars): Should display at full size
2. **Medium text** (40-60 chars): Should fit comfortably
3. **Long text** (80-100 chars): Should auto-shrink or truncate
4. **Very long text** (150+ chars): Should truncate with ellipsis

### Test Data:
```javascript
var testCases = [
  {
    name: "Short",
    titleEn: "Introduction to UPSC",
    titleHi: "यूपीएससी का परिचय"
  },
  {
    name: "Medium",
    titleEn: "India's Foreign Policy and International Relations",
    titleHi: "भारत की विदेश नीति और अंतर्राष्ट्रीय संबंध"
  },
  {
    name: "Long",
    titleEn: "Comprehensive Analysis of India's Engagement with Multipolar World Order and Global Governance",
    titleHi: "बहुध्रुवीय विश्व व्यवस्था और वैश्विक शासन के साथ भारत की व्यस्तता का व्यापक विश्लेषण"
  }
];
```

## Recommended Character Limits

| Field | Recommended | Maximum | Action if Exceeded |
|-------|-------------|---------|-------------------|
| Course Name | 30 | 50 | Truncate + ellipsis |
| Title EN | 60 | 80 | Auto-shrink font |
| Title HI | 60 | 80 | Auto-shrink font |
| Faculty Name | 20 | 30 | Truncate + ellipsis |
| Experience | 25 | 40 | Truncate + ellipsis |

## Implementation Priority

1. ✅ **Immediate**: Add `_truncateText()` function
2. ✅ **Immediate**: Apply to all text fields
3. ⏳ **Next**: Add frontend character counters
4. ⏳ **Future**: Dynamic font sizing
5. ⏳ **Future**: Template redesign with larger text boxes

## Code to Add Now

Add this helper function to Code-API.gs:

```javascript
// Add after other helper functions
function _truncateText(text, maxLength) {
  if (!text) return '';
  text = text.toString().trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

Update `generateTitleSlide()` to use truncation:

```javascript
function generateTitleSlide(formData) {
  try {
    // Truncate text to prevent overflow
    var titleEn = _truncateText(formData.titleEn || 'Untitled Topic', 80);
    var titleHi = _truncateText(formData.titleHi || '', 80);
    var courseName = _truncateText(formData.courseName || '', 50);
    var facultyName = _truncateText(formData.facultyName || 'Faculty', 30);
    var experience = _truncateText(formData.achievement || formData.experience || '', 40);
    
    // ... rest of code unchanged ...
  }
}
```

This ensures text never overflows while maintaining readability.
