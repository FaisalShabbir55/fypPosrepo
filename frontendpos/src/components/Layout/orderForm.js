// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './CSS/orderform.css';

// const OrderForm = () => {
//   const [workers, setWorkers] = useState([]);
//   const [order, setOrder] = useState({
//     customerName: '',
//     date: '',
//     workerId: '',
//     paymentMethod: '',
//     tax: 0,
//     discount: 0,
//     paid: 0
//   });

//   const [productQuery, setProductQuery] = useState('');
//   const [productSuggestions, setProductSuggestions] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);

//   // useEffect(() => {
//   //   const fetchWorkers = async () => {
//   //     try {
//   //       const res = await axios.get('http://localhost:3001/api/auth/staff');
//   //       setWorkers(Array.isArray(res.data) ? res.data : res.data.data || []);
//   //     } catch (error) {
//   //       console.error('Failed to fetch workers:', error);
//   //     }
//   //   };
//   //   fetchWorkers();
//   // }, []);

//   useEffect(() => {
//     axios.get(' http://localhost:3001/api/auth/staff')
//       .then(res => {
//         if (Array.isArray(res.data.staff)) {
//           setWorkers(res.data.staff);
//         } else {
//           setWorkers([]);
//         }
//       })
//       .catch(err => {
//         console.error('Failed to fetch staff:', err);
//         setWorkers([]);
//       });
//   }, []);


//   const handleOrderChange = (field, value) => {
//     setOrder(prev => ({ ...prev, [field]: value }));
//   };

//   const handleProductSearch = async (query) => {
//     setProductQuery(query);
//     try {
//       const res = await axios.get('http://localhost:3001/api/auth/search-product', {
//         params: { ProductName: query }
//       });
//       setProductSuggestions(res.data);
//     } catch (err) {
//       setProductSuggestions([]);
//     }
//   };

//   const handleSelectProduct = (product) => {
//     // Avoid adding duplicate product
//     if (selectedProducts.find(p => p.ProductName === product.ProductName)) return;

//     setSelectedProducts(prev => [
//       ...prev,
//       {
//         ProductName: product.ProductName,
//         Stock: product.Stock,
//         Price: product.Price,
//         quantity: '',
//         total: 0
//       }
//     ]);
//     setProductQuery('');
//     setProductSuggestions([]);
//   };

//   const handleQuantityChange = (index, quantity) => {
//     const updated = [...selectedProducts];
//     quantity = Number(quantity);
//     updated[index].quantity = quantity;
//     updated[index].total = quantity * updated[index].Price;
//     setSelectedProducts(updated);
//   };

//   const calculateTotals = () => {
//     const subtotal = selectedProducts.reduce((sum, p) => sum + (p.total || 0), 0);
//     const tax = Number(order.tax || 0);
//     const discount = Number(order.discount || 0);
//     const paid = Number(order.paid || 0);
//     const total = subtotal + tax - discount;
//     const remaining = total - paid;
//     return { subtotal, total, remaining };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { subtotal, total, remaining } = calculateTotals();

//     const payload = {
//       customerName: order.customerName,
//       orderDate: order.date,
//       workerId: Number(order.workerId),
//       paymentMethod: order.paymentMethod,
//       subtotal,
//       tax: Number(order.tax),
//       discount: Number(order.discount),
//       paid: Number(order.paid),
//       remaining,
//       total,
//       items: selectedProducts.map(p => ({
//         productName: p.ProductName,
//         stock: p.Stock,
//         price: p.Price,
//         quantity: p.quantity,
//         total: p.total
//       }))
//     };

//     try {
//       await axios.post('http://localhost:3001/api/auth/create-order', payload);
//       alert('✅ Order created successfully!');
//       // Reset
//       setOrder({
//         customerName: '',
//         date: '',
//         workerId: '',
//         paymentMethod: '',
//         tax: 0,
//         discount: 0,
//         paid: 0
//       });
//       setSelectedProducts([]);
//     } catch (err) {
//       console.error('Order submission failed:', err);
//       alert('❌ Failed to create order.');
//     }
//   };

//   const { subtotal, total, remaining } = calculateTotals();

