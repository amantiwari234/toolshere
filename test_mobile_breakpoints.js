const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const pages = [
  'index.html',
  'image-compressor/index.html',
  'merge-pdf/index.html',
  'background-remover/index.html',
  'age-calculator/index.html',
  'about/index.html',
  'privacy/index.html'
];

console.log('--- TESTING MOBILE-FIRST FEATURES ACROSS PAGES ---');
let errors = 0;

pages.forEach(p => {
  const filePath = path.join(rootDir, p);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check 1: Viewport
  if (!content.includes('width=device-width') || !content.includes('viewport-fit=cover')) {
    console.error(`❌ ${p}: Missing responsive viewport meta tag!`);
    errors++;
  }

  // Check 2: Mobile Drawer & Backdrop
  if (!content.includes('id="mobileMenu"') || !content.includes('id="mobileDrawerBackdrop"')) {
    console.error(`❌ ${p}: Missing mobile menu drawer or backdrop!`);
    errors++;
  }

  // Check 3: Touch manipulation
  if (!content.includes('touch-action: manipulation')) {
    console.error(`❌ ${p}: Missing touch manipulation CSS!`);
    errors++;
  }

  // Check 4: Mobile search or navigation
  if (!content.includes('fa-bars')) {
    console.error(`❌ ${p}: Missing hamburger mobile menu icon!`);
    errors++;
  }
});

// Homepage specific checks
const indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
if (!indexContent.includes('min-[360px]:grid-cols-2')) {
  console.error('❌ index.html: Missing 2-column mobile grid breakpoint!');
  errors++;
}

if (!indexContent.includes('overflow-x-auto') || !indexContent.includes('no-scrollbar')) {
  console.error('❌ index.html: Missing horizontally scrollable category pills!');
  errors++;
}

console.log(`Mobile responsive audit finished with ${errors} errors.`);
if (errors === 0) {
  console.log('🎉 ALL MOBILE-FIRST REQUIREMENTS VERIFIED SUCCESSFULLY!');
} else {
  process.exit(1);
}
