const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Extract Main Script and Registry Data
const scripts = [...indexHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const mainScriptObj = scripts.find(s => s[1].includes('SEO_TOOL_REGISTRY'));
if (!mainScriptObj) {
  console.error('Could not find script with SEO_TOOL_REGISTRY!');
  process.exit(1);
}
const mainScript = mainScriptObj[1];

// Sandbox to execute and extract registry and render functions
const sandbox = {
  document: {
    addEventListener: () => {},
    getElementById: () => ({
      classList: { add: () => {}, remove: () => {} },
      innerText: '',
      innerHTML: '',
      value: ''
    }),
    querySelectorAll: () => []
  },
  window: {
    addEventListener: () => {},
    location: { pathname: '/', hash: '' }
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  setTimeout: (fn) => { try { fn(); } catch(e){} },
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  Image: function() {},
  console: console,
  globalThis: {}
};

const setupCode = mainScript + '\n;globalThis.tools = SEO_TOOL_REGISTRY; globalThis.routes = modalRouteMap;';
vm.createContext(sandbox);
vm.runInContext(setupCode, sandbox);

const tools = sandbox.globalThis.tools;
const routes = sandbox.globalThis.routes;

console.log(`Loaded ${tools.length} tools and ${Object.keys(routes).length} route configurations.`);

// Map of modalType to render function name
const renderFunctionMap = {
  imgResizerModal: 'renderImageResizer',
  bgRemoverModal: 'renderBgRemover',
  pdfWordModal: 'renderPdfWord',
  pdfMergeModal: 'renderPdfMerge',
  ageCalcModal: 'renderAgeCalc',
  ytThumbModal: 'renderYtThumb',
  qrModal: 'renderQrTool',
  passwordModal: 'renderPasswordTool',
  wordCountModal: 'renderWordCounter',
  gstEmiModal: 'renderGstEmi',
  imgFormatModal: 'renderImgFormat',
  textCaseModal: 'renderTextCase',
  jsonFormatModal: 'renderJsonFormat',
  seoMetaModal: 'renderSeoMeta',
  compressPdfModal: 'renderCompressPdf',
  imgToPdfModal: 'renderImgToPdf',
  aboutModal: 'renderAboutModal',
  contactModal: 'renderContactModal',
  privacyModal: 'renderPrivacyModal',
  termsModal: 'renderTermsModal',
  disclaimerModal: 'renderDisclaimerModal'
};

// Tool icons map
const toolIconsMap = {
  imgResizer: 'fa-solid fa-compress',
  bgRemover: 'fa-solid fa-wand-magic-sparkles',
  pdfWord: 'fa-solid fa-file-word',
  pdfMerge: 'fa-solid fa-object-group',
  ageCalc: 'fa-solid fa-calendar-check',
  ytThumb: 'fa-brands fa-youtube',
  qrTool: 'fa-solid fa-qrcode',
  passwordGen: 'fa-solid fa-shield-halved',
  wordCount: 'fa-solid fa-font',
  gstEmi: 'fa-solid fa-calculator',
  imgFormat: 'fa-solid fa-arrows-rotate',
  textCase: 'fa-solid fa-text-height',
  jsonFormat: 'fa-solid fa-code',
  seoMeta: 'fa-solid fa-magnifying-glass-chart',
  compressPdf: 'fa-solid fa-file-zipper',
  imgToPdf: 'fa-solid fa-images'
};

// Build SEO Guide HTML for a tool with clean minimal white design
function generateGuideHtml(tool) {
  let relatedHtml = '';
  if (tool.relatedTools && tool.relatedTools.length > 0) {
    relatedHtml = `
      <div class="pt-6 border-t border-slate-200">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Related Productivity Utilities</h3>
        <div class="flex flex-wrap gap-2">
          ${tool.relatedTools.map(rt => {
            const slug = rt.hash.replace('#', '');
            return `<a href="/${slug}" class="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200">
              <i class="fa-solid fa-arrow-right text-[10px] text-blue-500"></i> ${rt.name}
            </a>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `
    <article class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300">
      <div class="space-y-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wide">${tool.category} Utility</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5"><i class="fa-solid fa-shield-halved text-[10px] text-emerald-600"></i> 100% In-Browser Privacy</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5"><i class="fa-solid fa-bolt text-blue-600 text-[10px]"></i> Zero Server Latency</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">About ${tool.name}</h2>
        <div class="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          <p>${tool.intro}</p>
        </div>
      </div>

      <!-- Step-by-Step Instructions -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-list-ol text-blue-600"></i> How to Use ${tool.name} (Step-by-Step)
        </h3>
        <ol class="space-y-2.5 text-sm">
          ${tool.howToUse.map((step, idx) => `
            <li class="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span class="shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">${idx + 1}</span>
              <span class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">${step}</span>
            </li>
          `).join('')}
        </ol>
      </section>

      <!-- Key Verified Features -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-600"></i> Key Features & Capabilities
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${tool.features.map(f => `
            <div class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="fa-solid fa-check text-emerald-600 text-xs mt-1 shrink-0"></i>
              <span class="text-xs sm:text-sm text-slate-700 font-medium">${f}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Supported Formats & Limits -->
      <section class="space-y-3 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-sliders text-blue-600"></i> Technical Specifications & File Compatibility
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Supported Inputs</span>
            <span class="font-semibold text-slate-800">${tool.formatsAndLimits.supportedInputs}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Output Format</span>
            <span class="font-semibold text-slate-800">${tool.formatsAndLimits.outputFormat}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Processing Scope</span>
            <span class="font-semibold text-slate-800">${tool.formatsAndLimits.limitations}</span>
          </div>
        </div>
      </section>

      <!-- Frequently Asked Questions -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-circle-question text-blue-600"></i> Frequently Asked Questions (${tool.name})
        </h3>
        <div class="space-y-3">
          ${tool.faqs.map(faq => `
            <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
              <h4 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <i class="fa-solid fa-circle-chevron-right text-blue-600 text-xs"></i> ${faq.q}
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">${faq.a}</p>
            </div>
          `).join('')}
        </div>
      </section>

      ${relatedHtml}
    </article>
  `;
}

// Generate complete standalone HTML file for each tool or legal page with clean minimal white design
function generatePageTemplate({ slug, title, metaDesc, canonicalUrl, h1, category, iconClass, workspaceHtml, guideHtml, jsonLdSchemas }) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${slug.replace(/-/g, ' ')}, online tools, free web utilities, ${category ? category.toLowerCase() + ' tools,' : ''} toolshere">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://toolshere.online/assets/images/hero_3d_tools.jpg">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${canonicalUrl}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${metaDesc}">
  <meta property="twitter:image" content="https://toolshere.online/assets/images/hero_3d_tools.jpg">

  <!-- Favicon & Touch Icons -->
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512x512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#2563eb">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RXVYKC5YG5"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RXVYKC5YG5');
  </script>

  <!-- Structured Data Schemas -->
  ${jsonLdSchemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n')}

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          },
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
            }
          }
        }
      }
    };
  </script>

  <!-- FontAwesome Icons & Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="/assets/vendor/qrcode.min.js"></script>
  <script>window.QRCode || document.write('<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"><\\/script>');</script>
  <script src="/assets/vendor/pdf-lib.min.js"></script>
  <script>window.PDFLib || document.write('<script src="https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js"><\\/script>');</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
        html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    button, a, input, select, textarea { touch-action: manipulation; }
    
    input[type="range"] {
      -webkit-appearance: none;
      height: 32px;
      background: transparent;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2563EB;
      cursor: pointer;
      margin-top: -9px;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
      border: 2px solid #FFFFFF;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 6px;
      cursor: pointer;
      background: #E2E8F0;
      border-radius: 9999px;
    }
    .dark input[type="range"]::-webkit-slider-runnable-track {
      background: #334155;
    }
    
    .touch-card {
      -webkit-tap-highlight-color: transparent;
      transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .touch-card:active {
      transform: scale(0.98);
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    .dark ::-webkit-scrollbar-thumb { background: #334155; }

    .checkerboard-bg {
      background-color: #ffffff;
      background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }
  </style>
</head>
<body class="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 min-h-screen flex flex-col">

  <!-- Toast Notification System -->
  <div id="toastContainer" class="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- Redesigned Clean White Header -->
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
      <!-- Brand Logo (Tap returns Home) -->
      <a href="/" class="flex items-center gap-2 sm:gap-2.5 shrink-0 group min-h-[44px] py-1" aria-label="ToolsHere.online Homepage">
        <div class="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <img src="/assets/logo.png" alt="ToolsHere Logo" class="w-full h-full object-contain">
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
            Tools<span class="text-blue-600">Here</span><span class="text-[11px] text-slate-400 font-semibold">.online</span>
          </span>
          <span class="text-[10px] text-slate-400 font-medium tracking-wide hidden min-[360px]:inline">Free Online Tools</span>
        </div>
      </a>

      <!-- Compact Search Bar Near Centre (Desktop) -->
      <div class="hidden md:flex flex-1 max-w-sm mx-4">
        <div class="relative w-full">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input type="text" id="headerSearchInput" onkeydown="if(event.key==='Enter'){window.location.href='/?q='+encodeURIComponent(this.value);}" placeholder="Search 16+ tools (e.g. compress, pdf, emi)..." class="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium">
          
        </div>
      </div>

      <!-- Navigation Links & Mobile Controls -->
      <div class="flex items-center gap-1 sm:gap-3">
        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="/#pdf" class="hover:text-blue-600 transition-colors">PDF Tools</a>
          <a href="/#image" class="hover:text-blue-600 transition-colors">Image Tools</a>
          <a href="/" class="hover:text-blue-600 transition-colors">All Tools</a>
          <a href="/about" class="hover:text-blue-600 transition-colors">About</a>
        </nav>

        <!-- Theme Toggle Button -->
        <button onclick="toggleDarkMode()" class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center text-sm min-w-[44px] min-h-[44px]" title="Toggle Light/Dark Theme" aria-label="Toggle theme">
          <i id="themeIcon" class="fa-solid fa-moon"></i>
        </button>

        <!-- Accessible Mobile Menu Button -->
        <button type="button" onclick="toggleMobileMenu()" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px]" aria-label="Open mobile navigation menu">
          <i class="fa-solid fa-bars text-lg"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation Drawer & Backdrop (Direct child of body for proper fixed positioning) -->
    <div id="mobileDrawerBackdrop" onclick="closeMobileMenu()" class="hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"></div>
    <div id="mobileMenu" class="hidden fixed top-0 right-0 z-50 w-full max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto lg:hidden">
      <!-- Drawer Header -->
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shadow-xs">
            <img src="/assets/logo.png" alt="ToolsHere Logo" class="w-full h-full object-contain">
          </div>
          <span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Tools<span class="text-blue-600">Here</span>
          </span>
        </div>
        <button type="button" onclick="closeMobileMenu()" class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Close menu">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Drawer Content -->
      <div class="p-4 space-y-5 flex-1">
        <!-- Quick Search inside Mobile Drawer -->
        <div>
          <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Search Any Tool</label>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" onkeydown="if(event.key==='Enter'){window.location.href='/?q='+encodeURIComponent(this.value);}" placeholder="e.g. compress, merge, emi..." class="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white font-medium min-h-[44px]">
          </div>
        </div>

        <!-- Tool Categories -->
        <div class="space-y-1">
          <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Categories</label>
          <a href="/#pdf" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-xs"><i class="fa-solid fa-file-pdf"></i></span>
            PDF Tools
          </a>
          <a href="/#image" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs"><i class="fa-solid fa-image"></i></span>
            Image Utilities
          </a>
          <a href="/#text" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs"><i class="fa-solid fa-font"></i></span>
            Text Tools
          </a>
          <a href="/#calc" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs"><i class="fa-solid fa-calculator"></i></span>
            Calculators
          </a>
          <a href="/#dev" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs"><i class="fa-solid fa-code"></i></span>
            Developer Tools
          </a>
          <a href="/#security" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs"><i class="fa-solid fa-shield-halved"></i></span>
            Security &amp; QR
          </a>
          <a href="/" class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 text-sm font-semibold transition-colors min-h-[44px]">
            <span class="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs"><i class="fa-solid fa-layer-group"></i></span>
            All 16+ Utilities
          </a>
        </div>

        <!-- Informational & Legal Links -->
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Information</label>
          <a href="/about" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">About ToolsHere</a>
          <a href="/contact" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Contact Support</a>
          <a href="/privacy" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Privacy Policy</a>
          <a href="/terms" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Terms of Service</a>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div class="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Dark Mode</span>
          <button onclick="toggleDarkMode()" class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 min-h-[36px] flex items-center gap-1.5">
            <i class="fa-solid fa-circle-half-stroke"></i> Switch
          </button>
        </div>
        <p class="text-[10px] text-slate-400 mt-3 text-center">100% In-Browser Local Processing • Zero Server Uploads</p>
      </div>
    </div>

  <!-- Main Content Area -->
  <main class="flex-grow max-w-5xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
    <!-- Clean Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
        <a href="/" class="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] py-1">
          <i class="fa-solid fa-arrow-left text-xs"></i> All Tools
        </a>
        <span class="text-slate-300">/</span>
        ${category ? `<span class="font-medium text-slate-600 dark:text-slate-300">${category}</span><span class="text-slate-300">/</span>` : ''}
        <span class="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">${h1}</span>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
          <i class="fa-solid fa-shield-halved text-emerald-600 text-[10px]"></i> 100% In-Browser Privacy
        </span>
      </div>
    </nav>

    <!-- Page H1 Heading Header -->
    <div class="space-y-2">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-2xs">
          <i class="${iconClass}"></i>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            ${h1}
          </h1>
          <p class="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
            ${metaDesc}
          </p>
        </div>
      </div>
    </div>

    <!-- Pre-rendered Tool Workspace -->
    <div id="toolWorkspace" class="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-8 md:p-10 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6 sm:space-y-8">
      ${workspaceHtml}
    </div>

    <!-- Pre-rendered SEO Guide & FAQs -->
    ${guideHtml}
  </main>

  <!-- Clean Minimal Structured Footer -->
  <footer class="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 pt-12 pb-8 text-slate-600 dark:text-slate-400 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
        <!-- Col 1: Brand & Privacy -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <i class="fa-solid fa-shapes"></i>
            </div>
            <span class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Tools<span class="text-blue-600">here</span>.online
            </span>
          </div>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            A free, clean suite of client-side web utilities for PDF processing, image compression, developer tools, and everyday calculations.
          </p>
          <div class="pt-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
              <i class="fa-solid fa-lock text-[10px] text-emerald-600"></i> Zero Server File Uploads
            </span>
          </div>
        </div>

        <!-- Col 2: Categories -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Tool Categories</h4>
          <ul class="space-y-2">
            <li><a href="/#pdf" class="hover:text-blue-600 transition-colors">PDF Tools</a></li>
            <li><a href="/#image" class="hover:text-blue-600 transition-colors">Image Utilities</a></li>
            <li><a href="/#text" class="hover:text-blue-600 transition-colors">Text &amp; Writing</a></li>
            <li><a href="/#calc" class="hover:text-blue-600 transition-colors">Financial Calculators</a></li>
            <li><a href="/#dev" class="hover:text-blue-600 transition-colors">Developer Utilities</a></li>
            <li><a href="/#security" class="hover:text-blue-600 transition-colors">Security &amp; QR</a></li>
          </ul>
        </div>

        <!-- Col 3: Popular Tools -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Popular Tools</h4>
          <ul class="space-y-2">
            <li><a href="/image-compressor" class="hover:text-blue-600 transition-colors">Image Compressor</a></li>
            <li><a href="/background-remover" class="hover:text-blue-600 transition-colors">Background Remover</a></li>
            <li><a href="/merge-pdf" class="hover:text-blue-600 transition-colors">Merge PDF Files</a></li>
            <li><a href="/compress-pdf" class="hover:text-blue-600 transition-colors">Compress PDF</a></li>
            <li><a href="/age-calculator" class="hover:text-blue-600 transition-colors">Age Calculator</a></li>
            <li><a href="/qr-code-generator" class="hover:text-blue-600 transition-colors">QR Code Generator</a></li>
          </ul>
        </div>

        <!-- Col 4: Trust & Legal -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">About &amp; Trust</h4>
          <ul class="space-y-2">
            <li><a href="/about" class="hover:text-blue-600 transition-colors">About Toolshere</a></li>
            <li><a href="/contact" class="hover:text-blue-600 transition-colors">Contact Support</a></li>
            <li><a href="/privacy" class="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" class="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            <li><a href="/disclaimer" class="hover:text-blue-600 transition-colors">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p>&copy; 2026 Toolshere.online. All Rights Reserved. Client-Side Private Processing.</p>
        <p>Built with simplicity, speed, and privacy in mind.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script>
${mainScript}
  </script>
</body>
</html>`;
}

// 2. Generate All 16 Tool Pages
console.log('Generating 16 tool pages...');
for (const tool of tools) {
  const modalKey = Object.keys(routes).find(k => routes[k].toolId === tool.id);
  const route = modalKey ? routes[modalKey] : null;
  const slug = route ? route.hash : tool.hash.replace('#', '');
  const renderFnName = modalKey ? renderFunctionMap[modalKey] : null;

  const container = { innerText: '', innerHTML: '' };
  const titleHolder = { innerText: '' };
  const iconHolder = { className: '' };

  if (renderFnName && typeof sandbox[renderFnName] === 'function') {
    try {
      sandbox[renderFnName](titleHolder, iconHolder, container);
    } catch (e) {
      console.warn(`Render function ${renderFnName} error: ${e.message}`);
    }
  }

  const workspaceHtml = container.innerHTML || '<p>Loading tool...</p>';
  const guideHtml = generateGuideHtml(tool);

  const jsonLdSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "url": `https://toolshere.online/${slug}`,
      "description": tool.metaDesc,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All modern browsers (Chrome, Firefox, Safari, Edge, Android, iOS)",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolshere.online/" },
        { "@type": "ListItem", "position": 2, "name": tool.category, "item": `https://toolshere.online/#${tool.category.toLowerCase()}` },
        { "@type": "ListItem", "position": 3, "name": tool.name, "item": `https://toolshere.online/${slug}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  const pageHtml = generatePageTemplate({
    slug,
    title: tool.seoTitle || route.title,
    metaDesc: tool.metaDesc || route.metaDesc,
    canonicalUrl: `https://toolshere.online/${slug}`,
    h1: tool.h1 || route.h1,
    category: tool.category,
    iconClass: toolIconsMap[tool.id] || 'fa-solid fa-wrench',
    workspaceHtml,
    guideHtml,
    jsonLdSchemas
  });

  const toolDir = path.join(rootDir, slug);
  if (!fs.existsSync(toolDir)) {
    fs.mkdirSync(toolDir, { recursive: true });
  }
  fs.writeFileSync(path.join(toolDir, 'index.html'), pageHtml, 'utf8');
  console.log(`Generated page: /${slug}/index.html`);
}

// 3. Generate 5 Legal / Informational Pages
const legalPages = [
  {
    slug: 'about',
    modalKey: 'aboutModal',
    iconClass: 'fa-solid fa-circle-info',
    h1: 'About ToolsHere.online',
    category: 'Information'
  },
  {
    slug: 'contact',
    modalKey: 'contactModal',
    iconClass: 'fa-solid fa-envelope',
    h1: 'Contact & Support',
    category: 'Information'
  },
  {
    slug: 'privacy',
    modalKey: 'privacyModal',
    iconClass: 'fa-solid fa-shield-halved',
    h1: 'Privacy Policy',
    category: 'Legal'
  },
  {
    slug: 'terms',
    modalKey: 'termsModal',
    iconClass: 'fa-solid fa-file-contract',
    h1: 'Terms of Service',
    category: 'Legal'
  },
  {
    slug: 'disclaimer',
    modalKey: 'disclaimerModal',
    iconClass: 'fa-solid fa-triangle-exclamation',
    h1: 'General Disclaimer',
    category: 'Legal'
  }
];

console.log('Generating 5 informational & legal pages...');
for (const p of legalPages) {
  const route = routes[p.modalKey];
  const renderFnName = renderFunctionMap[p.modalKey];

  const container = { innerText: '', innerHTML: '' };
  if (renderFnName && typeof sandbox[renderFnName] === 'function') {
    try {
      sandbox[renderFnName]({ innerText: '' }, { className: '' }, container);
    } catch (e) {
      console.warn(`Render legal function ${renderFnName} error: ${e.message}`);
    }
  }

  const jsonLdSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolshere.online/" },
        { "@type": "ListItem", "position": 2, "name": p.h1, "item": `https://toolshere.online/${p.slug}` }
      ]
    }
  ];

  const pageHtml = generatePageTemplate({
    slug: p.slug,
    title: route.title,
    metaDesc: route.metaDesc,
    canonicalUrl: `https://toolshere.online/${p.slug}`,
    h1: p.h1,
    category: p.category,
    iconClass: p.iconClass,
    workspaceHtml: container.innerHTML || '<p>Content</p>',
    guideHtml: '',
    jsonLdSchemas
  });

  const pageDir = path.join(rootDir, p.slug);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
  console.log(`Generated page: /${p.slug}/index.html`);
}

