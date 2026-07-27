const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. module-card
  content = content.replace(
    /gsap\.from\('\.module-card', \{ y: 16, opacity: 0, duration: 0\.45, stagger: 0\.06, ease: 'power2\.out' \}\);/g,
    "gsap.fromTo('.module-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });"
  );

  // 2. terminal-card
  content = content.replace(
    /gsap\.from\('\.terminal-card', \{ y: 16, opacity: 0, duration: 0\.45, stagger: 0\.06, ease: 'power2\.out', delay: 0\.1 \}\);/g,
    "gsap.fromTo('.terminal-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', delay: 0.1, clearProps: 'all' });"
  );

  // 3. Header
  content = content.replace(
    /gsap\.from\(headerRef\.current, \{ y: -20, opacity: 0, duration: 0\.6, ease: 'power2\.out' \}\);/g,
    "gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' });"
  );

  // 4. Sidebar
  content = content.replace(
    /gsap\.from\(items, \{\s*x: -20,\s*opacity: 0,\s*duration: 0\.4,\s*stagger: 0\.04,\s*ease: 'power2\.out',\s*delay: 0\.2,?\s*\}\);/g,
    "gsap.fromTo(items, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.2, clearProps: 'all' });"
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', path.basename(file));
    changedCount++;
  }
});

console.log('Total files fixed:', changedCount);
