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
            <i class="fa-solid fa-circle-check text-emerald-600 dark:text-emerald-400"></i> Multi-Format Export &amp; Transparency Handling
          </div>
          <p class="leading-relaxed">
            The Image Compressor lets you export your images in <strong>Auto (Match Original)</strong>, <strong>JPEG</strong>, <strong>WebP</strong>, or <strong>PNG</strong> format. Alpha transparency is fully preserved when exporting as WebP or PNG. When exporting as JPEG, you can choose a clean white (default) or black solid background fill for transparent areas.
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
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
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
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
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
    name: "Online Background Remover",
    seoTitle: "Free Online Background Remover: Create Transparent PNGs - ToolsHere",
    metaDesc: "Remove image backgrounds directly in your browser using color-difference selection. Fine-tune sensitivity, smooth edges with feathering, and download transparent PNGs.",
    h1: "Free Online Background Remover & Transparent PNG Maker",
    aboutHeading: "About ToolsHere In-Browser Background Remover & Cutout Studio",
    intro: "ToolsHere Online Background Remover is a client-side image isolation utility designed for online sellers, designers, educators, and content creators who need to isolate subjects and create transparent cutouts without uploading graphics to third-party cloud servers. Operating entirely in your browser using the HTML5 Canvas 2D API, the tool evaluates color differences between backdrop reference pixels and foreground elements using Euclidean RGB color distance calculations. You can adjust the sensitivity threshold, apply edge feathering to soften borders, sample specific background shades with an interactive eyedropper, and perform pixel-level touch-ups using manual erase and restore brushes. Because all processing executes locally in device memory, your product photography, personal portraits, and confidential documents remain private on your device.",
    howToUse: [
      "Select or drag your image file (PNG, JPG, or WebP) into the upload dropzone.",
      "The tool samples reference corner pixels automatically to detect the background color and generate an initial cutout.",
      "If the background is multi-toned or non-white, click 'Pick Color' and tap the background tone directly on your image.",
      "Adjust the 'Sensitivity' slider (5–95) to control how aggressively similar color shades are made transparent.",
      "Adjust the 'Feathering' slider (0–8px) to soften rough edges and blend boundaries naturally.",
      "Use the manual 'Erase' brush to wipe away remaining backdrop artifacts, or 'Restore' brush to recover masked subject details.",
      "Click 'Download PNG' to save your cutout as a high-resolution transparent PNG with full alpha channel preservation."
    ],
    features: [
      "Client-side HTML5 Canvas pixel manipulation with zero server file uploads.",
      "Automatic 4-corner backdrop color sampling with average RGB baseline calculation.",
      "Interactive eyedropper color picker to sample any background pixel on the canvas.",
      "Granular Sensitivity Threshold slider (5–95) for precise color tolerance control.",
      "Edge feathering slider (0–8px) providing anti-aliased gradient transitions.",
      "Dual manual editing brushes: Erase brush for leftover pixels and Restore brush for recovering subject details.",
      "Real-time transparency preview with high-contrast checkerboard canvas backdrop.",
      "High-resolution transparent PNG export with full 8-bit alpha channel preservation.",
      "Completely free with unlimited conversions, zero watermarks, and no registration required."
    ],
    formatsAndLimits: {
      supportedInputs: "PNG, JPG/JPEG, WebP, GIF, BMP",
      outputFormat: "Transparent PNG (.png) with 8-bit Alpha Channel",
      limitations: "Mathematical color-difference processing in browser memory. Best suited for high-contrast, solid, or studio backgrounds; complex scenes with matching subject colors require eyedropper and manual brush adjustment."
    },
    formatNoticeHtml: `
        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2.5 mt-3">
          <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-400"></i> How Background Removal Works &amp; Format Specifications
          </div>
          <p class="leading-relaxed">
            <strong>Color-Difference Algorithm (Not Machine Learning/AI):</strong> This tool operates using mathematical color distance rather than neural network object segmentation. It establishes a target RGB color (sampled from image corners or chosen with the eyedropper) and calculates the Euclidean color distance of every pixel. Pixels falling within the sensitivity threshold are rendered transparent. Because this is a color-matching utility, it cannot distinguish between background and subject if both share identical color values.
          </p>
          <p class="leading-relaxed">
            <strong>Contrast &amp; Backdrop Uniformity:</strong> Best results are achieved on images with solid, plain, or uniform studio backdrops (such as white e-commerce photography, green screen backdrops, or scanned black ink on white paper). Busy outdoor scenes, gradients, or subjects wearing clothing that matches the background color will require fine-tuning sensitivity, using the eyedropper, and refining with manual erase/restore brushes.
          </p>
          <p class="leading-relaxed">
            <strong>Transparent PNG (.png) Output:</strong> The downloaded cutout is exported as a transparent PNG using 8-bit alpha channel encoding. The JPEG format does not support transparency and always replaces transparent areas with a solid color. You can place your exported PNG onto any website, document, or colored backdrop.
          </p>
        </div>
    `,
    useCases: [
      "E-Commerce Product Listings: Isolate products photographed against solid or white studio backgrounds for product listings across marketplaces such as Amazon, eBay, Shopify, and Etsy. Always verify each platform's current image dimensions, padding, background, and other image specifications.",
      "Digital Signatures & Documents: Strip white paper backdrops from scanned ink signatures to overlay them cleanly onto contracts and PDF forms.",
      "Logos & Graphic Asset Isolation: Remove solid background boxes from company logos, icons, and badges for transparent overlay on websites and presentations.",
      "Presentations & Slide Decks: Extract diagrams, charts, and product photos from solid backgrounds for clean integration into PowerPoint and Google Slides."
    ],
    extraGuideHtml: `
      <!-- Deep Technical Guidance & Operational Mechanics Section -->
      <section class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div class="space-y-2">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-microchip text-blue-600"></i> How the Color-Difference Algorithm Works
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike server-side tools that transmit your images to remote GPU clusters running heavy deep learning models, ToolsHere executes entirely inside your browser using the HTML5 Canvas 2D API. The processing pipeline uses a deterministic mathematical color distance model:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">1</div>
            <h3 class="font-bold text-slate-900 dark:text-white">Corner Baseline Sampling</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              When an image is uploaded, the tool samples the RGB values at the four outer corners (top-left, top-right, bottom-left, bottom-right). It averages these samples to establish a target baseline background color <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">(t_R, t_G, t_B)</code>.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">2</div>
            <h3 class="font-bold text-slate-900 dark:text-white">Euclidean Distance Matching</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              For every pixel, the tool computes its 3D Euclidean distance from the target: <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">dist = &radic;((r-t_R)&sup2; + (g-t_G)&sup2; + (b-t_B)&sup2;)</code>. Pixels within the threshold cutoff (<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">tolerance &times; 2.5</code>) are flagged as background.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">3</div>
            <h3 class="font-bold text-slate-900 dark:text-white">Feathered Alpha Blending</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Rather than producing harsh pixelated cutouts, the feathering algorithm calculates a transitional boundary zone. Pixels along the edge receive fractional alpha values, creating smooth, anti-aliased contours that blend cleanly onto any background.
            </p>
          </div>
        </div>

        <!-- Understanding Controls & Adjustment Sliders -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-sliders text-blue-600"></i> Understanding the Controls &amp; Adjustment Sliders
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-gauge text-blue-500"></i> Sensitivity Threshold (Range: 5 to 95, Default: 38)
              </span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Controls the color distance tolerance. Lower values (5–25) restrict removal to colors virtually identical to the target, preventing accidental erasure of subject edges. Higher values (40–90) aggressively remove color variations, lighting gradients, and subtle shadows.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-wand-magic text-purple-500"></i> Feathering (Range: 0 to 8px, Default: 2)
              </span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Controls edge softness along the cutout perimeter. Setting feathering to 0 yields crisp binary edges (ideal for pixel art and sharp icons). Setting feathering to 2–5 creates a subtle anti-aliased gradient that eliminates jagged edges on portraits and products.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-eye-dropper text-amber-500"></i> Eyedropper / Color Picker
              </span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Allows you to override the 4-corner auto-sampling by tapping any pixel directly on the image canvas. Essential when isolating subjects on colored studio backdrops or when corner pixels contain shadows or subject elements.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-paintbrush text-emerald-500"></i> Manual Erase &amp; Restore Brushes (Radius: 8 to 60px, Default: 25px)
              </span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Provide tactile pixel-level editing. The Erase brush sets painted pixels to full transparency to remove lingering backdrop artifacts. The Restore brush paints back original pixels from memory to recover subject details without restarting.
              </p>
            </div>
          </div>
        </div>

        <!-- Suitable vs Challenging Images -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-images text-blue-600"></i> Which Images Work Best: Suitable vs. Challenging Scenarios
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <i class="fa-solid fa-circle-check"></i> High-Accuracy Candidates (Recommended)
              </h3>
              <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Studio product photography on seamless white, grey, or solid color backdrops.</li>
                <li>Digital and scanned ink signatures on plain white paper.</li>
                <li>Logos, vector icons, and badges placed on uniform background squares.</li>
                <li>Packaged retail goods, electronics, books, and boxed merchandise with well-defined borders.</li>
                <li>Portraits shot against dedicated chroma-key green or solid studio paper screens.</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i> Challenging Images (Requires Manual Touch-Up)
              </h3>
              <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Low-contrast images where the subject wears clothing matching the background tone.</li>
                <li>Complex, multi-colored outdoor backgrounds (e.g., foliage, city streets, crowded rooms).</li>
                <li>Semi-transparent objects such as glassware, sheer fabrics, smoke, or water splashes.</li>
                <li>Fine flyaway hair, fur, or plumage against variegated or textured backdrops.</li>
                <li>Subjects extending into the four image corners, which disrupts automatic baseline sampling.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Troubleshooting Common Issues -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-wrench text-blue-600"></i> Troubleshooting Common Cutout Issues
          </h2>
          <div class="space-y-2.5 text-xs sm:text-sm">
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">1. Parts of the subject disappeared or have transparent holes</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> The Sensitivity slider is set too high, or the subject contains colors closely matching the background. <strong>Solution:</strong> Lower the Sensitivity slider (try 15–25) and reprocess. Alternatively, select the &quot;Restore&quot; brush and paint over the transparent areas to recover the subject&#39;s original pixels.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">2. Background is not fully removed or leaves a halo around the subject</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Lighting gradients or shadows make edge pixels darker than the sampled background color. <strong>Solution:</strong> Increase the Sensitivity slider incrementally (try 40–55). If shadows remain, use the &quot;Erase&quot; brush with a medium radius (20–40px) to manually clear leftover background remnants.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">3. Edges look rough, pixelated, or stepped</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Feathering is set to 0, producing a binary cutoff. <strong>Solution:</strong> Increase the &quot;Feathering&quot; slider to 2–4 to introduce smooth semi-transparent transitions along the border contours.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">4. The tool removed the subject instead of the background</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> The subject extends into the four outer corners of the image, causing the auto-detector to sample subject pixels as the baseline. <strong>Solution:</strong> Click the &quot;Pick Color&quot; eyedropper button and click directly on the true background to re-target the algorithm accurately.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">5. Fine hair or fur against a busy scene looks artificial</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Mathematical RGB distance operates uniformly across the canvas without semantic boundary awareness. <strong>Solution:</strong> For complex portrait matting with flyaway hair against textured outdoor backgrounds, shoot against a solid backdrop or utilize manual erase/restore brushes at low brush radius (8–15px) to refine hair strands.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    faqs: [
      {
        q: "How does this background remover work without AI or machine learning models?",
        a: "ToolsHere uses direct client-side pixel manipulation via the HTML5 Canvas API. When you load an image, the tool samples the reference background color (from the four corners or via the eyedropper) and calculates the Euclidean color distance in RGB space for every pixel. Pixels whose color difference falls below the sensitivity threshold have their alpha (transparency) channel set to 0. This mathematical approach operates entirely in your browser without requiring external neural network downloads or server-side machine learning models."
      },
      {
        q: "Why does the tool work best on solid or high-contrast backgrounds?",
        a: "Because the algorithm relies on mathematical RGB color differences, it requires measurable contrast between foreground subject pixels and background pixels. When an image has a solid, uniform background (such as studio white, black, or chroma-key green), the color difference between subject and backdrop is distinct and easy to separate. If a subject wears clothing with identical color values to the background, the algorithm cannot distinguish the boundary automatically, requiring manual brush intervention."
      },
      {
        q: "How do the Sensitivity Threshold and Feathering sliders affect my cutout?",
        a: "The Sensitivity slider (ranging from 5 to 95) sets the maximum color distance tolerance: higher values remove a wider spectrum of shades resembling the target color, while lower values restrict removal to nearly identical colors. The Feathering slider (0 to 8px) creates a graduated transition zone along the cutout boundary, smoothing harsh pixel edges with semi-transparent anti-aliasing so the subject blends naturally into new backgrounds."
      },
      {
        q: "What should I do if my subject touches the corners of the image?",
        a: "By default, the automated background detector samples pixels at the four corners of your image (top-left, top-right, bottom-left, bottom-right) to establish the baseline background color. If your subject extends into any corner, its colors may contaminate the baseline. To fix this, click the 'Pick Color' eyedropper button and click directly on a clear section of the true background to re-calibrate the tool instantly."
      },
      {
        q: "How do the manual Erase and Restore brushes work?",
        a: "The tool retains both the original image pixel data and the active transparency mask in memory. When you select the 'Erase' brush, painting over any area sets the alpha channel to 0, wiping away stubborn background remnants or shadows. When you select the 'Restore' brush, painting brings back the original opaque pixels, allowing you to easily recover any parts of the subject that were inadvertently erased."
      },
      {
        q: "Why is the exported file saved as a PNG instead of JPEG?",
        a: "The JPEG image standard (JFIF) does not support an alpha transparency channel; saving a transparent cutout as JPEG forces transparent pixels to be filled with a solid color (typically white or black). PNG fully supports an 8-bit alpha channel with 256 levels of transparency, allowing clean overlay onto any webpage, graphic design, or colored document."
      },
      {
        q: "Are my uploaded photos or cutouts sent to any remote server?",
        a: "The selected image is processed in your browser and is not uploaded to our server for background removal. The image data remains in local browser memory during processing using the HTML5 Canvas 2D API, without transmission to remote cloud databases or external image processing services."
      }
    ],
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-image"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Convert PDF to JPG Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Extract visual assets, graphics, and diagrams from PDF pages ready for subject isolation and background removal.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress Files for Email Attachments
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ensure transparent PNG cutouts and high-resolution product graphics remain compact for fast sharing and email delivery.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
    relatedTools: [
      { name: "Image Compressor & Resizer", hash: "#image-compressor" },
      { name: "Image Format Converter", hash: "#image-converter" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" }
    ]
  },
  pdfWord: {
    seoTitle: "PDF to Word Converter: Convert Digital PDF to DOC Free - ToolsHere",
    metaDesc: "Extract text from selectable digital PDF documents into an editable Word-compatible (.doc) draft directly in your browser with no server file uploads.",
    aboutHeading: "About ToolsHere In-Browser PDF to Word Document Converter",
    intro: "ToolsHere PDF to Word Converter is a client-side document extraction utility designed for students, educators, researchers, and office workers who need to extract text from digital PDF documents into an editable draft without uploading files to remote servers. The conversion process executes locally in your browser memory using the client-side pdfjsLib library; the selected PDF file is not transmitted to our servers for conversion. The tool reads your document's text stream, preserves paragraph boundaries and page breaks, and generates an HTML-based Word-compatible document (.doc). This utility is intended for selectable digital text; scanned documents and photocopies require optical character recognition (OCR) software.",
    formatNoticeHtml: `
        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 mt-3">
          <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-400"></i> Supported PDF Types &amp; Document Output Format
          </div>
          <p class="leading-relaxed">
            <strong>Selectable Digital Text Only (No OCR):</strong> This tool extracts text embedded directly inside vector PDF files. If your document is a flat scanned photocopy, image-only receipt, or photograph from a physical scanner without a text layer, optical character recognition (OCR) is required to detect characters. Scanned PDFs without an embedded text layer cannot be converted by this tool.
          </p>
          <p class="leading-relaxed">
            <strong>HTML-Based Word (.doc) Output:</strong> The downloaded file is structured as an HTML-based document formatted with Microsoft Word XML namespaces (<code class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono text-xs">.doc</code>), not a modern zipped binary OpenXML (<code class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono text-xs">.docx</code>) archive. When opening in desktop word processors such as Microsoft Word or LibreOffice Writer, an informational format prompt may appear. Complex multi-column newspaper layouts, vector artwork, embedded raster images, and nested table borders are not preserved.
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
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-image"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Convert PDF to JPG Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Need images instead of Word text? Learn methods to extract and export PDF pages into high-resolution JPG pictures.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress PDF Files for Email
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Reduce document file size before emailing converted Word and PDF documents.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
    relatedTools: [
      { name: "Merge & Split PDF", hash: "#merge-pdf" },
      { name: "Compress PDF Document", hash: "#compress-pdf" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Word & Character Counter", hash: "#word-counter" }
    ],
    useCases: [
      "Extracting Text from Digital Business Reports: Convert digital PDF proposals, reports, and whitepapers into editable text drafts for editing or updating.",
      "Revising Resumes and CVs: Extract text from previously exported digital PDF resumes to update employment history, skills, and contact details.",
      "Academic Reference and Note-Taking: Extract study passages and bibliography text from digital lecture notes and research handouts for coursework."
    ],
    extraGuideHtml: `
      <!-- Deep Technical Guidance & Troubleshooting Section -->
      <section class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div class="space-y-2">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-file-circle-question text-blue-600"></i> Conversion Scope: Technical Structure &amp; Formatting Transfer
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            PDF documents and word processing files use distinct architectural models. A PDF specifies fixed visual coordinates for text glyphs on a visual page, whereas word processors use flow-based document models. Below is an overview of what the client-side parser transfers and where manual formatting adjustments may be necessary:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <i class="fa-solid fa-circle-check"></i> Supported Document Elements
            </h3>
            <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>Selectable body text, headings, and paragraph strings.</li>
              <li>Line groupings based on relative vertical positions.</li>
              <li>Multi-page document separation with standard page breaks.</li>
              <li>Clean default typography (Calibri, 11pt, 1.5 line height).</li>
              <li>Interactive preview and one-click clipboard text copying.</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <i class="fa-solid fa-circle-xmark"></i> Unsupported Formatting &amp; Elements
            </h3>
            <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>Scanned paper documents and photocopies (requires OCR).</li>
              <li>Multi-column layouts (text is extracted sequentially).</li>
              <li>Embedded images, figures, and vector illustrations.</li>
              <li>Complex nested data tables (extracted as text lines).</li>
              <li>Password-protected or encrypted PDF documents.</li>
            </ul>
          </div>
        </div>

        <!-- Troubleshooting Guidance -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-wrench text-blue-600"></i> Troubleshooting Common Issues
          </h2>
          <div class="space-y-2.5 text-xs sm:text-sm">
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">1. Error: &quot;No selectable text found in this PDF&quot;</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Explanation:</strong> The PDF consists of raster images (such as a scanned document or photograph) without an embedded text layer. To confirm this, open your PDF in any viewer and try selecting a word with your mouse cursor. If you cannot highlight text, the file requires optical character recognition (OCR) software before text can be extracted.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">2. Microsoft Word alert: &quot;The file format and extension don&#39;t match&quot;</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Explanation:</strong> The converter produces an HTML-based document structured for Microsoft Word compatibility with a <code class="font-mono text-xs">.doc</code> extension. Microsoft Word may display a format notice confirming this structure. Click <strong>&quot;Yes&quot;</strong> to open and edit the document. You can subsequently save the file as a native <code class="font-mono text-xs">.docx</code> via File &gt; Save As.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">3. Unexpected characters or missing symbols</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Explanation:</strong> Some PDF creation tools embed non-standard character codes (Type 3 font subsets) that do not correspond directly to standard Unicode codepoints during client-side extraction.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    faqs: [
      {
        q: "How does this PDF to Word converter process files without uploading them to a server?",
        a: "ToolsHere uses the Mozilla pdfjsLib library running inside your web browser. When you select a document, your browser reads the binary file into local device memory using FileReader, parses the text stream directly, and generates a downloadable Word-compatible .doc file. The selected PDF file is not uploaded to our servers for conversion."
      },
      {
        q: "What is the difference between this tool's .doc output and a native .docx file?",
        a: "The downloaded file contains Word-compatible HTML markup saved with a .doc extension rather than the zipped XML package used by modern .docx files. Desktop word processors like Microsoft Word and LibreOffice Writer can open this format, though Microsoft Word may display a standard prompt confirming the file format."
      },
      {
        q: "Can this converter extract text from scanned documents or photocopies?",
        a: "No. This tool requires a digital, selectable text layer inside the PDF. If a document was created by scanning physical paper or photographing a page without OCR software, it contains image pixels rather than character codes. Scanned documents require optical character recognition software before text can be extracted."
      },
      {
        q: "Which formatting features may not be preserved during conversion?",
        a: "Because this client-side utility extracts text rather than performing complete desktop publishing reconstruction, complex layouts such as multi-column magazine grids, floating text frames, vector artwork, and embedded images are not transferred. Data tables are extracted sequentially as formatted text lines."
      },
      {
        q: "Are there file size or browser memory limitations?",
        a: "Because processing runs entirely within your web browser's memory, performance depends on your device's available RAM and processor. Very large PDF files (such as documents over 50MB or containing hundreds of pages) may cause tab slowdowns or memory exhaustion in mobile or resource-constrained browsers."
      },
      {
        q: "Will the downloaded .doc file open in all word processors?",
        a: "The generated document is structured for Microsoft Word and LibreOffice Writer. While many other document viewers can open HTML-based .doc files, compatibility varies across different third-party and mobile office applications. Once opened in your word processor, you can re-save the document in your preferred native format, such as .docx."
      },
      {
        q: "Can I copy the extracted text directly without downloading a file?",
        a: "Yes. Once text extraction completes, a live preview box displays the extracted text in the workspace. You can click the 'Copy Text' button to place the extracted text onto your clipboard for pasting directly into an email, notepad, or text editor."
      }
    ]
  },
  pdfMerge: {
    seoTitle: "Merge PDF Files Online: Combine PDFs Free - ToolsHere",
    metaDesc: "Combine multiple PDF documents into a single organized file in seconds. Free, secure, client-side PDF merging with page order preview and no file limits.",
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-merge-pdf-files-online/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-object-group"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                Complete Guide to Merging PDF Files Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Discover tips for combining different documents, previewing page order, and keeping confidential records private.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress PDF Files for Email
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Merged files can become large. Learn how to downscale and optimize your consolidated PDFs for fast sharing.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
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
    seoTitle: "QR Code Generator & Scanner: Create & Read QR Codes - ToolsHere",
    metaDesc: "Generate custom high-resolution QR codes for websites, Wi-Fi, vCards, and WhatsApp, or scan QR codes from photos and camera live. 100% private in-browser tool.",
    relatedTools: [
      { name: "Strong Password Creator", hash: "#password-generator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "YouTube Thumbnail Grabber", hash: "#youtube-thumbnail" }
    ],
    useCases: [
      "Generating scannable Wi-Fi login codes, digital business cards (vCard), and WhatsApp chat triggers.",
      "Scanning QR codes from saved screenshots, photos, and digital flyers directly in the browser.",
      "Using the live device camera to decode physical product labels, brochures, and event tickets without downloading apps.",
      "Creating print-ready vector SVG and high-resolution PNG QR codes for marketing materials and packaging."
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
    seoTitle: "Word Counter: Live Word, Character & Text Analyzer - ToolsHere",
    metaDesc: "Count words, characters (with and without spaces), sentences, paragraphs, and reading time in real time. 100% private client-side text analyzer for essays and SEO.",
    relatedTools: [
      { name: "Text Case Converter", hash: "#text-case-converter" },
      { name: "SEO Meta Tag Generator", hash: "#seo-meta-generator" },
      { name: "JSON Formatter & Validator", hash: "#json-formatter" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ],
    useCases: [
      "Monitoring character counts with and without spaces to fit Twitter/X (280c), LinkedIn, and Instagram captions.",
      "Verifying academic essays, college admissions personal statements, and dissertation word and paragraph quotas.",
      "Optimizing SEO meta title (50–60 characters) and meta description (150–160 characters) lengths for Google snippet visibility.",
      "Timing speech drafts, video scripts, and presentation notes using estimated reading time (200 WPM)."
    ]
  },
  gstEmi: {
    seoTitle: "Loan EMI & GST Calculator (3%, 5%, 12%, 18%, 28%) - ToolsHere",
    metaDesc: "Calculate reducing-balance loan EMIs and statutory GST tax rates (3%, 5%, 12%, 18%, 28%) instantly. Free client-side financial calculator for loans and invoices.",
    aboutHeading: "About ToolsHere GST & Loan EMI Calculator",
    intro: "Managing financial projections and commercial tax estimations is straightforward with the ToolsHere GST & Loan EMI Calculator. Designed for prospective home buyers, vehicle loan applicants, personal loan borrowers, and commercial billing, this dual-mode utility delivers instant numerical calculations directly in your web browser. In the Loan EMI tab, enter your principal borrowed amount, annual reducing interest rate, and repayment tenure in years (which the calculator converts to monthly installments internally) to calculate your fixed monthly installment, total cumulative interest, and aggregate repayment amount. In the GST tab, enter your net billing amount and choose from five selectable tax rate buttons—3%, 5%, 12%, 18%, or 28%—to instantly determine the added tax and gross billable price. All financial calculations execute entirely client-side in your browser, ensuring your entered calculation values are never transmitted to a server.",
    howToUse: [
      "Select either the 'Loan EMI Calculator' or 'GST Calculator' tab at the top of the utility.",
      "For Loan EMI: Enter your loan Principal amount (₹), annual interest Rate (% p.a.), and Tenure in full YEARS (the tool converts years into monthly installments internally).",
      "For GST: Enter your Net billing Amount (₹) and select your desired tax rate button (3%, 5%, 12%, 18%, or 28%).",
      "Read your real-time results instantly: Monthly Loan EMI, Total Interest, and Total Payment in EMI mode; or Added GST and Total Gross Price in GST mode."
    ],
    features: [
      "Standard reducing-balance monthly compound amortization formula for banking loan estimations.",
      "Tenure input in full years, automatically converted to monthly installments for calculations.",
      "Five preconfigured selectable GST rate buttons: 3%, 5%, 12%, 18%, and 28%.",
      "Real-time calculations that update instantly as you type numbers or switch tax slabs.",
      "Client-side browser execution ensures entered calculation values are not uploaded to a server.",
      "Clear localized currency formatting (₹) displaying principal, interest components, and gross totals."
    ],
    formatsAndLimits: {
      supportedInputs: "Principal amount (₹), annual interest rate (% p.a.), tenure in YEARS, and net billing amount (₹)",
      outputFormat: "Monthly EMI, total interest, total repayment, added GST, and gross amount with Rupee (₹) formatting",
      limitations: "Requires an interest rate greater than 0% (entering 0% halts execution via early return and retains prior values); models fixed periodic amortization and forward exclusive GST across five selectable rates without bank processing fees, stamp duty, or insurance"
    },
    formatNoticeHtml: `
      <div class="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mt-2">
        <div class="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
          <i class="fa-solid fa-circle-info text-blue-600"></i> Tenure Input &amp; Interest Rate Guidelines
        </div>
        <p class="leading-relaxed">
          <strong>Tenure in Years:</strong> The EMI input field expects loan tenure in <strong>full years</strong> (e.g., enter <code>5</code> for a five-year loan or <code>20</code> for a twenty-year mortgage). The calculator internally converts years into months (<span class="font-mono">n = years &times; 12</span>). Do not enter tenure in months.
        </p>
        <p class="leading-relaxed">
          <strong>Interest Rate Requirement:</strong> The current EMI engine checks whether the interest rate is greater than 0% (<span class="font-mono">if (p &lt;= 0 || r &lt;= 0 || n &lt;= 0) return;</span>) and returns before running the formula. Consequently, entering 0% interest stops the calculator from updating and retains the previous displayed result rather than calculating a zero-interest installment plan.
        </p>
      </div>
    `,
    useCases: [
      "Computing monthly reducing-balance installments, total interest costs, and overall payback totals for home, vehicle, or personal loans.",
      "Evaluating how different loan tenures (5, 10, or 20 years) affect monthly cash flow versus long-term cumulative interest.",
      "Comparing the true cost of reducing-balance bank loans against flat-rate interest quotes.",
      "Calculating statutory GST addition (3%, 5%, 12%, 18%, 28%) for commercial sales invoices, service billing, and purchase orders."
    ],
    extraGuideHtml: `
      <!-- Comprehensive Educational Guide -->
      <section class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div class="space-y-3">
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <i class="fa-solid fa-calculator text-blue-600"></i> The Mathematics of Reducing-Balance EMI
          </h2>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Equated Monthly Installments (EMIs) are structured payments where a borrower pays a fixed sum to a lender each calendar month. In modern retail banking and consumer finance, loans are structured using the <strong>reducing-balance (or reducing-principal) amortization method</strong>. Under this method, interest is computed at each payment cycle solely on the remaining unpaid principal balance, rather than the initial borrowed amount.
          </p>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Our calculator implements the standard monthly compound amortization formula used across retail banks and financial institutions:
          </p>

          <!-- Formula Callout -->
          <div class="p-4 sm:p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto space-y-2">
            <div class="text-blue-400 font-bold text-xs uppercase tracking-wide">Standard Reducing-Balance Amortization Formula</div>
            <div class="text-center sm:text-left text-sm sm:text-base text-white font-bold py-1">
              EMI = [P &times; r &times; (1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> &minus; 1]
            </div>
            <div class="text-slate-400 text-xs space-y-1 pt-1 border-t border-slate-800">
              <div><strong>P</strong> = Principal loan amount (the initial amount borrowed)</div>
              <div><strong>r</strong> = Monthly fractional interest rate, derived as: <code>r = (Annual Rate in %) / (12 &times; 100)</code></div>
              <div><strong>n</strong> = Total number of monthly installments, derived as: <code>n = Tenure in Years &times; 12</code></div>
            </div>
          </div>

          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Total payment and cumulative interest over the full loan term are derived as:
          </p>
          <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-2">
            <li><strong>Total Repayment:</strong> <span class="font-mono">Total Payment = EMI &times; n</span></li>
            <li><strong>Total Interest Payable:</strong> <span class="font-mono">Total Interest = Total Payment &minus; P</span></li>
          </ul>
        </div>

        <!-- Worked Numerical Example -->
        <div class="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-list-check text-blue-600"></i> Step-by-Step Worked Calculation Example
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            To illustrate how the mathematical engine calculates monthly installments, consider a standard loan with the following verified inputs:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span class="text-slate-400 font-bold block uppercase text-[10px]">Loan Principal (P)</span>
              <span class="text-sm font-bold text-slate-900 dark:text-white">₹5,00,000</span>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span class="text-slate-400 font-bold block uppercase text-[10px]">Annual Interest Rate</span>
              <span class="text-sm font-bold text-slate-900 dark:text-white">8.5% p.a.</span>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span class="text-slate-400 font-bold block uppercase text-[10px]">Repayment Tenure</span>
              <span class="text-sm font-bold text-slate-900 dark:text-white">5 Years (60 Months)</span>
            </div>
          </div>

          <div class="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <div class="font-bold text-slate-900 dark:text-white">Mathematical Step-by-Step Evaluation:</div>
            <ol class="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
              <li><strong>Derive Monthly Rate:</strong> <code>r = 8.5 / (12 &times; 100) = 0.007083333333333333</code></li>
              <li><strong>Derive Number of Installments:</strong> <code>n = 5 &times; 12 = 60 installments</code></li>
              <li><strong>Compute Compounding Factor:</strong> <code>(1 + r)<sup>60</sup> &approx; (1.0070833333)<sup>60</sup> &approx; 1.5273005979</code></li>
              <li><strong>Calculate Monthly EMI:</strong> <code>EMI = [500000 &times; 0.0070833333 &times; 1.5273005979] / [1.5273005979 &minus; 1] &approx; 10,258.27</code></li>
              <li><strong>Apply Integer Rounding:</strong> <strong>Monthly EMI = ₹10,258</strong></li>
              <li><strong>Calculate Total Repayment:</strong> <code>Total Payment = 10,258.26566... &times; 60 = ₹6,15,495.94 &rarr; </code> <strong>₹6,15,496</strong></li>
              <li><strong>Calculate Total Interest:</strong> <code>Total Interest = 6,15,495.94 &minus; 5,00,000 = ₹1,15,495.94 &rarr; </code> <strong>₹1,15,496</strong></li>
            </ol>
          </div>
        </div>

        <!-- Tenure Comparison Analysis -->
        <div class="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-blue-600"></i> Loan Tenure Comparison: Monthly EMI vs. Total Interest
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The length of your loan tenure profoundly influences your financial commitment. Extending repayment tenure spreads the principal across more installments, lowering your fixed monthly cash outflow. However, because principal is repaid more slowly, interest accumulates over a much longer horizon, substantially increasing the total interest paid over the life of the loan.
          </p>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The table below demonstrates this dynamic for a <strong>₹5,00,000 principal loan</strong> at an <strong>8.5% annual reducing-balance interest rate</strong> across three common repayment periods:
          </p>

          <!-- Comparison Table -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3">Tenure</th>
                  <th class="p-3">Total Installments</th>
                  <th class="p-3">Monthly EMI</th>
                  <th class="p-3">Total Interest</th>
                  <th class="p-3">Total Payment</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="p-3 font-bold text-slate-900 dark:text-white">5 years</td>
                  <td class="p-3">60 months</td>
                  <td class="p-3 font-semibold text-blue-600 dark:text-blue-400">₹10,258</td>
                  <td class="p-3">₹1,15,496</td>
                  <td class="p-3">₹6,15,496</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="p-3 font-bold text-slate-900 dark:text-white">10 years</td>
                  <td class="p-3">120 months</td>
                  <td class="p-3 font-semibold text-blue-600 dark:text-blue-400">₹6,199</td>
                  <td class="p-3 text-amber-600 dark:text-amber-400 font-medium">₹2,43,914</td>
                  <td class="p-3">₹7,43,914</td>
                </tr>
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td class="p-3 font-bold text-slate-900 dark:text-white">20 years</td>
                  <td class="p-3">240 months</td>
                  <td class="p-3 font-semibold text-blue-600 dark:text-blue-400">₹4,339</td>
                  <td class="p-3 text-rose-600 dark:text-rose-400 font-bold">₹5,41,388</td>
                  <td class="p-3">₹10,41,388</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            <strong>Key Insight:</strong> Extending the tenure from 5 to 20 years reduces the monthly payment from ₹10,258 to ₹4,339 (freeing up monthly cash flow), but increases total interest paid from ₹1,15,496 to ₹5,41,388—more than 4.6 times the original interest cost, exceeding the entire original principal borrowed.
          </p>
        </div>

        <!-- Flat Rate vs Reducing Balance -->
        <div class="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-scale-unbalanced text-blue-600"></i> Flat-Rate vs. Reducing-Balance Interest: What Borrowers Must Know
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            When shopping for loans, borrowers frequently encounter two distinct methods of quoting interest rates: <strong>reducing-balance interest</strong> and <strong>flat interest</strong>. Understanding the mathematical divergence between these two methods is vital for evaluating credit offers accurately.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-600"></i> Reducing-Balance Method (Standard Banking)
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Interest is calculated only on the remaining balance of the principal after each monthly repayment. As you pay down principal each month, the interest charge diminishes progressively. This is the model computed by our tool and required for regulated consumer lending.
              </p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Flat-Rate Method (Fixed Principal)
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Interest is calculated continuously on the full original principal for the entire loan duration, completely ignoring that you are repaying the principal every month. This significantly elevates the effective annual percentage rate (APR).
              </p>
            </div>
          </div>

          <div class="p-4 sm:p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div class="font-bold text-amber-900 dark:text-amber-300">Mathematical Comparison: ₹5,00,000 Loan at 8.5% for 5 Years</div>
            <div class="space-y-1 pl-1">
              <div>&bull; <strong>Under 8.5% Flat Rate Interest:</strong></div>
              <div class="pl-4 text-slate-600 dark:text-slate-400">
                Flat Interest = ₹5,00,000 &times; 8.5% &times; 5 = <strong>₹2,12,500</strong><br>
                Total Repayment = ₹5,00,000 + ₹2,12,500 = <strong>₹7,12,500</strong><br>
                Monthly Installment = ₹7,12,500 / 60 = <strong>₹11,875</strong>
              </div>
              <div class="pt-1">&bull; <strong>Under 8.5% Reducing-Balance Interest (Our Calculator):</strong></div>
              <div class="pl-4 text-slate-600 dark:text-slate-400">
                Total Interest = <strong>₹1,15,496</strong><br>
                Total Repayment = <strong>₹6,15,496</strong><br>
                Monthly Installment = <strong>₹10,258</strong>
              </div>
            </div>
            <p class="text-xs text-amber-900 dark:text-amber-400/90 pt-1 font-medium leading-relaxed">
              <strong>Outcome:</strong> In this illustrative scenario, the flat-rate structure requires paying ₹97,004 more in total interest (₹2,12,500 vs. ₹1,15,496) and ₹1,617 more each month (₹11,875 vs. ₹10,258), even though both quote a nominal rate of &ldquo;8.5%&rdquo;.
            </p>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            <em>Important Qualification:</em> This numerical comparison is an illustrative mathematical demonstration showing how interest calculation methodologies diverge. It is not an assertion about every lender's pricing structure, contract terminology, or loan agreement terms.
          </p>
        </div>

        <!-- GST Slabs & Computation -->
        <div class="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-receipt text-blue-600"></i> Understanding the Five Selectable GST Rates
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The Goods and Services Tax (GST) is a destination-based consumption tax. In our tool's GST tab, calculations follow the <strong>forward (exclusive) tax computation model</strong>, where tax is computed as a percentage of your entered net base amount and added to yield the total gross billable price:
          </p>
          <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1">
            <div>GST Added = (Net Base Amount &times; GST Rate) / 100</div>
            <div>Total Gross Price = Net Base Amount + GST Added</div>
          </div>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The calculator provides five selectable rate buttons: <strong>3%</strong>, <strong>5%</strong>, <strong>12%</strong>, <strong>18%</strong> (default), and <strong>28%</strong>. These buttons represent commonly used statutory rate tiers under official tax schedules, allowing users to quickly estimate tax additions for various commercial invoices and bills. Note that these five buttons represent selectable calculation presets and do not constitute an exhaustive list of every statutory rate or classification under tax regulations (which may include specialized rates, conditional exemptions, or statutory cess). Users should select the rate that corresponds to their specific invoice or statutory billing requirement:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-blue-600 dark:text-blue-400 block text-sm">3% Rate Button</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Selectable lower statutory percentage rate tier for commercial calculations requiring a 3% tax addition.
              </p>
            </div>
            <div class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-blue-600 dark:text-blue-400 block text-sm">5% Rate Button</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Selectable concessional statutory percentage rate tier for billing calculations requiring a 5% tax addition.
              </p>
            </div>
            <div class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-blue-600 dark:text-blue-400 block text-sm">12% Rate Button</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Selectable standard statutory percentage rate tier for billing calculations requiring a 12% tax addition.
              </p>
            </div>
            <div class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-blue-600 dark:text-blue-400 block text-sm">18% Rate Button (Default)</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                The default standard statutory percentage rate tier, widely used across commercial services and standard billing requiring an 18% tax addition.
              </p>
            </div>
            <div class="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 sm:col-span-2 lg:col-span-1">
              <span class="font-bold text-blue-600 dark:text-blue-400 block text-sm">28% Rate Button</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                Selectable upper statutory percentage rate tier for billing calculations requiring a 28% tax addition.
              </p>
            </div>
          </div>
        </div>

        <!-- Scoped Privacy Notice -->
        <div class="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i> Client-Side Processing &amp; Data Privacy
          </h3>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The financial calculations provided by this calculator execute entirely within your web browser using client-side JavaScript. The loan amounts, interest rates, repayment tenures, and billing figures you enter are processed locally in your device memory and are not uploaded to our servers for calculation. We do not store, log, or track your personal financial figures or loan planning data.
          </p>
        </div>

        <!-- Financial Advisory & Accuracy Disclaimer -->
        <div class="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div class="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> Financial Advisory &amp; Accuracy Disclaimer
          </div>
          <p class="leading-relaxed">
            The calculations, amortization formulas, and tax estimates generated by this utility are mathematical approximations intended strictly for personal budgeting, educational reference, and illustrative planning. They do not constitute personalized financial advice, credit appraisal, loan sanction commitments, or tax consulting.
          </p>
          <p class="leading-relaxed">
            Actual repayment amounts, interest charges, and amortization schedules issued by commercial banks and housing finance corporations may differ slightly from these calculations due to lender-specific daily interest compounding conventions, leap-year day-count fractions, odd-period interest on initial disbursements, loan processing fees, documentation charges, pre-EMI interest, mandatory credit insurance premiums, and statutory taxes on banking services. Always consult your financial institution or a certified tax professional before finalizing binding credit or purchasing decisions.
          </p>
        </div>
      </section>
    `,
    faqs: [
      {
        q: "What exact mathematical formula is used to calculate the monthly loan EMI?",
        a: "The calculator uses the standard monthly compound reducing-balance formula: EMI = [P x r x (1 + r)^n] / [(1 + r)^n - 1]. In this formula, P represents the principal loan amount, r is the monthly fractional interest rate (derived by dividing the annual percentage rate by 12 and then by 100: r = annualRate / 1200), and n represents the total number of monthly installments (derived by multiplying the loan tenure in years by 12: n = years x 12). Total repayment is calculated as EMI x n, and total interest payable is calculated as Total Repayment minus Principal."
      },
      {
        q: "Does the calculator expect loan tenure in years or months?",
        a: "The calculator input field strictly expects loan tenure in full YEARS (for example, enter 5 for a five-year loan or 20 for a twenty-year home mortgage). The calculation script automatically converts the entered number of years into monthly payment cycles internally by multiplying by 12 (n = tenure x 12). Entering tenure in months (such as entering 60 instead of 5) will cause the calculator to compute repayment for 60 years (720 months), producing an incorrect calculation."
      },
      {
        q: "How does reducing-balance interest differ from flat-rate interest?",
        a: "Under the reducing-balance method (used by our calculator and standard bank loans), interest is charged only on the remaining unpaid loan balance at each monthly interval. As you repay principal, the interest portion of each monthly payment progressively decreases. In contrast, under flat-rate interest, interest is calculated continuously on the full original principal for the entire loan tenure, ignoring regular principal repayments. For example, a 5-year loan of ₹5,00,000 at 8.5% costs ₹1,15,496 in total interest under reducing-balance, compared to ₹2,12,500 under a flat rate—costing ₹97,004 more in interest. This is a mathematical comparison, not a claim about every lender's pricing or loan agreement."
      },
      {
        q: "Why does an interest rate of 0% not produce a calculation?",
        a: "The JavaScript calculation engine includes an explicit guard check (if (p <= 0 || r <= 0 || n <= 0) return;) that halts execution and returns before computing the amortization formula. Because the script returns immediately when the interest rate is zero or negative, the calculator stops updating and retains whatever previous results were already displayed on the screen. The tool currently models only positive-interest loans and does not calculate zero-interest repayment schedules."
      },
      {
        q: "Which GST tax slabs are supported, and how is tax computed?",
        a: "The calculator provides five selectable rate buttons: 3%, 5%, 12%, 18% (default), and 28%. These buttons represent commonly encountered rate tiers under statutory tax schedules, though they do not include every specialized rate or statutory cess. Tax is computed using the forward exclusive method: GST Added = (Net Amount x Rate) / 100, and Total Gross Price = Net Amount + GST Added. Users can select any of the five rate buttons according to the applicable tax rate for their specific billing needs."
      },
      {
        q: "What additional bank costs and fees are excluded from this EMI calculation?",
        a: "The calculated EMI models only the core repayment of principal and interest. It does not include ancillary lending fees and statutory costs commonly charged by banks and financial institutions. Excluded costs include one-time loan processing and administrative fees, legal and title verification charges, property valuation fees, stamp duty and mortgage registration charges, pre-EMI interest during partial construction disbursements, mandatory loan protection or property insurance premiums, prepayment or foreclosure penalties, and applicable GST levied on banking services."
      },
      {
        q: "Are my financial figures, loan amounts, or calculations stored on any server?",
        a: "No. The calculator's financial calculations run entirely within your web browser using client-side JavaScript. The loan amounts, interest rates, repayment tenures, and invoice amounts you enter are processed locally in your device memory and are not uploaded to our servers for calculation. We do not store, log, or track your personal financial planning figures."
      }
    ],
    relatedTools: [
      { name: "Age & Date Calculator", hash: "#age-calculator" },
      { name: "Word & Character Counter", hash: "#word-counter" },
      { name: "QR Code Studio & Reader", hash: "#qr-code-generator" },
      { name: "Strong Password Creator", hash: "#password-generator" }
    ]
  },
  imgFormat: {
    seoTitle: "Image Format Converter: Convert PNG, JPG, WebP - ToolsHere",
    metaDesc: "Convert photos between JPG, PNG, and WebP formats instantly in your browser. Fast, free batch image conversion preserving original resolution and privacy.",
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-image"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Convert PDF to JPG Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Learn best practices for high-resolution format conversion and image quality preservation.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress Files for Email Attachments
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Downscale and optimize large graphics and documents to meet email provider attachment quotas.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
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
    name: "Compress PDF Document",
    seoTitle: "Compress PDF Online: Reduce Document File Size Free - ToolsHere",
    metaDesc: "Compress PDF files directly in your web browser. Choose between lossless Balanced structural optimization or Extreme raster compression with zero server uploads.",
    h1: "Free Online PDF Compressor & Document Size Reducer",
    aboutHeading: "About ToolsHere In-Browser PDF Compression Utility",
    intro: "ToolsHere Compress PDF is a client-side document optimization utility designed for students, job applicants, office workers, and researchers who need to reduce PDF file sizes without transmitting sensitive documents to remote servers. Operating entirely in your browser using WebAssembly and JavaScript libraries (PDF-Lib and PDF.js), the tool offers two distinct compression approaches: a lossless Balanced mode that reorganizes document object streams without degrading text sharpness, and an Extreme mode that rasterizes pages into compressed JPEG images. All file processing takes place in your local device memory, ensuring your confidential resumes, contracts, and financial statements remain private on your computer or phone.",
    howToUse: [
      "Click or drag your PDF document into the upload dropzone.",
      "Review the displayed original file size in kilobytes (KB) or megabytes (MB).",
      "Choose your compression profile: Balanced mode for lossless structural optimization, or Extreme mode for lossy raster re-encoding.",
      "Click 'Compress & Download PDF' to execute the compression pipeline in your browser.",
      "Compare the original file size against the final output size on screen.",
      "Download and inspect the resulting PDF to verify visual quality and confirm file size reduction."
    ],
    features: [
      "Client-side document processing with zero server file uploads.",
      "Two distinct optimization profiles: Lossless Balanced structural optimization and Lossy Extreme raster compression.",
      "Lossless PDF 1.5 object-stream compression (useObjectStreams: true) in Balanced mode.",
      "Complete text searchability and vector fidelity preservation in Balanced mode.",
      "Visual page rasterization with adjustable JPEG quality (0.55) at 72 DPI in Extreme mode.",
      "Automatic multi-tier password-protected and encrypted PDF detection.",
      "Live file size display comparing original vs. optimized document byte size.",
      "Cross-platform drag-and-drop and tap-to-select file picker supporting desktop and mobile browsers.",
      "100% free with unlimited conversions, zero document watermarks, and no user registration required."
    ],
    formatsAndLimits: {
      supportedInputs: "Standard PDF documents (.pdf, application/pdf)",
      outputFormat: "Optimized PDF file (.pdf)",
      limitations: "Client-side browser memory processing. Password-locked or encrypted PDFs must be unlocked prior to compression. Very large files (50MB+ or 100+ pages) may be constrained by device RAM."
    },
    formatNoticeHtml: `
        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2.5 mt-3">
          <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 dark:text-amber-400"></i> Compression Profiles: Balanced vs. Extreme Mode Notice
          </div>
          <p class="leading-relaxed">
            <strong>Use Balanced Mode First (Recommended):</strong> Balanced mode uses lossless structural optimization. It cleans orphaned objects, removes incremental revision history, and repacks PDF data into compressed object streams. It preserves sharp vector typography, selectable text (<kbd class="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono text-[11px]">Ctrl+F</kbd>), and original raster images. If your document requires searchability or high-resolution readability, always try Balanced mode first.
          </p>
          <p class="leading-relaxed">
            <strong>Extreme Mode (Lossy Raster Conversion):</strong> Extreme mode renders each PDF page into an HTML5 Canvas at 72 DPI and re-encodes it as a JPEG image at 55% quality. This flattens the page into a bitmap, meaning text is no longer selectable or searchable. Fine 8pt/9pt typography, footnotes, or intricate CAD blueprints may show visible compression artifacts.
          </p>
          <p class="leading-relaxed">
            <strong>Important File Size Behavior:</strong> Compression is not guaranteed to reduce every file. Documents that contain primarily digital text and vector artwork (such as clean exports from Microsoft Word or LaTeX) may <em>increase in size</em> under Extreme mode because rasterizing pages into full-bleed JPEGs produces more byte data than vector character codes. Always keep a backup of your original PDF before applying Extreme compression.
          </p>
        </div>
    `,
    useCases: [
      "Job & Government Portal Submissions: Compress scanned certificates, ID cards, and application forms to meet strict portal upload ceilings (always verify the receiving portal's current file size limits).",
      "Email Document Attachments: Reduce oversized reports and presentation decks to fit within email provider attachment restrictions (check your specific email service guidelines).",
      "Academic Coursework & Thesis Filings: Optimize research papers and lecture slide handouts for submission to university portals while preserving legible text and citations.",
      "Digital Archiving & Local Storage: Reorganize internal PDF object streams to eliminate redundant revision data and save disk space across personal and business document archives."
    ],
    extraGuideHtml: `
      <!-- Deep Technical Guidance & Architecture Section -->
      <section class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div class="space-y-2">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-layer-group text-blue-600"></i> The Two Compression Engines Explained
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike cloud-based PDF compression platforms that upload documents to remote servers, ToolsHere operates entirely inside your web browser using client-side JavaScript libraries. The utility provides two fundamentally different compression mechanisms designed for distinct document types:
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs">1</div>
              <span>Balanced Mode (PDF-Lib Structural Optimization)</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Balanced mode reconstructs the document using the <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">pdf-lib</code> engine. It creates a brand-new PDF container, copies all page objects sequentially, and serializes the document using PDF 1.5 object stream compression (<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">useObjectStreams: true</code>).
            </p>
            <ul class="text-slate-600 dark:text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><strong>Zero raster downsampling:</strong> Text and vector drawings remain crisp at any zoom level.</li>
              <li><strong>Preserves searchability:</strong> All text stays selectable and searchable via <kbd class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Ctrl+F</kbd>.</li>
              <li><strong>Structural cleanup:</strong> Eliminates unreferenced metadata, dead objects, and past edit revisions.</li>
              <li><strong>Expected reduction:</strong> Typically 5% to 30% on unoptimized files; minimal on pre-compressed PDFs.</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <div class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">2</div>
              <span>Extreme Mode (PDF.js Canvas Rasterization)</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Extreme mode leverages the <code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">pdfjsLib</code> engine to render each page onto an HTML5 Canvas at standard 72 DPI (<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[11px]">scale: 1.0</code>). The canvas bitmap is re-encoded as a JPEG image at 55% quality and embedded into a newly created PDF page.
            </p>
            <ul class="text-slate-600 dark:text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><strong>Heavy lossy compression:</strong> Drastically reduces oversized 300 DPI scanned paper documents.</li>
              <li><strong>Text flattening:</strong> Text is converted into image pixels and can no longer be highlighted or searched.</li>
              <li><strong>Compression artifacts:</strong> Fine typography, barcodes, and hairline diagrams may appear soft or blurry.</li>
              <li><strong>Expected reduction:</strong> 50% to 80% on scanned image documents; may enlarge digital text PDFs.</li>
            </ul>
          </div>
        </div>

        <!-- Balanced vs Extreme Comparison Table -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-table-cells text-blue-600"></i> Technical Comparison: Balanced vs. Extreme Mode
          </h2>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3 sm:p-3.5 font-bold">Feature / Attribute</th>
                  <th class="p-3 sm:p-3.5 font-bold text-rose-600 dark:text-rose-400">Balanced Mode (Recommended)</th>
                  <th class="p-3 sm:p-3.5 font-bold text-amber-600 dark:text-amber-400">Extreme Mode (Raster)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                <tr class="bg-white dark:bg-slate-850">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Underlying Engine</td>
                  <td class="p-3">PDF-Lib Object Stream Serializer</td>
                  <td class="p-3">PDF.js Canvas 2D + PDF-Lib JPEG Embedder</td>
                </tr>
                <tr class="bg-slate-50/50 dark:bg-slate-800/40">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Compression Nature</td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">100% Lossless</span></td>
                  <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold text-xs">Lossy Raster Re-encoding</span></td>
                </tr>
                <tr class="bg-white dark:bg-slate-850">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Text Searchability (Ctrl+F)</td>
                  <td class="p-3 font-medium text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-check mr-1"></i> Fully Preserved &amp; Selectable</td>
                  <td class="p-3 font-medium text-rose-500"><i class="fa-solid fa-xmark mr-1"></i> Lost (Flattened into JPEG Pixels)</td>
                </tr>
                <tr class="bg-slate-50/50 dark:bg-slate-800/40">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Vector Artwork &amp; Fonts</td>
                  <td class="p-3 font-medium text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-check mr-1"></i> Preserved as Scalable Vectors</td>
                  <td class="p-3 font-medium text-rose-500"><i class="fa-solid fa-xmark mr-1"></i> Converted to 72 DPI Bitmap Pixels</td>
                </tr>
                <tr class="bg-white dark:bg-slate-850">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Visual Quality Impact</td>
                  <td class="p-3">Zero visual loss; original clarity retained</td>
                  <td class="p-3">72 DPI resolution; 55% JPEG compression</td>
                </tr>
                <tr class="bg-slate-50/50 dark:bg-slate-800/40">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Typical File Size Effect</td>
                  <td class="p-3">5% to 30% reduction on unoptimized PDFs</td>
                  <td class="p-3">50% to 80% on scans; may enlarge text PDFs</td>
                </tr>
                <tr class="bg-white dark:bg-slate-850">
                  <td class="p-3 font-semibold text-slate-900 dark:text-white">Best Document Types</td>
                  <td class="p-3">Resumes, contracts, academic papers, books</td>
                  <td class="p-3">300 DPI scanned paper photocopies, print fliers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Which Documents Compress Best vs Worst -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-file-circle-check text-blue-600"></i> Which Documents Compress Best vs. Worst
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <i class="fa-solid fa-circle-check"></i> High-Compression Candidates
              </h3>
              <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>High-resolution scanned documents (e.g., 300–600 DPI photocopies) in Extreme mode.</li>
                <li>PDFs generated by legacy software with uncompressed cross-reference streams.</li>
                <li>Documents with accumulated incremental revision histories and orphaned objects.</li>
                <li>Multi-page image-heavy presentations, catalogs, and marketing brochures.</li>
              </ul>
            </div>

            <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 class="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i> Low-Compression or Challenging Documents
              </h3>
              <ul class="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Pure digital text documents (LaTeX, Word exports); Extreme mode may increase size.</li>
                <li>PDFs already linearized or optimized with modern Adobe Acrobat or Ghostscript pipelines.</li>
                <li>Documents already dominated by pre-compressed JPEG photo streams.</li>
                <li>Password-protected or encrypted PDF documents (rejected for security reasons).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Troubleshooting Common Issues -->
        <div class="space-y-3">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-wrench text-blue-600"></i> Troubleshooting Common PDF Compression Issues
          </h2>
          <div class="space-y-2.5 text-xs sm:text-sm">
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">1. Error: &quot;This PDF is password-protected. Please unlock it before compressing.&quot;</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> The PDF contains an encrypted stream or permissions lock (<code class="font-mono text-xs">/Encrypt</code> dictionary). <strong>Solution:</strong> Open the document in your desktop PDF viewer or browser, enter your password, and save or export an unencrypted copy prior to compressing.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">2. The compressed PDF became larger instead of smaller in Extreme mode</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> The original document consisted of lightweight digital vector text and fonts (e.g., 40 KB for 5 pages). Extreme mode rendered each page into a full-page raster JPEG image, creating more total data than the original vector instructions. <strong>Solution:</strong> Use Balanced mode for digital text documents.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">3. Balanced mode showed minimal (0% to 2%) or no file size reduction</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> The PDF was already streamlined by its authoring application, or its file weight is dominated by already-compressed image payloads. <strong>Solution:</strong> If you must achieve a smaller file size regardless of text searchability, switch to Extreme mode.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">4. Text appears soft, blurry, or pixelated upon zooming in</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Extreme mode converted text glyphs into 72 DPI JPEG pixels at 55% quality. <strong>Solution:</strong> Re-run the compression using Balanced mode to preserve native vector font definitions.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">5. Browser tab slowed down or crashed on a very large PDF</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Because compression executes locally inside browser RAM, files with hundreds of pages or heavy embedded graphics can exceed available tab memory limits on mobile or low-RAM devices. <strong>Solution:</strong> Close other browser tabs, or process multi-page documents on a desktop browser.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span class="font-bold text-slate-900 dark:text-white">6. Mobile file picker fails to open or select the PDF</span>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Cause:</strong> Some mobile browsers and file manager apps restrict direct MIME access. <strong>Solution:</strong> Tap the &quot;Select PDF File&quot; button directly, or browse through your device's &quot;Files&quot; / &quot;Downloads&quot; directory instead of recent cloud shortcuts.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
    faqs: [
      {
        q: "What is the difference between Balanced and Extreme compression?",
        a: "Balanced mode uses PDF-Lib to reorganize internal document structures and save pages with PDF 1.5 object streams, preserving vector text and searchability without rasterization. Extreme mode uses PDF.js to render every page onto an HTML5 canvas at 72 DPI and re-encode it as a JPEG image at 0.55 quality, flattening text into bitmap graphics for maximum compression of scanned documents."
      },
      {
        q: "Why did my compressed PDF become larger instead of smaller?",
        a: "If you choose Extreme mode on a document containing primarily digital text and vector graphics, the tool converts compact vector font instructions into full-page raster JPEG images. A 5-page vector PDF that occupies only 50KB can expand to over 500KB when converted into five 72 DPI JPEG bitmaps. For text-heavy documents, Balanced mode should always be used."
      },
      {
        q: "Does compressing a PDF keep the text selectable and searchable?",
        a: "In Balanced mode, the text layer, font definitions, and character glyph coordinates remain completely intact, meaning you can highlight text, copy passages to your clipboard, and search with Ctrl+F. In Extreme mode, pages are rendered into flat JPEG images, permanently removing the selectable text layer."
      },
      {
        q: "Why did Balanced mode reduce my PDF file size by very little or not at all?",
        a: "Balanced mode achieves savings by stripping unreferenced metadata, removing incremental save revisions, and packing objects into compressed streams. If a PDF has already been optimized by modern publishing software or consists almost entirely of pre-compressed JPEG photos, structural optimization cannot squeeze the file further without lossy image downsampling."
      },
      {
        q: "Why does the tool reject password-protected or encrypted PDFs?",
        a: "ToolsHere operates entirely client-side in your web browser. When an encrypted PDF is loaded, cryptographic protection prevents the PDF-Lib parser from reading object streams or reconstructing pages without the correct decryption key. To compress a protected file, you must first remove the password restriction in your PDF viewer."
      },
      {
        q: "Is my original PDF file changed or overwritten during compression?",
        a: "No. Web browsers operate within a secure sandboxed filesystem. When you select a document, the browser reads an in-memory copy of the file via the FileReader API. Your original file on your hard drive or mobile storage is never modified or overwritten; the compressed version is saved as a new file prefixed with compressed-."
      },
      {
        q: "How does browser-based processing work, and are my files uploaded to a server?",
        a: "The compression pipeline executes entirely in your browser using client-side JavaScript and WebAssembly libraries. The selected PDF file is read directly into your device's local memory and is not uploaded to our servers, stored in cloud databases, or analyzed remotely, ensuring your documents remain on your device during processing."
      }
    ],
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-compress-pdf-for-email/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-zipper"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Compress PDF Files for Email Attachments
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Step-by-step tutorial on reducing PDF file sizes to fit Gmail, Outlook, and portal attachment restrictions.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-merge-pdf-files-online/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-object-group"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Merge Multiple PDF Files Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Combine receipts, invoices, and reports into a single organized document before compressing.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
    relatedTools: [
      { name: "PDF to Word Converter", hash: "#pdf-to-word" },
      { name: "Merge & Split PDF", hash: "#merge-pdf" },
      { name: "Image to PDF Converter", hash: "#image-to-pdf" },
      { name: "Image Compressor & Resizer", hash: "#image-compressor" }
    ]
  },
  imgToPdf: {
    seoTitle: "Image to PDF Converter: Convert JPG & PNG to PDF - ToolsHere",
    metaDesc: "Convert and bundle multiple JPG, PNG, and WebP images into a single printable PDF document. Set page size, orientation, and margins with zero server uploads.",
    helpfulGuidesHtml: `
      <!-- Helpful Guides & Tutorials Section -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <i class="fa-solid fa-book-open text-blue-600"></i> Helpful Guides &amp; Tutorials
          </h2>
          <a href="/blog/" class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All Guides <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="/blog/how-to-convert-pdf-to-jpg/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-file-image"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Convert PDF to JPG Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Explore the companion workflow: extracting images from PDF documents compared to bundling images into PDF.
              </p>
            </div>
          </a>
          <a href="/blog/how-to-merge-pdf-files-online/" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-sm mt-0.5">
              <i class="fa-solid fa-object-group"></i>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                How to Merge Multiple PDF Files Online
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Combine your newly generated image PDFs with existing document pages into a consolidated file.
              </p>
            </div>
          </a>
        </div>
      </section>
    `,
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
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i class="fa-solid fa-shapes text-blue-600"></i> Related Tools
          </h2>
          <a href="/" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View All Tools <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${tool.relatedTools.map(rt => {
            const slug = rt.hash.replace('#', '');
            const targetTool = tools.find(t => t.hash === rt.hash || (routes && Object.values(routes).some(r => r.hash === slug && r.toolId === t.id)));
            const icon = targetTool && toolIconsMap[targetTool.id] ? toolIconsMap[targetTool.id] : 'fa-solid fa-screwdriver-wrench';
            const shortDesc = rt.desc || (targetTool && targetTool.metaDesc ? targetTool.metaDesc.split('.')[0] + '.' : 'Fast in-browser utility.');
            return `<a href="/${slug}/" class="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xs transition-all group flex flex-col justify-between">
              <div>
                <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-sm mb-2.5">
                  <i class="${icon}"></i>
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors block leading-snug">
                  ${rt.name}
                </span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  ${shortDesc}
                </p>
              </div>
              <div class="pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <span>Use Tool</span>
                <i class="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-0.5 transition-transform"></i>
              </div>
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

      ${tool.helpfulGuidesHtml || `
      <!-- Knowledge Base & Blog Guide Banner -->
      <section class="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div class="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-800/80 dark:to-slate-800 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 text-sm">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">ToolsHere Knowledge Base &amp; Guides</h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Discover step-by-step tutorials, document tips, and digital productivity workflows.</p>
            </div>
          </div>
          <a href="/blog/" class="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-300 font-bold text-xs hover:border-blue-400 shadow-2xs transition-all shrink-0 flex items-center justify-center gap-1.5">
            Visit Blog <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </section>
      `}

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
          <a href="/about/" class="hover:text-blue-600 transition-colors">About</a>
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
          <a href="/about/" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">About ToolsHere</a>
          <a href="/contact/" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Contact Support</a>
          <a href="/privacy/" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Privacy Policy</a>
          <a href="/terms/" class="block px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 text-xs font-semibold min-h-[44px] flex items-center">Terms of Service</a>
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
            <li><a href="/image-compressor/" class="hover:text-blue-600 transition-colors">Image Compressor &amp; Resizer</a></li>
            <li><a href="/background-remover/" class="hover:text-blue-600 transition-colors">AI Background Remover</a></li>
            <li><a href="/pdf-to-word/" class="hover:text-blue-600 transition-colors">PDF to Word Converter</a></li>
            <li><a href="/merge-pdf/" class="hover:text-blue-600 transition-colors">Merge &amp; Split PDF</a></li>
            <li><a href="/compress-pdf/" class="hover:text-blue-600 transition-colors">Compress PDF Document</a></li>
            <li><a href="/image-to-pdf/" class="hover:text-blue-600 transition-colors">Image to PDF Converter</a></li>
            <li><a href="/image-converter/" class="hover:text-blue-600 transition-colors">Image Format Converter</a></li>
            <li><a href="/youtube-thumbnail/" class="hover:text-blue-600 transition-colors">YouTube Thumbnail Grabber</a></li>
          </ul>
        </div>

        <!-- Col 3: Text, Calc & Code Utilities (8 Tools) -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Calculators &amp; Utilities</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/age-calculator/" class="hover:text-blue-600 transition-colors">Age &amp; Date Calculator</a></li>
            <li><a href="/emi-calculator/" class="hover:text-blue-600 transition-colors">GST &amp; Loan EMI Calculator</a></li>
            <li><a href="/qr-code-generator/" class="hover:text-blue-600 transition-colors">QR Code Studio &amp; Reader</a></li>
            <li><a href="/password-generator/" class="hover:text-blue-600 transition-colors">Strong Password Creator</a></li>
            <li><a href="/word-counter/" class="hover:text-blue-600 transition-colors">Word &amp; Character Counter</a></li>
            <li><a href="/text-case-converter/" class="hover:text-blue-600 transition-colors">Text Case Converter</a></li>
            <li><a href="/json-formatter/" class="hover:text-blue-600 transition-colors">JSON Formatter &amp; Validator</a></li>
            <li><a href="/seo-meta-generator/" class="hover:text-blue-600 transition-colors">SEO Meta Tag Generator</a></li>
          </ul>
        </div>

        <!-- Col 4: Trust & Legal -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">About &amp; Trust</h4>
          <ul class="space-y-2">
            <li><a href="/about/" class="hover:text-blue-600 transition-colors">About Toolshere</a></li>
            <li><a href="/contact/" class="hover:text-blue-600 transition-colors">Contact Support</a></li>
            <li><a href="/privacy/" class="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms/" class="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            <li><a href="/disclaimer/" class="hover:text-blue-600 transition-colors">Disclaimer</a></li>
            <li><button type="button" onclick="openCookieConsentPreferences(event)" class="hover:text-blue-600 transition-colors text-left cursor-pointer focus:outline-hidden focus:underline text-xs" aria-label="Manage Cookie and Privacy Consent Preferences">Cookie Preferences</button></li>
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
  <script defer src="/assets/js/app.js${slug === 'compress-pdf' ? '?v=20261110_encfix' : ''}"></script>
</body>
</html>`.replace(/[ \t]+$/gm, '');
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
      "url": `https://toolshere.online/${slug}/`,
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
        { "@type": "ListItem", "position": 3, "name": tool.name, "item": `https://toolshere.online/${slug}/` }
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
    canonicalUrl: `https://toolshere.online/${slug}/`,
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
    title: 'About Us: Privacy-First Browser Tools — ToolsHere',
    metaDesc: 'Learn about ToolsHere.online, an independent online tools project dedicated to private, client-side document processing, image optimization, and utilities.',
    category: 'Information',
    extraHtml: `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200">Explore ToolsHere Resources:</p>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">All 16+ Free Tools</a>
          <a href="/blog/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">Blog &amp; How-To Guides</a>
          <a href="/privacy/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Privacy Policy</a>
          <a href="/contact/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Contact Support</a>
        </div>
      </div>
    `,
    customSectionsHtml: `
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-compass text-blue-600 text-sm"></i> Why We Built ToolsHere
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            In recent years, the online tools ecosystem has become frustratingly hostile to users. Basic everyday utilities—like compressing a PDF under 200KB for an official portal, converting an image to PNG, extracting text, or formatting JSON—frequently demand account registration, lock high-resolution output behind paid subscriptions, impose artificial daily quotas, or stamp intrusive watermarks onto exported documents.
          </p>
          <p>
            Even more concerning is the hidden privacy cost. Traditional converter sites upload your files to remote cloud servers for background processing. When handling sensitive assets—such as tax returns, government identification cards, employment contracts, medical records, or personal photos—uploading to third-party cloud infrastructure creates unnecessary exposure to data retention, server breaches, and unauthorized access.
          </p>
          <p>
            ToolsHere was built as an independent, transparent alternative. We believe modern desktop and mobile browsers have more than enough computing power to perform document and image manipulations locally. By executing all computations on your device, ToolsHere eliminates cloud data storage risks while delivering fast, free productivity without paywalls or subscriptions.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-microchip text-blue-600 text-sm"></i> How Client-Side Processing Works
        </h2>
        <div class="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Rather than operating as a cloud-hosted converter pipeline, ToolsHere delivers lightweight client-side applications directly to your browser session. Here is how our architecture operates:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <i class="fa-solid fa-file-lines text-blue-500"></i> In-Memory Document Streams
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                When you select a document, the browser reads raw byte buffers into sandboxed memory via the HTML5 <code>FileReader</code> and <code>ArrayBuffer</code> APIs. PDF restructuring, page extraction, and optimization run entirely in client JavaScript using PDF-Lib and PDF.js.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <i class="fa-solid fa-image text-emerald-500"></i> Hardware-Accelerated Canvas
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Image compression, resizing, color isolation, and format conversions (JPG, PNG, WebP) utilize the browser's native HTML5 Canvas 2D engine (<code>toBlob()</code> and <code>getImageData()</code>), rendering pixels directly with your device's hardware.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <i class="fa-solid fa-key text-amber-500"></i> Cryptographic Security
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Password generation uses the browser's native Web Crypto API (<code>window.crypto.getRandomValues()</code>) to produce cryptographically secure random values without transmitting passphrases over the network.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                <i class="fa-solid fa-download text-purple-500"></i> Ephemeral Blob URLs
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Generated outputs are packaged into temporary in-memory Blob references (<code>URL.createObjectURL()</code>) for immediate local download, followed by automatic memory revocation.
              </p>
            </div>
          </div>
          <div class="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60 text-xs text-slate-700 dark:text-slate-300">
            <strong class="text-blue-900 dark:text-blue-200 font-semibold">Device Performance Note:</strong> Because all rendering and computing execute locally rather than on a remote server farm, processing speed is determined by your device's available CPU cores and RAM. Processing very large multi-page PDFs or heavy images may take longer on low-powered mobile devices.
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-emerald-600 text-sm"></i> Data Privacy vs. Third-Party Services
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            We maintain a transparent boundary between local browser processing, utility network requests, and external services:
          </p>
          <ul class="space-y-2.5 list-disc pl-5">
            <li>
              <strong class="text-slate-900 dark:text-white">Local User File Processing:</strong> For our PDF, image, text, and calculator tools, all file manipulation and computation execute entirely inside your browser's local sandbox memory. We maintain zero file-upload endpoints, zero backend servers, and zero storage databases for your files.
            </li>
            <li>
              <strong class="text-slate-900 dark:text-white">YouTube Thumbnail Network Retrieval:</strong> The YouTube Thumbnail Grabber operates on public video links you provide. To fetch and display thumbnail images from YouTube media servers in your browser, requests pass through YouTube CDNs and an open image CORS proxy (<code>images.weserv.nl</code>). No private user documents are involved in this process.
            </li>
            <li>
              <strong class="text-slate-900 dark:text-white">Locally Hosted vs. CDN Resources:</strong> Core processing libraries such as PDF-Lib (<code>/assets/vendor/pdf-lib.min.js</code>), QR Code Generator (<code>/assets/vendor/qrcode.min.js</code>), and QR Scanner (<code>/assets/vendor/jsqr.min.js</code>) are hosted directly on our origin. Supporting helper libraries (PDF.js and JSZip on <code>cdnjs.cloudflare.com</code>, canvas-confetti on <code>cdn.jsdelivr.net</code>) and Google Fonts are loaded from public CDNs.
            </li>
            <li>
              <strong class="text-slate-900 dark:text-white">Web Analytics &amp; Advertising:</strong> To monitor technical site health and sustain project operations, ToolsHere integrates Google Analytics and Google AdSense. These services collect standard browser, device, and navigation metadata per their respective privacy policies; they do not access or process your local document or image buffers.
            </li>
          </ul>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-layer-group text-blue-600 text-sm"></i> Our Four Utility Categories
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-file-pdf text-red-500"></i> PDF Document Suite
            </h3>
            <p class="text-slate-500 dark:text-slate-400">
              Private document workflows: <a href="/compress-pdf/" class="text-blue-600 dark:text-blue-400 hover:underline">Compress PDF</a> (Balanced and Extreme modes), <a href="/merge-pdf/" class="text-blue-600 dark:text-blue-400 hover:underline">Merge &amp; Split PDF</a>, <a href="/pdf-to-word/" class="text-blue-600 dark:text-blue-400 hover:underline">PDF to Word Text Extractor (.doc draft)</a>, and <a href="/image-to-pdf/" class="text-blue-600 dark:text-blue-400 hover:underline">Image to PDF</a>.
            </p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Note: The PDF to Word tool extracts available document text and generates an HTML-based Word-compatible (.doc) draft. It does not preserve complex original layouts or guarantee binary DOCX formatting; scanned image-only PDFs require OCR, which this client utility does not provide.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-image text-blue-500"></i> Image &amp; Media Studio
            </h3>
            <p class="text-slate-500 dark:text-slate-400">
              Client-side visual tools: <a href="/image-compressor/" class="text-blue-600 dark:text-blue-400 hover:underline">Image Compressor &amp; Resizer</a> (20KB, 50KB, 100KB targets), <a href="/background-remover/" class="text-blue-600 dark:text-blue-400 hover:underline">Background Remover</a> (canvas cutout), <a href="/image-converter/" class="text-blue-600 dark:text-blue-400 hover:underline">Image Format Converter</a>, and <a href="/youtube-thumbnail/" class="text-blue-600 dark:text-blue-400 hover:underline">YouTube Thumbnail Grabber</a>.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-code text-amber-500"></i> Developer &amp; Text Utilities
            </h3>
            <p class="text-slate-500 dark:text-slate-400">
              Essential daily utilities: <a href="/json-formatter/" class="text-blue-600 dark:text-blue-400 hover:underline">JSON Formatter &amp; Validator</a>, <a href="/seo-meta-generator/" class="text-blue-600 dark:text-blue-400 hover:underline">SEO Meta Tag Generator</a>, <a href="/word-counter/" class="text-blue-600 dark:text-blue-400 hover:underline">Word &amp; Character Counter</a>, and <a href="/text-case-converter/" class="text-blue-600 dark:text-blue-400 hover:underline">Text Case Converter</a>.
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-calculator text-emerald-500"></i> Calculators &amp; Security
            </h3>
            <p class="text-slate-500 dark:text-slate-400">
              Offline-ready tools: <a href="/age-calculator/" class="text-blue-600 dark:text-blue-400 hover:underline">Age &amp; Date Calculator</a>, <a href="/emi-calculator/" class="text-blue-600 dark:text-blue-400 hover:underline">GST &amp; Loan EMI Calculator</a>, <a href="/password-generator/" class="text-blue-600 dark:text-blue-400 hover:underline">Strong Password Generator</a>, and <a href="/qr-code-generator/" class="text-blue-600 dark:text-blue-400 hover:underline">QR Code Studio &amp; Scanner</a>.
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-blue-600 text-sm"></i> Project Governance &amp; Support
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ToolsHere is an independent online tools project maintained with a focus on simplicity, speed, and privacy. We do not require accounts, we do not lock features behind paywalls, and we maintain all utilities continuously to ensure compatibility across modern browsers.
          </p>
          <p>
            Have feedback, found a bug, or want to suggest a new utility? Our team welcomes user inquiries. Visit our <a href="/contact/" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Contact &amp; Support page</a> or email us directly at <a href="mailto:support@toolshere.online" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">support@toolshere.online</a>.
          </p>
        </div>
      </section>
    `,
    extraSchemas: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://toolshere.online/about/#aboutpage",
        "url": "https://toolshere.online/about/",
        "name": "About Us: Privacy-First Browser Tools — ToolsHere",
        "description": "Learn about ToolsHere.online, an independent online tools project dedicated to private, client-side document processing, image optimization, and utilities.",
        "isPartOf": {
          "@id": "https://toolshere.online/#website"
        },
        "about": {
          "@id": "https://toolshere.online/#organization"
        }
      }
    ]
  },
  {
    slug: 'contact',
    modalKey: 'contactModal',
    iconClass: 'fa-solid fa-envelope',
    h1: 'Contact & Support',
    title: 'Contact ToolsHere Support & Feedback Team - ToolsHere',
    metaDesc: 'Get in touch with the ToolsHere.online team for technical support, feature requests, bug reports, and business inquiries. We value user feedback.',
    category: 'Information',
    h2s: ['Technical Support & Bug Inquiries', 'Feature Requests & Suggestions', 'Response Time Expectations'],
    extraHtml: `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200">Helpful Links &amp; Policies:</p>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="/about/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">About ToolsHere</a>
          <a href="/privacy/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Privacy Policy</a>
          <a href="/terms/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Terms of Service</a>
          <a href="/blog/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">Educational Blog</a>
        </div>
      </div>
    `
  },
  {
    slug: 'privacy',
    modalKey: 'privacyModal',
    iconClass: 'fa-solid fa-shield-halved',
    h1: 'Privacy Policy',
    title: 'Privacy Policy: Zero Server Data Storage - ToolsHere',
    metaDesc: 'Read the ToolsHere.online privacy policy. Understand our client-side architecture where all image, PDF, and text processing stays locally on your device.',
    category: 'Legal',
    extraHtml: `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200">Related Legal Documents:</p>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="/terms/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Terms of Service</a>
          <a href="/disclaimer/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">General Disclaimer</a>
          <a href="/contact/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">Contact Support</a>
        </div>
      </div>
    `,
    customSectionsHtml: `
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-info text-blue-600 text-sm"></i> Project Identity &amp; Operating Jurisdiction
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>ToolsHere.online</strong> is an independent web utility project maintained to provide free, privacy-conscious browser tools. The project operates from and is governed in accordance with the laws of <strong>India</strong>.
          </p>
          <p>
            Our core mission is to provide accessible digital utilities without forced accounts, subscriptions, or invasive user tracking. If you have questions regarding our data practices or this policy, our team can be reached directly via email at <a href="mailto:support@toolshere.online" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">support@toolshere.online</a> or through our <a href="/contact/" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Contact &amp; Support page</a>.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-shield-check text-blue-600 text-sm"></i> Verified In-Browser File Processing Architecture
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ToolsHere is engineered around client-side execution. When using our file-based tools—including <a href="/image-compressor/" class="text-blue-600 dark:text-blue-400 hover:underline">Image Compressor</a>, <a href="/image-converter/" class="text-blue-600 dark:text-blue-400 hover:underline">Image Converter</a>, <a href="/background-remover/" class="text-blue-600 dark:text-blue-400 hover:underline">Background Remover</a>, <a href="/merge-pdf/" class="text-blue-600 dark:text-blue-400 hover:underline">Merge PDF</a>, and <a href="/compress-pdf/" class="text-blue-600 dark:text-blue-400 hover:underline">Compress PDF</a>—your files are processed directly inside your browser's local memory.
          </p>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div class="flex items-start gap-2.5">
              <i class="fa-solid fa-check text-emerald-500 mt-0.5 shrink-0"></i>
              <span><strong>Client-Side Web APIs:</strong> Tools operate via standard browser APIs, including HTML5 Canvas 2D context manipulation, the JavaScript FileReader API, and in-memory WebAssembly/JavaScript libraries.</span>
            </div>
            <div class="flex items-start gap-2.5">
              <i class="fa-solid fa-check text-emerald-500 mt-0.5 shrink-0"></i>
              <span><strong>Zero Server File Transmission:</strong> Selected files are never uploaded to, transmitted across, or stored on ToolsHere.online backend servers. We do not operate remote file storage databases.</span>
            </div>
            <div class="flex items-start gap-2.5">
              <i class="fa-solid fa-check text-emerald-500 mt-0.5 shrink-0"></i>
              <span><strong>Memory Volatility:</strong> Document and image data reside only in transient browser memory and are discarded when you refresh or close the browser tab.</span>
            </div>
          </div>
          <p>
            <em>User Responsibility Notice:</em> Because processing occurs exclusively on your local device without cloud backup, you remain responsible for maintaining backups of your original documents and images before manipulation.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-rectangle-ad text-blue-600 text-sm"></i> Google AdSense &amp; Advertising Partners
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            To keep our utilities completely free and accessible without mandatory paywalls, ToolsHere displays digital advertising served by <strong>Google AdSense</strong> (Publisher ID: <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">ca-pub-5695881882047202</code>).
          </p>
          <p>
            Google and its certified third-party ad technology partners may place and read cookies (such as <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">__gads</code>, <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">__gpi</code>, and DoubleClick <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">IDE</code>) or unique device identifiers on your browser to serve relevant ads, limit ad frequency, combat fraud, and measure ad performance.
          </p>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h3 class="font-bold text-slate-900 dark:text-white">Programmatic Partner Network</h3>
            <p>
              Google's certified Consent Management Platform is used for applicable European consent requirements, coordinating ad serving through certified advertising partners. The specific number and identity of third-party vendors are dynamically maintained through Google's Certified Consent Management Platform and may change over time as Google updates partner integrations.
            </p>
            <p>
              You can learn how Google uses information from sites that use its services at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Google Advertising Policies</a> and manage personalized advertising controls via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Google Ad Settings</a>.
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-chart-line text-blue-600 text-sm"></i> Web Traffic Analytics (Google Analytics 4)
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ToolsHere uses <strong>Google Analytics 4</strong> (Property ID: <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">G-RXVYKC5YG5</code>) to understand aggregated audience interactions, navigation trends, general device categories, and performance bottlenecks.
          </p>
          <p>
            Google Analytics sets first-party measurement cookies (including <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">_ga</code> and container-specific tokens like <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">_ga_RXVYKC5YG5</code>) to distinguish unique sessions across web visits. These analytics cookies collect pseudonymous interaction data and IP-derived approximate geolocation without identifying you personally.
          </p>
          <p>
            <em>Data Retention Notice:</em> User and event-level retention in Google Analytics is governed by administrative property configurations (which default to 2 months and may be configured up to 14 months by property administrators). Visitors wishing to opt out of Google Analytics measurement across all websites can install the official <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Google Analytics Opt-Out Browser Add-on</a>.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-database text-blue-600 text-sm"></i> First-Party Local Storage &amp; Tracking Hygiene
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ToolsHere maintains clean first-party storage hygiene. Our proprietary scripts do not write or read first-party cookies (<code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">document.cookie</code> is never accessed by custom site code). We use browser <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code> solely for functional UI preferences:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-xs">
            <li><code class="font-mono text-blue-600 dark:text-cyan-400">theme</code>: Stores your visual display preference (<code class="font-mono">light</code> or <code class="font-mono">dark</code>).</li>
            <li><code class="font-mono text-blue-600 dark:text-cyan-400">th_favorites</code>: Stores a local array of your favorited tool identifiers to pin them to the top of your dashboard.</li>
          </ul>
          <p>
            <em>No Device Fingerprinting:</em> Aligned with our advertising setup, <strong>Special Feature 2 is disabled</strong>. ToolsHere does not perform canvas fingerprinting, scan device characteristics, or track hardware configurations to identify individual users.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-network-wired text-blue-600 text-sm"></i> Third-Party Services, CDNs &amp; External Requests
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            While document manipulation occurs strictly in your browser, loading certain pages and utility features makes external network calls:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>YouTube Thumbnail Grabber:</strong> When entering a YouTube URL, our script queries public thumbnail endpoints (<code class="font-mono">img.youtube.com</code>) routed through the public caching proxy <code class="font-mono">images.weserv.nl</code> to bypass browser Cross-Origin Resource Sharing (CORS) restrictions. Only the public video identifier is transmitted.
            </li>
            <li>
              <strong>Dynamic Open-Source Libraries:</strong> To ensure fast page loads, specific utilities load static open-source scripts on-demand from Cloudflare's CDN (<code class="font-mono">cdnjs.cloudflare.com</code>), including PDF.js for <a href="/pdf-to-word/" class="text-blue-600 dark:text-blue-400 hover:underline">PDF to Word Text Extractor</a> and QRCode.js for <a href="/qr-code-generator/" class="text-blue-600 dark:text-blue-400 hover:underline">QR Code Studio</a>. Core PDF utilities (Merge, Compress, Image to PDF) use <code class="font-mono">pdf-lib.min.js</code> hosted locally on our own domain.
            </li>
            <li>
              <strong>Web Fonts &amp; Icons:</strong> Tools pages load FontAwesome icons from <code class="font-mono">cdnjs.cloudflare.com</code>, and 404 pages utilize Inter font assets from Google Fonts (<code class="font-mono">fonts.googleapis.com</code>).
            </li>
          </ul>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-cookie-bite text-blue-600 text-sm"></i> Consent Management &amp; Privacy Preferences
        </h2>
        <div class="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            ToolsHere respects regional privacy frameworks. For visitors located in the European Economic Area (EEA), the United Kingdom, and Switzerland, ToolsHere supports Google's certified Consent Management Platform (CMP) for applicable European consent requirements. Where the relevant consent message is published and active in Google AdSense, the CMP collects and records consent choices for third-party advertising cookies and vendor data processing.
          </p>

          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <i class="fa-solid fa-sliders text-blue-600"></i> Manage Consent Preferences
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Reopen the certified consent dialogue to modify or revoke your cookie choices at any time.
              </p>
            </div>
            <button type="button" onclick="openCookieConsentPreferences(event)" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-hidden" aria-label="Open Cookie Consent Preferences Dialog">
              <i class="fa-solid fa-gear text-xs"></i> Change Preferences
            </button>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400">
            <em>Technical Note:</em> Consent revocation via this button uses Google's official <code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs">CONSENT_API_READY</code> callback queue. If you browse from outside regulated regions, if the relevant European consent message is not published and active in AdSense, or if an ad-blocking extension prevents Google's CMP from initializing, the dialogue may not display. In such cases, you can manage cookies directly through your browser settings.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-scale-balanced text-blue-600 text-sm"></i> Applicable Legal Frameworks &amp; User Rights
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Depending on your physical location and applicable data protection legislation, you may have specific statutory rights regarding personal data:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong>India — Digital Personal Data Protection Act, 2023 (DPDP Act):</strong> ToolsHere aligns its privacy transparency with the DPDP Act as rules and operative provisions are brought into force in accordance with the central government's phased commencement notifications. Document and image files handled by the audited file-processing tools are processed locally within your browser. These files are not transmitted to or stored on ToolsHere's backend servers through those audited processing workflows. Files may contain personal information, which is temporarily processed on your device.
            </li>
            <li>
              <strong>European Union &amp; United Kingdom (GDPR / UK GDPR):</strong> Visitors in the EEA and UK possess statutory rights regarding personal data, including the right to request access, rectification, erasure, or restriction of processing, and to object to processing based on legitimate interest. ToolsHere does not maintain user accounts or store uploaded files on its own servers through the audited file-processing tools. Accordingly, ToolsHere does not hold those uploaded files in a server-side account that can be retrieved or erased on request. Data held by Google or other third-party providers must be managed through the relevant provider's privacy controls.
            </li>
            <li>
              <strong>United States State Privacy Laws (e.g., CCPA / CPRA):</strong> ToolsHere does not sell your personal information for monetary consideration. Visitors can manage ad personalization and advertising preferences through Google Ad Settings. Browser-level privacy controls may also be available, depending on the browser and applicable third-party services.
            </li>
          </ul>
          <p>
            To submit an inquiry regarding your data rights, contact us at <a href="mailto:support@toolshere.online" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">support@toolshere.online</a>. Inquiries are reviewed and addressed in accordance with applicable laws without fixed turnaround commitments.
          </p>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="fa-solid fa-lock text-blue-600 text-sm"></i> Security, Data Retention &amp; Policy Updates
        </h2>
        <div class="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            All communications between your browser and ToolsHere.online are secured in transit using modern Transport Layer Security (TLS/HTTPS). Because file conversions occur entirely in temporary browser memory, ToolsHere enforces a strict zero-server-retention policy for your digital documents and images.
          </p>
          <p>
            We may revise this Privacy Policy periodically to reflect technological adjustments, third-party provider updates, or statutory developments. Any changes will be posted directly to this page with an updated modification timestamp.
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
            <strong>Last Modified:</strong> November 11, 2026 • ToolsHere.online Independent Web Utility Project
          </p>
        </div>
      </section>
    `,
    extraSchemas: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://toolshere.online/privacy/#webpage",
        "url": "https://toolshere.online/privacy/",
        "name": "Privacy Policy: Zero Server Data Storage - ToolsHere",
        "description": "Read the ToolsHere.online privacy policy. Understand our client-side architecture where all image, PDF, and text processing stays locally on your device.",
        "isPartOf": {
          "@id": "https://toolshere.online/#website"
        },
        "publisher": {
          "@id": "https://toolshere.online/#organization"
        },
        "inLanguage": "en-US",
        "dateModified": "2026-11-11"
      }
    ]
  },
  {
    slug: 'terms',
    modalKey: 'termsModal',
    iconClass: 'fa-solid fa-file-contract',
    h1: 'Terms of Service',
    title: 'Terms of Service & Usage Guidelines - ToolsHere',
    metaDesc: 'Review the terms of service, conditions of use, and intellectual property policies governing your access to ToolsHere.online free browser utilities.',
    category: 'Legal',
    h2s: ['Permitted Utility Usage', 'Intellectual Property & Content Ownership', 'Disclaimer of Warranties & Liability'],
    extraHtml: `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200">Related Legal Documents:</p>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="/privacy/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Privacy Policy</a>
          <a href="/disclaimer/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">General Disclaimer</a>
          <a href="/about/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">About ToolsHere</a>
        </div>
      </div>
    `
  },
  {
    slug: 'disclaimer',
    modalKey: 'disclaimerModal',
    iconClass: 'fa-solid fa-triangle-exclamation',
    h1: 'General Disclaimer',
    title: 'General & Technical Disclaimer Policy - ToolsHere',
    metaDesc: 'Read the legal and technical disclaimer for ToolsHere.online. Clarifications on calculations, document conversions, and third-party content policies.',
    category: 'Legal',
    h2s: ['Calculation & Conversion Estimates', 'Third-Party Content & External Links', 'User Responsibility & Due Diligence'],
    extraHtml: `
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <p class="font-bold text-slate-800 dark:text-slate-200">Related Tools &amp; Policies:</p>
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <a href="/emi-calculator/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">GST &amp; EMI Calculator</a>
          <a href="/age-calculator/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 font-semibold text-xs hover:border-blue-400 transition-colors">Age &amp; Date Calculator</a>
          <a href="/terms/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Terms of Service</a>
          <a href="/contact/" class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:border-blue-400 transition-colors">Contact Support</a>
        </div>
      </div>
    `
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
        { "@type": "ListItem", "position": 2, "name": p.h1, "item": `https://toolshere.online/${p.slug}/` }
      ]
    }
  ];
  if (p.extraSchemas && Array.isArray(p.extraSchemas)) {
    jsonLdSchemas.push(...p.extraSchemas);
  }

  const pageHtml = generatePageTemplate({
    slug: p.slug,
    title: p.title || route.title,
    metaDesc: p.metaDesc || route.metaDesc,
    canonicalUrl: `https://toolshere.online/${p.slug}/`,
    h1: p.h1,
    category: p.category,
    iconClass: p.iconClass,
    workspaceHtml: `
      <div class="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        ${container.innerHTML || '<p>Content</p>'}
        ${p.extraHtml || ''}
        ${p.customSectionsHtml ? `
          <div class="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
            ${p.customSectionsHtml}
          </div>
        ` : (p.h2s ? `
          <div class="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
            ${p.h2s.map(h2 => `
              <section class="space-y-2">
                <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <i class="fa-solid fa-shield-check text-blue-600 text-sm"></i> ${h2}
                </h2>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  ToolsHere is dedicated to providing reliable, private client-side utilities. For inquiries or updates regarding ${h2.toLowerCase()}, our team is available via our <a href="/contact/" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">contact and support page</a>.
                </p>
              </section>
            `).join('')}
          </div>
        ` : '')}
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
    return { loc: `https://toolshere.online/${slug}/`, priority: '0.9', changefreq: 'weekly' };
  }),
  { loc: 'https://toolshere.online/about/', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/contact/', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/privacy/', priority: '0.4', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/terms/', priority: '0.4', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/disclaimer/', priority: '0.4', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/blog/', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://toolshere.online/blog/how-to-convert-pdf-to-jpg/', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/blog/how-to-compress-pdf-for-email/', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://toolshere.online/blog/how-to-merge-pdf-files-online/', priority: '0.7', changefreq: 'monthly' }
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
  updatedIndex = updatedIndex.split(`href="#${slug}"`).join(`href="/${slug}/"`);
  updatedIndex = updatedIndex.split(`href="/${slug}"`).join(`href="/${slug}/"`);
  updatedIndex = updatedIndex.split(`"url": "https://toolshere.online/#${slug}"`).join(`"url": "https://toolshere.online/${slug}/"`);
  updatedIndex = updatedIndex.split(`"url": "https://toolshere.online/${slug}"`).join(`"url": "https://toolshere.online/${slug}/"`);
});

// Update legal and blog links
['about', 'contact', 'privacy', 'terms', 'disclaimer', 'blog'].forEach(l => {
  updatedIndex = updatedIndex.split(`href="#${l}"`).join(`href="/${l}/"`);
  updatedIndex = updatedIndex.split(`href="/${l}"`).join(`href="/${l}/"`);
  updatedIndex = updatedIndex.split(`"url": "https://toolshere.online/${l}"`).join(`"url": "https://toolshere.online/${l}/"`);
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
        <a href="/image-compressor/" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-compress text-blue-600"></i> Image Resizer
        </a>
        <a href="/merge-pdf/" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-object-group text-red-600"></i> Merge PDF
        </a>
        <a href="/qr-code-generator/" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-qrcode text-teal-600"></i> QR Generator
        </a>
        <a href="/age-calculator/" class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors">
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
