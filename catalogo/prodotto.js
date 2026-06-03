const productPageRoot = document.querySelector(".product-page");
const productHero = document.querySelector(".product-gallery__hero");
const productHeroImage = productHero?.querySelector("img");
const productThumbButtons = document.querySelectorAll("[data-product-thumb]");
const productContactDialog = document.querySelector("[data-product-contact-dialog]");
const productContactOpenButtons = document.querySelectorAll("[data-product-contact-open]");
const isEnglishProduct = document.documentElement.lang.toLowerCase().startsWith("en");
const productUiLabels = {
    closeImage: isEnglishProduct ? "Close image" : "Chiudi immagine",
    openImage: isEnglishProduct ? "Open enlarged rug image" : "Apri immagine ingrandita del tappeto"
};

function setHeroImage(image) {
    if (!productHeroImage || !(image instanceof HTMLImageElement)) {
        return;
    }

    productHeroImage.src = image.currentSrc || image.src;
    productHeroImage.alt = image.alt;
    productHeroImage.dataset.zoomSrc = image.currentSrc || image.src;
}

productThumbButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const preview = button.querySelector("img");
        setHeroImage(preview);
    });
});

if (productHero && productHeroImage) {
    productHero.tabIndex = 0;
    productHero.setAttribute("role", "button");
    productHero.setAttribute("aria-label", productUiLabels.openImage);

    productHero.addEventListener("mousemove", (event) => {
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
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.showModal();
        const overlayViewport = overlay.querySelector(".product-lightbox__viewport");
        const overlayImage = overlay.querySelector("img");

        const close = () => {
            overlay.close();
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
        }

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                close();
            }
        });

        overlay.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            close();
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
            overlay.remove();
            productHero.focus();
        });
    };

    productHero.addEventListener("click", openProductLightbox);
    productHero.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        openProductLightbox();
    });
}

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
