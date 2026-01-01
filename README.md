# 📚 Gutendex Library - 2 Page Application

A proper 2-page book browsing application built according to the requirements with dark theme colors.

## 🎨 Dark Theme Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Dark Navy | `#0E0E34` | Main background |
| Royal Blue | `#252E8A` | Primary buttons, accents |
| Purple | `#9A4D87` | Secondary accents, hover states |
| Light Blue | `#5A7FC8` | Tertiary accents, borders |
| White | `#F7F6F7` | Text and card backgrounds |

## 📋 Requirements Met

### ✅ 2-Page Structure

**PAGE 1: Category Selection**
- App title at the top
- 8 category buttons (Fiction, Mystery, Romance, History, Science, Fantasy, Adventure, Philosophy)
- Clean, modern layout
- Click category → Navigate to Page 2

**PAGE 2: Books List**
- Back button to return to Page 1
- Search bar at the top
- Books displayed in grid
- Infinite scroll (auto-loads more books)
- Click book → Opens in browser

### ✅ Core Functionality

1. **Category Filtering**
   - Select category on Page 1
   - Page 2 loads books for that category
   - Category filter maintained during search

2. **Search Feature**
   - Search bar on Page 2
   - Searches both title AND author
   - Debounced (500ms after typing stops)
   - Combines with category filter
   - Example: "Fiction" + "Vampire" = Fiction books about vampires

3. **Infinite Scroll**
   - Automatically loads more books when scrolling down
   - Uses API's `next` field for pagination
   - Shows "Loading more..." indicator
   - Shows "End of results" when done

4. **Book Opening Priority**
   - Priority 1: HTML format
   - Priority 2: PDF format
   - Priority 3: TXT format
   - Alert: "No viewable version available" if none exist

5. **Image Filtering**
   - Only shows books with covers
   - Uses `mime_type=image` parameter
   - Fallback gradient for broken images

### ✅ Technical Requirements

- ✅ Clean, consistent code
- ✅ Proper indentation
- ✅ Comprehensive comments
- ✅ Good naming conventions
- ✅ Error handling
- ✅ Responsive design
- ✅ Loading states
- ✅ Accessibility features

## 🚀 How to Use

### Installation

1. Download all files to the same folder:
   - `index.html`
   - `styles.css`
   - `app.js`

2. Open `index.html` in your browser

3. Start browsing!

### User Flow

```
Page 1 (Category Selection)
    ↓ [Click category button]
Page 2 (Books List)
    ↓ [Scroll down]
Infinite scroll loads more books
    ↓ [Type in search]
Books filtered by category + search
    ↓ [Click book card]
Opens in new browser tab (HTML > PDF > TXT)
```

## 🎯 Key Features

### Page Navigation
```javascript
// Navigate from Page 1 to Page 2
function selectCategory(category) {
  state.selectedCategory = category;
  showPage('books');
  loadBooks();
}

// Navigate back to Page 1
function goBackToCategories() {
  showPage('category');
  // Reset state and clear books
}
```

### API Query Building
```javascript
// Combines category + search + image filter
function buildApiUrl() {
  const params = new URLSearchParams();
  
  if (state.selectedCategory) {
    params.append('topic', state.selectedCategory);
  }
  
  if (state.searchQuery) {
    params.append('search', state.searchQuery);
  }
  
  // CRITICAL: Only books with covers
  params.append('mime_type', 'image');
  
  return `${API_BASE_URL}?${params.toString()}`;
}
```

### Search with Category Maintained
```javascript
// Example: User selects "Fiction" then searches "Vampire"
// API call: /books?topic=fiction&search=vampire&mime_type=image
// Result: Fiction books with "vampire" in title or author

function performSearch(query) {
  state.searchQuery = query;
  // state.selectedCategory is MAINTAINED
  loadBooks();
}
```

### Book Opening Logic
```javascript
function openBook(formats) {
  let bookUrl = null;
  
  // Priority 1: HTML
  if (formats['text/html']) {
    bookUrl = formats['text/html'];
  }
  // Priority 2: PDF
  else if (formats['application/pdf']) {
    bookUrl = formats['application/pdf'];
  }
  // Priority 3: TXT
  else if (formats['text/plain']) {
    bookUrl = formats['text/plain'];
  }
  
  if (bookUrl) {
    window.open(bookUrl, '_blank');
  } else {
    alert('No viewable version available');
  }
}
```

## 🎨 CSS Architecture

### Page System
```css
.page {
  display: none;  /* Hidden by default */
}

.page.active {
  display: block;  /* Only active page visible */
}
```

### Dark Theme Variables
```css
:root {
  --bg-primary: #0E0E34;
  --accent-primary: #5A7FC8;
  --accent-secondary: #9A4D87;
  --text-primary: #F7F6F7;
}
```

### Responsive Grid
```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}
```

## 🔧 State Management

```javascript
const state = {
  currentPage: 'category',      // Which page is active
  selectedCategory: '',         // Selected category (e.g., 'fiction')
  searchQuery: '',              // Search text
  nextPageUrl: null,            // URL for next page (pagination)
  isLoading: false,             // Initial loading state
  isLoadingMore: false,         // Loading more (infinite scroll)
  books: []                     // All loaded books
};
```

