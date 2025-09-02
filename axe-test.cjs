const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');
const { window } = new JSDOM(html);

global.window = window;
global.document = window.document;
global.Node = window.Node;
global.Element = window.Element;
global.DocumentFragment = window.DocumentFragment;
global.HTMLElement = window.HTMLElement;
global.navigator = window.navigator;

const axe = require('axe-core');
axe.configure({ rules: [{ id: 'color-contrast', enabled: false }] });

axe.run(document).then(results => {
  if (results.violations.length) {
    console.error('Accessibility violations:', results.violations);
    process.exit(1);
  } else {
    console.log('No accessibility violations found');
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