// 4. Generate Comprehensive Validated XML Sitemap
console.log('Generating XML Sitemap...');
const sitemapUrls = [
  { loc: 'https://toolshere.online/', priority: '1.0', changefreq: 'daily' },
  ...tools.map(t => {
    const modalKey = Object.keys(routes).find(k => routes[k].toolId === t.id);
    const slug = modalKey ? routes[modalKey].hash : t.hash.replace('#', '');
    return { loc: `https://toolshere.online/${slug}`, priority: '0.9', changefreq: 'weekly' };
  }),
  { loc: 'https://toolshere.online/about', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/contact', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/privacy', priority: '0.4', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/terms', priority: '0.4', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/disclaimer', priority: '0.4', changefreq: 'monthly' }
];

const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Generated sitemap.xml with ${sitemapUrls.length} canonical URLs.`);

// 5. Update index.html internal links
console.log('Updating index.html internal links to point directly to canonical routes...');
let updatedIndex = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace hash links on cards with clean direct path links
tools.forEach(t => {
  const modalKey = Object.keys(routes).find(k => routes[k].toolId === t.id);
  const slug = modalKey ? routes[modalKey].hash : t.hash.replace('#', '');
  updatedIndex = updatedIndex.split(`href="#${slug}"`).join(`href="/${slug}"`);
  updatedIndex = updatedIndex.split(`"url": "https://toolshere.online/#${slug}"`).join(`"url": "https://toolshere.online/${slug}"`);
});

// Update legal links
['about', 'contact', 'privacy', 'terms', 'disclaimer'].forEach(l => {
  updatedIndex = updatedIndex.split(`href="#${l}"`).join(`href="/${l}"`);
});

fs.writeFileSync(indexHtmlPath, updatedIndex, 'utf8');
console.log('Updated index.html successfully.');

// 6. Generate Clean Minimal White 404 Error Page
console.log('Generating friendly 404.html error page...');
const errorPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <title>404 — Page Not Found | ToolsHere.online</title>
  <meta name="description" content="The page or utility you requested could not be found. Explore all 16+ free online tools and utilities on ToolsHere.online.">
  <meta name="robots" content="noindex, follow">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-white text-slate-800 min-h-screen flex flex-col justify-between">
  <!-- Minimal White Header -->
  <header class="p-4 border-b border-slate-200">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-black text-lg text-slate-900">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
          <i class="fa-solid fa-shapes"></i>
        </div>
        Tools<span class="text-blue-600">here</span>.online
      </a>
      <a href="/" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors">
        Browse All Tools
      </a>
    </div>
  </header>

  <!-- Clean Error Card -->
  <main class="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
    <div class="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">404 — Page Not Found</h1>
      <p class="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
        The tool or page you are looking for doesn't exist or may have been moved.
      </p>
    </div>
    
    <div class="pt-2 flex flex-wrap justify-center gap-3">
      <a href="/" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-2">
        <i class="fa-solid fa-house"></i> Return to Homepage
      </a>
    </div>

    <!-- Quick Tool Shortcuts -->
    <div class="pt-10 border-t border-slate-200 text-left space-y-3">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">Popular Online Utilities</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
        <a href="/image-compressor" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-compress text-blue-600"></i> Image Resizer
        </a>
        <a href="/merge-pdf" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-object-group text-red-600"></i> Merge PDF
        </a>
        <a href="/qr-code-generator" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-qrcode text-teal-600"></i> QR Generator
        </a>
        <a href="/age-calculator" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-calendar-check text-emerald-600"></i> Age Calculator
        </a>
      </div>
    </div>
  </main>

  <!-- Clean Footer -->
  <footer class="p-4 border-t border-slate-200 text-center text-xs text-slate-400">
    &copy; 2026 Toolshere.online • Free, 100% Private Client-Side Digital Utilities
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), errorPageHtml, 'utf8');
console.log('404.html error page generated.');
