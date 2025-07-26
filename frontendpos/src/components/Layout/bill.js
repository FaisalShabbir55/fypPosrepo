import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar.js';
// import './OrderBill.css'; // Optional: For custom styles

const OrderBill = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/auth/order-details/${orderId}`);
        setOrderDetails(res.data.orderDetails);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p>Loading...</p>;
  if (orderDetails.length === 0) return <p>No order found.</p>;

  const {
    CustomerName,
    WorkerName,
    OrderDate,
    Subtotal,
    Tax,
    Discount,
    Total,
    Paid,
    Remaining,
    PaymentMethod
  } = orderDetails[0];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="bill-container" style={{ flex: 1, marginLeft: '20px' }}>
        <div className="bill" id="print-area">
          <h2>Order Invoice</h2>
        <p><strong>Customer:</strong> {CustomerName}</p>
        <p><strong>Worker:</strong> {WorkerName}</p>
        <p><strong>Date:</strong> {new Date(OrderDate).toLocaleString()}</p>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.ProductName}</td>
                <td>{item.Stock}</td>
                <td>{item.Price}</td>
                <td>{item.Quantity}</td>
                <td>{item.ItemTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <p><strong>Subtotal:</strong> {Subtotal}</p>
          <p><strong>Tax:</strong> {Tax}</p>
          <p><strong>Discount:</strong> {Discount}</p>
          <p><strong>Total:</strong> {Total}</p>
          <p><strong>Paid:</strong> {Paid}</p>
          <p><strong>Remaining:</strong> {Remaining}</p>
          <p><strong>Payment Method:</strong> {PaymentMethod}</p>
        </div>
        </div>

        <button onClick={handlePrint}>Print Bill</button>
      </div>
    </div>
  );
};

export default OrderBill;
