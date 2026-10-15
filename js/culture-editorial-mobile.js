(() => {
  function enhance() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const article = document.querySelector('.culture-editorial-page :is(.culture-content, .persia-content) .article');
    const toc = article?.querySelector('.culture-mobile-nav');
    if (!toc || article.dataset.cultureEditorialReady) return;
    article.dataset.cultureEditorialReady = 'true';
    const english = document.documentElement.lang === 'en';
    toc.id = article.closest('.persia-content') ? 'persia-page-index' : 'culture-page-index';
    const label = document.createElement('p');
    label.className = 'culture-index-label';
    label.textContent = english ? 'On this page' : 'In questa pagina';
    toc.prepend(label);
    article.querySelectorAll('.culture-mobile-section').forEach(section => {
      const back = document.createElement('a');
      back.className = 'craft-index-return';
      back.href = '#' + toc.id;
      back.textContent = english ? 'Back to page index' : 'Torna all\'indice';
      back.addEventListener('click', event => {
        event.preventDefault();
        history.replaceState(null, '', back.hash);
        window.scrollTo({
          top: Math.max(0, toc.getBoundingClientRect().top + window.scrollY - 84),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
      section.append(back);
    });
  }
  // Run after the shared script has built the mobile sections.
  if (document.readyState === 'complete') enhance();
  else document.addEventListener('DOMContentLoaded', enhance);
})();
