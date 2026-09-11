const COOKIE_CONSENT_KEY = 'shahmansouri_cookie_consent_v1';
const STORE_MAP_URL = 'https://maps.app.goo.gl/zpeoCrwWZPhkYZ7K6';
const isEnglishPage = document.documentElement.lang.toLowerCase().startsWith('en');

const siteText = isEnglishPage
  ? {
      cookieTitle: 'Cookies and external content',
      cookieText: 'This site uses essential technical tools and, with your consent, loads Google Analytics and Google Maps, which may install third-party cookies.',
      cookieInfo: 'Cookie policy',
      privacyInfo: 'Privacy policy',
      returnsInfo: 'Returns and refunds',
      shippingInfo: 'Shipping and delivery',
      termsInfo: 'Terms of sale',
      contactsInfo: 'Contacts',
      changeLanguage: 'Change language',
      manageCookies: 'Manage cookies',
      cookieReject: 'Reject',
      cookieAccept: 'Accept',
      mailFeedback: 'Opening your email app with the pre-filled message.',
      mapsLabel: 'Maps',
      phoneLabel: 'Call',
      whatsappLabel: 'WhatsApp',
      instagramLabel: 'Instagram',
      quickContactsLabel: 'Quick contacts'
    }
    : {
      cookieTitle: 'Cookie e contenuti esterni',
      cookieText: 'Questo sito usa strumenti tecnici essenziali e, con il tuo consenso, carica Google Analytics e Google Maps, che possono installare cookie di terze parti.',
      cookieInfo: 'Informativa cookie',
      privacyInfo: 'Privacy policy',
      returnsInfo: 'Resi e rimborsi',
      shippingInfo: 'Spedizioni e consegna',
      termsInfo: 'Condizioni di vendita',
      contactsInfo: 'Contatti',
      changeLanguage: 'Change language',
      manageCookies: 'Gestisci cookie',
      cookieReject: 'Rifiuta',
      cookieAccept: 'Accetta',
      mailFeedback: 'Sto aprendo il tuo client email con il messaggio precompilato.',
      mapsLabel: 'Mappa',
      phoneLabel: 'Chiama',
      whatsappLabel: 'WhatsApp',
      instagramLabel: 'Instagram',
      quickContactsLabel: 'Contatti rapidi'
    };

function getPolicyPrefix() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length && pathParts[pathParts.length - 1].includes('.')) {
    pathParts.pop();
  }
  return '../'.repeat(pathParts.length);
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

function setElementInertState(element, shouldBeInert) {
  if (!element) {
    return;
  }

  if (shouldBeInert) {
    element.setAttribute('inert', '');
    element.setAttribute('aria-hidden', 'true');
    element.inert = true;
    return;
  }

  element.removeAttribute('inert');
  element.removeAttribute('aria-hidden');
  element.inert = false;
}

function injectFloatingActions() {
  if (document.querySelector('.floating-actions')) {
    return;
  }

  const actions = document.createElement('aside');
  actions.className = 'floating-actions';
  actions.setAttribute('aria-label', isEnglishPage ? 'Quick contacts' : 'Contatti rapidi');
  actions.innerHTML = `
    <a href="tel:+390458013280" class="floating-action floating-phone" aria-label="${siteText.phoneLabel}" title="${siteText.phoneLabel}" data-track="click_phone" data-track-label="${siteText.phoneLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.phoneLabel}</span>
    </a>
    <a href="https://wa.me/393392668950" class="floating-action floating-whatsapp" target="_blank" rel="noopener" aria-label="${siteText.whatsappLabel}" title="${siteText.whatsappLabel}" data-track="click_whatsapp" data-track-label="${siteText.whatsappLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.whatsappLabel}</span>
    </a>
    <a href="https://www.instagram.com/shahmansouri_tappeti_persiani/" class="floating-action floating-instagram" target="_blank" rel="noopener" aria-label="${siteText.instagramLabel}" title="${siteText.instagramLabel}" data-track="click_social_instagram" data-track-label="${siteText.instagramLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.4 1.7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Z" fill="currentColor"></path>
      </svg>
      <span class="sr-only">${siteText.instagramLabel}</span>
    </a>
    <a href="${STORE_MAP_URL}" class="floating-action floating-maps" target="_blank" rel="noopener" aria-label="${siteText.mapsLabel}" title="${siteText.mapsLabel}" data-track="click_google_maps" data-track-label="${siteText.mapsLabel}">
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
        <button type="button" class="cookie-banner__button cookie-banner__button--primary" data-accept-cookies>${siteText.cookieAccept}</button>
        <div class="cookie-banner__secondary-actions">
          <a class="cookie-banner__link" href="${policyPrefix}${isEnglishPage ? 'cookie-policy-en.html' : 'cookie-policy.html'}">${siteText.cookieInfo}</a>
          <button type="button" class="cookie-banner__button cookie-banner__button--secondary" data-manage-cookies>${siteText.manageCookies}</button>
          <button type="button" class="cookie-banner__button cookie-banner__button--secondary" data-reject-cookies>${siteText.cookieReject}</button>
        </div>
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
    button.addEventListener('click', function (event) {
      event.preventDefault();
      showCookieBanner();
    });
  });
}

function setupLanguageOverlayAccessibility() {
  const overlay = document.getElementById('languageOverlay');
  const page = document.querySelector('.page');
  if (!overlay || !page) {
    return;
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function getFocusableElements() {
    return Array.from(overlay.querySelectorAll(focusableSelector)).filter(function (element) {
      return !element.hidden && element.getAttribute('aria-hidden') !== 'true';
    });
  }

  function syncOverlayState() {
    const isOpen = !overlay.hidden && overlay.getAttribute('aria-hidden') !== 'true';
    setElementInertState(page, isOpen);
  }

  overlay.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab' || overlay.hidden) {
      return;
    }

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  const observer = new MutationObserver(syncOverlayState);
  observer.observe(overlay, {
    attributes: true,
    attributeFilter: ['hidden', 'aria-hidden']
  });

  syncOverlayState();
}

function setupDesktopDropdowns() {
  const nav = document.querySelector('.nav');
  if (!nav) {
    return;
  }

  const dropdowns = Array.from(nav.querySelectorAll('.dropdown'));
  if (!dropdowns.length) {
    return;
  }

  const isDesktopViewport = function () {
    return window.innerWidth > 768;
  };

  const closeAllDropdowns = function (exceptDropdown) {
    dropdowns.forEach(function (dropdown) {
      if (exceptDropdown && dropdown === exceptDropdown) {
        return;
      }

      dropdown.classList.remove('is-open');
      const trigger = dropdown.querySelector(':scope > .nav-parent');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  dropdowns.forEach(function (dropdown, index) {
    const currentTrigger = dropdown.querySelector(':scope > .nav-parent');
    const submenu = dropdown.querySelector(':scope > .submenu');
    if (!currentTrigger || !submenu) {
      return;
    }

    let trigger = currentTrigger;
    if (trigger.tagName !== 'BUTTON') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = trigger.className;
      button.innerHTML = trigger.innerHTML;
      trigger.replaceWith(button);
      trigger = button;
    }

    if (!submenu.id) {
      submenu.id = 'submenu-iran-' + (index + 1);
    }

    trigger.setAttribute('aria-controls', submenu.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');

    const firstSubmenuLink = submenu.querySelector('a[href]');

    function setExpanded(isExpanded) {
      dropdown.classList.toggle('is-open', isExpanded);
      trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }

    trigger.addEventListener('click', function (event) {
      if (!isDesktopViewport()) {
        event.preventDefault();
        setExpanded(trigger.getAttribute('aria-expanded') !== 'true');
        return;
      }

      event.preventDefault();
      const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeAllDropdowns(dropdown);
      setExpanded(shouldOpen);
    });

    trigger.addEventListener('keydown', function (event) {
      if (!isDesktopViewport()) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
        closeAllDropdowns(dropdown);
        setExpanded(shouldOpen);
        if (shouldOpen && firstSubmenuLink) {
          firstSubmenuLink.focus();
        }
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        closeAllDropdowns(dropdown);
        setExpanded(true);
        if (firstSubmenuLink) {
          firstSubmenuLink.focus();
        }
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        setExpanded(false);
      }
    });

    dropdown.addEventListener('focusin', function () {
      if (!isDesktopViewport()) {
        return;
      }

      setExpanded(true);
    });

    dropdown.addEventListener('focusout', function () {
      if (!isDesktopViewport()) {
        return;
      }

      window.setTimeout(function () {
        if (!dropdown.contains(document.activeElement)) {
          setExpanded(false);
        }
      }, 0);
    });

    submenu.addEventListener('keydown', function (event) {
      if (!isDesktopViewport() || event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      setExpanded(false);
      trigger.focus();
    });
  });

  document.addEventListener('click', function (event) {
    if (!isDesktopViewport() || nav.contains(event.target)) {
      return;
    }

    closeAllDropdowns();
  });

  window.addEventListener('resize', function () {
    closeAllDropdowns();
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
    <p><a href="${policyPrefix}${isEnglishPage ? 'returns-and-refunds.html' : 'resi-e-rimborsi.html'}">${siteText.returnsInfo}</a></p>
    <p><a href="${policyPrefix}${isEnglishPage ? 'shipping-and-delivery.html' : 'spedizioni-e-consegna.html'}">${siteText.shippingInfo}</a></p>
    <p><a href="${policyPrefix}${isEnglishPage ? 'terms-of-sale.html' : 'condizioni-di-vendita.html'}">${siteText.termsInfo}</a></p>
    <p><button type="button" class="footer-link-button" data-manage-cookies>${siteText.manageCookies}</button></p>
  `;

  const copyright = target.querySelector('.footer-copyright');
  if (copyright) {
    target.insertBefore(wrapper, copyright);
  } else {
    target.appendChild(wrapper);
  }
}

