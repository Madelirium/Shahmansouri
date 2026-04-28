const COOKIE_CONSENT_KEY = 'shahmansouri_cookie_consent_v1';
const STORE_MAP_URL = 'https://maps.app.goo.gl/zpeoCrwWZPhkYZ7K6';
const isEnglishPage = document.documentElement.lang.toLowerCase().startsWith('en');

const siteText = isEnglishPage
  ? {
      cookieTitle: 'Cookies and external content',
      cookieText: 'This site uses essential technical tools and, with your consent, loads Google Analytics and Google Maps, which may install third-party cookies.',
      cookieInfo: 'Cookie policy',
      privacyInfo: 'Privacy policy',
      manageCookies: 'Manage cookies',
      cookieReject: 'Reject',
      cookieAccept: 'Accept',
      mailFeedback: 'Opening your email app with the pre-filled message.',
      mapsLabel: 'Maps',
      phoneLabel: 'Call',
      whatsappLabel: 'WhatsApp'
    }
    : {
      cookieTitle: 'Cookie e contenuti esterni',
      cookieText: 'Questo sito usa strumenti tecnici essenziali e, con il tuo consenso, carica Google Analytics e Google Maps, che possono installare cookie di terze parti.',
      cookieInfo: 'Informativa cookie',
      privacyInfo: 'Privacy policy',
      manageCookies: 'Gestisci cookie',
      cookieReject: 'Rifiuta',
      cookieAccept: 'Accetta',
      mailFeedback: 'Sto aprendo il tuo client email con il messaggio precompilato.',
      mapsLabel: 'Mappa',
      phoneLabel: 'Chiama',
      whatsappLabel: 'WhatsApp'
    };

function getPolicyPrefix() {
  return window.location.pathname.includes('/catalogo/') ? '../' : '';
}

function getCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (error) {
    return null;
  }
}

function setCookieConsent(value) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (error) {
    // ignore storage failures
  }
}

function injectFloatingActions() {
  if (document.querySelector('.floating-actions')) {
    return;
  }

  const actions = document.createElement('aside');
  actions.className = 'floating-actions';
  actions.setAttribute('aria-label', isEnglishPage ? 'Quick contacts' : 'Contatti rapidi');
  actions.innerHTML = `
    <a href="tel:+390458013280" class="floating-action floating-phone" aria-label="${siteText.phoneLabel}" title="${siteText.phoneLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.phoneLabel}</span>
    </a>
    <a href="https://wa.me/393392668950" class="floating-action floating-whatsapp" target="_blank" rel="noopener" aria-label="${siteText.whatsappLabel}" title="${siteText.whatsappLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.whatsappLabel}</span>
    </a>
    <a href="${STORE_MAP_URL}" class="floating-action floating-maps" target="_blank" rel="noopener" aria-label="${siteText.mapsLabel}" title="${siteText.mapsLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2c4.14 0 7.5 3.23 7.5 7.22 0 4.72-5.3 10.36-7.5 12.5-2.2-2.14-7.5-7.78-7.5-12.5C4.5 5.23 7.86 2 12 2Zm0 4.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.mapsLabel}</span>
    </a>
  `;

  document.body.appendChild(actions);
}

