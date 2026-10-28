/**
 * Toolshere.online - Master Tools Registry
 * Strict 12-Tool Suite Specification:
 * 1. Image Compressor
 * 2. PDF Tools (Merge, Split, Compress, PDF to JPG, Image to PDF)
 * 3. QR Code Generator
 * 4. Word Counter
 * 5. Image Converter (JPG, PNG, WebP)
 * 6. Age Calculator
 * 7. EMI Calculator
 * 8. GST Calculator (India)
 * 9. Password Generator
 * 10. JSON Formatter and Validator
 * 11. YouTube Thumbnail Downloader
 * 12. SEO Meta Tag Generator
 */

const QUICK_TOOLS = [
  // 1. Image Compressor
  {
    id: "image-compressor",
    name: "Image Compressor",
    category: "images",
    categoryName: "Image Tools",
    icon: "🗜️",
    description: "Compress JPG, PNG, and WebP images by up to 90% in your browser without losing visual quality.",
    file: "image-compressor.html",
    badge: "Popular",
    popular: true,
    keywords: ["image", "compress", "compressor", "reduce size", "optimize", "photo", "jpg", "png", "webp", "kb", "mb"]
  },

  // 2. PDF Tools Suite (Hub + dedicated subtools)
  {
    id: "pdf-tools",
    name: "PDF Tools Suite",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "📄",
    description: "Complete private PDF suite: Merge multiple PDFs, Split pages, Compress file size, PDF to JPG, and Image to PDF.",
    file: "pdf-tools.html",
    badge: "All-in-One",
    popular: true,
    keywords: ["pdf", "pdf tools", "merge", "split", "compress", "pdf to jpg", "image to pdf", "convert", "combine"]
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "🔗",
    description: "Combine multiple PDF documents into a single organized file in seconds with custom ordering.",
    file: "merge-pdf.html",
    badge: "Popular",
    popular: true,
    keywords: ["pdf", "merge", "combine", "join", "binder", "pages", "document"]
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "✂️",
    description: "Extract specific pages or page ranges from a PDF document into an independent PDF file.",
    file: "split-pdf.html",
    badge: "Popular",
    popular: false,
    keywords: ["pdf", "split", "extract", "pages", "separate", "cut", "divide"]
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "📦",
    description: "Reduce PDF document size efficiently for email attachments and web upload limits.",
    file: "compress-pdf.html",
    badge: "Popular",
    popular: true,
    keywords: ["pdf", "compress", "shrink", "reduce", "size", "optimize", "mb to kb"]
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "🖼️",
    description: "Convert each page of a PDF document into crisp, high-resolution JPG images with one-click download.",
    file: "pdf-to-jpg.html",
    badge: "Convert",
    popular: true,
    keywords: ["pdf", "jpg", "jpeg", "image", "convert", "pdf to image", "export"]
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    category: "pdf",
    categoryName: "PDF Tools",
    icon: "📑",
    description: "Turn JPG, PNG, and WebP images into a beautifully formatted, print-ready PDF document.",
    file: "image-to-pdf.html",
    badge: "Essential",
    popular: true,
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photos to pdf", "convert", "album"]
  },

  // 3. QR Code Generator
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    category: "generators",
    categoryName: "Generators",
    icon: "📱",
    description: "Generate customized high-resolution QR codes for websites, plain text, WiFi credentials, and email.",
    file: "qr-code-generator.html",
    badge: "Popular",
    popular: true,
    keywords: ["qr", "qr code", "barcode", "generator", "wifi", "link", "download", "png", "svg"]
  },

  // 4. Word Counter
  {
    id: "word-counter",
    name: "Word Counter",
    category: "text",
    categoryName: "Text Tools",
    icon: "📝",
    description: "Real-time word, character, sentence, and paragraph counter with reading time, speaking time, and keyword stats.",
    file: "word-counter.html",
    badge: "Popular",
    popular: true,
    keywords: ["word", "counter", "character", "length", "reading time", "speaking time", "essay", "density"]
  },

  // 5. Image Converter (JPG, PNG, WebP)
  {
    id: "image-converter",
    name: "Image Converter",
    category: "images",
    categoryName: "Image Tools",
    icon: "🔄",
    description: "Fast in-browser converter between JPG, PNG, and WebP formats with adjustable quality and instant preview.",
    file: "image-converter.html",
    badge: "Convert",
    popular: true,
    keywords: ["image converter", "jpg to png", "png to jpg", "webp", "format", "convert", "transparency"]
  },

  // 6. Age Calculator
  {
    id: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    categoryName: "Calculators",
    icon: "🎂",
    description: "Calculate your exact age in years, months, days, total days lived, and live next birthday countdown.",
    file: "age-calculator.html",
    badge: "Popular",
    popular: true,
    keywords: ["age", "birthday", "date of birth", "years old", "days lived", "countdown", "zodiac"]
  },

  // 7. EMI Calculator
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    category: "calculators",
    categoryName: "Calculators",
    icon: "🏦",
    description: "Calculate monthly home loan, car loan, or personal loan EMI with total interest and full amortization schedule.",
    file: "emi-calculator.html",
    badge: "Finance",
    popular: true,
    keywords: ["emi", "loan", "calculator", "interest", "principal", "mortgage", "car loan", "home loan", "amortization"]
  },

  // 8. GST Calculator (India)
  {
    id: "gst-calculator",
    name: "GST Calculator (India)",
    category: "calculators",
    categoryName: "Calculators",
    icon: "🇮🇳",
    description: "Calculate Goods and Services Tax (GST) for India. Supports 0%, 5%, 12%, 18%, 28%, Add/Remove GST, and CGST/SGST/IGST breakdown.",
    file: "gst-calculator.html",
    badge: "India Tax",
    popular: true,
    keywords: ["gst", "india", "tax", "cgst", "sgst", "igst", "calculator", "inclusive", "exclusive", "invoice"]
  },

  // 9. Password Generator
  {
    id: "password-generator",
    name: "Password Generator",
    category: "generators",
    categoryName: "Generators",
    icon: "🔐",
    description: "Create unbreakable random passwords with customizable length, symbols, numbers, and strength entropy meter.",
    file: "password-generator.html",
    badge: "Security",
    popular: true,
    keywords: ["password", "generator", "random", "secure", "pin", "key", "passphrase", "strong"]
  },

  // 10. JSON Formatter and Validator
  {
    id: "json-formatter",
    name: "JSON Formatter and Validator",
    category: "developer",
    categoryName: "Developer Tools",
    icon: "💻",
    description: "Format, beautify, minify, and validate JSON code with line-by-line syntax error identification and one-click copy.",
    file: "json-formatter.html",
    badge: "Dev Tool",
    popular: true,
    keywords: ["json", "formatter", "validator", "beautifier", "minify", "syntax", "lint", "developer"]
  },

  // 11. YouTube Thumbnail Downloader
  {
    id: "youtube-thumbnail-downloader",
    name: "YouTube Thumbnail Downloader",
    category: "generators",
    categoryName: "Generators",
    icon: "▶️",
    description: "Extract and download high-resolution YouTube thumbnails in 1080p Full HD, HQ, and Standard formats instantly.",
    file: "youtube-thumbnail-downloader.html",
    badge: "Media",
    popular: true,
    keywords: ["youtube", "thumbnail", "downloader", "cover", "1080p", "hd", "video", "yt", "image"]
  },

  // 12. SEO Meta Tag Generator
  {
    id: "seo-meta-tag-generator",
    name: "SEO Meta Tag Generator",
    category: "developer",
    categoryName: "Developer Tools",
    icon: "🚀",
    description: "Generate standard SEO meta tags, Open Graph cards, and Twitter Cards with real-time Google search snippet previews.",
    file: "seo-meta-tag-generator.html",
    badge: "SEO",
    popular: true,
    keywords: ["seo", "meta tags", "open graph", "twitter card", "serp", "google preview", "canonical", "metadata"]
  }
];

