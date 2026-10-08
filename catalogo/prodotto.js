const productPageRoot = document.querySelector(".product-page");
const productHero = document.querySelector(".product-gallery__hero");
const productHeroImage = productHero?.querySelector("img");
const productThumbButtons = document.querySelectorAll("[data-product-thumb]");
const productGalleryDots = [];
let productGalleryCounter = null;
let activeProductImage = 0;
let suppressHeroClickUntil = 0;
const productContactDialog = document.querySelector("[data-product-contact-dialog]");
const productContactOpenButtons = document.querySelectorAll("[data-product-contact-open]");
const isEnglishProduct = document.documentElement.lang.toLowerCase().startsWith("en");
const productUiLabels = {
    closeImage: isEnglishProduct ? "Close image" : "Chiudi immagine",
    openImage: isEnglishProduct ? "Open enlarged rug image" : "Apri immagine ingrandita del tappeto",
    imageNavigation: isEnglishProduct ? "Product images" : "Immagini del prodotto",
    showImage: isEnglishProduct ? "Show image" : "Mostra immagine",
    previousImage: isEnglishProduct ? "Previous image" : "Immagine precedente",
    nextImage: isEnglishProduct ? "Next image" : "Immagine successiva",
    swipeImages: isEnglishProduct ? "Swipe to see more images" : "Scorri per vedere le altre immagini",
    backToCatalog: isEnglishProduct ? "Back to catalog" : "Torna al catalogo",
    previousProduct: isEnglishProduct ? "Previous product" : "Prodotto precedente",
    nextProduct: isEnglishProduct ? "Next product" : "Prodotto successivo",
    copyLink: isEnglishProduct ? "Copy link" : "Copia link",
    linkCopied: isEnglishProduct ? "Link copied" : "Link copiato"
};

function updateProductGalleryDots() {
    productGalleryDots.forEach((dot, index) => {
        const isActive = index === activeProductImage;
        dot.classList.toggle("is-active", isActive);
        if (isActive) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }
    });
    if (productGalleryCounter instanceof HTMLElement) {
        productGalleryCounter.textContent = `${activeProductImage + 1} / ${productThumbButtons.length}`;
    }
}

function setHeroImage(button) {
    if (!productHeroImage || !(button instanceof HTMLButtonElement)) {
        return;
    }

    const image = button.querySelector("img");
    if (!(image instanceof HTMLImageElement)) {
        return;
    }

    const fullSource = button.dataset.fullSource || image.currentSrc || image.src;
    const responsiveSrcset = button.dataset.responsiveSrcset || image.getAttribute("srcset");

    productHeroImage.src = fullSource;
    if (responsiveSrcset) {
        productHeroImage.srcset = responsiveSrcset;
    } else {
        productHeroImage.removeAttribute("srcset");
    }
    productHeroImage.alt = image.alt;
    productHeroImage.dataset.zoomSrc = fullSource;
    activeProductImage = Array.from(productThumbButtons).indexOf(button);
    productThumbButtons.forEach((thumb) => {
        thumb.setAttribute("aria-pressed", String(thumb === button));
    });
    updateProductGalleryDots();
    productHero?.classList.remove("is-zoomed");
}

productThumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button instanceof HTMLButtonElement) {
            setHeroImage(button);
        }
    });
});