function setupBackToTop() {
  if (document.querySelector('.catalog-back-to-top') || document.querySelector('.site-back-to-top')) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'site-back-to-top';
  button.setAttribute('aria-label', isEnglishPage ? 'Back to top' : 'Torna in alto');
  button.innerHTML = '&uarr;';

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(button);

  function updateVisibility() {
    const shouldShow = window.innerWidth <= 768 && window.scrollY > 260;
    button.classList.toggle('is-visible', shouldShow);
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  updateVisibility();
}

function injectCookieBanner() {
  if (document.querySelector('[data-cookie-banner]')) {
    return;
  }

  const policyPrefix = getPolicyPrefix();
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.dataset.cookieBanner = '';
  banner.hidden = true;
  banner.innerHTML = `
    <div class="cookie-banner__content">
      <div>
        <strong class="cookie-banner__title">${siteText.cookieTitle}</strong>
        <p class="cookie-banner__text">${siteText.cookieText}</p>
      </div>
      <div class="cookie-banner__actions">
        <a class="cookie-banner__link" href="${policyPrefix}${isEnglishPage ? 'cookie-policy-en.html' : 'cookie-policy.html'}">${siteText.cookieInfo}</a>
        <button type="button" class="cookie-banner__button cookie-banner__button--secondary" data-manage-cookies>${siteText.manageCookies}</button>
        <button type="button" class="cookie-banner__button cookie-banner__button--secondary" data-reject-cookies>${siteText.cookieReject}</button>
        <button type="button" class="cookie-banner__button" data-accept-cookies>${siteText.cookieAccept}</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
}

function showCookieBanner() {
  const banner = document.querySelector('[data-cookie-banner]');
  if (banner) {
    banner.hidden = false;
  }
}

function hideCookieBanner() {
  const banner = document.querySelector('[data-cookie-banner]');
  if (banner) {
    banner.hidden = true;
  }
}

function loadMapIfNeeded() {
  document.querySelectorAll('.lazy-map').forEach(function (map) {
    const src = map.dataset.src;
    if (src && !map.src) {
      map.src = src;
    }
    map.hidden = false;
  });

  document.querySelectorAll('[data-map-placeholder]').forEach(function (placeholder) {
    placeholder.hidden = true;
  });
}

function unloadMap() {
  document.querySelectorAll('.lazy-map').forEach(function (map) {
    map.hidden = true;
    map.removeAttribute('src');
  });

  document.querySelectorAll('[data-map-placeholder]').forEach(function (placeholder) {
    placeholder.hidden = false;
  });
}

function applyCookieConsent(state) {
  if (state === 'accepted') {
    hideCookieBanner();
    loadMapIfNeeded();
    if (window.ShahmansouriAnalytics) {
      window.ShahmansouriAnalytics.grant();
    }
    return;
  }
  unloadMap();
  if (window.ShahmansouriAnalytics) {
    window.ShahmansouriAnalytics.deny();
  }

  if (state === 'rejected') {
    hideCookieBanner();
    return;
  }

  showCookieBanner();
}

function setupCookieButtons() {
  document.querySelectorAll('[data-accept-cookies]').forEach(function (button) {
    button.addEventListener('click', function () {
      setCookieConsent('accepted');
      applyCookieConsent('accepted');
    });
  });

  document.querySelectorAll('[data-reject-cookies]').forEach(function (button) {
    button.addEventListener('click', function () {
      setCookieConsent('rejected');
      applyCookieConsent('rejected');
    });
  });

  document.querySelectorAll('[data-manage-cookies]').forEach(function (button) {
    button.addEventListener('click', function () {
      showCookieBanner();
    });
  });
}

function injectFooterUtilityLinks() {
  const policyPrefix = getPolicyPrefix();
  const target = document.querySelector('.site-footer-global__grid > div:last-child, .footer-grid > div:last-child');
  if (!target || target.querySelector('[data-footer-utility-links]')) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-utility-links';
  wrapper.dataset.footerUtilityLinks = '';
  wrapper.innerHTML = `
    <p><a href="${policyPrefix}${isEnglishPage ? 'cookie-policy-en.html' : 'cookie-policy.html'}">${siteText.cookieInfo}</a></p>
    <p><a href="${policyPrefix}${isEnglishPage ? 'privacy-policy-en.html' : 'privacy-policy.html'}">${siteText.privacyInfo}</a></p>
    <p><button type="button" class="footer-link-button" data-manage-cookies>${siteText.manageCookies}</button></p>
  `;

  const copyright = target.querySelector('.footer-copyright');
  if (copyright) {
    target.insertBefore(wrapper, copyright);
  } else {
    target.appendChild(wrapper);
  }
}

function setupContactForms() {
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get('nome') || formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const message = String(formData.get('messaggio') || formData.get('message') || '').trim();
      const subject = encodeURIComponent(
        isEnglishPage ? `Website enquiry - ${name}` : `Richiesta dal sito - ${name}`
      );
      const body = encodeURIComponent(
        isEnglishPage
          ? `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
          : `Nome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}`
      );

      let feedback = form.querySelector('[data-form-feedback]');
      if (!feedback) {
        feedback = document.createElement('p');
        feedback.dataset.formFeedback = '';
        feedback.className = 'form-feedback';
        form.appendChild(feedback);
      }

      feedback.textContent = siteText.mailFeedback;
  window.location.href = `mailto:shahmansouri@tiscali.it?subject=${subject}&body=${body}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  const page = path.split('/').pop();

  document.querySelectorAll('.nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === page || (href === 'index.html' && page === '')) {
      link.classList.add('active');
    }
  });

  injectFloatingActions();
  setupBackToTop();
  injectCookieBanner();
  injectFooterUtilityLinks();
  setupCookieButtons();
  setupContactForms();
  applyCookieConsent(getCookieConsent());
  setupMobileNav();
});

function setupMobileNav() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) {
    return;
  }

  const mobileNavLabel = isEnglishPage
    ? {
        open: 'Open main menu',
        close: 'Close main menu'
      }
    : {
        open: 'Apri menu principale',
        close: 'Chiudi menu principale'
      };

  toggle.setAttribute('aria-label', mobileNavLabel.open);

  function closeNav() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', mobileNavLabel.open);
  }

  function openNav() {
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', mobileNavLabel.close);
  }

  toggle.addEventListener('click', function () {
    const isOpen = document.body.classList.contains('nav-open');
    if (isOpen) {
      closeNav();
      return;
    }

    openNav();
  });

  document.addEventListener('click', function (event) {
    if (window.innerWidth > 768 || !document.body.classList.contains('nav-open')) {
      return;
    }

    if (nav.contains(event.target) || toggle.contains(event.target)) {
      return;
    }

    closeNav();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
      toggle.focus();
    }
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        closeNav();
      }
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });
}