function getFooterLanguageControl(policyPrefix) {
  const languageOverlay = document.getElementById('languageOverlay');
  if (languageOverlay) {
    return `<button type="button" class="footer-language-trigger" data-open-language-overlay>${siteText.changeLanguage}</button>`;
  }

  const alternateHref = isEnglishPage
    ? document.querySelector('link[rel="alternate"][hreflang="it"]')?.getAttribute('href')
    : document.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href');

  if (alternateHref) {
    return `<a href="${alternateHref}" data-track="change_language" data-track-label="${siteText.changeLanguage}" data-language-target="${isEnglishPage ? 'it' : 'en'}">${siteText.changeLanguage}</a>`;
  }

  const fallbackHref = `${policyPrefix}${isEnglishPage ? 'index.html' : 'index-en.html'}`;
  return `<a href="${fallbackHref}" data-track="change_language" data-track-label="${siteText.changeLanguage}" data-language-target="${isEnglishPage ? 'it' : 'en'}">${siteText.changeLanguage}</a>`;
}

function normalizeFooterLayout() {
  const footer = document.querySelector('.site-footer-global, .site-footer');
  if (!footer) {
    return;
  }

  footer.classList.add('site-footer-global--compact');

  if (footer.querySelector('.site-footer-global__meta-lines')) {
    return;
  }

  const grid = footer.querySelector('.site-footer-global__grid, .footer-grid');
  if (!grid) {
    return;
  }

  const policyPrefix = getPolicyPrefix();
  const contactHref = `${policyPrefix}${isEnglishPage ? 'contacts-en.html' : 'contatti.html'}`;
  const phoneHref = 'tel:+390458013280';
  const emailHref = 'mailto:shahmansouri@tiscali.it';
  const copyrightNode = footer.querySelector('.footer-copyright');
  const copyrightText = copyrightNode ? copyrightNode.textContent.trim() : '\u00A9 2026 Shahmansouri';

  grid.innerHTML = `
    <div class="site-footer-global__meta-lines">
      <p class="site-footer-global__contact-line">
        <span class="site-footer-global__address">Stradone Arcidiacono Pacifico, 14 - Verona</span>
        <span aria-hidden="true">|</span>
        <a href="${phoneHref}" data-track="click_phone">+39 045 801 3280</a>
        <span aria-hidden="true">|</span>
        <a href="${emailHref}" data-track="click_email">shahmansouri@tiscali.it</a>
        <span aria-hidden="true">|</span>
        <a href="${contactHref}" data-track="click_contact_page">${siteText.contactsInfo}</a>
      </p>
      <div class="site-footer-global__utility-line footer-utility-links" data-footer-utility-links>
        ${getFooterLanguageControl(policyPrefix)}
        <span aria-hidden="true">|</span>
        <a href="${policyPrefix}${isEnglishPage ? 'cookie-policy-en.html' : 'cookie-policy.html'}">${siteText.cookieInfo}</a>
        <span aria-hidden="true">|</span>
        <a href="${policyPrefix}${isEnglishPage ? 'privacy-policy-en.html' : 'privacy-policy.html'}">${siteText.privacyInfo}</a>
        <span aria-hidden="true">|</span>
        <a href="${policyPrefix}${isEnglishPage ? 'returns-and-refunds.html' : 'resi-e-rimborsi.html'}">${siteText.returnsInfo}</a>
        <span aria-hidden="true">|</span>
        <a href="${policyPrefix}${isEnglishPage ? 'shipping-and-delivery.html' : 'spedizioni-e-consegna.html'}">${siteText.shippingInfo}</a>
        <span aria-hidden="true">|</span>
        <a href="${policyPrefix}${isEnglishPage ? 'terms-of-sale.html' : 'condizioni-di-vendita.html'}">${siteText.termsInfo}</a>
        <span aria-hidden="true">|</span>
        <button type="button" class="footer-link-button" data-manage-cookies>${siteText.manageCookies}</button>
        <span aria-hidden="true">|</span>
        <span class="footer-copyright">${copyrightText}</span>
      </div>
    </div>
  `;
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
      if (window.ShahmansouriAnalytics && typeof window.ShahmansouriAnalytics.trackEvent === 'function') {
        window.ShahmansouriAnalytics.trackEvent('click_email', {
          button_label: isEnglishPage ? 'Contact form email' : 'Email dal modulo contatti',
          link_url: 'mailto:shahmansouri@tiscali.it',
          section: 'contact_form'
        });
      }
      window.location.href = `mailto:shahmansouri@tiscali.it?subject=${subject}&body=${body}`;
    });
  });
}

