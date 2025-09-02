// Red Cross Training Search Application
let allCourses = [];
let filteredCourses = [];
let bookmarkedCourses = new Set();

// Load bookmarks from localStorage
function loadBookmarks() {
    const saved = localStorage.getItem('redcross-bookmarks');
    if (saved) {
        bookmarkedCourses = new Set(JSON.parse(saved));
        updateBookmarkCount();
    }
}

// Save bookmarks to localStorage
function saveBookmarks() {
    localStorage.setItem('redcross-bookmarks', JSON.stringify([...bookmarkedCourses]));
    updateBookmarkCount();
}

// Update bookmark count in header
function updateBookmarkCount() {
    document.getElementById('bookmarked-count').textContent = bookmarkedCourses.size;
}

// Load courses data
async function loadCourses() {
    try {
        const response = await fetch('courses.json');
        allCourses = await response.json();
        filteredCourses = [...allCourses];
        
        // Update total courses count
        document.getElementById('total-courses').textContent = allCourses.length;
        
        // Initialize filters
        initializeFilters();
        
        // Display courses
        displayCourses();
        
        // Load bookmarks
        loadBookmarks();
    } catch (error) {
        console.error('Error loading courses:', error);
        // For GitHub Pages, we'll embed the data
        loadEmbeddedData();
    }
}

// Initialize dynamic filters
function initializeFilters() {
    // Get unique categories
    const categories = [...new Set(allCourses.map(c => c.category))].sort();
    const categoryFilters = document.getElementById('category-filters');
    
    categories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'filter-option';
        label.innerHTML = `
            <input type="checkbox" value="${category}">
            <span>${getCategoryIcon(category)} ${category}</span>
        `;
        categoryFilters.appendChild(label);
    });
    
    // Add event listeners to all filters
    document.querySelectorAll('.filter-option input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'Accessibility': '♿',
        'Disaster Services': '🚨',
        'Information Technology': '💻',
        'Leadership': '👔',
        'Diversity & Inclusion': '🤝',
        'Customer Service': '💬',
        'Quality Assurance': '✅',
        'Health & Safety': '🏥',
        'General Training': '📚'
    };
    return icons[category] || '📋';
}

// Get level badge
function getLevelBadge(level) {
    const badges = {
        'Beginner': '<span class="level-badge beginner">🟢 Beginner</span>',
        'Intermediate': '<span class="level-badge intermediate">🟡 Intermediate</span>',
        'Advanced': '<span class="level-badge advanced">🔴 Advanced</span>'
    };
    return badges[level] || '';
}

// Get delivery icon
function getDeliveryIcon(delivery) {
    const icons = {
        'In-Person': '👥',
        'Virtual': '💻',
        'Self-Study': '📚',
        'Blended': '🔄',
        'Various': '📋'
    };
    return icons[delivery] || '📋';
}

// Display courses
function displayCourses() {
    const grid = document.getElementById('courses-grid');
    const noResults = document.getElementById('no-results');
    
    if (filteredCourses.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    grid.innerHTML = filteredCourses.map(course => `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <h3>${course.name}</h3>
                <button class="bookmark-btn ${bookmarkedCourses.has(course.id) ? 'bookmarked' : ''}" 
                        data-id="${course.id}" aria-label="Bookmark course">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${bookmarkedCourses.has(course.id) ? '#ED1B2E' : 'none'}" stroke="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <div class="course-meta">
                ${getLevelBadge(course.level)}
                <span class="delivery">${getDeliveryIcon(course.delivery)} ${course.delivery}</span>
                <span class="duration">⏱️ ${course.duration}</span>
            </div>
            <div class="course-category">
                ${getCategoryIcon(course.category)} ${course.category}
            </div>
            <p class="course-description">${course.description ? course.description.substring(0, 150) + '...' : 'No description available'}</p>
            <div class="course-type">${course.type}</div>
            <button class="view-details-btn" data-id="${course.id}">View Details</button>
        </div>
    `).join('');
    
    // Add event listeners to bookmark buttons
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', toggleBookmark);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', showCourseDetails);
    });
    
    // Update results title
    document.getElementById('results-title').textContent = `${filteredCourses.length} Courses Found`;
}

// Toggle bookmark
function toggleBookmark(e) {
    e.stopPropagation();
    const courseId = parseInt(e.currentTarget.dataset.id);
    
    if (bookmarkedCourses.has(courseId)) {
        bookmarkedCourses.delete(courseId);
        e.currentTarget.classList.remove('bookmarked');
        e.currentTarget.querySelector('svg').setAttribute('fill', 'none');
    } else {
        bookmarkedCourses.add(courseId);
        e.currentTarget.classList.add('bookmarked');
        e.currentTarget.querySelector('svg').setAttribute('fill', '#ED1B2E');
    }
    
    saveBookmarks();
}

