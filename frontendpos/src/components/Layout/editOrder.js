import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar.js';
import './CSS/editOrder.css';

const EditOrderForm = () => {
  const { id } = useParams(); // orderId from URL
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [productQuery, setProductQuery] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/auth/order-details/${id}`);
        const orderDetails = res.data.orderDetails;
        
        if (orderDetails && orderDetails.length > 0) {
          const firstOrder = orderDetails[0];
          
          // Group items by ProductName to avoid duplicates
          const itemsMap = {};
          orderDetails.forEach(item => {
            if (!itemsMap[item.ProductName]) {
              itemsMap[item.ProductName] = {
                productName: item.ProductName,
                stock: item.Stock,
                price: item.Price,
                quantity: item.Quantity,
                total: item.ItemTotal
              };
            }
          });

          const items = Object.values(itemsMap);

          setOrderData({
            customerName: firstOrder.CustomerName,
            customerContact: firstOrder.CustomerContact || '',
            workerId: firstOrder.WorkerId || 1,
            date: firstOrder.OrderDate ? firstOrder.OrderDate.split('T')[0] : new Date().toISOString().split('T')[0],
            subtotal: firstOrder.Subtotal,
            tax: firstOrder.Tax,
            discount: firstOrder.Discount,
            total: firstOrder.Total,
            paid: firstOrder.Paid,
            remaining: firstOrder.Remaining,
            paymentMethod: firstOrder.PaymentMethod,
            items: items
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setLoading(false);
      }
    };

    const fetchWorkers = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/auth/staff');
        console.log('Workers response:', res.data); // Debug log
        // The staff API returns { success: true, staff: [...] }
        const staffData = res.data.staff || res.data;
        setWorkers(Array.isArray(staffData) ? staffData : []);
      } catch (err) {
        console.error('Error fetching workers:', err);
        setWorkers([]); // Ensure it's always an array
      }
    };

    const loadData = async () => {
      await Promise.all([fetchOrderDetails(), fetchWorkers()]);
    };

    loadData();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Recalculate totals when relevant fields change
      if (['subtotal', 'tax', 'discount', 'paid'].includes(name)) {
        const subtotal = Number(name === 'subtotal' ? value : prev.subtotal);
        const tax = Number(name === 'tax' ? value : prev.tax);
        const discount = Number(name === 'discount' ? value : prev.discount);
        const paid = Number(name === 'paid' ? value : prev.paid);
        
        const total = subtotal + tax - discount;
        const remaining = total - paid;
        
        updatedData.total = total;
        updatedData.remaining = remaining;
      }
      
      return updatedData;
    });
  };

  const handleProductSearch = async (query) => {
    setProductQuery(query);
    if (query) {
      try {
        const res = await axios.get(`http://localhost:3001/api/auth/search-product?query=${query}`);
        setProductSuggestions(res.data);
      } catch (err) {
        setProductSuggestions([]);
      }
    } else {
      setProductSuggestions([]);
    }
  };

  const handleSelectProduct = (product) => {
    console.log('Selected product:', product); // Debug log
    
    // Check if product already exists in items
    const existingItemIndex = orderData.items.findIndex(
      item => item.productName === product.ProductName
    );

    if (existingItemIndex !== -1) {
      alert('Product already exists in the order');
      return;
    }

    // Ensure stock is a valid number
    const stockValue = Number(product.Stock) || 0;
    
    if (stockValue <= 0) {
      alert('This product is out of stock');
      return;
    }

    const newItem = {
      productName: product.ProductName,
      stock: stockValue,
      price: Number(product.Price) || 0,
      quantity: 1,
      total: Number(product.Price) || 0
    };

    console.log('Adding new item:', newItem); // Debug log

    setOrderData(prev => {
      const updatedItems = [...prev.items, newItem];
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const newTotal = newSubtotal + prev.tax - prev.discount;
      const newRemaining = newTotal - prev.paid;

      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
        remaining: newRemaining
      };
    });

    setProductQuery('');
    setProductSuggestions([]);
  };

  const handleItemChange = (index, field, value) => {
    setOrderData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      
      // Recalculate total for this item
      if (field === 'quantity' || field === 'price') {
        const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
        const price = field === 'price' ? Number(value) : updatedItems[index].price;
        updatedItems[index].total = quantity * price;
      }

      // Recalculate order totals
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const newTotal = newSubtotal + prev.tax - prev.discount;
      const newRemaining = newTotal - prev.paid;

      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
        remaining: newRemaining
      };
    });
  };

  const removeItem = (index) => {
    setOrderData(prev => {
      const updatedItems = prev.items.filter((_, i) => i !== index);
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const newTotal = newSubtotal + prev.tax - prev.discount;
      const newRemaining = newTotal - prev.paid;

      return {
        ...prev,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
        remaining: newRemaining
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderData.items || orderData.items.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    try {
      const updatePayload = {
        customerName: orderData.customerName,
        customerContact: orderData.customerContact,
        date: orderData.date,
        workerId: Number(orderData.workerId),
        subtotal: Number(orderData.subtotal),
        tax: Number(orderData.tax),
        discount: Number(orderData.discount),
        total: Number(orderData.total),
        paid: Number(orderData.paid),
        remaining: Number(orderData.remaining),
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map(item => ({
          productName: item.productName,
          stock: Number(item.stock),
          price: Number(item.price),
          quantity: Number(item.quantity),
          total: Number(item.total)
        }))
      };

      await axios.put(`http://localhost:3001/api/auth/update-order/${id}`, updatePayload);
      alert('Order updated successfully!');
      navigate('/order-List');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update order: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!orderData) return <div className="error">Order not found</div>;

  return (
    <div className="main">
      <Sidebar />
      <div className="edit-order-container">
        <h2>Edit Order #{id}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer Name:</label>
              <input 
                type="text"
                name="customerName"
                value={orderData.customerName}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Customer Contact:</label>
              <input 
                type="text"
                name="customerContact"
                value={orderData.customerContact}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Worker:</label>
              <select 
                name="workerId"
                value={orderData.workerId}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a worker</option>
                {Array.isArray(workers) && workers.map(worker => (
                  <option key={worker.Id} value={worker.Id}>{worker.Name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input 
                type="date"
                name="date"
                value={orderData.date}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method:</label>
            <input 
              type="text"
              name="paymentMethod"
              value={orderData.paymentMethod}
              onChange={handleFormChange}
            />
          </div>

        <hr className="section-divider" />
        
        <h4>Add New Product</h4>
        <div className="product-search">
          <input
            type="text"
            value={productQuery}
            onChange={(e) => handleProductSearch(e.target.value)}
            placeholder="Search product to add..."
          />
          {productSuggestions.length > 0 && (
            <ul className="suggestions">
              {productSuggestions.map((product, i) => (
                <li 
                  key={i} 
                  onClick={() => handleSelectProduct(product)}
                >
                  {product.ProductName} - Stock: {product.Stock} - Price: ${product.Price}
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr className="section-divider" />
        
        <h4>Order Items</h4>
        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.stock || 'N/A'}</td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    max={item.stock > 0 ? item.stock : 999}
                  />
                </td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="section-divider" />
        
        <div className="form-grid">
          <div className="form-group">
            <label>Subtotal:</label>
            <input 
              type="number"
              name="subtotal"
              value={orderData.subtotal}
              onChange={handleFormChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Tax:</label>
            <input 
              type="number"
              name="tax"
              value={orderData.tax}
              onChange={handleFormChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Discount:</label>
            <input 
              type="number"
              name="discount"
              value={orderData.discount}
              onChange={handleFormChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Paid:</label>
            <input 
              type="number"
              name="paid"
              value={orderData.paid}
              onChange={handleFormChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="totals-section">
          <p><strong>Total: ${orderData.total.toFixed(2)}</strong></p>
          <p><strong>Remaining: ${orderData.remaining.toFixed(2)}</strong></p>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">
            Update Order
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/order-List')}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditOrderForm;
