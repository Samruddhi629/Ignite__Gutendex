const state = {
  currentPage: 'category',     // 'category' or 'books'
  selectedCategory: '',
  searchQuery: '',
  nextPageUrl: null,
  isLoading: false,
  isLoadingMore: false,
  books: []
};


const API_BASE_URL = 'http://skunkworks.ignitesol.com:8000/books';


function buildApiUrl(url = null) {
  
  if (url) return url;

  
  const params = new URLSearchParams();
  
  
  if (state.selectedCategory) {
    params.append('topic', state.selectedCategory);
  }
  
  
  if (state.searchQuery) {
    params.append('search', state.searchQuery);
  }
  
  params.append('mime_type', 'image');
  
  return `${API_BASE_URL}?${params.toString()}`;
}


function showPage(pageName) {
  
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  
  if (pageName === 'category') {
    document.getElementById('categoryPage').classList.add('active');
    state.currentPage = 'category';
  } else if (pageName === 'books') {
    document.getElementById('booksPage').classList.add('active');
    state.currentPage = 'books';
  }
}


function selectCategory(category) {
  state.selectedCategory = category;
  state.searchQuery = '';
  state.nextPageUrl = null;
  state.books = [];
  
  document.getElementById('pageTitle').textContent = 
    category.charAt(0).toUpperCase() + category.slice(1);
  
  
  document.getElementById('searchInput').value = '';
  
  
  showPage('books');
  
  
  loadBooks();
}


function goBackToCategories() {
  showPage('category');
  
  
  state.selectedCategory = '';
  state.searchQuery = '';
  state.nextPageUrl = null;
  state.books = [];
  
  
  document.getElementById('booksGrid').innerHTML = '';
  hideAllMessages();
}


async function loadBooks(isLoadMore = false) {
  
  if (isLoadMore) {
    if (state.isLoadingMore) return;
    state.isLoadingMore = true;
  } else {
    if (state.isLoading) return;
    state.isLoading = true;
  }

  
  if (isLoadMore) {
    showLoadMoreSpinner();
  } else {
    showLoadingSpinner();
  }

  try {
    const url = isLoadMore ? state.nextPageUrl : buildApiUrl();
    
    console.log('📚 Fetching books from:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Fetched ${data.results.length} books`);
    
    
    const booksWithCovers = data.results.filter(book => 
      book.formats && book.formats['image/jpeg']
    );
    
    console.log(`📸 ${booksWithCovers.length} books have covers`);
    
    
    state.nextPageUrl = data.next;
    
    if (isLoadMore) {
      
      state.books = [...state.books, ...booksWithCovers];
    } else {
      
      state.books = booksWithCovers;
    }
    
    
    displayBooks(booksWithCovers, isLoadMore);
    
    
    if (state.books.length === 0) {
      showNoResults();
    } else {
      hideNoResults();
      
      
      if (!state.nextPageUrl) {
        showEndMessage();
      }
    }

  } catch (error) {
    console.error('❌ Error loading books:', error);
    showError('Failed to load books. Please check your connection and try again.');
  } finally {
    hideLoadingSpinner();
    hideLoadMoreSpinner();
    state.isLoading = false;
    state.isLoadingMore = false;
  }
}


function displayBooks(books, append = false) {
  const grid = document.getElementById('booksGrid');
  
  if (!append) {
    grid.innerHTML = ''; 
  }
  
  books.forEach((book, index) => {
    const card = createBookCard(book, index);
    grid.appendChild(card);
  });
}


function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.style.animationDelay = `${(index % 20) * 30}ms`;
  
  const coverUrl = book.formats['image/jpeg'];
  const title = book.title || 'Unknown Title';
  const author = book.authors?.[0]?.name || 'Unknown Author';
  
  
  card.innerHTML = `
    <img 
      src="${coverUrl}" 
      alt="${escapeHtml(title)}"
      class="book-cover"
      loading="lazy"
      onerror="this.style.background='linear-gradient(135deg, #252E8A 0%, #9A4D87 100%)'"
    />
    <div class="book-info">
      <h3 class="book-title">${escapeHtml(title)}</h3>
      <p class="book-author">${escapeHtml(author)}</p>
    </div>
  `;
  
  
  card.addEventListener('click', () => openBook(book.formats));
  
  return card;
}


function openBook(formats) {
  let bookUrl = null;
  
  
  if (formats['text/html']) {
    bookUrl = formats['text/html'];
  }
  
  else if (formats['application/pdf']) {
    bookUrl = formats['application/pdf'];
  }
  
  else if (formats['text/plain']) {
    bookUrl = formats['text/plain'];
  }
  
  
  if (bookUrl) {
    console.log('📖 Opening book:', bookUrl);
    window.open(bookUrl, '_blank', 'noopener,noreferrer');
  } else {
    alert('No viewable version available');
  }
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


let searchTimeout;


document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    
    
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value.trim());
    }, 500);
  });
  
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchTimeout);
      performSearch(e.target.value.trim());
    }
  });
});


function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  clearTimeout(searchTimeout);
  performSearch(searchInput.value.trim());
}


function performSearch(query) {
  state.searchQuery = query;
  state.nextPageUrl = null;
  state.books = [];
  
  console.log(`🔍 Searching: category="${state.selectedCategory}", query="${query}"`);
  
  loadBooks();
}


function isNearBottom() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottomThreshold = document.documentElement.scrollHeight - 500;
  return scrollPosition >= bottomThreshold;
}


let scrollTimeout;
window.addEventListener('scroll', () => {
  
  if (state.currentPage !== 'books') return;
  
  
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    
    if (isNearBottom() && state.nextPageUrl && !state.isLoadingMore && state.books.length > 0) {
      console.log('📜 Loading more books (infinite scroll)...');
      loadBooks(true);
    }
  }, 100);
});

 

function showLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'block';
  hideAllMessages();
}

function hideLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
}

function showLoadMoreSpinner() {
  document.getElementById('loadMoreSpinner').style.display = 'block';
  document.getElementById('endMessage').style.display = 'none';
}

function hideLoadMoreSpinner() {
  document.getElementById('loadMoreSpinner').style.display = 'none';
}

function showNoResults() {
  document.getElementById('noResults').style.display = 'block';
  hideLoadingSpinner();
  hideLoadMoreSpinner();
}

function hideNoResults() {
  document.getElementById('noResults').style.display = 'none';
}

function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  
  errorText.textContent = message;
  errorEl.style.display = 'block';
  
  hideLoadingSpinner();
  hideLoadMoreSpinner();
}

function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

function showEndMessage() {
  if (state.books.length > 0) {
    document.getElementById('endMessage').style.display = 'block';
  }
}

function hideAllMessages() {
  hideNoResults();
  hideError();
  document.getElementById('endMessage').style.display = 'none';
}


function retryLoad() {
  hideError();
  loadBooks();
}


console.log('🚀 Gutendex Library initialized!');
console.log('📋 Instructions:');
console.log('  1. Select a category on Page 1');
console.log('  2. Browse books on Page 2');
console.log('  3. Use search to filter books');
console.log('  4. Scroll down for infinite loading');
console.log('  5. Click books to open in browser');
