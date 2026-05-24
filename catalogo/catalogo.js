const catalogForm = document.querySelector("[data-catalog-form]");
const productGrid = document.querySelector("[data-product-grid]");
const resultsCount = document.querySelector("[data-results-count]");
const activeFilters = document.querySelector("[data-active-filters]");
const emptyState = document.querySelector("[data-empty-state]");
const totalProductsTarget = document.querySelector("[data-total-products]");
const resetButton = document.querySelector("[data-reset-filters]");
const widthValue = document.querySelector("[data-width-value]");
const lengthValue = document.querySelector("[data-length-value]");
const widthInput = document.querySelector("[data-width-input]");
const lengthInput = document.querySelector("[data-length-input]");
const widthRange = document.querySelector("[data-width-range]");
const lengthRange = document.querySelector("[data-length-range]");
const openFiltersButton = document.querySelector("[data-open-filters]");
const closeFiltersButton = document.querySelector("[data-close-filters]");
const filtersPanel = document.querySelector("[data-filters-panel]");
const filtersOverlay = document.querySelector("[data-filters-overlay]");
const categoryOptions = document.querySelector("[data-category-options]");
const materialOptions = document.querySelector("[data-material-options]");
const searchInput = catalogForm?.elements?.namedItem("search") || null;
const viewToggle = document.querySelector("[data-view-toggle]");
const viewButtons = Array.from(document.querySelectorAll("[data-view-columns]"));
const mobileColumnsToggle = document.querySelector("[data-mobile-columns-toggle]");

let catalogProducts = [];
let maxWidth = 0;
let maxLength = 0;

const CATALOG_VIEW_KEY = "shahmansouri_catalog_columns_v1";
const CATALOG_MOBILE_VIEW_KEY = "shahmansouri_catalog_mobile_columns_v1";
const DEFAULT_CATALOG_COLUMNS = "2";

const isEnglishCatalog = document.documentElement.lang.toLowerCase().startsWith("en");
const catalogI18n = isEnglishCatalog
    ? {
        locale: "en-GB",
        labels: {
            measures: "Size",
            availability: "Availability",
            priceOnRequest: "Price on request",
            openCard: "Open product",
            search: "Search",
            material: "Material",
            widthDesired: "Desired width",
            lengthDesired: "Desired length",
            results: (filtered, total) => `${filtered} results out of ${total}`,
            emptyCatalog: "The online catalog is being updated.",
            noMatch: "No product matches the selected filters. Try removing some of them.",
            unavailable: "The catalog is currently unavailable.",
            productDetails: "Product details",
            noResultsTitle: "No rugs match the selected filters",
            noResultsText: "Try clearing the filters or contact us: we have more rugs available in our store in Verona.",
            clearFilters: "Clear filters",
            whatsappCta: "Contact us on WhatsApp"
        },
        categories: {
            "Tappeto Antico": "Antique rug",
            "Tappeto classico": "Classic carpet",
            "Tappeto figurativo": "Figurative rug",
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
            availability: "Disponibilità",
            openCard: "Apri scheda",
            search: "Ricerca",
            priceOnRequest: "Prezzo su richiesta",
            material: "Materiale",
            widthDesired: "Larghezza desiderata",
            lengthDesired: "Lunghezza desiderata",
            results: (filtered, total) => `${filtered} risultati su ${total}`,
            emptyCatalog: "Il catalogo online è in aggiornamento.",
            noMatch: "Nessun prodotto corrisponde ai filtri selezionati. Prova a rimuoverne qualcuno.",
            unavailable: "Il catalogo non è disponibile in questo momento.",
            productDetails: "Dettagli prodotto",
            noResultsTitle: "Nessun tappeto corrisponde ai filtri selezionati",
            noResultsText: "Prova a rimuovere i filtri oppure contattaci: abbiamo altri tappeti disponibili in negozio a Verona.",
            clearFilters: "Rimuovi filtri",
            whatsappCta: "Contattaci su WhatsApp"
        },
        categories: {},
        materials: {},
        availability: {}
    };

function normalizeText(value) {
    return value.toLowerCase().trim();
}

function getInitialSearchFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return String(
        params.get("search")
        || params.get("q")
        || params.get("tag")
        || ""
    ).trim();
}

