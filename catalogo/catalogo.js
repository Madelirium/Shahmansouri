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
const subcategoryOptions = document.querySelector("[data-subcategory-options]");
const searchInput = catalogForm?.elements?.namedItem("search") || null;
const viewToggle = document.querySelector("[data-view-toggle]");
const viewButtons = Array.from(document.querySelectorAll("[data-view-columns]"));
const mobileColumnsToggle = document.querySelector("[data-mobile-columns-toggle]");
const catalogLayout = document.querySelector(".catalog-layout");
const quickFilters = document.querySelector("[data-quick-filters]");
const quickSearchInput = document.querySelector("[data-quick-search]");
const quickCategorySelect = document.querySelector("[data-quick-category]");
const quickCategoryToggle = document.querySelector("[data-quick-category-toggle]");
const quickCategoryPanel = document.querySelector("[data-quick-category-panel]");
const quickMaterialSelect = document.querySelector("[data-quick-material]");
const quickSortSelect = document.querySelector("[data-quick-sort]");
const quickSortToggle = document.querySelector("[data-quick-sort-toggle]");
const quickSortPanel = document.querySelector("[data-quick-sort-panel]");
const quickLengthMinInput = document.querySelector("[data-quick-length-min]");
const quickLengthInput = document.querySelector("[data-quick-length-max]");
const quickWidthMinInput = document.querySelector("[data-quick-width-min]");
const quickWidthInput = document.querySelector("[data-quick-width-max]");
const quickMeasuresToggle = document.querySelector("[data-quick-measures-toggle]");
const quickMeasuresPanel = document.querySelector("[data-quick-measures-panel]");
const quickMeasuresClearButton = document.querySelector("[data-quick-measures-clear]");
const quickMeasureUnitButtons = Array.from(document.querySelectorAll("[data-quick-measure-unit]"));
const quickResetButton = document.querySelector("[data-quick-reset]");
const quickResultsCount = document.querySelector("[data-quick-results-count]");

let catalogProducts = [];
let maxWidth = 0;
let maxLength = 0;
let minimumWidth = null;
let minimumLength = null;
let quickMeasureUnit = "cm";
let shouldScrollToCatalogResults = false;

function placeQuickFiltersAboveCatalog() {
    if (!quickFilters || !catalogLayout || !filtersPanel) {
        return;
    }

    // Keep the desktop controls above both the sidebar and the product selection.
    catalogLayout.insertBefore(quickFilters, filtersPanel);
}

function requestCatalogResultsScroll() {
    shouldScrollToCatalogResults = true;
}

function scrollToCatalogResults() {
    if (!shouldScrollToCatalogResults || !catalogLayout) {
        return;
    }

    shouldScrollToCatalogResults = false;
    // A sticky element reports its fixed viewport position, not its original page position.
    const targetTop = window.scrollY + catalogLayout.getBoundingClientRect().top - 10;

    window.requestAnimationFrame(() => {
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
    });
}

function setQuickMeasuresOpen(isOpen, shouldFocus = false) {
    if (!quickMeasuresPanel || !(quickMeasuresToggle instanceof HTMLButtonElement)) {
        return;
    }

    quickMeasuresPanel.hidden = !isOpen;
    quickMeasuresToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && shouldFocus && quickLengthMinInput instanceof HTMLInputElement) {
        quickLengthMinInput.focus();
    }
}

function setQuickCategoryOpen(isOpen, shouldFocus = false) {
    if (!quickCategoryPanel || !(quickCategoryToggle instanceof HTMLButtonElement)) {
        return;
    }

    quickCategoryPanel.hidden = !isOpen;
    quickCategoryToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        setQuickMeasuresOpen(false);
        setQuickSortOpen(false);
        if (shouldFocus) {
            quickCategoryPanel.querySelector("button")?.focus();
        }
    }
}

function setQuickSortOpen(isOpen, shouldFocus = false) {
    if (!quickSortPanel || !(quickSortToggle instanceof HTMLButtonElement)) {
        return;
    }

    quickSortPanel.hidden = !isOpen;
    quickSortToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        setQuickMeasuresOpen(false);
        setQuickCategoryOpen(false);
        if (shouldFocus) {
            quickSortPanel.querySelector("button")?.focus();
        }
    }
}

