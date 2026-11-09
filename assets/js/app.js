
// Dynamic On-Demand Script Loader for Performance
const _loadedScripts = {};
function ensureScript(name) {
  if (name === 'PDFLib' && typeof PDFLib !== 'undefined') return Promise.resolve(true);
  if (name === 'pdfjsLib' && typeof pdfjsLib !== 'undefined') return Promise.resolve(true);
  if (name === 'QRCode' && typeof QRCode !== 'undefined') return Promise.resolve(true);
  if (name === 'jsQR' && typeof jsQR !== 'undefined') return Promise.resolve(true);
  if (name === 'confetti' && typeof confetti === 'function') return Promise.resolve(true);
  if (name === 'JSZip' && typeof JSZip !== 'undefined') return Promise.resolve(true);

  if (_loadedScripts[name]) return _loadedScripts[name];

  const scriptMap = {
    PDFLib: '/assets/vendor/pdf-lib.min.js',
    pdfjsLib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    QRCode: '/assets/vendor/qrcode.min.js',
    jsQR: '/assets/vendor/jsqr.min.js',
    confetti: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    JSZip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
  };

  const url = scriptMap[name];
  if (!url) return Promise.resolve(false);

  _loadedScripts[name] = new Promise((resolve) => {
    const existing = document.querySelector('script[src="' + url + '"]');
    if (existing) {
      if (window[name]) return resolve(true);
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    script.onload = () => {
      if (name === 'pdfjsLib' && typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return _loadedScripts[name];
}


    // Local Storage Bookmarks Persistence
    let favorites = JSON.parse(localStorage.getItem('th_favorites') || '[]');

    // Initialize Theme & Bookmarks on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('themeIcon').className = 'fa-solid fa-sun text-amber-400 text-base sm:text-lg';
      }
      updateFavoriteUI();
      checkHashRoute();
    });
    window.addEventListener('hashchange', checkHashRoute);

    
    // Mobile Navigation Drawer Toggle
    
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const backdrop = document.getElementById('mobileDrawerBackdrop');
      if (menu && backdrop) {
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
          menu.classList.remove('hidden');
          backdrop.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        } else {
          closeMobileMenu();
        }
      }
    }

    function closeMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const backdrop = document.getElementById('mobileDrawerBackdrop');
      if (menu) menu.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function focusHeroSearch() {
      const homeView = document.getElementById('homeView');
      if (homeView && homeView.classList.contains('hidden')) {
        navigateToHome();
      }
      const heroSearch = document.getElementById('heroSearchInput');
      if (heroSearch) {
        heroSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => heroSearch.focus(), 200);
      }
    }

    function scrollToTools() {
      const grid = document.getElementById('tools-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }


    // Quick Search Suggestion
    function setSearchSuggestion(keyword) {
      const input = document.getElementById('heroSearchInput');
      if (input) {
        input.value = keyword;
        filterToolsByQuery(keyword);
        input.focus();
      }
    }

    // Hero Search Real-time Filter
    function filterToolsByQuery(query) {
      query = (query || '').toLowerCase().trim();
      const clearBtn = document.getElementById('heroClearBtn');
      const countBadge = document.getElementById('searchResultCount');
      const noResults = document.getElementById('noResultsMessage');
      const noResultsQuery = document.getElementById('noResultsQuery');
      if (clearBtn) clearBtn.classList.toggle('hidden', query.length === 0);

      // Synchronize with header search if present
      const headerInput = document.getElementById('headerSearchInput');
      if (headerInput && headerInput.value !== query) headerInput.value = query;

      let count = 0;
      document.querySelectorAll('#tools-grid .tool-card').forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        if (title.includes(query) || text.includes(query)) {
          card.classList.remove('hidden');
          count++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countBadge) {
        if (query.length > 0) {
          countBadge.innerText = `${count} tools`;
          countBadge.classList.remove('hidden');
        } else {
          countBadge.classList.add('hidden');
        }
      }

      // Toggle No Results Message
      if (noResults) {
        if (count === 0 && query.length > 0) {
          if (noResultsQuery) noResultsQuery.textContent = query;
          noResults.classList.remove('hidden');
        } else {
          noResults.classList.add('hidden');
        }
      }

      // Hide popular section when searching
      const popular = document.getElementById('popularSection');
      if (popular) popular.classList.toggle('hidden', query.length > 0);
    }

    function clearHeroSearch() {
      const input = document.getElementById('heroSearchInput');
      if (input) {
        input.value = '';
        filterToolsByQuery('');
        input.focus();
      }
    }

    function handleHeaderSearch(query) {
      const heroInput = document.getElementById('heroSearchInput');
      if (heroInput) {
        heroInput.value = query;
        filterToolsByQuery(query);
      }
    }

    // Category Filter Pills Handler
    function filterCategory(cat) {
      document.querySelectorAll('.cat-pill').forEach(pill => {
        if (pill.dataset.cat === cat) {
          pill.className = 'cat-pill shrink-0 px-3.5 py-1.5 rounded-full bg-[#2563EB] text-white shadow-xs transition-all text-xs font-semibold min-h-[34px] flex items-center justify-center active:scale-95';
        } else {
          pill.className = 'cat-pill shrink-0 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-semibold min-h-[34px] flex items-center justify-center active:scale-95';
        }
      });

      // Clear search input when switching category
      const heroInput = document.getElementById('heroSearchInput');
      if (heroInput && heroInput.value) {
        heroInput.value = '';
        document.getElementById('heroClearBtn')?.classList.add('hidden');
        document.getElementById('searchResultCount')?.classList.add('hidden');
      }
      const noResults = document.getElementById('noResultsMessage');
      if (noResults) noResults.classList.add('hidden');

      // Show/hide popular section
      const popular = document.getElementById('popularSection');
      if (popular) popular.classList.toggle('hidden', cat !== 'all');

      document.querySelectorAll('#tools-grid .tool-card').forEach(card => {
        const cardCat = card.dataset.category;
        if (cat === 'all' || cardCat === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    // Dark Mode Toggle
    function toggleDarkMode() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      document.getElementById('themeIcon').className = isDark
        ? 'fa-solid fa-sun text-amber-400 text-base sm:text-lg'
        : 'fa-solid fa-moon text-base sm:text-lg';
      showToast(isDark ? 'Dark Mode Enabled' : 'Light Mode Enabled', 'info');
    }

    // Keyboard Shortcuts (Cmd+K / Ctrl+K for Search, Escape for Modal)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusHeroSearch();
      }
      if (e.key === 'Escape') {
        closeModal();
        closeMobileMenu();
      }
    });

    // Backward Compatibility aliases
    function filterTools() {
      const hero = document.getElementById('heroSearchInput');
      if (hero) filterToolsByQuery(hero.value);
    }
    function clearSearch() {
      clearHeroSearch();
    }

    // Confetti Celebration Helper
    async function triggerConfetti() {
      if (typeof confetti !== "function") { await ensureScript("confetti"); }

      if (typeof confetti === 'function') {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.75 }
          });
        } catch (e) {}
      }
    }

    // Favorites Pinning Logic
    function toggleFavorite(id, event) {
      if (event) event.stopPropagation();
      if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        showToast('Removed from Bookmarks', 'info');
      } else {
        favorites.push(id);
        showToast('Added to Bookmarks', 'success');
        triggerConfetti();
      }
      localStorage.setItem('th_favorites', JSON.stringify(favorites));
      updateFavoriteUI();
    }

    function updateFavoriteUI() {
      const badge = document.getElementById('favCountBadge');
      if (badge) {
        if (favorites.length > 0) {
          badge.innerText = favorites.length;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      document.querySelectorAll('.tool-card').forEach(card => {
        const id = card.dataset.id;
        const btn = card.querySelector('.fav-btn i');
        if (btn) {
          if (favorites.includes(id)) {
            btn.className = 'fa-solid fa-heart text-base text-rose-500';
          } else {
            btn.className = 'fa-solid fa-heart text-base text-slate-300 dark:text-slate-600';
          }
        }
      });
    }

    // Toast Notification System
    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800 dark:bg-slate-700';
      toast.className = `${bg} text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
      toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i> ${message}`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      }, 10);

      setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    }

    
    // Tool Modal Route Map for Shareable URLs & Dynamic Titles
        const defaultPageTitle = "ToolsHere.online — Free Online Tools & Web Utilities | 100% Private";
    const defaultPageDesc = "Free, fast, and 100% private client-side web utilities. Compress images, calculate EMI/GST, create QR codes, analyze text, and edit PDFs with zero uploads.";
    const modalRouteMap = {
      'imgResizerModal': {
        hash: 'image-compressor',
        title: 'Free Image Compressor & Resizer Online | Compress to 20KB, 50KB, 100KB — ToolsHere.online',
        metaDesc: 'Compress and resize images online to custom dimensions or exact file sizes (20KB, 50KB, 100KB). Fast, client-side, and 100% private with no server uploads.',
        h1: 'Free Online Image Compressor & Photo Resizer',
        toolId: 'imgResizer'
      },
      'bgRemoverModal': {
        hash: 'background-remover',
        title: 'Free Background Remover Online | Create Transparent PNG Photos — ToolsHere.online',
        metaDesc: 'Remove image backgrounds instantly in your browser. Fine-tune color tolerance, isolate subjects, and download transparent PNGs with 100% privacy.',
        h1: 'Free Client-Side Background Remover & Transparent PNG Maker',
        toolId: 'bgRemover'
      },
      'pdfWordModal': {
        hash: 'pdf-to-word',
        title: 'Free PDF to Word Converter Online | Convert PDF to Editable DOC — ToolsHere.online',
        metaDesc: 'Convert PDF documents to editable Word (.doc) files right in your browser. Fast, free, confidential, and requires no email sign-up or software install.',
        h1: 'Free Online PDF to Word Converter (Client-Side)',
        toolId: 'pdfWord'
      },
      'pdfMergeModal': {
        hash: 'merge-pdf',
        title: 'Free PDF Merger Online | Combine Multiple PDF Files Together — ToolsHere.online',
        metaDesc: 'Merge multiple PDF files into one single document online. Safe, instant client-side PDF joining with zero server uploads and no file restrictions.',
        h1: 'Free Online PDF Merger & Document Combiner',
        toolId: 'pdfMerge'
      },
      'ageCalcModal': {
        hash: 'age-calculator',
        title: 'Accurate Age & Date Calculator Online | Calculate Exact Age in Days — ToolsHere.online',
        metaDesc: 'Calculate your exact age in years, months, days, and total days lived. Fast, precise, and handles leap years and calendar variations accurately.',
        h1: 'Free Online Age & Date of Birth Calculator',
        toolId: 'ageCalc'
      },
      'ytThumbModal': {
        hash: 'youtube-thumbnail',
        title: 'Free YouTube Thumbnail Downloader | Download 1080p HD Thumbnails — ToolsHere.online',
        metaDesc: 'Download high-resolution YouTube video thumbnails in 1080p Maxresdefault HD quality. Just paste any YouTube URL and download or copy image link instantly.',
        h1: 'Free YouTube Thumbnail Downloader & Image Grabber',
        toolId: 'ytThumb'
      },
      'qrModal': {
        hash: 'qr-code-generator',
        title: 'Free QR Code Generator & Scanner Online | Create & Read QR Codes — ToolsHere.online',
        metaDesc: 'Generate custom QR codes for websites, Wi-Fi, vCards, and WhatsApp, or scan QR codes from photos and live camera in real time. 100% private in-browser QR studio.',
        h1: 'Free Online QR Code Generator & Scanner Studio',
        toolId: 'qrTool'
      },
      'passwordModal': {
        hash: 'password-generator',
        title: 'Free Strong Password Generator | Cryptographically Secure Passwords — ToolsHere.online',
        metaDesc: 'Generate cryptographically secure, random passwords with custom lengths, symbols, and numbers using the Web Crypto API. Fast, private, and unhackable.',
        h1: 'Free Cryptographically Secure Password Generator',
        toolId: 'passwordGen'
      },
      'wordCountModal': {
        hash: 'word-counter',
        title: 'Free Word & Character Counter Online | Accurate Text Length Counter — ToolsHere.online',
        metaDesc: 'Count words, characters (with & without spaces), sentences, paragraphs, and reading time live. 100% private in-browser text analyzer for essays, posts, and SEO.',
        h1: 'Free Online Word Counter & Character Analyzer',
        toolId: 'wordCount'
      },
      'gstEmiModal': {
        hash: 'emi-calculator',
        title: 'Free GST & Loan EMI Calculator Online | Accurate Financial Calculator — ToolsHere.online',
        metaDesc: 'Calculate monthly loan EMIs and GST amounts (5%, 12%, 18%, 28%) instantly. Accurate financial calculations for home, car, personal loans, and business bills.',
        h1: 'Free Online GST & Loan EMI Financial Calculator',
        toolId: 'gstEmi'
      },
      'imgFormatModal': {
        hash: 'image-converter',
        title: 'Free Image Format Converter Online | Convert PNG, JPG, WebP — ToolsHere.online',
        metaDesc: 'Convert image formats online between PNG, JPG, and WebP instantly in your browser. Fast, 100% private, free, and preserves original image resolution.',
        h1: 'Free Online Image Format Converter (PNG, JPG, WebP)',
        toolId: 'imgFormat'
      },
      'textCaseModal': {
        hash: 'text-case-converter',
        title: 'Free Text Case Converter Online | UPPERCASE, lowercase, Title Case, Slug — ToolsHere.online',
        metaDesc: 'Convert text case online instantly. Switch between UPPERCASE, lowercase, Title Case, and URL slugs with one click. Free, private, and instant copy.',
        h1: 'Free Online Text Case Converter & URL Slug Generator',
        toolId: 'textCase'
      },
      'jsonFormatModal': {
        hash: 'json-formatter',
        title: 'Free JSON Formatter & Validator Online | Beautify and Minify JSON — ToolsHere.online',
        metaDesc: 'Format, beautify, validate, and minify JSON data online. Catch syntax errors with clear line indicators. 100% client-side for secure API debugging.',
        h1: 'Free Online JSON Formatter, Beautifier & Validator',
        toolId: 'jsonFormat'
      },
      'seoMetaModal': {
        hash: 'seo-meta-generator',
        title: 'Free SEO Meta Tag Generator Online | Create Google & OpenGraph Tags — ToolsHere.online',
        metaDesc: 'Generate SEO meta tags for your website. Create Google titles, meta descriptions, robots, and OpenGraph preview tags with one click. Free and instant.',
        h1: 'Free Online SEO Meta Tag & OpenGraph Generator',
        toolId: 'seoMeta'
      },
      'compressPdfModal': {
        hash: 'compress-pdf',
        title: 'Free PDF Compressor Online | Reduce PDF File Size Privately — ToolsHere.online',
        metaDesc: 'Compress PDF files online without losing readability. Reduce document size for email attachments and portal uploads. 100% private client-side tool.',
        h1: 'Free Online PDF Compressor & File Size Reducer',
        toolId: 'compressPdf'
      },
      'imgToPdfModal': {
        hash: 'image-to-pdf',
        title: 'Free Image to PDF Converter Online | Convert JPG and PNG to PDF — ToolsHere.online',
        metaDesc: 'Convert and merge multiple JPG, PNG, and WebP photos into a single PDF document online. Fast, free, confidential, and ideal for printing or official uploads.',
        h1: 'Free Online Image to PDF Converter & Photo Bundler',
        toolId: 'imgToPdf'
      },
      'aboutModal': { hash: 'about', title: 'About Us — ToolsHere.online', metaDesc: 'Learn about ToolsHere.online, our mission for 100% private client-side browser utilities, and our engineering standards.' },
      'contactModal': { hash: 'contact', title: 'Contact Us — ToolsHere.online', metaDesc: 'Contact the ToolsHere.online team for support, feature suggestions, or business inquiries.' },
      'privacyModal': { hash: 'privacy', title: 'Privacy Policy — ToolsHere.online', metaDesc: 'ToolsHere.online Privacy Policy: Learn how all our utilities execute locally on your device with zero server storage.' },
      'termsModal': { hash: 'terms', title: 'Terms of Service — ToolsHere.online', metaDesc: 'Terms of service and usage guidelines for ToolsHere.online free browser utilities.' },
      'disclaimerModal': { hash: 'disclaimer', title: 'Disclaimer — ToolsHere.online', metaDesc: 'Legal and technical disclaimer for calculations and tools provided on ToolsHere.online.' }
    };

    // Full-Page Dedicated Tool Router & Navigation System
    function openToolPage(routeKey, event) {
      if (typeof stopQrCamera === 'function') stopQrCamera();
      if (["pdfMergeModal", "compressPdfModal", "imgToPdfModal", "pdf-merge", "compress-pdf", "image-to-pdf"].some(x => String(routeKey).includes(x))) { ensureScript("PDFLib"); }
      if (String(routeKey).includes("pdfWord") || String(routeKey).includes("pdf-to-word")) { ensureScript("pdfjsLib"); }
      if (String(routeKey).includes("qr")) { ensureScript("QRCode"); }

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Lookup route in modalRouteMap
      let route = null;
      let modalType = null;
      for (const [key, config] of Object.entries(modalRouteMap)) {
        if (config.hash.toLowerCase() === routeKey.toLowerCase() || key === routeKey) {
          route = config;
          modalType = key;
          break;
        }
      }
      if (!route) return;

      // 1. Hide Home View, Show Dedicated Tool View
      const homeView = document.getElementById('homeView');
      const toolView = document.getElementById('toolView');
      if (homeView) homeView.classList.add('hidden');
      if (toolView) toolView.classList.remove('hidden');

      // 2. Set Breadcrumb and Tool Page Header
      const categoryName = (route.toolId && typeof SEO_TOOL_REGISTRY !== 'undefined' && SEO_TOOL_REGISTRY.find(t => t.id === route.toolId)?.category) || 'Web Utility';
      const catCrumb = document.getElementById('toolCategoryBreadcrumb');
      if (catCrumb) catCrumb.innerText = categoryName;

      const titleCrumb = document.getElementById('toolTitleBreadcrumb');
      if (titleCrumb) titleCrumb.innerText = route.h1 || route.title;

      const pageH1 = document.getElementById('toolPageH1');
      if (pageH1) pageH1.innerText = route.h1 || route.title;

      const pageDesc = document.getElementById('toolPageDesc');
      if (pageDesc) pageDesc.innerText = route.metaDesc || '';

      // 3. Clear and Render Tool Workspace (skip if already pre-rendered on dedicated page)
      const workspace = document.getElementById('toolWorkspace');
      const isDedicatedPage = window.location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').toLowerCase() === route.hash.toLowerCase();
      if (workspace && (!isDedicatedPage || workspace.children.length === 0)) {
        if (typeof cleanupResizerBlob === 'function') cleanupResizerBlob();
        workspace.innerHTML = '';
        const titleHolder = { innerText: '' };
        const iconHolder = { className: '' };

        if (modalType === 'imgResizerModal') renderImageResizer(titleHolder, iconHolder, workspace);
        else if (modalType === 'bgRemoverModal') renderBgRemover(titleHolder, iconHolder, workspace);
        else if (modalType === 'pdfWordModal') renderPdfWord(titleHolder, iconHolder, workspace);
        else if (modalType === 'pdfMergeModal') renderPdfMerge(titleHolder, iconHolder, workspace);
        else if (modalType === 'ageCalcModal') renderAgeCalc(titleHolder, iconHolder, workspace);
        else if (modalType === 'ytThumbModal') renderYtThumb(titleHolder, iconHolder, workspace);
        else if (modalType === 'qrModal') renderQrTool(titleHolder, iconHolder, workspace);
        else if (modalType === 'passwordModal') renderPasswordTool(titleHolder, iconHolder, workspace);
        else if (modalType === 'wordCountModal') renderWordCounter(titleHolder, iconHolder, workspace);
        else if (modalType === 'gstEmiModal') renderGstEmi(titleHolder, iconHolder, workspace);
        else if (modalType === 'imgFormatModal') renderImgFormat(titleHolder, iconHolder, workspace);
        else if (modalType === 'textCaseModal') renderTextCase(titleHolder, iconHolder, workspace);
        else if (modalType === 'jsonFormatModal') renderJsonFormat(titleHolder, iconHolder, workspace);
        else if (modalType === 'seoMetaModal') renderSeoMeta(titleHolder, iconHolder, workspace);
        else if (modalType === 'compressPdfModal') renderCompressPdf(titleHolder, iconHolder, workspace);
        else if (modalType === 'imgToPdfModal') renderImgToPdf(titleHolder, iconHolder, workspace);
        else if (modalType === 'aboutModal') renderAboutModal(titleHolder, iconHolder, workspace);
        else if (modalType === 'contactModal') renderContactModal(titleHolder, iconHolder, workspace);
        else if (modalType === 'privacyModal') renderPrivacyModal(titleHolder, iconHolder, workspace);
        else if (modalType === 'termsModal') renderTermsModal(titleHolder, iconHolder, workspace);
        else if (modalType === 'disclaimerModal') renderDisclaimerModal(titleHolder, iconHolder, workspace);

        const pageIcon = document.getElementById('toolPageIcon');
        if (pageIcon && iconHolder.className) pageIcon.className = iconHolder.className;

        // Append in-depth SEO guide and FAQ documentation
        if (route.toolId && typeof renderToolSeoDocumentation === 'function') {
          renderToolSeoDocumentation(route.toolId, workspace);
        }
      }

      // 4. Update Browser URL (HTML5 History API)
      const targetHash = '#' + route.hash;
      if (window.location.hash !== targetHash) {
        history.pushState({ tool: route.hash }, '', targetHash);
      }

      // 5. Update SEO Metadata & Canonical URL
      document.title = route.title;
      const metaDescEl = document.querySelector('meta[name="description"]');
      if (metaDescEl && route.metaDesc) metaDescEl.setAttribute('content', route.metaDesc);

      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute('content', route.title);

      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl && route.metaDesc) ogDescEl.setAttribute('content', route.metaDesc);

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.setAttribute('href', 'https://toolshere.online/' + route.hash);

      // 6. Smooth Scroll to Top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigateToHome(event) {
      if (typeof stopQrCamera === 'function') stopQrCamera();
      if (typeof cleanupResizerBlob === 'function') cleanupResizerBlob();
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const homeView = document.getElementById('homeView');
      const toolView = document.getElementById('toolView');
      if (homeView) homeView.classList.remove('hidden');
      if (toolView) toolView.classList.add('hidden');

      if (window.location.hash) {
        history.pushState({ home: true }, '', window.location.pathname);
      }

      document.title = defaultPageTitle;
      const metaDescEl = document.querySelector('meta[name="description"]');
      if (metaDescEl) metaDescEl.setAttribute('content', defaultPageDesc);

      const ogTitleEl = document.querySelector('meta[property="og:title"]');
      if (ogTitleEl) ogTitleEl.setAttribute('content', "ToolsHere.online — Free Online Tools for Everything");

      const ogDescEl = document.querySelector('meta[property="og:description"]');
      if (ogDescEl) ogDescEl.setAttribute('content', defaultPageDesc);

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.setAttribute('href', 'https://toolshere.online/');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Backward-compatibility wrapper for any legacy modal calls
    function openModal(modalType) {
      openToolPage(modalType);
    }
    function closeModal() {
      navigateToHome();
    }
    function handleOverlayClick() {
      navigateToHome();
    }

    // Check Initial Route on load (handles /image-compressor, #image-compressor, etc.)
    function checkHashRoute() {
      const p = window.location.pathname.toLowerCase();
      if (p.includes("merge") || p.includes("compress-pdf") || p.includes("image-to-pdf")) { ensureScript("PDFLib"); }
      if (p.includes("pdf-to-word")) { ensureScript("pdfjsLib"); }
      if (p.includes("qr")) { ensureScript("QRCode"); }

      const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').toLowerCase();
      const cleanHash = window.location.hash.replace(/^#/, '').toLowerCase();
      const target = cleanPath || cleanHash;

      if (target && target !== 'index') {
        for (const [key, config] of Object.entries(modalRouteMap)) {
          if (config.hash.toLowerCase() === target || key.toLowerCase() === target) {
            openToolPage(config.hash);
            return;
          }
        }
      }
    }

    // Handle Browser Back / Forward Buttons
    window.addEventListener('popstate', (e) => {
      if (typeof stopQrCamera === 'function') stopQrCamera();
      const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').toLowerCase();
      const cleanHash = window.location.hash.replace(/^#/, '').toLowerCase();
      const target = cleanPath || cleanHash;

      if (target && target !== 'index') {
        for (const [key, config] of Object.entries(modalRouteMap)) {
          if (config.hash.toLowerCase() === target) {
            openToolPage(config.hash);
            return;
          }
        }
      }
      navigateToHome();
    });

    // Copy Helper Function
    function copyText(text) {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copied to clipboard!', 'success');
          triggerConfetti();
        }).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
        triggerConfetti();
      } catch (err) {
        showToast('Failed to copy', 'error');
      }
      document.body.removeChild(textArea);
    }

    
    /* ================= VERIFIED TOOL SEO DOCUMENTATION REGISTRY ================= */
    const SEO_TOOL_REGISTRY = [
  {
    "id": "imgResizer",
    "hash": "#image-compressor",
    "url": "https://toolshere.online/image-compressor",
    "name": "Image Compressor & Resizer",
    "category": "Image",
    "cardDesc": "Compress JPEG, PNG, and WebP images to custom dimensions or target file sizes like 20KB, 50KB, and 100KB directly in your browser with zero server uploads.",
    "seoTitle": "Free Image Compressor & Resizer Online | Compress to 20KB, 50KB, 100KB",
    "metaDesc": "Compress and resize images online to custom dimensions or exact file sizes (20KB, 50KB, 100KB). Fast, client-side, and 100% private with no server uploads.",
    "h1": "Free Online Image Compressor & Photo Resizer",
    "intro": "ToolsHere Image Compressor & Resizer is a client-side utility built for students, job applicants, web developers, and designers who need quick, precise image optimization. Whether you must meet strict government portal upload limits—such as 20KB, 50KB, or 100KB requirements for exams, passports, and job applications—or reduce image payload sizes for faster web performance, this tool gives you complete manual and preset control. You can adjust exact pixel dimensions, dial in quality percentages from 10% to 100%, and inspect instant side-by-side file size feedback. Everything processes entirely within your device's browser memory using HTML5 Canvas, ensuring your personal photos never leave your computer or phone.",
    "howToUse": [
      "Click or drag your image file (PNG, JPG, WebP, or GIF) into the upload dropzone.",
      "Choose a quick preset button (20KB, 50KB, 100KB, 200KB) or drag the compression slider to set your custom quality level.",
      "Optionally select your preferred output format (Auto, JPG, WebP, or PNG) and adjust pixel dimensions.",
      "Review the live compressed file size and visual preview on the screen.",
      "Click 'Download Compressed Image' to save your optimized file instantly."
    ],
    "features": [
      "One-click target file size presets: 20 KB, 50 KB, 100 KB, and 200 KB for exam and job portals.",
      "Multi-format output support: Auto (matches original), JPEG, WebP, and PNG.",
      "Full alpha transparency preservation for WebP and PNG, plus clean solid background fill for JPEG.",
      "Granular compression quality slider ranging from 10% to 100% for lossy formats.",
      "Custom pixel dimension controls with aspect ratio lock to resize on the fly.",
      "Real-time dual file size counter displaying original size versus compressed output size.",
      "100% private client-side processing using canvas.toBlob() with zero server uploads."
    ],
    "formatsAndLimits": {
      "supportedInputs": "PNG, JPG/JPEG, WebP, GIF, BMP",
      "outputFormat": "Auto (matches original), JPEG, WebP, or PNG",
      "limitations": "PNG format uses lossless compression (dimensions control size); WebP & JPEG support lossy quality adjustment. 100% private in-browser memory processing."
    },
    "faqs": [
      {
        "q": "How does the target size preset (20KB, 50KB, 100KB) work?",
        "a": "The tool automatically calibrates the image compression ratio and resolution algorithms in browser memory to aim for your selected target threshold, making it easy to comply with government form restrictions."
      },
      {
        "q": "Are my photos uploaded to any external server?",
        "a": "No. The entire compression and resizing pipeline runs inside your browser via the HTML5 Canvas API using canvas.toBlob(). Your pictures never leave your local device."
      },
      {
        "q": "What output formats can I export my compressed image to?",
        "a": "You can select your preferred output format: Auto (matches your original format), JPEG (.jpg), WebP (.webp), or PNG (.png). WebP and PNG fully preserve transparent backgrounds, while JPEG offers white (default) or black solid background fill options for maximum compatibility."
      },
      {
        "q": "Can I resize the width and height without losing quality?",
        "a": "Yes. You can enter specific pixel values into the width and height input fields. Downscaling dimensions also dramatically reduces the final file weight."
      },
      {
        "q": "Why does changing the quality slider not affect PNG file size?",
        "a": "PNG is a strictly lossless image format, meaning browser compression engines do not support lossy quality reduction for PNG. To reduce PNG file weight, adjust the pixel width and height dimensions, or switch the output format to WebP for high-efficiency lossy compression with transparency."
      }
    ],
    "relatedTools": [
      {
        "name": "Image Format Converter",
        "hash": "#image-converter"
      },
      {
        "name": "AI Background Remover",
        "hash": "#background-remover"
      },
      {
        "name": "Image to PDF Converter",
        "hash": "#image-to-pdf"
      }
    ]
  },
  {
    "id": "bgRemover",
    "hash": "#background-remover",
    "url": "https://toolshere.online/background-remover",
    "name": "AI Background Remover",
    "category": "Image",
    "cardDesc": "Remove solid and uniform photo backgrounds instantly using client-side canvas color isolation, sensitivity thresholds, and export transparent PNG files securely.",
    "seoTitle": "Free Background Remover Online | Create Transparent PNG Photos",
    "metaDesc": "Remove image backgrounds instantly in your browser. Fine-tune color tolerance, isolate subjects, and download transparent PNGs with 100% privacy.",
    "h1": "Free Client-Side Background Remover & Transparent PNG Maker",
    "intro": "The ToolsHere AI Background Remover is a fast, privacy-centric graphic utility designed for e-commerce sellers, graphic artists, and content creators who need clean transparent cutouts without paying for expensive subscription software. Using client-side color-difference algorithms and canvas pixel manipulation, the tool inspects the edge and backdrop tones of your uploaded photo, letting you dial in an interactive sensitivity threshold slider. It isolates the subject cleanly and renders a transparent checkerboard preview instantly. Because the algorithm executes entirely within your browser, sensitive product photos, signatures, and personal portraits remain confidential and never pass through a cloud server.",
    "howToUse": [
      "Select or drag your image file onto the background remover upload zone.",
      "The tool analyzes corner and backdrop reference pixels automatically to isolate the background.",
      "Adjust the 'Sensitivity Threshold' slider (5 to 80) to fine-tune how aggressively similar backdrop shades are erased.",
      "Inspect the live cutout on the transparency checkerboard canvas.",
      "Click 'Download Transparent PNG' to save your cutout with full alpha-channel transparency."
    ],
    "features": [
      "Instant canvas-based color distance isolation algorithm.",
      "Adjustable sensitivity threshold slider (range 5–80) for granular edge control.",
      "Real-time transparency preview with high-contrast checkerboard canvas backdrop.",
      "High-resolution transparent PNG export with full alpha channel preservation.",
      "Completely free with zero limits, watermarks, or user account requirements."
    ],
    "formatsAndLimits": {
      "supportedInputs": "PNG, JPG/JPEG, WebP",
      "outputFormat": "Transparent PNG (.png)",
      "limitations": "Best suited for photos with solid, high-contrast, or uniform studio backdrops; complex busy backgrounds with matching subject colors may require manual fine-tuning."
    },
    "faqs": [
      {
        "q": "What types of photos work best with this background remover?",
        "a": "Photos with solid, plain, or uniform studio backgrounds (such as white, grey, green screen, or studio product shots) yield the crispest results."
      },
      {
        "q": "Does downloading the image add any watermarks?",
        "a": "No. All images downloaded from ToolsHere are 100% free of watermarks, branding, or restrictions."
      },
      {
        "q": "Why did parts of my subject disappear?",
        "a": "If the subject shares very similar colors with the background, lowering the Sensitivity Threshold slider will protect those pixels from being removed."
      }
    ],
    "relatedTools": [
      {
        "name": "Image Compressor & Resizer",
        "hash": "#image-compressor"
      },
      {
        "name": "Image Format Converter",
        "hash": "#image-converter"
      }
    ]
  },
  {
    "id": "pdfWord",
    "hash": "#pdf-to-word",
    "url": "https://toolshere.online/pdf-to-word",
    "name": "PDF to Word Converter",
    "category": "Document",
    "cardDesc": "Convert PDF documents into editable Word (.doc) files quickly inside your browser without uploading proprietary files to external servers.",
    "seoTitle": "Free PDF to Word Converter Online | Convert PDF to Editable DOC",
    "metaDesc": "Convert PDF documents to editable Word (.doc) files right in your browser. Fast, free, confidential, and requires no email sign-up or software install.",
    "h1": "Free Online PDF to Word Converter (Client-Side)",
    "intro": "ToolsHere PDF to Word Converter offers an instant, confidential solution for students, educators, and office workers needing to turn static PDF documents into editable text documents. Rather than sending confidential contracts, resumes, or financial records to unfamiliar remote servers, our tool processes the document container directly in your local session. It parses the document file and outputs a cleanly structured Word-compatible .doc file that opens seamlessly in Microsoft Word, Google Docs, LibreOffice, and WPS Office. It eliminates manual retyping and saves valuable administrative time.",
    "howToUse": [
      "Click the file upload area and select a PDF file from your device.",
      "Click the 'Convert to Word (.doc)' action button.",
      "Wait a moment while the client-side converter structures the document payload.",
      "The generated editable .doc file will automatically download to your computer or mobile downloads folder."
    ],
    "features": [
      "Fast client-side document structuring with zero queue wait times.",
      "Direct export to Microsoft Word compatible .doc format.",
      "100% confidential processing ensuring sensitive documents stay on your machine.",
      "Compatible with desktop and mobile browsers with no plugins needed."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Standard PDF (.pdf)",
      "outputFormat": "Microsoft Word compatible Document (.doc)",
      "limitations": "Best for text-based PDFs; scanned image-only PDFs without embedded text streams may require external OCR software."
    },
    "faqs": [
      {
        "q": "Can I open the downloaded .doc file in Microsoft Word and Google Docs?",
        "a": "Yes. The downloaded .doc format is universally compatible with Microsoft Office Word, Google Docs, Apple Pages, and LibreOffice."
      },
      {
        "q": "Is there a limit on how many PDFs I can convert?",
        "a": "No. You can convert as many PDF files as you need throughout the day without fees or daily caps."
      },
      {
        "q": "Are my confidential files stored anywhere?",
        "a": "Never. The conversion happens in your local browser runtime. Your files are not transmitted to or stored on any server."
      }
    ],
    "relatedTools": [
      {
        "name": "Merge & Split PDF",
        "hash": "#merge-pdf"
      },
      {
        "name": "Compress PDF Document",
        "hash": "#compress-pdf"
      },
      {
        "name": "Image to PDF Converter",
        "hash": "#image-to-pdf"
      }
    ]
  },
  {
    "id": "pdfMerge",
    "hash": "#merge-pdf",
    "url": "https://toolshere.online/merge-pdf",
    "name": "Merge & Split PDF",
    "category": "Document",
    "cardDesc": "Combine multiple PDF documents into a unified file securely in browser memory without file size caps, queue delays, or server-side logging.",
    "seoTitle": "Free PDF Merger Online | Combine Multiple PDF Files Together",
    "metaDesc": "Merge multiple PDF files into one single document online. Safe, instant client-side PDF joining with zero server uploads and no file restrictions.",
    "h1": "Free Online PDF Merger & Document Combiner",
    "intro": "Merging multiple PDF documents is one of the most frequent administrative tasks for legal teams, job seekers compiling portfolios, students submitting coursework, and business professionals organizing invoices. The ToolsHere Merge & Split PDF utility allows you to select two or more PDF files and assemble them seamlessly directly inside browser memory. Unlike traditional web services that upload bulky files to cloud queues where they linger for hours, ToolsHere guarantees immediate file handling, strict local data privacy, and zero waiting periods.",
    "howToUse": [
      "Click the upload area and select two or more PDF files simultaneously from your device.",
      "Verify the selected documents in the file dialog.",
      "Click 'Merge PDFs Instantly' to trigger the client-side combining sequence.",
      "Save your compiled PDF directly onto your storage drive."
    ],
    "features": [
      "Multi-file PDF selection support directly from your system file picker.",
      "Ultra-fast combining sequence executing in local browser memory.",
      "Preserves original document integrity without inserting watermarks or advertisements.",
      "Works smoothly across Windows, macOS, Linux, iOS, and Android."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Multiple PDF documents (.pdf)",
      "outputFormat": "Merged PDF file (.pdf)",
      "limitations": "Requires at least 2 PDF files to initiate merging; password-protected encrypted PDFs must be unlocked prior to selection."
    },
    "faqs": [
      {
        "q": "How many PDF documents can I combine at once?",
        "a": "You can select multiple files at once. Memory availability on your device is the only practical constraint."
      },
      {
        "q": "Does this merger alter the visual layout or fonts of my PDFs?",
        "a": "No, original page streams, formatting, vector text, and embedded graphics are maintained intact."
      },
      {
        "q": "Do I have to register an account or subscribe?",
        "a": "No registration, credit card, or personal information is ever requested."
      }
    ],
    "relatedTools": [
      {
        "name": "PDF to Word Converter",
        "hash": "#pdf-to-word"
      },
      {
        "name": "Compress PDF Document",
        "hash": "#compress-pdf"
      },
      {
        "name": "Image to PDF Converter",
        "hash": "#image-to-pdf"
      }
    ]
  },
  {
    "id": "ageCalc",
    "hash": "#age-calculator",
    "url": "https://toolshere.online/age-calculator",
    "name": "Age & Date Calculator",
    "category": "Calculator",
    "cardDesc": "Calculate your exact age in years, months, and days alongside total days lived using precise calendar leap-year calculations in real time.",
    "seoTitle": "Accurate Age & Date Calculator Online | Calculate Exact Age in Days",
    "metaDesc": "Calculate your exact age in years, months, days, and total days lived. Fast, precise, and handles leap years and calendar variations accurately.",
    "h1": "Free Online Age & Date of Birth Calculator",
    "intro": "The ToolsHere Age & Date Calculator is a precision chronology tool designed for individuals filling out official employment applications, government competitive examination forms, insurance enrollments, or simply discovering their exact milestone metrics. By taking into account Gregorian calendar idiosyncrasies, fluctuating month lengths (28, 29, 30, and 31 days), and leap years, this calculator delivers the exact elapsed duration between any birth date and today. The tool presents your age broken down cleanly into years, months, days, as well as an exact tally of total cumulative days lived.",
    "howToUse": [
      "Click the 'Select Date of Birth' date picker field.",
      "Pick your birth day, month, and year from the interactive calendar dropdown.",
      "The calculator automatically computes and displays your exact age breakdown instantly.",
      "View your precise years, months, and days lived alongside total cumulative days."
    ],
    "features": [
      "Instant real-time calculation upon selecting your date of birth.",
      "Comprehensive breakdown into exact years, months, and remaining days.",
      "Accurate total days lived counter with localized thousand-separator formatting.",
      "Integrated date validation preventing impossible future date selections.",
      "Responsive cards optimized for both mobile and desktop screens."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Valid calendar date (YYYY-MM-DD)",
      "outputFormat": "Numerical years, months, days, and total days summary",
      "limitations": "Calculates chronological age based on the current local system date; future dates are restricted."
    },
    "faqs": [
      {
        "q": "Does this calculator account for leap years?",
        "a": "Yes. The algorithm dynamically checks leap years (such as February having 29 days) and exact month lengths for 100% calendar precision."
      },
      {
        "q": "Why is the total days lived count useful?",
        "a": "Official government recruitments, medical evaluations, and insurance policies frequently specify age eligibility criteria strictly in total elapsed days."
      },
      {
        "q": "Can I calculate past historical dates other than birth dates?",
        "a": "Yes. You can select any past date to compute the exact elapsed time between that event and today."
      }
    ],
    "relatedTools": [
      {
        "name": "GST & Loan EMI Calculator",
        "hash": "#emi-calculator"
      },
      {
        "name": "Word & Character Counter",
        "hash": "#word-counter"
      }
    ]
  },
  {
    "id": "ytThumb",
    "hash": "#youtube-thumbnail",
    "url": "https://toolshere.online/youtube-thumbnail",
    "name": "YouTube Thumbnail Grabber",
    "category": "Media",
    "cardDesc": "Extract and download high-resolution 1080p Max-HD YouTube video thumbnails instantly by pasting any standard, short, or mobile YouTube link.",
    "seoTitle": "Free YouTube Thumbnail Downloader | Download 1080p HD Thumbnails",
    "metaDesc": "Download high-resolution YouTube video thumbnails in 1080p Maxresdefault HD quality. Just paste any YouTube URL and download or copy image link instantly.",
    "h1": "Free YouTube Thumbnail Downloader & Image Grabber",
    "intro": "ToolsHere YouTube Thumbnail Grabber is an indispensable utility for digital marketers, graphic designers, video editors, and content researchers looking to download video cover artwork for presentations, blog posts, competitive research, and design inspiration. By parsing standard watch links, shortened youtu.be URLs, embed links, and mobile URLs, our tool extracts the official high-resolution `maxresdefault` 1920x1080 YouTube CDN cover image. You can inspect the preview instantly, download the full-resolution artwork to your local machine, or copy the direct image asset link with a single tap.",
    "howToUse": [
      "Copy the web link of any YouTube video from your browser address bar or mobile share button.",
      "Paste the URL into the 'Paste YouTube Video Link' input field.",
      "The tool instantly parses the video ID and renders the highest available thumbnail preview.",
      "Click 'Download Max HD' to open and save the 1080p image, or click 'Copy URL' to copy the direct CDN link."
    ],
    "features": [
      "Supports all YouTube URL structures (standard watch?v=, youtu.be, embed, and mobile links).",
      "Direct extraction of top-tier Maxresdefault 1080p HD thumbnail graphics.",
      "Instant visual preview banner before downloading.",
      "One-click 'Copy URL' button for easy sharing and markdown embedding.",
      "Completely browser-based with zero external API rate limits."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Any public YouTube video URL or 11-character video ID",
      "outputFormat": "High-resolution JPEG image (1280x720 / 1920x1080)",
      "limitations": "Private or unlisted videos with restricted CDN access may fall back to standard high quality (hqdefault) thumbnails."
    },
    "faqs": [
      {
        "q": "What is the resolution of the downloaded thumbnail?",
        "a": "The tool fetches the maximum resolution available from YouTube servers, typically 1920x1080 or 1280x720 pixels (Maxresdefault)."
      },
      {
        "q": "Does this tool work with YouTube Shorts URLs?",
        "a": "Yes. You can paste standard video links, shortened youtu.be links, or Shorts URLs containing the video ID."
      },
      {
        "q": "Can I use downloaded thumbnails commercially?",
        "a": "Thumbnails belong to their respective video creators. Downloading them for educational, reference, critique, or fair-use review is customary, but obtain permission for commercial reuse."
      }
    ],
    "relatedTools": [
      {
        "name": "Image Compressor & Resizer",
        "hash": "#image-compressor"
      },
      {
        "name": "QR Code Studio & Reader",
        "hash": "#qr-code-generator"
      }
    ]
  },
  {
    "id": "qrTool",
    "hash": "#qr-code-generator",
    "url": "https://toolshere.online/qr-code-generator/",
    "name": "QR Code Generator & Scanner",
    "category": "Utility",
    "cardDesc": "Generate custom QR codes for websites, Wi-Fi, vCards, and WhatsApp, or scan QR codes from photos and live camera in real time.",
    "seoTitle": "Free QR Code Generator & Scanner Online | Create & Read QR Codes",
    "metaDesc": "Generate custom high-resolution QR codes for websites, Wi-Fi, vCards, and WhatsApp, or scan QR codes from photos and camera live. 100% private in-browser QR studio.",
    "h1": "Free Online QR Code Generator & Scanner Studio",
    "intro": "ToolsHere QR Code Studio & Scanner is an all-in-one, 100% client-side utility designed for creators, businesses, event coordinators, and everyday users. Create high-contrast, error-corrected QR codes for website URLs, Wi-Fi networks (with password escaping and visibility toggle), vCard business contacts, email drafts, and direct WhatsApp chats. Switch to the Scanner tab to decode QR codes directly from image uploads, rasterized SVGs, or your device camera in real time. Designed with a strict client-side security architecture, your camera stream, Wi-Fi passwords, and scanned results remain strictly in your browser memory with zero server tracking.",
    "howToUse": [
      "Choose 'Generator' to create a QR code or 'Scanner' to read an existing code.",
      "In Generator mode, select your content type (URL, Text, Wi-Fi, vCard, Email, or WhatsApp) and fill in the details.",
      "Customize module and background colors, check contrast, and download in high-res PNG, vector SVG, or printable PDF.",
      "In Scanner mode, drop an image file (PNG, JPG, SVG) or click 'Start Camera Scanner' to point your camera at a physical QR code.",
      "Review decoded content safely with 1-click Copy, or preview verified HTTP/HTTPS links with zero automated redirects."
    ],
    "features": [
      "Six dedicated QR generator modes: URL, Plain Text, Wi-Fi Network, vCard Contact, Email, and WhatsApp.",
      "Dual scanner engine: instant photo/SVG file decoding and live device camera scanning.",
      "Standard Wi-Fi encoding with special character escaping and password visibility toggle.",
      "Strict security link policy: decoded URLs are never automatically opened or redirected.",
      "Safe SVG rasterization preventing direct markup injection or script execution.",
      "High-resolution exports: standard to 4K Ultra HD PNG, vector SVG, and printable PDF.",
      "100% private in-browser processing with zero server storage, logging, or third-party API dependencies."
    ],
    "formatsAndLimits": {
      "supportedInputs": "URL, Wi-Fi credentials, vCard 3.0, email, WhatsApp, plain text, and PNG/JPG/WebP/SVG images for scanning",
      "outputFormat": "High-Res PNG (600px, 1200px, 2400px), Vector SVG (.svg), Printable PDF (.pdf)",
      "limitations": "Camera scanner requires browser permission over HTTPS; image upload serves as an instant zero-permission fallback."
    },
    "faqs": [
      {
        "q": "How do I create a Wi-Fi QR code that guests can scan to connect?",
        "a": "Select the 'Wi-Fi' tab, type your network SSID name, choose your security type (WPA/WPA2/WPA3 or WEP), and enter your password. Guests scanning with their phone camera will see an instant 'Join Network' prompt without typing the password."
      },
      {
        "q": "Can I scan a QR code from a picture or screenshot without a camera?",
        "a": "Yes! Switch to the 'Scanner' tab and upload your image (PNG, JPG, WebP, or SVG). Our client-side decoder analyzes the pixel data directly in your browser and reveals the encoded text instantly."
      },
      {
        "q": "Does the scanner automatically open links found in QR codes?",
        "a": "No, never. For your online security, all decoded content is displayed as text first. If a valid web link is detected, you are shown an explicit 'Visit Link' button so you can inspect the destination before opening it."
      },
      {
        "q": "Do the QR codes generated on ToolsHere ever expire?",
        "a": "No! These are standard static QR codes. Because the information is directly encoded into the visual matrix without redirects, they work forever."
      },
      {
        "q": "Is my camera video stream or uploaded photo sent to a server?",
        "a": "No, 100%. Camera video frames and uploaded images are processed entirely inside your local device's memory using JavaScript and Web APIs. Nothing is ever recorded or uploaded."
      },
      {
        "q": "Can I print these QR codes on banners, packaging, and business cards?",
        "a": "Yes. You can download vector SVG files for infinite print scaling with crisp edges, or high-resolution PNGs up to 2400px (4K print quality)."
      }
    ],
    "relatedTools": [
      {
        "name": "Strong Password Creator",
        "hash": "#password-generator"
      },
      {
        "name": "SEO Meta Tag Generator",
        "hash": "#seo-meta-generator"
      }
    ]
  },
  {
    "id": "passwordGen",
    "hash": "#password-generator",
    "url": "https://toolshere.online/password-generator",
    "name": "Strong Password Creator",
    "category": "Security",
    "cardDesc": "Generate cryptographically secure passwords with custom lengths (8–32 characters), symbols, and numbers using your browser's Web Crypto API.",
    "seoTitle": "Free Strong Password Generator | Cryptographically Secure Passwords",
    "metaDesc": "Generate cryptographically secure, random passwords with custom lengths, symbols, and numbers using the Web Crypto API. Fast, private, and unhackable.",
    "h1": "Free Cryptographically Secure Password Generator",
    "intro": "ToolsHere Strong Password Creator is an essential security tool designed to safeguard your online banking, email accounts, cloud databases, and social media profiles against credential stuffing and brute-force attacks. Utilizing your browser's hardware-backed `crypto.getRandomValues()` API rather than predictable pseudorandom math generators, every password generated provides true cryptographic randomness. You can tailor password lengths from 8 to 32 characters, toggle special symbols and numerals, and copy the final output with a single tap. Because no passwords are ever transmitted or stored on a server, your credentials remain strictly between you and your password manager.",
    "howToUse": [
      "Use the 'Password Length' slider to select your desired character count (8 to 32 characters).",
      "Check or uncheck the 'Symbols (@#$%)' and 'Numbers (0-9)' boxes according to your requirements.",
      "Click 'Generate New Password' to refresh the random string whenever desired.",
      "Click the 'Copy' button to copy your secure password directly to your clipboard."
    ],
    "features": [
      "Cryptographically secure randomness powered by the browser Web Crypto API.",
      "Customizable length slider from 8 up to 32 characters.",
      "Granular symbol (@#$%^&*()_+-=[]{}|) and numeric (0-9) toggle checkboxes.",
      "One-click clipboard copy button with visual confirmation toast notification.",
      "100% offline and client-side operation with zero data retention."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Slider length 8–32 characters, symbol and number toggles",
      "outputFormat": "Alphanumeric and special character string",
      "limitations": "Passwords are generated in memory and never stored; ensure you save them in a secure password manager before closing the tab."
    },
    "faqs": [
      {
        "q": "Why is the Web Crypto API more secure than standard generators?",
        "a": "The Web Crypto API draws on hardware-level system entropy, making the generated numbers mathematically unpredictable and resistant to pattern-prediction attacks."
      },
      {
        "q": "Does ToolsHere store or log any generated passwords?",
        "a": "Never. The generator runs completely within your device's browser memory. Not a single character is sent to our servers or saved anywhere."
      },
      {
        "q": "What password length is recommended for maximum security?",
        "a": "Cybersecurity experts recommend a minimum of 16 characters with a mixture of uppercase letters, lowercase letters, numbers, and symbols."
      }
    ],
    "relatedTools": [
      {
        "name": "QR Code Studio & Reader",
        "hash": "#qr-code-generator"
      },
      {
        "name": "Word & Character Counter",
        "hash": "#word-counter"
      }
    ]
  },
  {
    "id": "wordCount",
    "hash": "#word-counter",
    "url": "https://toolshere.online/word-counter/",
    "name": "Word & Character Counter",
    "category": "Text",
    "cardDesc": "Count words, characters (with & without spaces), sentences, paragraphs, and reading time in real time as you type or paste text.",
    "seoTitle": "Free Word & Character Counter Online | Accurate Text Length Counter",
    "metaDesc": "Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time live. Free, 100% private in-browser text analyzer.",
    "h1": "Free Online Word Counter & Character Analyzer",
    "intro": "ToolsHere Word & Character Counter is a fast, clean, and distraction-free text analyzer tailored for writers, students, researchers, copywriters, and social media creators. As you type or paste your content, it simultaneously calculates words, characters with spaces, characters without spaces, sentences, paragraphs, and estimated reading time in real time. Designed with a strict client-side architecture, your text is processed entirely inside your browser memory with zero server uploads, keeping essays, manuscripts, confidential emails, and sensitive notes completely private.",
    "howToUse": [
      "Type or paste your text directly into the large editor area.",
      "View live numerical updates in the 6-metric statistics dashboard immediately as you write.",
      "Check word count, characters (with and without spaces), sentences, paragraphs, and reading time.",
      "Use 'Copy Statistics' to export an editorial summary, or 'Clear Text' to reset your workspace."
    ],
    "features": [
      "Real-time live updates as you type or paste with zero latency.",
      "Dual character counters: exact counts both including and excluding whitespace.",
      "Smart sentence detection that avoids false splits on decimals (e.g. 3.14) and abbreviations.",
      "Non-empty paragraph detection that ignores blank and whitespace-only lines.",
      "Estimated reading time based on standard 200 words-per-minute adult reading speed.",
      "One-click action controls: Clear Text, Copy Text, and Copy Formatted Statistics.",
      "100% client-side privacy with zero server storage, logging, or third-party tracking."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Plain text, essays, articles, social posts, code snippets, and markdown",
      "outputFormat": "Live numerical statistics (words, characters, sentences, paragraphs, reading time)",
      "limitations": "Processes standard multi-language Unicode text smoothly in browser memory with no artificial character limits."
    },
    "faqs": [
      {
        "q": "How does this tool accurately count words?",
        "a": "The counter uses Unicode-aware word tokenization that groups letters, numbers, hyphens, and apostrophes into words while ignoring multiple consecutive spaces, tabs, and isolated punctuation marks."
      },
      {
        "q": "What is the difference between character count with and without spaces?",
        "a": "Character count with spaces measures the total length including every space, tab, and newline using Unicode grapheme cluster counting so emojis (like 😀) accurately count as single characters. Character count without spaces tallies only visible letters, numbers, and symbols."
      },
      {
        "q": "How does sentence counting handle decimals and abbreviations?",
        "a": "Our algorithm protects decimal numbers (like 3.14 or $9.99), single-letter initials (like J. K.), and common abbreviations (like Dr., Mr., vs., e.g., and etc.) from triggering false sentence breaks."
      },
      {
        "q": "What qualifies as a paragraph in the counter?",
        "a": "Paragraphs are counted as distinct text blocks separated by one or more blank lines. Wrapped lines within the same paragraph stay together, while empty or whitespace-only lines are excluded from the paragraph tally."
      },
      {
        "q": "How is the estimated reading time calculated?",
        "a": "Reading time is calculated using the widely accepted average adult reading speed of 200 words per minute (WPM). Text under one minute is displayed in seconds for granular accuracy."
      },
      {
        "q": "Is my pasted text private and secure?",
        "a": "Yes, 100%. All analysis runs locally in your device's web browser using JavaScript. No text is ever uploaded, cached, or stored on any server."
      }
    ],
    "relatedTools": [
      {
        "name": "Text Case Converter",
        "hash": "#text-case-converter"
      },
      {
        "name": "SEO Meta Tag Generator",
        "hash": "#seo-meta-generator"
      },
      {
        "name": "JSON Formatter & Validator",
        "hash": "#json-formatter"
      },
      {
        "name": "Strong Password Creator",
        "hash": "#password-generator"
      }
    ]
  },
  {
    "id": "gstEmi",
    "hash": "#emi-calculator",
    "url": "https://toolshere.online/emi-calculator",
    "name": "GST & Loan EMI Calculator",
    "category": "Finance",
    "cardDesc": "Calculate monthly loan EMIs and Goods and Services Tax (5%, 12%, 18%, 28%) with instant numerical breakdowns for loans and business billing.",
    "seoTitle": "Free GST & Loan EMI Calculator Online | Accurate Financial Calculator",
    "metaDesc": "Calculate monthly loan EMIs and GST amounts (5%, 12%, 18%, 28%) instantly. Accurate financial calculations for home, car, personal loans, and business bills.",
    "h1": "Free Online GST & Loan EMI Financial Calculator",
    "intro": "Managing financial planning and tax compliance is simple with the ToolsHere GST & Loan EMI Calculator. Built for prospective home buyers, car loan applicants, small business owners, and freelance service providers, this twin-mode calculator handles both loan repayment schedules and Goods & Services Tax (GST) computations. In Loan EMI mode, enter your principal loan amount, annual interest rate, and tenure in months to compute your fixed monthly repayment. In GST mode, enter any base product cost and select 5%, 12%, 18%, or 28% tax slabs to immediately view the exact tax amount and total gross price.",
    "howToUse": [
      "Select either the 'Loan EMI' or 'GST Calc' tab at the top of the utility.",
      "For Loan EMI: Enter your loan Principal amount, annual interest Rate (% p.a.), and Tenure in months to see your monthly EMI.",
      "For GST: Enter your Base Amount in rupees and choose your GST tax slab (5%, 12%, 18%, or 28%).",
      "Read the calculated Monthly EMI or the split GST Amount and Total Gross Price instantly."
    ],
    "features": [
      "Dual-purpose interface toggling seamlessly between Loan EMI and GST Calculator.",
      "Standard reducing-balance banking amortization formula for exact monthly EMIs.",
      "Preconfigured official GST tax brackets: 5%, 12%, 18%, and 28%.",
      "Instant real-time output updates as you type numbers.",
      "Neat localized currency formatting for clear financial budgeting."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Principal, annual interest rate %, tenure in months, and base billing amount",
      "outputFormat": "Monthly EMI figure, tax amount, and total gross cost",
      "limitations": "Calculations reflect standard compound amortization and standard GST slabs without auxiliary processing fees or insurance surcharges."
    },
    "faqs": [
      {
        "q": "What formula is used to calculate the Loan EMI?",
        "a": "We use the standard banking formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months."
      },
      {
        "q": "Which GST rates are available?",
        "a": "The calculator supports all standard official tax slabs: 5% (essentials), 12% (standard items), 18% (services and manufacturing), and 28% (luxury goods)."
      },
      {
        "q": "Can I use this for home loans and car loans?",
        "a": "Yes. Simply input your total borrowed amount, agreed bank interest rate, and total duration in months to see your monthly installment."
      }
    ],
    "relatedTools": [
      {
        "name": "Age & Date Calculator",
        "hash": "#age-calculator"
      },
      {
        "name": "Word & Character Counter",
        "hash": "#word-counter"
      }
    ]
  },
  {
    "id": "imgFormat",
    "hash": "#image-converter",
    "url": "https://toolshere.online/image-converter",
    "name": "Image Format Converter",
    "category": "Image",
    "cardDesc": "Convert pictures between PNG, JPG, and WebP formats directly inside browser memory with preserved resolution and zero server-side uploads.",
    "seoTitle": "Free Image Format Converter Online | Convert PNG, JPG, WebP",
    "metaDesc": "Convert image formats online between PNG, JPG, and WebP instantly in your browser. Fast, 100% private, free, and preserves original image resolution.",
    "h1": "Free Online Image Format Converter (PNG, JPG, WebP)",
    "intro": "ToolsHere Image Format Converter is a client-side image transformation tool created for website owners, app developers, photographers, and office workers who need to change image file extensions quickly without sacrificing privacy. Web developers converting legacy PNGs or JPGs to modern lightweight WebP formats for faster page speeds can do so in seconds. Similarly, users needing universally compatible JPGs for official paperwork or transparent PNGs for graphic presentations can convert seamlessly. Everything happens right inside your browser canvas, ensuring zero server lag and absolute privacy for your personal files.",
    "howToUse": [
      "Click the upload box or drag your image file (PNG, JPG, WebP, BMP) into the dropzone.",
      "The tool displays the loaded file name and size.",
      "Click your desired target format button: 'Convert PNG', 'Convert JPG', or 'Convert WebP'.",
      "The converted file will automatically render and download onto your device."
    ],
    "features": [
      "One-click conversion between PNG, JPG, and modern WebP formats.",
      "Automatic clean white background synthesis when converting transparent PNGs into JPEGs.",
      "Retains natural image dimensions and pixel resolution.",
      "Instant client-side processing using hardware-accelerated Canvas rendering.",
      "Completely private with zero data sent across the network."
    ],
    "formatsAndLimits": {
      "supportedInputs": "PNG, JPG/JPEG, WebP, BMP, GIF",
      "outputFormat": "PNG (.png), JPEG (.jpg), or WebP (.webp)",
      "limitations": "Animated GIF frames are converted to static snapshots; conversion is done one image at a time."
    },
    "faqs": [
      {
        "q": "Why should I convert my images to WebP?",
        "a": "WebP is a modern image format developed by Google that offers roughly 25-35% smaller file sizes than PNG and JPEG at equivalent visual quality, speeding up web page loading."
      },
      {
        "q": "What happens to transparent backgrounds when converting PNG to JPG?",
        "a": "Because the standard JPEG format does not support alpha transparency, transparent areas are automatically and cleanly filled with a solid white background."
      },
      {
        "q": "Is there any loss of image resolution during conversion?",
        "a": "No. The converter reads the natural width and height of the image and renders it on a full-scale canvas, preserving original pixel dimensions."
      }
    ],
    "relatedTools": [
      {
        "name": "Image Compressor & Resizer",
        "hash": "#image-compressor"
      },
      {
        "name": "AI Background Remover",
        "hash": "#background-remover"
      },
      {
        "name": "Image to PDF Converter",
        "hash": "#image-to-pdf"
      }
    ]
  },
  {
    "id": "textCase",
    "hash": "#text-case-converter",
    "url": "https://toolshere.online/text-case-converter",
    "name": "Text Case Converter",
    "category": "Text",
    "cardDesc": "Convert strings to UPPERCASE, lowercase, Title Case, and clean URL Slugs with one click for coding, headlines, and clean copywriting.",
    "seoTitle": "Free Text Case Converter Online | UPPERCASE, lowercase, Title Case, Slug",
    "metaDesc": "Convert text case online instantly. Switch between UPPERCASE, lowercase, Title Case, and URL slugs with one click. Free, private, and instant copy.",
    "h1": "Free Online Text Case Converter & URL Slug Generator",
    "intro": "ToolsHere Text Case Converter eliminates the tedious chore of retyping text accidentally written in CAPS LOCK or formatting messy headings by hand. Created for programmers, journalists, digital publishers, and students, this utility provides one-click conversions across the four most crucial typography styles: UPPERCASE, lowercase, Title Case (capitalizing the initial letter of every word), and SEO-friendly URL Slugs (stripping punctuation and separating words with hyphens). Paste your text, select your target transformation, and copy the clean result directly to your clipboard.",
    "howToUse": [
      "Paste or type your raw text into the input box.",
      "Click your desired formatting button: UPPERCASE, lowercase, Title Case, or url-slug.",
      "The text updates immediately in the text area.",
      "Click 'Copy Output Text' to copy the formatted string directly to your clipboard."
    ],
    "features": [
      "Instant transformations for UPPERCASE, lowercase, Title Case, and url-slug.",
      "Smart URL slugification stripping special characters, symbols, and double dashes.",
      "Title Case capitalization algorithm for headlines, blog titles, and book chapters.",
      "One-click 'Copy Output Text' button with visual confirmation toast notification.",
      "Works entirely in local browser memory without character limits."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Any raw text, sentences, titles, or code strings",
      "outputFormat": "Formatted text matching the selected case style",
      "limitations": "Best for standard Latin/alphabetic scripts; slug generator strips punctuation and accents."
    },
    "faqs": [
      {
        "q": "What does the 'url-slug' transformation do?",
        "a": "It converts your headline into lowercase, removes punctuation marks, and replaces spaces with hyphens, creating clean, SEO-friendly URL permalinks."
      },
      {
        "q": "Can I use Title Case for blog post titles and headlines?",
        "a": "Yes. Title Case capitalizes the first letter of each word, ensuring uniform styling for headings, essays, and titles."
      },
      {
        "q": "Is there any limit to the amount of text I can format?",
        "a": "No. You can convert short phrases or multi-page documents without restriction."
      }
    ],
    "relatedTools": [
      {
        "name": "Word & Character Counter",
        "hash": "#word-counter"
      },
      {
        "name": "JSON Formatter & Validator",
        "hash": "#json-formatter"
      }
    ]
  },
  {
    "id": "jsonFormat",
    "hash": "#json-formatter",
    "url": "https://toolshere.online/json-formatter",
    "name": "JSON Formatter & Validator",
    "category": "Developer",
    "cardDesc": "Beautify nested JSON payloads, minify code for production APIs, and validate syntax errors instantly in your browser with zero data leaks.",
    "seoTitle": "Free JSON Formatter & Validator Online | Beautify and Minify JSON",
    "metaDesc": "Format, beautify, validate, and minify JSON data online. Catch syntax errors with clear line indicators. 100% client-side for secure API debugging.",
    "h1": "Free Online JSON Formatter, Beautifier & Validator",
    "intro": "ToolsHere JSON Formatter & Validator is a fast, secure debugging utility engineered for software engineers, backend developers, API testers, and student programmers. Working with unformatted, minified single-line API responses can make debugging tedious and error-prone. With this tool, simply paste your JSON string and click 'Beautify JSON' to format it with clean 2-space indentation, or click 'Minify JSON' to compress payloads for network transmission. If your JSON contains a trailing comma, unquoted key, or bracket mismatch, our validator flags the exact syntax error immediately, all within your browser memory so sensitive API keys and user data never leave your computer.",
    "howToUse": [
      "Paste your raw JSON text or API response into the editor window.",
      "Click 'Beautify JSON' to reformat with neat, legible 2-space hierarchy indentation.",
      "Click 'Minify JSON' if you want to strip all whitespace and compress it into a compact payload.",
      "If the JSON is invalid, an error toast will explain the syntax issue.",
      "Click the copy button to copy the validated result to your clipboard."
    ],
    "features": [
      "Instant JSON beautification with clean 2-space hierarchical indentation.",
      "One-click payload minification removing unnecessary whitespace.",
      "Real-time syntax validation identifying malformed keys, quotes, or missing commas.",
      "One-click clipboard copy button with confetti and notification confirmation.",
      "100% confidential client-side processing protecting proprietary API keys and tokens."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Standard JSON objects, arrays, strings, and primitives",
      "outputFormat": "Beautified indented JSON or minified single-line JSON string",
      "limitations": "Requires valid standard JSON syntax (strict double quotes for strings and keys; comments are not standard JSON)."
    },
    "faqs": [
      {
        "q": "Why is client-side JSON formatting safer for developers?",
        "a": "Many developer payloads include authorization tokens, user passwords, or confidential database records. Because ToolsHere runs entirely in your local browser, your private data is never sent to a remote server."
      },
      {
        "q": "Why did the validator flag an error on my JSON?",
        "a": "Common causes of invalid JSON include single quotes instead of double quotes around keys/strings, trailing commas after the last item, or unclosed brackets."
      },
      {
        "q": "Can I minify large JSON files for production use?",
        "a": "Yes. Minifying strips unnecessary whitespace and line breaks, minimizing the payload size for API requests and mobile app efficiency."
      }
    ],
    "relatedTools": [
      {
        "name": "SEO Meta Tag Generator",
        "hash": "#seo-meta-generator"
      },
      {
        "name": "Text Case Converter",
        "hash": "#text-case-converter"
      }
    ]
  },
  {
    "id": "seoMeta",
    "hash": "#seo-meta-generator",
    "url": "https://toolshere.online/seo-meta-generator",
    "name": "SEO Meta Tag Generator",
    "category": "Developer",
    "cardDesc": "Generate standard HTML title, meta description, robots, and OpenGraph tags to optimize search engine ranking and social media share previews.",
    "seoTitle": "Free SEO Meta Tag Generator Online | Create Google & OpenGraph Tags",
    "metaDesc": "Generate SEO meta tags for your website. Create Google titles, meta descriptions, robots, and OpenGraph preview tags with one click. Free and instant.",
    "h1": "Free Online SEO Meta Tag & OpenGraph Generator",
    "intro": "ToolsHere SEO Meta Tag Generator is a practical tool for web developers, bloggers, indie hackers, and digital marketers seeking to maximize organic search engine click-through rates and optimize social media link previews. Correctly implementing HTML `<head>` meta tags is crucial for Google indexing and ensures that Facebook, LinkedIn, and Twitter/X render attractive cards when your URL is shared. Simply enter your web page title and a descriptive meta summary, and our generator synthesizes standard Google title, description, robots directives, and OpenGraph tags ready to paste directly into your site's HTML header.",
    "howToUse": [
      "Enter your desired page title in the 'Page Title' field.",
      "Type a concise 140–160 character summary in the 'Meta Description' field.",
      "Review the synthesized HTML code block generated in real time.",
      "Click 'Copy HTML Meta Tags' to copy the code directly into your clipboard.",
      "Paste the generated snippet into the `<head>` section of your website's HTML."
    ],
    "features": [
      "Real-time tag synthesis responding as you type.",
      "Generates standard `<title>` and `<meta name=\"description\">` tags.",
      "Includes essential `<meta name=\"robots\" content=\"index, follow\">` directive.",
      "Generates standard OpenGraph tags (`og:title`, `og:description`) for rich social media cards.",
      "One-click copy button for rapid integration into any website codebase."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Title string and meta description summary text",
      "outputFormat": "Standard HTML5 `<head>` meta tag snippet",
      "limitations": "Outputs core title, description, robots, and OpenGraph tags; additional specialized tags (e.g. Twitter creator, Canonical URL) can be supplemented manually."
    },
    "faqs": [
      {
        "q": "Where do I paste the generated meta tags in my code?",
        "a": "Paste the generated snippet inside the `<head>` and `</head>` tags of your HTML document, typically near the top of the file."
      },
      {
        "q": "What is the recommended length for an SEO meta description?",
        "a": "Search engines like Google generally display between 140 and 160 characters on desktop and mobile search result snippets."
      },
      {
        "q": "Why are OpenGraph (og:) tags important?",
        "a": "OpenGraph tags ensure that platforms like Facebook, WhatsApp, LinkedIn, and Slack display a clean title, description, and thumbnail when someone shares your link."
      }
    ],
    "relatedTools": [
      {
        "name": "Word & Character Counter",
        "hash": "#word-counter"
      },
      {
        "name": "JSON Formatter & Validator",
        "hash": "#json-formatter"
      }
    ]
  },
  {
    "id": "compressPdf",
    "hash": "#compress-pdf",
    "url": "https://toolshere.online/compress-pdf",
    "name": "Compress PDF Document",
    "category": "Document",
    "cardDesc": "Shrink heavy PDF documents down to portal-friendly file sizes with selectable compression modes directly in browser memory with total privacy.",
    "seoTitle": "Free PDF Compressor Online | Reduce PDF File Size Privately",
    "metaDesc": "Compress PDF files online without losing readability. Reduce document size for email attachments and portal uploads. 100% private client-side tool.",
    "h1": "Free Online PDF Compressor & File Size Reducer",
    "intro": "Email servers, job portals, college application forms, and government websites frequently restrict PDF uploads to strict size ceilings like 1MB, 2MB, or 500KB. The ToolsHere Compress PDF utility allows you to optimize large PDF documents right on your device. Whether your PDF is bloated by embedded illustrations, high-DPI scans, or redundant metadata streams, our tool prepares an optimized document package without exposing your confidential papers to cloud servers. Simply select your document, review the original size, choose your compression profile, and download your optimized PDF.",
    "howToUse": [
      "Click or drag your PDF document into the file selector.",
      "Check your displayed original file size on screen.",
      "Select your preferred compression profile ('Standard Quality' or 'Maximum Compression').",
      "Click 'Download Compressed PDF' to download your optimized document immediately."
    ],
    "features": [
      "Selectable compression profiles for balanced quality or maximum file size reduction.",
      "Live display of original file size in kilobytes/megabytes.",
      "Estimated reduction indicator for quick expectations.",
      "100% confidential processing inside browser memory—no server uploads.",
      "Fast processing with zero document watermarks or fees."
    ],
    "formatsAndLimits": {
      "supportedInputs": "Standard PDF documents (.pdf)",
      "outputFormat": "Compressed PDF file (.pdf)",
      "limitations": "Encrypted password-locked PDFs must be unlocked before compression."
    },
    "faqs": [
      {
        "q": "Will compressing a PDF make the text blurry?",
        "a": "No. Standard vector text and fonts remain crisp. Compression primarily optimizes embedded raster images and strips redundant metadata."
      },
      {
        "q": "What is the difference between Standard and Maximum compression?",
        "a": "Standard Quality maintains higher image fidelity, while Maximum Compression applies stronger optimization for strict upload size limits."
      },
      {
        "q": "Is there any risk of my personal documents leaking?",
        "a": "None. All compression actions run locally within your device session. ToolsHere does not upload, log, or store your documents on any server."
      }
    ],
    "relatedTools": [
      {
        "name": "PDF to Word Converter",
        "hash": "#pdf-to-word"
      },
      {
        "name": "Merge & Split PDF",
        "hash": "#merge-pdf"
      },
      {
        "name": "Image to PDF Converter",
        "hash": "#image-to-pdf"
      }
    ]
  },
  {
    "id": "imgToPdf",
    "hash": "#image-to-pdf",
    "url": "https://toolshere.online/image-to-pdf",
    "name": "Image to PDF Converter",
    "category": "Document",
    "cardDesc": "Convert and bundle multiple PNG, JPG, and WebP images into a single clean PDF document ready for printing, submission, and sharing.",
    "seoTitle": "Free Image to PDF Converter Online | Convert JPG and PNG to PDF",
    "metaDesc": "Convert and merge multiple JPG, PNG, and WebP photos into a single PDF document online. Fast, free, confidential, and ideal for printing or official uploads.",
    "h1": "Free Online Image to PDF Converter & Photo Bundler",
    "intro": "ToolsHere Image to PDF Converter makes it effortless to compile receipts, identity documents, handwritten notes, certificate scans, and photo albums into a single, professional PDF document. Rather than sending multiple loose photo attachments that can get disorganized, you can select multiple PNG, JPG, or WebP images simultaneously, preview them on an interactive visual grid, and assemble them into a unified PDF file with a single click. The entire compiling pipeline runs in your device's browser memory, protecting confidential tax records, Aadhaar cards, driver's licenses, and private receipts.",
    "howToUse": [
      "Click the upload area and select one or multiple images (PNG, JPG, or WebP) from your device.",
      "Inspect the live thumbnail gallery grid to verify all selected photos.",
      "Click 'Generate & Download PDF' to initiate the client-side document synthesis.",
      "Save your compiled PDF directly onto your computer or phone."
    ],
    "features": [
      "Multi-image selection supporting batch photo uploads.",
      "Interactive visual thumbnail gallery previewing all selected images.",
      "Wide format compatibility: accepts JPG, PNG, and modern WebP files.",
      "Fast client-side document compilation with zero waiting queues.",
      "Complete data privacy with zero server uploads."
    ],
    "formatsAndLimits": {
      "supportedInputs": "PNG, JPG/JPEG, WebP image files",
      "outputFormat": "Unified multi-page PDF document (.pdf)",
      "limitations": "Recommended batch size up to 20-30 images at once depending on your device's available browser memory."
    },
    "faqs": [
      {
        "q": "Can I combine different image formats into the same PDF?",
        "a": "Yes. You can select a mixture of PNG, JPG, and WebP files together in the same batch."
      },
      {
        "q": "Can I use this for compiling passport, ID card, and receipt scans?",
        "a": "Yes, this tool is ideal for compiling government IDs, invoices, tax documents, and assignment notes into one tidy PDF."
      },
      {
        "q": "Are my uploaded photos saved or viewable by anyone else?",
        "a": "No. The entire process occurs locally on your machine. Your photos are never uploaded to any remote server or stored anywhere."
      }
    ],
    "relatedTools": [
      {
        "name": "Image Compressor & Resizer",
        "hash": "#image-compressor"
      },
      {
        "name": "Merge & Split PDF",
        "hash": "#merge-pdf"
      },
      {
        "name": "Compress PDF Document",
        "hash": "#compress-pdf"
      }
    ]
  }
];

    function renderToolSeoDocumentation(toolId, container) {
      const tool = SEO_TOOL_REGISTRY.find(t => t.id === toolId);
      if (!tool) return;

      const guideEl = document.createElement('section');
      guideEl.className = 'mt-8 pt-6 border-t border-[#E5E7EB] dark:border-slate-700/80 space-y-6 text-slate-700 dark:text-slate-300';
      
      let relatedToolsHtml = '';
      if (tool.relatedTools && tool.relatedTools.length > 0) {
        relatedToolsHtml = `
          <div class="pt-2">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Related Online Tools</h3>
            <div class="flex flex-wrap gap-2">
              ${tool.relatedTools.map(rt => {
                const targetHash = rt.hash.replace('#', '');
                const targetKey = Object.keys(modalRouteMap).find(k => modalRouteMap[k].hash === targetHash);
                return `<button type="button" onclick="openModal('${targetKey || ''}')" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-sky-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5">
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> ${rt.name}
                </button>`;
              }).join('')}
            </div>
          </div>
        `;
      }

      guideEl.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 uppercase tracking-wide">${tool.category} Utility</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><i class="fa-solid fa-lock text-[9px]"></i> 100% Private (No Uploads)</span>
          </div>
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">${tool.h1}</h2>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700 leading-relaxed text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>${tool.intro}</p>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-list-ol text-sky-600 dark:text-sky-400"></i> Step-by-Step Instructions
          </h3>
          <ol class="space-y-2 text-xs sm:text-sm">
            ${tool.howToUse.map((step, idx) => `
              <li class="flex items-start gap-2.5">
                <span class="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center mt-0.5">${idx + 1}</span>
                <span class="text-slate-600 dark:text-slate-300">${step}</span>
              </li>
            `).join('')}
          </ol>
        </div>

        <div class="space-y-2.5">
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-500"></i> Verified Features
          </h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            ${tool.features.map(f => `
              <li class="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <i class="fa-solid fa-check text-emerald-500 text-xs mt-1 shrink-0"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${tool.formatsAndLimits ? `
          <div class="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 space-y-1.5 text-xs">
            <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-info"></i> Supported Formats & Technical Limits
            </div>
            <p class="text-slate-600 dark:text-slate-300"><strong>Supported Inputs:</strong> ${tool.formatsAndLimits.supportedInputs}</p>
            <p class="text-slate-600 dark:text-slate-300"><strong>Output Format:</strong> ${tool.formatsAndLimits.outputFormat}</p>
            <p class="text-slate-500 dark:text-slate-400"><strong>Operating Note:</strong> ${tool.formatsAndLimits.limitations}</p>
          </div>
        ` : ''}

        <div class="space-y-3">
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-circle-question text-violet-500"></i> Frequently Asked Questions
          </h3>
          <div class="space-y-2">
            ${tool.faqs.map(faq => `
              <details class="group bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-xl p-3 cursor-pointer">
                <summary class="font-bold text-slate-800 dark:text-slate-200 text-xs flex justify-between items-center list-none select-none">
                  <span>${faq.q}</span>
                  <i class="fa-solid fa-chevron-down text-slate-400 group-open:rotate-180 transition-transform"></i>
                </summary>
                <p class="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-2">${faq.a}</p>
              </details>
            `).join('')}
          </div>
        </div>

        ${relatedToolsHtml}
      `;

      container.appendChild(guideEl);
    }

    /* ================= UTILITY 1: IMAGE COMPRESSOR & RESIZER ================= */
    let loadedResizerImg = null;
    let originalResizerFile = null;
    let isAspectLocked = true;
    let imgRatio = 1;
    let resizerOutputFormat = 'auto'; // 'auto' | 'image/jpeg' | 'image/webp' | 'image/png'
    let resizerJpegBg = 'white'; // 'white' | 'black'
    let resizerCurrentBlobUrl = null;
    let resizerCurrentBlob = null;
    let resizerInputHasTransparency = false;
    let resizerDebounceTimer = null;
    let resizerOpSeq = 0; // Monotonic operation counter for async race-condition protection
    const resizerAllocatedUrls = new Set(); // Tracks all active/pending object URLs for safe lifecycle management

    function createResizerBlobUrl(blob) {
      if (!blob || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null;
      const url = URL.createObjectURL(blob);
      resizerAllocatedUrls.add(url);
      return url;
    }

    function revokeResizerBlobUrl(url) {
      if (url && resizerAllocatedUrls.has(url)) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
        resizerAllocatedUrls.delete(url);
      }
    }

    function revokeAllResizerBlobUrlsExcept(keepUrl) {
      for (const url of Array.from(resizerAllocatedUrls)) {
        if (url !== keepUrl) {
          revokeResizerBlobUrl(url);
        }
      }
    }

    function cleanupResizerBlob() {
      resizerOpSeq++; // Invalidate any in-flight async compression or binary search loops
      if (resizerDebounceTimer) {
        clearTimeout(resizerDebounceTimer);
        resizerDebounceTimer = null;
      }
      const preview = document.getElementById('resizerPreview');
      if (preview) {
        preview.onload = null;
        preview.onerror = null;
        preview.removeAttribute('src');
      }
      for (const url of Array.from(resizerAllocatedUrls)) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      }
      resizerAllocatedUrls.clear();
      resizerCurrentBlobUrl = null;
      resizerCurrentBlob = null;
    }

    function checkWebpSupport() {
      if (typeof document === 'undefined' || typeof document.createElement !== 'function') return true;
      try {
        const c = document.createElement('canvas');
        if (!c || typeof c.toDataURL !== 'function') return true;
        return c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch (e) {
        return false;
      }
    }

    function getEffectiveResizerMime() {
      const isWebp = checkWebpSupport();
      if (resizerOutputFormat === 'auto') {
        if (originalResizerFile && originalResizerFile.type) {
          const t = originalResizerFile.type.toLowerCase();
          if (t === 'image/png') return 'image/png';
          if (t === 'image/webp' && isWebp) return 'image/webp';
        }
        return 'image/jpeg';
      }
      if (resizerOutputFormat === 'image/webp' && !isWebp) {
        return 'image/jpeg';
      }
      return resizerOutputFormat;
    }

    function detectImageTransparency(img) {
      if (typeof document === 'undefined' || typeof document.createElement !== 'function') return false;
      try {
        const c = document.createElement('canvas');
        const sampleW = Math.min(64, img.naturalWidth || 64);
        const sampleH = Math.min(64, img.naturalHeight || 64);
        c.width = sampleW;
        c.height = sampleH;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 250) return true;
        }
        return false;
      } catch (e) {
        return Boolean(originalResizerFile && /png|webp|gif/i.test(originalResizerFile.type || ''));
      }
    }

    function getCanvasBlob(canvas, mimeType, quality) {
      return new Promise((resolve, reject) => {
        try {
          if (typeof canvas.toBlob === 'function') {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas toBlob returned null'));
              }
            }, mimeType, quality);
          } else {
            const dataUrl = canvas.toDataURL(mimeType, quality);
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            resolve(new Blob([ab], { type: mimeType }));
          }
        } catch (err) {
          reject(err);
        }
      });
    }

    function renderImageResizer(title, icon, container) {
      if (title) title.innerText = 'Image Compressor & Resizer';
      if (icon) icon.className = 'fa-solid fa-compress';

      container.innerHTML = `
        <div class="space-y-6">
          <!-- Inline Error Notification Box -->
          <div id="resizerErrorBox" class="hidden p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm">
            <i class="fa-solid fa-circle-exclamation text-red-500 text-base mt-0.5 shrink-0"></i>
            <div class="flex-1 space-y-1">
              <div class="font-bold">Image Processing Notice</div>
              <p id="resizerErrorMsg" class="leading-relaxed"></p>
            </div>
            <button type="button" onclick="clearResizerError()" class="text-red-500 hover:text-red-700 p-1 rounded-lg" aria-label="Dismiss error">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Large Prominent Upload Drop Zone -->
          <div id="resizerDropZone" class="relative border-2 border-dashed border-sky-400 dark:border-sky-500 hover:border-sky-600 dark:hover:border-sky-400 bg-gradient-to-b from-sky-50/70 via-white to-sky-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-sky-500/5 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] group">
            <input type="file" id="resizerInput" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="handleResizerImage(this)">
            <div class="w-20 h-20 rounded-3xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-md">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 group-hover:scale-[1.02] transition-all">
              <i class="fa-solid fa-folder-open"></i> Choose Image
            </span>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Drag and drop your image here</p>
            <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-600">JPG</span>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-600">PNG</span>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-600">WebP</span>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-600">GIF</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-2">Up to 50MB per photo • 100% processed directly in your browser memory</p>
          </div>

          <!-- Active Controls (revealed once image is chosen) -->
          <div id="resizerControls" class="hidden space-y-6">
            <div class="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 flex-wrap gap-2">
              <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <i class="fa-solid fa-image text-sky-500"></i>
                <span id="selectedFileName">photo.jpg</span>
                <span id="resizerMetaBadge" class="text-[11px] px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800"></span>
              </div>
              <button type="button" onclick="resetResizerToUpload()" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5">
                <i class="fa-solid fa-arrow-rotate-left text-[10px]"></i> Choose Different Image
              </button>
            </div>

            <!-- 2 Column Responsive Workspace -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <!-- Left Column: Large Preview & Comparison -->
              <div class="lg:col-span-7 space-y-4">
                <div class="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-[#E5E7EB] dark:border-slate-700/80 checkerboard-bg flex justify-center items-center min-h-[300px] max-h-[460px] overflow-hidden">
                  <img id="resizerPreview" class="max-h-[420px] w-auto max-w-full object-contain rounded-xl shadow-md" alt="Compressed Preview">
                </div>

                <!-- Metrics Comparison Cards -->
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div class="p-3.5 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-[#E5E7EB] dark:border-slate-600">
                    <span class="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Original Size</span>
                    <span id="originalSize" class="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">0 KB</span>
                  </div>
                  <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <span class="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Optimized Size</span>
                    <span id="compressedSize" class="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-300">0 KB</span>
                  </div>
                  <div class="p-3.5 bg-sky-50 dark:bg-sky-950/60 rounded-2xl border border-sky-200 dark:border-sky-800">
                    <span class="block text-[11px] font-semibold text-sky-600 dark:text-sky-400">Reduction</span>
                    <span id="savingsBadge" class="text-sm sm:text-base font-extrabold text-sky-700 dark:text-sky-300">-0%</span>
                  </div>
                </div>
              </div>

              <!-- Right Column: Granular Controls -->
              <div class="lg:col-span-5 space-y-5 bg-slate-50/70 dark:bg-slate-700/40 p-5 sm:p-6 rounded-3xl border border-[#E5E7EB]/80 dark:border-slate-700/80">
                <!-- 1. Output Format Selector -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="font-bold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <i class="fa-solid fa-file-export text-sky-600 dark:text-cyan-400"></i> Output Format
                    </label>
                    <span id="activeFormatBadge" class="text-[11px] text-sky-600 dark:text-cyan-400 font-bold uppercase tracking-wide">JPEG (.jpg)</span>
                  </div>
                  <div class="grid grid-cols-4 gap-2 text-xs">
                    <button type="button" id="fmtBtnAuto" onclick="setResizerFormat('auto')" class="format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-sky-600 text-white border-sky-600 shadow-sm">Auto</button>
                    <button type="button" id="fmtBtnJpeg" onclick="setResizerFormat('image/jpeg')" class="format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-[#E5E7EB] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">JPG</button>
                    <button type="button" id="fmtBtnWebp" onclick="setResizerFormat('image/webp')" class="format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-[#E5E7EB] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">WebP</button>
                    <button type="button" id="fmtBtnPng" onclick="setResizerFormat('image/png')" class="format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-[#E5E7EB] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">PNG</button>
                  </div>

                  <!-- Transparency Handling Container -->
                  <div id="resizerTransparencyArea" class="space-y-2 pt-1">
                    <!-- JPEG Notice and Fill Buttons -->
                    <div id="resizerJpegBgBox" class="hidden p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 space-y-2">
                      <div class="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-200">
                        <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> JPEG does not support transparency
                      </div>
                      <p class="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                        Transparent areas will be rendered with a solid background fill. (Select <strong>WebP</strong> or <strong>PNG</strong> to keep transparent backgrounds).
                      </p>
                      <div class="flex items-center gap-2 pt-1">
                        <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Background Fill:</span>
                        <button type="button" id="bgBtnWhite" onclick="setResizerJpegBg('white')" class="px-2.5 py-1 text-xs rounded-lg font-bold border bg-sky-600 text-white border-sky-600 shadow-xs">White (Default)</button>
                        <button type="button" id="bgBtnBlack" onclick="setResizerJpegBg('black')" class="px-2.5 py-1 text-xs rounded-lg font-bold border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600">Black</button>
                      </div>
                    </div>

                    <!-- Transparency Preserved Badge -->
                    <div id="resizerTransparencyPreservedBox" class="hidden p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
                      <i class="fa-solid fa-circle-check text-emerald-600 shrink-0"></i>
                      <span id="transparencyPreservedMsg">Alpha transparency is fully preserved in export.</span>
                    </div>

                    <!-- Animated GIF Warning Notice -->
                    <div id="resizerGifNotice" class="hidden p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                      <div class="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-200">
                        <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Animated GIF detected
                      </div>
                      <p class="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                        Only the first frame will be exported. Animation will not be preserved.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 2. Target File Size (Presets + Custom) -->
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <label class="font-bold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <i class="fa-solid fa-bullseye text-sky-600 dark:text-cyan-400"></i> Target File Size
                    </label>
                    <span class="text-[11px] text-slate-400 font-medium">Presets or Custom</span>
                  </div>
                  <!-- Quick Preset Chips -->
                  <div class="grid grid-cols-4 gap-2 text-xs">
                    <button type="button" onclick="setTargetKB(20)" class="preset-btn px-2 py-2 bg-white dark:bg-slate-700 hover:bg-sky-600 hover:text-white text-slate-800 dark:text-white rounded-xl font-bold border border-[#E5E7EB] dark:border-slate-600 transition-all text-center shadow-sm">20 KB</button>
                    <button type="button" onclick="setTargetKB(50)" class="preset-btn px-2 py-2 bg-white dark:bg-slate-700 hover:bg-sky-600 hover:text-white text-slate-800 dark:text-white rounded-xl font-bold border border-[#E5E7EB] dark:border-slate-600 transition-all text-center shadow-sm">50 KB</button>
                    <button type="button" onclick="setTargetKB(100)" class="preset-btn px-2 py-2 bg-white dark:bg-slate-700 hover:bg-sky-600 hover:text-white text-slate-800 dark:text-white rounded-xl font-bold border border-[#E5E7EB] dark:border-slate-600 transition-all text-center shadow-sm">100 KB</button>
                    <button type="button" onclick="setTargetKB(200)" class="preset-btn px-2 py-2 bg-white dark:bg-slate-700 hover:bg-sky-600 hover:text-white text-slate-800 dark:text-white rounded-xl font-bold border border-[#E5E7EB] dark:border-slate-600 transition-all text-center shadow-sm">200 KB</button>
                  </div>
                  <!-- Custom Size Input Box -->
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                      <input type="number" id="customTargetKB" min="5" max="50000" placeholder="Type custom size (e.g. 35, 75, 150)" onkeydown="if(event.key==='Enter'){event.preventDefault();applyCustomTargetKB();}" class="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-400">
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KB</span>
                    </div>
                    <button type="button" onclick="applyCustomTargetKB()" class="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5 active:scale-95">
                      <i class="fa-solid fa-check"></i> Set Size
                    </button>
                  </div>
                </div>

                <!-- 3. Compression Quality Slider (Active for JPEG & WebP) -->
                <div id="qualityControlSection" class="space-y-1.5">
                  <div class="flex justify-between items-center mb-1.5">
                    <label class="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Compression Quality</label>
                    <span id="qualityVal" class="font-bold text-sm text-sky-600 dark:text-cyan-400">80%</span>
                  </div>
                  <input type="range" id="qualityRange" min="10" max="100" value="80" oninput="debouncedProcessResizer()" class="w-full h-2.5 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-600">
                  <p class="text-[11px] text-slate-400">Lower quality = smaller file size. 75–85% recommended for clean clarity.</p>
                </div>

                <!-- PNG Lossless Info Notice (shown when PNG is selected) -->
                <div id="pngLosslessNotice" class="hidden p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 space-y-1">
                  <div class="font-bold flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
                    <i class="fa-solid fa-circle-info text-blue-600"></i> Lossless PNG Compression
                  </div>
                  <p class="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                    PNG files use lossless compression (canvas quality parameters are ignored by browser engines). To reduce PNG file weight, adjust pixel dimensions below, or choose <strong>WebP</strong> for high-efficiency lossy compression with transparency.
                  </p>
                </div>

                <!-- 4. Dimension Resizing -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Resize Dimensions (px)</label>
                    <button type="button" id="aspectRatioLock" onclick="toggleAspectLock()" class="text-xs text-sky-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                      <i id="aspectLockIcon" class="fa-solid fa-lock text-[10px]"></i> Keep Aspect Ratio
                    </button>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span class="text-[11px] font-semibold text-slate-500 mb-1 block">Width</span>
                      <input type="number" id="resizerWidth" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm" oninput="handleWidthChange()">
                    </div>
                    <div>
                      <span class="text-[11px] font-semibold text-slate-500 mb-1 block">Height</span>
                      <input type="number" id="resizerHeight" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm" oninput="handleHeightChange()">
                    </div>
                  </div>
                </div>

                <!-- 5. Download Button -->
                <button type="button" id="downloadCompressedBtn" onclick="downloadCompressedImg()" class="w-full py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5">
                  <i class="fa-solid fa-download text-lg"></i> Download Compressed Image
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function toggleAspectLock() {
      isAspectLocked = !isAspectLocked;
      const icon = document.getElementById('aspectLockIcon');
      if (icon) {
        icon.className = isAspectLocked ? 'fa-solid fa-lock text-[10px]' : 'fa-solid fa-lock-open text-[10px] text-slate-400';
      }
      showToast(isAspectLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked', 'info');
    }

    function handleWidthChange() {
      if (isAspectLocked && imgRatio && loadedResizerImg) {
        const w = parseInt(document.getElementById('resizerWidth').value) || loadedResizerImg.naturalWidth;
        document.getElementById('resizerHeight').value = Math.max(1, Math.round(w / imgRatio));
      }
      debouncedProcessResizer();
    }

    function handleHeightChange() {
      if (isAspectLocked && imgRatio && loadedResizerImg) {
        const h = parseInt(document.getElementById('resizerHeight').value) || loadedResizerImg.naturalHeight;
        document.getElementById('resizerWidth').value = Math.max(1, Math.round(h * imgRatio));
      }
      debouncedProcessResizer();
    }

    function debouncedProcessResizer() {
      if (resizerDebounceTimer) clearTimeout(resizerDebounceTimer);
      resizerDebounceTimer = setTimeout(() => {
        resizerDebounceTimer = null;
        processResizer();
      }, 50);
    }

    function setResizerFormat(format) {
      resizerOutputFormat = format;
      syncResizerFormatUI();
      processResizer();
    }

    function setResizerJpegBg(color) {
      resizerJpegBg = color === 'black' ? 'black' : 'white';
      syncResizerFormatUI();
      processResizer();
    }

    function syncResizerFormatUI() {
      const effectiveMime = getEffectiveResizerMime();
      const badge = document.getElementById('activeFormatBadge');
      if (badge) {
        if (effectiveMime === 'image/webp') badge.innerText = 'WebP (.webp)';
        else if (effectiveMime === 'image/png') badge.innerText = 'PNG (.png)';
        else badge.innerText = 'JPEG (.jpg)';
      }

      // Update format pill buttons
      const pills = [
        { id: 'fmtBtnAuto', active: resizerOutputFormat === 'auto' },
        { id: 'fmtBtnJpeg', active: resizerOutputFormat === 'image/jpeg' },
        { id: 'fmtBtnWebp', active: resizerOutputFormat === 'image/webp' },
        { id: 'fmtBtnPng', active: resizerOutputFormat === 'image/png' }
      ];
      pills.forEach(p => {
        const el = document.getElementById(p.id);
        if (el) {
          if (p.active) {
            el.className = 'format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-sky-600 text-white border-sky-600 shadow-sm';
          } else {
            el.className = 'format-pill-btn px-2 py-2 rounded-xl font-bold border transition-all text-center bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-[#E5E7EB] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600';
          }
        }
      });

      // Transparency handling UI
      const jpegBox = document.getElementById('resizerJpegBgBox');
      const preservedBox = document.getElementById('resizerTransparencyPreservedBox');
      const preservedMsg = document.getElementById('transparencyPreservedMsg');
      const qualitySec = document.getElementById('qualityControlSection');
      const pngNotice = document.getElementById('pngLosslessNotice');

      if (effectiveMime === 'image/jpeg') {
        if (resizerInputHasTransparency && jpegBox) {
          jpegBox.classList.remove('hidden');
        } else if (jpegBox) {
          jpegBox.classList.add('hidden');
        }
        if (preservedBox) preservedBox.classList.add('hidden');
        if (qualitySec) qualitySec.classList.remove('hidden');
        if (pngNotice) pngNotice.classList.add('hidden');
      } else if (effectiveMime === 'image/webp') {
        if (jpegBox) jpegBox.classList.add('hidden');
        if (resizerInputHasTransparency && preservedBox) {
          if (preservedMsg) preservedMsg.innerText = 'Alpha transparency is fully preserved in WebP export.';
          preservedBox.classList.remove('hidden');
        } else if (preservedBox) {
          preservedBox.classList.add('hidden');
        }
        if (qualitySec) qualitySec.classList.remove('hidden');
        if (pngNotice) pngNotice.classList.add('hidden');
      } else if (effectiveMime === 'image/png') {
        if (jpegBox) jpegBox.classList.add('hidden');
        if (resizerInputHasTransparency && preservedBox) {
          if (preservedMsg) preservedMsg.innerText = 'Alpha transparency is fully preserved in PNG export.';
          preservedBox.classList.remove('hidden');
        } else if (preservedBox) {
          preservedBox.classList.add('hidden');
        }
        if (qualitySec) qualitySec.classList.add('hidden');
        if (pngNotice) pngNotice.classList.remove('hidden');
      }

      // Update White/Black background button states
      const btnWhite = document.getElementById('bgBtnWhite');
      const btnBlack = document.getElementById('bgBtnBlack');
      if (btnWhite) {
        btnWhite.className = `px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${resizerJpegBg === 'white' ? 'bg-sky-600 text-white border-sky-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}`;
      }
      if (btnBlack) {
        btnBlack.className = `px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${resizerJpegBg === 'black' ? 'bg-sky-600 text-white border-sky-600 shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}`;
      }

      // Animated GIF Warning Notice
      const isGif = Boolean(originalResizerFile && (
        (originalResizerFile.type && /gif/i.test(originalResizerFile.type)) ||
        (/\.gif$/i.test(originalResizerFile.name || ''))
      ));
      const gifNotice = document.getElementById('resizerGifNotice');
      if (gifNotice) {
        if (isGif) {
          gifNotice.classList.remove('hidden');
        } else {
          gifNotice.classList.add('hidden');
        }
      }
    }

    function showResizerError(msg) {
      const errBox = document.getElementById('resizerErrorBox');
      const errText = document.getElementById('resizerErrorMsg');
      if (errBox && errText) {
        errText.innerText = msg;
        errBox.classList.remove('hidden');
      } else {
        showToast(msg, 'error');
      }
    }

    function clearResizerError() {
      const errBox = document.getElementById('resizerErrorBox');
      if (errBox) errBox.classList.add('hidden');
    }

    function resetResizerToUpload() {
      cleanupResizerBlob();
      loadedResizerImg = null;
      originalResizerFile = null;
      resizerInputHasTransparency = false;
      clearResizerError();
      const gifNotice = document.getElementById('resizerGifNotice');
      if (gifNotice) gifNotice.classList.add('hidden');
      const input = document.getElementById('resizerInput');
      if (input) input.value = '';
      const dropZone = document.getElementById('resizerDropZone');
      const controls = document.getElementById('resizerControls');
      if (dropZone) dropZone.classList.remove('hidden');
      if (controls) controls.classList.add('hidden');
    }

    function handleResizerImage(input) {
      clearResizerError();
      cleanupResizerBlob();
      if (!input || !input.files || input.files.length === 0) return;
      const file = input.files[0];

      // 1. Empty file validation
      if (!file || file.size === 0) {
        showResizerError("The selected file is empty (0 bytes). Please choose a valid image file.");
        input.value = '';
        return;
      }

      // 2. Oversized image validation (50MB)
      if (file.size > 50 * 1024 * 1024) {
        showResizerError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). The maximum supported file size is 50 MB.`);
        input.value = '';
        return;
      }

      // 3. Supported formats check
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/x-icon', 'image/svg+xml'];
      const ext = file.name.split('.').pop().toLowerCase();
      const validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
      if (file.type && !supportedTypes.includes(file.type.toLowerCase()) && !validExts.includes(ext)) {
        showResizerError(`Unsupported file format (${file.type || ext}). Please upload a JPG, PNG, WebP, GIF, or BMP image.`);
        input.value = '';
        return;
      }

      originalResizerFile = file;

      const fileNameEl = document.getElementById('selectedFileName');
      if (fileNameEl) {
        const sizeDisplay = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;
        fileNameEl.innerText = `${file.name} (${sizeDisplay})`;
      }

      const reader = new FileReader();
      reader.onerror = function() {
        showResizerError("Failed to read the selected file from disk. Please try again.");
        input.value = '';
      };

      reader.onload = function(e) {
        const img = new Image();
        img.onerror = function() {
          showResizerError("Unable to decode image. The file may be corrupted, truncated, or in an unsupported codec.");
          input.value = '';
        };

        img.onload = function() {
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            showResizerError("Invalid image dimensions (0x0). The image could not be rendered.");
            input.value = '';
            return;
          }

          loadedResizerImg = img;
          imgRatio = img.naturalWidth / img.naturalHeight;
          resizerInputHasTransparency = detectImageTransparency(img);

          // Reveal controls, hide dropzone
          const dropZone = document.getElementById('resizerDropZone');
          const controls = document.getElementById('resizerControls');
          if (dropZone) dropZone.classList.add('hidden');
          if (controls) controls.classList.remove('hidden');

          const widthInput = document.getElementById('resizerWidth');
          const heightInput = document.getElementById('resizerHeight');
          if (widthInput) widthInput.value = img.naturalWidth;
          if (heightInput) heightInput.value = img.naturalHeight;

          const origSizeEl = document.getElementById('originalSize');
          if (origSizeEl) {
            origSizeEl.innerText = file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              : `${(file.size / 1024).toFixed(1)} KB`;
          }

          const metaBadge = document.getElementById('resizerMetaBadge');
          if (metaBadge) {
            metaBadge.innerText = `${img.naturalWidth} × ${img.naturalHeight} px`;
          }

          syncResizerFormatUI();
          processResizer();
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }

    function commitResizerBlob(blob, opId) {
      if (opId !== resizerOpSeq || !loadedResizerImg) return false;

      const newBlobUrl = createResizerBlobUrl(blob);
      if (opId !== resizerOpSeq || !loadedResizerImg) {
        revokeResizerBlobUrl(newBlobUrl);
        return false;
      }

      resizerCurrentBlob = blob;
      resizerCurrentBlobUrl = newBlobUrl;

      const preview = document.getElementById('resizerPreview');
      if (preview) {
        const onPreviewDone = () => {
          // Safely revoke older URLs only when the current new preview has completed loading
          if (resizerCurrentBlobUrl === newBlobUrl) {
            revokeAllResizerBlobUrlsExcept(newBlobUrl);
          }
        };
        preview.onload = onPreviewDone;
        preview.onerror = onPreviewDone;
        preview.src = newBlobUrl;
      } else {
        revokeAllResizerBlobUrlsExcept(newBlobUrl);
      }

      const sizeInBytes = blob.size;
      const sizeKb = (sizeInBytes / 1024).toFixed(1);
      const compEl = document.getElementById('compressedSize');
      if (compEl) {
        compEl.innerText = sizeInBytes > 1024 * 1024
          ? `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
          : `${sizeKb} KB`;
      }

      if (originalResizerFile && originalResizerFile.size > 0) {
        const savedPercent = Math.round((1 - (sizeInBytes / originalResizerFile.size)) * 100);
        const badge = document.getElementById('savingsBadge');
        if (badge) {
          badge.innerText = savedPercent >= 0 ? `-${savedPercent}%` : `+${Math.abs(savedPercent)}%`;
          badge.className = savedPercent >= 0
            ? 'text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-300'
            : 'text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400';
        }
      }

      clearResizerError();
      return true;
    }

    async function processResizer(parentOpId) {
      if (!loadedResizerImg) return;
      const opId = (parentOpId !== undefined) ? parentOpId : ++resizerOpSeq;
      if (opId !== resizerOpSeq || !loadedResizerImg) return;

      const mimeType = getEffectiveResizerMime();
      const qualityVal = (parseInt(document.getElementById('qualityRange')?.value) || 80) / 100;
      const qualityDisplay = document.getElementById('qualityVal');
      if (qualityDisplay) qualityDisplay.innerText = `${Math.round(qualityVal * 100)}%`;

      const w = parseInt(document.getElementById('resizerWidth')?.value) || loadedResizerImg.naturalWidth;
      const h = parseInt(document.getElementById('resizerHeight')?.value) || loadedResizerImg.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = resizerJpegBg === 'black' ? '#000000' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(loadedResizerImg, 0, 0, canvas.width, canvas.height);

      try {
        const blob = await getCanvasBlob(canvas, mimeType, qualityVal);
        if (opId !== resizerOpSeq || !loadedResizerImg) return;
        commitResizerBlob(blob, opId);
      } catch (err) {
        if (opId !== resizerOpSeq || !loadedResizerImg) return;
        console.error('Compression processing error:', err);
        showResizerError('Canvas compression failed. Your browser may have run out of canvas memory for these dimensions. Try reducing the width and height.');
      }
    }

    function applyCustomTargetKB() {
      const input = document.getElementById('customTargetKB');
      const val = parseFloat(input ? input.value : 0);
      if (!val || val <= 0) {
        showToast('Please enter a valid target size (e.g. 50 KB)', 'warning');
        return;
      }
      setTargetKB(val);
    }

    async function setTargetKB(targetKB) {
      if (!loadedResizerImg) {
        showToast('Please upload an image first', 'warning');
        return;
      }
      targetKB = parseFloat(targetKB);
      if (!targetKB || targetKB <= 0) {
        showToast('Please enter a valid target size in KB', 'warning');
        return;
      }

      const customInput = document.getElementById('customTargetKB');
      if (customInput) customInput.value = targetKB;

      // Invalidate pending debounce and any prior async operation
      clearTimeout(resizerDebounceTimer);
      resizerDebounceTimer = null;
      const opId = ++resizerOpSeq;

      const targetBytes = Math.floor(targetKB * 1024);
      // Small safety margin (2%, 256-1024 bytes) below target to absorb encoding variations
      const safetyMargin = Math.max(256, Math.min(1024, Math.round(targetBytes * 0.02)));
      const safeTargetBytes = Math.max(256, targetBytes - safetyMargin);

      const naturalW = loadedResizerImg.naturalWidth;
      const naturalH = loadedResizerImg.naturalHeight;
      const ratio = naturalW / naturalH;
      const minDim = 20;
      const minDimW = naturalW >= naturalH ? Math.max(minDim, Math.round(minDim * ratio)) : minDim;
      const minDimH = naturalH > naturalW ? Math.max(minDim, Math.round(minDim / ratio)) : minDim;
      const effectiveMime = getEffectiveResizerMime();

      showToast(`Optimizing for target \u2264 ${targetKB} KB...`, 'info');

      async function renderCanvasToBlob(w, h, mime, q) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, w);
        canvas.height = Math.max(1, h);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (mime === 'image/jpeg') {
          ctx.fillStyle = resizerJpegBg === 'black' ? '#000000' : '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(loadedResizerImg, 0, 0, canvas.width, canvas.height);
        return await getCanvasBlob(canvas, mime, q);
      }

      try {
        let bestW = naturalW;
        let bestH = naturalH;
        let bestQ = 0.80;
        let bestBlob = null;

        if (effectiveMime === 'image/png') {
          // PNG is lossless: canvas quality parameter is not supported; reduce dimensions progressively
          const testBlobFull = await renderCanvasToBlob(naturalW, naturalH, 'image/png');
          if (opId !== resizerOpSeq || !loadedResizerImg) return;
          if (getEffectiveResizerMime() !== 'image/png') return;

          if (testBlobFull.size <= safeTargetBytes) {
            bestBlob = testBlobFull;
          } else {
            // Check minimum dimensions to verify feasibility
            const minBlob = await renderCanvasToBlob(minDimW, minDimH, 'image/png');
            if (opId !== resizerOpSeq || !loadedResizerImg) return;
            if (getEffectiveResizerMime() !== 'image/png') return;

            if (minBlob.size > targetBytes) {
              const minKB = (minBlob.size / 1024).toFixed(1);
              showToast(`PNG target of ${targetKB} KB cannot be reached (minimum size: ${minKB} KB). Switch to WebP or JPEG for smaller files.`, 'error');
              showResizerError(`PNG target of ${targetKB} KB cannot be reached. Minimum possible output is ${minKB} KB.`);
              return;
            }

            // Binary search scale between minScale and 1.0 to find largest dimensions <= safeTargetBytes
            let lowScale = minDimW / naturalW;
            let highScale = 1.0;
            bestW = minDimW;
            bestH = minDimH;
            bestBlob = minBlob;

            for (let i = 0; i < 8; i++) {
              if (opId !== resizerOpSeq || !loadedResizerImg) return;
              if (getEffectiveResizerMime() !== 'image/png') return;

              const midScale = (lowScale + highScale) / 2;
              const testW = Math.max(minDimW, Math.round(naturalW * midScale));
              const testH = Math.max(minDimH, Math.round(naturalH * midScale));

              const testBlob = await renderCanvasToBlob(testW, testH, 'image/png');
              if (opId !== resizerOpSeq || !loadedResizerImg) return;
              if (getEffectiveResizerMime() !== 'image/png') return;

              if (testBlob.size <= safeTargetBytes) {
                bestW = testW;
                bestH = testH;
                bestBlob = testBlob;
                lowScale = midScale; // try larger dimensions
              } else {
                highScale = midScale; // shrink dimensions
              }
            }
          }
        } else {
          // JPEG & WebP: first reduce quality where supported, then progressively reduce dimensions
          const minQ = 0.08;
          const maxQ = 0.95;

          // Step 1: Test minimum quality at natural dimensions
          const testBlobMinQ = await renderCanvasToBlob(naturalW, naturalH, effectiveMime, minQ);
          if (opId !== resizerOpSeq || !loadedResizerImg) return;
          if (getEffectiveResizerMime() !== effectiveMime) return;

          if (testBlobMinQ.size <= safeTargetBytes) {
            // Target reachable at natural dimensions! Find highest quality that stays <= safeTargetBytes
            const testBlobMaxQ = await renderCanvasToBlob(naturalW, naturalH, effectiveMime, maxQ);
            if (opId !== resizerOpSeq || !loadedResizerImg) return;
            if (getEffectiveResizerMime() !== effectiveMime) return;

            if (testBlobMaxQ.size <= safeTargetBytes) {
              bestQ = maxQ;
              bestBlob = testBlobMaxQ;
            } else {
              let lowQ = minQ, highQ = maxQ;
              bestQ = minQ;
              bestBlob = testBlobMinQ;
              for (let i = 0; i < 7; i++) {
                if (opId !== resizerOpSeq || !loadedResizerImg) return;
                if (getEffectiveResizerMime() !== effectiveMime) return;

                const midQ = (lowQ + highQ) / 2;
                const testBlob = await renderCanvasToBlob(naturalW, naturalH, effectiveMime, midQ);
                if (opId !== resizerOpSeq || !loadedResizerImg) return;
                if (getEffectiveResizerMime() !== effectiveMime) return;

                if (testBlob.size <= safeTargetBytes) {
                  bestQ = midQ;
                  bestBlob = testBlob;
                  lowQ = midQ;
                } else {
                  highQ = midQ;
                }
              }
            }
          } else {
            // Quality at natural dimensions alone cannot reach target.
            // Progressively reduce dimensions until actual Blob size is within target.
            let curScale = Math.min(0.92, Math.sqrt(safeTargetBytes / testBlobMinQ.size) * 0.95);
            let curW = Math.max(minDimW, Math.round(naturalW * curScale));
            let curH = Math.max(minDimH, Math.round(naturalH * curScale));
            let scaleBlob = null;

            while (curW >= minDimW && curH >= minDimH) {
              if (opId !== resizerOpSeq || !loadedResizerImg) return;
              if (getEffectiveResizerMime() !== effectiveMime) return;

              scaleBlob = await renderCanvasToBlob(curW, curH, effectiveMime, minQ);
              if (opId !== resizerOpSeq || !loadedResizerImg) return;
              if (getEffectiveResizerMime() !== effectiveMime) return;

              if (scaleBlob.size <= safeTargetBytes) {
                bestW = curW;
                bestH = curH;
                bestQ = minQ;
                bestBlob = scaleBlob;
                break;
              }

              if (curW === minDimW && curH === minDimH) {
                bestW = curW;
                bestH = curH;
                bestQ = minQ;
                bestBlob = scaleBlob;
                break;
              }

              const nextScale = Math.min(curScale * 0.85, Math.sqrt(safeTargetBytes / scaleBlob.size) * 0.95);
              curScale = nextScale;
              const nextW = Math.max(minDimW, Math.round(naturalW * curScale));
              const nextH = Math.max(minDimH, Math.round(naturalH * curScale));
              if (nextW === curW && nextH === curH) {
                curW = Math.max(minDimW, curW - 5);
                curH = Math.max(minDimH, Math.round(curW / ratio));
                curScale = curW / naturalW;
              } else {
                curW = nextW;
                curH = nextH;
              }
            }

            // If dimensions are valid and > minDim, optimize quality upwards
            if (bestBlob && bestBlob.size <= safeTargetBytes && bestW > minDimW) {
              let lowQ = minQ, highQ = 0.92;
              for (let i = 0; i < 6; i++) {
                if (opId !== resizerOpSeq || !loadedResizerImg) return;
                if (getEffectiveResizerMime() !== effectiveMime) return;

                const midQ = (lowQ + highQ) / 2;
                const testBlob = await renderCanvasToBlob(bestW, bestH, effectiveMime, midQ);
                if (opId !== resizerOpSeq || !loadedResizerImg) return;
                if (getEffectiveResizerMime() !== effectiveMime) return;

                if (testBlob.size <= safeTargetBytes) {
                  bestQ = midQ;
                  bestBlob = testBlob;
                  lowQ = midQ;
                } else {
                  highQ = midQ;
                }
              }
            }
          }
        }

        // Final strict verification: ensure bestBlob strictly satisfies targetBytes
        if (!bestBlob || bestBlob.size > targetBytes) {
          let adjustAttempts = 0;
          while (bestBlob && bestBlob.size > targetBytes && adjustAttempts < 6) {
            adjustAttempts++;
            if (effectiveMime !== 'image/png' && bestQ > 0.12) {
              bestQ = Math.max(0.05, bestQ - 0.08);
            } else {
              bestW = Math.max(minDimW, Math.round(bestW * 0.88));
              bestH = Math.max(minDimH, Math.round(bestH * 0.88));
            }
            bestBlob = await renderCanvasToBlob(bestW, bestH, effectiveMime, bestQ);
            if (opId !== resizerOpSeq || !loadedResizerImg) return;
          }
        }

        // Hard check: NEVER claim success if actual size exceeds target
        if (!bestBlob || bestBlob.size > targetBytes) {
          const actualKB = bestBlob ? (bestBlob.size / 1024).toFixed(1) : 0;
          showToast(`Target of ${targetKB} KB could not be reached (minimum achieved: ${actualKB} KB). Try a larger target or different format.`, 'error');
          showResizerError(`Target of ${targetKB} KB could not be reached. Minimum possible output is ${actualKB} KB.`);
          return;
        }

        // Target achieved: update UI inputs
        const widthInput = document.getElementById('resizerWidth');
        const heightInput = document.getElementById('resizerHeight');
        const qualityRange = document.getElementById('qualityRange');
        const qualityVal = document.getElementById('qualityVal');

        if (widthInput) widthInput.value = bestW;
        if (heightInput) heightInput.value = bestH;
        if (qualityRange && effectiveMime !== 'image/png') {
          qualityRange.value = Math.round(bestQ * 100);
        }
        if (qualityVal && effectiveMime !== 'image/png') {
          qualityVal.innerText = `${Math.round(bestQ * 100)}%`;
        }

        // Commit verified blob to preview and download
        const committed = commitResizerBlob(bestBlob, opId);
        if (!committed) return;

        const finalKB = (bestBlob.size / 1024).toFixed(1);
        showToast(`Optimized: ${finalKB} KB (Target: \u2264 ${targetKB} KB)`, 'success');
      } catch (err) {
        if (opId !== resizerOpSeq || !loadedResizerImg) return;
        console.error('Target KB optimization error:', err);
        showResizerError('Failed to optimize for target KB. Please try manually adjusting dimensions or quality.');
      }
    }

    function downloadCompressedImg() {
      if (!resizerCurrentBlobUrl && !loadedResizerImg) {
        showToast('Please upload an image first', 'warning');
        return;
      }
      if (!resizerCurrentBlobUrl) {
        showToast('Image is still processing, please wait...', 'info');
        return;
      }
      const effectiveMime = getEffectiveResizerMime();
      let ext = 'jpg';
      if (effectiveMime === 'image/webp') ext = 'webp';
      else if (effectiveMime === 'image/png') ext = 'png';

      const origName = (originalResizerFile && originalResizerFile.name)
        ? originalResizerFile.name.replace(/\.[^/.]+$/, "")
        : "image";

      const a = document.createElement('a');
      a.href = resizerCurrentBlobUrl;
      a.download = `compressed-${origName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Image downloaded as .${ext.toUpperCase()}!`, 'success');
      triggerConfetti();
    }

    /* ================= UTILITY 2: AI & SMART BACKGROUND REMOVER ================= */
    let loadedBgImg = null;
    let bgTargetColor = { r: 255, g: 255, b: 255 };
    let bgEyedropperActive = false;
    let bgBrushActive = false;
    let bgBrushMode = 'erase';
    let bgBrushSize = 25;
    let bgIsMouseDown = false;
    let bgOriginalImageData = null;
    let bgReplacementMode = 'transparent';
    let bgCustomColor = '#2563eb';

    function renderBgRemover(title, icon, container) {
      if (title) title.innerText = 'AI Background Remover & Transparent Cutout Studio';
      if (icon) icon.className = 'fa-solid fa-wand-magic-sparkles';
      container.innerHTML = `
        <div class="space-y-6">
          <div id="bgDropZone" class="relative border-2 border-dashed border-violet-400 dark:border-violet-500 hover:border-violet-600 dark:hover:border-violet-400 bg-gradient-to-b from-violet-50/70 via-white to-violet-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-violet-500/5 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] group">
            <input type="file" id="bgInput" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="processBgRemover(this)">
            <div class="w-20 h-20 rounded-3xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-md">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 group-hover:scale-[1.02] transition-all">
              <i class="fa-solid fa-folder-open"></i> Choose Photo to Remove Background
            </span>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Drag and drop any portrait, product photo, or signature</p>
            <p class="text-[11px] text-slate-400 mt-2">Smart auto-sampling • Interactive color dropper • Touch-up brush • 100% private in-browser</p>
          </div>

          <div id="bgResults" class="hidden space-y-6">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Color:</span>
                  <div id="targetColorPreview" class="w-6 h-6 rounded-lg border border-slate-300 shadow-2xs" style="background:#ffffff"></div>
                  <button type="button" id="eyedropperBtn" onclick="toggleEyedropper()" class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-slate-600 text-xs font-bold transition-all flex items-center gap-1.5">
                    <i class="fa-solid fa-eye-dropper"></i> Click on Photo to Pick Color
                  </button>
                </div>
                <button type="button" onclick="document.getElementById('bgInput').click()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors">
                  <i class="fa-solid fa-arrow-rotate-left"></i> Change Photo
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div class="space-y-1.5">
                  <div class="flex justify-between">
                    <span>Sensitivity / Tolerance:</span>
                    <span id="toleranceVal" class="font-mono font-bold text-violet-600 dark:text-violet-400">38</span>
                  </div>
                  <input type="range" id="bgTolerance" min="5" max="95" value="38" oninput="reprocessBg()" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-violet-600 cursor-pointer">
                  <p class="text-[10px] text-slate-400">Increase to erase more matching shades, decrease to preserve details</p>
                </div>
                <div class="space-y-1.5">
                  <div class="flex justify-between">
                    <span>Edge Smoothing / Feather:</span>
                    <span id="featherVal" class="font-mono font-bold text-violet-600 dark:text-violet-400">2 px</span>
                  </div>
                  <input type="range" id="bgFeather" min="0" max="8" value="2" oninput="reprocessBg()" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-violet-600 cursor-pointer">
                  <p class="text-[10px] text-slate-400">Softens boundary edges to remove jagged pixel borders</p>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2 flex-wrap text-xs">
                  <span class="font-bold text-slate-500 dark:text-slate-400">Backdrop:</span>
                  <button type="button" onclick="setBgReplacement('transparent')" id="btnBgTrans" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-violet-600 text-white shadow-xs">Transparent</button>
                  <button type="button" onclick="setBgReplacement('white')" id="btnBgWhite" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">White</button>
                  <button type="button" onclick="setBgReplacement('black')" id="btnBgBlack" class="px-2.5 py-1 rounded-lg font-bold text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">Black</button>
                  <input type="color" id="bgCustomPicker" value="#2563eb" onchange="setBgReplacement('custom', this.value)" class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer" title="Custom color">
                </div>

                <div class="flex items-center gap-2 text-xs">
                  <button type="button" id="bgBrushBtn" onclick="toggleBgBrush()" class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 flex items-center gap-1.5">
                    <i class="fa-solid fa-paintbrush"></i> Touch-up Brush
                  </button>
                  <div id="brushSubControls" class="hidden flex items-center gap-2">
                    <select id="brushModeSelect" onchange="bgBrushMode=this.value" class="px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                      <option value="erase">Erase Spots</option>
                      <option value="restore">Restore Subject</option>
                    </select>
                    <input type="range" id="brushSizeSlider" min="8" max="60" value="25" oninput="bgBrushSize=parseInt(this.value)" class="w-16 accent-violet-600" title="Brush Size">
                  </div>
                </div>
              </div>
            </div>

            <div id="bgCanvasWrapper" class="relative p-4 border border-slate-200 dark:border-slate-700 rounded-3xl checkerboard-bg flex justify-center items-center min-h-[320px] max-h-[520px] overflow-auto select-none">
              <canvas id="bgCanvas" class="max-h-[480px] max-w-full object-contain rounded-xl shadow-md cursor-default"></canvas>
            </div>

            <button type="button" onclick="downloadBgPng()" class="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-violet-500/25 transition-all flex items-center justify-center gap-2.5">
              <i class="fa-solid fa-download text-lg"></i> Download High-Resolution Cutout (PNG)
            </button>
          </div>
        </div>
      `;
    }

    function processBgRemover(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          loadedBgImg = new Image();
          loadedBgImg.onload = function() {
            const drop = document.getElementById('bgDropZone');
            const res = document.getElementById('bgResults');
            if (drop) drop.classList.add('hidden');
            if (res) res.classList.remove('hidden');

            const canvas = document.getElementById('bgCanvas');
            canvas.width = loadedBgImg.naturalWidth;
            canvas.height = loadedBgImg.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(loadedBgImg, 0, 0);
            bgOriginalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            autoDetectBgColor();
            initBgCanvasEvents();
            reprocessBg();
            showToast('Photo loaded! Background isolated automatically.', 'success');
          };
          loadedBgImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function autoDetectBgColor() {
      if (!bgOriginalImageData) return;
      const data = bgOriginalImageData.data;
      const w = bgOriginalImageData.width;
      const h = bgOriginalImageData.height;

      const corners = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
      let r = 0, g = 0, b = 0;
      corners.forEach(idx => {
        r += data[idx];
        g += data[idx + 1];
        b += data[idx + 2];
      });

      bgTargetColor = { r: Math.round(r / 4), g: Math.round(g / 4), b: Math.round(b / 4) };
      const preview = document.getElementById('targetColorPreview');
      if (preview) preview.style.background = `rgb(${bgTargetColor.r}, ${bgTargetColor.g}, ${bgTargetColor.b})`;
    }

    function toggleEyedropper() {
      bgEyedropperActive = !bgEyedropperActive;
      const btn = document.getElementById('eyedropperBtn');
      const canvas = document.getElementById('bgCanvas');
      if (bgEyedropperActive) {
        if (btn) btn.className = 'px-3 py-1.5 rounded-xl border border-violet-500 bg-violet-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5';
        if (canvas) canvas.style.cursor = 'crosshair';
        showToast('Click anywhere on the photo to select that color to remove', 'info');
      } else {
        if (btn) btn.className = 'px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-violet-50 flex items-center gap-1.5';
        if (canvas) canvas.style.cursor = 'default';
      }
    }

    function setBgReplacement(mode, customColor) {
      bgReplacementMode = mode;
      if (customColor) bgCustomColor = customColor;

      ['btnBgTrans', 'btnBgWhite', 'btnBgBlack'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200';
      });

      if (mode === 'transparent') {
        document.getElementById('btnBgTrans').className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-violet-600 text-white shadow-xs';
      } else if (mode === 'white') {
        document.getElementById('btnBgWhite').className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-violet-600 text-white shadow-xs';
      } else if (mode === 'black') {
        document.getElementById('btnBgBlack').className = 'px-2.5 py-1 rounded-lg font-bold text-xs bg-violet-600 text-white shadow-xs';
      }
      reprocessBg();
    }

    function toggleBgBrush() {
      bgBrushActive = !bgBrushActive;
      const btn = document.getElementById('bgBrushBtn');
      const sub = document.getElementById('brushSubControls');
      const canvas = document.getElementById('bgCanvas');
      if (bgBrushActive) {
        if (btn) btn.className = 'px-3 py-1.5 rounded-xl border border-violet-500 bg-violet-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5';
        if (sub) sub.classList.remove('hidden');
        if (canvas) canvas.style.cursor = 'crosshair';
      } else {
        if (btn) btn.className = 'px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5';
        if (sub) sub.classList.add('hidden');
        if (canvas) canvas.style.cursor = 'default';
      }
    }

    function initBgCanvasEvents() {
      const canvas = document.getElementById('bgCanvas');
      if (!canvas) return;

      canvas.onmousedown = function(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        if (bgEyedropperActive) {
          const ctx = canvas.getContext('2d');
          const p = ctx.getImageData(x, y, 1, 1).data;
          bgTargetColor = { r: p[0], g: p[1], b: p[2] };
          const preview = document.getElementById('targetColorPreview');
          if (preview) preview.style.background = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
          toggleEyedropper();
          reprocessBg();
          return;
        }

        if (bgBrushActive) {
          bgIsMouseDown = true;
          applyBrushAt(x, y);
        }
      };

      canvas.onmousemove = function(e) {
        if (!bgBrushActive || !bgIsMouseDown) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        applyBrushAt(x, y);
      };

      window.addEventListener('mouseup', () => { bgIsMouseDown = false; });
    }

    function applyBrushAt(cx, cy) {
      const canvas = document.getElementById('bgCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const r = bgBrushSize;

      if (bgBrushMode === 'erase') {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (bgBrushMode === 'restore' && bgOriginalImageData) {
        const imgData = ctx.getImageData(cx - r, cy - r, r * 2, r * 2);
        const origData = bgOriginalImageData.data;
        const w = bgOriginalImageData.width;

        for (let py = 0; py < r * 2; py++) {
          for (let px = 0; px < r * 2; px++) {
            const dist = Math.sqrt((px - r) ** 2 + (py - r) ** 2);
            if (dist <= r) {
              const origX = cx - r + px;
              const origY = cy - r + py;
              if (origX >= 0 && origX < w && origY >= 0 && origY < bgOriginalImageData.height) {
                const srcIdx = (origY * w + origX) * 4;
                const dstIdx = (py * (r * 2) + px) * 4;
                imgData.data[dstIdx] = origData[srcIdx];
                imgData.data[dstIdx + 1] = origData[srcIdx + 1];
                imgData.data[dstIdx + 2] = origData[srcIdx + 2];
                imgData.data[dstIdx + 3] = origData[srcIdx + 3];
              }
            }
          }
        }
        ctx.putImageData(imgData, cx - r, cy - r);
      }
    }

    function reprocessBg() {
      if (!loadedBgImg || !bgOriginalImageData) return;
      const tolElem = document.getElementById('bgTolerance');
      const tolerance = parseInt(tolElem?.value) || 38;
      const featherElem = document.getElementById('bgFeather');
      const feather = parseInt(featherElem?.value) || 2;

      document.getElementById('toleranceVal').innerText = tolerance;
      document.getElementById('featherVal').innerText = feather + ' px';

      const canvas = document.getElementById('bgCanvas');
      const ctx = canvas.getContext('2d');

      const width = canvas.width;
      const height = canvas.height;
      const workData = ctx.createImageData(width, height);
      const src = bgOriginalImageData.data;
      const dst = workData.data;

      const tR = bgTargetColor.r;
      const tG = bgTargetColor.g;
      const tB = bgTargetColor.b;
      const maxDist = tolerance * 2.5;
      const featherDist = (feather + 1) * 15;

      for (let i = 0; i < src.length; i += 4) {
        const r = src[i];
        const g = src[i + 1];
        const b = src[i + 2];
        const a = src[i + 3];

        if (a === 0) {
          dst[i + 3] = 0;
          continue;
        }

        const dist = Math.sqrt((r - tR) ** 2 + (g - tG) ** 2 + (b - tB) ** 2);

        if (dist < maxDist) {
          if (feather > 0 && dist > (maxDist - featherDist)) {
            const alphaFactor = (dist - (maxDist - featherDist)) / featherDist;
            dst[i] = r;
            dst[i + 1] = g;
            dst[i + 2] = b;
            dst[i + 3] = Math.round(a * alphaFactor);
          } else {
            dst[i + 3] = 0;
          }
        } else {
          dst[i] = r;
          dst[i + 1] = g;
          dst[i + 2] = b;
          dst[i + 3] = a;
        }
      }

      ctx.clearRect(0, 0, width, height);

      if (bgReplacementMode !== 'transparent') {
        let fill = '#ffffff';
        if (bgReplacementMode === 'black') fill = '#000000';
        else if (bgReplacementMode === 'custom') fill = bgCustomColor;
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, width, height);
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      tempCanvas.getContext('2d').putImageData(workData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    function downloadBgPng() {
      const canvas = document.getElementById('bgCanvas');
      if (!canvas) return;
      showToast('Generating high-res PNG...', 'info');
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'cutout-transparent-toolshere.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Transparent PNG downloaded successfully!', 'success');
        triggerConfetti();
      }, 100);
    }

    /* ================= UTILITY 3: PDF TO WORD CONVERTER ================= */
    let pdfWordSelectedFile = null;
    let pdfWordExtractedText = '';

    function renderPdfWord(title, icon, container) {
      if (title) title.innerText = 'PDF to Word (.doc) Converter';
      if (icon) icon.className = 'fa-solid fa-file-word';
      container.innerHTML = `
        <div class="space-y-6">
          <div id="pdfWordDropZone" class="relative border-2 border-dashed border-red-400 dark:border-red-500 hover:border-red-600 dark:hover:border-red-400 bg-gradient-to-b from-red-50/70 via-white to-red-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-red-500/5 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] group">
            <input type="file" id="pdfWordInput" accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="handlePdfWordInput(this)">
            <div class="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-md">
              <i class="fa-solid fa-file-word"></i>
            </div>
            <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 group-hover:scale-[1.02] transition-all">
              <i class="fa-solid fa-folder-open"></i> Choose PDF to Convert to Word
            </span>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Converts text, formatting, and pages directly in your browser</p>
            <p id="pdfWordFileInfo" class="text-[11px] text-slate-400 mt-2">100% private client-side processing • Zero server uploads</p>
          </div>

          <div id="pdfWordActiveSection" class="hidden space-y-6">
            <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                <i class="fa-solid fa-file-pdf text-red-500 text-xl"></i>
                <div>
                  <span id="pdfWordFilename" class="block font-bold">document.pdf</span>
                  <span id="pdfWordMeta" class="text-xs text-slate-500 dark:text-slate-400">Loading document pages...</span>
                </div>
              </div>
              <button type="button" onclick="document.getElementById('pdfWordInput').click()" class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">
                Choose Different PDF
              </button>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Extracted Document Preview:</span>
                <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Text Extracted</span>
              </div>
              <div id="pdfWordTextPreview" class="w-full max-h-56 overflow-y-auto p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-sans leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-text"></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button type="button" onclick="downloadPdfAsWordDoc()" class="sm:col-span-2 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-500/25 transition-all flex items-center justify-center gap-2.5">
                <i class="fa-solid fa-download text-lg"></i> Download Word Document (.doc)
              </button>
              <button type="button" onclick="copyPdfExtractedText()" class="py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-600 transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-copy"></i> Copy Text
              </button>
            </div>
          </div>
        </div>
      `;
    }

    async function handlePdfWordInput(input) {
      if (!input.files || !input.files[0]) return;
      pdfWordSelectedFile = input.files[0];
      const filename = pdfWordSelectedFile.name;
      const sizeKB = (pdfWordSelectedFile.size / 1024).toFixed(1);

      document.getElementById('pdfWordFilename').innerText = filename;
      document.getElementById('pdfWordMeta').innerText = `File Size: ${sizeKB} KB • Extracting text...`;
      document.getElementById('pdfWordDropZone').classList.add('hidden');
      document.getElementById('pdfWordActiveSection').classList.remove('hidden');

      const previewBox = document.getElementById('pdfWordTextPreview');
      previewBox.innerText = 'Extracting document text and layout...';

      try {
        const arrayBuffer = await pdfWordSelectedFile.arrayBuffer();
        if (typeof pdfjsLib === 'undefined') {
          previewBox.innerText = 'PDF parser is initializing. Please wait a moment...';
          return;
        }

        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdfDoc.numPages;
        document.getElementById('pdfWordMeta').innerText = `${totalPages} Pages • ${sizeKB} KB`;

        let fullText = '';
        let htmlPages = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          let pageLines = [];
          let currentLine = '';
          let lastY = null;

          for (const item of textContent.items) {
            if (lastY === null || Math.abs(item.transform[5] - lastY) > 5) {
              if (currentLine.trim()) pageLines.push(currentLine.trim());
              currentLine = item.str;
              lastY = item.transform[5];
            } else {
              currentLine += (item.hasEOL ? '\n' : ' ') + item.str;
            }
          }
          if (currentLine.trim()) pageLines.push(currentLine.trim());

          const pageText = pageLines.join('\n');
          fullText += `--- PAGE ${pageNum} ---\n${pageText}\n\n`;
          htmlPages.push(pageLines.map(line => `<p style="margin: 0 0 8pt 0; font-size: 11pt; line-height: 1.4;">${escapeHtml(line)}</p>`).join(''));
        }

        pdfWordExtractedText = fullText;
        window.pdfWordPagesHtml = htmlPages;
        previewBox.innerText = fullText.slice(0, 1500) + (fullText.length > 1500 ? '\n\n[... Content continues in downloaded Word document ...]' : '');
        showToast('Document parsed successfully!', 'success');
      } catch (err) {
        console.error(err);
        previewBox.innerText = 'Notice: Could not parse text directly. Click "Download Word Document" to generate editable draft.';
        pdfWordExtractedText = `Converted Document: ${filename}`;
        window.pdfWordPagesHtml = [`<p>Document: ${escapeHtml(filename)}</p>`];
      }
    }

    function escapeHtml(text) {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    function downloadPdfAsWordDoc() {
      if (!pdfWordSelectedFile) {
        showToast('Please select a PDF file first', 'error');
        return;
      }
      showToast('Generating formatted Microsoft Word document...', 'info');

      setTimeout(() => {
        const pagesHtml = window.pdfWordPagesHtml || [`<p>${escapeHtml(pdfWordExtractedText)}</p>`];
        const bodyContent = pagesHtml.join('<br style="page-break-before:always; clear:both; mso-break-type:section-break">');

        const docTemplate = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${escapeHtml(pdfWordSelectedFile.name)}</title>
  <style>
    @page { size: 8.5in 11.0in; margin: 1.0in; }
    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
    h1 { font-size: 18pt; font-weight: bold; color: #1e3a8a; margin-bottom: 12pt; }
    p { margin-bottom: 8pt; text-align: justify; }
  </style>
</head>
<body>
  <h1>${escapeHtml(pdfWordSelectedFile.name.replace(/\.pdf$/i, ''))}</h1>
  ${bodyContent}
</body>
</html>`;

        const blob = new Blob([docTemplate], { type: 'application/msword;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = pdfWordSelectedFile.name.replace(/\.pdf$/i, '') + '.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Word document downloaded!', 'success');
        triggerConfetti();
      }, 300);
    }

    function copyPdfExtractedText() {
      if (!pdfWordExtractedText) {
        showToast('No text available to copy', 'error');
        return;
      }
      copyText(pdfWordExtractedText);
    }

    /* ================= UTILITY 4: MERGE & SPLIT PDF ================= */
    let mergePdfFiles = [];
    let splitPdfSelectedFile = null;
    let currentPdfToolTab = 'merge';

    function renderPdfMerge(title, icon, container) {
      if (title) title.innerText = 'Merge & Split PDF Studio';
      if (icon) icon.className = 'fa-solid fa-object-group';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex p-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-2xl max-w-md mx-auto">
            <button type="button" id="tabMergeBtn" onclick="switchPdfMergeTab('merge')" class="flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-xs transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-object-group"></i> Merge PDFs
            </button>
            <button type="button" id="tabSplitBtn" onclick="switchPdfMergeTab('split')" class="flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-scissors"></i> Split PDF
            </button>
          </div>

          <div id="pdfMergeSection" class="space-y-6">
            <div id="pdfMergeDropZone" class="relative border-2 border-dashed border-orange-400 dark:border-orange-500 hover:border-orange-600 dark:hover:border-orange-400 bg-gradient-to-b from-orange-50/70 via-white to-orange-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/5 flex flex-col items-center justify-center min-h-[240px] group">
              <input type="file" id="pdfMergeFiles" multiple accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="handleMergeFilesSelected(this)">
              <div class="w-20 h-20 rounded-3xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-md">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/40 group-hover:scale-[1.02] transition-all">
                <i class="fa-solid fa-folder-open"></i> Select PDF Files to Merge
              </span>
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Select two or more PDFs to combine into a single document</p>
              <p id="pdfMergeCount" class="text-[11px] text-slate-400 mt-2">100% private in-browser joiner • Fast download</p>
            </div>

            <div id="mergeFilesContainer" class="hidden space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span id="mergeSummaryCount" class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">0 PDFs Selected</span>
                <button type="button" onclick="document.getElementById('pdfMergeFiles').click()" class="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                  <i class="fa-solid fa-plus"></i> Add More PDFs
                </button>
              </div>

              <div id="mergeFileList" class="space-y-2 max-h-72 overflow-y-auto pr-1"></div>

              <button type="button" onclick="executePdfMerge()" class="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5">
                <i class="fa-solid fa-object-group text-lg"></i> Merge &amp; Download Combined PDF
              </button>
            </div>
          </div>

          <div id="pdfSplitSection" class="hidden space-y-6">
            <div id="pdfSplitDropZone" class="relative border-2 border-dashed border-blue-400 dark:border-blue-500 hover:border-blue-600 dark:hover:border-blue-400 bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/5 flex flex-col items-center justify-center min-h-[240px] group">
              <input type="file" id="pdfSplitInput" accept=".pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="handleSplitFileSelected(this)">
              <div class="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
                <i class="fa-solid fa-scissors"></i>
              </div>
              <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-[1.02] transition-all">
                <i class="fa-solid fa-folder-open"></i> Choose PDF to Split
              </span>
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Extract specific pages or break into individual single-page documents</p>
            </div>

            <div id="splitActiveControls" class="hidden space-y-5">
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span id="splitFileName" class="block font-bold text-sm">document.pdf</span>
                  <span id="splitPageInfo" class="text-xs text-slate-500 dark:text-slate-400">Loading pages...</span>
                </div>
                <button type="button" onclick="document.getElementById('pdfSplitInput').click()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Change PDF
                </button>
              </div>

              <div class="space-y-3">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Split Option:</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="radio" name="splitMode" value="range" checked onchange="updateSplitModeUI()" class="mt-0.5 accent-blue-600">
                    <div>
                      <span class="font-bold block text-slate-800 dark:text-slate-100">Extract Page Range</span>
                      <span class="text-slate-400 text-[11px]">Save selected pages into a new PDF</span>
                    </div>
                  </label>
                  <label class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="radio" name="splitMode" value="all" onchange="updateSplitModeUI()" class="mt-0.5 accent-blue-600">
                    <div>
                      <span class="font-bold block text-slate-800 dark:text-slate-100">Extract All Pages (ZIP)</span>
                      <span class="text-slate-400 text-[11px]">Download every page as an individual file</span>
                    </div>
                  </label>
                </div>
              </div>

              <div id="splitRangeBox" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Enter Pages to Extract (e.g. 1-3, 5):</label>
                <input type="text" id="splitRangeInput" value="1" placeholder="e.g. 1-3, 5" class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-sm font-semibold">
              </div>

              <button type="button" onclick="executePdfSplit()" class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5">
                <i class="fa-solid fa-scissors text-lg"></i> Split &amp; Download PDF
              </button>
            </div>
          </div>
        </div>
      `;
    }

    function switchPdfMergeTab(tab) {
      currentPdfToolTab = tab;
      const mergeSection = document.getElementById('pdfMergeSection');
      const splitSection = document.getElementById('pdfSplitSection');
      const tabMergeBtn = document.getElementById('tabMergeBtn');
      const tabSplitBtn = document.getElementById('tabSplitBtn');

      if (tab === 'merge') {
        mergeSection.classList.remove('hidden');
        splitSection.classList.add('hidden');
        tabMergeBtn.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-xs transition-all flex items-center justify-center gap-2';
        tabSplitBtn.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2';
      } else {
        mergeSection.classList.add('hidden');
        splitSection.classList.remove('hidden');
        tabMergeBtn.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2';
        tabSplitBtn.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 text-white shadow-xs transition-all flex items-center justify-center gap-2';
      }
    }

    function handleMergeFilesSelected(input) {
      if (input.files && input.files.length > 0) {
        const newFiles = Array.from(input.files);
        mergePdfFiles = [...mergePdfFiles, ...newFiles];
        renderMergeFilesList();
        document.getElementById('mergeFilesContainer').classList.remove('hidden');
      }
    }

    function renderMergeFilesList() {
      const container = document.getElementById('mergeFileList');
      const summary = document.getElementById('mergeSummaryCount');
      if (!container || !summary) return;

      summary.innerText = `${mergePdfFiles.length} PDF Documents Selected (Drag or Reorder)`;
      container.innerHTML = '';

      mergePdfFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs';
        item.innerHTML = `
          <div class="flex items-center gap-3 overflow-hidden pr-2">
            <span class="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs shrink-0">${index + 1}</span>
            <div class="truncate">
              <span class="font-bold text-slate-800 dark:text-slate-100 block truncate">${escapeHtml(file.name)}</span>
              <span class="text-[10px] text-slate-400">${(file.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" onclick="moveMergeFile(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-600 dark:text-slate-300" title="Move Up">
              <i class="fa-solid fa-arrow-up text-[10px]"></i>
            </button>
            <button type="button" onclick="moveMergeFile(${index}, 1)" ${index === mergePdfFiles.length - 1 ? 'disabled' : ''} class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-600 dark:text-slate-300" title="Move Down">
              <i class="fa-solid fa-arrow-down text-[10px]"></i>
            </button>
            <button type="button" onclick="removeMergeFile(${index})" class="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center" title="Remove File">
              <i class="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function moveMergeFile(index, dir) {
      const target = index + dir;
      if (target >= 0 && target < mergePdfFiles.length) {
        const temp = mergePdfFiles[index];
        mergePdfFiles[index] = mergePdfFiles[target];
        mergePdfFiles[target] = temp;
        renderMergeFilesList();
      }
    }

    function removeMergeFile(index) {
      mergePdfFiles.splice(index, 1);
      renderMergeFilesList();
      if (mergePdfFiles.length === 0) {
        document.getElementById('mergeFilesContainer').classList.add('hidden');
      }
    }

    async function executePdfMerge() {
      if (mergePdfFiles.length < 2) {
        showToast('Please select at least 2 PDF files to merge', 'error');
        return;
      }

      showToast(`Combining ${mergePdfFiles.length} PDFs in browser...`, 'info');

      try {
        if (typeof PDFLib === 'undefined') {
          await ensureScript('PDFLib');
        }
        if (typeof PDFLib === 'undefined') {
          showToast('PDF engine initializing, please retry...', 'info');
          return;
        }

        const mergedPdf = await PDFLib.PDFDocument.create();

        for (const file of mergePdfFiles) {
          const buffer = await file.arrayBuffer();
          const doc = await PDFLib.PDFDocument.load(buffer);
          const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'merged-document-toolshere.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showToast('Merged PDF downloaded successfully!', 'success');
        triggerConfetti();
      } catch (err) {
        console.error(err);
        showToast('Failed to merge PDFs: ' + err.message, 'error');
      }
    }

    let splitTotalPages = 1;
    async function handleSplitFileSelected(input) {
      if (!input.files || !input.files[0]) return;
      splitPdfSelectedFile = input.files[0];

      document.getElementById('splitFileName').innerText = splitPdfSelectedFile.name;
      document.getElementById('splitPageInfo').innerText = 'Inspecting document pages...';
      document.getElementById('pdfSplitDropZone').classList.add('hidden');
      document.getElementById('splitActiveControls').classList.remove('hidden');

      try {
        const buf = await splitPdfSelectedFile.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(buf);
        splitTotalPages = doc.getPageCount();
        document.getElementById('splitPageInfo').innerText = `Total Pages: ${splitTotalPages} • ${(splitPdfSelectedFile.size / 1024).toFixed(1)} KB`;
        document.getElementById('splitRangeInput').value = `1-${Math.min(splitTotalPages, 3)}`;
      } catch (err) {
        console.error(err);
      }
    }

    function updateSplitModeUI() {
      const mode = document.querySelector('input[name="splitMode"]:checked')?.value;
      const rangeBox = document.getElementById('splitRangeBox');
      if (mode === 'all') {
        rangeBox.classList.add('hidden');
      } else {
        rangeBox.classList.remove('hidden');
      }
    }

    async function executePdfSplit() {
      if (!splitPdfSelectedFile) {
        showToast('Please select a PDF file first', 'error');
        return;
      }

      const mode = document.querySelector('input[name="splitMode"]:checked')?.value || 'range';
      showToast('Processing split operation...', 'info');

      try {
        const buf = await splitPdfSelectedFile.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(buf);
        const total = doc.getPageCount();

        if (mode === 'all') {
          if (typeof JSZip === 'undefined') {
            showToast('ZIP library initializing...', 'info');
            return;
          }
          const zip = new JSZip();
          for (let i = 0; i < total; i++) {
            const singleDoc = await PDFLib.PDFDocument.create();
            const [p] = await singleDoc.copyPages(doc, [i]);
            singleDoc.addPage(p);
            const bytes = await singleDoc.save();
            zip.file(`page-${i + 1}.pdf`, bytes);
          }
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(zipBlob);
          a.download = `split-pages-${splitPdfSelectedFile.name.replace(/\.pdf$/i, '')}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('All pages extracted into ZIP!', 'success');
          triggerConfetti();
        } else {
          const rangeStr = document.getElementById('splitRangeInput').value.trim();
          const pageIndices = parsePageRange(rangeStr, total);

          if (pageIndices.length === 0) {
            showToast('Please enter a valid page range (e.g. 1-3, 5)', 'error');
            return;
          }

          const splitDoc = await PDFLib.PDFDocument.create();
          const copiedPages = await splitDoc.copyPages(doc, pageIndices);
          copiedPages.forEach(p => splitDoc.addPage(p));

          const bytes = await splitDoc.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `extracted-pages-${splitPdfSelectedFile.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('Extracted PDF downloaded!', 'success');
          triggerConfetti();
        }
      } catch (err) {
        console.error(err);
        showToast('Error splitting PDF: ' + err.message, 'error');
      }
    }

    function parsePageRange(rangeStr, maxPages) {
      const indices = [];
      const parts = rangeStr.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [startStr, endStr] = trimmed.split('-');
          const start = Math.max(1, parseInt(startStr) || 1);
          const end = Math.min(maxPages, parseInt(endStr) || maxPages);
          for (let p = start; p <= end; p++) {
            if (!indices.includes(p - 1)) indices.push(p - 1);
          }
        } else {
          const p = parseInt(trimmed);
          if (p >= 1 && p <= maxPages && !indices.includes(p - 1)) {
            indices.push(p - 1);
          }
        }
      }
      return indices.sort((a, b) => a - b);
    }
    /* ================= UTILITY 5: AGE CALCULATOR ================= */
    function renderAgeCalc(title, icon, container) {
      if (title) title.innerText = 'Age & Date of Birth Calculator';
      if (icon) icon.className = 'fa-solid fa-cake-candles';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="p-6 bg-slate-50 dark:bg-slate-700/40 rounded-3xl border border-[#E5E7EB]/80 dark:border-slate-700/80 space-y-4">
            <label class="block font-bold text-sm text-slate-800 dark:text-white">Select Your Date of Birth</label>
            <input type="date" id="dobInput" class="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-base" onchange="calculateAge()">
          </div>

          <div id="ageResults" class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div class="p-4 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-800">
              <span class="block text-xs font-semibold text-blue-600 dark:text-blue-400">Years</span>
              <span id="ageYears" class="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">0</span>
            </div>
            <div class="p-4 bg-cyan-50 dark:bg-cyan-950/60 rounded-2xl border border-cyan-200 dark:border-cyan-800">
              <span class="block text-xs font-semibold text-cyan-600 dark:text-cyan-400">Months</span>
              <span id="ageMonths" class="text-2xl sm:text-3xl font-black text-cyan-700 dark:text-cyan-300">0</span>
            </div>
            <div class="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400">Days</span>
              <span id="ageDays" class="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">0</span>
            </div>
            <div class="p-4 bg-violet-50 dark:bg-violet-950/60 rounded-2xl border border-violet-200 dark:border-violet-800">
              <span class="block text-xs font-semibold text-violet-600 dark:text-violet-400">Total Days</span>
              <span id="ageTotalDays" class="text-2xl sm:text-3xl font-black text-violet-700 dark:text-violet-300">0</span>
            </div>
          </div>
        </div>
      `;
    }

    function calculateAge() {
      const dobVal = document.getElementById('dobInput').value;
      if (!dobVal) return;
      const dob = new Date(dobVal);
      const now = new Date();
      if (dob > now) {
        showToast('Date of birth cannot be in the future', 'error');
        return;
      }
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const totalDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
      document.getElementById('ageYears').innerText = years;
      document.getElementById('ageMonths').innerText = months;
      document.getElementById('ageDays').innerText = days;
      document.getElementById('ageTotalDays').innerText = totalDays.toLocaleString();
      triggerConfetti();
    }

    /* ================= UTILITY 6: YOUTUBE THUMBNAIL DOWNLOADER ================= */
    function renderYtThumb(title, icon, container) {
      if (title) title.innerText = 'YouTube HD Thumbnail Downloader';
      if (icon) icon.className = 'fa-brands fa-youtube';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex gap-2">
            <input type="text" id="ytUrlInput" placeholder="Paste YouTube Video URL or Shorts link..." class="flex-1 px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium focus:outline-none focus:border-red-500">
            <button type="button" onclick="fetchThumbnails()" class="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-md text-sm shrink-0 transition-colors">
              <i class="fa-solid fa-magnifying-glass"></i> Get Thumbnails
            </button>
          </div>

          <div id="ytThumbResults" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-100">
                <span>1080p Full HD (MaxRes)</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">Best Quality</span>
              </div>
              <img id="ytImgMax" class="w-full h-44 object-cover rounded-xl bg-slate-200 dark:bg-slate-700" alt="1080p Thumbnail">
              <button type="button" onclick="downloadYtThumbnailDirect('max')" class="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-download"></i> Download 1080p (Full HD)
              </button>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-100">
                <span>720p High Definition (HQ)</span>
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px]">Standard HD</span>
              </div>
              <img id="ytImgHq" class="w-full h-44 object-cover rounded-xl bg-slate-200 dark:bg-slate-700" alt="720p Thumbnail">
              <button type="button" onclick="downloadYtThumbnailDirect('hq')" class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2">
                <i class="fa-solid fa-download"></i> Download 720p (HD)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    let currentYtVidId = '';
    function fetchThumbnails() {
      const url = document.getElementById('ytUrlInput').value.trim();
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (!match) {
        showToast('Please enter a valid YouTube video or shorts link', 'error');
        return;
      }
      currentYtVidId = match[1];
      const maxUrl = `https://img.youtube.com/vi/${currentYtVidId}/maxresdefault.jpg`;
      const hqUrl = `https://img.youtube.com/vi/${currentYtVidId}/hqdefault.jpg`;

      const imgMax = document.getElementById('ytImgMax');
      const imgHq = document.getElementById('ytImgHq');

      imgMax.src = maxUrl;
      imgHq.src = hqUrl;

      imgMax.onerror = function() {
        imgMax.src = hqUrl;
      };

      document.getElementById('ytThumbResults').classList.remove('hidden');
      showToast('Thumbnails loaded!', 'success');
      triggerConfetti();
    }

    async function downloadYtThumbnailDirect(quality) {
      if (!currentYtVidId) return;
      showToast('Downloading thumbnail image...', 'info');

      const targetUrl = quality === 'max'
        ? `https://img.youtube.com/vi/${currentYtVidId}/maxresdefault.jpg`
        : `https://img.youtube.com/vi/${currentYtVidId}/hqdefault.jpg`;

      const filename = `youtube-thumbnail-${currentYtVidId}-${quality}.jpg`;

      try {
        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(targetUrl)}&output=jpg`;
        const resp = await fetch(proxyUrl);
        if (!resp.ok) throw new Error('Proxy fetch not ok');
        const blob = await resp.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Thumbnail image saved!', 'success');
        triggerConfetti();
      } catch (err) {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Thumbnail opened in new tab to save!', 'info');
      }
    }

    /* ================= UTILITY 7: QR CODE STUDIO & READER ================= */
    let qrFgColor = '#000000';
    let qrBgColor = '#ffffff';
    let qrActiveTab = 'generator';
    let qrActiveType = 'url';
    let qrCameraStream = null;
    let qrCameraRaf = null;

    function escapeWifiString(str) {
      if (!str) return '';
      return str.replace(/([\\;:,"])/g, '\\$1');
    }

    function renderQrTool(title, icon, container) {
      if (title) title.innerText = 'QR Code Generator & Scanner Studio';
      if (icon) icon.className = 'fa-solid fa-qrcode';

      container.innerHTML = `
        <div class="space-y-6">
          <!-- Top Tab Switcher: Generator vs Scanner -->
          <div class="flex p-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-2xl max-w-xs mx-auto shadow-2xs">
            <button type="button" id="tabQrGenBtn" onclick="switchQrTab('generator')" class="flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-xs">
              <i class="fa-solid fa-qrcode"></i> Generator
            </button>
            <button type="button" id="tabQrScanBtn" onclick="switchQrTab('scanner')" class="flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              <i class="fa-solid fa-camera"></i> Scanner
            </button>
          </div>

          <!-- ================= VIEW 1: GENERATOR ================= -->
          <div id="qrGenView" class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-7 space-y-4">
              <!-- Content Type Selectors -->
              <div>
                <label class="block font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Select Content Type</label>
                <div class="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                  <button type="button" onclick="switchQrType('url')" id="qrTypeBtn-url" class="qr-type-btn px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-2xs">
                    <i class="fa-solid fa-link mr-1"></i> URL
                  </button>
                  <button type="button" onclick="switchQrType('text')" id="qrTypeBtn-text" class="qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900">
                    <i class="fa-solid fa-align-left mr-1"></i> Text
                  </button>
                  <button type="button" onclick="switchQrType('wifi')" id="qrTypeBtn-wifi" class="qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900">
                    <i class="fa-solid fa-wifi mr-1"></i> Wi-Fi
                  </button>
                  <button type="button" onclick="switchQrType('vcard')" id="qrTypeBtn-vcard" class="qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900">
                    <i class="fa-solid fa-address-card mr-1"></i> vCard
                  </button>
                  <button type="button" onclick="switchQrType('email')" id="qrTypeBtn-email" class="qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900">
                    <i class="fa-solid fa-envelope mr-1"></i> Email
                  </button>
                  <button type="button" onclick="switchQrType('wa')" id="qrTypeBtn-wa" class="qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900">
                    <i class="fa-brands fa-whatsapp mr-1 text-emerald-500"></i> WhatsApp
                  </button>
                </div>
              </div>

              <!-- TYPE 1: URL -->
              <div id="qrInputForm-url" class="qr-input-form space-y-2">
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300">Website or Landing Page URL</label>
                <div class="relative">
                  <input type="url" id="qrUrlInput" value="https://toolshere.online" placeholder="https://yourwebsite.com" class="w-full p-3.5 pl-10 rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="generateQr()">
                  <i class="fa-solid fa-globe absolute left-3.5 top-4 text-slate-400 text-sm"></i>
                </div>
                <p class="text-[11px] text-slate-400">Standard HTTPS/HTTP link. Scanners will prompt to open this destination.</p>
              </div>

              <!-- TYPE 2: Plain Text -->
              <div id="qrInputForm-text" class="qr-input-form hidden space-y-2">
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300">Plain Text / Message / Code</label>
                <textarea id="qrTextInput" rows="4" placeholder="Type any plain text, notes, or serial codes..." class="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" oninput="generateQr()"></textarea>
              </div>

              <!-- TYPE 3: Wi-Fi Credentials -->
              <div id="qrInputForm-wifi" class="qr-input-form hidden space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Network Name (SSID) *</label>
                    <input type="text" id="qrWifiSsid" placeholder="e.g. Guest_WiFi" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Security Type</label>
                    <select id="qrWifiEnc" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" onchange="toggleWifiPasswordField(); generateQr();">
                      <option value="WPA" selected>WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>

                <div id="qrWifiPassGroup">
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Wi-Fi Password</label>
                  <div class="relative">
                    <input type="password" id="qrWifiPass" placeholder="Network password..." class="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" oninput="generateQr()">
                    <button type="button" onclick="toggleQrWifiPassVisibility()" title="Toggle visibility" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs">
                      <i id="qrWifiPassEye" class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                  <p class="text-[10px] text-slate-400 mt-1">Processed 100% locally in your browser memory. Never uploaded or saved.</p>
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="qrWifiHidden" class="rounded text-blue-600 focus:ring-blue-500 cursor-pointer" onchange="generateQr()">
                  <label for="qrWifiHidden" class="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">Hidden Network (SSID is not publicly broadcasted)</label>
                </div>
              </div>

              <!-- TYPE 4: vCard Contact -->
              <div id="qrInputForm-vcard" class="qr-input-form hidden space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">First Name *</label>
                    <input type="text" id="qrVcardFn" placeholder="Alex" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Last Name</label>
                    <input type="text" id="qrVcardLn" placeholder="Taylor" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Organization / Company</label>
                    <input type="text" id="qrVcardOrg" placeholder="ToolsHere" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Job Title</label>
                    <input type="text" id="qrVcardTitle" placeholder="Lead Engineer" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" id="qrVcardPhone" placeholder="+1 555 019 2834" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" id="qrVcardEmail" placeholder="alex@example.com" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Website URL</label>
                    <input type="url" id="qrVcardUrl" placeholder="https://example.com" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  </div>
                </div>
              </div>

              <!-- TYPE 5: Email -->
              <div id="qrInputForm-email" class="qr-input-form hidden space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Recipient Email *</label>
                  <input type="email" id="qrEmailTo" placeholder="support@toolshere.online" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                  <input type="text" id="qrEmailSub" placeholder="Customer Feedback" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Pre-filled Body</label>
                  <textarea id="qrEmailBody" rows="3" placeholder="Hello ToolsHere team..." class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()"></textarea>
                </div>
              </div>

              <!-- TYPE 6: WhatsApp -->
              <div id="qrInputForm-wa" class="qr-input-form hidden space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">WhatsApp Phone Number * (with Country Code)</label>
                  <input type="tel" id="qrWaPhone" placeholder="e.g. 15550192834 (numbers only)" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()">
                  <p class="text-[10px] text-slate-400 mt-1">Include country code without '+' or spaces (e.g. 1 for USA, 91 for India, 44 for UK).</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Pre-filled Chat Message (Optional)</label>
                  <textarea id="qrWaMsg" rows="3" placeholder="Hello! I scanned your QR code and would like more info." class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs" oninput="generateQr()"></textarea>
                </div>
              </div>

              <!-- Customization Controls (Colors, Presets, Quality) -->
              <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">QR Code Color:</label>
                    <div class="flex items-center gap-2">
                      <input type="color" id="qrColorPicker" value="#000000" onchange="qrFgColor=this.value; generateQr();" class="w-8 h-8 rounded-lg cursor-pointer border border-slate-200">
                      <span class="font-mono text-[11px] text-slate-400">Dark</span>
                    </div>
                  </div>
                  <div>
                    <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">Background:</label>
                    <div class="flex items-center gap-2">
                      <input type="color" id="qrBgColorPicker" value="#ffffff" onchange="qrBgColor=this.value; generateQr();" class="w-8 h-8 rounded-lg cursor-pointer border border-slate-200">
                      <span class="font-mono text-[11px] text-slate-400">Light</span>
                    </div>
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block font-bold text-slate-600 dark:text-slate-300 mb-1">Download Quality:</label>
                    <select id="qrResSelect" class="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold text-xs">
                      <option value="600">Standard (600px)</option>
                      <option value="1200" selected>HD Print (1200px)</option>
                      <option value="2400">Ultra HD 4K (2400px)</option>
                    </select>
                  </div>
                </div>

                <!-- Palette Shortcuts -->
                <div class="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] font-bold uppercase text-slate-400 mr-1">Palettes:</span>
                  <button type="button" onclick="applyQrPalette('#000000', '#ffffff')" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200">Classic B&W</button>
                  <button type="button" onclick="applyQrPalette('#1e3a8a', '#eff6ff')" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-blue-50 border border-blue-200 text-blue-900">Navy</button>
                  <button type="button" onclick="applyQrPalette('#065f46', '#ecfdf5')" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-900">Emerald</button>
                  <button type="button" onclick="applyQrPalette('#581c87', '#faf5ff')" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-purple-50 border border-purple-200 text-purple-900">Purple</button>
                  <button type="button" onclick="applyQrPalette('#0f172a', '#f8fafc')" class="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-900 text-white">Slate</button>
                </div>

                <div id="qrContrastWarn" class="hidden p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Low contrast between QR color and background may cause scanning issues.
                </div>
              </div>
            </div>

            <!-- Right Column: Live QR Preview & Downloads -->
            <div class="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4 md:sticky md:top-24">
              <div id="qrCanvasContainer" class="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[240px] w-full">
                <canvas id="qrCanvas" class="max-w-[220px] max-h-[220px] rounded-lg"></canvas>
              </div>
              <div class="w-full text-center">
                <span id="qrLiveTypeBadge" class="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-400">Website URL</span>
              </div>

              <div class="w-full space-y-2">
                <button type="button" onclick="downloadQrHighQuality('png')" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  <i class="fa-solid fa-file-image"></i> Download Image (High-Res PNG)
                </button>
                <button type="button" onclick="downloadQrHighQuality('svg')" class="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                  <i class="fa-solid fa-vector-square text-violet-500"></i> Download Vector SVG
                </button>
                <button type="button" onclick="downloadQrAsPdf()" class="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  <i class="fa-solid fa-file-pdf text-red-400"></i> Download Printable PDF
                </button>
              </div>
            </div>
          </div>

          <!-- ================= VIEW 2: SCANNER ================= -->
          <div id="qrScanView" class="hidden space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <!-- Scanner Option A: Upload Image File -->
              <div class="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div class="flex items-center gap-2.5 font-bold text-slate-800 dark:text-white text-sm">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-sm">
                    <i class="fa-solid fa-image"></i>
                  </div>
                  <h3>Upload QR Image or SVG</h3>
                </div>

                <div id="qrScanDropZone" onclick="document.getElementById('qrScanFileInput').click()" ondragover="handleQrDragOver(event)" ondragleave="handleQrDragLeave(event)" ondrop="handleQrDrop(event)" class="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white dark:bg-slate-800/80 group min-h-[160px] flex flex-col items-center justify-center">
                  <input type="file" id="qrScanFileInput" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,.svg" class="hidden" onchange="handleQrImageSelect(this)">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <p class="text-xs font-bold text-slate-700 dark:text-slate-200">Click to choose image or drag & drop</p>
                  <p class="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WebP, GIF, and vector SVG files</p>
                </div>
              </div>

              <!-- Scanner Option B: Scan with Live Camera -->
              <div class="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div class="flex items-center gap-2.5 font-bold text-slate-800 dark:text-white text-sm">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
                    <i class="fa-solid fa-camera"></i>
                  </div>
                  <h3>Scan with Device Camera</h3>
                </div>

                <div id="qrCameraInitial">
                  <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Point your camera or webcam at a printed or displayed QR code to decode its contents instantly in real time.
                  </p>
                  <button type="button" id="startCameraBtn" onclick="startQrCamera()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[42px]">
                    <i class="fa-solid fa-video"></i> Start Camera Scanner
                  </button>
                </div>

                <div id="qrCameraActive" class="hidden space-y-3">
                  <div class="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                    <video id="qrVideo" playsinline autoplay muted class="w-full h-full object-cover"></video>
                    <!-- Targeting Reticle -->
                    <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div class="w-44 h-44 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative">
                        <div class="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                        <div class="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                        <div class="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                        <div class="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
                      </div>
                    </div>
                  </div>
                  <button type="button" onclick="stopQrCamera()" class="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[38px]">
                    <i class="fa-solid fa-stop"></i> Stop Camera Scanner
                  </button>
                </div>

                <div id="qrCameraError" class="hidden p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 space-y-2">
                  <p id="qrCameraErrorMsg" class="font-semibold"></p>
                  <button type="button" onclick="document.getElementById('qrScanFileInput').click()" class="text-[11px] font-bold text-red-800 dark:text-red-200 underline">Upload an image file instead</button>
                </div>
              </div>
            </div>

            <!-- Decoded Result Card -->
            <div id="qrDecodedCard" class="hidden p-6 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">Decoded QR Code Result</span>
                </div>
                <span id="qrDecodedBadge" class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">Plain Text</span>
              </div>

              <!-- Sanitized Text Container (Safe textContent rendering) -->
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100 break-all leading-relaxed max-h-60 overflow-y-auto select-all">
                <span id="qrDecodedText"></span>
              </div>

              <!-- Specialized Action Block (Safe link buttons, Wi-Fi password copy) -->
              <div id="qrSpecializedActions" class="space-y-2"></div>

              <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onclick="copyQrDecodedContent()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 min-h-[38px]">
                  <i class="fa-solid fa-copy"></i> Copy Content
                </button>
                <button type="button" onclick="resetQrScanner()" class="px-4 py-2.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 min-h-[38px]">
                  <i class="fa-solid fa-rotate-left"></i> Scan Another
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      setTimeout(generateQr, 50);
    }

    function switchQrTab(tab) {
      qrActiveTab = tab;
      const genBtn = document.getElementById('tabQrGenBtn');
      const scanBtn = document.getElementById('tabQrScanBtn');
      const genView = document.getElementById('qrGenView');
      const scanView = document.getElementById('qrScanView');

      if (tab === 'generator') {
        stopQrCamera();
        if (genBtn) {
          genBtn.className = 'flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-xs';
        }
        if (scanBtn) {
          scanBtn.className = 'flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
        }
        if (genView) genView.classList.remove('hidden');
        if (scanView) scanView.classList.add('hidden');
        generateQr();
      } else {
        ensureScript('jsQR');
        if (scanBtn) {
          scanBtn.className = 'flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-xs';
        }
        if (genBtn) {
          genBtn.className = 'flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
        }
        if (genView) genView.classList.add('hidden');
        if (scanView) scanView.classList.remove('hidden');
      }
    }

    function switchQrType(type) {
      qrActiveType = type;
      // Update pill buttons
      document.querySelectorAll('.qr-type-btn').forEach(btn => {
        btn.className = 'qr-type-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900';
      });
      const activeBtn = document.getElementById('qrTypeBtn-' + type);
      if (activeBtn) {
        activeBtn.className = 'qr-type-btn px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-2xs font-bold';
      }

      // Hide all input forms, show active one
      document.querySelectorAll('.qr-input-form').forEach(f => f.classList.add('hidden'));
      const activeForm = document.getElementById('qrInputForm-' + type);
      if (activeForm) activeForm.classList.remove('hidden');

      // Update badge label
      const badgeLabels = {
        url: 'Website URL',
        text: 'Plain Text',
        wifi: 'Wi-Fi Network',
        vcard: 'vCard Contact',
        email: 'Email Draft',
        wa: 'WhatsApp Chat'
      };
      const badge = document.getElementById('qrLiveTypeBadge');
      if (badge) badge.innerText = badgeLabels[type] || 'QR Code';

      generateQr();
    }

    function toggleWifiPasswordField() {
      const enc = document.getElementById('qrWifiEnc')?.value || 'WPA';
      const passGroup = document.getElementById('qrWifiPassGroup');
      if (passGroup) {
        if (enc === 'nopass') {
          passGroup.classList.add('hidden');
        } else {
          passGroup.classList.remove('hidden');
        }
      }
    }

    function toggleQrWifiPassVisibility() {
      const passInput = document.getElementById('qrWifiPass');
      const eyeIcon = document.getElementById('qrWifiPassEye');
      if (!passInput) return;
      if (passInput.type === 'password') {
        passInput.type = 'text';
        if (eyeIcon) eyeIcon.className = 'fa-solid fa-eye-slash';
      } else {
        passInput.type = 'password';
        if (eyeIcon) eyeIcon.className = 'fa-solid fa-eye';
      }
    }

    function applyQrPalette(fg, bg) {
      qrFgColor = fg;
      qrBgColor = bg;
      const fgPicker = document.getElementById('qrColorPicker');
      const bgPicker = document.getElementById('qrBgColorPicker');
      if (fgPicker) fgPicker.value = fg;
      if (bgPicker) bgPicker.value = bg;
      generateQr();
    }

    function checkQrContrast(hex1, hex2) {
      function getLuminance(hex) {
        const c = hex.replace('#', '');
        const r = parseInt(c.substr(0, 2), 16) / 255;
        const g = parseInt(c.substr(2, 2), 16) / 255;
        const b = parseInt(c.substr(4, 2), 16) / 255;
        const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }
      try {
        const l1 = getLuminance(hex1);
        const l2 = getLuminance(hex2);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio >= 2.5;
      } catch (e) {
        return true;
      }
    }

    function getQrPayload() {
      if (qrActiveType === 'url') {
        let url = document.getElementById('qrUrlInput')?.value?.trim() || 'https://toolshere.online';
        if (url && !/^https?:\/\//i.test(url) && !url.startsWith('/')) {
          url = 'https://' + url;
        }
        return url;
      }
      if (qrActiveType === 'text') {
        return document.getElementById('qrTextInput')?.value || 'ToolsHere.online';
      }
      if (qrActiveType === 'wifi') {
        const ssid = document.getElementById('qrWifiSsid')?.value || '';
        const pass = document.getElementById('qrWifiPass')?.value || '';
        const enc = document.getElementById('qrWifiEnc')?.value || 'WPA';
        const isHidden = document.getElementById('qrWifiHidden')?.checked || false;

        let payload = `WIFI:T:${enc};S:${escapeWifiString(ssid)};`;
        if (enc !== 'nopass' && pass) {
          payload += `P:${escapeWifiString(pass)};`;
        }
        if (isHidden) {
          payload += 'H:true;';
        }
        payload += ';';
        return payload;
      }
      if (qrActiveType === 'vcard') {
        const fn = document.getElementById('qrVcardFn')?.value?.trim() || '';
        const ln = document.getElementById('qrVcardLn')?.value?.trim() || '';
        const org = document.getElementById('qrVcardOrg')?.value?.trim() || '';
        const title = document.getElementById('qrVcardTitle')?.value?.trim() || '';
        const phone = document.getElementById('qrVcardPhone')?.value?.trim() || '';
        const email = document.getElementById('qrVcardEmail')?.value?.trim() || '';
        const url = document.getElementById('qrVcardUrl')?.value?.trim() || '';

        const fullName = [fn, ln].filter(Boolean).join(' ') || 'Contact';
        const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${fullName}`, `N:${ln};${fn};;;`];
        if (org) lines.push(`ORG:${org}`);
        if (title) lines.push(`TITLE:${title}`);
        if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
        if (email) lines.push(`EMAIL:${email}`);
        if (url) lines.push(`URL:${url}`);
        lines.push('END:VCARD');
        return lines.join('\n');
      }
      if (qrActiveType === 'email') {
        const to = document.getElementById('qrEmailTo')?.value?.trim() || 'support@toolshere.online';
        const sub = document.getElementById('qrEmailSub')?.value?.trim() || '';
        const body = document.getElementById('qrEmailBody')?.value || '';
        const params = [];
        if (sub) params.push(`subject=${encodeURIComponent(sub)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        return `mailto:${to}${params.length ? '?' + params.join('&') : ''}`;
      }
      if (qrActiveType === 'wa') {
        const phone = (document.getElementById('qrWaPhone')?.value || '').replace(/[^0-9]/g, '');
        const msg = document.getElementById('qrWaMsg')?.value || '';
        return `https://wa.me/${phone}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
      }
      return 'https://toolshere.online';
    }

    function generateQr() {
      const payload = getQrPayload();
      const canvas = document.getElementById('qrCanvas');
      if (!canvas) return;

      // Contrast check
      const contrastWarn = document.getElementById('qrContrastWarn');
      if (contrastWarn) {
        if (!checkQrContrast(qrFgColor, qrBgColor)) {
          contrastWarn.classList.remove('hidden');
        } else {
          contrastWarn.classList.add('hidden');
        }
      }

      if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
        QRCode.toCanvas(canvas, payload, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: qrFgColor || '#000000',
            light: qrBgColor || '#ffffff'
          }
        }, function(error) {
          if (error) console.error('QRCode canvas generation error:', error);
        });
      }
    }

    async function downloadQrHighQuality(format) {
      const payload = getQrPayload();
      const res = parseInt(document.getElementById('qrResSelect')?.value) || 1200;

      if (format === 'svg') {
        if (typeof QRCode !== 'undefined' && QRCode.toString) {
          QRCode.toString(payload, {
            type: 'svg',
            errorCorrectionLevel: 'H',
            color: { dark: qrFgColor, light: qrBgColor },
            margin: 2
          }, (err, svgStr) => {
            if (err) {
              showToast('Failed to generate SVG', 'error');
              return;
            }
            const blob = new Blob([svgStr], { type: 'image/svg+xml' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `toolshere-qrcode-${qrActiveType}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('Vector SVG downloaded!', 'success');
            triggerConfetti();
          });
        }
        return;
      }

      showToast('Generating high-resolution QR...', 'info');
      const tempCanvas = document.createElement('canvas');
      QRCode.toCanvas(tempCanvas, payload, {
        width: res,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: qrFgColor, light: qrBgColor }
      }, (err) => {
        if (err) {
          showToast('Failed to generate PNG: ' + err.message, 'error');
          return;
        }
        const a = document.createElement('a');
        a.href = tempCanvas.toDataURL('image/png');
        a.download = `toolshere-qrcode-${qrActiveType}-${res}px.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('High-Resolution QR Code saved!', 'success');
        triggerConfetti();
      });
    }

    async function downloadQrAsPdf() {
      const payload = getQrPayload();
      showToast('Creating high-quality printable PDF...', 'info');

      try {
        if (typeof PDFLib === 'undefined') {
          await ensureScript('PDFLib');
        }
        if (typeof PDFLib === 'undefined') {
          showToast('PDF generator initializing, please retry...', 'info');
          return;
        }

        const tempCanvas = document.createElement('canvas');
        await new Promise((resolve, reject) => {
          QRCode.toCanvas(tempCanvas, payload, {
            width: 1200,
            margin: 2,
            errorCorrectionLevel: 'H',
            color: { dark: qrFgColor, light: qrBgColor }
          }, err => err ? reject(err) : resolve());
        });

        const pngDataUrl = tempCanvas.toDataURL('image/png');
        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]);
        const pngImage = await pdfDoc.embedPng(pngDataUrl);

        const qrDim = 320;
        const x = (595.28 - qrDim) / 2;
        const y = (841.89 - qrDim) / 2 + 30;

        page.drawImage(pngImage, { x, y, width: qrDim, height: qrDim });

        page.drawText('ToolsHere.online — QR Code Studio', {
          x: 140,
          y: y + qrDim + 40,
          size: 18
        });

        const previewText = payload.length > 55 ? payload.slice(0, 52) + '...' : payload;
        page.drawText(previewText, {
          x: 80,
          y: y - 25,
          size: 10
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `toolshere-qrcode-${qrActiveType}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Printable PDF downloaded!', 'success');
        triggerConfetti();
      } catch (err) {
        console.error(err);
        showToast('Failed to create PDF: ' + err.message, 'error');
      }
    }

    /* ================= QR SCANNER ENGINE ================= */
    function handleQrDragOver(e) {
      if (e) e.preventDefault();
      const dropZone = document.getElementById('qrScanDropZone');
      if (dropZone) dropZone.classList.add('border-blue-500', 'bg-blue-50/50', 'dark:bg-slate-700/50');
    }

    function handleQrDragLeave(e) {
      if (e) e.preventDefault();
      const dropZone = document.getElementById('qrScanDropZone');
      if (dropZone) dropZone.classList.remove('border-blue-500', 'bg-blue-50/50', 'dark:bg-slate-700/50');
    }

    function handleQrDrop(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      handleQrDragLeave();
      const files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files && files.length > 0) {
        processQrImageFile(files[0]);
      }
    }

    function handleQrImageSelect(input) {
      if (input && input.files && input.files.length > 0) {
        processQrImageFile(input.files[0]);
      }
    }

    function showQrScanError(msg) {
      showToast(msg, 'error');
    }

    function processQrImageFile(file) {
      if (!file) return;
      showToast('Processing image...', 'info');

      // Check if SVG or image
      const isSvg = file.type === 'image/svg+xml' || (file.name && file.name.toLowerCase().endsWith('.svg'));

      const img = new Image();
      const objUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          const maxDim = 1200;
          let w = img.naturalWidth || img.width || 600;
          let h = img.naturalHeight || img.height || 600;

          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          // Fill white background before drawing (vital for transparent PNG/SVG)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);

          URL.revokeObjectURL(objUrl);
          decodeQrFromCanvas(canvas);
        } catch (err) {
          URL.revokeObjectURL(objUrl);
          showQrScanError('Could not process image pixels: ' + err.message);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        showQrScanError('Could not load image file. Please provide a valid PNG, JPG, or SVG.');
      };

      img.src = objUrl;
    }

    async function decodeQrFromCanvas(canvas) {
      if (!canvas) return;

      // Strategy 1: Native BarcodeDetector if available
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            renderDecodedResult(barcodes[0].rawValue);
            return;
          }
        } catch (e) {
          // Native detector threw or unsupported format; proceed to fallback
        }
      }

      // Strategy 2: Client-side jsQR fallback
      if (typeof jsQR === 'undefined') {
        await ensureScript('jsQR');
      }

      if (typeof jsQR !== 'undefined') {
        try {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });
          if (code && code.data) {
            renderDecodedResult(code.data);
            return;
          }
        } catch (e) {
          console.error('jsQR decoding error:', e);
        }
      }

      showQrScanError('No QR code detected in this image. Please ensure the code is clear and well-lit.');
    }

    async function startQrCamera() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorBox = document.getElementById('qrCameraError');
        const errorMsg = document.getElementById('qrCameraErrorMsg');
        if (errorBox && errorMsg) {
          errorMsg.innerText = 'Camera access is not supported by your browser or requires a secure HTTPS connection.';
          errorBox.classList.remove('hidden');
        }
        return;
      }

      stopQrCamera(); // Prevent multiple streams

      const initialView = document.getElementById('qrCameraInitial');
      const activeView = document.getElementById('qrCameraActive');
      const errorBox = document.getElementById('qrCameraError');
      const errorMsg = document.getElementById('qrCameraErrorMsg');

      if (errorBox) errorBox.classList.add('hidden');

      try {
        await ensureScript('jsQR');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        qrCameraStream = stream;
        const video = document.getElementById('qrVideo');
        if (video) {
          video.srcObject = stream;
          await video.play();

          if (initialView) initialView.classList.add('hidden');
          if (activeView) activeView.classList.remove('hidden');

          // Frame scanning loop
          scanCameraFrame();
        }
      } catch (err) {
        if (initialView) initialView.classList.remove('hidden');
        if (activeView) activeView.classList.add('hidden');
        if (errorBox && errorMsg) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg.innerText = 'Camera permission was denied. Please allow camera permissions in your browser address bar.';
          } else if (err.name === 'NotFoundError') {
            errorMsg.innerText = 'No camera device found on this system. Please upload an image file instead.';
          } else if (err.name === 'NotReadableError') {
            errorMsg.innerText = 'Camera is currently in use by another program. Please close other camera apps and retry.';
          } else {
            errorMsg.innerText = 'Could not start camera: ' + err.message;
          }
          errorBox.classList.remove('hidden');
        }
      }
    }

    function scanCameraFrame() {
      const video = document.getElementById('qrVideo');
      if (!video || !qrCameraStream || video.readyState !== video.HAVE_ENOUGH_DATA) {
        qrCameraRaf = requestAnimationFrame(scanCameraFrame);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let foundData = null;

      if (typeof jsQR !== 'undefined') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        if (code && code.data) {
          foundData = code.data;
        }
      }

      if (foundData) {
        stopQrCamera();
        renderDecodedResult(foundData);
        showToast('QR code detected!', 'success');
        triggerConfetti();
        return;
      }

      qrCameraRaf = requestAnimationFrame(scanCameraFrame);
    }

    function stopQrCamera() {
      if (qrCameraRaf) {
        cancelAnimationFrame(qrCameraRaf);
        qrCameraRaf = null;
      }
      if (qrCameraStream) {
        qrCameraStream.getTracks().forEach(track => {
          try { track.stop(); } catch (e) {}
        });
        qrCameraStream = null;
      }
      const video = document.getElementById('qrVideo');
      if (video) video.srcObject = null;

      const initialView = document.getElementById('qrCameraInitial');
      const activeView = document.getElementById('qrCameraActive');
      if (initialView) initialView.classList.remove('hidden');
      if (activeView) activeView.classList.add('hidden');
    }

    function classifyDecodedPayload(text) {
      if (!text) return { type: 'empty', label: 'Empty' };
      const trimmed = text.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        return { type: 'url', label: 'Website Link', isHttp: true, safeUrl: trimmed };
      }
      if (/^WIFI:/i.test(trimmed)) {
        return { type: 'wifi', label: 'Wi-Fi Network' };
      }
      if (/^BEGIN:VCARD/i.test(trimmed)) {
        return { type: 'vcard', label: 'Contact Card (vCard)' };
      }
      if (/^mailto:/i.test(trimmed)) {
        return { type: 'email', label: 'Email Action', isHttp: true, safeUrl: trimmed };
      }
      if (/^https:\/\/wa\.me\//i.test(trimmed)) {
        return { type: 'wa', label: 'WhatsApp Chat', isHttp: true, safeUrl: trimmed };
      }
      return { type: 'text', label: 'Plain Text' };
    }

    function renderDecodedResult(rawText) {
      const card = document.getElementById('qrDecodedCard');
      const textBox = document.getElementById('qrDecodedText');
      const badge = document.getElementById('qrDecodedBadge');
      const actions = document.getElementById('qrSpecializedActions');

      if (!card || !textBox) return;

      // STRICT SECURITY: Use textContent to prevent XSS execution
      textBox.textContent = rawText;

      const meta = classifyDecodedPayload(rawText);
      if (badge) badge.innerText = meta.label;

      if (actions) {
        actions.innerHTML = '';

        // If safe HTTP/HTTPS URL
        if (meta.type === 'url' && meta.isHttp) {
          const alertP = document.createElement('p');
          alertP.className = 'text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5';
          alertP.innerHTML = '<i class="fa-solid fa-shield-halved text-blue-500"></i> Review the destination link carefully before opening:';

          const linkA = document.createElement('a');
          linkA.href = meta.safeUrl;
          linkA.target = '_blank';
          linkA.rel = 'noopener noreferrer';
          linkA.className = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors';
          linkA.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website Link';

          actions.appendChild(alertP);
          actions.appendChild(linkA);
        } else if (meta.type === 'wifi') {
          // Parse SSID and Password safely
          const ssidMatch = rawText.match(/S:([^;]+);/);
          const passMatch = rawText.match(/P:([^;]+);/);
          const rawSsid = ssidMatch ? ssidMatch[1].replace(/\\([\\;:,"])/g, '$1') : 'Unknown';
          const rawPass = passMatch ? passMatch[1].replace(/\\([\\;:,"])/g, '$1') : '';

          const wifiBox = document.createElement('div');
          wifiBox.className = 'p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1.5';

          const ssidLine = document.createElement('div');
          ssidLine.className = 'font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between';
          ssidLine.textContent = 'SSID: ' + rawSsid;

          wifiBox.appendChild(ssidLine);

          if (rawPass) {
            const passLine = document.createElement('div');
            passLine.className = 'flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono text-xs';
            passLine.textContent = 'Password: ' + rawPass;

            const copyPassBtn = document.createElement('button');
            copyPassBtn.type = 'button';
            copyPassBtn.className = 'text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline ml-2';
            copyPassBtn.textContent = 'Copy Password';
            copyPassBtn.onclick = () => copyTextValue(rawPass, 'Wi-Fi Password');

            passLine.appendChild(copyPassBtn);
            wifiBox.appendChild(passLine);
          }
          actions.appendChild(wifiBox);
        } else if (!meta.isHttp && /^([a-zA-Z0-9_-]+):/i.test(rawText.trim())) {
          // Potentially suspicious URI scheme (e.g. javascript:, data:, file:)
          const warnP = document.createElement('p');
          warnP.className = 'text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5';
          warnP.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Non-standard scheme detected. For your security, this payload is displayed strictly as plain text.';
          actions.appendChild(warnP);
        }
      }

      card.classList.remove('hidden');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function copyQrDecodedContent() {
      const textBox = document.getElementById('qrDecodedText');
      const text = textBox ? textBox.textContent : '';
      if (!text) {
        showToast('No decoded content to copy', 'error');
        return;
      }
      copyText(text);
    }

    function copyTextValue(val, label) {
      if (!val) return;
      copyText(val);
      showToast(`${label || 'Text'} copied!`, 'success');
    }

    function resetQrScanner() {
      const card = document.getElementById('qrDecodedCard');
      const textBox = document.getElementById('qrDecodedText');
      const fileInput = document.getElementById('qrScanFileInput');
      if (card) card.classList.add('hidden');
      if (textBox) textBox.textContent = '';
      if (fileInput) fileInput.value = '';
    }
    /* ================= UTILITY 8: PASSWORD GENERATOR ================= */
    function renderPasswordTool(title, icon, container) {
      if (title) title.innerText = 'Cryptographically Secure Password Generator';
      if (icon) icon.className = 'fa-solid fa-key';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-3xl border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-between gap-4">
            <span id="passOutput" class="font-mono text-lg sm:text-2xl font-black text-slate-800 dark:text-white break-all">Generating...</span>
            <button type="button" onclick="copyPassword()" class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shrink-0 flex items-center gap-2">
              <i class="fa-solid fa-copy"></i> Copy
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between text-xs sm:text-sm font-bold">
              <span>Password Length</span>
              <span id="passLenVal" class="text-blue-600 dark:text-cyan-400">18 characters</span>
            </div>
            <input type="range" id="passLen" min="8" max="64" value="18" oninput="generatePassword()" class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-blue-600 cursor-pointer">
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <label class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl cursor-pointer">
              <input type="checkbox" id="passUpper" checked onchange="generatePassword()" class="rounded text-blue-600"> Uppercase (A-Z)
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl cursor-pointer">
              <input type="checkbox" id="passLower" checked onchange="generatePassword()" class="rounded text-blue-600"> Lowercase (a-z)
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl cursor-pointer">
              <input type="checkbox" id="passNums" checked onchange="generatePassword()" class="rounded text-blue-600"> Numbers (0-9)
            </label>
            <label class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl cursor-pointer">
              <input type="checkbox" id="passSyms" checked onchange="generatePassword()" class="rounded text-blue-600"> Symbols (!@#$)
            </label>
          </div>
        </div>
      `;
      setTimeout(generatePassword, 50);
    }

    function generatePassword() {
      const len = parseInt(document.getElementById('passLen')?.value) || 18;
      document.getElementById('passLenVal').innerText = `${len} characters`;
      const upper = document.getElementById('passUpper')?.checked;
      const lower = document.getElementById('passLower')?.checked;
      const nums = document.getElementById('passNums')?.checked;
      const syms = document.getElementById('passSyms')?.checked;

      let chars = '';
      if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (nums) chars += '0123456789';
      if (syms) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

      const array = new Uint32Array(len);
      window.crypto.getRandomValues(array);
      let pass = '';
      for (let i = 0; i < len; i++) {
        pass += chars[array[i] % chars.length];
      }
      document.getElementById('passOutput').innerText = pass;
    }

    function copyPassword() {
      copyText(document.getElementById('passOutput').innerText);
    }

    /* ================= UTILITY 9: WORD COUNTER ================= */
    function renderWordCounter(title, icon, container) {
      if (title) title.innerText = 'Word & Character Counter';
      if (icon) icon.className = 'fa-solid fa-align-left';
      container.innerHTML = `
        <div class="space-y-5">
          <div class="relative">
            <textarea id="wordTextInput" rows="8" placeholder="Type or paste your text here to count words, characters, sentences, paragraphs, and reading time in real time..." class="w-full p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs leading-relaxed" oninput="updateWordCounts()"></textarea>
          </div>

          <!-- Action Controls Toolbar -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="clearWordCounterText()" class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 min-h-[38px] shadow-2xs">
                <i class="fa-solid fa-trash-can text-slate-400"></i> Clear Text
              </button>
              <button type="button" onclick="copyWordCounterText()" class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 min-h-[38px] shadow-2xs">
                <i class="fa-solid fa-copy text-slate-400"></i> Copy Text
              </button>
              <button type="button" onclick="copyWordCounterStats()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[38px] shadow-xs">
                <i class="fa-solid fa-chart-simple"></i> Copy Statistics
              </button>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <i class="fa-solid fa-bolt text-amber-500"></i> Live real-time analysis
            </div>
          </div>

          <!-- 6-Metric Statistics Dashboard -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Words</span>
              <span id="countWords" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0</span>
              <span class="block text-[10px] text-slate-400">Total words</span>
            </div>
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Characters</span>
              <span id="countChars" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0</span>
              <span class="block text-[10px] text-slate-400">With spaces</span>
            </div>
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Characters</span>
              <span id="countCharsNoSpaces" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0</span>
              <span class="block text-[10px] text-slate-400">No spaces</span>
            </div>
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sentences</span>
              <span id="countSentences" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0</span>
              <span class="block text-[10px] text-slate-400">Punctuation</span>
            </div>
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paragraphs</span>
              <span id="countParagraphs" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0</span>
              <span class="block text-[10px] text-slate-400">Content blocks</span>
            </div>
            <div class="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <span class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reading Time</span>
              <span id="countReadTime" class="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 my-1">0 sec</span>
              <span class="block text-[10px] text-slate-400">~200 wpm speed</span>
            </div>
          </div>
        </div>
      `;
    }

    let wordCounterGraphemeSegmenter = null;
    function countGraphemes(str) {
      if (!str) return 0;
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          if (!wordCounterGraphemeSegmenter) {
            wordCounterGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          }
          let count = 0;
          for (const _ of wordCounterGraphemeSegmenter.segment(str)) {
            count++;
          }
          return count;
        } catch (e) {
          // Fallback if segmenter throws
        }
      }
      return Array.from(str).length;
    }

    function updateWordCounts() {
      const inputEl = document.getElementById('wordTextInput');
      const text = inputEl ? inputEl.value : '';

      // 1. Words: Match Unicode words or numbers, supporting hyphens and apostrophes inside words
      const words = text.trim() ? (text.trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length : 0;

      // 2. Characters (with spaces): Unicode grapheme cluster aware (emojis count as 1)
      const charsWithSpaces = countGraphemes(text);

      // 3. Characters (excluding spaces): Unicode grapheme cluster aware
      const charsNoSpaces = countGraphemes(text.replace(/\s/g, ''));

      // 4. Sentences: Protect decimals, initials, and common abbreviations
      let sentences = 0;
      if (text && text.trim()) {
        let clean = text.trim();
        // Protect decimal numbers (e.g. 3.14, $9.99)
        clean = clean.replace(/(\d)\.(\d)/g, '$1[DOT]$2');
        // Protect common abbreviations
        const abbrevs = ['mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc', 'e.g', 'i.e', 'approx', 'dept', 'est', 'inc', 'ltd', 'co'];
        abbrevs.forEach(abbr => {
          clean = clean.replace(new RegExp('\\b' + abbr + '\\.', 'gi'), abbr + '[DOT]');
        });
        // Protect single-letter initials (e.g. "J. K. Rowling")
        clean = clean.replace(/\b([A-Za-z])\./g, '$1[DOT]');
        // Match sentences ending in [.!?] or end of string
        const sentenceMatches = clean.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
        // Filter to segments containing actual letters or numbers
        sentences = sentenceMatches ? sentenceMatches.filter(s => /[\p{L}\p{N}]/u.test(s)).length : 0;
      }

      // 5. Paragraphs: Count paragraph blocks separated by one or more blank lines (wrapped lines in same block stay together)
      const paragraphs = text.trim() ? text.trim().split(/\r?\n\s*\r?\n+/).filter(p => p.trim().length > 0).length : 0;

      // 6. Estimated Reading Time (based on standard 200 WPM)
      let readTimeStr = '0 sec';
      if (words > 0) {
        const totalSeconds = Math.ceil((words / 200) * 60);
        if (totalSeconds < 60) {
          readTimeStr = `${totalSeconds} sec`;
        } else {
          const mins = Math.ceil(words / 200);
          readTimeStr = `${mins} min`;
        }
      }

      const elWords = document.getElementById('countWords');
      const elChars = document.getElementById('countChars');
      const elCharsNoSpaces = document.getElementById('countCharsNoSpaces');
      const elSentences = document.getElementById('countSentences');
      const elParagraphs = document.getElementById('countParagraphs');
      const elReadTime = document.getElementById('countReadTime');

      if (elWords) elWords.innerText = words.toLocaleString();
      if (elChars) elChars.innerText = charsWithSpaces.toLocaleString();
      if (elCharsNoSpaces) elCharsNoSpaces.innerText = charsNoSpaces.toLocaleString();
      if (elSentences) elSentences.innerText = sentences.toLocaleString();
      if (elParagraphs) elParagraphs.innerText = paragraphs.toLocaleString();
      if (elReadTime) elReadTime.innerText = readTimeStr;
    }

    function clearWordCounterText() {
      const inputEl = document.getElementById('wordTextInput');
      if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
      }
      updateWordCounts();
      showToast('Text cleared', 'info');
    }

    function copyWordCounterText() {
      const inputEl = document.getElementById('wordTextInput');
      const text = inputEl ? inputEl.value : '';
      if (!text) {
        showToast('No text to copy', 'error');
        return;
      }
      copyText(text);
    }

    function copyWordCounterStats() {
      const elWords = document.getElementById('countWords')?.innerText || '0';
      const elChars = document.getElementById('countChars')?.innerText || '0';
      const elCharsNoSpaces = document.getElementById('countCharsNoSpaces')?.innerText || '0';
      const elSentences = document.getElementById('countSentences')?.innerText || '0';
      const elParagraphs = document.getElementById('countParagraphs')?.innerText || '0';
      const elReadTime = document.getElementById('countReadTime')?.innerText || '0 sec';

      const summary = [
        '=== ToolsHere Word & Text Counter Statistics ===',
        `Words: ${elWords}`,
        `Characters (with spaces): ${elChars}`,
        `Characters (no spaces): ${elCharsNoSpaces}`,
        `Sentences: ${elSentences}`,
        `Paragraphs: ${elParagraphs}`,
        `Estimated Reading Time: ${elReadTime} (based on 200 wpm)`,
        'Analyzed securely via https://toolshere.online/word-counter/'
      ].join('\n');

      copyText(summary);
    }

    /* ================= UTILITY 10: GST & EMI CALCULATOR ================= */
    function renderGstEmi(title, icon, container) {
      if (title) title.innerText = 'GST & Loan EMI Calculator';
      if (icon) icon.className = 'fa-solid fa-calculator';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex border-b border-[#E5E7EB] dark:border-slate-700">
            <button type="button" id="tabEmiBtn" onclick="switchCalcTab('emi')" class="px-6 py-3 border-b-2 border-blue-600 font-bold text-sm text-blue-600 dark:text-cyan-400">Loan EMI Calculator</button>
            <button type="button" id="tabGstBtn" onclick="switchCalcTab('gst')" class="px-6 py-3 border-b-2 border-transparent font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white">GST Calculator</button>
          </div>

          <!-- EMI View -->
          <div id="emiCalcView" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Loan Amount (₹)</label>
                <input type="number" id="emiPrincipal" value="500000" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-bold" oninput="computeEmi()">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Interest Rate (% p.a)</label>
                <input type="number" id="emiRate" value="8.5" step="0.1" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-bold" oninput="computeEmi()">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Tenure (Years)</label>
                <input type="number" id="emiTenure" value="5" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-bold" oninput="computeEmi()">
              </div>
            </div>

            <div class="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 text-center">
              <span class="block text-xs font-bold text-slate-500 mb-1">Monthly Loan EMI</span>
              <span id="emiMonthly" class="text-3xl sm:text-4xl font-black text-blue-600 dark:text-cyan-400">₹0</span>
              <div class="flex justify-center gap-6 mt-3 text-xs text-slate-500">
                <span>Total Interest: <strong id="emiTotalInterest" class="text-slate-800 dark:text-white">₹0</strong></span>
                <span>Total Payment: <strong id="emiTotalPayment" class="text-slate-800 dark:text-white">₹0</strong></span>
              </div>
            </div>
          </div>

          <!-- GST View -->
          <div id="gstCalcView" class="hidden space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Net Amount (₹)</label>
              <input type="number" id="gstAmount" value="10000" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white font-bold" oninput="computeGst()">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">GST Slab</label>
              <div class="grid grid-cols-5 gap-2 text-xs font-bold">
                <button type="button" onclick="setGstRate(3)" class="py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white">3%</button>
                <button type="button" onclick="setGstRate(5)" class="py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white">5%</button>
                <button type="button" onclick="setGstRate(12)" class="py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white">12%</button>
                <button type="button" onclick="setGstRate(18)" class="py-2 rounded-xl bg-blue-600 text-white">18%</button>
                <button type="button" onclick="setGstRate(28)" class="py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white">28%</button>
              </div>
            </div>
            <div class="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 text-center">
              <span class="block text-xs font-bold text-slate-500 mb-1">Total Gross Price (Incl. GST)</span>
              <span id="gstTotal" class="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">₹0</span>
              <div class="flex justify-center gap-6 mt-3 text-xs text-slate-500">
                <span>GST Added: <strong id="gstAdded" class="text-slate-800 dark:text-white">₹0</strong></span>
              </div>
            </div>
          </div>
        </div>
      `;
      setTimeout(computeEmi, 50);
    }

    function switchCalcTab(tab) {
      if (tab === 'emi') {
        document.getElementById('emiCalcView').classList.remove('hidden');
        document.getElementById('gstCalcView').classList.add('hidden');
        document.getElementById('tabEmiBtn').className = 'px-6 py-3 border-b-2 border-blue-600 font-bold text-sm text-blue-600 dark:text-cyan-400';
        document.getElementById('tabGstBtn').className = 'px-6 py-3 border-b-2 border-transparent font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white';
        computeEmi();
      } else {
        document.getElementById('emiCalcView').classList.add('hidden');
        document.getElementById('gstCalcView').classList.remove('hidden');
        document.getElementById('tabGstBtn').className = 'px-6 py-3 border-b-2 border-blue-600 font-bold text-sm text-blue-600 dark:text-cyan-400';
        document.getElementById('tabEmiBtn').className = 'px-6 py-3 border-b-2 border-transparent font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white';
        computeGst();
      }
    }

    function computeEmi() {
      const p = parseFloat(document.getElementById('emiPrincipal')?.value) || 0;
      const r = (parseFloat(document.getElementById('emiRate')?.value) || 0) / 12 / 100;
      const n = (parseFloat(document.getElementById('emiTenure')?.value) || 0) * 12;
      if (p <= 0 || r <= 0 || n <= 0) return;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPay = emi * n;
      const totalInt = totalPay - p;

      document.getElementById('emiMonthly').innerText = '₹' + Math.round(emi).toLocaleString();
      document.getElementById('emiTotalInterest').innerText = '₹' + Math.round(totalInt).toLocaleString();
      document.getElementById('emiTotalPayment').innerText = '₹' + Math.round(totalPay).toLocaleString();
    }

    let activeGstRate = 18;
    function setGstRate(rate) {
      activeGstRate = rate;
      computeGst();
    }
    function computeGst() {
      const amt = parseFloat(document.getElementById('gstAmount')?.value) || 0;
      const gst = (amt * activeGstRate) / 100;
      const gross = amt + gst;
      document.getElementById('gstTotal').innerText = '₹' + gross.toLocaleString();
      document.getElementById('gstAdded').innerText = '₹' + gst.toLocaleString();
    }

    /* ================= UTILITY 11: IMAGE FORMAT CONVERTER ================= */
    let imgFormatFile = null;
    let imgFormatImg = null;
    let targetMime = 'image/webp';
    let formatQuality = 0.90;
    let convertedDataUrl = null;
    let convertedBlobSize = 0;
    let convertedExt = 'webp';

    function formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function showFormatError(msg) {
      const alertBox = document.getElementById('formatErrorAlert');
      const alertMsg = document.getElementById('formatErrorMsg');
      if (alertBox && alertMsg) {
        alertMsg.innerText = msg;
        alertBox.classList.remove('hidden');
      } else {
        showToast(msg, 'error');
      }
    }

    function hideFormatError() {
      const alertBox = document.getElementById('formatErrorAlert');
      if (alertBox) alertBox.classList.add('hidden');
    }

    function handleFormatDragOver(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const dropZone = document.getElementById('formatDropZone');
      if (dropZone) {
        dropZone.classList.add('border-blue-600', 'bg-blue-50/80', 'dark:bg-blue-950/40');
      }
    }

    function handleFormatDragLeave(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      const dropZone = document.getElementById('formatDropZone');
      if (dropZone) {
        dropZone.classList.remove('border-blue-600', 'bg-blue-50/80', 'dark:bg-blue-950/40');
      }
    }

    function handleFormatDrop(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      handleFormatDragLeave(e);
      if (e && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        loadFormatFile(e.dataTransfer.files[0]);
      }
    }

    function handleFormatInput(input) {
      if (input && input.files && input.files[0]) {
        loadFormatFile(input.files[0]);
      }
    }

    function loadFormatFile(file) {
      hideFormatError();
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showFormatError('Please select a valid image file (PNG, JPG, WebP, GIF, BMP, or ICO).');
        return;
      }
      imgFormatFile = file;
      const reader = new FileReader();
      reader.onerror = () => {
        showFormatError('Could not read the selected image file. Please try another image.');
      };
      reader.onload = e => {
        const img = new Image();
        img.onerror = () => {
          showFormatError('The image appears corrupt or unreadable. Please choose a different file.');
        };
        img.onload = () => {
          imgFormatImg = img;
          displayFormatConfigureState();
          showToast('Image loaded successfully!', 'success');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function displayFormatConfigureState() {
      const uploadState = document.getElementById('formatUploadState');
      const configState = document.getElementById('formatConfigureState');
      const progressState = document.getElementById('formatProgressState');
      const resultState = document.getElementById('formatResultState');

      if (uploadState) uploadState.classList.add('hidden');
      if (progressState) progressState.classList.add('hidden');
      if (resultState) resultState.classList.add('hidden');
      if (configState) configState.classList.remove('hidden');

      const previewImg = document.getElementById('formatPreviewImg');
      if (previewImg && imgFormatImg) previewImg.src = imgFormatImg.src;

      const fileName = document.getElementById('formatFileName');
      if (fileName && imgFormatFile) fileName.innerText = imgFormatFile.name;

      const dim = document.getElementById('formatDimensions');
      if (dim && imgFormatImg) dim.innerText = `${imgFormatImg.naturalWidth} × ${imgFormatImg.naturalHeight} px`;

      const origSize = document.getElementById('formatOriginalSize');
      if (origSize && imgFormatFile) origSize.innerText = formatFileSize(imgFormatFile.size);

      const origBadge = document.getElementById('formatOriginalType');
      if (origBadge && imgFormatFile) {
        const rawType = imgFormatFile.type.replace('image/', '').toUpperCase() || 'IMAGE';
        origBadge.innerText = rawType;
      }

      setTargetFormat(targetMime);
    }

    function setTargetFormat(mime) {
      targetMime = mime;
      const formats = [
        { mime: 'image/webp', id: 'fmtWebpCard', name: 'WebP', ext: 'webp' },
        { mime: 'image/png', id: 'fmtPngCard', name: 'PNG', ext: 'png' },
        { mime: 'image/jpeg', id: 'fmtJpgCard', name: 'JPG', ext: 'jpg' },
        { mime: 'image/x-icon', id: 'fmtIcoCard', name: 'ICO', ext: 'ico' }
      ];

      formats.forEach(f => {
        const card = document.getElementById(f.id);
        if (!card) return;
        const icon = card.querySelector('.fmt-check-icon');
        if (f.mime === mime) {
          card.className = 'format-card-active relative p-3 sm:p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]';
          if (icon) icon.classList.remove('opacity-0');
        } else {
          card.className = 'format-card-inactive relative p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]';
          if (icon) icon.classList.add('opacity-0');
        }
      });

      const qBox = document.getElementById('formatQualityBox');
      const infoBox = document.getElementById('formatFormatInfoText');
      const actionBtnText = document.getElementById('formatConvertBtnText');

      const activeFmt = formats.find(f => f.mime === mime);
      if (actionBtnText && activeFmt) {
        actionBtnText.innerText = `Convert to ${activeFmt.name}`;
      }

      if (mime === 'image/webp') {
        if (qBox) qBox.classList.remove('hidden');
        if (infoBox) infoBox.innerText = '⚡ WebP offers up to 30-40% smaller file size with high visual quality across all modern browsers.';
      } else if (mime === 'image/jpeg') {
        if (qBox) qBox.classList.remove('hidden');
        if (infoBox) infoBox.innerText = '💡 JPG does not support transparency. Transparent areas will be synthesized with a clean white background.';
      } else if (mime === 'image/png') {
        if (qBox) qBox.classList.add('hidden');
        if (infoBox) infoBox.innerText = '🔒 Lossless quality is automatically preserved with full alpha transparency support.';
      } else if (mime === 'image/x-icon') {
        if (qBox) qBox.classList.add('hidden');
        if (infoBox) infoBox.innerText = '🏷️ Exported as a favicon ICO file formatted for website tabs and bookmarks.';
      }
    }

    function executeImageConversion() {
      if (!imgFormatImg) {
        showFormatError('No image loaded to convert.');
        return;
      }

      const configState = document.getElementById('formatConfigureState');
      const progressState = document.getElementById('formatProgressState');
      const resultState = document.getElementById('formatResultState');
      const pBar = document.getElementById('conversionProgressBar');
      const pText = document.getElementById('conversionProgressText');

      if (configState) configState.classList.add('hidden');
      if (resultState) resultState.classList.add('hidden');
      if (progressState) progressState.classList.remove('hidden');

      if (pBar) pBar.style.width = '25%';
      if (pText) pText.innerText = 'Initializing canvas rendering...';

      setTimeout(() => {
        if (pBar) pBar.style.width = '65%';
        if (pText) pText.innerText = 'Encoding pixels to target format...';

        setTimeout(() => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = imgFormatImg.naturalWidth;
            canvas.height = imgFormatImg.naturalHeight;
            const ctx = canvas.getContext('2d');

            if (targetMime === 'image/jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(imgFormatImg, 0, 0);

            convertedExt = targetMime === 'image/webp' ? 'webp' : (targetMime === 'image/png' ? 'png' : (targetMime === 'image/x-icon' ? 'ico' : 'jpg'));
            const exportMime = targetMime === 'image/x-icon' ? 'image/png' : targetMime;
            convertedDataUrl = canvas.toDataURL(exportMime, formatQuality);

            const base64Str = convertedDataUrl.split(',')[1] || '';
            convertedBlobSize = Math.round(base64Str.length * 0.75);

            if (pBar) pBar.style.width = '100%';
            if (pText) pText.innerText = 'Conversion finished!';

            setTimeout(() => {
              displayFormatResultState();
            }, 250);
          } catch (err) {
            console.error('Conversion error:', err);
            displayFormatConfigureState();
            showFormatError('Conversion failed: ' + (err.message || 'Browser memory or canvas error.'));
          }
        }, 250);
      }, 200);
    }

    function displayFormatResultState() {
      const progressState = document.getElementById('formatProgressState');
      const resultState = document.getElementById('formatResultState');

      if (progressState) progressState.classList.add('hidden');
      if (resultState) resultState.classList.remove('hidden');

      const resultImg = document.getElementById('formatResultPreviewImg');
      if (resultImg && convertedDataUrl) resultImg.src = convertedDataUrl;

      const baseName = imgFormatFile ? imgFormatFile.name.replace(/\.[^/.]+$/, "") : "image";
      const outName = `converted-${baseName}.${convertedExt}`;

      const resNameEl = document.getElementById('formatResultFilename');
      if (resNameEl) resNameEl.innerText = outName;

      const origSizeEl = document.getElementById('formatResultOrigSize');
      if (origSizeEl && imgFormatFile) origSizeEl.innerText = formatFileSize(imgFormatFile.size);

      const newSizeEl = document.getElementById('formatResultNewSize');
      if (newSizeEl) newSizeEl.innerText = formatFileSize(convertedBlobSize);

      const diffBadge = document.getElementById('formatResultDiffBadge');
      if (diffBadge && imgFormatFile && imgFormatFile.size > 0) {
        const diff = imgFormatFile.size - convertedBlobSize;
        const pct = Math.round(Math.abs(diff) / imgFormatFile.size * 100);
        if (diff > 0) {
          diffBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          diffBadge.innerText = `${pct}% smaller (-${formatFileSize(diff)})`;
        } else if (diff < 0) {
          diffBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
          diffBadge.innerText = `+${formatFileSize(Math.abs(diff))} (lossless)`;
        } else {
          diffBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
          diffBadge.innerText = 'Same size';
        }
      }

      const resDim = document.getElementById('formatResultDimensions');
      if (resDim && imgFormatImg) resDim.innerText = `${imgFormatImg.naturalWidth} × ${imgFormatImg.naturalHeight} px`;

      const downloadBtnText = document.getElementById('formatDownloadBtnText');
      if (downloadBtnText) downloadBtnText.innerText = `Download .${convertedExt.toUpperCase()} (${formatFileSize(convertedBlobSize)})`;

      showToast('Image converted successfully!', 'success');
      triggerConfetti();
    }

    function downloadConvertedFormat() {
      if (!convertedDataUrl) return;
      const baseName = imgFormatFile ? imgFormatFile.name.replace(/\.[^/.]+$/, "") : "image";
      const a = document.createElement('a');
      a.href = convertedDataUrl;
      a.download = `converted-${baseName}.${convertedExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Download started!', 'success');
    }

    function resetToUpload() {
      imgFormatFile = null;
      imgFormatImg = null;
      convertedDataUrl = null;
      convertedBlobSize = 0;
      hideFormatError();

      const input = document.getElementById('formatInput');
      if (input) input.value = '';

      const uploadState = document.getElementById('formatUploadState');
      const configState = document.getElementById('formatConfigureState');
      const progressState = document.getElementById('formatProgressState');
      const resultState = document.getElementById('formatResultState');

      if (configState) configState.classList.add('hidden');
      if (progressState) progressState.classList.add('hidden');
      if (resultState) resultState.classList.add('hidden');
      if (uploadState) uploadState.classList.remove('hidden');
    }

    function backToConfigure() {
      displayFormatConfigureState();
    }

    function renderImgFormat(title, icon, container) {
      if (title) title.innerText = 'Image Format Converter (PNG, JPG, WebP, GIF, ICO)';
      if (icon) icon.className = 'fa-solid fa-arrows-rotate';
      container.innerHTML = `
        <div class="space-y-6">
          <!-- Error Alert Banner -->
          <div id="formatErrorAlert" class="hidden p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-xs">
            <div class="flex items-start gap-2.5">
              <i class="fa-solid fa-circle-exclamation text-red-600 dark:text-red-400 text-base mt-0.5 shrink-0"></i>
              <span id="formatErrorMsg">Error loading image.</span>
            </div>
            <button type="button" onclick="hideFormatError()" class="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold text-xs" aria-label="Dismiss error">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- State 1: Upload Dropzone -->
          <div id="formatUploadState" class="space-y-6">
            <div id="formatDropZone" 
                 ondragover="handleFormatDragOver(event)" 
                 ondragleave="handleFormatDragLeave(event)" 
                 ondrop="handleFormatDrop(event)"
                 onclick="document.getElementById('formatInput').click()"
                 class="relative border-2 border-dashed border-blue-300 dark:border-blue-700/60 hover:border-blue-600 dark:hover:border-blue-400 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-14 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/5 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] group">
              
              <input type="file" id="formatInput" accept="image/*" class="hidden" onchange="handleFormatInput(this)">
              
              <div class="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md shadow-blue-500/10">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              
              <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-[1.02] transition-all">
                <i class="fa-solid fa-folder-open"></i> Choose Image to Convert
              </span>
              
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">
                or drag and drop your image file here
              </p>
              
              <div class="flex items-center justify-center gap-2 flex-wrap mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">PNG</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">JPG / JPEG</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">WEBP</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">GIF</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">BMP</span>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-700">ICO</span>
              </div>
              
              <p class="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-medium">
                <i class="fa-solid fa-lock text-emerald-600"></i> 100% Client-Side • No server upload • Zero data leaves your device
              </p>
            </div>
          </div>

          <!-- State 2: Configuration & Preview State -->
          <div id="formatConfigureState" class="hidden space-y-6">
            <!-- Top File Header Card -->
            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shrink-0 border border-blue-100 dark:border-blue-800">
                  <i class="fa-solid fa-image"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span id="formatFileName" class="font-bold text-slate-900 dark:text-white text-sm truncate max-w-xs sm:max-w-md">image.png</span>
                    <span id="formatOriginalType" class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">PNG</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    <span id="formatDimensions">0 x 0 px</span>
                    <span>•</span>
                    <span id="formatOriginalSize">0 KB</span>
                  </div>
                </div>
              </div>
              <button type="button" onclick="document.getElementById('formatInput').click()" class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 min-h-[38px]">
                <i class="fa-solid fa-rotate text-xs"></i> Change Image
              </button>
            </div>

            <!-- Main 2-Column Responsive Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <!-- Left Column: Image Preview -->
              <div class="lg:col-span-5 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Image Preview</span>
                  <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-[10px]"></i> Original Loaded
                  </span>
                </div>
                <div class="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 checkerboard-bg flex justify-center items-center min-h-[260px] max-h-[360px] overflow-hidden shadow-2xs">
                  <img id="formatPreviewImg" class="max-h-[320px] max-w-full object-contain rounded-xl" alt="Selected Preview">
                </div>
              </div>

              <!-- Right Column: Conversion Options -->
              <div class="lg:col-span-7 space-y-5">
                <!-- Target Format Selector -->
                <div class="space-y-2.5">
                  <label class="block font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 1: Choose Target Format
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <!-- WebP -->
                    <div id="fmtWebpCard" onclick="setTargetFormat('image/webp')" class="format-card-active relative p-3 sm:p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]">
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold text-sm sm:text-base">WebP</span>
                        <i class="fa-solid fa-circle-check text-blue-600 text-sm fmt-check-icon"></i>
                      </div>
                      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">Modern &amp; Web</span>
                      <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 w-fit">Smallest</span>
                    </div>

                    <!-- PNG -->
                    <div id="fmtPngCard" onclick="setTargetFormat('image/png')" class="format-card-inactive relative p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]">
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold text-sm sm:text-base">PNG</span>
                        <i class="fa-solid fa-circle-check text-blue-600 text-sm fmt-check-icon opacity-0"></i>
                      </div>
                      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">Lossless &amp; Clear</span>
                      <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 w-fit">Transparent</span>
                    </div>

                    <!-- JPG -->
                    <div id="fmtJpgCard" onclick="setTargetFormat('image/jpeg')" class="format-card-inactive relative p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]">
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold text-sm sm:text-base">JPG</span>
                        <i class="fa-solid fa-circle-check text-blue-600 text-sm fmt-check-icon opacity-0"></i>
                      </div>
                      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">Universal Photo</span>
                      <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 w-fit">Compatible</span>
                    </div>

                    <!-- ICO -->
                    <div id="fmtIcoCard" onclick="setTargetFormat('image/x-icon')" class="format-card-inactive relative p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer transition-all flex flex-col justify-between text-left min-h-[88px]">
                      <div class="flex items-center justify-between">
                        <span class="font-extrabold text-sm sm:text-base">ICO</span>
                        <i class="fa-solid fa-circle-check text-blue-600 text-sm fmt-check-icon opacity-0"></i>
                      </div>
                      <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-1">Favicon Icon</span>
                      <span class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 w-fit">Browser Tab</span>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Quality & Options -->
                <div class="space-y-3">
                  <!-- Quality Slider (WebP / JPG) -->
                  <div id="formatQualityBox" class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div class="flex justify-between items-center font-bold">
                      <span class="text-slate-700 dark:text-slate-300">Compression Quality:</span>
                      <span id="fmtQualityVal" class="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-mono font-extrabold text-xs">90%</span>
                    </div>
                    <input type="range" id="fmtQualitySlider" min="10" max="100" value="90" oninput="formatQuality = parseInt(this.value)/100; document.getElementById('fmtQualityVal').innerText = this.value + '%';" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-blue-600 cursor-pointer">
                    <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Smaller file (10%)</span>
                      <span>Balanced</span>
                      <span>Highest quality (100%)</span>
                    </div>
                  </div>

                  <!-- Format Information Banner -->
                  <div class="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <i class="fa-solid fa-circle-info text-blue-500 mt-0.5 shrink-0 text-sm"></i>
                    <span id="formatFormatInfoText" class="leading-relaxed">⚡ WebP offers up to 30-40% smaller file size with high visual quality across all modern browsers.</span>
                  </div>
                </div>

                <!-- Step 3: Convert Action Button -->
                <button type="button" onclick="executeImageConversion()" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] min-h-[52px]">
                  <i class="fa-solid fa-arrows-rotate text-lg"></i>
                  <span id="formatConvertBtnText">Convert to WebP</span>
                </button>
              </div>
            </div>
          </div>

          <!-- State 3: Conversion Progress State -->
          <div id="formatProgressState" class="hidden py-12 px-4 text-center space-y-6">
            <div class="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mx-auto shadow-sm animate-pulse">
              <i class="fa-solid fa-arrows-rotate animate-spin"></i>
            </div>
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Converting Image...</h3>
              <p id="conversionProgressText" class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Rendering canvas pixels and encoding to target format...
              </p>
            </div>
            <div class="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden shadow-inner">
              <div id="conversionProgressBar" class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width: 25%"></div>
            </div>
          </div>

          <!-- State 4: Result State -->
          <div id="formatResultState" class="hidden space-y-6">
            <!-- Success Banner -->
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <span class="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-100 block">Conversion Completed Successfully!</span>
                  <span class="text-xs text-emerald-700 dark:text-emerald-300">Your converted image is ready to download.</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span id="formatResultDiffBadge" class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Ready</span>
              </div>
            </div>

            <!-- Comparison Summary Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Original Size</span>
                <span id="formatResultOrigSize" class="text-base font-extrabold text-slate-800 dark:text-slate-100">0 KB</span>
              </div>
              <div class="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800">
                <span class="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider mb-1">Converted Size</span>
                <span id="formatResultNewSize" class="text-base font-extrabold text-blue-700 dark:text-blue-300">0 KB</span>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Resolution</span>
                <span id="formatResultDimensions" class="text-base font-extrabold text-slate-800 dark:text-slate-100">0 x 0 px</span>
              </div>
            </div>

            <!-- Converted Image Preview Box -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Converted Image Preview:</span>
                <span id="formatResultFilename" class="text-blue-600 dark:text-blue-400 font-mono text-[11px] truncate max-w-xs">converted-image.webp</span>
              </div>
              <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 checkerboard-bg flex justify-center items-center max-h-[360px] overflow-hidden shadow-2xs">
                <img id="formatResultPreviewImg" class="max-h-[320px] max-w-full object-contain rounded-xl shadow-xs" alt="Converted Preview">
              </div>
            </div>

            <!-- Primary Download Action & Secondary Buttons -->
            <div class="space-y-3">
              <button type="button" onclick="downloadConvertedFormat()" class="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] min-h-[52px]">
                <i class="fa-solid fa-download text-lg"></i>
                <span id="formatDownloadBtnText">Download Converted Image</span>
              </button>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button type="button" onclick="backToConfigure()" class="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 min-h-[44px]">
                  <i class="fa-solid fa-sliders text-xs"></i> Change Output Format
                </button>
                <button type="button" onclick="resetToUpload()" class="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 min-h-[44px]">
                  <i class="fa-solid fa-rotate-right text-xs"></i> Convert Another Image
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    /* ================= UTILITY 12: TEXT CASE CONVERTER ================= */
    let textCaseHistory = [];

    function saveCaseHistory(val) {
      if (typeof val !== 'string') return;
      textCaseHistory.push(val);
      if (textCaseHistory.length > 25) {
        textCaseHistory.shift();
      }
    }

    function updateTextCaseStats() {
      const el = document.getElementById('textCaseInput');
      const val = el ? el.value : '';
      const charEl = document.getElementById('textCaseCharCount');
      const wordEl = document.getElementById('textCaseWordCount');
      if (charEl) {
        charEl.innerText = `${val.length} character${val.length === 1 ? '' : 's'}`;
      }
      if (wordEl) {
        const words = val.trim().split(/\s+/).filter(Boolean);
        wordEl.innerText = `${words.length} word${words.length === 1 ? '' : 's'}`;
      }
    }

    function undoCase() {
      const el = document.getElementById('textCaseInput');
      if (!el) return;
      if (!textCaseHistory || textCaseHistory.length === 0) {
        showToast('Nothing to undo', 'info');
        return;
      }
      const prev = textCaseHistory.pop();
      el.value = prev;
      el.focus();
      updateTextCaseStats();
      showToast('Restored previous text!', 'success');
    }

    function clearTextCase() {
      const el = document.getElementById('textCaseInput');
      if (!el || !el.value) return;
      saveCaseHistory(el.value);
      el.value = '';
      el.focus();
      updateTextCaseStats();
      showToast('Text cleared', 'info');
    }

    async function pasteTextCase() {
      const el = document.getElementById('textCaseInput');
      if (!el) return;
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          const text = await navigator.clipboard.readText();
          if (!text) {
            showToast('Clipboard is empty', 'warning');
            return;
          }
          saveCaseHistory(el.value);
          el.value = text;
          el.focus();
          updateTextCaseStats();
          showToast('Text pasted from clipboard!', 'success');
        } catch (err) {
          showToast('Clipboard access was blocked or denied. Press Ctrl+V / Cmd+V to paste.', 'warning');
        }
      } else {
        showToast('Direct paste not supported by browser. Press Ctrl+V / Cmd+V to paste.', 'info');
      }
    }

    function downloadTextCase() {
      const el = document.getElementById('textCaseInput');
      const val = el ? el.value : '';
      if (!val) {
        showToast('Please enter some text to download', 'warning');
        return;
      }
      const blob = new Blob([val], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded converted-text.txt!', 'success');
    }

    function copyTextCase() {
      const el = document.getElementById('textCaseInput');
      const val = el ? el.value : '';
      if (!val) {
        showToast('Nothing to copy. Enter some text first.', 'warning');
        return;
      }
      copyText(val);
    }

    function renderTextCase(title, icon, container) {
      if (title) title.innerText = 'Text Case Converter';
      if (icon) icon.className = 'fa-solid fa-font';
      container.innerHTML = `
        <div class="space-y-4">
          <textarea id="textCaseInput" rows="7" oninput="updateTextCaseStats()" placeholder="Type or paste text to convert case..." class="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"></textarea>

          <!-- Action & Metrics Toolbar -->
          <div class="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pl-1">
              <span id="textCaseWordCount">0 words</span>
              <span>&bull;</span>
              <span id="textCaseCharCount">0 characters</span>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button type="button" onclick="pasteTextCase()" title="Paste from clipboard" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-paste text-slate-400 text-[11px]"></i> Paste
              </button>
              <button type="button" onclick="undoCase()" title="Undo last conversion" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-rotate-left text-slate-400 text-[11px]"></i> Undo
              </button>
              <button type="button" onclick="clearTextCase()" title="Clear text area" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-trash-can text-[11px]"></i> Clear
              </button>
              <button type="button" onclick="downloadTextCase()" title="Download as .txt file" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs">
                <i class="fa-solid fa-download text-slate-400 text-[11px]"></i> Download .txt
              </button>
              <button type="button" onclick="copyTextCase()" title="Copy converted text" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5">
                <i class="fa-solid fa-copy text-[11px]"></i> Copy Text
              </button>
            </div>
          </div>

          <!-- Conversion Formats Grid -->
          <div class="space-y-2.5 pt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Formats</span>
              <span class="text-[11px] text-slate-400">Click to convert instantly</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              <button type="button" onclick="transformCase('sentence')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">Sentence case</button>
              <button type="button" onclick="transformCase('lower')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">lowercase</button>
              <button type="button" onclick="transformCase('upper')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">UPPERCASE</button>
              <button type="button" onclick="transformCase('title')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">Title Case</button>
              <button type="button" onclick="transformCase('camel')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">camelCase</button>
              <button type="button" onclick="transformCase('pascal')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">PascalCase</button>
              <button type="button" onclick="transformCase('snake')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">snake_case</button>
              <button type="button" onclick="transformCase('constant')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">CONSTANT_CASE</button>
              <button type="button" onclick="transformCase('kebab')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">kebab-case</button>
              <button type="button" onclick="transformCase('slug')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">url-slug</button>
              <button type="button" onclick="transformCase('dot')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">dot.case</button>
              <button type="button" onclick="transformCase('alternating')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center">aLtErNaTiNg CaSe</button>
              <button type="button" onclick="transformCase('invert')" class="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl transition-all text-center col-span-2 sm:col-span-1">iNVERT cASE</button>
            </div>
          </div>
        </div>
      `;
    }

    function transformCase(mode) {
      const el = document.getElementById('textCaseInput');
      if (!el) return;
      const str = el.value;
      if (!str) {
        showToast('Please enter or paste some text first', 'warning');
        return;
      }

      // Save state to undo history before applying conversion
      saveCaseHistory(str);

      // Normalize Unicode diacritics / accents (café -> cafe, résumé -> resume, Über -> Uber)
      const removeAccents = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (mode === 'upper') {
        el.value = str.toUpperCase();
      } else if (mode === 'lower') {
        el.value = str.toLowerCase();
      } else if (mode === 'title') {
        // Unicode-aware word boundary capitalization; replace deprecated substr() with slice()
        el.value = str.toLowerCase().replace(/(^|[^\p{L}\p{N}'])([\p{L}])/gu, (m, sep, letter) => sep + letter.toUpperCase());
      } else if (mode === 'sentence') {
        // Lookbehind-free Sentence case with quotes, brackets, multiline, standalone "I", and protected URLs/domains
        let s = str.toLowerCase();
        s = s.replace(/(^|[.?!](?:\s+|["'”’)\}\]>]\s*)|\n\s*)(["'“‘(\[{<—\s]*)(\p{L})/gu, (m, prefix, leading, letter) => {
          return prefix + leading + letter.toUpperCase();
        });
        s = s.replace(/\b(i)('m|'ve|'ll|'d)?\b/gi, (m, p1, p2) => {
          return 'I' + (p2 ? p2.toLowerCase() : '');
        });
        s = s.replace(/\b(e\.g\.|i\.e\.|vs\.)\s+(\p{L})/giu, (m, abbr, letter) => {
          return abbr.toLowerCase() + ' ' + letter.toLowerCase();
        });
        el.value = s;
      } else if (mode === 'slug' || mode === 'kebab') {
        // Clean URL slug & kebab-case: normalized Unicode diacritics, stripped apostrophes, no stray hyphens
        el.value = removeAccents(str)
          .replace(/['’]/g, '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      } else if (mode === 'snake') {
        // Clean snake_case: normalized Unicode diacritics, no leading/trailing underscores, collapsed separators
        el.value = removeAccents(str)
          .replace(/['’]/g, '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      } else if (mode === 'constant') {
        // Clean CONSTANT_CASE (SCREAMING_SNAKE_CASE): uppercase, normalized diacritics, underscores
        el.value = removeAccents(str)
          .replace(/['’]/g, '')
          .toUpperCase()
          .trim()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      } else if (mode === 'dot') {
        // Clean dot.case: normalized diacritics, lowercase, separated by periods, no stray dots
        el.value = removeAccents(str)
          .replace(/['’]/g, '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '.')
          .replace(/^\.+|\.+$/g, '');
      } else if (mode === 'camel') {
        // Clean camelCase: normalized Unicode diacritics, guaranteed lowercase first word, no trailing punctuation
        const words = removeAccents(str)
          .replace(/['’]/g, '')
          .trim()
          .split(/[^a-zA-Z0-9]+/)
          .filter(Boolean);
        if (words.length === 0) {
          el.value = '';
        } else {
          el.value = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        }
      } else if (mode === 'pascal') {
        // Clean PascalCase: normalized diacritics, every word capitalized, joined without separators
        const words = removeAccents(str)
          .replace(/['’]/g, '')
          .trim()
          .split(/[^a-zA-Z0-9]+/)
          .filter(Boolean);
        if (words.length === 0) {
          el.value = '';
        } else {
          el.value = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        }
      } else if (mode === 'alternating') {
        // aLtErNaTiNg CaSe: alternating letter case, preserving spaces and punctuation
        let upper = false;
        let res = '';
        for (const char of str) {
          if (/\p{L}/u.test(char)) {
            res += upper ? char.toUpperCase() : char.toLowerCase();
            upper = !upper;
          } else {
            res += char;
          }
        }
        el.value = res;
      } else if (mode === 'invert') {
        // iNVERT cASE: toggle casing for each letter
        let res = '';
        for (const char of str) {
          if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            res += char.toLowerCase();
          } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
            res += char.toUpperCase();
          } else {
            res += char;
          }
        }
        el.value = res;
      }
      updateTextCaseStats();
      showToast('Text converted!', 'success');
    }

    /* ================= UTILITY 13: JSON FORMATTER ================= */
    let jsonHistory = [];

    function saveJsonHistory(val) {
      if (typeof val !== 'string') return;
      jsonHistory.push(val);
      if (jsonHistory.length > 25) {
        jsonHistory.shift();
      }
    }

    function escapeJsonHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function getByteLength(str) {
      if (typeof Blob !== 'undefined') {
        try { return new Blob([str]).size; } catch (e) {}
      }
      if (typeof Buffer !== 'undefined') {
        return Buffer.byteLength(str, 'utf8');
      }
      return encodeURI(str).split(/%..|./).length - 1;
    }

    function getLineColFromIndex(text, index) {
      const clamped = Math.max(0, Math.min(index, text.length));
      const upTo = text.slice(0, clamped);
      const lines = upTo.split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      return { line, col };
    }

    function createErrorExcerpt(text, targetLine, targetCol) {
      const lines = text.split('\n');
      const lineIdx = targetLine - 1;
      const startIdx = Math.max(0, lineIdx - 1);
      const endIdx = Math.min(lines.length - 1, lineIdx + 1);

      const excerptLines = [];
      for (let i = startIdx; i <= endIdx; i++) {
        const lineNum = String(i + 1).padStart(4, ' ');
        const isErrorLine = i === lineIdx;
        const prefix = isErrorLine ? '> ' : '  ';
        excerptLines.push(`${prefix}${lineNum} | ${lines[i]}`);
        if (isErrorLine) {
          const caretIndent = ' '.repeat(Math.max(0, targetCol - 1));
          excerptLines.push(`       | ${caretIndent}^`);
        }
      }
      return excerptLines.join('\n');
    }

    function scanJsonError(text) {
      let pos = 0;
      const len = text.length;

      function isWhitespace(ch) {
        return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
      }

      function skipWhitespace() {
        while (pos < len && isWhitespace(text[pos])) {
          pos++;
        }
      }

      function parseValue() {
        skipWhitespace();
        if (pos >= len) {
          return { error: 'Unexpected end of JSON input', pos };
        }
        const ch = text[pos];
        if (ch === '{') return parseObject();
        if (ch === '[') return parseArray();
        if (ch === '"') return parseString();
        if (ch === '-' || (ch >= '0' && ch <= '9')) return parseNumber();
        if (text.startsWith('true', pos)) { pos += 4; return null; }
        if (text.startsWith('false', pos)) { pos += 5; return null; }
        if (text.startsWith('null', pos)) { pos += 4; return null; }

        if (ch === "'") {
          return { error: 'Single quotes are not valid in JSON; use double quotes', pos };
        }
        if (ch === ',') {
          return { error: 'Unexpected comma', pos };
        }
        if (ch === '}' || ch === ']') {
          return { error: `Unexpected closing bracket '${ch}'`, pos };
        }
        return { error: `Unexpected token '${ch}'`, pos };
      }

      function parseString() {
        pos++;
        while (pos < len) {
          const ch = text[pos];
          if (ch === '"') {
            pos++;
            return null;
          }
          if (ch === '\\') {
            pos++;
            if (pos >= len) return { error: 'Unterminated string escape sequence', pos };
            const esc = text[pos];
            if ('"\\/bfnrt'.includes(esc)) {
              pos++;
            } else if (esc === 'u') {
              pos++;
              for (let i = 0; i < 4; i++) {
                if (pos >= len || !/[0-9a-fA-F]/.test(text[pos])) {
                  return { error: 'Invalid Unicode escape sequence in string', pos };
                }
                pos++;
              }
            } else {
              return { error: `Invalid escape character '\\${esc}'`, pos };
            }
          } else if (ch === '\n' || ch === '\r') {
            return { error: 'Unescaped newline in string literal', pos };
          } else {
            pos++;
          }
        }
        return { error: 'Unterminated string literal', pos };
      }

      function parseNumber() {
        const start = pos;
        if (text[pos] === '-') pos++;
        if (pos >= len) return { error: 'Invalid number', pos: start };

        if (text[pos] === '0') {
          pos++;
        } else if (text[pos] >= '1' && text[pos] <= '9') {
          while (pos < len && text[pos] >= '0' && text[pos] <= '9') pos++;
        } else {
          return { error: 'Invalid number format', pos };
        }

        if (pos < len && text[pos] === '.') {
          pos++;
          if (pos >= len || !(text[pos] >= '0' && text[pos] <= '9')) {
            return { error: 'Decimal point must be followed by at least one digit', pos };
          }
          while (pos < len && text[pos] >= '0' && text[pos] <= '9') pos++;
        }

        if (pos < len && (text[pos] === 'e' || text[pos] === 'E')) {
          pos++;
          if (pos < len && (text[pos] === '+' || text[pos] === '-')) pos++;
          if (pos >= len || !(text[pos] >= '0' && text[pos] <= '9')) {
            return { error: 'Exponent must be followed by at least one digit', pos };
          }
          while (pos < len && text[pos] >= '0' && text[pos] <= '9') pos++;
        }
        return null;
      }

      function parseObject() {
        pos++;
        skipWhitespace();
        if (pos < len && text[pos] === '}') {
          pos++;
          return null;
        }

        while (pos < len) {
          skipWhitespace();
          if (pos >= len) return { error: "Expected '}' but reached end of input", pos };
          if (text[pos] === '}') return { error: 'Trailing comma before object closing brace', pos };

          if (text[pos] !== '"') {
            if (text[pos] === "'") {
              return { error: 'Object keys must be wrapped in double quotes, not single quotes', pos };
            }
            if (text[pos] === ',') {
              return { error: 'Unexpected comma in object', pos };
            }
            return { error: `Expected double-quoted property name, found '${text[pos]}'`, pos };
          }

          const strErr = parseString();
          if (strErr) return strErr;

          skipWhitespace();
          if (pos >= len || text[pos] !== ':') {
            return { error: "Expected ':' after property name", pos };
          }
          pos++;

          const valErr = parseValue();
          if (valErr) return valErr;

          skipWhitespace();
          if (pos >= len) return { error: "Expected ',' or '}' after property value", pos };
          if (text[pos] === ',') {
            pos++;
          } else if (text[pos] === '}') {
            pos++;
            return null;
          } else {
            return { error: `Expected ',' or '}' after property value, found '${text[pos]}'`, pos };
          }
        }
        return { error: "Unclosed object; expected '}'", pos };
      }

      function parseArray() {
        pos++;
        skipWhitespace();
        if (pos < len && text[pos] === ']') {
          pos++;
          return null;
        }

        while (pos < len) {
          skipWhitespace();
          if (pos >= len) return { error: "Expected ']' but reached end of input", pos };
          if (text[pos] === ']') return { error: 'Trailing comma before array closing bracket', pos };

          const valErr = parseValue();
          if (valErr) return valErr;

          skipWhitespace();
          if (pos >= len) return { error: "Expected ',' or ']' after array element", pos };
          if (text[pos] === ',') {
            pos++;
          } else if (text[pos] === ']') {
            pos++;
            return null;
          } else {
            return { error: `Expected ',' or ']' after array element, found '${text[pos]}'`, pos };
          }
        }
        return { error: "Unclosed array; expected ']'", pos };
      }

      const err = parseValue();
      if (err) return err;

      skipWhitespace();
      if (pos < len) {
        return { error: `Unexpected trailing characters after JSON value: '${text.slice(pos, pos + 10)}'`, pos };
      }
      return null;
    }

    function parseJsonWithDiagnostics(text) {
      if (!text || !text.trim()) {
        return { valid: false, empty: true, message: 'Please enter or paste JSON data to format and validate.' };
      }

      try {
        const parsed = JSON.parse(text);
        let rootType = 'Primitive';
        let summary = '';

        if (Array.isArray(parsed)) {
          rootType = 'Array';
          summary = `Array with ${parsed.length} item${parsed.length === 1 ? '' : 's'}`;
        } else if (parsed === null) {
          rootType = 'Null';
          summary = 'Null literal value';
        } else if (typeof parsed === 'object') {
          rootType = 'Object';
          const keys = Object.keys(parsed);
          summary = `Object with ${keys.length} top-level key${keys.length === 1 ? '' : 's'}`;
        } else {
          rootType = typeof parsed;
          rootType = rootType.charAt(0).toUpperCase() + rootType.slice(1);
          summary = `Primitive ${rootType} (${JSON.stringify(parsed)})`;
        }

        const lines = text.split('\n').length;
        const bytes = getByteLength(text);
        const sizeStr = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

        return {
          valid: true,
          empty: false,
          parsed,
          rootType,
          summary,
          stats: { lines, bytes, sizeStr, chars: text.length }
        };
      } catch (nativeErr) {
        let line = 1;
        let col = 1;
        let message = nativeErr.message || 'Syntax Error';

        const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i) ||
                             message.match(/at\s+line\s+(\d+)\s+column\s+(\d+)/i);
        const posMatch = message.match(/position\s+(\d+)/i) ||
                         message.match(/at\s+position\s+(\d+)/i);

        if (lineColMatch) {
          line = parseInt(lineColMatch[1], 10);
          col = parseInt(lineColMatch[2], 10);
        } else if (posMatch) {
          const pos = parseInt(posMatch[1], 10);
          const lc = getLineColFromIndex(text, pos);
          line = lc.line;
          col = lc.col;
        } else {
          const scanErr = scanJsonError(text);
          if (scanErr) {
            const lc = getLineColFromIndex(text, scanErr.pos);
            line = lc.line;
            col = lc.col;
            if (scanErr.error) {
              message = scanErr.error;
            }
          }
        }

        const excerpt = createErrorExcerpt(text, line, col);
        return {
          valid: false,
          empty: false,
          message,
          line,
          col,
          excerpt
        };
      }
    }

    function resetJsonStatusBanner() {
      const banner = document.getElementById('jsonStatusBanner');
      if (!banner) return;
      banner.className = 'p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 transition-all';
      banner.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-sm">
            <i class="fa-solid fa-info"></i>
          </div>
          <div class="flex-1 space-y-1">
            <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200">Ready to Validate &amp; Format</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste your JSON above and click <span class="font-semibold text-slate-700 dark:text-slate-300">Validate JSON</span> to inspect syntax, or choose <span class="font-semibold text-slate-700 dark:text-slate-300">Beautify</span> / <span class="font-semibold text-slate-700 dark:text-slate-300">Minify</span>. All processing occurs 100% inside your local browser.
            </p>
          </div>
        </div>
      `;
    }

    function updateJsonStatus(diag) {
      const banner = document.getElementById('jsonStatusBanner');
      if (!banner) return;
      if (!diag || diag.empty) {
        resetJsonStatusBanner();
        return;
      }
      if (diag.valid) {
        banner.className = 'p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 transition-all';
        banner.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-sm">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="flex-1 space-y-1">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <h3 class="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  Valid JSON (${escapeJsonHtml(diag.rootType)})
                </h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Syntax OK</span>
              </div>
              <p class="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed font-medium">
                ${escapeJsonHtml(diag.summary)} • ${diag.stats ? diag.stats.sizeStr : ''} • ${diag.stats ? diag.stats.lines : 0} line${diag.stats && diag.stats.lines === 1 ? '' : 's'} • ${diag.stats ? diag.stats.chars : 0} char${diag.stats && diag.stats.chars === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        `;
      } else {
        banner.className = 'p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 transition-all';
        banner.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0 mt-0.5 text-sm">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="flex-1 space-y-1.5 overflow-hidden">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <h3 class="text-xs font-bold text-red-800 dark:text-red-200">
                  Invalid JSON Syntax (Line ${diag.line}, Column ${diag.col})
                </h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 uppercase tracking-wide">Error</span>
              </div>
              <p class="text-xs text-red-700 dark:text-red-300/90 leading-relaxed font-medium">
                ${escapeJsonHtml(diag.message)}
              </p>
              ${diag.excerpt ? `
                <div class="mt-2 space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-red-600/80 dark:text-red-400/80">Error Location:</span>
                  <pre class="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed border border-red-500/20 shadow-inner"><code>${escapeJsonHtml(diag.excerpt)}</code></pre>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }
    }

    function updateJsonStats() {
      const el = document.getElementById('jsonInput');
      const statsEl = document.getElementById('jsonStats');
      if (!el || !statsEl) return;
      const val = el.value;
      if (!val) {
        statsEl.innerText = '0 lines • 0 characters • 0 B';
        return;
      }
      const lines = val.split('\n').length;
      const chars = val.length;
      const bytes = getByteLength(val);
      const sizeStr = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
      statsEl.innerText = `${lines} line${lines === 1 ? '' : 's'} • ${chars} character${chars === 1 ? '' : 's'} • ${sizeStr}`;
    }

    function handleJsonTab(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const el = e.target;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const val = el.value;
        el.value = val.substring(0, start) + '  ' + val.substring(end);
        el.selectionStart = el.selectionEnd = start + 2;
        updateJsonStats();
      }
    }

    function undoJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      if (!jsonHistory || jsonHistory.length === 0) {
        showToast('Nothing to undo', 'info');
        return;
      }
      const prev = jsonHistory.pop();
      el.value = prev;
      el.focus();
      updateJsonStats();
      if (prev.trim()) {
        validateJson(true);
      } else {
        resetJsonStatusBanner();
      }
      showToast('Restored previous text!', 'success');
    }

    function clearJson() {
      const el = document.getElementById('jsonInput');
      if (!el || !el.value) return;
      saveJsonHistory(el.value);
      el.value = '';
      el.focus();
      updateJsonStats();
      resetJsonStatusBanner();
      showToast('JSON input cleared', 'info');
    }

    async function pasteJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          const text = await navigator.clipboard.readText();
          if (!text || !text.trim()) {
            showToast('Clipboard is empty', 'warning');
            return;
          }
          saveJsonHistory(el.value);
          el.value = text;
          el.focus();
          updateJsonStats();
          validateJson(true);
          showToast('JSON pasted from clipboard!', 'success');
        } catch (err) {
          showToast('Clipboard access was blocked or denied. Press Ctrl+V / Cmd+V to paste.', 'warning');
        }
      } else {
        showToast('Direct paste not supported by browser. Press Ctrl+V / Cmd+V to paste.', 'info');
      }
    }

    function copyJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      const val = el.value;
      if (!val || !val.trim()) {
        showToast('Nothing to copy. Enter some JSON first.', 'warning');
        return;
      }
      if (typeof copyText === 'function') {
        copyText(val);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val)
          .then(() => showToast('Copied to clipboard!', 'success'))
          .catch(() => showToast('Failed to copy text', 'error'));
      }
    }

    function downloadJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      const val = el.value;
      if (!val || !val.trim()) {
        showToast('Please enter some JSON to download', 'warning');
        return;
      }
      try {
        const blob = new Blob([val], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded formatted.json!', 'success');
      } catch (err) {
        showToast('Download failed: ' + err.message, 'error');
      }
    }

    function loadSampleJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      if (el.value && el.value.trim()) {
        saveJsonHistory(el.value);
      }
      const sample = {
        appName: "ToolsHere",
        version: "2.0.0",
        status: "online",
        features: [
          "JSON Beautifier",
          "Syntax Validator",
          "Minifier",
          "Client-Side Privacy"
        ],
        settings: {
          indentSpaces: 2,
          localProcessing: true,
          cacheTTL: 3600
        },
        stats: {
          toolsAvailable: 16,
          uptimePercentage: 99.98
        }
      };
      el.value = JSON.stringify(sample, null, 2);
      el.focus();
      updateJsonStats();
      validateJson(true);
      showToast('Sample JSON loaded!', 'success');
    }

    function validateJson(silent = false) {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      const raw = el.value.trim();
      if (!raw) {
        resetJsonStatusBanner();
        if (!silent) showToast('Please enter some JSON to validate', 'warning');
        return;
      }
      const diag = parseJsonWithDiagnostics(el.value);
      updateJsonStatus(diag);
      if (!silent) {
        if (diag.valid) {
          showToast(`JSON is valid! (${diag.rootType})`, 'success');
        } else {
          showToast(`Invalid JSON: Line ${diag.line}, Column ${diag.col}`, 'error');
        }
      }
    }

    function formatJson(spaces) {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      const raw = el.value.trim();
      if (!raw) {
        showToast('Please enter or paste JSON to format', 'warning');
        return;
      }
      const diag = parseJsonWithDiagnostics(el.value);
      updateJsonStatus(diag);
      if (!diag.valid) {
        showToast(`Invalid JSON: Line ${diag.line}, Column ${diag.col}`, 'error');
        return;
      }
      saveJsonHistory(el.value);
      const formatted = JSON.stringify(diag.parsed, null, spaces);
      el.value = formatted;
      updateJsonStats();
      const newDiag = parseJsonWithDiagnostics(formatted);
      updateJsonStatus(newDiag);
      showToast('JSON formatted successfully!', 'success');
    }

    function minifyJson() {
      const el = document.getElementById('jsonInput');
      if (!el) return;
      const raw = el.value.trim();
      if (!raw) {
        showToast('Please enter or paste JSON to minify', 'warning');
        return;
      }
      const diag = parseJsonWithDiagnostics(el.value);
      updateJsonStatus(diag);
      if (!diag.valid) {
        showToast(`Invalid JSON: Line ${diag.line}, Column ${diag.col}`, 'error');
        return;
      }
      saveJsonHistory(el.value);
      const minified = JSON.stringify(diag.parsed);
      el.value = minified;
      updateJsonStats();
      const newDiag = parseJsonWithDiagnostics(minified);
      updateJsonStatus(newDiag);
      showToast('JSON minified!', 'success');
    }

    function renderJsonFormat(title, icon, container) {
      if (title) title.innerText = 'JSON Formatter, Beautifier & Validator';
      if (icon) icon.className = 'fa-solid fa-code';
      container.innerHTML = `
        <div class="space-y-5">
          <!-- Top Utility Toolbar -->
          <div class="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-2 flex-wrap">
              <button type="button" onclick="pasteJson()" title="Paste from clipboard" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs min-h-[36px]">
                <i class="fa-solid fa-paste text-slate-400 text-[11px]"></i> Paste
              </button>
              <button type="button" onclick="loadSampleJson()" title="Load demo sample JSON" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs min-h-[36px]">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-500 text-[11px]"></i> Sample JSON
              </button>
              <button type="button" onclick="undoJson()" title="Undo last change" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs min-h-[36px]">
                <i class="fa-solid fa-rotate-left text-slate-400 text-[11px]"></i> Undo
              </button>
              <button type="button" onclick="clearJson()" title="Clear editor" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs min-h-[36px]">
                <i class="fa-solid fa-trash-can text-[11px]"></i> Clear
              </button>
            </div>
            <div class="flex items-center gap-2 flex-wrap ml-auto">
              <button type="button" onclick="downloadJson()" title="Download as formatted.json" class="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs min-h-[36px]">
                <i class="fa-solid fa-download text-slate-400 text-[11px]"></i> Download .json
              </button>
              <button type="button" onclick="copyJson()" title="Copy JSON to clipboard" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 min-h-[36px]">
                <i class="fa-solid fa-copy text-[11px]"></i> Copy JSON
              </button>
            </div>
          </div>

          <!-- Live Payload Stats Bar -->
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div class="flex items-center gap-2 font-medium">
              <span class="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
              <span>JSON Input &amp; Editor</span>
            </div>
            <div id="jsonStats" class="font-mono text-[11px] text-slate-600 dark:text-slate-300">
              0 lines • 0 characters • 0 B
            </div>
          </div>

          <!-- Main Textarea -->
          <div class="relative">
            <textarea id="jsonInput" rows="12" oninput="updateJsonStats()" onkeydown="handleJsonTab(event)" placeholder="Paste or type raw JSON here (e.g. {&#34;name&#34;: &#34;ToolsHere&#34;, &#34;features&#34;: [&#34;Formatter&#34;, &#34;Validator&#34;]})..." class="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all leading-relaxed"></textarea>
          </div>

          <!-- Primary Action Buttons Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button type="button" onclick="validateJson()" class="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]">
              <i class="fa-solid fa-circle-check text-sm"></i> Validate JSON
            </button>
            <button type="button" onclick="formatJson(2)" class="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px]">
              <i class="fa-solid fa-align-left text-xs"></i> Beautify (2 Spaces)
            </button>
            <button type="button" onclick="formatJson(4)" class="py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[44px]">
              <i class="fa-solid fa-indent text-xs"></i> Beautify (4 Spaces)
            </button>
            <button type="button" onclick="minifyJson()" class="py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[44px]">
              <i class="fa-solid fa-compress text-xs"></i> Minify JSON
            </button>
          </div>

          <!-- Persistent Valid / Invalid / Helper Status Banner -->
          <div id="jsonStatusBanner" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 transition-all">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-sm">
                <i class="fa-solid fa-info"></i>
              </div>
              <div class="flex-1 space-y-1">
                <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200">Ready to Validate &amp; Format</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Paste your JSON above and click <span class="font-semibold text-slate-700 dark:text-slate-300">Validate JSON</span> to inspect syntax, or choose <span class="font-semibold text-slate-700 dark:text-slate-300">Beautify</span> / <span class="font-semibold text-slate-700 dark:text-slate-300">Minify</span>. All processing occurs 100% inside your local browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    /* ================= UTILITY 14: SEO META TAG GENERATOR ================= */
    function renderSeoMeta(title, icon, container) {
      if (title) title.innerText = 'SEO Meta Tag & Open Graph Generator';
      if (icon) icon.className = 'fa-solid fa-tags';
      container.innerHTML = `
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3.5">
              <div>
                <div class="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Page Title</span>
                  <span id="titleCounter" class="text-emerald-600 font-mono">0 / 60</span>
                </div>
                <input type="text" id="seoTitle" placeholder="ToolsHere.online — Free Online Tools" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold" oninput="generateSeoTags()">
              </div>

              <div>
                <div class="flex justify-between items-center text-xs font-bold mb-1">
                  <span>Meta Description</span>
                  <span id="descCounter" class="text-emerald-600 font-mono">0 / 160</span>
                </div>
                <textarea id="seoDesc" rows="3" placeholder="Free client-side online tools for PDF processing, image compression, developer utilities, and daily productivity." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold" oninput="generateSeoTags()"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold mb-1">Canonical URL</label>
                  <input type="text" id="seoUrl" placeholder="https://toolshere.online/" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold" oninput="generateSeoTags()">
                </div>
                <div>
                  <label class="block text-xs font-bold mb-1">Author / Site Name</label>
                  <input type="text" id="seoAuthor" placeholder="ToolsHere Team" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold" oninput="generateSeoTags()">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold mb-1">Robots Indexing</label>
                  <select id="seoRobots" onchange="generateSeoTags()" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold">
                    <option value="index, follow">Index, Follow (Recommended)</option>
                    <option value="noindex, follow">NoIndex, Follow</option>
                    <option value="noindex, nofollow">NoIndex, NoFollow</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold mb-1">OG Image URL</label>
                  <input type="text" id="seoImage" placeholder="https://example.com/og-image.jpg" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-xs font-semibold" oninput="generateSeoTags()">
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Google Search Live Snippet</span>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white font-bold">T</div>
                  <span id="serpSiteName" class="text-xs font-semibold text-slate-700 dark:text-slate-300">ToolsHere.online</span>
                </div>
                <div id="serpUrl" class="text-[11px] text-slate-500 truncate">https://toolshere.online/</div>
                <div id="serpTitle" class="text-base text-blue-600 hover:underline font-medium cursor-pointer truncate">ToolsHere.online — Free Online Tools</div>
                <div id="serpDesc" class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">Free client-side online tools for PDF processing, image compression, developer utilities, and daily productivity.</div>
              </div>

              <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-xs">Generated Meta Tags HTML:</span>
                  <button type="button" onclick="copyText(document.getElementById('seoOutput').value)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">
                    <i class="fa-solid fa-copy"></i> Copy Code
                  </button>
                </div>
                <textarea id="seoOutput" rows="6" readonly class="w-full p-3 font-mono text-[11px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"></textarea>
              </div>
            </div>
          </div>
        </div>
      `;
      setTimeout(generateSeoTags, 50);
    }

    function generateSeoTags() {
      const t = document.getElementById('seoTitle')?.value || 'ToolsHere.online — Free Online Tools';
      const d = document.getElementById('seoDesc')?.value || 'Free client-side online tools for PDF processing, image compression, and productivity.';
      const u = document.getElementById('seoUrl')?.value || 'https://toolshere.online/';
      const a = document.getElementById('seoAuthor')?.value || 'ToolsHere';
      const r = document.getElementById('seoRobots')?.value || 'index, follow';
      const img = document.getElementById('seoImage')?.value || 'https://toolshere.online/assets/logo.png';

      const titleLen = t.length;
      const descLen = d.length;
      const titleEl = document.getElementById('titleCounter');
      const descEl = document.getElementById('descCounter');
      if (titleEl) {
        titleEl.innerText = `${titleLen} / 60`;
        titleEl.className = titleLen > 60 ? 'text-amber-500 font-mono' : 'text-emerald-600 font-mono';
      }
      if (descEl) {
        descEl.innerText = `${descLen} / 160`;
        descEl.className = descLen > 160 ? 'text-amber-500 font-mono' : 'text-emerald-600 font-mono';
      }

      if (document.getElementById('serpTitle')) document.getElementById('serpTitle').innerText = t;
      if (document.getElementById('serpDesc')) document.getElementById('serpDesc').innerText = d;
      if (document.getElementById('serpUrl')) document.getElementById('serpUrl').innerText = u;

      const tags = `<!-- Primary Meta Tags -->
<title>${t}</title>
<meta name="title" content="${t}">
<meta name="description" content="${d}">
<meta name="author" content="${a}">
<meta name="robots" content="${r}">
<link rel="canonical" href="${u}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${u}">
<meta property="twitter:title" content="${t}">
<meta property="twitter:description" content="${d}">
<meta property="twitter:image" content="${img}">`;

      const out = document.getElementById('seoOutput');
      if (out) out.value = tags;
    }

    /* ================= UTILITY 15: COMPRESS PDF ================= */
    let selectedPdfToCompress = null;
    let compressLevel = 'recommended';

    function renderCompressPdf(title, icon, container) {
      if (title) title.innerText = 'Compress PDF Document';
      if (icon) icon.className = 'fa-solid fa-file-zipper';
      container.innerHTML = `
        <div class="space-y-6">
          <!-- Drop Zone with Direct Tap & Drag-and-Drop Support -->
          <div id="compressPdfDropZone" onclick="triggerCompressPdfPicker()" ondragover="handleCompressPdfDragOver(event)" ondragleave="handleCompressPdfDragLeave(event)" ondrop="handleCompressPdfDrop(event)" class="relative border-2 border-dashed border-rose-400 dark:border-rose-500 hover:border-rose-600 dark:hover:border-rose-400 bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-rose-500/5 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] group">
            <input type="file" id="pdfCompressInput" accept=".pdf,application/pdf" class="hidden" onchange="handleCompressPdfSelected(this)">
            <div class="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-md pointer-events-none">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <button type="button" onclick="event.stopPropagation(); triggerCompressPdfPicker()" class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 group-hover:scale-[1.02] transition-all cursor-pointer">
              <i class="fa-solid fa-folder-open"></i> Select PDF File
            </button>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4 pointer-events-none">Drag & drop your PDF file here or tap to select</p>
            <div class="flex flex-wrap items-center justify-center gap-2 mt-3 pointer-events-none">
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">.PDF documents</span>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">100% In-Browser Privacy</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-2 pointer-events-none">All PDF operations execute locally on your device. Zero server file uploads.</p>
          </div>

          <!-- Configuration & Compression Workspace -->
          <div id="pdfCompressOptions" class="hidden space-y-6">
            <!-- Selected File Card with Replace & Remove Controls -->
            <div class="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                  <i class="fa-solid fa-file-pdf"></i>
                </div>
                <div class="min-w-0">
                  <p id="pdfSelectedFilename" class="font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate">document.pdf</p>
                  <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span id="pdfOriginalSize" class="font-semibold">0 KB</span>
                    <span>•</span>
                    <span id="pdfEstReduction" class="font-bold text-emerald-600 dark:text-emerald-400">Est. Reduction: ~50%</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button type="button" onclick="triggerCompressPdfPicker()" class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
                  <i class="fa-solid fa-arrow-rotate-right text-slate-500"></i> Replace File
                </button>
                <button type="button" onclick="removeCompressPdfFile()" class="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
                  <i class="fa-solid fa-trash-can"></i> Remove
                </button>
              </div>
            </div>

            <!-- Compression Level Presets -->
            <div class="space-y-3">
              <label class="block font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Compression Level:</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button type="button" id="cmpRecBtn" onclick="setCompressLevel('recommended')" class="p-4 rounded-2xl bg-rose-600 text-white font-bold text-left shadow-xs transition-all border border-rose-600 cursor-pointer">
                  <span class="block text-sm mb-1 font-extrabold flex items-center justify-between">Balanced <span class="text-[10px] uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full font-semibold">Recommended</span></span>
                  <span class="text-[11px] opacity-90 block">~50% reduction. High visual quality for email, portals, and documents.</span>
                </button>
                <button type="button" id="cmpExtBtn" onclick="setCompressLevel('extreme')" class="p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-left border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-all cursor-pointer">
                  <span class="block text-sm mb-1 font-extrabold">Extreme Compression</span>
                  <span class="text-[11px] text-slate-400 block">~75% reduction. Maximum shrinkage for upload portals under 500KB.</span>
                </button>
                <button type="button" id="cmpLowBtn" onclick="setCompressLevel('low')" class="p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-left border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-all cursor-pointer">
                  <span class="block text-sm mb-1 font-extrabold">Low Compression</span>
                  <span class="text-[11px] text-slate-400 block">~25% reduction. Maximum image and vector resolution preserved.</span>
                </button>
              </div>
            </div>

            <!-- Action Button -->
            <button type="button" id="executeCompressPdfBtn" onclick="downloadOptimizedPdf()" class="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer">
              <i class="fa-solid fa-file-zipper text-lg"></i> Compress & Download PDF
            </button>
          </div>
        </div>
      `;
    }

    function formatPdfSize(bytes) {
      if (!bytes || isNaN(bytes)) return '0 KB';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function triggerCompressPdfPicker() {
      const input = document.getElementById('pdfCompressInput');
      if (input) {
        input.value = '';
        input.click();
      }
    }

    function handleCompressPdfDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      const dz = document.getElementById('compressPdfDropZone');
      if (dz) {
        dz.classList.add('border-rose-600', 'bg-rose-100/50', 'dark:bg-rose-950/40');
      }
    }

    function handleCompressPdfDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      const dz = document.getElementById('compressPdfDropZone');
      if (dz) {
        dz.classList.remove('border-rose-600', 'bg-rose-100/50', 'dark:bg-rose-950/40');
      }
    }

    function handleCompressPdfDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      const dz = document.getElementById('compressPdfDropZone');
      if (dz) {
        dz.classList.remove('border-rose-600', 'bg-rose-100/50', 'dark:bg-rose-950/40');
      }
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleCompressPdfFile(e.dataTransfer.files[0]);
      }
    }

    function handleCompressPdfSelected(input) {
      if (input.files && input.files[0]) {
        handleCompressPdfFile(input.files[0]);
      }
    }

    function handleCompressPdfFile(file) {
      if (!file) return;
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        showToast('Invalid file type. Please select a valid PDF file (.pdf)', 'error');
        const input = document.getElementById('pdfCompressInput');
        if (input) input.value = '';
        return;
      }

      selectedPdfToCompress = file;

      const nameEl = document.getElementById('pdfSelectedFilename');
      if (nameEl) nameEl.innerText = file.name;

      const sizeEl = document.getElementById('pdfOriginalSize');
      if (sizeEl) sizeEl.innerText = `Original: ${formatPdfSize(file.size)}`;

      const dropZone = document.getElementById('compressPdfDropZone');
      if (dropZone) dropZone.classList.add('hidden');

      const options = document.getElementById('pdfCompressOptions');
      if (options) options.classList.remove('hidden');

      showToast(`Selected "${file.name}" (${formatPdfSize(file.size)})`, 'success');
    }

    function removeCompressPdfFile() {
      selectedPdfToCompress = null;
      const input = document.getElementById('pdfCompressInput');
      if (input) input.value = '';

      const dropZone = document.getElementById('compressPdfDropZone');
      if (dropZone) dropZone.classList.remove('hidden');

      const options = document.getElementById('pdfCompressOptions');
      if (options) options.classList.add('hidden');

      showToast('PDF removed. Select another PDF to compress.', 'info');
    }

    function setCompressLevel(level) {
      compressLevel = level;
      const recBtn = document.getElementById('cmpRecBtn');
      const extBtn = document.getElementById('cmpExtBtn');
      const lowBtn = document.getElementById('cmpLowBtn');
      const redBadge = document.getElementById('pdfEstReduction');

      [recBtn, extBtn, lowBtn].forEach(b => {
        if (b) b.className = 'p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-left border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-all cursor-pointer';
      });

      if (level === 'recommended') {
        if (recBtn) recBtn.className = 'p-4 rounded-2xl bg-rose-600 text-white font-bold text-left shadow-xs transition-all border border-rose-600 cursor-pointer';
        if (redBadge) redBadge.innerText = 'Est. Reduction: ~50-60%';
      } else if (level === 'extreme') {
        if (extBtn) extBtn.className = 'p-4 rounded-2xl bg-rose-600 text-white font-bold text-left shadow-xs transition-all border border-rose-600 cursor-pointer';
        if (redBadge) redBadge.innerText = 'Est. Reduction: ~70-80%';
      } else if (level === 'low') {
        if (lowBtn) lowBtn.className = 'p-4 rounded-2xl bg-rose-600 text-white font-bold text-left shadow-xs transition-all border border-rose-600 cursor-pointer';
        if (redBadge) redBadge.innerText = 'Est. Reduction: ~20-30%';
      }
    }

    async function downloadOptimizedPdf() {
      if (!selectedPdfToCompress) {
        showToast('Please select a PDF file first.', 'error');
        return;
      }

      const btn = document.getElementById('executeCompressPdfBtn');
      const originalBtnHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-lg mr-2"></i> Compressing PDF...';
      }

      showToast('Compressing PDF stream and removing duplicate resources...', 'info');

      try {
        if (typeof PDFLib === 'undefined') {
          await ensureScript('PDFLib');
        }
        if (typeof PDFLib === 'undefined') {
          showToast('PDF engine initializing, please retry...', 'info');
          if (btn) { btn.disabled = false; btn.innerHTML = originalBtnHtml; }
          return;
        }

        const buffer = await selectedPdfToCompress.arrayBuffer();
        const originalBytes = buffer.byteLength;

        if (compressLevel === 'extreme') {
          if (typeof pdfjsLib === 'undefined') {
            await ensureScript('pdfjsLib');
          }
          if (typeof pdfjsLib !== 'undefined') {
            try {
              const pdfjsDoc = await pdfjsLib.getDocument({ data: buffer }).promise;
              const newDoc = await PDFLib.PDFDocument.create();

              for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                const page = await pdfjsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                const jpegUrl = canvas.toDataURL('image/jpeg', 0.55);
                const jpgImage = await newDoc.embedJpg(jpegUrl);
                const newPage = newDoc.addPage([viewport.width, viewport.height]);
                newPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
              }

              const compressedBytes = await newDoc.save();
              const blob = new Blob([compressedBytes], { type: 'application/pdf' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `compressed-${selectedPdfToCompress.name}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              showToast(`Compressed from ${formatPdfSize(originalBytes)} to ${formatPdfSize(compressedBytes.length)}!`, 'success');
              triggerConfetti();
              if (btn) { btn.disabled = false; btn.innerHTML = originalBtnHtml; }
              return;
            } catch(e) {
              console.warn('Canvas recompression fallback:', e);
            }
          }
        }

        const doc = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
        const cleanDoc = await PDFLib.PDFDocument.create();
        const copiedPages = await cleanDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(p => cleanDoc.addPage(p));

        const compressedBytes = await cleanDoc.save({ useObjectStreams: true });
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `compressed-${selectedPdfToCompress.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showToast(`Compressed PDF downloaded! (${formatPdfSize(compressedBytes.length)})`, 'success');
        triggerConfetti();
      } catch (err) {
        console.error(err);
        showToast('Error during compression: ' + err.message, 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = originalBtnHtml; }
      }
    }

    // Explicitly expose handlers to window for cross-platform event dispatch
    window.renderCompressPdf = renderCompressPdf;
    window.triggerCompressPdfPicker = triggerCompressPdfPicker;
    window.handleCompressPdfDragOver = handleCompressPdfDragOver;
    window.handleCompressPdfDragLeave = handleCompressPdfDragLeave;
    window.handleCompressPdfDrop = handleCompressPdfDrop;
    window.handleCompressPdfSelected = handleCompressPdfSelected;
    window.handleCompressPdfFile = handleCompressPdfFile;
    window.removeCompressPdfFile = removeCompressPdfFile;
    window.setCompressLevel = setCompressLevel;
    window.downloadOptimizedPdf = downloadOptimizedPdf;


    /* ================= UTILITY 16: IMAGE TO PDF CONVERTER ================= */
    let imgToPdfFiles = [];
    let imgToPdfPageSize = 'a4';
    let imgToPdfOrientation = 'portrait';
    let imgToPdfMargin = 'small';

    function renderImgToPdf(title, icon, container) {
      if (title) title.innerText = 'Image to PDF Converter';
      if (icon) icon.className = 'fa-solid fa-images';
      container.innerHTML = `
        <div class="space-y-6">
          <div id="imgToPdfDropZone" class="relative border-2 border-dashed border-emerald-400 dark:border-emerald-500 hover:border-emerald-600 dark:hover:border-emerald-400 bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/5 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] group">
            <input type="file" id="imgToPdfInput" multiple accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="handleImgToPdfFiles(this)">
            <div class="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-md">
              <i class="fa-solid fa-images"></i>
            </div>
            <span class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-[1.02] transition-all">
              <i class="fa-solid fa-folder-open"></i> Choose Images to Convert
            </span>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4">Select multiple photos to combine into a high quality PDF</p>
            <p id="imgToPdfCount" class="text-[11px] text-slate-400 mt-2">Supports JPG, PNG, and WebP • Custom PDF page sizes</p>
          </div>

          <div id="imgToPdfActions" class="hidden space-y-6">
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span id="imgToPdfSelectedCount" class="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">0 Images Selected</span>
              <button type="button" onclick="document.getElementById('imgToPdfInput').click()" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                <i class="fa-solid fa-plus"></i> Add More Photos
              </button>
            </div>

            <div id="imgToPdfPreview" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700"></div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Custom PDF Page &amp; Size Setup</span>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Page Size:</label>
                  <select id="imgToPdfPageSizeSelect" onchange="imgToPdfPageSize=this.value" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold">
                    <option value="a4" selected>A4 (Standard 210 x 297mm)</option>
                    <option value="letter">US Letter (8.5 x 11in)</option>
                    <option value="auto">Auto (Match Image Dimension)</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Orientation:</label>
                  <select id="imgToPdfOrientSelect" onchange="imgToPdfOrientation=this.value" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold">
                    <option value="portrait" selected>Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="auto">Auto-detect per image</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Page Margin:</label>
                  <select id="imgToPdfMarginSelect" onchange="imgToPdfMargin=this.value" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold">
                    <option value="none">No Margin (Full Bleed)</option>
                    <option value="small" selected>Small Margin (15pt)</option>
                    <option value="normal">Wide Margin (36pt)</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="button" onclick="generateUnifiedPdf()" class="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5">
              <i class="fa-solid fa-file-pdf text-lg"></i> Generate &amp; Download PDF Document
            </button>
          </div>
        </div>
      `;
    }

    function handleImgToPdfFiles(input) {
      if (input.files && input.files.length > 0) {
        const newFiles = Array.from(input.files);
        imgToPdfFiles = [...imgToPdfFiles, ...newFiles];
        renderImgToPdfPreview();
        document.getElementById('imgToPdfDropZone').classList.add('hidden');
        document.getElementById('imgToPdfActions').classList.remove('hidden');
      }
    }

    function renderImgToPdfPreview() {
      const preview = document.getElementById('imgToPdfPreview');
      const countEl = document.getElementById('imgToPdfSelectedCount');
      if (!preview) return;

      countEl.innerText = `${imgToPdfFiles.length} Photos Selected`;
      preview.innerHTML = '';

      imgToPdfFiles.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'relative group/card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-2 shadow-2xs text-center';

        const reader = new FileReader();
        reader.onload = e => {
          card.innerHTML = `
            <div class="h-24 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1.5">
              <img src="${e.target.result}" class="w-full h-full object-cover">
            </div>
            <span class="block text-[10px] text-slate-500 truncate mb-1">${escapeHtml(file.name)}</span>
            <div class="flex items-center justify-center gap-1">
              <button type="button" onclick="moveImgToPdfFile(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 disabled:opacity-20 flex items-center justify-center text-[10px]" title="Move Left">◀</button>
              <button type="button" onclick="moveImgToPdfFile(${index}, 1)" ${index === imgToPdfFiles.length - 1 ? 'disabled' : ''} class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 disabled:opacity-20 flex items-center justify-center text-[10px]" title="Move Right">▶</button>
              <button type="button" onclick="removeImgToPdfFile(${index})" class="w-6 h-6 rounded bg-rose-50 text-rose-600 dark:bg-rose-950 flex items-center justify-center text-[10px]" title="Remove">✕</button>
            </div>
          `;
        };
        reader.readAsDataURL(file);
        preview.appendChild(card);
      });
    }

    function moveImgToPdfFile(idx, dir) {
      const target = idx + dir;
      if (target >= 0 && target < imgToPdfFiles.length) {
        const temp = imgToPdfFiles[idx];
        imgToPdfFiles[idx] = imgToPdfFiles[target];
        imgToPdfFiles[target] = temp;
        renderImgToPdfPreview();
      }
    }

    function removeImgToPdfFile(idx) {
      imgToPdfFiles.splice(idx, 1);
      renderImgToPdfPreview();
      if (imgToPdfFiles.length === 0) {
        document.getElementById('imgToPdfDropZone').classList.remove('hidden');
        document.getElementById('imgToPdfActions').classList.add('hidden');
      }
    }

    async function generateUnifiedPdf() {
      if (imgToPdfFiles.length === 0) {
        showToast('Please select at least 1 image file', 'error');
        return;
      }

      showToast(`Converting ${imgToPdfFiles.length} photos into PDF...`, 'info');

      try {
        if (typeof PDFLib === 'undefined') {
          showToast('PDF compiler initializing...', 'info');
          return;
        }

        const pdfDoc = await PDFLib.PDFDocument.create();

        for (const file of imgToPdfFiles) {
          const imgBitmap = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });

          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.naturalWidth;
          canvas.height = imgBitmap.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imgBitmap, 0, 0);

          const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.90);
          const embeddedImage = await pdfDoc.embedJpg(jpgDataUrl);

          let pageWidth = 595.28;
          let pageHeight = 841.89;

          if (imgToPdfPageSize === 'letter') {
            pageWidth = 612;
            pageHeight = 792;
          } else if (imgToPdfPageSize === 'auto') {
            pageWidth = canvas.width;
            pageHeight = canvas.height;
          }

          if (imgToPdfOrientation === 'landscape' || (imgToPdfOrientation === 'auto' && canvas.width > canvas.height)) {
            if (pageWidth < pageHeight && imgToPdfPageSize !== 'auto') {
              const temp = pageWidth;
              pageWidth = pageHeight;
              pageHeight = temp;
            }
          }

          const margin = imgToPdfMargin === 'none' ? 0 : (imgToPdfMargin === 'normal' ? 36 : 15);
          const availWidth = pageWidth - (margin * 2);
          const availHeight = pageHeight - (margin * 2);

          const scale = Math.min(availWidth / canvas.width, availHeight / canvas.height);
          const drawWidth = canvas.width * scale;
          const drawHeight = canvas.height * scale;
          const drawX = margin + (availWidth - drawWidth) / 2;
          const drawY = margin + (availHeight - drawHeight) / 2;

          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          page.drawImage(embeddedImage, {
            x: drawX,
            y: drawY,
            width: drawWidth,
            height: drawHeight
          });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'converted-photos-toolshere.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showToast('PDF downloaded successfully!', 'success');
        triggerConfetti();
      } catch (err) {
        console.error(err);
        showToast('Error generating PDF: ' + err.message, 'error');
      }
    }
    /* ================= LEGAL & INFORMATIONAL FULL PAGES ================= */
    function renderAboutModal(title, icon, container) {
      if (title) title.innerText = 'About ToolsHere.online';
      if (icon) icon.className = 'fa-solid fa-circle-info';
      container.innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p class="font-medium text-slate-800 dark:text-white text-base">Welcome to <strong class="text-blue-600 dark:text-cyan-400">ToolsHere.online</strong> — your ultimate browser-based productivity workstation.</p>
          <p>Our philosophy is simple: <strong>Zero Latency, 100% Client-Side Privacy</strong>. Every file conversion, image compression, password generation, and document processing task executes directly inside your browser's local memory using modern WebAssembly, Canvas API, and JavaScript runtimes.</p>
          <div class="p-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl space-y-2 border border-[#E5E7EB] dark:border-slate-700">
            <div class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> No file uploads to cloud servers</div>
            <div class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> No account or signup required</div>
            <div class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-500"></i> 100% free and open for personal and commercial usage</div>
          </div>
        </div>
      `;
    }

    function renderContactModal(title, icon, container) {
      if (title) title.innerText = 'Contact & Support';
      if (icon) icon.className = 'fa-solid fa-envelope';
      container.innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed">
          <p class="text-slate-600 dark:text-slate-300">Have suggestions for new utilities or found a bug? We would love to hear from you!</p>
          <div class="p-6 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 space-y-3">
            <span class="block font-bold text-slate-800 dark:text-white">Official Support Email:</span>
            <div class="flex items-center justify-between">
              <span class="font-mono text-blue-600 dark:text-cyan-400 font-bold text-base">support@toolshere.online</span>
              <button type="button" onclick="copyText('support@toolshere.online')" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md">Copy</button>
            </div>
          </div>
        </div>
      `;
    }

    function renderPrivacyModal(title, icon, container) {
      if (title) title.innerText = 'Privacy Policy';
      if (icon) icon.className = 'fa-solid fa-shield-halved';
      container.innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h4 class="font-bold text-slate-800 dark:text-white text-base">Client-Side Data Privacy Commitment</h4>
          <p>At <strong>ToolsHere.online</strong>, your privacy is our primary engineering principle. When you use any tool (such as image compression, background removal, PDF manipulation, or calculators), all processing happens directly in your device's browser memory.</p>
          <ul class="list-disc pl-5 space-y-1.5">
            <li>We do not store, copy, or upload your photos, documents, or data.</li>
            <li>No user tracking beyond standard privacy-preserving anonymous traffic metrics.</li>
            <li>You can even disconnect your internet after loading the page and the utilities will continue to function!</li>
          </ul>
        </div>
      `;
    }

    function renderTermsModal(title, icon, container) {
      if (title) title.innerText = 'Terms of Service';
      if (icon) icon.className = 'fa-solid fa-file-contract';
      container.innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h4 class="font-bold text-slate-800 dark:text-white text-base">Terms of Usage</h4>
          <p>By accessing ToolsHere.online, you agree to use our digital tools for lawful purposes. All utilities are provided "as-is" without warranty. We do not charge fees, require subscriptions, or restrict access to any browser-based utility.</p>
        </div>
      `;
    }

    function renderDisclaimerModal(title, icon, container) {
      if (title) title.innerText = 'Disclaimer';
      if (icon) icon.className = 'fa-solid fa-triangle-exclamation';
      container.innerHTML = `
        <div class="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h4 class="font-bold text-slate-800 dark:text-white text-base">General Disclaimer</h4>
          <p>Calculations provided by our tools (such as EMI, GST, and Age calculations) are for informational estimates only. Always consult official financial and legal advisors for sensitive personal transactions.</p>
        </div>
      `;
    }
  