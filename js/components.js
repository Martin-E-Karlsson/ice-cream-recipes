async function loadPartial(selector, url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} → HTTP ${response.status}`);
  }

  const target = document.querySelector(selector);

  if (!target) {
    throw new Error(`Selector not found: ${selector}`);
  }

  target.innerHTML = await response.text();
}

Promise.all([
  loadPartial('#site-header', 'components/header.html'),
  loadPartial('#site-footer', 'components/footer.html')
])
  .then(() => {
    if (typeof markActiveLink === 'function') {
      markActiveLink();
    }
  })
  .catch((err) => {
    console.error('Partials failed:', err);
  });
