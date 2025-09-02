const params = new URLSearchParams(window.location.search);
const leaseId = params.get('id') || '1';

function renderTimeline(items) {
  const ul = document.getElementById('timeline');
  ul.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.status} - ${new Date(item.timestamp).toLocaleString()}`;
    ul.appendChild(li);
  });
}

function fetchStatuses() {
  fetch(`/lease/${leaseId}/status`)
    .then((res) => res.json())
    .then(renderTimeline)
    .catch((err) => console.error('Failed to load statuses', err));
}

fetchStatuses();
setInterval(fetchStatuses, 5000);
