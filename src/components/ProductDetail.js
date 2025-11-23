import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByBarcode } from '../api/openFoodFacts';

const ProductDetail = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductByBarcode(barcode);
        if (productData) {
          setProduct(productData);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Error fetching product details.");
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  if (loading) {
    return <p className="text-center text-gray-600 text-lg mt-8">Loading product details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-8">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-600 text-lg mt-8">No product details available.</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.product_name || 'Product Details'}</h1>
      {product.image_url && <img src={product.image_url} alt={product.product_name} className="w-full h-64 object-contain mb-4 rounded-md border border-gray-200" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Barcode:</strong> {product.code}</p>
        <p><strong>Categories:</strong> {product.categories || 'N/A'}</p>
        <p><strong>Ingredients:</strong> {product.ingredients_text || 'N/A'}</p>
        <p><strong>Nutrition Grade:</strong> {product.nutrition_grades || 'N/A'}</p>
        <p><strong>Quantity:</strong> {product.quantity || 'N/A'}</p>
        <p><strong>Brands:</strong> {product.brands || 'N/A'}</p>
        <p><strong>Manufacturing Places:</strong> {product.manufacturing_places || 'N/A'}</p>
        <p><strong>Origins:</strong> {product.origins || 'N/A'}</p>
        <p><strong>Labels:</strong> {product.labels || 'N/A'}</p>
        <p><strong>Stores:</strong> {product.stores || 'N/A'}</p>
        <p><strong>Countries:</strong> {product.countries || 'N/A'}</p>
      </div>
      {/* Add more details as needed */}
    </div>
  );
};

export default ProductDetail;