function initClickableGuideCards() {
  const cards = document.querySelectorAll('.guide-index-page .guide-index-card');
  if (!cards.length) {
    return;
  }

  cards.forEach(function (card) {
    const primaryLink = card.querySelector('a[href]');
    if (!primaryLink) {
      return;
    }

    if (!card.hasAttribute('tabindex')) {
      card.tabIndex = 0;
    }

    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', primaryLink.textContent.trim());

    card.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) {
        return;
      }

      window.location.href = primaryLink.href;
    });

    card.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      window.location.href = primaryLink.href;
    });
  });
}

function setupHomeMobileSliderIndicators() {
  const tracks = Array.from(document.querySelectorAll('[data-home-mobile-slider]'));
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');

  tracks.forEach(function (track) {
    const cards = Array.from(track.children);
    if (cards.length < 2 || track.nextElementSibling?.classList.contains('home-mobile-slider-dots')) {
      return;
    }

    const dots = document.createElement('div');
    dots.className = 'home-mobile-slider-dots';
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', isEnglish ? 'Slider position' : 'Posizione nello scorrimento');

    const buttons = cards.map(function (card, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', (isEnglish ? 'Show item ' : 'Mostra elemento ') + (index + 1));
      button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      button.addEventListener('click', function () {
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetLeft = Math.max(0, Math.min(
          track.scrollLeft + cardRect.left - trackRect.left,
          track.scrollWidth - track.clientWidth
        ));
        buttons.forEach(function (dot, dotIndex) {
          dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
        });
        track.scrollTo({
          left: targetLeft,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      });
      dots.appendChild(button);
      return button;
    });

    let updatePending = false;
    function updateIndicator() {
      updatePending = false;
      const trackLeft = track.getBoundingClientRect().left;
      const activeIndex = cards.reduce(function (closestIndex, card, index) {
        const currentDistance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        const closestCard = cards[closestIndex];
        const closestDistance = Math.abs(closestCard.getBoundingClientRect().left - trackLeft);
        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);

      buttons.forEach(function (button, index) {
        button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
      });
    }

    track.addEventListener('scroll', function () {
      if (!updatePending) {
        updatePending = true;
        window.requestAnimationFrame(updateIndicator);
      }
    }, { passive: true });

    track.after(dots);
  });
}

function setupMobileContactPage() {
  const article = document.querySelector('.contatti-content .article');
  if (!article) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const quickBar = document.createElement('nav');
  quickBar.className = 'contact-quick-bar';
  quickBar.setAttribute('aria-label', siteText.quickContactsLabel);
  quickBar.innerHTML = `
    <a class="contact-quick-bar__link contact-quick-bar__link--phone" href="tel:+390458013280" data-track="click_phone" aria-label="${siteText.phoneLabel}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02Z" fill="currentColor"></path></svg>
      <span>${siteText.phoneLabel}</span>
    </a>
    <a class="contact-quick-bar__link contact-quick-bar__link--whatsapp" href="https://wa.me/393392668950" target="_blank" rel="noopener" data-track="click_whatsapp" aria-label="WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z" fill="currentColor"></path></svg>
      <span>WhatsApp</span>
    </a>
    <a class="contact-quick-bar__link contact-quick-bar__link--instagram" href="https://www.instagram.com/shahmansouri_tappeti_persiani/" target="_blank" rel="noopener" data-track="click_social_instagram" aria-label="Instagram">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.4 1.7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Z" fill="currentColor"></path></svg>
      <span>Instagram</span>
    </a>
    <a class="contact-quick-bar__link contact-quick-bar__link--maps" href="${STORE_MAP_URL}" target="_blank" rel="noopener" data-track="click_google_maps" aria-label="Google Maps">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c4.14 0 7.5 3.23 7.5 7.22 0 4.72-5.3 10.36-7.5 12.5-2.2-2.14-7.5-7.78-7.5-12.5C4.5 5.23 7.86 2 12 2Zm0 4.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor"></path></svg>
      <span>Maps</span>
    </a>
  `;
  article.appendChild(quickBar);
  const collapsibles = Array.from(article.querySelectorAll('.contact-mobile-collapsible'));

  collapsibles.forEach(function (content, index) {
    const button = document.createElement('button');
    const contentId = 'contact-mobile-section-' + (index + 1);
    content.id = contentId;
    button.type = 'button';
    button.className = 'contact-mobile-collapsible__toggle';
    button.setAttribute('aria-controls', contentId);
    button.innerHTML = `<span>${content.dataset.contactMobileLabel}</span><span class="contact-mobile-collapsible__icon" aria-hidden="true">+</span>`;
    content.before(button);

    function setExpanded(expanded) {
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      content.hidden = !expanded;
      content.classList.toggle('is-open', expanded);
      const icon = button.querySelector('.contact-mobile-collapsible__icon');
      if (icon) {
        icon.textContent = expanded ? '\u2212' : '+';
      }
    }

    button.addEventListener('click', function () {
      setExpanded(button.getAttribute('aria-expanded') !== 'true');
    });

    function syncCollapsible() {
      button.hidden = !mobileQuery.matches;
      setExpanded(!mobileQuery.matches);
    }

    syncCollapsible();
    mobileQuery.addEventListener('change', syncCollapsible);
  });

  const directSection = article.querySelector('.contact-direct-section');
  const contactDetails = article.querySelector('.contact-details');
  const mapSection = article.querySelector('.contact-map-section');
  const servicesSection = article.querySelector('.contact-services-section');
  const servicesToggle = servicesSection ? servicesSection.previousElementSibling : null;
  if (directSection && contactDetails && mapSection && servicesSection && servicesToggle) {
    const directOriginalPosition = document.createComment('contact-direct-section-position');
    const mapOriginalPosition = document.createComment('contact-map-section-position');
    const servicesOriginalPosition = document.createComment('contact-services-section-position');
    directSection.before(directOriginalPosition);
    mapSection.before(mapOriginalPosition);
    servicesToggle.before(servicesOriginalPosition);

    function syncDirectSectionPosition() {
      if (mobileQuery.matches) {
        contactDetails.after(quickBar);
        quickBar.after(mapSection);
        mapSection.after(directSection);
        directSection.after(servicesToggle);
        servicesToggle.after(servicesSection);
      } else {
        article.appendChild(quickBar);
        servicesOriginalPosition.after(servicesToggle);
        servicesToggle.after(servicesSection);
        mapOriginalPosition.after(mapSection);
        directOriginalPosition.after(directSection);
      }
    }

    syncDirectSectionPosition();
    mobileQuery.addEventListener('change', syncDirectSectionPosition);
  }

  const gallery = article.querySelector('[data-contact-gallery-slider]');
  if (!gallery || gallery.children.length < 2) {
    return;
  }

  const figures = Array.from(gallery.children);
  const dots = document.createElement('div');
  dots.className = 'contact-gallery-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', isEnglishPage ? 'Photo gallery position' : 'Posizione nella galleria fotografica');

  const buttons = figures.map(function (figure, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', (isEnglishPage ? 'Show photo ' : 'Mostra foto ') + (index + 1));
    button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
    button.addEventListener('click', function () {
      gallery.scrollTo({
        left: figure.offsetLeft - gallery.offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
    dots.appendChild(button);
    return button;
  });

  let updatePending = false;
  gallery.addEventListener('scroll', function () {
    if (updatePending) {
      return;
    }
    updatePending = true;
    window.requestAnimationFrame(function () {
      updatePending = false;
      const activeIndex = figures.reduce(function (closestIndex, figure, index) {
        const distance = Math.abs(figure.offsetLeft - gallery.offsetLeft - gallery.scrollLeft);
        const closest = figures[closestIndex];
        const closestDistance = Math.abs(closest.offsetLeft - gallery.offsetLeft - gallery.scrollLeft);
        return distance < closestDistance ? index : closestIndex;
      }, 0);
      buttons.forEach(function (button, index) {
        button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
      });
    });
  }, { passive: true });

  gallery.after(dots);
}

function setupLocalHubMobilePage() {
  const page = document.querySelector('.local-hub-page');
  if (!page || page.dataset.mobileHubReady === 'true') {
    return;
  }
  page.dataset.mobileHubReady = 'true';
  if (page.classList.contains('local-hub-redesign')) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const heroGrid = page.querySelector('.local-hero__grid');
  const heroCopy = heroGrid && heroGrid.firstElementChild;
  const heroMedia = heroGrid && heroGrid.querySelector('.local-hero__media');
  const heroCta = heroCopy && heroCopy.querySelector('.local-cta');
  if (heroCopy && heroMedia && heroCta) {
    const mediaPosition = document.createComment('local-hub-media-position');
    const ctaPosition = document.createComment('local-hub-cta-position');
    heroMedia.before(mediaPosition);
    heroCta.before(ctaPosition);

    function syncHeroOrder() {
      if (mobileQuery.matches) {
        const firstParagraph = heroCopy.querySelector('p');
        firstParagraph.after(heroMedia);
        heroMedia.after(heroCta);
      } else {
        ctaPosition.after(heroCta);
        mediaPosition.after(heroMedia);
      }
    }
    syncHeroOrder();
    mobileQuery.addEventListener('change', syncHeroOrder);
  }

  const overview = page.querySelector('.local-overview__grid');
  if (overview) {
    overview.setAttribute('data-home-mobile-slider', '');
    setupHomeMobileSliderIndicators();
  }

  const sectionIds = ['lavaggio-tappeti', 'restauro-tappeti', 'primo-orientamento', 'manutenzione-tappeti', 'rug-cleaning', 'rug-restoration', 'initial-guidance', 'rug-maintenance'];
  const sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  const observationSection = page.querySelector('.local-section--editorial:not([id])');
  if (observationSection) {
    observationSection.id = 'rug-observation';
    sections.push(observationSection);
  }
  const sectionExpanders = new Map();
  const sectionControls = [];
  const shortSectionTitles = isEnglishPage
    ? {
        'rug-cleaning': 'Rug cleaning',
        'rug-restoration': 'Rug restoration',
        'initial-guidance': 'Initial guidance',
        'rug-maintenance': 'Maintenance and conservation',
        'rug-observation': 'Look at the rug first'
      }
    : {
        'lavaggio-tappeti': 'Lavaggio tappeti',
        'restauro-tappeti': 'Restauro tappeti',
        'primo-orientamento': 'Primo orientamento',
        'manutenzione-tappeti': 'Manutenzione e conservazione',
        'rug-observation': 'Prima si osserva il tappeto'
      };
  sections.forEach(function (section, index) {
    const heading = section.querySelector(':scope > h2');
    if (!heading) {
      return;
    }
    const body = document.createElement('div');
    body.className = 'local-hub-collapsible__body';
    body.id = 'local-hub-section-' + (index + 1);
    while (heading.nextSibling) {
      body.appendChild(heading.nextSibling);
    }
    section.appendChild(body);

    const toggle = document.createElement('button');
    const sectionTitle = heading.textContent.trim();
    section.classList.add('local-hub-collapsible');
    heading.classList.add('local-hub-collapsible__heading');
    toggle.type = 'button';
    toggle.className = 'local-hub-collapsible__toggle';
    toggle.setAttribute('aria-controls', body.id);
    toggle.innerHTML = `<span>${shortSectionTitles[section.id] || sectionTitle}</span><span aria-hidden="true">+</span>`;
    heading.after(toggle);

    function setExpanded(expanded) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.setAttribute('aria-label', `${expanded ? (isEnglishPage ? 'Close' : 'Chiudi') : (isEnglishPage ? 'Open' : 'Apri')} ${sectionTitle}`);
      toggle.lastElementChild.textContent = expanded ? '\u2212' : '+';
      body.hidden = !expanded;
    }
    sectionControls.push({ section: section, setExpanded: setExpanded });
    sectionExpanders.set('#' + section.id, function () {
      if (mobileQuery.matches) {
        sectionControls.forEach(function (control) {
          if (control.section !== section) control.setExpanded(false);
        });
      }
      setExpanded(true);
    });
    toggle.addEventListener('click', function () {
      const shouldExpand = toggle.getAttribute('aria-expanded') !== 'true';
      if (shouldExpand && mobileQuery.matches) {
        sectionControls.forEach(function (control) {
          if (control.section !== section) control.setExpanded(false);
        });
      }
      setExpanded(shouldExpand);
    });
    function syncSection() {
      toggle.hidden = !mobileQuery.matches;
      setExpanded(!mobileQuery.matches);
    }
    syncSection();
    mobileQuery.addEventListener('change', syncSection);
  });

  if (sections.length > 1) {
    const sectionGrid = document.createElement('div');
    sectionGrid.className = 'local-hub-mobile-section-grid';
    sections[0].before(sectionGrid);
    sections.forEach(function (section) {
      sectionGrid.appendChild(section);
    });
  }

  if (overview) {
    overview.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mobileQuery.matches) {
          sectionExpanders.get(link.getAttribute('href'))?.();
        }
      });
    });
  }

  const hero = page.querySelector('.local-hero');
  if (hero && !page.querySelector('.local-hub-mobile-chooser')) {
    const chooser = document.createElement('section');
    chooser.className = 'local-hub-mobile-chooser';
    chooser.setAttribute('aria-labelledby', 'local-hub-mobile-chooser-title');
    chooser.innerHTML = isEnglishPage ? `
      <p class="eyebrow">Choose the right path</p>
      <h2 id="local-hub-mobile-chooser-title">What does your rug need?</h2>
      <div class="local-hub-mobile-chooser__grid">
        <a href="../lavaggio-tappeti-verona/index-en.html" data-track="click_service_lavaggio"><strong>Rug cleaning</strong><span>For dust, stains, odours and a dull pile.</span></a>
        <a href="../restauro-tappeti-verona/index-en.html" data-track="click_service_restauro"><strong>Rug restoration</strong><span>For worn fringes, edges, tears or weakened areas.</span></a>
      </div>
      <a class="local-hub-mobile-chooser__guidance" href="../valutazione-tappeti-verona/index-en.html" data-track="click_service_valutazione"><strong>Let us look at the rug</strong><span>Send a few photographs for an initial indication.</span></a>
    ` : `
      <p class="eyebrow">Scegli il percorso</p>
      <h2 id="local-hub-mobile-chooser-title">Di cosa ha bisogno il tappeto?</h2>
      <div class="local-hub-mobile-chooser__grid">
        <a href="../lavaggio-tappeti-verona/" data-track="click_service_lavaggio"><strong>Lavaggio tappeti</strong><span>Per polvere, macchie, odori e vello spento.</span></a>
        <a href="../restauro-tappeti-verona/" data-track="click_service_restauro"><strong>Restauro tappeti</strong><span>Per frange, bordi, tagli o parti indebolite.</span></a>
      </div>
      <a class="local-hub-mobile-chooser__guidance" href="../valutazione-tappeti-verona/" data-track="click_service_valutazione"><strong>Osserviamo il tappeto</strong><span>Invia alcune fotografie per una prima indicazione.</span></a>
    `;
    hero.after(chooser);

    const chooserPosition = document.createComment('local-hub-chooser-position');
    chooser.before(chooserPosition);
    function syncChooserPosition() {
      if (mobileQuery.matches && heroCopy) {
        heroCopy.querySelector('p')?.after(chooser);
      } else {
        chooserPosition.after(chooser);
      }
    }
    syncChooserPosition();
    mobileQuery.addEventListener('change', syncChooserPosition);
  }

  const serviceChoiceTrack = page.querySelector('.local-section--service:not([id]) > .local-hub-service-grid');
  if (serviceChoiceTrack) {
    serviceChoiceTrack.classList.add('local-hub-choice-grid');
  }

  const finalCta = page.querySelector('.local-hub-final-cta');
  if (finalCta && !page.querySelector('.local-hub-mobile-steps')) {
    const steps = document.createElement('section');
    steps.className = 'local-hub-mobile-steps';
    steps.setAttribute('aria-labelledby', 'local-hub-mobile-steps-title');
    steps.innerHTML = isEnglishPage ? `
      <p class="eyebrow">How to begin</p>
      <h2 id="local-hub-mobile-steps-title">Three simple steps</h2>
      <ol>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">1</span><strong>Send a few photographs</strong><span>Whole rug, back and the area that concerns you.</span></li>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">2</span><strong>We look at them together</strong><span>The details help us understand the condition of the piece.</span></li>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">3</span><strong>We suggest the right attention</strong><span>Cleaning, restoration or a closer examination.</span></li>
      </ol>
    ` : `
      <p class="eyebrow">Come iniziare</p>
      <h2 id="local-hub-mobile-steps-title">Tre passaggi semplici</h2>
      <ol>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">1</span><strong>Invia alcune fotografie</strong><span>Tappeto intero, rovescio e parte che ti preoccupa.</span></li>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">2</span><strong>Le osserviamo insieme</strong><span>I dettagli aiutano a comprendere lo stato del manufatto.</span></li>
        <li><span class="local-hub-mobile-steps__number" aria-hidden="true">3</span><strong>Indichiamo l'attenzione adatta</strong><span>Lavaggio, restauro oppure un esame pi&ugrave; attento.</span></li>
      </ol>
    `;
    finalCta.before(steps);
  }

  const floatingActions = document.querySelector('.floating-actions');
  const whatsappLink = floatingActions && floatingActions.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
  const finalButtons = finalCta && finalCta.querySelector('.local-cta');
  if (whatsappLink && finalButtons && !finalButtons.querySelector('.local-hub-whatsapp')) {
    const mobileWhatsapp = whatsappLink.cloneNode(true);
    mobileWhatsapp.className = 'local-button local-button--primary local-hub-whatsapp';
    mobileWhatsapp.setAttribute('aria-label', isEnglishPage ? 'Send photos on WhatsApp' : 'Invia fotografie su WhatsApp');
    mobileWhatsapp.innerHTML = `<span>${isEnglishPage ? 'Send photos on WhatsApp' : 'Invia fotografie su WhatsApp'}</span>`;
    finalButtons.prepend(mobileWhatsapp);
  }

  const figures = Array.from(page.querySelectorAll('.local-hero__media, .local-inline-figure'));
  if (figures.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'local-hub-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', isEnglishPage ? 'Enlarged image' : 'Immagine ingrandita');
    lightbox.innerHTML = `<button type="button" class="local-hub-lightbox__close" aria-label="${isEnglishPage ? 'Close image' : 'Chiudi immagine'}">&times;</button><img alt="">`;
    document.body.appendChild(lightbox);
    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('button');
    let opener = null;

    function closeLightbox() {
      lightbox.hidden = true;
      page.inert = false;
      document.body.classList.remove('local-hub-lightbox-open');
      if (opener) opener.focus();
    }
    figures.forEach(function (figure) {
      const image = figure.querySelector('img');
      if (!image) return;
      function syncFigureInteraction() {
        if (mobileQuery.matches) {
          figure.tabIndex = 0;
          figure.setAttribute('role', 'button');
          figure.setAttribute('aria-label', (isEnglishPage ? 'Enlarge: ' : 'Ingrandisci: ') + image.alt);
        } else {
          figure.removeAttribute('tabindex');
          figure.removeAttribute('role');
          figure.removeAttribute('aria-label');
        }
      }
      function openLightbox() {
        if (!mobileQuery.matches) return;
        opener = figure;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.hidden = false;
        page.inert = true;
        document.body.classList.add('local-hub-lightbox-open');
        closeButton.focus();
      }
      figure.addEventListener('click', openLightbox);
      figure.addEventListener('keydown', function (event) {
        if (mobileQuery.matches && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openLightbox();
        }
      });
      syncFigureInteraction();
      mobileQuery.addEventListener('change', syncFigureInteraction);
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
      if (event.key === 'Tab' && !lightbox.hidden) {
        event.preventDefault();
        closeButton.focus();
      }
    });
  }
}