const CATALOG_VIEW_KEY = "shahmansouri_catalog_columns_v2";
const CATALOG_MOBILE_VIEW_KEY = "shahmansouri_catalog_mobile_columns_v1";
const DEFAULT_CATALOG_COLUMNS = "4";

const isEnglishCatalog = document.documentElement.lang.toLowerCase().startsWith("en");
const CARD_IMAGE_SIZES = "(max-width: 759px) calc(100vw - 72px), (max-width: 1399px) 320px, 240px";
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
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[-_/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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
    const requestedSubcategory = new URLSearchParams(window.location.search).get("subcategory");
    if (requestedSubcategory && subcategoryOptions) {
        const checkbox = Array.from(subcategoryOptions.querySelectorAll("input[name='subcategories']"))
            .find((input) => normalizeText(input.value) === normalizeText(requestedSubcategory));
        if (checkbox instanceof HTMLInputElement) checkbox.checked = true;
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

function getProductSubcategories(product) {
    const values = isEnglishCatalog && Array.isArray(product.subcategoriesEn) && product.subcategoriesEn.length
        ? product.subcategoriesEn
        : product.subcategories;
    return (Array.isArray(values) ? values : []).map((item) => String(item || "").trim()).filter(Boolean);
}

function getUniqueSubcategories(products) {
    return Array.from(new Set(products.flatMap(getProductSubcategories)))
        .sort((left, right) => left.localeCompare(right, catalogI18n.locale));
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

    if (quickCategorySelect) {
        const allTypesLabel = isEnglishCatalog ? "All types" : "Tutte le tipologie";
        const categories = getUniqueCategories(catalogProducts);
        quickCategorySelect.innerHTML = [
            `<option value="">${allTypesLabel}</option>`,
            ...categories.map((category) => (
                `<option value="${category}">${translateCategory(category)}</option>`
            ))
        ].join("");

        if (quickCategoryPanel) {
            quickCategoryPanel.innerHTML = [
                { value: "", label: allTypesLabel },
                ...categories.map((category) => ({ value: category, label: translateCategory(category) }))
            ].map(({ value, label }) => (
                `<button type="button" class="catalog-quick-category__option" data-quick-category-option="${value}" role="option" aria-selected="false">${label}</button>`
            )).join("");
        }

        syncQuickCategoryControl(quickCategorySelect.value);
    }

    if (subcategoryOptions) {
        subcategoryOptions.innerHTML = catalogProducts.length
            ? getUniqueSubcategories(catalogProducts)
                .map((subcategory) => createFilterCheckbox("subcategories", subcategory, subcategory))
                .join("")
            : "";
    }

    buildTypeTree(quickCategoryPanel, false);
    if (categoryOptions) {
        categoryOptions.hidden = true;
        let tree = document.querySelector("[data-mobile-type-tree]");
        if (!tree) {
            tree = document.createElement("div");
            tree.dataset.mobileTypeTree = "";
            categoryOptions.after(tree);
            categoryOptions.closest("details").open = false;
        }
        buildTypeTree(tree, true);
    }
    if (subcategoryOptions) subcategoryOptions.closest("details").hidden = true;

    if (quickMaterialSelect) {
        const allMaterialsLabel = isEnglishCatalog ? "All materials" : "Tutti i materiali";
        quickMaterialSelect.innerHTML = [
            `<option value="">${allMaterialsLabel}</option>`,
            ...getUniqueMaterials(catalogProducts).map((material) => (
                `<option value="${material}">${translateMaterial(material)}</option>`
            ))
        ].join("");
    }
}

function buildTypeTree(host, mobile) {
    if (!host) return;
    host.replaceChildren();
    host.setAttribute("role", "group");
    getUniqueCategories(catalogProducts).forEach((category, index) => {
        const row = document.createElement("div");
        row.className = "type-tree-row";
        const choose = (subtype = "") => {
            setQuickCheckboxFilter("categories", category);
            setQuickCheckboxFilter("subcategories", subtype);
            if (quickCategorySelect) quickCategorySelect.value = category;
            renderCatalog();
            if (!mobile) setQuickCategoryOpen(false);
        };
        const name = document.createElement("button");
        let openSubtypes;
        name.type = "button";
        name.textContent = translateCategory(category);
        name.addEventListener("click", () => {
            choose();
            if (mobile) openSubtypes?.();
        });
        row.append(name);
        const subtypes = getUniqueSubcategories(catalogProducts.filter((product) => getProductCategoryValues(product).includes(category)));
        if (subtypes.length) {
            const arrow = document.createElement("button");
            arrow.type = "button";
            arrow.className = "type-tree-arrow";
            arrow.textContent = "▸";
            arrow.setAttribute("aria-label", `${isEnglishCatalog ? "Subtypes" : "Sottotipologie"}: ${category}`);
            arrow.setAttribute("aria-expanded", "false");
            const panel = document.createElement("div");
            panel.className = "type-tree-children";
            panel.id = `type-tree-${mobile ? "mobile" : "desktop"}-${index}`;
            panel.hidden = true;
            arrow.setAttribute("aria-controls", panel.id);
            const expand = (open) => {
                host.querySelectorAll(".type-tree-children").forEach((item) => { item.hidden = true; });
                host.querySelectorAll("[aria-expanded]").forEach((item) => item.setAttribute("aria-expanded", "false"));
                host.querySelectorAll(".type-tree-arrow").forEach((item) => { item.textContent = "▸"; });
                panel.hidden = !open;
                arrow.setAttribute("aria-expanded", String(open));
                arrow.textContent = open ? "▾" : "▸";
                if (mobile) name.setAttribute("aria-expanded", String(open));
            };
            if (mobile) {
                name.setAttribute("aria-controls", panel.id);
                name.setAttribute("aria-expanded", "false");
                openSubtypes = () => expand(panel.hidden);
            }
            arrow.addEventListener("click", () => expand(panel.hidden));
            row.addEventListener("mouseenter", () => { if (!mobile && matchMedia("(hover: hover)").matches) expand(true); });
            row.addEventListener("mouseleave", () => { if (!mobile && !row.contains(document.activeElement)) expand(false); });
            row.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) { event.stopPropagation(); expand(false); arrow.focus(); } });
            subtypes.forEach((subtype) => {
                const child = document.createElement("button");
                child.type = "button";
                child.textContent = subtype;
                child.addEventListener("click", () => choose(subtype));
                panel.append(child);
            });
            row.append(arrow, panel);
        }
        host.append(row);
    });
}

