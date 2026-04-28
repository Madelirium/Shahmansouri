const catalogForm = document.querySelector("[data-catalog-form]");
const productGrid = document.querySelector("[data-product-grid]");
const resultsCount = document.querySelector("[data-results-count]");
const activeFilters = document.querySelector("[data-active-filters]");
const emptyState = document.querySelector("[data-empty-state]");
const totalProductsTarget = document.querySelector("[data-total-products]");
const resetButton = document.querySelector("[data-reset-filters]");
const widthValue = document.querySelector("[data-width-value]");
const lengthValue = document.querySelector("[data-length-value]");
const openFiltersButton = document.querySelector("[data-open-filters]");
const closeFiltersButton = document.querySelector("[data-close-filters]");
const filtersPanel = document.querySelector("[data-filters-panel]");
const filtersOverlay = document.querySelector("[data-filters-overlay]");
let catalogProducts = [];
let maxWidth = 0;
let maxLength = 0;

const isEnglishCatalog = document.documentElement.lang.toLowerCase().startsWith("en");
const catalogI18n = isEnglishCatalog
    ? {
        locale: "en-GB",
        labels: {
            measures: "Size",
            availability: "Availability",
            openCard: "Open product",
            search: "Search",
            material: "Material",
            widthUpTo: "Width up to",
            lengthUpTo: "Length up to",
            results: (filtered, total) => `${filtered} results out of ${total}`,
            emptyCatalog: "The online catalog is being updated.",
            noMatch: "No product matches the selected filters. Try removing some of them.",
            unavailable: "The catalog is currently unavailable.",
            productDetails: "Product details"
        },
        categories: {
            "Tappeto classico": "Classic carpet",
            "Tappeto contemporaneo": "Contemporary carpet",
            "Runner": "Runner",
            "Kilim": "Kilim",
            "Oggetto decorativo": "Decorative object"
        },
        materials: {
            "lana": "wool",
            "seta": "silk",
            "cotone": "cotton",
            "ceramica": "ceramic",
            "legno": "wood"
        },
        availability: {
            "Disponibile": "Available",
            "Su richiesta": "On request",
            "Venduto": "Sold",
            "Riservato": "Reserved"
        }
    }
    : {
        locale: "it-IT",
        labels: {
            measures: "Misure",
            availability: "Disponibilita'",
            openCard: "Apri scheda",
            search: "Ricerca",
            material: "Materiale",
            widthUpTo: "Larghezza fino a",
            lengthUpTo: "Lunghezza fino a",
            results: (filtered, total) => `${filtered} risultati su ${total}`,
            emptyCatalog: "Il catalogo online e' in aggiornamento.",
            noMatch: "Nessun prodotto corrisponde ai filtri selezionati. Prova a rimuoverne qualcuno.",
            unavailable: "Il catalogo non e' disponibile in questo momento.",
            productDetails: "Dettagli prodotto"
        },
        categories: {},
        materials: {},
        availability: {}
    };

function normalizeText(value) {
    return value.toLowerCase().trim();
}

function translateCategory(value) {
    return catalogI18n.categories[value] || value;
}

function translateMaterial(value) {
    return catalogI18n.materials[normalizeText(String(value))] || value;
}

function translateAvailability(value) {
    return catalogI18n.availability[value] || value;
}

function getFormState() {
    if (!catalogForm) {
        return {
            search: "",
            category: "all",
            material: "all",
            widthMax: maxWidth,
            lengthMax: maxLength
        };
    }

    const formData = new FormData(catalogForm);
    return {
        search: normalizeText(String(formData.get("search") || "")),
        categories: formData.getAll("categories").map((value) => String(value)),
        materials: formData.getAll("materials").map((value) => normalizeText(String(value))),
        widthMax: Number(String(formData.get("widthMax") || maxWidth).trim()) || maxWidth,
        lengthMax: Number(String(formData.get("lengthMax") || maxLength).trim()) || maxLength
    };
}

function matchesDimensions(product, filters) {
    if (product.widthCm > filters.widthMax) {
        return false;
    }

    if (product.lengthCm > filters.lengthMax) {
        return false;
    }

    return true;
}

function matchesSearch(product, query) {
    if (!query) {
        return true;
    }

    const haystack = [
        product.title,
        product.category,
        product.material,
        product.origin,
        product.description,
        ...product.tags
    ].join(" ").toLowerCase();

    return haystack.includes(query);
}