if (productHero && productHeroImage) {
    let swipeStart = null;
    productHeroImage.draggable = false;
    productThumbButtons.forEach((thumb, index) => thumb.setAttribute("aria-pressed", String(index === 0)));

    if (productThumbButtons.length > 1) {
        const dots = document.createElement("div");
        dots.className = "product-gallery__dots";
        dots.setAttribute("role", "group");
        dots.setAttribute("aria-label", productUiLabels.imageNavigation);

        productGalleryCounter = document.createElement("span");
        productGalleryCounter.className = "product-gallery__counter";
        productGalleryCounter.setAttribute("aria-live", "polite");
        dots.appendChild(productGalleryCounter);

        productThumbButtons.forEach((thumb, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "product-gallery__dot";
            dot.setAttribute("aria-label", `${productUiLabels.showImage} ${index + 1}`);
            dot.addEventListener("click", () => setHeroImage(thumb));
            dots.appendChild(dot);
            productGalleryDots.push(dot);
        });

        const swipeHint = document.createElement("span");
        swipeHint.className = "product-gallery__swipe-hint";
        swipeHint.textContent = productUiLabels.swipeImages;
        dots.appendChild(swipeHint);

        productHero.insertAdjacentElement("afterend", dots);
        updateProductGalleryDots();
    }

    productHero.addEventListener("pointerdown", (event) => {
        suppressHeroClickUntil = 0;
        if (!event.isPrimary || window.innerWidth > 768 || productThumbButtons.length < 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
        swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
        try {
            productHero.setPointerCapture(event.pointerId);
        } catch (_error) {
            // Pointer capture may be unavailable during an interrupted Safari gesture.
        }
    });
    productHero.addEventListener("pointermove", (event) => {
        if (!swipeStart || event.pointerId !== swipeStart.id) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) event.preventDefault();
    });
    productHero.addEventListener("pointerup", (event) => {
        if (!swipeStart || event.pointerId !== swipeStart.id) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) < 28 || Math.abs(dx) <= Math.abs(dy)) return;
        suppressHeroClickUntil = Date.now() + 500;
        const next = (activeProductImage + (dx < 0 ? 1 : -1) + productThumbButtons.length) % productThumbButtons.length;
        setHeroImage(productThumbButtons[next]);
        productHero.parentElement?.querySelector(".product-gallery__swipe-hint")?.classList.add("is-hidden");
    });
    productHero.addEventListener("pointercancel", () => { swipeStart = null; });
    productHero.addEventListener("lostpointercapture", () => { swipeStart = null; });
    productHero.tabIndex = 0;
    productHero.setAttribute("role", "button");
    productHero.setAttribute("aria-label", productUiLabels.openImage);

    productHero.addEventListener("mousemove", (event) => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const rect = productHero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        productHero.style.setProperty("--zoom-x", `${x}%`);
        productHero.style.setProperty("--zoom-y", `${y}%`);
        productHero.classList.add("is-zoomed");
    });

    productHero.addEventListener("mouseleave", () => {
        productHero.classList.remove("is-zoomed");
    });

    const openProductLightbox = () => {
        const overlay = document.createElement("dialog");
        overlay.className = "product-lightbox";
        overlay.innerHTML = `
            <div class="product-lightbox__frame">
                <button type="button" class="product-lightbox__close" aria-label="${productUiLabels.closeImage}">&times;</button>
                <div class="product-lightbox__viewport">
                    <img src="${productHeroImage.dataset.zoomSrc || productHeroImage.src}" alt="${productHeroImage.alt}">
                </div>
                ${productThumbButtons.length > 1 ? `<span class="product-lightbox__counter" aria-live="polite">${activeProductImage + 1} / ${productThumbButtons.length}</span>` : ""}
                ${productThumbButtons.length > 1 ? `
                    <button type="button" class="product-lightbox__nav product-lightbox__nav--previous" aria-label="${productUiLabels.previousImage}">&#8249;</button>
                    <button type="button" class="product-lightbox__nav product-lightbox__nav--next" aria-label="${productUiLabels.nextImage}">&#8250;</button>
                ` : ""}
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.classList.add("product-lightbox-open");
        overlay.showModal();
        const overlayViewport = overlay.querySelector(".product-lightbox__viewport");
        const overlayImage = overlay.querySelector("img");
        const previousButton = overlay.querySelector(".product-lightbox__nav--previous");
        const nextButton = overlay.querySelector(".product-lightbox__nav--next");
        const lightboxCounter = overlay.querySelector(".product-lightbox__counter");

        const close = () => {
            overlay.close();
        };

        if (overlayImage instanceof HTMLImageElement) overlayImage.draggable = false;

        const showLightboxImage = (direction) => {
            if (!(overlayImage instanceof HTMLImageElement) || productThumbButtons.length < 2) {
                return;
            }

            const nextIndex = (activeProductImage + direction + productThumbButtons.length) % productThumbButtons.length;
            const nextThumb = productThumbButtons[nextIndex];
            setHeroImage(nextThumb);
            overlayImage.src = productHeroImage.dataset.zoomSrc || productHeroImage.src;
            overlayImage.alt = productHeroImage.alt;
            if (lightboxCounter instanceof HTMLElement) {
                lightboxCounter.textContent = `${activeProductImage + 1} / ${productThumbButtons.length}`;
            }
            overlayViewport?.classList.remove("is-zoomed");
        };

        if (overlayViewport instanceof HTMLElement && overlayImage instanceof HTMLImageElement) {
            overlayViewport.addEventListener("mousemove", (event) => {
                const rect = overlayViewport.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                overlayViewport.style.setProperty("--lightbox-zoom-x", `${x}%`);
                overlayViewport.style.setProperty("--lightbox-zoom-y", `${y}%`);
                overlayViewport.classList.add("is-zoomed");
            });

            overlayViewport.addEventListener("mouseleave", () => {
                overlayViewport.classList.remove("is-zoomed");
            });

            let lightboxSwipeStart = null;
            overlayViewport.addEventListener("pointerdown", (event) => {
                if (!event.isPrimary || window.innerWidth > 768 || (event.pointerType === "mouse" && event.button !== 0)) return;
                lightboxSwipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
                try {
                    overlayViewport.setPointerCapture(event.pointerId);
                } catch (_error) {
                    // Keep the gesture usable when pointer capture is unavailable.
                }
            });
            overlayViewport.addEventListener("pointermove", (event) => {
                if (!lightboxSwipeStart || event.pointerId !== lightboxSwipeStart.id) return;
                const dx = event.clientX - lightboxSwipeStart.x;
                const dy = event.clientY - lightboxSwipeStart.y;
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) event.preventDefault();
            });
            overlayViewport.addEventListener("pointerup", (event) => {
                if (!lightboxSwipeStart || event.pointerId !== lightboxSwipeStart.id) return;
                const dx = event.clientX - lightboxSwipeStart.x;
                const dy = event.clientY - lightboxSwipeStart.y;
                lightboxSwipeStart = null;
                if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx)) {
                    close();
                    return;
                }
                if (productThumbButtons.length < 2) return;
                if (Math.abs(dx) < 28 || Math.abs(dx) <= Math.abs(dy)) return;
                showLightboxImage(dx < 0 ? 1 : -1);
            });
            overlayViewport.addEventListener("pointercancel", () => { lightboxSwipeStart = null; });
            overlayViewport.addEventListener("lostpointercapture", () => { lightboxSwipeStart = null; });
        }

        previousButton?.addEventListener("click", () => showLightboxImage(-1));
        nextButton?.addEventListener("click", () => showLightboxImage(1));

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                close();
            }
        });

        overlay.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showLightboxImage(-1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showLightboxImage(1);
            } else if (event.key === "Escape") {
                event.preventDefault();
                close();
            }
        });

        const closeButton = overlay.querySelector(".product-lightbox__close");
        closeButton?.addEventListener("click", close);
        closeButton?.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            close();
        });
        overlay.addEventListener("cancel", (event) => {
            event.preventDefault();
            close();
        });
        overlay.addEventListener("close", () => {
            document.body.classList.remove("product-lightbox-open");
            overlay.remove();
            productHero.focus();
        });
    };

    productHero.addEventListener("click", (event) => {
        if (document.body.classList.contains("nav-open")) {
            event.preventDefault();
            return;
        }
        if (event.detail !== 0 && Date.now() < suppressHeroClickUntil) {
            event.preventDefault();
            return;
        }
        openProductLightbox();
    });
    productHero.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        openProductLightbox();
    });
}

async function setupProductNavigation() {
    const productBreadcrumbs = document.querySelector(".product-breadcrumbs");
    const productLayout = document.querySelector(".product-layout");
    if (!(productBreadcrumbs instanceof HTMLElement) || !(productLayout instanceof HTMLElement)) return;

    const catalogLink = Array.from(productBreadcrumbs.querySelectorAll("a[href]")).find((link) => {
        try {
            return new URL(link.href).pathname.startsWith("/catalogo/");
        } catch (_error) {
            return false;
        }
    });
    if (!(catalogLink instanceof HTMLAnchorElement)) return;

    let savedReturn = null;
    try {
        savedReturn = JSON.parse(window.sessionStorage.getItem("shahmansouri_catalog_return") || "null");
    } catch (_error) {
        savedReturn = null;
    }

    const utility = document.createElement("div");
    utility.className = "product-page-utility";
    const returnLink = document.createElement("a");
    returnLink.className = "product-back-to-catalog";
    returnLink.href = catalogLink.href;
    try {
        const savedUrl = new URL(savedReturn?.url || "", window.location.origin);
        if (savedUrl.origin === window.location.origin && /\/catalogo\/(?:index(?:-en)?\.html)?$/.test(savedUrl.pathname)) {
            returnLink.href = savedUrl.href;
        }
    } catch (_error) {
        // Keep the catalog URL already present in the breadcrumb.
    }
    returnLink.textContent = `\u2190 ${productUiLabels.backToCatalog}`;
    returnLink.addEventListener("click", (event) => {
        try {
            const referrer = new URL(document.referrer);
            if (referrer.origin === window.location.origin && /\/catalogo\/(?:index(?:-en)?\.html)?$/.test(referrer.pathname)) {
                event.preventDefault();
                window.history.back();
            }
        } catch (_error) {
            // The normal catalog link remains available when no valid referrer exists.
        }
    });
    utility.appendChild(returnLink);

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "product-page-tools__copy";
    copyButton.textContent = productUiLabels.copyLink;
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (_error) {
            const temporaryInput = document.createElement("textarea");
            temporaryInput.value = window.location.href;
            temporaryInput.setAttribute("readonly", "");
            temporaryInput.style.position = "fixed";
            temporaryInput.style.opacity = "0";
            document.body.appendChild(temporaryInput);
            temporaryInput.select();
            document.execCommand("copy");
            temporaryInput.remove();
        }
        copyButton.textContent = productUiLabels.linkCopied;
        window.setTimeout(() => { copyButton.textContent = productUiLabels.copyLink; }, 1800);
    });
    utility.appendChild(copyButton);
    productBreadcrumbs.insertAdjacentElement("afterend", utility);

    let products = Array.isArray(savedReturn?.products) ? savedReturn.products : [];
    const hasCurrentProduct = products.some((product) => {
        try {
            return new URL(product.url, window.location.origin).pathname === window.location.pathname;
        } catch (_error) {
            return false;
        }
    });

    if (!hasCurrentProduct) {
        try {
            const response = await fetch("../products.json", { headers: { Accept: "application/json" } });
            if (response.ok) {
                const catalogProducts = await response.json();
                products = catalogProducts
                    .filter((product) => product?.slug && (!isEnglishProduct || (product.hasEnglish && product.slugEn)))
                    .map((product) => ({
                        url: `${isEnglishProduct ? product.slugEn : product.slug}.html`,
                        name: isEnglishProduct ? (product.titleEn || product.title) : product.title
                    }))
                    .reverse();
            }
        } catch (_error) {
            products = [];
        }
    }

    const currentIndex = products.findIndex((product) => {
        try {
            return new URL(product.url, window.location.href).pathname === window.location.pathname;
        } catch (_error) {
            return false;
        }
    });
    if (currentIndex < 0) return;

    const navigation = document.createElement("nav");
    navigation.className = "product-page-tools";
    navigation.setAttribute("aria-label", isEnglishProduct ? "Product navigation" : "Navigazione prodotti");

    const addProductLink = (product, className, label) => {
        if (!product?.url) return;
        const link = document.createElement("a");
        link.className = `product-page-tools__link ${className}`;
        link.href = product.url;
        link.textContent = label;
        if (product.name) link.title = product.name;
        navigation.appendChild(link);
    };

    if (currentIndex > 0) {
        addProductLink(products[currentIndex - 1], "product-page-tools__link--previous", `\u2190 ${productUiLabels.previousProduct}`);
    }
    if (currentIndex < products.length - 1) {
        addProductLink(products[currentIndex + 1], "product-page-tools__link--next", `${productUiLabels.nextProduct} \u2192`);
    }
    productLayout.insertAdjacentElement("afterend", navigation);
}

setupProductNavigation();

function getProductTrackingPayload() {
    if (!(productPageRoot instanceof HTMLElement)) {
        return {};
    }

    return {
        product_name: productPageRoot.dataset.productName || "",
        product_slug: productPageRoot.dataset.productSlug || "",
        product_url: productPageRoot.dataset.productUrl || "",
        product_category: productPageRoot.dataset.productCategory || "",
        product_category_label: productPageRoot.dataset.productCategoryLabel || "",
        product_origin: productPageRoot.dataset.productOrigin || "",
        product_size: productPageRoot.dataset.productSize || "",
        product_material: productPageRoot.dataset.productMaterial || "",
        product_material_label: productPageRoot.dataset.productMaterialLabel || "",
        product_price_status: productPageRoot.dataset.productPriceStatus || "",
        product_language: productPageRoot.dataset.productLanguage || document.documentElement.lang || "",
        language: productPageRoot.dataset.productLanguage || document.documentElement.lang || "",
        page_path: productPageRoot.dataset.pagePath || window.location.pathname
    };
}

function isProductAnalyticsAllowed() {
    try {
        return typeof window.gtag === "function"
            && typeof window.ShahmansouriAnalytics?.isAllowed === "function"
            && window.ShahmansouriAnalytics.isAllowed();
    } catch (_error) {
        return false;
    }
}

function sanitizeProductTrackingUrl(href) {
    if (window.ShahmansouriAnalytics && typeof window.ShahmansouriAnalytics.sanitizeTrackingUrl === "function") {
        return window.ShahmansouriAnalytics.sanitizeTrackingUrl(href);
    }

    return String(href || "").trim();
}

function cleanProductTrackingPayload(payload) {
    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== "" && value != null)
    );
}

function sendProductTrackingEvent(eventName, extraPayload = {}) {
    if (!eventName || !isProductAnalyticsAllowed()) {
        return;
    }

    window.gtag("event", eventName, cleanProductTrackingPayload({
        ...getProductTrackingPayload(),
        ...extraPayload
    }));
}

function prepareProductContactDialog() {
    const sheet = productContactDialog?.querySelector(".product-contact-dialog__sheet");
    if (!sheet) return;
    sheet.querySelector(".eyebrow")?.remove();
    sheet.querySelector("h2").textContent = isEnglishProduct ? "Request price and availability" : "Richiedi prezzo e disponibilit\u00e0";
    sheet.querySelector("p:not(.product-contact-dialog__fallback)")?.remove();
    const actions = sheet.querySelector(".product-contact-dialog__actions");
    const whatsapp = actions?.querySelector('a[href^="https://wa.me/"]');
    const email = actions?.querySelector('a[href^="mailto:"]');
    const phone = actions?.querySelector('a[href^="tel:"]');
    if (!whatsapp || !email || !phone) return;
    actions.querySelector('[data-product-track="click_product_price_request"]')?.remove();
    const name = productPageRoot.dataset.productName || document.querySelector("h1")?.textContent.trim() || "";
    const size = productPageRoot.dataset.productSize || "";
    const summary = document.createElement("p");
    summary.className = "product-contact-dialog__summary";
    const summaryText = document.createElement("span");
    const summaryName = document.createElement("strong");
    summaryName.textContent = name;
    const summarySize = document.createElement("span");
    summarySize.textContent = size.replace(/\s+x\s+/g, " \u00d7 ");
    summaryText.append(summaryName, summarySize);
    if (productHeroImage) {
        const thumbnail = document.createElement("img");
        thumbnail.src = productHeroImage.currentSrc || productHeroImage.src;
        thumbnail.alt = "";
        thumbnail.width = 180;
        thumbnail.height = 220;
        summary.append(thumbnail);
    }
    summary.append(summaryText);
    sheet.querySelector("h2").after(summary);
    const url = productPageRoot.dataset.productUrl || document.querySelector('link[rel="canonical"]')?.href || location.href;
    const reference = [name, size].filter(Boolean).join(" - ");
    const message = isEnglishProduct
        ? `Hello, I would like to know the price and availability of this product: ${reference}.\n${url}`
        : `Buongiorno, vorrei conoscere prezzo e disponibilit\u00e0 di questo prodotto: ${reference}.\n${url}`;
    const whatsappUrl = new URL(whatsapp.href);
    whatsappUrl.searchParams.set("text", message);
    whatsapp.href = whatsappUrl.href;
    whatsapp.className = "button product-contact-dialog__whatsapp";
    whatsapp.textContent = isEnglishProduct ? "Message us on WhatsApp" : "Scrivici su WhatsApp";
    whatsapp.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.05 4.94A9.84 9.84 0 0 0 12.02 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.22-1.36A9.93 9.93 0 0 0 12.02 22h.01a9.99 9.99 0 0 0 7.02-17.06Zm-7.03 15.37h-.01a8.22 8.22 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.29 8.29 0 1 1 6.96 3.84Zm4.54-6.2c-.25-.13-1.48-.73-1.72-.81-.23-.08-.4-.13-.57.12-.17.25-.65.81-.8.98-.15.17-.3.19-.56.06-.25-.13-1.07-.39-2.04-1.24-.75-.67-1.26-1.49-1.41-1.74-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.15-.48-.27Z"/></svg>');
    const subject = isEnglishProduct ? `Product enquiry - ${name}` : `Informazioni prodotto - ${name}`;
    email.href = `mailto:shahmansouri@tiscali.it?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    email.textContent = isEnglishProduct ? "Contact us by email" : "Contattaci via email";
    email.className = "button product-contact-dialog__email";
    email.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>');
    const phoneText = document.createElement("span");
    const phoneCaption = document.createElement("span");
    phoneCaption.textContent = isEnglishProduct ? "Call the shop" : "Chiama il negozio";
    const phoneNumber = document.createElement("small");
    const digits = phone.getAttribute("href").replace(/^tel:/, "");
    phoneNumber.textContent = digits === "+390458013280" ? "+39 045 801 3280" : digits;
    phoneText.append(phoneCaption, phoneNumber);
    phone.replaceChildren(phoneText);
    phone.className = "button product-contact-dialog__phone";
    phone.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg>');
    actions.append(whatsapp, email, phone);
    sheet.querySelector(".product-contact-dialog__fallback")?.remove();
    const emailFallback = document.createElement("div");
    emailFallback.className = "product-contact-dialog__email-fallback";
    const address = document.createElement("input");
    address.type = "text";
    address.readOnly = true;
    address.value = "shahmansouri@tiscali.it";
    address.setAttribute("aria-label", isEnglishProduct ? "Shop email address" : "Indirizzo email del negozio");
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = isEnglishProduct ? "Copy email" : "Copia email";
    const status = document.createElement("span");
    status.setAttribute("role", "status");
    copy.addEventListener("click", async () => {
        copy.disabled = true;
        let copied = false;
        try {
            await navigator.clipboard.writeText(address.value);
            copied = true;
        } catch (_error) {
            address.focus({ preventScroll: true });
            address.select();
            try { copied = document.execCommand("copy"); } catch (_copyError) { /* Keep the address selected for manual copying. */ }
        } finally {
            copy.disabled = false;
        }
        status.textContent = copied
            ? (isEnglishProduct ? "Email address copied." : "Indirizzo email copiato.")
            : (isEnglishProduct ? "Select and copy the address manually." : "Seleziona e copia l'indirizzo manualmente.");
    });
    emailFallback.append(address, copy, status);
    actions.append(emailFallback);
}

