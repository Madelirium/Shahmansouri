(() => {
  function enhance() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const article = document.querySelector('.craft-editorial-page .article');
    const toc = article?.querySelector('.crafts-mobile-nav');
    if (!toc || article.dataset.craftEditorialReady) return;
    article.dataset.craftEditorialReady = 'true';
    const english = document.documentElement.lang === 'en';
    const label = document.createElement('p');
    label.className = 'craft-index-label';
    label.textContent = english ? 'On this page' : 'In questa pagina';
    toc.prepend(label);
    article.querySelectorAll('.craft-mobile-section').forEach(section => {
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
  // Shared code creates the mobile sections in its DOMContentLoaded listener.
  if (document.readyState === 'complete') enhance();
  else document.addEventListener('DOMContentLoaded', enhance);
})();
