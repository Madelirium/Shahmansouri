(function () {
  const ANALYTICS_ID = 'G-3J9NJQF75Y';
  const CONSENT_KEY = 'shahmansouri_cookie_consent_v1';
  let loaded = false;
  let configured = false;

  const DENIED_CONSENT = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  };

  function ensureAnalyticsRuntime() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
  }

  function applyDefaultConsent() {
    ensureAnalyticsRuntime();
    window.gtag('consent', 'default', DENIED_CONSENT);
  }

  function configureAnalytics() {
    if (configured) {
      return;
    }

    configured = true;
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_ID);
  }

  function loadAnalytics() {
    if (loaded) {
      configureAnalytics();
      return;
    }

    loaded = true;
    ensureAnalyticsRuntime();
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    document.head.appendChild(script);
    configureAnalytics();
  }

  function grantAnalytics() {
    applyDefaultConsent();
    ensureAnalyticsRuntime();
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
    loadAnalytics();
  }

  function denyAnalytics() {
    applyDefaultConsent();
    if (loaded) {
      window.gtag('consent', 'update', DENIED_CONSENT);
    }
  }

  function getBaseTrackingPayload() {
    return {
      event_category: 'engagement',
      page_path: window.location.pathname,
      language: document.documentElement.lang
    };
  }

  window.ShahmansouriAnalytics = {
    grant: grantAnalytics,
    deny: denyAnalytics
  };

  function isAnalyticsGranted() {
    try {
      return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
    } catch (error) {
      return false;
    }
  }

  function sanitizeTrackingUrl(href) {
    if (!href) {
      return '';
    }

    const normalizedHref = String(href).trim();
    if (!normalizedHref) {
      return '';
    }

    if (/^tel:/i.test(normalizedHref) || /^mailto:/i.test(normalizedHref)) {
      const separatorIndex = normalizedHref.search(/[?#]/);
      return separatorIndex >= 0 ? normalizedHref.slice(0, separatorIndex) : normalizedHref;
    }

    try {
      const url = new URL(normalizedHref, window.location.href);
      const isWhatsappLink = /(^|\.)wa\.me$/i.test(url.hostname) || /(^|\.)api\.whatsapp\.com$/i.test(url.hostname);
      url.search = '';
      url.hash = '';

      if (isWhatsappLink) {
        return `${url.origin}${url.pathname}`;
      }

      return `${url.origin}${url.pathname}`;
    } catch (error) {
      const separatorIndex = normalizedHref.search(/[?#]/);
      return separatorIndex >= 0 ? normalizedHref.slice(0, separatorIndex) : normalizedHref;
    }
  }

  function getTrackingLabel(element) {
    const explicitLabel = element.getAttribute('data-track-label') || element.getAttribute('aria-label');
    const rawLabel = explicitLabel || element.textContent || '';
    return rawLabel.replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  function getTrackingAttribute(element, attributeName) {
    if (!(element instanceof Element)) {
      return '';
    }

    const scopedElement = element.closest(`[${attributeName}]`);
    if (!scopedElement) {
      return '';
    }

    return scopedElement.getAttribute(attributeName) || '';
  }

  function buildTrackingPayload(element) {
    const href = 'href' in element ? element.href : '';
    const payload = getBaseTrackingPayload();
    const linkUrl = sanitizeTrackingUrl(href);
    const buttonLabel = getTrackingLabel(element);
    const productName = element.getAttribute('data-product-name');
    const filterName = element.getAttribute('data-filter-name');
    const filterValue = element.getAttribute('data-filter-value');
    const section = getTrackingAttribute(element, 'data-track-section');
    const qrAction = getTrackingAttribute(element, 'data-qr-action');
    const languageTarget = getTrackingAttribute(element, 'data-language-target')
      || getTrackingAttribute(element, 'data-language-choice');

    if (linkUrl) {
      payload.link_url = linkUrl;
    }

    if (buttonLabel) {
      payload.button_label = buttonLabel;
    }

    if (productName) {
      payload.product_name = productName;
    }

    if (filterName) {
      payload.filter_name = filterName;
    }

    if (filterValue) {
      payload.filter_value = filterValue;
    }

    if (section) {
      payload.section = section;
    }

    if (qrAction) {
      payload.qr_action = qrAction;
    }

    if (languageTarget) {
      payload.language_target = languageTarget;
    }

    return payload;
  }

  function sendTrackingEvent(eventName, payload) {
    if (!eventName || typeof window.gtag !== 'function' || !isAnalyticsGranted()) {
      return;
    }

    window.gtag('event', eventName, payload);
  }

  function trackEvent(eventName, extraPayload) {
    const payload = Object.assign({}, getBaseTrackingPayload(), extraPayload || {});

    if (payload.link_url) {
      payload.link_url = sanitizeTrackingUrl(payload.link_url);
    }

    sendTrackingEvent(eventName, payload);
  }

  function getTrackingEventNames(element) {
    const eventNames = [
      element.getAttribute('data-track'),
      element.getAttribute('data-track-secondary')
    ].filter(Boolean);

    return Array.from(new Set(eventNames));
  }

  function trackElement(element) {
    getTrackingEventNames(element).forEach(function (eventName) {
      sendTrackingEvent(eventName, buildTrackingPayload(element));
    });
  }

  function getTrackableTarget(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest('[data-track]');
  }

  function getControlTrackingValue(element) {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        return element.checked ? element.value || 'checked' : 'unchecked';
      }

      return element.value;
    }

    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
      return element.value;
    }

    return '';
  }

  function handleTrackableClick(event) {
    const trackable = getTrackableTarget(event.target);
    if (!trackable) {
      return;
    }

    trackElement(trackable);
  }

  function handleTrackableChange(event) {
    const trackable = getTrackableTarget(event.target);
    if (!trackable) {
      return;
    }

    if (!(trackable instanceof HTMLInputElement || trackable instanceof HTMLSelectElement || trackable instanceof HTMLTextAreaElement)) {
      return;
    }

    const currentValue = getControlTrackingValue(trackable);
    const previousValue = trackable.dataset.trackLastValue || '';
    if (currentValue === previousValue) {
      return;
    }

    trackable.dataset.trackLastValue = currentValue;
    const isChoiceControl =
      trackable instanceof HTMLInputElement
      && (trackable.type === 'checkbox' || trackable.type === 'radio');

    if (!isChoiceControl) {
      if (currentValue) {
        trackable.setAttribute('data-filter-value', currentValue);
      } else {
        trackable.removeAttribute('data-filter-value');
      }
    }
    trackElement(trackable);
  }

  if (!window.__shTrackingInitialized) {
    document.addEventListener('click', handleTrackableClick);
    document.addEventListener('change', handleTrackableChange);
    window.__shTrackingInitialized = true;
  }

  window.ShahmansouriAnalytics.sanitizeTrackingUrl = sanitizeTrackingUrl;
  window.ShahmansouriAnalytics.trackElement = trackElement;
  window.ShahmansouriAnalytics.trackEvent = trackEvent;
  applyDefaultConsent();

  try {
    if (window.localStorage.getItem(CONSENT_KEY) === 'accepted') {
      grantAnalytics();
    } else {
      denyAnalytics();
    }
  } catch (error) {
    denyAnalytics();
  }
})();