## 📱 Responsive Design

| Screen Size | Category Grid | Books Grid |
|-------------|---------------|------------|
| Desktop (>768px) | 3-4 columns | 6-7 columns |
| Tablet (768px) | 2 columns | 4-5 columns |
| Mobile (<480px) | 1 column | 2 columns |

## 🎯 Example Scenarios

### Scenario 1: Browse Fiction
```
1. User clicks "Fiction" button on Page 1
2. App navigates to Page 2
3. API call: /books?topic=fiction&mime_type=image
4. Display fiction books with covers
```

### Scenario 2: Search within Fiction
```
1. User is on Page 2 viewing Fiction books
2. User types "Vampire" in search box
3. After 500ms, API is called
4. API call: /books?topic=fiction&search=vampire&mime_type=image
5. Display fiction books with "vampire" in title/author
```

### Scenario 3: Infinite Scroll
```
1. User scrolls down on Page 2
2. When near bottom, app detects scroll position
3. API call using state.nextPageUrl (from previous response)
4. New books are appended to grid
5. Process repeats until no more pages
```

### Scenario 4: Open Book
```
1. User clicks a book card
2. App checks formats in priority order:
   - Check for text/html → Open if exists
   - Check for application/pdf → Open if exists
   - Check for text/plain → Open if exists
   - None exist → Show alert
3. Book opens in new browser tab
```

## 🐛 Error Handling

### Network Errors
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error();
  // Process data...
} catch (error) {
  showError('Failed to load books. Please try again.');
}
```

### Image Loading Errors
```html
<img 
  onerror="this.style.background='linear-gradient(...)'"
  loading="lazy"
/>
```

### No Results
```javascript
if (state.books.length === 0) {
  showNoResults(); // "No books found" message
}
```

## ⚡ Performance Optimizations

1. **Debounced Search** - Waits 500ms after typing stops
2. **Debounced Scroll** - Scroll event throttled to 100ms
3. **Lazy Loading** - Images load only when visible
4. **Request Prevention** - Blocks duplicate API calls
5. **Pagination** - Loads 32 books at a time, not all at once

## ✨ UI/UX Features

1. **Smooth Animations** - Page transitions, hover effects
2. **Loading Indicators** - Spinners for loading states
3. **Empty States** - Helpful messages when no results
4. **Error Recovery** - Retry button after errors
5. **Visual Feedback** - Hover effects, active states
6. **Keyboard Support** - Enter to search, Escape to clear
7. **Responsive** - Works on all screen sizes
8. **Accessibility** - Focus indicators, semantic HTML

## 🎓 Code Quality

### Clean Code
- Descriptive variable names
- Comprehensive comments
- Logical function organization
- Consistent formatting

### Security
- XSS protection with `escapeHtml()`
- Safe `window.open()` with noopener
- Input sanitization

### Best Practices
- DRY (Don't Repeat Yourself)
- Single Responsibility functions
- Error handling throughout
- State management pattern

## 📊 API Integration

### Base URL
```
http://skunkworks.ignitesol.com:8000/books
```

### Query Parameters Used

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `topic` | Filter by category | `topic=fiction` |
| `search` | Search title/author | `search=vampire` |
| `mime_type` | Filter for images | `mime_type=image` |

### Response Structure
```json
{
  "count": 12345,
  "next": "http://...?page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "title": "Book Title",
      "authors": [{"name": "Author Name"}],
      "formats": {
        "text/html": "url",
        "application/pdf": "url",
        "text/plain": "url",
        "image/jpeg": "url"
      }
    }
  ]
}
```

## 🔍 Testing Checklist

**Page 1:**
- ✅ Title displays correctly
- ✅ All 8 category buttons visible
- ✅ Clicking category navigates to Page 2
- ✅ Hover effects work

**Page 2:**
- ✅ Back button returns to Page 1
- ✅ Page title shows selected category
- ✅ Search bar present and functional
- ✅ Books load for selected category
- ✅ Books have covers (no cover = not shown)
- ✅ Search filters within category
- ✅ Infinite scroll loads more books
- ✅ Clicking book opens in new tab
- ✅ Book format priority works (HTML > PDF > TXT)
- ✅ Alert shows when no format available
- ✅ Loading indicators display
- ✅ Error messages work
- ✅ Responsive on mobile/tablet/desktop

## 🎉 Features Summary

### Required Features ✅
- [x] 2-page structure with navigation
- [x] Category selection page
- [x] Books list page
- [x] Infinite scroll using API's `next` field
- [x] Search maintains category filter
- [x] Book opening with format priority
- [x] Alert for unavailable formats
- [x] Only books with covers (mime_type=image)

### Bonus Features ✨
- [x] Dark theme with custom colors
- [x] Smooth animations and transitions
- [x] Loading states and error handling
- [x] Debounced search (performance)
- [x] Responsive design
- [x] Keyboard shortcuts
- [x] Accessibility features
- [x] XSS protection

## 🚀 Ready to Use!

Just open `index.html` in your browser and start exploring books! The application follows all requirements from the instruction document.

---

**Built according to Gutendex API requirements** 📚✨