function setupWashingServiceMobilePage() {
  const page = document.querySelector('.local-washing-page');
  if (!page || page.dataset.mobileWashingReady === 'true') return;
  page.dataset.mobileWashingReady = 'true';

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const isRestorationPage = page.classList.contains('local-restoration-mobile-page');
  const isValuationPage = page.classList.contains('local-valuation-mobile-page');
  const heroGrid = page.querySelector('.local-hero__grid');
  const heroCopy = heroGrid && heroGrid.firstElementChild;
  const heroMedia = heroGrid && heroGrid.querySelector('.local-hero__media');
  const heroCta = heroCopy && heroCopy.querySelector('.local-cta');
  if (heroCopy && heroMedia && heroCta) {
    const mediaPosition = document.createComment('washing-media-position');
    const ctaPosition = document.createComment('washing-cta-position');
    heroMedia.before(mediaPosition);
    heroCta.before(ctaPosition);
    function syncHero() {
      if (mobileQuery.matches) {
        const firstParagraph = heroCopy.querySelector('p');
        firstParagraph.after(heroCta);
        heroCta.after(heroMedia);
      } else {
        ctaPosition.after(heroCta);
        mediaPosition.after(heroMedia);
      }
    }
    syncHero();
    mobileQuery.addEventListener('change', syncHero);
  }

  const sections = Array.from(page.querySelectorAll('main > .local-section'));
  const shortTitlesIt = ['Osservare il tappeto', 'Battitura e lavaggio', 'Quando serve il lavaggio', 'Polvere, tarme e umidit\u00e0', 'Inviare una fotografia', 'Quando il lavaggio non basta'];
  const shortTitlesEn = ['Look at the rug first', 'Dust removal and washing', 'When cleaning is needed', 'Dust, moths and humidity', 'Send a photograph', 'When cleaning is not enough'];
  const restorationTitlesIt = ['Fermare il danno', 'Frange, bordi e tagli', 'Buchi e parti indebolite', 'Conservare il manufatto', 'Restauro o lavaggio?', 'Inviare una fotografia'];
  const restorationTitlesEn = ['Stop damage early', 'Fringes, edges and tears', 'Holes and weakened areas', 'Preserve the piece', 'Restoration or cleaning?', 'Send a photograph'];
  const valuationTitlesIt = ['Primo orientamento', 'Cosa osserviamo', 'Fotografie utili', 'Tappeti antichi e vecchi', 'Possibili indicazioni', 'Vedere il tappeto dal vivo'];
  const valuationTitlesEn = ['Initial guidance', 'What we observe', 'Useful photographs', 'Antique and old rugs', 'Possible guidance', 'See the rug in person'];
  const visibleTitles = isValuationPage
    ? (isEnglishPage ? valuationTitlesEn : valuationTitlesIt)
    : isRestorationPage
      ? (isEnglishPage ? restorationTitlesEn : restorationTitlesIt)
      : (isEnglishPage ? shortTitlesEn : shortTitlesIt);
  const controls = [];

  sections.forEach(function (section, index) {
    const heading = section.querySelector(':scope > h2');
    if (!heading) return;
    const fullTitle = heading.textContent.trim();
    const body = document.createElement('div');
    body.className = 'washing-mobile-accordion__body';
    body.id = 'washing-mobile-section-' + (index + 1);
    while (heading.nextSibling) body.appendChild(heading.nextSibling);
    section.appendChild(body);
    section.classList.add('washing-mobile-accordion');
    heading.classList.add('washing-mobile-accordion__heading');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'washing-mobile-accordion__toggle';
    toggle.setAttribute('aria-controls', body.id);
    toggle.innerHTML = `<span>${visibleTitles[index] || fullTitle}</span><span aria-hidden="true">+</span>`;
    heading.after(toggle);

    function setExpanded(expanded) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.setAttribute('aria-label', `${expanded ? (isEnglishPage ? 'Close' : 'Chiudi') : (isEnglishPage ? 'Open' : 'Apri')} ${fullTitle}`);
      toggle.lastElementChild.textContent = expanded ? '\u2212' : '+';
      body.hidden = !expanded;
    }
    controls.push({ section: section, setExpanded: setExpanded });
    toggle.addEventListener('click', function () {
      const expand = toggle.getAttribute('aria-expanded') !== 'true';
      if (expand && mobileQuery.matches) {
        controls.forEach(function (control) {
          if (control.section !== section) control.setExpanded(false);
        });
      }
      setExpanded(expand);
      if (expand && mobileQuery.matches) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            section.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              block: 'start'
            });
          });
        });
      }
    });
    function syncSection() {
      toggle.hidden = !mobileQuery.matches;
      setExpanded(!mobileQuery.matches || index === 0);
    }
    syncSection();
    mobileQuery.addEventListener('change', syncSection);
  });

  page.querySelectorAll('.local-service-steps, .local-service-card-grid, .local-card-grid, .local-service-comparison').forEach(function (track) {
    if (track.children.length > 1) track.setAttribute('data-home-mobile-slider', '');
  });
  if (isRestorationPage || isValuationPage) {
    const overview = page.querySelector('.local-overview__grid');
    if (overview) overview.setAttribute('data-home-mobile-slider', '');
    page.querySelectorAll('.local-restauro-card-grid, .local-restauro-comparison, .local-valuation-card-grid, .local-valuation-checklist').forEach(function (track) {
      if (track.children.length > 1) track.setAttribute('data-home-mobile-slider', '');
    });
  }
  setupHomeMobileSliderIndicators();
}

