(() => {
  let english = document.documentElement.lang === 'en';
  if (!english) {
    try {
      english = localStorage.getItem('preferredLanguage') === 'en';
    } catch {
      // The redirect must also work when browser storage is unavailable.
    }
  }

  const target = new URL(english ? '../index-en.html' : '../', location.href);
  const params = new URLSearchParams(location.search);
  if (!params.has('utm_source')) params.set('utm_source', 'qr');
  if (!params.has('utm_medium')) params.set('utm_medium', 'offline');
  if (!params.has('utm_campaign')) params.set('utm_campaign', 'negozio');
  target.search = params.toString();
  location.replace(target.href);
})();