//   return (
//     <div className="order-form">
//       <h2>Create Order</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Customer Name"
//           value={order.customerName}
//           onChange={e => handleOrderChange('customerName', e.target.value)}
//           required
//         />
//         <input
//           type="date"
//           value={order.date}
//           onChange={e => handleOrderChange('date', e.target.value)}
//           required
//         />
//         <select
//           value={order.workerId}
//           onChange={e => handleOrderChange('workerId', e.target.value)}
//           required
//         >
//           <option value="">Select Worker</option>
//           {workers.map(worker => (
//             <option key={worker.Id} value={worker.Id}>{worker.Name}</option>
//           ))}
//         </select>

//         <div className="product-search">
//           <input
//             type="text"
//             placeholder="Search Product"
//             value={productQuery}
//             onChange={e => handleProductSearch(e.target.value)}
//           />
//           {productSuggestions.length > 0 && (
//             <ul className="suggestions">
//               {productSuggestions.map((product, i) => (
//                 <li key={i} onClick={() => handleSelectProduct(product)}>
//                   {product.ProductName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {selectedProducts.map((product, index) => (
//           <div key={index} className="product-row">
//             <span><strong>{product.ProductName}</strong></span>
//             <span>Stock: {product.Stock}</span>
//             <span>Price: {product.Price}</span>
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={product.quantity}
//               min="1"
//               max={product.Stock}
//               onChange={e => handleQuantityChange(index, e.target.value)}
//               required
//             />
//             <span>Total: {product.total}</span>
//           </div>
//         ))}

//         <input
//           type="number"
//           placeholder="Tax"
//           value={order.tax}
//           onChange={e => handleOrderChange('tax', e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Discount"
//           value={order.discount}
//           onChange={e => handleOrderChange('discount', e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Paid"
//           value={order.paid}
//           onChange={e => handleOrderChange('paid', e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Payment Method"
//           value={order.paymentMethod}
//           onChange={e => handleOrderChange('paymentMethod', e.target.value)}
//         />

//         <div>
//           <strong>Subtotal:</strong> {subtotal.toFixed(2)} <br />
//           <strong>Total:</strong> {total.toFixed(2)} <br />
//           <strong>Remaining:</strong> {remaining.toFixed(2)}
//         </div>

//         <button type="submit">Create Order</button>
//       </form>
//     </div>
//   );
// };

// export default OrderForm;



















//grok wala code    





import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import axios from 'axios';
import './CSS/orderform.css';

