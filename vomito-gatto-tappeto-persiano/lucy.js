(() => {
  const navigation = document.querySelector('.lucy-topics');
  if (!navigation) return;

  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  let chosenId = null;

  function markCurrent(id) {
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function updateCurrent() {
    scheduled = false;
    // Follow document order, including the first-steps section above the index.
    const ordered = [...sections].sort((left, right) => left.getBoundingClientRect().top - right.getBoundingClientRect().top);
    // Keep the last chosen topic while the reader returns to the index.
    // The index sits between the first steps and the rest of the article.
    const menu = navigation.getBoundingClientRect();
    if (menu.bottom > 0 && menu.top < window.innerHeight) {
      markCurrent(chosenId);
      return;
    }
    let current = null;
    for (const section of ordered) {
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= 100 && bounds.bottom > 100) current = section;
    }
    if (current) markCurrent(current.id);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrent);
  }

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(link.hash.slice(1));
    if (!section) return;
    event.preventDefault();
    chosenId = section.id;
    history.pushState(null, '', link.hash);
    const heading = section.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll: true});
    }
    section.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'});
    markCurrent(section.id);
  });

  window.addEventListener('scroll', scheduleUpdate, {passive: true});
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  updateCurrent();
})();
(() => {
  const english = document.documentElement.lang === 'en';
  const petName = document.querySelector('[data-photo-name]')?.dataset.photoName || 'Lucy';
  const dialog = document.createElement('dialog');
  dialog.className = 'lucy-photo-dialog';
  dialog.setAttribute('aria-label', english ? `${petName} photo enlarged` : `Foto di ${petName} ingrandita`);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'lucy-photo-close';
  close.textContent = english ? 'Close ×' : 'Chiudi ×';
  const fullImage = document.createElement('img');
  fullImage.width = 960;
  fullImage.height = 1274;
  dialog.append(close, fullImage);
  document.body.append(dialog);
  let opener;
  let previousOverflow;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    opener?.focus({preventScroll: true});
  });
  document.querySelectorAll('.lucy-hero img, .lucy-gallery img').forEach(image => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lucy-photo-open';
    const label = english ? 'Enlarge photo' : 'Ingrandisci foto';
    button.setAttribute('aria-label', `${label}: ${image.alt}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const hint = document.createElement('span');
    hint.className = 'lucy-photo-hint';
    hint.textContent = `${label} ↗`;
    hint.setAttribute('aria-hidden', 'true');
    image.before(button);
    button.append(image, hint);
    button.addEventListener('click', () => {
      opener = button;
      fullImage.src = image.getAttribute('src');
      fullImage.alt = image.alt;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
      close.focus();
    });
  });
})();
