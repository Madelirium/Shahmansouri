const productHero = document.querySelector(".product-gallery__hero");
const productHeroImage = productHero?.querySelector("img");
const productThumbButtons = document.querySelectorAll("[data-product-thumb]");

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

    productHero.addEventListener("click", () => {
        const overlay = document.createElement("dialog");
        overlay.className = "product-lightbox";
        overlay.innerHTML = `
            <div class="product-lightbox__frame">
                <button type="button" class="product-lightbox__close" aria-label="Chiudi immagine">&times;</button>
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
            overlay.remove();
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

        overlay.querySelector(".product-lightbox__close")?.addEventListener("click", close);
        overlay.addEventListener("close", () => overlay.remove());
    });
}
