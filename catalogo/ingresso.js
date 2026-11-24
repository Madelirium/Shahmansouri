(() => {
  'use strict';
  const layer = document.getElementById('catalog-initial-layer');
  if (!layer || typeof layer.showModal !== 'function') return;

  // Direct filtered links and returns from product pages keep their existing context.
  const initialQuery = new URLSearchParams(location.search);
  const filterNames = ['category', 'categories', 'subcategory', 'subcategories',
    'q', 'search', 'tag', 'material', 'materials', 'lengthMin', 'lengthMax',
    'widthMin', 'widthMax', 'sort'];
  if (filterNames.some(name => (initialQuery.get(name) || '').trim())) return;

  const previousOverflow = document.documentElement.style.overflow;
  function openLayer() {
    if (layer.open) return;
    layer.showModal();
    document.documentElement.style.overflow = 'hidden';
    layer.querySelector('.initial-banner')?.focus({preventScroll: true});
  }
  layer.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    const title = document.querySelector('main h1');
    if (title) {
      title.setAttribute('tabindex', '-1');
      title.focus({preventScroll: true});
    }
  });
  // Native dialog confines keyboard focus and retains Escape as an accessible exit.
  // The backdrop has no click-to-dismiss action; only the three cards navigate.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', openLayer, {once: true});
  } else openLayer();

  const categoryGroups = [
    ['Tappeti'],
    ['Nomadici'],
    ['Maiolica', 'Khatam', 'Papier-mâché', 'Miniatura', 'Cesellatura']
  ];
  fetch(new URL('products.json', document.baseURI)).then(response => {
    if (!response.ok) throw new Error('Products unavailable');
    return response.json();
  }).then(data => {
    const products = Array.isArray(data) ? data : data.products;
    if (!Array.isArray(products)) return;
    layer.querySelectorAll('.initial-banner img').forEach((image, index) => {
      const candidates = products.filter(product => {
        const categories = product.categories?.length ? product.categories : [product.category];
        return categories.some(category => categoryGroups[index].includes(category))
          && (product.coverImage640 || product.coverImage);
      });
      if (!candidates.length) return;
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const source = chosen.coverImage640 || chosen.coverImage;
      const preload = new Image();
      preload.onload = () => {
        image.src = source;
        image.dataset.randomProduct = chosen.id || chosen.slug;
      };
      preload.src = source;
    });
  }).catch(() => { /* Keep the static category photos if data cannot load. */ });
})();
