/** @jest-environment jsdom */
const { fetchAndRenderHealth } = require('../public/health.js');

describe('health admin page', () => {
  it('renders green/red indicators based on API response', async () => {
    document.body.innerHTML = '<ul id="status-list"></ul>';
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ database: true, storage: false })
    });

    await fetchAndRenderHealth();

    const items = document.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].querySelector('span').style.backgroundColor).toBe('green');
    expect(items[1].querySelector('span').style.backgroundColor).toBe('red');
  });
});
