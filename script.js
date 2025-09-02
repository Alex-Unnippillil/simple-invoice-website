document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role') || 'guest';
  document.getElementById('role').textContent = role;

  const payBtn = document.getElementById('pay-btn');
  const editBtn = document.getElementById('edit-btn');

  if (role === 'customer') {
    payBtn.style.display = 'inline-block';
  }

  if (role === 'admin') {
    editBtn.style.display = 'inline-block';
  }
});
