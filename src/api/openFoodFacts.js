const BASE_URL = 'https://world.openfoodfacts.org';

export const getProductsByCategory = async (category, page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/category/${category}/${page}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
};

const rawSearchCache = {};
const CACHE_DURATION = 5 * 60 * 1000;

export const searchProductsByName = async (name, page = 1) => {
    const cacheKey = `${name}-${page}`;
    const cachedData = rawSearchCache[cacheKey];

    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        console.log(`Returning cached raw data for ${cacheKey}`);
        return cachedData.products;
    }

    try {
        const response = await fetch(`${BASE_URL}/cgi/search.pl?search_terms=${name}&page=${page}&page_size=100&json=true`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        rawSearchCache[cacheKey] = {
            products: data.products,
            timestamp: Date.now(),
        };
        return data.products;
    } catch (error) {
        console.error("Error searching products by name:", error);
        return [];
    }
};

export const fuzzySearchProductsByName = async (name, page = 1) => {
    const allProducts = await searchProductsByName(name, 1);

    if (!name) {
        return allProducts;
    }

    const lowerCaseName = name.toLowerCase();
    const filteredProducts = allProducts.filter(product =>
        product.product_name && product.product_name.toLowerCase().includes(lowerCaseName)
    );

    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredProducts.slice(startIndex, endIndex);
};

export const getProductByBarcode = async (barcode) => {
    try {
        const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.product;
    } catch (error) {
        console.error("Error fetching product by barcode:", error);
        return null;
    }
};



export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.tags.filter(tag => tag.products > 0).map(tag => tag.name);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
