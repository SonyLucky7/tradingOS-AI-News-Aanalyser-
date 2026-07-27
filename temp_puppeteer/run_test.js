const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
    headless: 'new' 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const location = msg.location();
    console.log(`BROWSER [${location.url}:${location.lineNumber}]:`, msg.text());
  });
  
  page.on('pageerror', err => console.log('ERROR:', err.message, err.stack));
  
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