function matchesMaterials(product, selectedMaterials) {
    if (!selectedMaterials.length) {
        return true;
    }

    const productMaterial = normalizeText(String(product.material || ""));
    return selectedMaterials.some((material) => productMaterial.includes(material));
}

function filterProducts(filters) {
    return catalogProducts.filter((product) => {
        return matchesSearch(product, filters.search)
            && (!filters.categories.length || filters.categories.includes(product.category))
            && matchesMaterials(product, filters.materials)
            && matchesDimensions(product, filters);
    });
}

function createProductCard(product) {
    const productPage = `products/${product.slug}.html`;
    const hasNumericPrice = Number.isFinite(product.priceValue);
    const hasSalePrice = Number.isFinite(product.salePriceValue);
    const displayPrice = hasNumericPrice
        ? new Intl.NumberFormat(catalogI18n.locale, {
            style: "currency",
            currency: product.currency || "EUR"
        }).format(product.priceValue)
        : "";
    const displaySalePrice = hasSalePrice
        ? new Intl.NumberFormat(catalogI18n.locale, {
            style: "currency",
            currency: product.currency || "EUR"
        }).format(product.salePriceValue)
        : "";
    let priceMarkup = "";

    if (hasSalePrice) {
        priceMarkup = `
            <div class="product-card__price-wrap">
                <span class="product-card__price product-card__price--sale">${displaySalePrice}</span>
                <span class="product-card__price-original">${displayPrice}</span>
            </div>
        `;
    } else if (hasNumericPrice) {
        priceMarkup = `
            <div class="product-card__price-wrap">
                <span class="product-card__price">${displayPrice}</span>
            </div>
        `;
    }

    return `
        <article class="product-card">
            <div class="product-card__media">
                <a href="${productPage}">
                    <img src="${product.coverImage}" alt="${product.alt}" loading="lazy" decoding="async" width="800" height="600">
                </a>
            </div>
            <div class="product-card__body">
                ${priceMarkup ? `<div class="product-card__meta">${priceMarkup}</div>` : ""}
                <div>
                    <h3 class="product-card__title"><a href="${productPage}">${product.title}</a></h3>
                </div>
                <ul class="product-card__detail-list" aria-label="${catalogI18n.labels.productDetails}">
                    <li><strong>${catalogI18n.labels.measures}:</strong> ${product.dimensions}</li>
                    <li><strong>${catalogI18n.labels.availability}:</strong> ${translateAvailability(product.availability)}</li>
                </ul>
                <div class="product-card__actions">
                    <a class="button button-primary" href="${productPage}">${catalogI18n.labels.openCard}</a>
                </div>
            </div>
        </article>
    `;
}

function renderActiveFilters(filters) {
    if (!activeFilters) {
        return;
    }

    const chips = [];

    if (filters.search) {
        chips.push(`${catalogI18n.labels.search}: ${filters.search}`);
    }

    filters.categories.forEach((category) => {
        chips.push(translateCategory(category));
    });

    filters.materials.forEach((material) => {
        chips.push(`${catalogI18n.labels.material}: ${translateMaterial(material)}`);
    });

    if (filters.widthMax < maxWidth) {
        chips.push(`${catalogI18n.labels.widthUpTo} ${filters.widthMax} cm`);
    }

    if (filters.lengthMax < maxLength) {
        chips.push(`${catalogI18n.labels.lengthUpTo} ${filters.lengthMax} cm`);
    }

    activeFilters.innerHTML = chips.map((chip) => `<span class="filter-chip">${chip}</span>`).join("");
}

function renderSliderValues(filters) {
    if (widthValue) {
        widthValue.textContent = `${filters.widthMax} cm`;
    }

    if (lengthValue) {
        lengthValue.textContent = `${filters.lengthMax} cm`;
    }
}