function openProductContactDialog(triggerElement) {
    if (!(productContactDialog instanceof HTMLDialogElement) || typeof productContactDialog.showModal !== "function") {
        return;
    }

    productContactDialog.dataset.lastTriggerId = "";

    if (triggerElement instanceof HTMLElement) {
        if (!triggerElement.id) {
            triggerElement.id = `product-contact-trigger-${Math.random().toString(36).slice(2, 10)}`;
        }

        productContactDialog.dataset.lastTriggerId = triggerElement.id;
    }

    if (!productContactDialog.open) {
        productContactDialog.showModal();
        document.body.classList.add("product-contact-open");
    }

    const closeButton = productContactDialog.querySelector("[data-product-contact-close]");
    if (closeButton instanceof HTMLElement) {
        closeButton.focus();
    }
}

function closeProductContactDialog() {
    if (
        !(productContactDialog instanceof HTMLDialogElement)
        || typeof productContactDialog.close !== "function"
        || !productContactDialog.open
    ) {
        return;
    }

    const lastTriggerId = productContactDialog.dataset.lastTriggerId || "";
    productContactDialog.close();

    if (lastTriggerId) {
        const triggerElement = document.getElementById(lastTriggerId);
        if (triggerElement instanceof HTMLElement) {
            triggerElement.focus({ preventScroll: true });
        }
    }
}