function applyInitialFiltersFromUrl() {
    if (!(searchInput instanceof HTMLInputElement)) {
        return;
    }

    const initialSearch = getInitialSearchFromUrl();
    if (initialSearch) {
        searchInput.value = initialSearch;
    }
}

function translateCategory(value) {
    return catalogI18n.categories[value] || value;
}

function translateMaterial(value) {
    return catalogI18n.materials[normalizeText(String(value))] || value;
}

function getProductCategoryValue(product) {
    if (isEnglishCatalog && String(product.categoryEn || "").trim()) {
        return String(product.categoryEn).trim();
    }

    return String(product.category || "").trim();
}

function getProductCategoryValues(product) {
    const rawCategories = isEnglishCatalog
        ? (Array.isArray(product.categoriesEn) && product.categoriesEn.length ? product.categoriesEn : [product.categoryEn])
        : (Array.isArray(product.categories) && product.categories.length ? product.categories : [product.category]);

    const normalizedCategories = rawCategories
        .map((category) => String(category || "").trim())
        .filter(Boolean);

    if (normalizedCategories.length) {
        return Array.from(new Set(normalizedCategories));
    }

    const fallbackCategory = getProductCategoryValue(product);
    return fallbackCategory ? [fallbackCategory] : [];
}

function getProductMaterialLabels(product) {
    if (isEnglishCatalog && Array.isArray(product.materialsEn) && product.materialsEn.length) {
        return product.materialsEn
            .map((material) => String(material || "").trim())
            .filter(Boolean);
    }

    if (Array.isArray(product.materials) && product.materials.length) {
        return product.materials
            .map((material) => String(material || "").trim())
            .filter(Boolean);
    }

    const fallbackValue = isEnglishCatalog && String(product.materialEn || "").trim()
        ? product.materialEn
        : product.material;

    return extractMaterialTokens(fallbackValue);
}

function translateAvailability(value) {
    return catalogI18n.availability[value] || value;
}

function createFilterCheckbox(name, value, label) {
    return `
        <label class="filters-check">
            <input type="checkbox" name="${name}" value="${value}" data-track="click_catalog_filter" data-filter-name="${name}" data-filter-value="${value}">
            <span>${label}</span>
        </label>
    `;
}

function getUniqueCategories(products) {
    return Array.from(new Set(
        products.flatMap((product) => getProductCategoryValues(product))
    )).sort((left, right) => left.localeCompare(right, catalogI18n.locale));
}

function extractMaterialTokens(materialValue) {
    return String(materialValue || "")
        .split(/,|\/|&|\band\b/gi)
        .map((token) => normalizeText(token))
        .filter(Boolean);
}

function getProductMaterialTokens(product) {
    return getProductMaterialLabels(product)
        .map((material) => normalizeText(String(material)))
        .filter(Boolean);
}

function getUniqueMaterials(products) {
    const materialsMap = new Map();

    products.forEach((product) => {
        getProductMaterialTokens(product).forEach((token) => {
            if (!materialsMap.has(token)) {
                materialsMap.set(token, token);
            }
        });
    });

    return Array.from(materialsMap.keys()).sort((left, right) => left.localeCompare(right, catalogI18n.locale));
}

function renderDynamicFilterOptions() {
    if (categoryOptions) {
        categoryOptions.innerHTML = catalogProducts.length
            ? getUniqueCategories(catalogProducts)
                .map((category) => createFilterCheckbox("categories", category, translateCategory(category)))
                .join("")
            : "";
    }

    if (materialOptions) {
        materialOptions.innerHTML = catalogProducts.length
            ? getUniqueMaterials(catalogProducts)
                .map((material) => createFilterCheckbox("materials", material, translateMaterial(material)))
                .join("")
            : "";
    }
}