const OrderForm = () => {
  const [workers, setWorkers] = useState([]);
  const [order, setOrder] = useState({
    customerName: '',
    date: '',
    workerId: '',
    paymentMethod: '',
    tax: 0,
    discount: 0,
    paid: 0
  });

  const [productQuery, setProductQuery] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/auth/staff')
      .then(res => {
        if (Array.isArray(res.data.staff)) {
          setWorkers(res.data.staff);
        } else {
          setWorkers([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch staff:', err);
        setWorkers([]);
      });
  }, []);

  const handleOrderChange = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleProductSearch = async (query) => {
    setProductQuery(query);
    try {
      const res = await axios.get('http://localhost:3001/api/auth/search-product', {
        params: { ProductName: query }
      });
      setProductSuggestions(res.data.map(product => ({
        ...product,
        total: 0,
        quantity: ''
      })));
    } catch (err) {
      setProductSuggestions([]);
    }
  };

  const handleSelectProduct = (product) => {
    if (selectedProducts.find(p => p.ProductName === product.ProductName)) return;

    setSelectedProducts(prev => [...prev, product]);
    setProductQuery('');
    setProductSuggestions([]);
  };

  const handleQuantityChange = (index, quantity) => {
    const updated = [...selectedProducts];
    quantity = Number(quantity) || 0;
    updated[index].quantity = quantity;
    updated[index].total = quantity * updated[index].Price;
    setSelectedProducts(updated);
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, p) => sum + (p.total || 0), 0);
    const taxPercent = Number(order.tax || 0);
    const discountPercent = Number(order.discount || 0);
    const tax = subtotal * (taxPercent / 100);
    const discount = subtotal * (discountPercent / 100);
    const paid = Number(order.paid || 0);
    const total = subtotal + tax - discount;
    const remaining = total - paid;
    return { subtotal, tax, discount, total, remaining };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subtotal, tax, discount, total, remaining } = calculateTotals();

    const payload = {
      customerName: order.customerName,
      orderDate: order.date,
      workerId: Number(order.workerId),
      paymentMethod: order.paymentMethod,
      subtotal,
      tax,
      discount,
      paid: Number(order.paid),
      remaining,
      total,
      items: selectedProducts.map(p => ({
        productName: p.ProductName,
        stock: p.Stock,
        price: p.Price,
        quantity: p.quantity,
        total: p.total
      }))
    };

    try {
      await axios.post('http://localhost:3001/api/auth/create-order', payload);
      alert('✅ Order created successfully!');
      setOrder({
        customerName: '',
        date: '',
        workerId: '',
        paymentMethod: '',
        tax: 0,
        discount: 0,
        paid: 0
      });
      setSelectedProducts([]);
    } catch (err) {
      console.error('Order submission failed:', err);
      alert('❌ Failed to create order.');
    }
  };

  const { subtotal, tax, discount, total, remaining } = calculateTotals();

  return (





    <div className='main'>
      <Sidebar/>
  

    <div className='main-content'>
    <div className="order-container">
      <h2>New Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={order.customerName}
              onChange={e => handleOrderChange('customerName', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={order.date}
              onChange={e => handleOrderChange('date', e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Products Given by</label>
            <select
              value={order.workerId}
              onChange={e => handleOrderChange('workerId', e.target.value)}
              required
            >
              <option value="">Enter Name of worker</option>
              {workers.map(worker => (
                <option key={worker.Id} value={worker.Id}>{worker.Name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Search Product</label>
            <input
              type="text"
              value={productQuery}
              onChange={e => handleProductSearch(e.target.value)}
              placeholder="Search Product"
            />
            {productSuggestions.length > 0 && (
              <ul className="suggestions">
                {productSuggestions.map((product, i) => (
                  <li key={i} onClick={() => handleSelectProduct(product)}>
                    {product.ProductName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="product-table">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Search Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Enter Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.ProductName}</td>
                  <td>{product.Stock}</td>
                  <td>{product.Price}</td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      min="1"
                      max={product.Stock}
                      onChange={e => handleQuantityChange(index, e.target.value)}
                      required
                    />
                  </td>
                  <td>{product.total.toFixed(2)}</td>
                  <td><button type="button" onClick={() => {
                    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
                  }}>✖</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button type="button" onClick={() => {}}>➕</button> */}
        </div>
        <div className="form-row totals">
          <div className="form-group">
            <label>Subtotal</label>
            <input type="text" value={subtotal.toFixed(2)} readOnly />
          </div>
          <div className="form-group">
            <label>Tax (%)</label>
            <input
              type="number"
              value={order.tax}
              onChange={e => handleOrderChange('tax', e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              value={order.discount}
              onChange={e => handleOrderChange('discount', e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Paid</label>
            <input
              type="number"
              value={order.paid}
              onChange={e => handleOrderChange('paid', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Remaining</label>
            <input type="text" value={remaining.toFixed(2)} readOnly />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Payment Method:</label>
            <label>
              <input
                type="radio"
                value="Cash"
                checked={order.paymentMethod === 'Cash'}
                onChange={e => handleOrderChange('paymentMethod', e.target.value)}
              /> Cash
            </label>
            <label>
              <input
                type="radio"
                value="Card"
                checked={order.paymentMethod === 'Card'}
                onChange={e => handleOrderChange('paymentMethod', e.target.value)}
              /> Card
            </label>
            <label>
              <input
                type="radio"
                value="Cheque"
                checked={order.paymentMethod === 'Cheque'}
                onChange={e => handleOrderChange('paymentMethod', e.target.value)}
              /> Cheque
            </label>
          </div>
        </div>
        <button type="submit">Save Order</button>
      </form>
    </div>
    </div>
 </div>
  );
};

export default OrderForm;