// Show course details
function showCourseDetails(e) {
    const courseId = parseInt(e.currentTarget.dataset.id);
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) return;
    
    const modal = document.getElementById('course-modal');
    const content = document.getElementById('modal-course-content');
    
    content.innerHTML = `
        <h2>${course.name}</h2>
        <div class="modal-meta">
            ${getLevelBadge(course.level)}
            <span class="delivery">${getDeliveryIcon(course.delivery)} ${course.delivery}</span>
            <span class="duration">⏱️ ${course.duration}</span>
        </div>
        <div class="modal-category">
            ${getCategoryIcon(course.category)} ${course.category}
        </div>
        <div class="modal-type">Type: ${course.type}</div>
        
        <h3>Description</h3>
        <p>${course.description || 'No detailed description available.'}</p>
        
        ${course.tags && course.tags.length > 0 ? `
            <h3>Tags</h3>
            <div class="tags">
                ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        
        <div class="modal-actions">
            <button class="bookmark-btn-large ${bookmarkedCourses.has(course.id) ? 'bookmarked' : ''}" 
                    data-id="${course.id}">
                ${bookmarkedCourses.has(course.id) ? '✓ Bookmarked' : '+ Bookmark This Course'}
            </button>
            <button class="share-btn" data-course="${course.name}">Share Course</button>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Add bookmark functionality
    const bookmarkBtn = content.querySelector('.bookmark-btn-large');
    bookmarkBtn.addEventListener('click', function() {
        const courseId = parseInt(this.dataset.id);
        if (bookmarkedCourses.has(courseId)) {
            bookmarkedCourses.delete(courseId);
            this.classList.remove('bookmarked');
            this.textContent = '+ Bookmark This Course';
        } else {
            bookmarkedCourses.add(courseId);
            this.classList.add('bookmarked');
            this.textContent = '✓ Bookmarked';
        }
        saveBookmarks();
        displayCourses(); // Refresh the grid
    });
    
    // Add share functionality
    const shareBtn = content.querySelector('.share-btn');
    shareBtn.addEventListener('click', function() {
        const courseName = this.dataset.course;
        if (navigator.share) {
            navigator.share({
                title: 'Red Cross Training Course',
                text: `Check out this course: ${courseName}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const text = `Check out this Red Cross training course: ${courseName}`;
            navigator.clipboard.writeText(text);
            this.textContent = '✓ Copied!';
            setTimeout(() => this.textContent = 'Share Course', 2000);
        }
    });
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (!searchTerm) {
        filteredCourses = [...allCourses];
    } else {
        filteredCourses = allCourses.filter(course => {
            return course.name.toLowerCase().includes(searchTerm) ||
                   course.description.toLowerCase().includes(searchTerm) ||
                   course.category.toLowerCase().includes(searchTerm) ||
                   course.type.toLowerCase().includes(searchTerm) ||
                   (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        });
    }
    
    applyFilters();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Get selected filters
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(cb => cb.value);
    const selectedLevels = Array.from(document.querySelectorAll('#level-filters input:checked')).map(cb => cb.value);
    const selectedDelivery = Array.from(document.querySelectorAll('#delivery-filters input:checked')).map(cb => cb.value);
    const selectedDurations = Array.from(document.querySelectorAll('#duration-filters input:checked')).map(cb => parseInt(cb.value));
    
    // Start with search results or all courses
    let results = searchTerm ? 
        allCourses.filter(course => {
            return course.name.toLowerCase().includes(searchTerm) ||
                   course.description.toLowerCase().includes(searchTerm) ||
                   course.category.toLowerCase().includes(searchTerm) ||
                   course.type.toLowerCase().includes(searchTerm) ||
                   (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        }) : [...allCourses];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
        results = results.filter(course => selectedCategories.includes(course.category));
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
        results = results.filter(course => selectedLevels.includes(course.level));
    }
    
    // Apply delivery filter
    if (selectedDelivery.length > 0) {
        results = results.filter(course => selectedDelivery.includes(course.delivery));
    }
    
    // Apply duration filter
    if (selectedDurations.length > 0) {
        results = results.filter(course => {
            const hours = parseInt(course.duration) || 999;
            return selectedDurations.some(maxHours => {
                if (maxHours === 16) return hours > 8;
                return hours <= maxHours;
            });
        });
    }
    
    filteredCourses = results;
    displayCourses();
}

// Sort courses
function sortCourses() {
    const sortBy = document.getElementById('sort-select').value;
    
    switch(sortBy) {
        case 'name':
            filteredCourses.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'level':
            const levelOrder = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3};
            filteredCourses.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
            break;
        case 'duration':
            filteredCourses.sort((a, b) => {
                const aDur = parseInt(a.duration) || 999;
                const bDur = parseInt(b.duration) || 999;
                return aDur - bDur;
            });
            break;
        case 'category':
            filteredCourses.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    displayCourses();
}

// Quick filters
function applyQuickFilter(filter) {
    // Clear all filters first
    document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
    
    switch(filter) {
        case 'beginner':
            document.querySelector('#level-filters input[value="Beginner"]').checked = true;
            break;
        case 'virtual':
            document.querySelector('#delivery-filters input[value="Virtual"]').checked = true;
            break;
        case 'accessibility':
            document.querySelector('#category-filters input[value="Accessibility"]').checked = true;
            break;
        case 'disaster':
            const disasterCheckbox = document.querySelector('#category-filters input[value="Disaster Services"]');
            if (disasterCheckbox) disasterCheckbox.checked = true;
            break;
        case 'under-4h':
            document.querySelector('#duration-filters input[value="4"]').checked = true;
            break;
    }
    
    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
    document.getElementById('search-input').value = '';
    filteredCourses = [...allCourses];
    displayCourses();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load courses
    loadCourses();
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', performSearch);
    document.getElementById('search-btn').addEventListener('click', performSearch);
    
    // Sort functionality
    document.getElementById('sort-select').addEventListener('change', sortCourses);
    
    // Quick filters
    document.querySelectorAll('.quick-filter').forEach(btn => {
        btn.addEventListener('click', () => applyQuickFilter(btn.dataset.filter));
    });
    
    // Clear filters
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);
    
    // Learning paths modal
    document.getElementById('learning-paths-btn').addEventListener('click', () => {
        document.getElementById('learning-paths-modal').style.display = 'block';
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Enter key for search
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// Fallback for GitHub Pages - embed data if fetch fails
function loadEmbeddedData() {
    // This will be replaced with actual data
    allCourses = window.coursesData || [];
    filteredCourses = [...allCourses];
    document.getElementById('total-courses').textContent = allCourses.length;
    initializeFilters();
    displayCourses();
    loadBookmarks();
}