function parseOptionalDimension(value) {
    const normalized = String(value || "").trim();
    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function getFormState() {
    if (!catalogForm) {
        return {
            search: "",
            categories: [],
            materials: [],
            widthTarget: null,
            lengthTarget: null
        };
    }

    const formData = new FormData(catalogForm);
    return {
        search: normalizeText(String(formData.get("search") || "")),
        categories: formData.getAll("categories").map((value) => String(value)),
        materials: formData.getAll("materials").map((value) => normalizeText(String(value))),
        widthTarget: parseOptionalDimension(formData.get("widthTarget")),
        lengthTarget: parseOptionalDimension(formData.get("lengthTarget"))
    };
}

function matchesDimensions(product, filters) {
    if (filters.widthTarget !== null && product.widthCm > filters.widthTarget + 15) {
        return false;
    }

    if (filters.lengthTarget !== null && product.lengthCm > filters.lengthTarget + 15) {
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
        product.titleEn,
        product.category,
        product.categoryEn,
        ...(Array.isArray(product.categories) ? product.categories : []),
        ...(Array.isArray(product.categoriesEn) ? product.categoriesEn : []),
        product.material,
        product.materialEn,
        product.origin,
        product.description,
        product.descriptionEn,
        ...(Array.isArray(product.materialsEn) ? product.materialsEn : []),
        ...(Array.isArray(product.tags) ? product.tags : [])
    ].filter(Boolean).join(" ").toLowerCase();

    return haystack.includes(query);
}

function matchesMaterials(product, selectedMaterials) {
    if (!selectedMaterials.length) {
        return true;
    }

    const productMaterials = getProductMaterialTokens(product);
    return selectedMaterials.some((material) => productMaterials.includes(material));
}

function filterProducts(filters) {
    return catalogProducts.filter((product) => {
        const languageMatch = !isEnglishCatalog || product.hasEnglish;
        const productCategories = getProductCategoryValues(product);
        return languageMatch
            && matchesSearch(product, filters.search)
            && (!filters.categories.length || filters.categories.some((category) => productCategories.includes(category)))
            && matchesMaterials(product, filters.materials)
            && matchesDimensions(product, filters);
    });
}

function createProductCard(product) {
    const productPage = isEnglishCatalog && product.hasEnglish && product.slugEn
        ? `products/${product.slugEn}.html`
        : `products/${product.slug}.html`;
    const cardTitle = isEnglishCatalog && product.titleEn ? product.titleEn : product.title;
    const cardAlt = isEnglishCatalog && product.altEn ? product.altEn : product.alt;
    const productName = String(cardTitle).replace(/"/g, '&quot;');
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
    } else {
        priceMarkup = `
            <div class="product-card__price-wrap">
                <span class="product-card__price">${catalogI18n.labels.priceOnRequest}</span>
            </div>
        `;
    }

    return `
        <article class="product-card">
            <div class="product-card__media">
                <a href="${productPage}" data-track="click_catalog_product" data-product-name="${productName}" data-track-label="${catalogI18n.labels.openCard}">
                    <img src="${product.coverImage}" alt="${cardAlt}" loading="lazy" decoding="async" width="800" height="600">
                </a>
            </div>
            <div class="product-card__body">
                ${priceMarkup ? `<div class="product-card__meta">${priceMarkup}</div>` : ""}
                <div>
                    <h3 class="product-card__title"><a href="${productPage}" data-track="click_catalog_product" data-product-name="${productName}" data-track-label="${catalogI18n.labels.openCard}">${cardTitle}</a></h3>
                </div>
                <ul class="product-card__detail-list" aria-label="${catalogI18n.labels.productDetails}">
                    <li><strong>${catalogI18n.labels.measures}:</strong> ${product.dimensions}</li>
                    <li><strong>${catalogI18n.labels.availability}:</strong> ${translateAvailability(product.availability)}</li>
                </ul>
                <div class="product-card__actions">
                    <a class="button button-primary" href="${productPage}" data-track="click_catalog_product" data-product-name="${productName}" data-track-label="${catalogI18n.labels.openCard}">${catalogI18n.labels.openCard}</a>
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

    if (filters.widthTarget !== null) {
        chips.push(`${catalogI18n.labels.widthDesired}: ${filters.widthTarget} cm`);
    }

    if (filters.lengthTarget !== null) {
        chips.push(`${catalogI18n.labels.lengthDesired}: ${filters.lengthTarget} cm`);
    }

    activeFilters.innerHTML = chips.map((chip) => `<span class="filter-chip">${chip}</span>`).join("");
}

function renderSliderValues(filters) {
    if (widthValue) {
        widthValue.textContent = filters.widthTarget !== null ? `${filters.widthTarget} cm` : "-";
    }

    if (lengthValue) {
        lengthValue.textContent = filters.lengthTarget !== null ? `${filters.lengthTarget} cm` : "-";
    }
}

function getCatalogWhatsappUrl() {
    const message = isEnglishCatalog
        ? "Hello, I am looking for a rug but I could not find the right one in the online catalog. Can you help me?"
        : "Buongiorno, sto cercando un tappeto ma non ho trovato quello giusto nel catalogo online. Potete aiutarmi?";

    return `https://wa.me/393392668950?text=${encodeURIComponent(message)}`;
}

function resetCatalogFilters() {
    if (catalogForm) {
        catalogForm.reset();

        if (widthRange instanceof HTMLInputElement) {
            widthRange.value = String(maxWidth);
        }

        if (lengthRange instanceof HTMLInputElement) {
            lengthRange.value = String(maxLength);
        }

        if (widthInput instanceof HTMLInputElement) {
            widthInput.value = "";
        }

        if (lengthInput instanceof HTMLInputElement) {
            lengthInput.value = "";
        }
    }

    renderSliderValues(getFormState());
    renderCatalog();
    setFiltersOpen(false);
}

function renderNoResultsState() {
    if (!emptyState) {
        return;
    }

    emptyState.innerHTML = `
        <div class="catalog-empty__box">
            <h3>${catalogI18n.labels.noResultsTitle}</h3>
            <p>${catalogI18n.labels.noResultsText}</p>
            <div class="catalog-empty__actions">
                <button type="button" class="button button-secondary" data-empty-reset-filters data-track="click_clear_filters">${catalogI18n.labels.clearFilters}</button>
                <a class="button button-primary" href="${getCatalogWhatsappUrl()}" target="_blank" rel="noopener" data-track="click_catalog_no_results_contact">${catalogI18n.labels.whatsappCta}</a>
            </div>
        </div>
    `;
}

function clampDimension(value, maxValue) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
        return null;
    }

    return Math.min(Math.max(Math.round(parsed), 0), maxValue);
}

