const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const React = require('react');
const { renderToFile, Document, Page, Text } = require('@react-pdf/renderer');

async function main() {
  const filePath = path.join(os.tmpdir(), `invoice-test-${Date.now()}.pdf`);
  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      null,
      React.createElement(Text, null, 'Sample Invoice')
    )
  );

  await renderToFile(doc, filePath);

  const stats = fs.statSync(filePath);
  assert(stats.size > 0, 'Generated PDF file is empty');

  const header = fs.readFileSync(filePath, { encoding: 'utf8' }).slice(0, 4);
  assert.strictEqual(header, '%PDF', 'Generated file is not a PDF');

  console.log('PDF generated at', filePath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
