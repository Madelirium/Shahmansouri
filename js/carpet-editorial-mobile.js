(() => {
  function enhance() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const article = document.querySelector('.tappeti-content .article');
    const toc = article?.querySelector('.carpet-mobile-toc');
    if (!toc || article.dataset.editorialReady) return;
    article.dataset.editorialReady = 'true';
    const english = document.documentElement.lang === 'en';
    toc.id = 'carpet-page-index';
    const label = document.createElement('p');
    label.className = 'carpet-index-label';
    label.textContent = english ? 'On this page' : 'In questa pagina';
    toc.prepend(label);

    const sections = Array.from(article.querySelectorAll('.carpet-mobile-section'));
    const first = sections[0];
    const figures = first ? Array.from(first.querySelectorAll(':scope > figure')) : [];
    if (figures.length >= 3) {
      figures[0].classList.add('carpet-editorial-hero');
      const gallery = document.createElement('div');
      gallery.className = 'carpet-editorial-gallery';
      gallery.append(figures[1], figures[2]);
      const paragraphs = first.querySelectorAll(':scope > p');
      paragraphs[paragraphs.length - 1].before(gallery);
    }

    const knots = article.querySelector('#annodatura-tappeti, #rug-knotting')?.closest('section');
    const knotFigures = knots ? Array.from(knots.querySelectorAll('.carpet-mobile-knot-figure')) : [];
    if (knotFigures.length === 2) {
      const gallery = document.createElement('div');
      gallery.className = 'carpet-editorial-gallery';
      gallery.append(...knotFigures);
      knots.append(gallery);
    }

    sections.forEach(section => {
      const back = document.createElement('a');
      back.className = 'carpet-index-return';
      back.href = '#carpet-page-index';
      back.textContent = english ? 'Back to page index' : 'Torna all\'indice';
      back.addEventListener('click', event => {
        event.preventDefault();
        history.replaceState(null, '', back.hash);
        const top = toc.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
      section.append(back);
    });
  }

  if (document.readyState === 'complete') {
    enhance();
  } else {
    // The shared script builds the mobile sections during DOMContentLoaded first.
    document.addEventListener('DOMContentLoaded', enhance);
  }
})();