function bindProductContactDialog() {
    if (
        !(productContactDialog instanceof HTMLDialogElement)
        || typeof productContactDialog.showModal !== "function"
        || productContactDialog.dataset.contactDialogBound === "true"
    ) {
        return;
    }

    prepareProductContactDialog();
    productContactDialog.addEventListener("close", () => document.body.classList.remove("product-contact-open"));
    productContactOpenButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            openProductContactDialog(button);
        });
    });

    productContactDialog.addEventListener("click", (event) => {
        if (event.target === productContactDialog) {
            closeProductContactDialog();
        }
    });

    productContactDialog.querySelector("[data-product-contact-close]")?.addEventListener("click", () => {
        closeProductContactDialog();
    });

    productContactDialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeProductContactDialog();
    });

    productContactDialog.dataset.contactDialogBound = "true";
}

function bindProductTracking() {
    if (!(productPageRoot instanceof HTMLElement) || productPageRoot.dataset.productTrackingBound === "true") {
        return;
    }

    const ctaElements = productPageRoot.querySelectorAll("[data-product-track]");
    ctaElements.forEach((element) => {
        element.addEventListener("click", () => {
            const href = "href" in element ? element.href : "";
            const buttonLabel = (element.getAttribute("data-track-label") || element.textContent || "").replace(/\s+/g, " ").trim();
            sendProductTrackingEvent(String(element.getAttribute("data-product-track") || "").trim(), {
                button_label: buttonLabel,
                link_url: sanitizeProductTrackingUrl(href)
            });
        });
    });

    productPageRoot.dataset.productTrackingBound = "true";
}

