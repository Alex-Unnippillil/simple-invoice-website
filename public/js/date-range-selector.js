document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('range-select');
  const custom = document.getElementById('custom-range');
  select.addEventListener('change', () => {
    custom.style.display = select.value === 'custom' ? 'block' : 'none';
  });
});
