const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Extract Scripts and Data
const scripts = [...indexHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const mainScript = scripts[9][1];

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

// Build SEO Guide HTML for a tool
function generateGuideHtml(tool) {
  let relatedHtml = '';
  if (tool.relatedTools && tool.relatedTools.length > 0) {
    relatedHtml = `
      <div class="pt-4 border-t border-slate-200/80 dark:border-slate-700/80">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Related Productivity Utilities</h3>
        <div class="flex flex-wrap gap-2.5">
          ${tool.relatedTools.map(rt => {
            const slug = rt.hash.replace('#', '');
            return `<a href="/${slug}" class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-600">
              <i class="fa-solid fa-arrow-right text-[10px] text-blue-500 group-hover:text-white"></i> ${rt.name}
            </a>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `
    <article class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700/80 space-y-8 text-slate-700 dark:text-slate-300">
      <div class="space-y-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">${tool.category} Utility</span>
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"><i class="fa-solid fa-lock text-[9px]"></i> 100% In-Browser Privacy</span>
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"><i class="fa-solid fa-bolt text-amber-500 text-[9px]"></i> Zero Server Latency</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">About ${tool.name}</h2>
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          <p>${tool.intro}</p>
        </div>
      </div>

      <!-- Step-by-Step Instructions -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-list-ol text-blue-600 dark:text-cyan-400"></i> How to Use ${tool.name} (Step-by-Step)
        </h3>
        <ol class="space-y-2.5 text-sm">
          ${tool.howToUse.map((step, idx) => `
            <li class="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center mt-0.5">${idx + 1}</span>
              <span class="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">${step}</span>
            </li>
          `).join('')}
        </ol>
      </section>

      <!-- Key Verified Features -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-500"></i> Key Features & Capabilities
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${tool.features.map(f => `
            <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <i class="fa-solid fa-check text-emerald-500 text-xs mt-1 shrink-0"></i>
              <span class="text-xs sm:text-sm text-slate-700 dark:text-slate-200">${f}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Supported Formats & Limits -->
      <section class="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-cyan-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-blue-200/70 dark:border-slate-700">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-sliders text-blue-600 dark:text-cyan-400"></i> Technical Specifications & File Compatibility
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div class="p-3 bg-white dark:bg-slate-700/70 rounded-xl border border-slate-200 dark:border-slate-600">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Supported Inputs</span>
            <span class="font-semibold text-slate-800 dark:text-white">${tool.formatsAndLimits.supportedInputs}</span>
          </div>
          <div class="p-3 bg-white dark:dark:bg-slate-700/70 rounded-xl border border-slate-200 dark:border-slate-600">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Output Format</span>
            <span class="font-semibold text-slate-800 dark:text-white">${tool.formatsAndLimits.outputFormat}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-700/70 rounded-xl border border-slate-200 dark:border-slate-600">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Processing Scope</span>
            <span class="font-semibold text-slate-800 dark:text-white">${tool.formatsAndLimits.limitations}</span>
          </div>
        </div>
      </section>

      <!-- Frequently Asked Questions -->
      <section class="space-y-4">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-question text-blue-600 dark:text-cyan-400"></i> Frequently Asked Questions (${tool.name})
        </h3>
        <div class="space-y-3">
          ${tool.faqs.map(faq => `
            <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/90 shadow-2xs space-y-2">
              <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-circle-chevron-right text-blue-500 text-xs"></i> ${faq.q}
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5">${faq.a}</p>
            </div>
          `).join('')}
        </div>
      </section>

      ${relatedHtml}
    </article>
  `;
}

// Generate complete standalone HTML file for each tool or legal page
function generatePageTemplate({ slug, title, metaDesc, canonicalUrl, h1, category, iconClass, workspaceHtml, guideHtml, jsonLdSchemas }) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              50: '#f0f9ff',
              100: '#e0f2fe',
              500: '#06b6d4',
              600: '#2563eb',
              700: '#1d4ed8',
            }
          }
        }
      }
    }
  </script>

  <!-- FontAwesome Icons & Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
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
    .dark .checkerboard-bg {
      background-color: #0f172a;
      background-image: linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 min-h-screen flex flex-col pb-20 md:pb-0">

  <!-- Toast Notification System -->
  <div id="toastContainer" class="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <a href="/" class="flex items-center gap-2.5 group shrink-0" aria-label="ToolsHere.online Homepage">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
          <svg class="w-full h-full text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="24" fill="url(#header-logo-grad)"/>
            <path d="M 22 28 H 60 M 41 28 V 74 M 41 51 H 78 M 60 28 V 74 M 78 28 V 74" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="header-logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stop-color="#2563eb"/>
                <stop offset="1" stop-color="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
            Tools<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-black">Here</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ml-1 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">.online</span>
          </span>
          <span class="text-[9px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:inline">Ultimate Web Utilities</span>
        </div>
      </a>

      <!-- Sleek Glowing Search Capsule -->
      <div class="flex-1 max-w-[170px] sm:max-w-[240px] md:max-w-[280px] transition-all duration-300 focus-within:max-w-[360px] mx-1 sm:mx-3">
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-xs opacity-0 group-hover:opacity-40 group-focus-within:opacity-80 transition duration-300"></div>
          <div class="relative flex items-center bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full border border-slate-200/90 dark:border-slate-700/90 shadow-2xs group-hover:border-cyan-400/60 dark:group-hover:border-cyan-500/50 transition-all duration-200">
            <div class="pl-2.5 sm:pl-3 pr-1.5 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-focus-within:text-cyan-500 transition-colors">
              <i class="fa-solid fa-magnifying-glass text-xs"></i>
            </div>
            <input type="text" id="globalSearchInput" placeholder="Search tools..." onkeydown="if(event.key==='Enter'){window.location.href='/?q='+encodeURIComponent(this.value);}" class="w-full py-1 sm:py-1.5 text-xs bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none tracking-tight font-medium" aria-label="Search all utilities">
            <div class="pr-2 sm:pr-2.5 shrink-0 hidden sm:flex items-center">
              <kbd class="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-600 shadow-2xs tracking-tighter">⌘K</kbd>
            </div>
          </div>
        </div>
      </div>

      <!-- Nav Links & Controls -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        <nav class="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 mr-1">
          <a href="/#pdf" class="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">PDF Tools</a>
          <a href="/" class="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">All Utilities</a>
          <a href="/about" class="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">About</a>
        </nav>
        <button onclick="toggleDarkMode()" class="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="Toggle Light/Dark Theme" aria-label="Toggle theme">
          <i id="themeIcon" class="fa-solid fa-moon text-base sm:text-lg"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-700/80">
      <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap">
        <a href="/" class="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-cyan-400 hover:underline">
          <i class="fa-solid fa-arrow-left"></i> All Tools
        </a>
        <span>/</span>
        ${category ? `<span class="font-medium text-slate-600 dark:text-slate-300">${category}</span><span>/</span>` : ''}
        <span class="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">${h1}</span>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
          <i class="fa-solid fa-shield-halved text-emerald-500 text-[10px]"></i> 100% In-Browser Privacy
        </span>
      </div>
    </nav>

    <!-- Page H1 Heading Header -->
    <div class="space-y-2">
      <div class="flex items-start gap-3.5">
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shadow-cyan-500/20 shrink-0">
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
    <div id="toolWorkspace" class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/90 dark:border-slate-700/90 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40 space-y-8">
      ${workspaceHtml}
    </div>

    <!-- Pre-rendered SEO Guide & FAQs -->
    ${guideHtml}
  </main>

  <!-- Footer -->
  <footer class="mt-auto border-t border-slate-200 dark:border-slate-700/80 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50">
    <div class="max-w-7xl mx-auto space-y-3">
      <div class="flex flex-wrap justify-center gap-4 sm:gap-6 font-semibold">
        <a href="/" class="hover:text-blue-600 dark:hover:text-cyan-400">Home</a>
        <a href="/#all" class="hover:text-blue-600 dark:hover:text-cyan-400">All Utilities</a>
        <a href="/#pdf" class="hover:text-blue-600 dark:hover:text-cyan-400">PDF Suite</a>
        <a href="/about" class="hover:text-blue-600 dark:hover:text-cyan-400">About Us</a>
        <a href="/contact" class="hover:text-blue-600 dark:hover:text-cyan-400">Contact</a>
        <a href="/privacy" class="hover:text-blue-600 dark:hover:text-cyan-400">Privacy Policy</a>
        <a href="/terms" class="hover:text-blue-600 dark:hover:text-cyan-400">Terms of Service</a>
        <a href="/disclaimer" class="hover:text-blue-600 dark:hover:text-cyan-400">Disclaimer</a>
      </div>
      <p class="text-[10px] text-slate-400 pt-2">&copy; 2026 toolshere.online. All Rights Reserved. Client-Side Private Processing.</p>
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
let updatedIndex = indexHtml;

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

// 6. Generate Friendly 404 Error Page
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
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col justify-between font-sans">
  <!-- Minimal Header -->
  <header class="p-4 border-b border-slate-800">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-black text-lg text-white">
        <i class="fa-solid fa-wrench text-cyan-400"></i> Tools<span class="text-cyan-400">Here</span>.online
      </a>
      <a href="/" class="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all">
        Browse All Tools
      </a>
    </div>
  </header>

  <!-- Error Card -->
  <main class="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
    <div class="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center text-4xl mx-auto shadow-xl">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <div class="space-y-2">
      <h1 class="text-4xl sm:text-5xl font-black text-white tracking-tight">404 — Page Not Found</h1>
      <p class="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
        The tool or page you are looking for doesn't exist or may have moved.
      </p>
    </div>
    
    <div class="pt-4 flex flex-wrap justify-center gap-3">
      <a href="/" class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2">
        <i class="fa-solid fa-house"></i> Return to Homepage
      </a>
    </div>

    <!-- Quick Tool Shortcuts -->
    <div class="pt-10 border-t border-slate-800 text-left space-y-3">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">Popular Online Utilities</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
        <a href="/image-compressor" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-2">
          <i class="fa-solid fa-compress text-sky-400"></i> Image Resizer
        </a>
        <a href="/merge-pdf" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-2">
          <i class="fa-solid fa-object-group text-orange-400"></i> Merge PDF
        </a>
        <a href="/qr-code-generator" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-2">
          <i class="fa-solid fa-qrcode text-cyan-400"></i> QR Generator
        </a>
        <a href="/age-calculator" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-2">
          <i class="fa-solid fa-calendar-check text-emerald-400"></i> Age Calculator
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
    &copy; 2026 ToolsHere.online • Free, 100% Private Client-Side Digital Utilities
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(rootDir, '404.html'), errorPageHtml, 'utf8');
console.log('404.html error page generated.');
