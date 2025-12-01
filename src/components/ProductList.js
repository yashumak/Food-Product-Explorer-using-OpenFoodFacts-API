import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, getProductByBarcode, getCategories, fuzzySearchProductsByName } from '../api/openFoodFacts';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeProduct, setBarcodeProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('snacks');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let newProducts = [];
      if (searchTerm) {
        newProducts = await fuzzySearchProductsByName(searchTerm, page);
      } else {
        newProducts = await getProductsByCategory(selectedCategory, page);
      }

      if (newProducts && newProducts.length > 0) {
        const sortedProducts = sortProducts(newProducts, sortOrder);
        setProducts((prevProducts) => (page === 1 ? sortedProducts : [...prevProducts, ...sortedProducts]));
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory, sortOrder]);

  const fetchProductByBarcode = useCallback(async () => {
    setLoading(true);
    try {
      const product = await getProductByBarcode(barcode);
      setBarcodeProduct(product);
    } catch (error) {
      console.error("Error fetching product by barcode:", error);
      setBarcodeProduct(null);
    } finally {
      setLoading(false);
    }
  }, [barcode]);

  useEffect(() => {
    if (barcode) {
      fetchProductByBarcode();
    } else {
      fetchProducts();
    }
  }, [page, searchTerm, barcode, selectedCategory, sortOrder, fetchProductByBarcode, fetchProducts]);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const sortProducts = (productsToSort, order) => {
    if (!order) return productsToSort;

    return [...productsToSort].sort((a, b) => {
      if (order === 'asc' || order === 'desc') {
        const nameA = a.product_name || '';
        const nameB = b.product_name || '';
        if (order === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      } else if (order === 'nutri-asc' || order === 'nutri-desc') {
        const gradeA = a.nutrition_grades || '';
        const gradeB = b.nutrition_grades || '';
        if (order === 'nutri-asc') {
          return gradeA.localeCompare(gradeB);
        } else {
          return gradeB.localeCompare(gradeA);
        }
      }
      return 0;
    });
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const resetProductListState = () => {
    setPage(1);
    setProducts([]);
    setBarcodeProduct(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setBarcode('');
    resetProductListState();
  };

  const handleBarcodeChange = (event) => {
    setBarcode(event.target.value);
    setSearchTerm('');
    resetProductListState();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSearchTerm('');
    setBarcode('');
    resetProductListState();
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    resetProductListState();
  };

  const handleProductClick = (barcode) => {
    navigate(`/product/${barcode}`);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">Food Products</h1>
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full md:w-4/5 p-2 mb-4 border border-gray-300 rounded-md text-base"
      />
      <input
        type="text"
        placeholder="Search by barcode..."
        value={barcode}
        onChange={handleBarcodeChange}
        className="w-full md:w-4/5 p-2 mb-4 border border-gray-300 rounded-md text-base"
      />

      <select onChange={handleCategoryChange} value={selectedCategory} className="p-2 mb-4 border border-gray-300 rounded-md text-base mr-2">
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select onChange={handleSortChange} value={sortOrder} className="p-2 mb-4 border border-gray-300 rounded-md text-base">
        <option value="">Sort by</option>
        <option value="asc">Name (A-Z)</option>
        <option value="desc">Name (Z-A)</option>
        <option value="nutri-asc">Nutrition Grade (A-E)</option>
        <option value="nutri-desc">Nutrition Grade (E-A)</option>
      </select>

      {loading && <p>Loading...</p>}

      {barcodeProduct ? (
        <div className="border border-gray-200 rounded-lg p-4 text-left shadow-md cursor-pointer" onClick={() => handleProductClick(barcodeProduct.code)}>
          {barcodeProduct.image_url && <img src={barcodeProduct.image_url} alt={barcodeProduct.product_name} className="max-w-full h-36 object-contain mb-3" />}
          <h2 className="text-lg font-semibold mb-1">{barcodeProduct.product_name || 'N/A'}</h2>
          <p className="text-sm text-gray-600">Category: {barcodeProduct.categories || 'N/A'}</p>
          <p className="text-sm text-gray-600">Ingredients: {barcodeProduct.ingredients_text || 'N/A'}</p>
          <p className="text-sm text-gray-600">Nutrition Grade: {barcodeProduct.nutrition_grades || 'N/A'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
          {products.map((product) => (
            <div key={product.code} className="border border-gray-200 rounded-lg p-4 text-left shadow-md cursor-pointer" onClick={() => handleProductClick(product.code)}>
              {product.image_url && <img src={product.image_url} alt={product.product_name} className="max-w-full h-36 object-contain mb-3" />}
              <h2 className="text-lg font-semibold mb-1">{product.product_name || 'N/A'}</h2>
              <p className="text-sm text-gray-600">Category: {product.categories || 'N/A'}</p>
              <p className="text-sm text-gray-600">Ingredients: {product.ingredients_text || 'N/A'}</p>
              <p className="text-sm text-gray-600">Nutrition Grade: {product.nutrition_grades || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {!barcode && !loading && hasMore && (
        <button onClick={handleLoadMore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">Load More</button>
      )}
      {!barcode && !hasMore && <p className="text-gray-500 mt-5">No more products to load.</p>}
    </div>
  );
};

export default ProductList;
