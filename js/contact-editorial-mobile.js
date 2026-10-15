(() => {
  function enhance() {
    const article = document.querySelector('.contact-editorial-page .contatti-content .article');
    const bar = article?.querySelector('.contact-quick-bar');
    const map = article?.querySelector('.contact-map-section');
    if (!bar || !map) return;
    const english = document.documentElement.lang === 'en';
    const phone = bar.querySelector('.contact-quick-bar__link--phone');
    const directions = bar.querySelector('.contact-quick-bar__link--maps');
    const originalPhone = phone.getAttribute('href');
    const originalLabel = directions.querySelector('span').textContent;
    const media = window.matchMedia('(max-width: 768px)');
    function sync() {
      phone.href = media.matches ? 'tel:+393392668950' : originalPhone;
      directions.querySelector('span').textContent = media.matches ? (english ? 'Directions' : 'Indicazioni') : originalLabel;
    }
    sync();
    media.addEventListener('change', sync);
    const link = document.createElement('a');
    link.className = 'contact-map-external';
    link.href = directions.href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.dataset.track = 'click_google_maps';
    link.textContent = english ? 'Open in Google Maps' : 'Apri in Google Maps';
    map.append(link);
  }
  // The shared script builds the quick-contact bar first.
  if (document.readyState === 'complete') enhance();
  else document.addEventListener('DOMContentLoaded', enhance);
})();