function syncRangeFromInput(input, range, maxValue) {
    if (!(input instanceof HTMLInputElement) || !(range instanceof HTMLInputElement)) {
        return;
    }

    const normalized = input.value.trim();
    if (!normalized) {
        range.value = String(maxValue);
        return;
    }

    const clamped = clampDimension(normalized, maxValue);
    if (clamped === null) {
        return;
    }

    input.value = String(clamped);
    range.value = String(clamped);
}

function syncInputFromRange(range, input) {
    if (!(range instanceof HTMLInputElement) || !(input instanceof HTMLInputElement)) {
        return;
    }

    const clamped = clampDimension(range.value, Number(range.max));
    if (clamped === null) {
        return;
    }

    range.value = String(clamped);
    input.value = String(clamped);
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
        renderNoResultsState();
        return;
    }

    emptyState.hidden = true;
    emptyState.innerHTML = "";
}

function isValidColumnsValue(value) {
    return value === "2" || value === "3";
}

function getSavedColumnsPreference() {
    try {
        const storedValue = window.localStorage.getItem(CATALOG_VIEW_KEY);
        return isValidColumnsValue(storedValue) ? storedValue : DEFAULT_CATALOG_COLUMNS;
    } catch (error) {
        return DEFAULT_CATALOG_COLUMNS;
    }
}

function saveColumnsPreference(value) {
    if (!isValidColumnsValue(value)) {
        return;
    }

    try {
        window.localStorage.setItem(CATALOG_VIEW_KEY, value);
    } catch (error) {
        // ignore storage failures
    }
}

function getSavedMobileColumnsPreference() {
    try {
        return window.localStorage.getItem(CATALOG_MOBILE_VIEW_KEY) === "2";
    } catch (error) {
        return false;
    }
}

function saveMobileColumnsPreference(isTwoColumns) {
    try {
        window.localStorage.setItem(CATALOG_MOBILE_VIEW_KEY, isTwoColumns ? "2" : "1");
    } catch (error) {
        // ignore storage failures
    }
}

