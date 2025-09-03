# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Red Cross Training Search Portal - A single-page web application for searching and discovering American Red Cross training courses. Built with vanilla JavaScript, HTML5, and CSS3 with zero external dependencies for maximum performance and GitHub Pages compatibility.

## Development Commands

### Local Development Server
```bash
# Start local server (from project root)
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/GitHub/redcross-training-search
python3 -m http.server 8001

# Access at: http://localhost:8001
```

### Git Workflow
```bash
# Check status
git status

# Stage, commit and push changes
git add -A
git commit -m "Your commit message"
git push origin main

# GitHub Pages deploys automatically within 2-5 minutes
# Live URL: https://franzenjb.github.io/redcross-training-search/
```

### Data Processing Scripts
```bash
# Add prerequisites to courses (Python)
python3 add_prerequisites.py

# Update Excel with course codes (Python)
python3 update_excel_with_codes_v2.py
```

## Architecture

### Core Data Flow
1. **courses-enhanced.json** (706KB) - Primary data source with prerequisites and relationships
2. **courses.json** (348KB) - Fallback data without enhancements
3. **courses-data.js** - Embedded JavaScript data for GitHub Pages fallback
4. Data loaded via fetch() → parsed → stored in `allCourses` array → filtered to `filteredCourses` → rendered to DOM

### State Management
- **allCourses**: Master array of all course objects loaded from JSON
- **filteredCourses**: Currently displayed courses after search/filter operations
- **bookmarkedCourses**: Set of course IDs stored in localStorage
- **viewingBookmarks**: Boolean flag for bookmark view mode

### Key Functions Architecture
```javascript
// Data Loading Chain
loadCourses() → fetch JSON → initializeFilters() → displayCourses() → loadBookmarks()

// Filter/Search Flow
handleFilterChange() → applyFilters() → updates filteredCourses → displayCourses()

// Bookmark System
toggleBookmark() → updates bookmarkedCourses Set → saveBookmarks() to localStorage
toggleBookmarksView() → filters to bookmarked only → displayCourses()
```

### Course Object Structure
```javascript
{
  id: number,
  name: string,
  type: "Event ESG" | "Material ESG" | "Curriculum ESG",
  courseCode: "ACCS XXXXX",  // Used for color coding
  description: string,
  category: string,
  level: "Beginner" | "Intermediate" | "Advanced",
  duration: string,
  delivery: "In-Person" | "Virtual" | "Self-Study" | "Blended" | "Various",
  tags: array,
  prerequisites: array (optional),
  prerequisiteFor: array (optional)
}
```

## Color Coding System

Course codes are color-coded based on first digit:
- **1xxxx** → Green (Beginner level)
- **2xxxx** → Yellow (Intermediate level)  
- **3xxxx** → Red (Advanced level)

Implementation in `app.js:141-154` extracts first digit from courseCode and applies CSS classes.

## localStorage Schema

```javascript
// Bookmarks storage
localStorage.setItem('redcross-bookmarks', JSON.stringify([courseId1, courseId2, ...]))
```

## Critical UI State Dependencies

1. **Bookmark View Toggle**: When `viewingBookmarks = true`, filters/search auto-exit this mode
2. **Clear Filters**: Respects bookmark view state (won't reset if viewing bookmarks)
3. **Results Title**: Dynamically updates based on current view context
4. **Bookmark Count Badge**: Auto-hides when count is 0

## File Purposes

- **index.html**: Single page structure with modals, filters, grid container
- **app.js**: All JavaScript logic - no modules, runs directly in browser
- **styles.css**: Complete styling including responsive breakpoints
- **courses-enhanced.json**: Primary data with prerequisites (fetch first)
- **courses.json**: Fallback data without enhancements
- **courses-data.js**: Emergency fallback for GitHub Pages
- **Python scripts**: Data preprocessing tools (not used in runtime)

## Deployment Notes

- Static site optimized for GitHub Pages (no server-side code)
- All paths must be relative for GitHub Pages subdirectory hosting
- Data files cached with version query strings (`?v=3.0`)
- Deployment automatic on push to main branch
- Check build status: https://github.com/franzenjb/redcross-training-search/actions

## Browser Compatibility

Targets modern browsers (2020+) with native ES6 support:
- async/await
- Array methods (filter, map, includes)
- Template literals
- localStorage
- CSS Grid/Flexbox