async function fetchAndRenderHealth() {
  const res = await fetch('/api/health');
  const data = await res.json();
  const list = document.getElementById('status-list');
  list.innerHTML = '';
  Object.entries(data).forEach(([name, ok]) => {
    const li = document.createElement('li');
    const indicator = document.createElement('span');
    indicator.style.display = 'inline-block';
    indicator.style.width = '10px';
    indicator.style.height = '10px';
    indicator.style.borderRadius = '50%';
    indicator.style.backgroundColor = ok ? 'green' : 'red';
    indicator.style.marginRight = '8px';
    li.appendChild(indicator);
    li.appendChild(document.createTextNode(name));
    list.appendChild(li);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', fetchAndRenderHealth);
}

if (typeof module !== 'undefined') {
  module.exports = { fetchAndRenderHealth };
}
