# 🛠️ Toolshere.online — Free, Private & Fast Online Tools Platform

> **Modern, fast, 100% private client-side online tools website featuring 12 essential utilities, dark/light mode, mobile-first design, and complete SEO infrastructure.**

Toolshere.online is built with vanilla HTML5, modern CSS3 (with responsive layout, glassmorphic design, subtle animations, and dark mode toggle), and optimized client-side JavaScript. All data processing (calculations, text formatting, image compression, and PDF manipulation) executes directly in the user's browser — protecting user privacy with zero server uploads.

---

## 🎨 Design & Branding
- **Branding**: Clean **Toolshere.online** branding with official uploaded logo ([`assets/logo.png`](assets/logo.png)).
- **Themes**: Seamless Light and Dark mode with one-click toggle and `localStorage` persistence.
- **Typography**: Clean, accessible Google Font (*Plus Jakarta Sans*).
- **Privacy First**: 100% in-browser processing. Zero server uploads.
- **Responsiveness**: Mobile-first responsive layout across phones, tablets, laptops, and desktops.

---

## 🛠️ The 12 Essential Tools

1. **Image Compressor** (`tools/image-compressor.html`): Compress JPG, PNG, and WebP by up to 85% with quality slider and real-time comparison metrics.
2. **PDF Tools Suite** (`tools/pdf-tools.html`): Complete PDF toolkit:
   - **Merge PDF** (`tools/merge-pdf.html`): Combine multiple PDFs into a single file with custom order.
   - **Split PDF** (`tools/split-pdf.html`): Extract pages or split documents into separate files.
   - **Compress PDF** (`tools/compress-pdf.html`): Reduce PDF size client-side.
   - **PDF to JPG** (`tools/pdf-to-jpg.html`): Convert PDF pages to high-resolution JPG images.
   - **Image to PDF** (`tools/image-to-pdf.html`): Turn photos into organized, print-ready PDF files.
3. **QR Code Generator** (`tools/qr-code-generator.html`): Generate custom QR codes for URLs, Text, WiFi credentials, and Email with PNG download.
4. **Word Counter** (`tools/word-counter.html`): Count words, characters, sentences, paragraphs, and reading time with keyword frequency metrics.
5. **Image Converter** (`tools/image-converter.html`): Convert images between JPG, PNG, and WebP formats in browser.
6. **Age Calculator** (`tools/age-calculator.html`): Calculate exact age in years, months, days, total days lived, and next birthday countdown.
7. **EMI Calculator** (`tools/emi-calculator.html`): Compute monthly loan EMI, total interest, and full amortization schedule table.
8. **GST Calculator (India)** (`tools/gst-calculator.html`): Calculate Indian GST with official slabs (0%, 3%, 5%, 12%, 18%, 28%) and CGST/SGST/IGST breakdown.
9. **Password Generator** (`tools/password-generator.html`): Cryptographically secure random password generator with entropy meter.
10. **JSON Formatter & Validator** (`tools/json-formatter.html`): Beautify, minify, and validate JSON data with line-by-line syntax diagnostics.
11. **YouTube Thumbnail Downloader** (`tools/youtube-thumbnail-downloader.html`): Download YouTube video and Shorts thumbnails in 1080p Full HD, HQ, and SD.
12. **SEO Meta Tag Generator** (`tools/seo-meta-tag-generator.html`): Generate SEO, Open Graph, and Twitter Cards with real-time Google SERP preview.

---

## 🔍 SEO & Google Integration Readiness

### 1. Google Search Console Verification
In `index.html` (line 38), replace `GSC_VERIFICATION_PLACEHOLDER` with your verification token:
```html
<meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_CODE">
```
After adding, submit your sitemap: `https://toolshere.online/sitemap.xml`.

### 2. Google Analytics 4 (GA4)
In `index.html` (lines 40-49), uncomment the snippet and replace `G-XXXXXXXXXX` with your GA4 Measurement ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. XML Sitemap & Robots.txt
- **Sitemap**: Fully configured with canonical URLs and priorities at [`sitemap.xml`](sitemap.xml).
- **Robots.txt**: Permissive, pointing to sitemap at [`robots.txt`](robots.txt).
- **Structured Data**: Schema.org JSON-LD (`WebSite` with SearchAction, `SoftwareApplication`) implemented on homepage and tools.

### 4. Google AdSense & Monetization Readiness
- Standard responsive leaderboard (728x90) and in-article ad slots are prepared in `.ad-placeholder` blocks.
- Essential compliance pages are fully linked in header and footer:
  - [About Us](about.html)
  - [Contact Us](contact.html)
  - [Privacy Policy](privacy.html)
  - [Terms and Conditions](terms.html)
  - [Disclaimer](disclaimer.html)

---

## 🚀 Hosting & Custom Domain Setup

### Option A: GitHub Pages (Free)
1. Go to your repository on GitHub: `https://github.com/amantiwari234/toolshere`
2. Click **Settings** > **Pages**
3. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: **main** / folder: `/(root)`
4. Under **Custom domain**, enter: `toolshere.online`
5. In your domain registrar DNS settings (e.g. GoDaddy, Namecheap, Cloudflare), add:
   - **A Records** pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME Record**: `www` pointing to `amantiwari234.github.io`
6. Check **Enforce HTTPS**.

### Option B: Running Locally
Run the lightweight PowerShell server:
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Or simply open `index.html` in any modern web browser.