function enhanceWhatsAppButtons() {
  document.querySelectorAll('.local-button[href*="wa.me"]').forEach(function (button) {
    if (button.querySelector('svg')) return;
    button.insertAdjacentHTML('afterbegin', '<svg class="local-button__whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z" fill="currentColor"></path></svg>');
  });
}

function setupCarpetMobileToc() {
  const toc = document.querySelector('.tappeti-content .carpet-mobile-toc');
  if (!toc) return;

  if (window.matchMedia('(max-width: 768px)').matches) {
    const article = toc.closest('.article');
    const headings = article ? Array.from(article.querySelectorAll(':scope > h2')) : [];
    toc.open = true;

    headings.forEach(function (heading, index) {
      const nextHeading = headings[index + 1] || null;
      const section = document.createElement('section');
      section.className = 'carpet-mobile-section';
      heading.before(section);
      while (section.nextSibling && section.nextSibling !== nextHeading) {
        section.appendChild(section.nextSibling);
      }
    });
  }

  toc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      window.history.replaceState(null, '', link.getAttribute('href'));

      window.setTimeout(function () {
        const offset = 84;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }, 50);
    });
  });
}

function setupRandomProductGalleries() {
  const galleries = document.querySelectorAll('[data-random-product-gallery]');
  if (!galleries.length) return;

  const isEnglish = document.documentElement.lang === 'en';

  function normalizeAssetPath(path) {
    return String(path || '').replace(/^\//, '');
  }

  function shuffle(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const current = shuffled[index];
      shuffled[index] = shuffled[randomIndex];
      shuffled[randomIndex] = current;
    }
    return shuffled;
  }

  function createProductFigure(product) {
    const slug = isEnglish ? (product.slugEn || product.slug) : product.slug;
    const title = isEnglish ? (product.titleEn || product.title || 'Khatam') : (product.title || 'Khatam');
    const alt = isEnglish ? (product.altEn || product.alt || title) : (product.alt || title);
    const image = normalizeAssetPath(product.coverImage);
    const image360 = normalizeAssetPath(product.coverImage360);
    const image640 = normalizeAssetPath(product.coverImage640);
    const figure = document.createElement('figure');
    const link = document.createElement('a');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');

    figure.className = 'article-image-row__figure';
    link.href = 'catalogo/products/' + slug + '.html';
    link.setAttribute('aria-label', (isEnglish ? 'View ' : 'Vedi ') + title);
    img.src = image;
    if (image360 && image640) {
      img.srcset = image360 + ' 360w, ' + image640 + ' 640w, ' + image + ' 1200w';
      img.sizes = '(max-width: 768px) 84vw, 30vw';
    }
    img.alt = alt;
    img.width = 900;
    img.height = 675;
    img.loading = 'lazy';
    img.decoding = 'async';
    caption.textContent = title;
    link.appendChild(img);
    figure.appendChild(link);
    figure.appendChild(caption);
    return figure;
  }

  fetch('catalogo/products.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Catalog unavailable');
      return response.json();
    })
    .then(function (products) {
      galleries.forEach(function (gallery) {
        const requestedCategory = gallery.dataset.productCategory;
        const categoryProducts = products.filter(function (product) {
          const categories = Array.isArray(product.categories) ? product.categories : [];
          const categoriesEn = Array.isArray(product.categoriesEn) ? product.categoriesEn : [];
          const validLanguage = !isEnglish || (product.hasEnglish && product.slugEn);
          const matchesCategory = product.category === requestedCategory ||
            product.categoryEn === requestedCategory || categories.includes(requestedCategory) ||
            categoriesEn.includes(requestedCategory);
          return validLanguage && matchesCategory && product.coverImage && product.slug;
        });
        const selectedProducts = shuffle(categoryProducts).slice(0, 3);
        if (selectedProducts.length < 3) return;

        gallery.replaceChildren.apply(gallery, selectedProducts.map(createProductFigure));
      });
    })
    .catch(function () {
      // Keep the editorial images already present in the HTML as a fallback.
    });
}

