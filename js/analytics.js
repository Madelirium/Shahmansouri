(function () {
  const ANALYTICS_ID = 'G-3J9NJQF75Y';
  const CONSENT_KEY = 'shahmansouri_cookie_consent_v1';
  let loaded = false;

  function ensureAnalyticsRuntime() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
  }

  function loadAnalytics() {
    if (loaded) {
      return;
    }

    loaded = true;
    ensureAnalyticsRuntime();

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_ID);
  }

  function grantAnalytics() {
    loadAnalytics();

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  function denyAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  window.ShahmansouriAnalytics = {
    grant: grantAnalytics,
    deny: denyAnalytics
  };

  try {
    if (window.localStorage.getItem(CONSENT_KEY) === 'accepted') {
      grantAnalytics();
    }
  } catch (error) {
    // Ignore storage access issues.
  }
})();