function renderCatalog() {
    if (!productGrid || !resultsCount || !emptyState) {
        return;
    }

    const filters = getFormState();
    const filteredProducts = filterProducts(filters);
    renderSliderValues(filters);
    renderActiveFilters(filters);

    resultsCount.textContent = catalogI18n.labels.results(filteredProducts.length, catalogProducts.length);
    productGrid.innerHTML = filteredProducts.map(createProductCard).join("");

    if (!catalogProducts.length) {
        emptyState.hidden = false;
        emptyState.textContent = catalogI18n.labels.emptyCatalog;
        return;
    }

    if (!filteredProducts.length) {
        emptyState.hidden = false;
        emptyState.textContent = catalogI18n.labels.noMatch;
        return;
    }

    emptyState.hidden = true;
}

function isMobileFiltersMode() {
    return window.matchMedia("(max-width: 759px)").matches;
}

function setFiltersOpen(isOpen) {
    if (!filtersPanel || !filtersOverlay || !isMobileFiltersMode()) {
        return;
    }

    filtersPanel.classList.toggle("is-open", isOpen);
    filtersOverlay.hidden = !isOpen;
    document.body.classList.toggle("filters-open", isOpen);
    if (openFiltersButton) {
        openFiltersButton.setAttribute("aria-expanded", String(isOpen));
    }
}

if (catalogForm) {
    catalogForm.addEventListener("input", (event) => {
        const target = event.target;

        if (target instanceof HTMLInputElement && target.type === "range") {
            renderSliderValues(getFormState());
            return;
        }

        renderCatalog();
    });
    catalogForm.addEventListener("change", renderCatalog);
    catalogForm.addEventListener("change", () => {
        if (isMobileFiltersMode()) {
            setFiltersOpen(false);
        }
    });
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        if (catalogForm) {
            const widthRange = catalogForm.elements.namedItem("widthMax");
            const lengthRange = catalogForm.elements.namedItem("lengthMax");

            if (widthRange instanceof HTMLInputElement) {
                widthRange.value = String(maxWidth);
            }

            if (lengthRange instanceof HTMLInputElement) {
                lengthRange.value = String(maxLength);
            }
        }

        window.requestAnimationFrame(renderCatalog);
    });
}

if (openFiltersButton) {
    openFiltersButton.addEventListener("click", () => {
        const isOpen = filtersPanel?.classList.contains("is-open");
        setFiltersOpen(!isOpen);
    });
}

if (closeFiltersButton) {
    closeFiltersButton.addEventListener("click", () => {
        setFiltersOpen(false);
    });
}

if (filtersOverlay) {
    filtersOverlay.addEventListener("click", () => {
        setFiltersOpen(false);
    });
}

document.addEventListener("click", (event) => {
    if (!isMobileFiltersMode()) {
        return;
    }

    if (!filtersPanel?.classList.contains("is-open")) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    const clickedInsidePanel = filtersPanel.contains(target);
    const clickedOpenButton = openFiltersButton?.contains(target);

    if (!clickedInsidePanel && !clickedOpenButton) {
        setFiltersOpen(false);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setFiltersOpen(false);
    }
});

window.addEventListener("resize", () => {
    if (!isMobileFiltersMode()) {
        if (filtersPanel) {
            filtersPanel.classList.remove("is-open");
        }
        if (filtersOverlay) {
            filtersOverlay.hidden = true;
        }
        document.body.classList.remove("filters-open");
    }
});

async function loadCatalogProducts() {
    const response = await fetch("products.json", {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Impossibile caricare il catalogo prodotti.");
    }

    catalogProducts = await response.json();
    maxWidth = Math.max(...catalogProducts.map((product) => product.widthCm), 0);
    maxLength = Math.max(...catalogProducts.map((product) => product.lengthCm), 0);

    if (catalogForm) {
        const widthRange = catalogForm.elements.namedItem("widthMax");
        const lengthRange = catalogForm.elements.namedItem("lengthMax");

        if (widthRange instanceof HTMLInputElement) {
            widthRange.max = String(maxWidth);
            widthRange.value = String(maxWidth);
        }

        if (lengthRange instanceof HTMLInputElement) {
            lengthRange.max = String(maxLength);
            lengthRange.value = String(maxLength);
        }
    }

    if (totalProductsTarget) {
        totalProductsTarget.textContent = String(catalogProducts.length);
    }

    renderCatalog();
}

loadCatalogProducts().catch((error) => {
    if (resultsCount) {
        resultsCount.textContent = error.message;
    }

    if (emptyState) {
        emptyState.hidden = false;
        emptyState.textContent = catalogI18n.labels.unavailable;
    }
});