function syncQuickCategoryControl(value) {
    if (!(quickCategoryToggle instanceof HTMLButtonElement)) {
        return;
    }

    const selectedValue = String(value || "");
    const selectedOption = quickCategorySelect?.querySelector(`option[value="${CSS.escape(selectedValue)}"]`);
    quickCategoryToggle.textContent = selectedOption?.textContent || (isEnglishCatalog ? "All types" : "Tutte le tipologie");

    quickCategoryPanel?.querySelectorAll("[data-quick-category-option]").forEach((option) => {
        option.setAttribute("aria-selected", String(option.dataset.quickCategoryOption === selectedValue));
    });
}

function syncQuickSortControl() {
    if (!(quickSortSelect instanceof HTMLSelectElement) || !(quickSortToggle instanceof HTMLButtonElement)) {
        return;
    }

    const selectedValue = quickSortSelect.value;
    const selectedOption = Array.from(quickSortSelect.options).find((option) => option.value === selectedValue);
    const label = isEnglishCatalog ? "Sort" : "Ordina";
    quickSortToggle.textContent = `${label}: ${selectedOption?.textContent || ""}`;

    quickSortPanel?.querySelectorAll("[data-quick-sort-option]").forEach((option) => {
        option.setAttribute("aria-selected", String(option.dataset.quickSortOption === selectedValue));
    });
}

