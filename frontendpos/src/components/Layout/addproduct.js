import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js';
import './CSS/addproduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    Supplier: '',
    SupplierNumber: '',
    TotalPayment: '',
    PaidAmount: '',
    ProductName: '',
    Category: '',
    Price: '',
    Stock: '',
    ProductBrand: '',
    Description: ''
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(' http://localhost:3001/api/auth/get-category')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/add-products', product);
      setMessage(response.data.message);
      setProduct({
        Supplier: '',
        SupplierNumber: '',
        TotalPayment: '',
        PaidAmount: '',
        ProductName: '',
        Category: '',
        Price: '',
        Stock: '',
        ProductBrand: '',
        Description: ''
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Error adding product');
    }
  };

  const calculateRemaining = () => {
    const total = parseFloat(product.TotalPayment || 0);
    const paid = parseFloat(product.PaidAmount || 0);
    return (total - paid).toFixed(2);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className='mainform' style={{ flex: 1, padding: '20px' }}>
        <div className="header-section">
          <div className="green-bar"></div>
          <h2>Add Product</h2>
        </div>
        
        {message && <p className="message">{message}</p>}
        
        <form onSubmit={handleSubmit}>
          {/* Vendor Information Section */}
          <div className="form-section">
            <h3 className="section-title">Vendor Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Vendor Name</label>
                <input 
                  type="text" 
                  name="Supplier" 
                  placeholder="Enter Name" 
                  value={product.Supplier} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Vendor Contact</label>
                <input 
                  type="text" 
                  name="SupplierNumber" 
                  placeholder="Enter Contact" 
                  value={product.SupplierNumber} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group full-width">
                <label>Total Payment</label>
                <input 
                  type="number" 
                  name="TotalPayment" 
                  placeholder="Total Payment" 
                  value={product.TotalPayment} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Paid</label>
                <input 
                  type="number" 
                  name="PaidAmount" 
                  placeholder="Total Paid" 
                  value={product.PaidAmount} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Remaining Payment</label>
                <input 
                  type="text" 
                  placeholder="Remaining Amount" 
                  value={calculateRemaining()} 
                  readOnly 
                />
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="form-section">
            <h3 className="section-title">Product Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="ProductName" 
                  placeholder="Enter Product Name" 
                  value={product.ProductName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  name="ProductBrand" 
                  placeholder="Enter Brand" 
                  value={product.ProductBrand} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group full-width">
                <label>Category</label>
                <select name="Category" value={product.Category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.CategoryName}>{cat.CategoryName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sale Price</label>
                <input 
                  type="number" 
                  name="Price" 
                  placeholder="Enter Sale Price" 
                  value={product.Price} 
                  onChange={handleChange} 
                  step="0.01" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input 
                  type="number" 
                  name="Stock" 
                  placeholder="Enter Stock" 
                  value={product.Stock} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group full-width">
                <label>Product Description</label>
                <textarea 
                  name="Description" 
                  placeholder="Enter Product Description" 
                  value={product.Description} 
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">Add Vendor and Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
