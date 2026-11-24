(() => {
  const mobile = matchMedia('(max-width: 759px)');
  const intro = document.querySelector('.guide-original-intro');
  const cards = [...document.querySelectorAll('.guide-index-card')];
  const english = document.documentElement.lang === 'en';
  let mobileIntroOpen = false;
  function adapt() {
    intro.open = mobile.matches ? mobileIntroOpen : true;
    cards.forEach(card => {
      if (mobile.matches) {
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
        card.removeAttribute('aria-label');
      } else {
        card.setAttribute('role', 'link');
        card.tabIndex = 0;
        card.setAttribute('aria-label', card.querySelector('a').textContent.trim());
      }
    });
  }
  intro.addEventListener('toggle', () => { if (mobile.matches) mobileIntroOpen = intro.open; });
  cards.forEach(card => card.addEventListener('keydown', event => {
    // Keep the native link default action, without the older card handler activating twice.
    if (mobile.matches && event.target.closest('a')) event.stopImmediatePropagation();
  }, true));
  document.querySelectorAll('.guide-index-section').forEach(section => {
    const back = document.createElement('a');
    back.href = '#guide-groups';
    back.className = 'guide-back-groups';
    back.textContent = english ? '↑ Back to groups' : '↑ Torna ai gruppi';
    section.append(back);
  });
  mobile.addEventListener('change', adapt);
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', adapt, {once: true});
  else adapt();
})();