const CATEGORIES = [
  { id: "all", name: "All Tools", icon: "⚡", count: 12 },
  { id: "images", name: "Image Tools", icon: "🖼️", count: 2 },
  { id: "pdf", name: "PDF Suite", icon: "📄", count: 5 },
  { id: "calculators", name: "Calculators", icon: "🧮", count: 3 },
  { id: "text", name: "Text Tools", icon: "✍️", count: 1 },
  { id: "generators", name: "Generators & Media", icon: "⚙️", count: 3 },
  { id: "developer", name: "Developer & SEO", icon: "💻", count: 2 }
];

// Helper to get tool URL depending on whether caller is in root or inside /tools/
function getToolPath(toolFile, isInsideToolsDir = false) {
  return isInsideToolsDir ? toolFile : `tools/${toolFile}`;
}

// Reset any outdated custom tools in storage to ensure user gets exact 12 tools
function getQuickTools() {
  return QUICK_TOOLS;
}

function saveQuickTools(toolsArray) {
  if (typeof window !== "undefined") {
    localStorage.setItem("quicktools_custom_tools", JSON.stringify(toolsArray));
  }
}

function getSiteSettings() {
  const defaultSettings = {
    siteName: "Toolshere.online",
    tagline: "Free Online Tools for Everyone",
    announcementEnabled: false,
    announcementText: "⚡ 12 high-performance, 100% private browser tools on Toolshere.online!",
    announcementLink: "all-tools.html",
    adsEnabled: true,
    primaryColor: "#7c3aed"
  };

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("quicktools_site_settings");
      if (stored) {
        return Object.assign({}, defaultSettings, JSON.parse(stored));
      }
    } catch (e) {}
  }
  return defaultSettings;
}

function saveSiteSettings(settingsObj) {
  if (typeof window !== "undefined") {
    localStorage.setItem("quicktools_site_settings", JSON.stringify(settingsObj));
  }
}

// Export for module/global usage
if (typeof window !== "undefined") {
  window.QUICK_TOOLS = QUICK_TOOLS;
  window.CATEGORIES = CATEGORIES;
  window.getToolPath = getToolPath;
  window.getQuickTools = getQuickTools;
  window.saveQuickTools = saveQuickTools;
  window.getSiteSettings = getSiteSettings;
  window.saveSiteSettings = saveSiteSettings;
}