function setupCraftsMobilePage() {
  const article = document.querySelector('.artigianato-content .article');
  if (!article || !window.matchMedia('(max-width: 768px)').matches) return;

  const isEnglish = document.documentElement.lang === 'en';
  const intro = article.querySelector(':scope > h1 + p');
  const headings = Array.from(article.querySelectorAll(':scope > h2'));
  if (!headings.length) return;

  if (intro) {
    const introToggle = document.createElement('button');
    intro.classList.add('craft-mobile-intro', 'is-collapsed');
    introToggle.type = 'button';
    introToggle.className = 'craft-mobile-intro-toggle';
    introToggle.textContent = isEnglish ? 'Read more' : 'Leggi tutto';
    introToggle.setAttribute('aria-expanded', 'false');
    intro.after(introToggle);
    introToggle.addEventListener('click', function () {
      const expanded = introToggle.getAttribute('aria-expanded') === 'true';
      intro.classList.toggle('is-collapsed', expanded);
      introToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      introToggle.textContent = expanded ? (isEnglish ? 'Read more' : 'Leggi tutto') :
        (isEnglish ? 'Show less' : 'Mostra meno');
    });
  }

  const sectionNav = document.createElement('nav');
  sectionNav.className = 'crafts-mobile-nav';
  sectionNav.setAttribute('aria-label', isEnglish ? 'Handicraft sections' : 'Sezioni artigianato');
  (intro ? intro.nextElementSibling : article.querySelector('h1')).after(sectionNav);

  headings.forEach(function (heading, index) {
    const nextHeading = headings[index + 1] || null;
    const section = document.createElement('section');
    const label = heading.textContent.trim();
    const navLink = document.createElement('a');

    section.id = 'craft-section-' + (index + 1);
    section.className = 'craft-mobile-section';
    heading.before(section);
    while (section.nextSibling && section.nextSibling !== nextHeading) {
      section.appendChild(section.nextSibling);
    }

    navLink.href = '#' + section.id;
    navLink.textContent = label.replace(/\s+-.*$/, '');
    navLink.addEventListener('click', function (event) {
      event.preventDefault();
      window.setTimeout(function () {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 20);
    });
    sectionNav.appendChild(navLink);

    const gallery = section.querySelector('.article-image-row');
    if (gallery && gallery.children.length > 1) {
      const dots = document.createElement('div');
      dots.className = 'craft-mobile-gallery-dots';
      dots.setAttribute('aria-hidden', 'true');
      Array.from(gallery.children).forEach(function (_, dotIndex) {
        const dot = document.createElement('span');
        if (dotIndex === 0) dot.classList.add('is-active');
        dots.appendChild(dot);
      });
      gallery.after(dots);
      gallery.addEventListener('scroll', function () {
        const firstCard = gallery.firstElementChild;
        if (!firstCard) return;
        const gap = parseFloat(window.getComputedStyle(gallery).columnGap) || 0;
        const activeIndex = Math.min(
          dots.children.length - 1,
          Math.max(0, Math.round(gallery.scrollLeft / (firstCard.getBoundingClientRect().width + gap)))
        );
        Array.from(dots.children).forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
      }, { passive: true });
    }
  });

  const finalCta = document.createElement('a');
  finalCta.className = 'craft-mobile-final-cta';
  finalCta.href = isEnglish ? 'contacts-en.html' : 'contatti.html';
  finalCta.dataset.track = 'click_contact_page';
  finalCta.textContent = isEnglish ? 'Discover handicrafts in the shop' : 'Scopri l’artigianato in negozio';
  article.appendChild(finalCta);
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
  normalizeFooterLayout();
  setupCookieButtons();
  setupContactForms();
  applyCookieConsent(getCookieConsent());
  setupLanguageOverlayAccessibility();
  setupDesktopDropdowns();
  setupMobileNav();
  initClickableGuideCards();
  setupCarpetMobileToc();
  setupRandomProductGalleries();
  setupCraftsMobilePage();
  setupHomeMobileSliderIndicators();
  setupMobileContactPage();
  setupLocalHubMobilePage();
  setupWashingServiceMobilePage();
  enhanceWhatsAppButtons();
});