function parseOptionalDimension(value) {
    const normalized = String(value || "").trim();
    if (!normalized) {
        return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function convertQuickMeasureToCentimeters(value) {
    const parsed = parseOptionalDimension(value);
    if (parsed === null) {
        return null;
    }

    return quickMeasureUnit === "in" ? Math.round(parsed * 2.54) : Math.round(parsed);
}

function formatQuickMeasure(value) {
    if (value === null) {
        return "";
    }

    if (quickMeasureUnit !== "in") {
        return String(value);
    }

    return String(Math.round((value / 2.54) * 10) / 10);
}

function formatProductDimensions(product) {
    if (!Number.isFinite(product.lengthCm) || !Number.isFinite(product.widthCm)) {
        return product.dimensions;
    }

    const unit = quickMeasureUnit === "in" ? "in" : "cm";
    return `${formatQuickMeasure(product.lengthCm)} x ${formatQuickMeasure(product.widthCm)} ${unit}`;
}

function setQuickMeasureUnit(unit) {
    quickMeasureUnit = unit === "in" ? "in" : "cm";

    quickMeasureUnitButtons.forEach((button) => {
        const isActive = button.dataset.quickMeasureUnit === quickMeasureUnit;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    renderCatalog();
}

document.querySelectorAll("[data-mobile-minimum]").forEach((input) => {
    input.addEventListener("input", () => {
        if (input.dataset.mobileMinimum === "length") minimumLength = parseOptionalDimension(input.value);
        else minimumWidth = parseOptionalDimension(input.value);
    });
});

function getFormState() {
    if (!catalogForm) {
        return {
            search: "",
            categories: [],
            subcategories: [],
            materials: [],
            widthMinimum: null,
            lengthMinimum: null,
            widthTarget: null,
            lengthTarget: null
        };
    }

    const formData = new FormData(catalogForm);
    return {
        search: normalizeText(String(formData.get("search") || "")),
        categories: formData.getAll("categories").map((value) => String(value)),
        subcategories: formData.getAll("subcategories").map((value) => String(value)),
        materials: [],
        widthMinimum: minimumWidth,
        lengthMinimum: minimumLength,
        widthTarget: parseOptionalDimension(formData.get("widthTarget")),
        lengthTarget: parseOptionalDimension(formData.get("lengthTarget"))
    };
}

function matchesDimensionRange(value, minimum, maximum) {
    if (minimum !== null && value < minimum) {
        return false;
    }

    return maximum === null || value <= maximum + 15;
}

function matchesDimensions(product, filters) {
    const matchesAsEntered = matchesDimensionRange(product.widthCm, filters.widthMinimum, filters.widthTarget)
        && matchesDimensionRange(product.lengthCm, filters.lengthMinimum, filters.lengthTarget);

    const matchesWithSidesSwapped = matchesDimensionRange(product.lengthCm, filters.widthMinimum, filters.widthTarget)
        && matchesDimensionRange(product.widthCm, filters.lengthMinimum, filters.lengthTarget);

    return matchesAsEntered || matchesWithSidesSwapped;
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
        ...(Array.isArray(product.subcategories) ? product.subcategories : []),
        ...(Array.isArray(product.subcategoriesEn) ? product.subcategoriesEn : []),
        product.material,
        product.materialEn,
        product.origin,
        product.description,
        product.descriptionEn,
        ...(Array.isArray(product.materialsEn) ? product.materialsEn : []),
        ...(Array.isArray(product.tags) ? product.tags : [])
    ].filter(Boolean).join(" ");

    return normalizeText(haystack).includes(query);
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
            && (!filters.subcategories.length || filters.subcategories.some((subcategory) => getProductSubcategories(product).includes(subcategory)))
            && matchesDimensions(product, filters);
    });
}

function getProductArea(product) {
    return (Number(product.widthCm) || 0) * (Number(product.lengthCm) || 0);
}

function sortProducts(products) {
    const sortOrder = quickSortSelect instanceof HTMLSelectElement ? quickSortSelect.value : "newest";
    const sortedProducts = [...products];

    if (sortOrder === "oldest") {
        return sortedProducts;
    }

    if (sortOrder === "size-desc") {
        return sortedProducts.sort((left, right) => getProductArea(right) - getProductArea(left));
    }

    if (sortOrder === "size-asc") {
        return sortedProducts.sort((left, right) => getProductArea(left) - getProductArea(right));
    }

    if (sortOrder === "name-asc" || sortOrder === "name-desc") {
        const direction = sortOrder === "name-desc" ? -1 : 1;
        return sortedProducts.sort((left, right) => {
            const leftTitle = isEnglishCatalog && left.titleEn ? left.titleEn : left.title;
            const rightTitle = isEnglishCatalog && right.titleEn ? right.titleEn : right.title;
            return direction * String(leftTitle || "").localeCompare(String(rightTitle || ""), catalogI18n.locale);
        });
    }

    // The product generator appends new entries to products.json, so reversing
    // the source sequence reliably presents the latest entries first.
    return sortedProducts.reverse();
}

function getResponsiveCatalogImageSources(product) {
    const imagePath = typeof product?.coverImage === "string" ? product.coverImage : "";
    const image360 = typeof product?.coverImage360 === "string" ? product.coverImage360 : "";
    const image640 = typeof product?.coverImage640 === "string" ? product.coverImage640 : "";

    if (!imagePath) {
        return {
            src: imagePath,
            srcset: "",
            sizes: ""
        };
    }

    const srcsetParts = [];
    if (image360) {
        srcsetParts.push(`${image360} 360w`);
    }
    if (image640) {
        srcsetParts.push(`${image640} 640w`);
    }
    if (srcsetParts.length) {
        srcsetParts.push(`${imagePath} 1080w`);
    }

    return {
        src: image640 || image360 || imagePath,
        srcset: srcsetParts.join(", "),
        sizes: srcsetParts.length ? CARD_IMAGE_SIZES : ""
    };
}

function createProductCard(product, index = 0) {
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

    const image = getResponsiveCatalogImageSources(product);
    const imageLoading = index < 4 ? "eager" : "lazy";
    const imageFetchPriority = index === 0 ? ' fetchpriority="high"' : "";
    const imageSrcset = image.srcset ? ` srcset="${image.srcset}" sizes="${image.sizes}"` : "";

    return `
        <article class="product-card">
            <div class="product-card__media">
                <a href="${productPage}" data-track="click_catalog_product" data-product-name="${productName}" data-track-label="${catalogI18n.labels.openCard}">
                    <img src="${image.src}"${imageSrcset} alt="${cardAlt}" loading="${imageLoading}" decoding="async" width="800" height="600"${imageFetchPriority}>
                </a>
            </div>
            <div class="product-card__body">
                ${priceMarkup ? `<div class="product-card__meta">${priceMarkup}</div>` : ""}
                <div>
                    <h3 class="product-card__title"><a href="${productPage}" data-track="click_catalog_product" data-product-name="${productName}" data-track-label="${catalogI18n.labels.openCard}">${cardTitle}</a></h3>
                </div>
                <ul class="product-card__detail-list" aria-label="${catalogI18n.labels.productDetails}">
                    <li><strong>${catalogI18n.labels.measures}:</strong> ${formatProductDimensions(product)}</li>
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

    filters.subcategories.forEach((subcategory) => {
        chips.push(subcategory);
    });

    if (filters.widthTarget !== null) {
        chips.push(`${catalogI18n.labels.widthDesired}: ${filters.widthTarget} cm`);
    }

    if (filters.widthMinimum !== null) {
        chips.push(`${catalogI18n.labels.widthDesired} min: ${filters.widthMinimum} cm`);
    }

    if (filters.lengthTarget !== null) {
        chips.push(`${catalogI18n.labels.lengthDesired}: ${filters.lengthTarget} cm`);
    }

    if (filters.lengthMinimum !== null) {
        chips.push(`${catalogI18n.labels.lengthDesired} min: ${filters.lengthMinimum} cm`);
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

function syncQuickFilters(filters) {
    if (!quickFilters) {
        return;
    }

    if (quickSearchInput instanceof HTMLInputElement) {
        quickSearchInput.value = filters.search;
    }

    if (quickCategorySelect instanceof HTMLSelectElement) {
        quickCategorySelect.value = filters.categories.length === 1 ? filters.categories[0] : "";
        syncQuickCategoryControl(quickCategorySelect.value);
    }

    if (quickMaterialSelect instanceof HTMLSelectElement) {
        quickMaterialSelect.value = filters.materials.length === 1 ? filters.materials[0] : "";
    }

    // Keep the value being typed intact: converting inches on every keystroke
    // would otherwise replace it with a rounded value before it can be edited.
    if (quickLengthInput instanceof HTMLInputElement && document.activeElement !== quickLengthInput) {
        quickLengthInput.value = formatQuickMeasure(filters.lengthTarget);
    }

    if (quickLengthMinInput instanceof HTMLInputElement && document.activeElement !== quickLengthMinInput) {
        quickLengthMinInput.value = formatQuickMeasure(filters.lengthMinimum);
    }

    if (quickWidthInput instanceof HTMLInputElement && document.activeElement !== quickWidthInput) {
        quickWidthInput.value = formatQuickMeasure(filters.widthTarget);
    }

    if (quickWidthMinInput instanceof HTMLInputElement && document.activeElement !== quickWidthMinInput) {
        quickWidthMinInput.value = formatQuickMeasure(filters.widthMinimum);
    }

    if (quickMeasuresToggle instanceof HTMLButtonElement) {
        const activeMeasures = [filters.lengthMinimum, filters.lengthTarget, filters.widthMinimum, filters.widthTarget]
            .filter((value) => value !== null).length;
        const label = isEnglishCatalog ? "Size" : "Misure";
        quickMeasuresToggle.textContent = activeMeasures ? `${label} (${activeMeasures})` : label;
    }
}

function setQuickCheckboxFilter(name, value) {
    if (!catalogForm) {
        return;
    }

    catalogForm.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
        if (input instanceof HTMLInputElement) {
            input.checked = Boolean(value) && input.value === value;
        }
    });
}

function updateFromQuickFilters() {
    if (!catalogForm) {
        return;
    }

    if (searchInput instanceof HTMLInputElement && quickSearchInput instanceof HTMLInputElement) {
        searchInput.value = quickSearchInput.value;
    }

    setQuickCheckboxFilter("categories", quickCategorySelect instanceof HTMLSelectElement ? quickCategorySelect.value : "");
    if (quickMaterialSelect instanceof HTMLSelectElement) {
        setQuickCheckboxFilter("materials", quickMaterialSelect.value);
    }

    if (lengthInput instanceof HTMLInputElement && quickLengthInput instanceof HTMLInputElement) {
        const lengthMaximum = convertQuickMeasureToCentimeters(quickLengthInput.value);
        lengthInput.value = lengthMaximum === null ? "" : String(lengthMaximum);
        syncRangeFromInput(lengthInput, lengthRange, maxLength);
    }

    if (widthInput instanceof HTMLInputElement && quickWidthInput instanceof HTMLInputElement) {
        const widthMaximum = convertQuickMeasureToCentimeters(quickWidthInput.value);
        widthInput.value = widthMaximum === null ? "" : String(widthMaximum);
        syncRangeFromInput(widthInput, widthRange, maxWidth);
    }

    minimumLength = quickLengthMinInput instanceof HTMLInputElement
        ? convertQuickMeasureToCentimeters(quickLengthMinInput.value)
        : null;
    minimumWidth = quickWidthMinInput instanceof HTMLInputElement
        ? convertQuickMeasureToCentimeters(quickWidthMinInput.value)
        : null;

    renderSliderValues(getFormState());
    renderCatalog();
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

    minimumWidth = null;
    minimumLength = null;
    setQuickMeasuresOpen(false);

    renderSliderValues(getFormState());
    requestCatalogResultsScroll();
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
    document.querySelectorAll("[data-mobile-minimum]").forEach((input) => {
        if (input !== document.activeElement) input.value = (input.dataset.mobileMinimum === "length" ? minimumLength : minimumWidth) ?? "";
    });
    if (!productGrid || !resultsCount || !emptyState) {
        return;
    }

    const filters = getFormState();
    const filteredProducts = sortProducts(filterProducts(filters));
    renderSliderValues(filters);
    renderActiveFilters(filters);
    syncQuickFilters(filters);
    syncQuickSortControl();

    resultsCount.textContent = catalogI18n.labels.results(filteredProducts.length, catalogProducts.length);
    if (quickResultsCount) {
        quickResultsCount.textContent = catalogI18n.labels.results(filteredProducts.length, catalogProducts.length);
    }
    productGrid.innerHTML = filteredProducts.map((product, index) => createProductCard(product, index)).join("");
    productGrid.classList.remove("product-grid--skeleton");
    productGrid.setAttribute("aria-busy", "false");
    scrollToCatalogResults();

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
    return value === "2" || value === "3" || value === "4";
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
        return window.localStorage.getItem(CATALOG_MOBILE_VIEW_KEY) !== "1";
    } catch (error) {
        return true;
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
    productGrid.classList.toggle("product-grid--4cols", columns === "4");

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

function setInertState(element, shouldBeInert) {
    if (!element) {
        return;
    }

    if (shouldBeInert) {
        element.setAttribute("inert", "");
        element.setAttribute("aria-hidden", "true");
        element.inert = true;
        return;
    }

    element.removeAttribute("inert");
    element.removeAttribute("aria-hidden");
    element.inert = false;
}

function getFiltersFocusableElements() {
    if (!filtersPanel) {
        return [];
    }

    return Array.from(
        filtersPanel.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')
    ).filter((element) => {
        if (!(element instanceof HTMLElement)) {
            return false;
        }

        if (element.hasAttribute("disabled")) {
            return false;
        }

        return element.getAttribute("tabindex") !== "-1";
    });
}

function focusFirstFiltersControl() {
    const firstFocusable = getFiltersFocusableElements()[0];
    if (!(firstFocusable instanceof HTMLElement)) {
        return;
    }

    window.setTimeout(() => {
        firstFocusable.focus();
    }, 80);
}

function syncFiltersAccessibility(isOpen) {
    if (!filtersPanel) {
        return;
    }

    if (!isMobileFiltersMode()) {
        setInertState(filtersPanel, false);
        return;
    }

    setInertState(filtersPanel, !isOpen);
}

function setFiltersOpen(isOpen) {
    if (!filtersPanel || !filtersOverlay) {
        return;
    }

    if (!isMobileFiltersMode()) {
        syncFiltersAccessibility(false);
        return;
    }

    const wasOpen = filtersPanel.classList.contains("is-open");
    filtersPanel.classList.toggle("is-open", isOpen);
    filtersOverlay.hidden = !isOpen;
    document.body.classList.toggle("filters-open", isOpen);
    if (openFiltersButton) {
        openFiltersButton.setAttribute("aria-expanded", String(isOpen));
    }
    syncFiltersAccessibility(isOpen);

    if (isOpen && !wasOpen) {
        focusFirstFiltersControl();
        return;
    }

    if (!isOpen && wasOpen && openFiltersButton instanceof HTMLButtonElement) {
        window.requestAnimationFrame(() => {
            openFiltersButton.focus();
        });
    }
}

if (catalogForm) {
    catalogForm.addEventListener("input", (event) => {
        requestCatalogResultsScroll();
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

    catalogForm.addEventListener("change", () => {
        requestCatalogResultsScroll();
        renderCatalog();
    });
}

if (quickFilters) {
    quickFilters.addEventListener("submit", (event) => {
        event.preventDefault();
    });

    quickFilters.addEventListener("input", () => {
        requestCatalogResultsScroll();
        updateFromQuickFilters();
    });
    quickFilters.addEventListener("change", () => {
        requestCatalogResultsScroll();
        updateFromQuickFilters();
    });
}

quickMeasureUnitButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setQuickMeasureUnit(button.dataset.quickMeasureUnit || "cm");
    });
});

if (quickResetButton) {
    quickResetButton.addEventListener("click", resetCatalogFilters);
}

if (quickMeasuresToggle) {
    const measuresControl = quickMeasuresToggle.closest(".catalog-quick-measures");
    let closeMeasuresTimer;
    measuresControl?.addEventListener("mouseenter", () => {
        clearTimeout(closeMeasuresTimer);
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            setQuickMeasuresOpen(true);
            setQuickCategoryOpen(false);
            setQuickSortOpen(false);
        }
    });
    measuresControl?.addEventListener("mouseleave", () => {
        closeMeasuresTimer = setTimeout(() => {
            if (!measuresControl.contains(document.activeElement)) setQuickMeasuresOpen(false);
        }, 200);
    });
    quickMeasuresToggle.addEventListener("click", () => {
        const isOpen = quickMeasuresToggle.getAttribute("aria-expanded") === "true";
        setQuickMeasuresOpen(!isOpen, !isOpen);
        if (!isOpen) {
            setQuickCategoryOpen(false);
            setQuickSortOpen(false);
        }
    });
}

if (quickCategoryToggle) {
    const categoryControl = quickCategoryToggle.closest(".catalog-quick-category");
    let closeCategoryTimer;
    categoryControl?.addEventListener("mouseenter", () => {
        clearTimeout(closeCategoryTimer);
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            setQuickCategoryOpen(true);
        }
    });
    categoryControl?.addEventListener("mouseleave", () => {
        closeCategoryTimer = setTimeout(() => {
            if (!categoryControl.contains(document.activeElement)) setQuickCategoryOpen(false);
        }, 200);
    });
    quickCategoryToggle.addEventListener("click", () => {
        const isOpen = quickCategoryToggle.getAttribute("aria-expanded") === "true";
        setQuickCategoryOpen(!isOpen, !isOpen);
    });
}

if (quickSortToggle) {
    const sortControl = quickSortToggle.closest(".catalog-quick-sort");
    let closeSortTimer;
    sortControl?.addEventListener("mouseenter", () => {
        clearTimeout(closeSortTimer);
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            setQuickSortOpen(true);
        }
    });
    sortControl?.addEventListener("mouseleave", () => {
        closeSortTimer = setTimeout(() => {
            if (!sortControl.contains(document.activeElement)) setQuickSortOpen(false);
        }, 200);
    });
    quickSortToggle.addEventListener("click", () => {
        const isOpen = quickSortToggle.getAttribute("aria-expanded") === "true";
        setQuickSortOpen(!isOpen, !isOpen);
    });
}

if (quickCategoryPanel) {
    quickCategoryPanel.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const option = target.closest("[data-quick-category-option]");
        if (!(option instanceof HTMLButtonElement) || !(quickCategorySelect instanceof HTMLSelectElement)) {
            return;
        }

        quickCategorySelect.value = option.dataset.quickCategoryOption || "";
        requestCatalogResultsScroll();
        updateFromQuickFilters();
        setQuickCategoryOpen(false);
        quickCategoryToggle?.focus();
    });
}

if (quickSortPanel) {
    quickSortPanel.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const option = target.closest("[data-quick-sort-option]");
        if (!(option instanceof HTMLButtonElement) || !(quickSortSelect instanceof HTMLSelectElement)) {
            return;
        }

        quickSortSelect.value = option.dataset.quickSortOption || "newest";
        requestCatalogResultsScroll();
        renderCatalog();
        setQuickSortOpen(false);
        quickSortToggle?.focus();
    });
}

if (quickMeasuresClearButton) {
    quickMeasuresClearButton.addEventListener("click", () => {
        [quickLengthMinInput, quickLengthInput, quickWidthMinInput, quickWidthInput].forEach((input) => {
            if (input instanceof HTMLInputElement) {
                input.value = "";
            }
        });

        requestCatalogResultsScroll();
        updateFromQuickFilters();
    });
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

document.addEventListener("click", (event) => {
    if (!quickSortPanel || !quickSortToggle || !(event.target instanceof Node)) {
        return;
    }

    if (!quickSortPanel.parentElement?.contains(event.target)) {
        setQuickSortOpen(false);
    }
});

document.addEventListener("click", (event) => {
    if (!quickMeasuresPanel || !quickFilters || !(event.target instanceof Node)) {
        return;
    }

    if (!quickFilters.contains(event.target)) {
        setQuickMeasuresOpen(false);
    }
});

document.addEventListener("click", (event) => {
    if (!quickCategoryPanel || !quickFilters || !(event.target instanceof Node)) {
        return;
    }

    if (!quickFilters.contains(event.target)) {
        setQuickCategoryOpen(false);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setFiltersOpen(false);
        if (quickMeasuresToggle?.getAttribute("aria-expanded") === "true") {
            setQuickMeasuresOpen(false);
            quickMeasuresToggle.focus();
        }
        if (quickCategoryToggle?.getAttribute("aria-expanded") === "true") {
            setQuickCategoryOpen(false);
            quickCategoryToggle.focus();
        }
        if (quickSortToggle?.getAttribute("aria-expanded") === "true") {
            setQuickSortOpen(false);
            quickSortToggle.focus();
        }
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

    syncFiltersAccessibility(Boolean(filtersPanel && filtersPanel.classList.contains("is-open")));
});

syncFiltersAccessibility(Boolean(filtersPanel && filtersPanel.classList.contains("is-open")));
placeQuickFiltersAboveCatalog();
window.requestAnimationFrame(() => {
    syncFiltersAccessibility(Boolean(filtersPanel && filtersPanel.classList.contains("is-open")));
});
window.setTimeout(() => {
    syncFiltersAccessibility(Boolean(filtersPanel && filtersPanel.classList.contains("is-open")));
}, 200);

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

productGrid?.classList.add("product-grid--mobile-2cols");

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
    if (productGrid) {
        productGrid.innerHTML = "";
        productGrid.classList.remove("product-grid--skeleton");
        productGrid.setAttribute("aria-busy", "false");
    }

    if (resultsCount) {
        resultsCount.textContent = error.message;
    }

    if (emptyState) {
        emptyState.hidden = false;
        emptyState.textContent = catalogI18n.labels.unavailable;
    }
});