function initProductTracking() {
    if (!(productPageRoot instanceof HTMLElement) || productPageRoot.dataset.productViewTracked === "true") {
        return;
    }

    bindProductContactDialog();
    bindProductTracking();
    sendProductTrackingEvent("view_product");
    productPageRoot.dataset.productViewTracked = "true";
}

function setupProductStoryPlacement() {
    const story = document.querySelector(".product-story--accordion");
    const summary = document.querySelector(".product-summary");
    if (!(story instanceof HTMLDetailsElement) || !(summary instanceof HTMLElement)) {
        return;
    }

    const originalPosition = document.createComment("product-story-position");
    const desktopQuery = window.matchMedia("(min-width: 769px)");
    story.before(originalPosition);

    const updatePlacement = () => {
        if (desktopQuery.matches) {
            summary.appendChild(story);
        } else if (originalPosition.parentNode) {
            originalPosition.parentNode.insertBefore(story, originalPosition.nextSibling);
        }
    };

    updatePlacement();
    desktopQuery.addEventListener("change", updatePlacement);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setupProductStoryPlacement();
        initProductTracking();
    }, { once: true });
} else {
    setupProductStoryPlacement();
    initProductTracking();
}


/* Product Studio responsive gallery */
document.querySelectorAll("[data-product-thumb]").forEach((button) => {
    button.addEventListener("click", () => {
        const heroImage = document.querySelector(".product-gallery__hero img");
        const fullSource = button.dataset.fullSource || "";

        if (!(heroImage instanceof HTMLImageElement) || !fullSource) {
            return;
        }

        heroImage.src = fullSource;
        heroImage.srcset = button.dataset.responsiveSrcset || "";
        heroImage.sizes = "(max-width: 768px) 100vw, 60vw";
        heroImage.dataset.zoomSrc = fullSource;
    });
});