function setupMobileNav() {
  const MOBILE_NAV_SIDE_KEY = 'shahmansouri_mobile_nav_side';
  const toggle = document.querySelector('.nav-mobile-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) {
    return;
  }

  if (!nav.querySelector('.nav-mobile-brand')) {
    const headerLogoLink = document.querySelector('.site-header .logo-area');
    const headerLogoImage = headerLogoLink && headerLogoLink.querySelector('img');
    const navList = nav.querySelector('ul');

    if (headerLogoLink && headerLogoImage && navList) {
      const mobileBrand = document.createElement('div');
      const mobileBrandLink = document.createElement('a');
      const mobileBrandImage = headerLogoImage.cloneNode(true);

      mobileBrand.className = 'nav-mobile-brand';
      mobileBrandLink.className = 'nav-mobile-brand__link';
      mobileBrandLink.href = headerLogoLink.href;
      mobileBrandLink.setAttribute('aria-label', headerLogoLink.getAttribute('aria-label') || 'Shahmansouri Home');
      mobileBrandLink.appendChild(mobileBrandImage);
      mobileBrand.appendChild(mobileBrandLink);
      nav.insertBefore(mobileBrand, navList);
    }
  }

  const navList = nav.querySelector('ul');
  if (navList && !navList.querySelector('.nav-language-switch')) {
    const italianAlternate = document.querySelector('link[rel="alternate"][hreflang="it"]');
    const englishAlternate = document.querySelector('link[rel="alternate"][hreflang="en"]');

    if (italianAlternate && englishAlternate) {
      const languageSwitch = document.createElement('li');
      const italianLink = document.createElement('a');
      const separator = document.createElement('span');
      const englishLink = document.createElement('a');

      languageSwitch.className = 'nav-language-switch';
      italianLink.className = `lang-it${isEnglishPage ? '' : ' is-active'}`;
      italianLink.href = italianAlternate.href;
      italianLink.textContent = 'IT';
      englishLink.className = `lang-en${isEnglishPage ? ' is-active' : ''}`;
      englishLink.href = englishAlternate.href;
      englishLink.textContent = 'EN';
      separator.textContent = '/';

      languageSwitch.append(italianLink, separator, englishLink);
      navList.appendChild(languageSwitch);
    }
  }

  if (navList && !navList.querySelector('.nav-quick-contacts')) {
    const quickContacts = document.createElement('li');
    const languageSwitch = navList.querySelector('.nav-language-switch');

    quickContacts.className = 'nav-quick-contacts';
    quickContacts.setAttribute('aria-label', siteText.quickContactsLabel);
    quickContacts.innerHTML = `
      <div class="nav-quick-contacts__links">
        <a class="nav-quick-contact nav-quick-contact--phone" href="tel:+390458013280" data-track="click_phone">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.57 1 1 0 0 1-.24 1.02Z" fill="currentColor"></path></svg>
          <span>${siteText.phoneLabel}</span>
        </a>
        <a class="nav-quick-contact nav-quick-contact--whatsapp" href="https://wa.me/393392668950" target="_blank" rel="noopener" data-track="click_whatsapp">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z" fill="currentColor"></path></svg>
          <span>${siteText.whatsappLabel}</span>
        </a>
        <a class="nav-quick-contact nav-quick-contact--instagram" href="https://www.instagram.com/shahmansouri_tappeti_persiani/" target="_blank" rel="noopener" data-track="click_social_instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm10.4 1.7a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Z" fill="currentColor"></path></svg>
          <span>${siteText.instagramLabel}</span>
        </a>
        <a class="nav-quick-contact nav-quick-contact--maps" href="${STORE_MAP_URL}" target="_blank" rel="noopener" data-track="click_google_maps">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c4.14 0 7.5 3.23 7.5 7.22 0 4.72-5.3 10.36-7.5 12.5-2.2-2.14-7.5-7.78-7.5-12.5C4.5 5.23 7.86 2 12 2Zm0 4.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor"></path></svg>
          <span>Google Maps</span>
        </a>
      </div>
    `;

    navList.insertBefore(quickContacts, languageSwitch);
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

  function getPreferredNavSide() {
    try {
      return window.localStorage.getItem(MOBILE_NAV_SIDE_KEY) === 'left' ? 'left' : 'right';
    } catch (error) {
      return 'right';
    }
  }

  function setNavSide(side) {
    const normalizedSide = side === 'left' ? 'left' : 'right';
    document.body.classList.toggle('nav-side-left', normalizedSide === 'left');
    document.body.classList.toggle('nav-side-right', normalizedSide === 'right');

    try {
      window.localStorage.setItem(MOBILE_NAV_SIDE_KEY, normalizedSide);
    } catch (error) {
      // The menu remains usable when browser storage is unavailable.
    }
  }

  function syncNavAccessibility(isOpen) {
    if (window.innerWidth > 768) {
      setElementInertState(nav, false);
      document.querySelectorAll('main, footer').forEach(function (element) {
        setElementInertState(element, false);
      });
      return;
    }

    setElementInertState(nav, !isOpen);
    document.querySelectorAll('main, footer').forEach(function (element) {
      setElementInertState(element, isOpen);
    });
  }

  function closeNav() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', mobileNavLabel.open);
    nav.querySelectorAll('.dropdown.is-open').forEach(function (dropdown) {
      dropdown.classList.remove('is-open');
      dropdown.querySelector(':scope > .nav-parent')?.setAttribute('aria-expanded', 'false');
    });
    syncNavAccessibility(false);
  }

  function openNav(side) {
    setNavSide(side || getPreferredNavSide());
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', mobileNavLabel.close);
    syncNavAccessibility(true);
  }

  toggle.addEventListener('click', function (event) {
    const isOpen = document.body.classList.contains('nav-open');
    if (isOpen) {
      closeNav();
      return;
    }

    if (event.detail === 0) {
      openNav(getPreferredNavSide());
      return;
    }

    const toggleBounds = toggle.getBoundingClientRect();
    const clickedOnLeftHalf = event.clientX < toggleBounds.left + (toggleBounds.width / 2);
    openNav(clickedOnLeftHalf ? 'right' : 'left');
  });

  document.addEventListener('click', function (event) {
    if (window.innerWidth > 768 || !document.body.classList.contains('nav-open')) {
      return;
    }

    if (nav.contains(event.target) || toggle.contains(event.target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    closeNav();
  }, true);

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
      return;
    }

    syncNavAccessibility(document.body.classList.contains('nav-open'));
  });

  syncNavAccessibility(document.body.classList.contains('nav-open'));
  window.requestAnimationFrame(function () {
    syncNavAccessibility(document.body.classList.contains('nav-open'));
  });
  window.setTimeout(function () {
    syncNavAccessibility(document.body.classList.contains('nav-open'));
  }, 200);
}


