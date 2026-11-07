const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Extract Main Script and Registry Data
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let mainScript = '';
if (fs.existsSync(appJsPath)) {
  mainScript = fs.readFileSync(appJsPath, 'utf8');
} else {
  const scripts = [...indexHtml.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  const mainScriptObj = scripts.find(s => s[1].includes('SEO_TOOL_REGISTRY'));
  if (!mainScriptObj) {
    console.error('Could not find script with SEO_TOOL_REGISTRY!');
    process.exit(1);
  }
  mainScript = mainScriptObj[1];
}

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

const seoOverrides = {
  imgResizer: {
    seoTitle: "Image Compressor & Resizer (20KB, 50KB, 100KB) - ToolsHere",
    metaDesc: "Compress and resize JPG, PNG, and WebP images to exact sizes like 20KB, 50KB, or 100KB directly in your browser. Fast, private, with zero server uploads.",
    aboutHeading: "About ToolsHere Image Compressor & Resizer",
    formatNoticeHtml: `
        <div class="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mt-2">
          <div class="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-info text-blue-600 dark:text-blue-400"></i> Output Format &amp; Transparency Notice
          </div>
          <p class="leading-relaxed">
            The Image Compressor exports optimized <strong>JPEG (.jpg)</strong> files for maximum file size reduction, even when your input file is a PNG, WebP, or GIF image. Because the standard JPEG format does not support alpha transparency, transparent backgrounds may not be preserved and will render with a solid background.
          </p>
          <p class="leading-relaxed">
            If you need to maintain transparent backgrounds or convert your files into PNG, WebP, or other formats without compression, please use our <a href="/image-converter" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Image Converter</a> tool.
          </p>
        </div>
    `,
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-image"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Convert PDF to JPG Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Step-by-step guide to exporting PDF documents into high-resolution JPG images ready for compression and resizing.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-compress-pdf-for-email" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress Files for Email Attachments
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Understand email provider size limits (under 25MB) and how to optimize document and photo payloads.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
    relatedTools: [
      { name: "Image Format Converter", hash: "#image-converter" },
      { name: "AI Background Remover", hash: "#background-remover" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Compress PDF Document", hash: "#compress-pdf" }
    ],
    useCases: [
      "Compressing passport photos and signatures to under 20KB or 50KB for government job and exam portals.",
      "Downscaling large camera photos and WebP banners to boost website page loading speeds.",
      "Resizing graphics to exact pixel dimensions for Instagram, LinkedIn, and blog headers."
    ]
  },
  bgRemover: {
    seoTitle: "Free Image Background Remover & Transparent PNG - ToolsHere",
    metaDesc: "Remove image backgrounds instantly in your browser. Fine-tune color tolerance, isolate subjects, and download transparent PNG photos with 100% device privacy.",
    relatedTools: [
      { name: "Image Compressor & Resizer", hash: "#image-compressor" },
      { name: "Image Format Converter", hash: "#image-converter" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" }
    ],
    useCases: [
      "Creating transparent product cutouts for e-commerce listings on Amazon, eBay, and Shopify.",
      "Extracting clean headshot portraits for resume profiles, company websites, and badges.",
      "Isolating logos and vector icons from white or uniform backdrops."
    ]
  },
  pdfWord: {
    seoTitle: "PDF to Word Converter: Convert PDF to DOC Free - ToolsHere",
    metaDesc: "Convert PDF files into editable Word (.doc) documents directly in your browser. Fast, free, confidential text extraction with zero server file uploads.",
    relatedTools: [
      { name: "Merge & Split PDF", hash: "#merge-pdf" },
      { name: "Compress PDF Document", hash: "#compress-pdf" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Word & Character Counter", hash: "#word-counter" }
    ],
    useCases: [
      "Extracting text from read-only PDF reports and contracts into editable Microsoft Word documents.",
      "Updating resume text and CV formatting when original source files are lost.",
      "Copying structured content and paragraphs without manual re-typing."
    ]
  },
  pdfMerge: {
    seoTitle: "Merge PDF Files Online: Combine PDFs Free - ToolsHere",
    metaDesc: "Combine multiple PDF documents into a single organized file in seconds. Free, secure, client-side PDF merging with page order preview and no file limits.",
    relatedTools: [
      { name: "Compress PDF Document", hash: "#compress-pdf" },
      { name: "PDF to Word Converter", hash: "#pdf-to-word" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Image Compressor & Resizer", hash: "#image-compressor" }
    ],
    useCases: [
      "Combining invoices, tax receipts, and bank statements into one consolidated accounting PDF.",
      "Merging multi-page legal agreements, leases, and identity cards for official submission.",
      "Bundling project chapters, cover letters, and resumes into a unified portfolio."
    ]
  },
  ageCalc: {
    seoTitle: "Age Calculator: Calculate Exact Age & Days - ToolsHere",
    metaDesc: "Calculate your exact chronological age in years, months, weeks, and total days lived. Accurate date of birth calculator factoring leap years instantly.",
    relatedTools: [
      { name: "GST & Loan EMI Calculator", hash: "#emi-calculator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "Strong Password Creator", hash: "#password-generator" },
      { name: "QR Code Studio & Reader", hash: "#qr-code-generator" }
    ],
    useCases: [
      "Determining exact eligibility age in years, months, and days for competitive government exams.",
      "Calculating milestone anniversary countdowns, retirement dates, and lifespan days.",
      "Verifying age requirements for insurance policies, driving licenses, and visa applications."
    ]
  },
  ytThumb: {
    seoTitle: "YouTube Thumbnail Downloader: 1080p Full HD - ToolsHere",
    metaDesc: "Download high-resolution 1080p HD YouTube video and Shorts thumbnails instantly. Paste any video URL to preview and save Maxresdefault images for free.",
    relatedTools: [
      { name: "Image Compressor & Resizer", hash: "#image-compressor" },
      { name: "AI Background Remover", hash: "#background-remover" },
      { name: "Image Format Converter", hash: "#image-converter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" }
    ],
    useCases: [
      "Extracting full HD 1080p thumbnails from YouTube videos for editorial commentary and blog previews.",
      "Saving reference graphic design templates, fonts, and compositions for creator inspiration.",
      "Downloading video artwork for offline educational and media archives."
    ]
  },
  qrTool: {
    seoTitle: "Free QR Code Generator: Create Custom QR Codes - ToolsHere",
    metaDesc: "Generate custom high-resolution QR codes for websites, links, and text instantly. High-correction Level H graphics, private generation, and instant download.",
    relatedTools: [
      { name: "Strong Password Creator", hash: "#password-generator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" }
    ],
    useCases: [
      "Creating contactless digital restaurant menu and review landing page QR codes.",
      "Generating scannable Wi-Fi login codes, vCard business cards, and event invitations.",
      "Directing physical print marketing flyers and stickers directly to website URLs."
    ]
  },
  passwordGen: {
    seoTitle: "Strong Password Generator: Secure Random Keys - ToolsHere",
    metaDesc: "Generate cryptographically secure, random passwords with custom symbols, numbers, and length using the Web Crypto API. 100% private and unhackable.",
    relatedTools: [
      { name: "QR Code Studio & Reader", hash: "#qr-code-generator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "JSON Formatter & Validator", hash: "#json-formatter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" }
    ],
    useCases: [
      "Generating high-entropy, brute-force-resistant master passwords for email and banking.",
      "Creating random API keys, database secrets, and SSH passphrases for developers.",
      "Creating secure one-time credentials for team members and Wi-Fi networks."
    ]
  },
  wordCount: {
    seoTitle: "Word Counter: Live Word & Character Analyzer - ToolsHere",
    metaDesc: "Count words, characters, sentences, paragraphs, and reading time in real time. Perfect for essays, social media posts, articles, and SEO copy editing.",
    relatedTools: [
      { name: "Text Case Converter", hash: "#text-case-converter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "JSON Formatter & Validator", hash: "#json-formatter" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ],
    useCases: [
      "Monitoring character counts to fit Twitter (280c), LinkedIn, and Instagram limits.",
      "Checking academic essay, dissertation, and college submission word quotas.",
      "Verifying optimal SEO meta description (150-160c) and title tag (50-60c) lengths."
    ]
  },
  gstEmi: {
    seoTitle: "Loan EMI & GST Calculator: Quick Financial Tool - ToolsHere",
    metaDesc: "Calculate monthly loan EMIs and standard GST tax rates (5%, 12%, 18%, 28%) instantly. Accurate financial planning for home, car, and personal loans.",
    relatedTools: [
      { name: "Age & Date Calculator", hash: "#age-calculator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "QR Code Studio & Reader", hash: "#qr-code-generator" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ],
    useCases: [
      "Calculating monthly loan repayments, interest components, and total loan payback costs.",
      "Adding or removing GST amounts from wholesale invoices and retail billings.",
      "Comparing car, home, or personal loan offers across varied interest rates and tenures."
    ]
  },
  imgFormat: {
    seoTitle: "Image Format Converter: Convert PNG, JPG, WebP - ToolsHere",
    metaDesc: "Convert photos between JPG, PNG, and WebP formats instantly in your browser. Fast, free batch image conversion preserving original resolution and privacy.",
    relatedTools: [
      { name: "Image Compressor & Resizer", hash: "#image-compressor" },
      { name: "AI Background Remover", hash: "#background-remover" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" }
    ],
    useCases: [
      "Converting transparent PNG artwork into universally compatible JPEG photos.",
      "Transforming JPG pictures into modern WebP format for 30% faster web performance.",
      "Standardizing image assets for official document portals that reject WebP uploads."
    ]
  },
  textCase: {
    seoTitle: "Text Case Converter: UPPERCASE, Title Case, Slug - ToolsHere",
    metaDesc: "Convert text case instantly online. Transform copy between UPPERCASE, lowercase, Title Case, camelCase, and clean URL slugs with one-click clipboard copy.",
    relatedTools: [
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "JSON Formatter & Validator", hash: "#json-formatter" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ],
    useCases: [
      "Capitalizing article headlines into AP or Chicago Title Case automatically.",
      "Converting article titles into clean URL-friendly slugs for web publishing.",
      "Sanitizing text to lowercase or UPPERCASE for coding and data entry."
    ]
  },
  jsonFormat: {
    seoTitle: "JSON Formatter & Validator: Beautify & Minify - ToolsHere",
    metaDesc: "Format, beautify, validate, and minify JSON data online. Inspect syntax errors with clear line indicators. 100% client-side for secure API debugging.",
    relatedTools: [
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "Text Case Converter", hash: "#text-case-converter" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ],
    useCases: [
      "Formatting compressed API JSON responses into human-readable indented structures.",
      "Validating complex payload syntax to catch missing commas, quotes, and brackets.",
      "Minifying configuration files to strip unnecessary whitespace for production deployments."
    ]
  },
  seoMeta: {
    seoTitle: "SEO Meta Tag Generator: Google & Open Graph Tags - ToolsHere",
    metaDesc: "Generate search-optimized meta tags for any webpage. Create Google titles, descriptions, Open Graph previews, and Twitter cards with instant copy code.",
    intro: "ToolsHere SEO Meta Tag Generator is a client-side web utility designed for webmasters, digital marketers, developers, and content writers to craft high-ranking HTML metadata. High-quality meta tags communicate the topic of your webpage to search engines like Google, Bing, and DuckDuckGo, while dictating exactly how your content appears when shared across social networks including Facebook, LinkedIn, X (Twitter), and messaging apps. Writing search snippets without precise character bounds frequently leads to truncated titles and omitted descriptions in Search Engine Results Pages (SERPs). This generator provides real-time character counters, keyword placement validation, and instant code export, ensuring every tag complies with contemporary search engine quality guidelines without any data ever being uploaded to external servers.",
    howToUse: [
      "Enter your target Webpage Title in the Title field (aim for 50 to 60 characters for optimal display).",
      "Draft a compelling Meta Description in the Description field (aim for 140 to 160 characters with a clear call-to-action).",
      "Provide your Canonical Website URL (use the full https:// format to avoid split indexation).",
      "Add your target Meta Keywords and the absolute URL to your Open Graph Social Share Image.",
      "Review the live preview box and click 'Copy Meta Tags' to paste the clean HTML code directly into your document's <head> section."
    ],
    features: [
      "Dual SERP & Social Tag Generation: Outputs standard Google HTML tags, Open Graph (Facebook/LinkedIn), and Twitter Cards.",
      "Live Length Guidance: Visual helpers indicate ideal lengths for Title (50-60c) and Meta Description (140-160c).",
      "Crawler Control Ready: Includes robots directives (index, follow, max-snippet:-1, max-image-preview:large).",
      "Single-Click Clipboard Copy: Instant export formatted in clean, indentation-friendly HTML markup.",
      "100% Client-Side Privacy: Operates completely inside your local browser memory with zero tracking."
    ],
    formatsAndLimits: {
      supportedInputs: "Text, Canonical URLs, Image URLs, Custom Meta Keywords",
      outputFormat: "Standard HTML5 <meta> tags, Open Graph tags, Twitter Card tags",
      limitations: "Generates HTML head tags; structured data (JSON-LD schemas) should be authored alongside these tags."
    },
    useCases: [
      "Optimizing blog posts, e-commerce products, and landing pages for higher click-through rates (CTR) on Google.",
      "Configuring rich Open Graph social cards with custom images so shared links look professional on social media.",
      "Standardizing SEO head tags across new client websites during front-end web development."
    ],
    extraGuideHtml: `
      <!-- Technical SEO Metadata Guide -->
      <section class="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-code text-blue-600"></i> Technical SEO Metadata Best Practices
        </h2>
        <div class="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Well-structured meta tags serve as the foundation of organic search visibility. When search engine spiders crawl your web pages, HTML metadata in the document &lt;head&gt; provides direct signals regarding the page's core topic, target audience, and indexing permissions.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <i class="fa-solid fa-heading text-blue-600"></i> Title Tag Architecture
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                Aim for <strong>50 to 60 characters</strong> (approx. 580 pixels). Front-load your highest-volume primary keyword within the first 35 characters, followed by a secondary qualifier and a clean brand separator (e.g. <code>Primary Keyword: Action Benefit - Brand</code>).
              </p>
            </div>
            <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <i class="fa-solid fa-align-left text-blue-600"></i> Meta Description Engineering
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                Calibrate descriptions between <strong>140 and 160 characters</strong>. Write compelling, action-oriented copy that directly answers user search intent. Conclude with an active benefit (e.g. <em>"Free online tool with 100% private in-browser processing."</em>) to boost Organic Click-Through Rates (CTR).
              </p>
            </div>
            <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <i class="fa-solid fa-share-nodes text-purple-600"></i> Social Open Graph Cards
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                Social platforms (Facebook, LinkedIn, Slack, WhatsApp) require <code>og:title</code>, <code>og:description</code>, and <code>og:image</code>. Use high-resolution <strong>1200 x 630 px</strong> graphics with a 1.91:1 ratio to ensure social preview cards render crisply on mobile screens.
              </p>
            </div>
            <div class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <i class="fa-solid fa-robot text-emerald-600"></i> Robots &amp; Canonical Directives
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                Specify <code>&lt;link rel="canonical" href="https://..."&gt;</code> to designate the authoritative URL and eliminate split-ranking penalties. Pair with <code>max-snippet:-1, max-image-preview:large</code> to permit Google rich snippet previews.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    faqs: [
      {
        q: "What is the ideal character length for Google meta titles and descriptions?",
        a: "Google typically displays the first 50 to 60 characters of a Title tag (or up to roughly 580-600 pixels) and 140 to 160 characters for a Meta Description. Exceeding these bounds often results in your snippet being truncated with an ellipsis (...)."
      },
      {
        q: "Why is the Open Graph image tag (og:image) important?",
        a: "When users share your link on Facebook, LinkedIn, WhatsApp, or Slack, the platforms look for the og:image meta tag to render a prominent visual card. The recommended size is 1200x630 pixels with an aspect ratio of 1.91:1."
      },
      {
        q: "Where should the generated meta tags be placed?",
        a: "Paste the generated HTML snippet inside the <head> ... </head> section of your webpage HTML document, ideally before any CSS stylesheet or font links."
      },
      {
        q: "Do search engines still use the 'keywords' meta tag for ranking?",
        a: "Major search engines like Google do not use the meta keywords tag for web search rankings. However, some internal site search engines and regional engines still reference it. It is included for backwards compatibility."
      },
      {
        q: "How does a canonical tag protect my website's SEO?",
        a: "A canonical link (<link rel='canonical' href='...'>) signals to Google which URL represents the master copy of a page. This prevents duplicate content penalties if your page is accessible via HTTP, HTTPS, www, or query parameters."
      }
    ],
    relatedTools: [
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "Text Case Converter", hash: "#text-case-converter" },
      { name: "JSON Formatter & Validator", hash: "#json-formatter" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" }
    ]
  },
  compressPdf: {
    seoTitle: "Compress PDF Online: Reduce PDF File Size Free - ToolsHere",
    metaDesc: "Compress PDF files online without losing readability. Reduce document size for email and job portal uploads with 100% private client-side processing.",
    relatedTools: [
      { name: "PDF to Word Converter", hash: "#pdf-to-word" },
      { name: "Merge & Split PDF", hash: "#merge-pdf" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Image Compressor & Resizer", hash: "#image-compressor" }
    ],
    useCases: [
      "Shrinking oversized PDF contracts, resumes, and tax filings to under 500KB or 1MB for portal uploads.",
      "Optimizing scanned school assignments and textbooks for rapid email attachments.",
      "Compressing archived PDF reports to save local device storage."
    ]
  },
  imgToPdf: {
    seoTitle: "Image to PDF Converter: Convert JPG & PNG to PDF - ToolsHere",
    metaDesc: "Convert and bundle multiple JPG, PNG, and WebP images into a single printable PDF document. Set page size, orientation, and margins with zero server uploads.",
    relatedTools: [
      { name: "Image Compressor & Resizer", hash: "#image-compressor" },
      { name: "Image Format Converter", hash: "#image-converter" },
      { name: "PDF to Word Converter", hash: "#pdf-to-word" },
      { name: "Merge & Split PDF", hash: "#merge-pdf" }
    ],
    useCases: [
      "Bundling photographed receipt images and ID cards into a single clean PDF for loan and visa applications.",
      "Creating printable photo albums, digital portfolios, and visual handouts from multiple graphics.",
      "Combining scanned book pages into an organized, readable PDF book."
    ]
  }
};




// Build SEO Guide HTML for a tool with clean minimal white design and optimized H2/H3 semantic structure
function generateGuideHtml(tool) {
  let relatedHtml = '';
  if (tool.relatedTools && tool.relatedTools.length > 0) {
    relatedHtml = `
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Related Productivity Utilities</h2>
        <div class="flex flex-wrap gap-2">
          ${tool.relatedTools.map(rt => {
            const slug = rt.hash.replace('#', '');
            return `<a href="/${slug}" class="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
              <i class="fa-solid fa-arrow-right text-[10px] text-blue-500"></i> ${rt.name}
            </a>`;
          }).join('')}
        </div>
      </section>
    `;
  }

  let useCasesHtml = '';
  if (tool.useCases && tool.useCases.length > 0) {
    useCasesHtml = `
      <!-- Common Use Cases & Workflows -->
      <section class="space-y-4">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-lightbulb text-amber-500"></i> Common Use Cases &amp; Practical Workflows
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${tool.useCases.map(uc => `
            <div class="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              <i class="fa-solid fa-check text-blue-600 text-xs mr-1.5"></i> ${uc}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  return `
    <article class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300">
      <div class="space-y-3">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wide">${tool.category} Utility</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"><i class="fa-solid fa-shield-halved text-[10px] text-emerald-600"></i> 100% In-Browser Privacy</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"><i class="fa-solid fa-bolt text-blue-600 text-[10px]"></i> Zero Server Latency</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">${tool.aboutHeading || (tool.id === 'imgResizer' ? 'About ToolsHere Image Compressor & Resizer' : `About ${tool.name} &amp; Core Utility`)}</h2>
        <div class="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          <p>${tool.intro}</p>
        </div>
      </div>

      <!-- Step-by-Step Instructions -->
      <section class="space-y-4">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-list-ol text-blue-600"></i> How to Use ${tool.name} (Step-by-Step Guide)
        </h2>
        <ol class="space-y-2.5 text-sm">
          ${tool.howToUse.map((step, idx) => `
            <li class="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span class="shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center mt-0.5">${idx + 1}</span>
              <span class="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">${step}</span>
            </li>
          `).join('')}
        </ol>
      </section>

      <!-- Key Verified Features -->
      <section class="space-y-4">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-600"></i> Key Features &amp; Core Benefits
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${tool.features.map(f => `
            <div class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <i class="fa-solid fa-check text-emerald-600 text-xs mt-1 shrink-0"></i>
              <span class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">${f}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Supported Formats & Limits -->
      <section class="space-y-3 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <h2 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-sliders text-blue-600"></i> Technical Specifications &amp; Supported Formats
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Supported Inputs</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${tool.formatsAndLimits.supportedInputs}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Output Format</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${tool.formatsAndLimits.outputFormat}</span>
          </div>
          <div class="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Processing Scope</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${tool.formatsAndLimits.limitations}</span>
          </div>
        </div>
        ${tool.formatNoticeHtml || ''}
      </section>

      ${useCasesHtml}

      ${tool.extraGuideHtml || ''}

      <!-- Frequently Asked Questions -->
      <section class="space-y-4">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-question text-blue-600"></i> Frequently Asked Questions (${tool.name})
        </h2>
        <div class="space-y-3">
          ${tool.faqs.map(faq => `
            <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2">
              <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-circle-chevron-right text-blue-600 text-xs"></i> ${faq.q}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5">${faq.a}</p>
            </div>
          `).join('')}
        </div>
      </section>

      ${tool.helpfulGuidesHtml || ''}

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
  <script>
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      if (location.protocol === 'http:' || location.hostname.startsWith('www.')) {
        location.replace('https://toolshere.online' + location.pathname + location.search + location.hash);
      }
    }
  </script>
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${slug.replace(/-/g, ' ')}, online tools, free web utilities, ${category ? category.toLowerCase() + ' tools,' : ''} toolshere">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Toolshere">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://toolshere.online/assets/logo.png">
  <meta property="og:image:secure_url" content="https://toolshere.online/assets/logo.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:image:alt" content="Toolshere Logo">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${canonicalUrl}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${metaDesc}">
  <meta property="twitter:image" content="https://toolshere.online/assets/logo.png">

  <!-- Favicon & Touch Icons (Google Search Best Practice: 48x48 PNG First) -->
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512x512.png">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#2563eb">

  <!-- Preconnect to Font & CDN Origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

  <!-- Preload & Load High-Performance Compiled CSS -->
  <link rel="preload" href="/assets/css/style.min.css" as="style">
  <link rel="stylesheet" href="/assets/css/style.min.css">

  <!-- Asynchronous Google Fonts (Inter) with display=swap -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>

  <!-- Non-blocking FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>

  <!-- Smart Non-Blocking Google Analytics & AdSense Loader -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-RXVYKC5YG5');

    (function() {
      let loaded = false;
      function loadThirdParty() {
        if (loaded) return;
        loaded = true;
        ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(function(e) {
          window.removeEventListener(e, loadThirdParty, { passive: true });
        });
        const gtm = document.createElement('script');
        gtm.src = 'https://www.googletagmanager.com/gtag/js?id=G-RXVYKC5YG5';
        gtm.async = true;
        document.head.appendChild(gtm);

        const ads = document.createElement('script');
        ads.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5695881882047202';
        ads.async = true;
        ads.crossOrigin = 'anonymous';
        document.head.appendChild(ads);
      }
      ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(function(e) {
        window.addEventListener(e, loadThirdParty, { passive: true, once: true });
      });
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function() { setTimeout(loadThirdParty, 3500); });
      } else {
        setTimeout(loadThirdParty, 3500);
      }
    })();
  </script>

  <!-- Structured Data Schemas -->
  ${[
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://toolshere.online/#organization",
      "name": "Toolshere",
      "url": "https://toolshere.online/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://toolshere.online/#logo",
        "url": "https://toolshere.online/assets/logo.png",
        "contentUrl": "https://toolshere.online/assets/logo.png",
        "caption": "Toolshere Logo",
        "width": 512,
        "height": 512
      },
      "image": "https://toolshere.online/assets/logo.png"
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://toolshere.online/#website",
      "name": "Toolshere",
      "alternateName": "Toolshere.online",
      "url": "https://toolshere.online/",
      "publisher": {
        "@id": "https://toolshere.online/#organization"
      }
    },
    ...jsonLdSchemas
  ].map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n')}
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
          <img src="/assets/logo.png" alt="ToolsHere Logo" width="36" height="36" class="w-full h-full object-contain">
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
            <img src="/assets/logo.png" alt="ToolsHere Logo" width="36" height="36" class="w-full h-full object-contain">
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

    <!-- Pre-rendered Tool Workspace (Exempt from intrusive auto-ads to protect file uploads/downloads) -->
    <div id="toolWorkspace" class="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-8 md:p-10 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6 sm:space-y-8 google-auto-ads-ignore adsbygoogle-noablate">
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

        <!-- Col 2: PDF & Image Utilities (8 Tools) -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">PDF &amp; Image Tools</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/image-compressor" class="hover:text-blue-600 transition-colors">Image Compressor &amp; Resizer</a></li>
            <li><a href="/background-remover" class="hover:text-blue-600 transition-colors">AI Background Remover</a></li>
            <li><a href="/pdf-to-word" class="hover:text-blue-600 transition-colors">PDF to Word Converter</a></li>
            <li><a href="/merge-pdf" class="hover:text-blue-600 transition-colors">Merge &amp; Split PDF</a></li>
            <li><a href="/compress-pdf" class="hover:text-blue-600 transition-colors">Compress PDF Document</a></li>
            <li><a href="/image-to-pdf" class="hover:text-blue-600 transition-colors">Image to PDF Converter</a></li>
            <li><a href="/image-converter" class="hover:text-blue-600 transition-colors">Image Format Converter</a></li>
            <li><a href="/youtube-thumbnail" class="hover:text-blue-600 transition-colors">YouTube Thumbnail Grabber</a></li>
          </ul>
        </div>

        <!-- Col 3: Text, Calc & Code Utilities (8 Tools) -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Calculators &amp; Utilities</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/age-calculator" class="hover:text-blue-600 transition-colors">Age &amp; Date Calculator</a></li>
            <li><a href="/emi-calculator" class="hover:text-blue-600 transition-colors">GST &amp; Loan EMI Calculator</a></li>
            <li><a href="/qr-code-generator" class="hover:text-blue-600 transition-colors">QR Code Studio &amp; Reader</a></li>
            <li><a href="/password-generator" class="hover:text-blue-600 transition-colors">Strong Password Creator</a></li>
            <li><a href="/word-counter" class="hover:text-blue-600 transition-colors">Word &amp; Character Counter</a></li>
            <li><a href="/text-case-converter" class="hover:text-blue-600 transition-colors">Text Case Converter</a></li>
            <li><a href="/json-formatter" class="hover:text-blue-600 transition-colors">JSON Formatter &amp; Validator</a></li>
            <li><a href="/seo-meta-generator" class="hover:text-blue-600 transition-colors">SEO Meta Tag Generator</a></li>
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

  <!-- Core Minified Application Script (Deferred & Cached) -->
  <script defer src="/assets/js/app.js"></script>
</body>
</html>`;
}

// 2. Generate All 16 Tool Pages
console.log('Generating 16 tool pages...');
for (const tool of tools) {
  if (seoOverrides[tool.id]) {
    Object.assign(tool, seoOverrides[tool.id]);
  }
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
    title: 'About ToolsHere: Privacy-First Browser Tools - ToolsHere',
    metaDesc: 'Learn about ToolsHere.online, our mission for 100% private client-side web utility tools, our zero-upload architecture, and our engineering standards.',
    category: 'Information',
    h2s: ['Our Client-Side Privacy Architecture', 'Engineering & Security Standards', 'Zero Data Retention Policy']
  },
  {
    slug: 'contact',
    modalKey: 'contactModal',
    iconClass: 'fa-solid fa-envelope',
    h1: 'Contact & Support',
    title: 'Contact ToolsHere Support & Feedback Team - ToolsHere',
    metaDesc: 'Get in touch with the ToolsHere.online team for technical support, feature requests, bug reports, and business inquiries. We value user feedback.',
    category: 'Information',
    h2s: ['Technical Support & Bug Inquiries', 'Feature Requests & Suggestions', 'Response Time Expectations']
  },
  {
    slug: 'privacy',
    modalKey: 'privacyModal',
    iconClass: 'fa-solid fa-shield-halved',
    h1: 'Privacy Policy',
    title: 'Privacy Policy: Zero Server Data Storage - ToolsHere',
    metaDesc: 'Read the ToolsHere.online privacy policy. Understand our client-side architecture where all image, PDF, and text processing stays locally on your device.',
    category: 'Legal',
    h2s: ['Local Browser Execution Guarantee', 'Cookies & Analytics Disclosure', 'Third-Party Services & User Rights']
  },
  {
    slug: 'terms',
    modalKey: 'termsModal',
    iconClass: 'fa-solid fa-file-contract',
    h1: 'Terms of Service',
    title: 'Terms of Service & Usage Guidelines - ToolsHere',
    metaDesc: 'Review the terms of service, conditions of use, and intellectual property policies governing your access to ToolsHere.online free browser utilities.',
    category: 'Legal',
    h2s: ['Permitted Utility Usage', 'Intellectual Property & Content Ownership', 'Disclaimer of Warranties & Liability']
  },
  {
    slug: 'disclaimer',
    modalKey: 'disclaimerModal',
    iconClass: 'fa-solid fa-triangle-exclamation',
    h1: 'General Disclaimer',
    title: 'General & Technical Disclaimer Policy - ToolsHere',
    metaDesc: 'Read the legal and technical disclaimer for ToolsHere.online. Clarifications on calculations, document conversions, and third-party content policies.',
    category: 'Legal',
    h2s: ['Calculation & Conversion Estimates', 'Third-Party Content & External Links', 'User Responsibility & Due Diligence']
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
    title: p.title || route.title,
    metaDesc: p.metaDesc || route.metaDesc,
    canonicalUrl: `https://toolshere.online/${p.slug}`,
    h1: p.h1,
    category: p.category,
    iconClass: p.iconClass,
    workspaceHtml: `
      <div class="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        ${container.innerHTML || '<p>Content</p>'}
        ${p.h2s ? `
          <div class="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
            ${p.h2s.map(h2 => `
              <section class="space-y-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-shield-check text-blue-600 text-sm"></i> ${h2}
                </h2>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  ToolsHere is dedicated to providing reliable, private client-side utilities. For inquiries or updates regarding ${h2.toLowerCase()}, our support team is available via our contact page.
                </p>
              </section>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `,
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
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5695881882047202" crossorigin="anonymous"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-white text-slate-800 min-h-screen flex flex-col justify-between">
  <!-- Minimal White Header -->
  <header class="p-4 border-b border-slate-200">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5 font-bold text-lg text-slate-900">
        <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
          <img src="/assets/logo.png" alt="ToolsHere Logo" width="36" height="36" class="w-full h-full object-contain">
        </div>
        Tools<span class="text-blue-600">Here</span><span class="text-[11px] text-slate-400 font-semibold">.online</span>
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