function applyCatalogView(columns) {
    if (!productGrid || !isValidColumnsValue(columns)) {
        return;
    }

    productGrid.classList.toggle("product-grid--3cols", columns === "3");

    viewButtons.forEach((button) => {
        const isActive = button.getAttribute("data-view-columns") === columns;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function applyMobileCatalogView(isTwoColumns) {
    if (!productGrid || !(mobileColumnsToggle instanceof HTMLButtonElement)) {
        return;
    }

    productGrid.classList.toggle("product-grid--mobile-2cols", Boolean(isTwoColumns));
    mobileColumnsToggle.classList.toggle("is-active", Boolean(isTwoColumns));
    mobileColumnsToggle.setAttribute("aria-pressed", String(Boolean(isTwoColumns)));
    mobileColumnsToggle.textContent = isTwoColumns
        ? mobileColumnsToggle.dataset.labelActive || mobileColumnsToggle.textContent
        : mobileColumnsToggle.dataset.labelDefault || mobileColumnsToggle.textContent;
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
            if (target === widthRange) {
                syncInputFromRange(widthRange, widthInput);
            }

            if (target === lengthRange) {
                syncInputFromRange(lengthRange, lengthInput);
            }

            renderSliderValues(getFormState());
            renderCatalog();
            return;
        }

        if (target === widthInput) {
            syncRangeFromInput(widthInput, widthRange, maxWidth);
            renderSliderValues(getFormState());
            renderCatalog();
            return;
        }

        if (target === lengthInput) {
            syncRangeFromInput(lengthInput, lengthRange, maxLength);
            renderSliderValues(getFormState());
            renderCatalog();
            return;
        }

        renderCatalog();
    });

    catalogForm.addEventListener("change", renderCatalog);
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        window.requestAnimationFrame(resetCatalogFilters);
    });
}

if (emptyState) {
    emptyState.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.closest("[data-empty-reset-filters]")) {
            resetCatalogFilters();
        }
    });
}

if (openFiltersButton) {
    openFiltersButton.addEventListener("click", () => {
        const isOpen = Boolean(filtersPanel && filtersPanel.classList.contains("is-open"));
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
    if (!isMobileFiltersMode() || !filtersPanel || !openFiltersButton) {
        return;
    }

    if (!filtersPanel.classList.contains("is-open")) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    const clickedInsidePanel = filtersPanel.contains(target);
    const clickedOpenButton = openFiltersButton.contains(target);

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

if (viewToggle && viewButtons.length) {
    applyCatalogView(getSavedColumnsPreference());

    viewToggle.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) {
            return;
        }

        const columns = target.getAttribute("data-view-columns");
        if (!isValidColumnsValue(columns)) {
            return;
        }

        saveColumnsPreference(columns);
        applyCatalogView(columns);
    });
}

if (mobileColumnsToggle instanceof HTMLButtonElement) {
    applyMobileCatalogView(getSavedMobileColumnsPreference());

    mobileColumnsToggle.addEventListener("click", () => {
        const shouldUseTwoColumns = !productGrid?.classList.contains("product-grid--mobile-2cols");
        saveMobileColumnsPreference(shouldUseTwoColumns);
        applyMobileCatalogView(shouldUseTwoColumns);
    });
}

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
    renderDynamicFilterOptions();

    if (catalogForm) {
        applyInitialFiltersFromUrl();

        if (widthRange instanceof HTMLInputElement) {
            widthRange.max = String(maxWidth);
            widthRange.value = String(maxWidth);
        }

        if (lengthRange instanceof HTMLInputElement) {
            lengthRange.max = String(maxLength);
            lengthRange.value = String(maxLength);
        }

        if (widthInput instanceof HTMLInputElement) {
            widthInput.placeholder = maxWidth
                ? (isEnglishCatalog ? `Ex. ${maxWidth}` : `Es. ${maxWidth}`)
                : widthInput.placeholder;
        }

        if (lengthInput instanceof HTMLInputElement) {
            lengthInput.placeholder = maxLength
                ? (isEnglishCatalog ? `Ex. ${maxLength}` : `Es. ${maxLength}`)
                : lengthInput.placeholder;
        }
    }

    if (totalProductsTarget) {
        totalProductsTarget.textContent = String(filterProducts(getFormState()).length);
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
