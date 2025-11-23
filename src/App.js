import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';


function App() {
  return (
    <Router>
      <div className="text-center">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:barcode" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
