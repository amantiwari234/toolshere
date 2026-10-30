const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = __dirname;
const pages = [
  '/',
  '/image-compressor',
  '/background-remover',
  '/pdf-to-word',
  '/merge-pdf',
  '/age-calculator',
  '/youtube-thumbnail',
  '/qr-code-generator',
  '/password-generator',
  '/word-counter',
  '/emi-calculator',
  '/image-converter',
  '/text-case-converter',
  '/json-formatter',
  '/seo-meta-generator',
  '/compress-pdf',
  '/image-to-pdf',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer'
];

let totalErrors = 0;

console.log('--- AUDITING 22 REDESIGNED PAGES ---');

pages.forEach(p => {
  const filePath = p === '/' ? path.join(rootDir, 'index.html') : path.join(rootDir, p.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Page file missing: ${filePath}`);
    totalErrors++;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // Check H1 count
  const h1Matches = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1) {
    console.error(`❌ ${p}: Expected 1 H1, found ${h1Matches.length}`);
    totalErrors++;
  }

  // Check Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`❌ ${p}: Missing title tag`);
    totalErrors++;
  }

  // Check Meta Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`❌ ${p}: Missing meta description`);
    totalErrors++;
  }

  // Check Canonical
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonMatch) {
    console.error(`❌ ${p}: Missing canonical tag`);
    totalErrors++;
  } else {
    const expected = p === '/' ? 'https://toolshere.online/' : `https://toolshere.online${p}`;
    if (canonMatch[1] !== expected) {
      console.error(`❌ ${p}: Canonical mismatch. Expected ${expected}, got ${canonMatch[1]}`);
      totalErrors++;
    }
  }

  // Check JSON-LD
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  let jsonCount = 0;
  while ((jsonMatch = jsonLdRegex.exec(content)) !== null) {
    jsonCount++;
    try {
      JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error(`❌ ${p}: Invalid JSON-LD block #${jsonCount}:`, e.message);
      totalErrors++;
    }
  }
  if (jsonCount === 0) {
    console.error(`❌ ${p}: Missing structured data`);
    totalErrors++;
  }

  // Check JS syntax
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let sMatch;
  while ((sMatch = scriptRegex.exec(content)) !== null) {
    const attr = sMatch[1];
    const code = sMatch[2];
    if (!attr.includes('src=') && !attr.includes('application/ld+json')) {
      try {
        new vm.Script(code);
      } catch (e) {
        console.error(`❌ ${p}: JS Syntax error in script block:`, e.message);
        totalErrors++;
      }
    }
  }
});

// Check sitemap.xml
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap.xml is missing!');
  totalErrors++;
} else {
  const smContent = fs.readFileSync(sitemapPath, 'utf8');
  pages.forEach(p => {
    const expectedLoc = p === '/' ? 'https://toolshere.online/' : `https://toolshere.online${p}`;
    if (!smContent.includes(`<loc>${expectedLoc}</loc>`)) {
      console.error(`❌ sitemap.xml missing URL: ${expectedLoc}`);
      totalErrors++;
    }
  });
}

// Check robots.txt
const robotsPath = path.join(rootDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ robots.txt is missing!');
  totalErrors++;
}

console.log(`\nAudit completed with ${totalErrors} errors.`);
if (totalErrors === 0) {
  console.log('🎉 ALL 22 PAGES PASSED VALIDATION PERFECTLY! 100% HEALTHY TECHNICAL SEO & MARKUP.');
} else {
  process.exit(1);
}
