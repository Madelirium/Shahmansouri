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
            && window.localStorage.getItem("shahmansouri_cookie_consent_v1") === "accepted";
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
            triggerElement.focus();
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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductTracking, { once: true });
} else {
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
