// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Select from 'react-select';

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const [search, setSearch] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [editForm, setEditForm] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/api/auth/order-List');
//       setOrders(res.data);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//     }
//   };

//   const handleSearch = async (e) => {
//     setSearch(e.target.value);
//     if (e.target.value) {
//       try {
//         const res = await axios.get(`http://localhost:3001/api/auth/search-order?query=${e.target.value}`);
//         setOrders(res.data);
//       } catch (err) {
//         console.error('Error searching orders:', err);
//       }
//     } else {
//       fetchOrders();
//     }
//   };

//   const handlePrint = async (orderId) => {
//     try {
//       const res = await axios.get(`http://localhost:3001/api/auth/order-details/${orderId}`);
//       const order = res.data.orderDetails[0];
//       const win = window.open('', '', 'width=800,height=600');
//       win.document.write(`
//         <h2>Invoice</h2>
//         <p><strong>Invoice ID:</strong> ${order.OrderID}</p>
//         <p><strong>Customer Name:</strong> ${order.CustomerName}</p>
//         <p><strong>Date:</strong> ${new Date(order.OrderDate).toLocaleDateString()}</p>
//         <p><strong>Worker:</strong> ${order.WorkerName}</p>
//         <p><strong>Subtotal:</strong> ${order.Subtotal}</p>
//         <p><strong>Tax:</strong> ${order.Tax}</p>
//         <p><strong>Discount:</strong> ${order.Discount}</p>
//         <p><strong>Total:</strong> ${order.Total}</p>
//         <p><strong>Paid:</strong> ${order.Paid}</p>
//         <p><strong>Remaining:</strong> ${order.Remaining}</p>
//         <p><strong>Payment Method:</strong> ${order.PaymentMethod}</p>
//         <h3>Items:</h3>
//         <ul>
//           ${res.data.orderDetails.map(item => `
//             <li>${item.ProductName} - Qty: ${item.Quantity}, Price: ${item.Price}, Total: ${item.ItemTotal}</li>
//           `).join('')}
//         </ul>
//       `);
//       win.document.close();
//       win.print();
//     } catch (err) {
//       console.error('Error fetching order details:', err);
//     }
//   };

//   const handleDelete = (orderId) => {
//     if (window.confirm('Are you sure you want to delete this order?')) {
//       axios.delete(`http://localhost:3001/api/auth/delete-order/${orderId}`)
//         .then(() => {
//           setOrders(orders.filter(o => o.OrderId !== orderId));
//         })
//         .catch(err => alert('Failed to delete order'));
//     }
//   };

//   const handleEdit = (order) => {
//     setEditForm({
//       OrderId: order.OrderId,
//       CustomerName: order.CustomerName,
//       CustomerContact: '',
//       WorkerId: order.WorkerId,
//       OrderDate: order.OrderDate,
//       Subtotal: order.Subtotal,
//       Tax: order.Tax,
//       Discount: order.Discount,
//       Total: order.Total,
//       Paid: order.Paid,
//       Remaining: order.Remaining,
//       PaymentMethod: order.PaymentMethod,
//       Items: order.items || []
//     });
//     setSelectedOrder(order);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProductSelect = (index, selected) => {
//     setEditForm(prev => {
//       const items = [...prev.Items];
//       items[index] = {
//         ProductName: selected.label,
//         Stock: selected.stock,
//         Price: selected.price,
//         Quantity: 1,
//         Total: selected.price * 1
//       };
//       const subtotal = items.reduce((sum, item) => sum + Number(item.Total), 0);
//       const total = subtotal + Number(prev.Tax) - Number(prev.Discount);
//       return { ...prev, Items: items, Subtotal: subtotal, Total: total };
//     });
//   };

//   const searchProducts = async (inputValue) => {
//     if (!inputValue) return [];
//     const res = await axios.get(`http://localhost:3001/api/auth/search-product?query=${inputValue}`);
//     return res.data.map(p => ({
//       label: p.ProductName,
//       value: p.ProductName,
//       price: p.Price,
//       stock: p.Stock
//     }));
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => {
//       const updatedItems = [...prev.Items];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         [name]: value,
//         Total: name === 'Quantity' || name === 'Price'
//           ? (name === 'Quantity' ? value : updatedItems[index].Quantity) * (name === 'Price' ? value : updatedItems[index].Price)
//           : updatedItems[index].Total
//       };
//       const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.Total), 0);
//       const total = subtotal + Number(prev.Tax) - Number(prev.Discount);
//       return { ...prev, Items: updatedItems, Subtotal: subtotal, Total: total };
//     });
//   };

//   const addItem = () => {
//     setEditForm(prev => ({
//       ...prev,
//       Items: [...prev.Items, { ProductName: '', Stock: 0, Price: 0, Quantity: 0, Total: 0 }]
//     }));
//   };

//   const removeItem = (index) => {
//     setEditForm(prev => {
//       const items = prev.Items.filter((_, i) => i !== index);
//       const subtotal = items.reduce((sum, item) => sum + Number(item.Total), 0);
//       const total = subtotal + Number(prev.Tax) - Number(prev.Discount);
//       return { ...prev, Items: items, Subtotal: subtotal, Total: total };
//     });
//   };

//   const handleSubmitEdit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3001/api/auth/edit-order/${editForm.OrderId}`, {
//         ...editForm,
//         WorkerId: Number(editForm.WorkerId),
//         Subtotal: Number(editForm.Subtotal),
//         Tax: Number(editForm.Tax),
//         Discount: Number(editForm.Discount),
//         Total: Number(editForm.Total),
//         Paid: Number(editForm.Paid),
//         Remaining: Number(editForm.Remaining),
//         Items: editForm.Items.map(item => ({
//           ProductName: item.ProductName,
//           Stock: Number(item.Stock),
//           Price: Number(item.Price),
//           Quantity: Number(item.Quantity),
//           Total: Number(item.Total)
//         }))
//       });
//       fetchOrders();
//       setEditForm(null);
//       setSelectedOrder(null);
//     } catch (err) {
//       alert('Failed to update order');
//     }
//   };

//   const closeEditForm = () => {
//     setEditForm(null);
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="order-history-container">
//       <h2>Order History</h2>
//       <input
//         type="text"
//         placeholder="Search by customer or worker name..."
//         value={search}
//         onChange={handleSearch}
//         className="search-box"
//       />
//       <table className="order-history-table">
//         <thead>
//           <tr>
//             <th>Invoice ID</th>
//             <th>Customer</th>
//             <th>Date</th>
//             <th>Total</th>
//             <th>Paid</th>
//             <th>Due</th>
//             <th>Staff</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order.OrderId}>
//               <td>{order.OrderId}</td>
//               <td>{order.CustomerName}</td>
//               <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
//               <td>{order.Total}</td>
//               <td>{order.Paid}</td>
//               <td>{order.Remaining}</td>
//               <td>{order.WorkerName || 'N/A'}</td>
//               <td>
//                 <button onClick={() => handlePrint(order.OrderId)}>🖨️</button>
//                 <button onClick={() => handleEdit(order)}>✏️</button>
//                 <button onClick={() => handleDelete(order.OrderId)}>🗑️</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {editForm && (
//         <div className="edit-form-overlay">
//           <div className="edit-form">
//             <h3>Edit Order #{editForm.OrderId}</h3>
//             <form onSubmit={handleSubmitEdit}>
//               <div>
//                 <label>Customer Name:</label>
//                 <input type="text" name="CustomerName" value={editForm.CustomerName} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Customer Contact:</label>
//                 <input type="text" name="CustomerContact" value={editForm.CustomerContact} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Worker ID:</label>
//                 <input type="number" name="WorkerId" value={editForm.WorkerId} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Order Date:</label>
//                 <input type="date" name="OrderDate" value={editForm.OrderDate} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Subtotal:</label>
//                 <input type="number" name="Subtotal" value={editForm.Subtotal} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Tax:</label>
//                 <input type="number" name="Tax" value={editForm.Tax} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Discount:</label>
//                 <input type="number" name="Discount" value={editForm.Discount} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Total:</label>
//                 <input type="number" name="Total" value={editForm.Total} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Paid:</label>
//                 <input type="number" name="Paid" value={editForm.Paid} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Remaining:</label>
//                 <input type="number" name="Remaining" value={editForm.Remaining} onChange={handleFormChange} />
//               </div>
//               <div>
//                 <label>Payment Method:</label>
//                 <input type="text" name="PaymentMethod" value={editForm.PaymentMethod} onChange={handleFormChange} />
//               </div>
//               <h4>Items</h4>
//               {editForm.Items.map((item, index) => (
//                 <div key={index} className="item-row">
//                   <Select
//                     onInputChange={(input) => searchProducts(input)}
//                     onChange={(selected) => handleProductSelect(index, selected)}
//                     placeholder="Search Product"
//                   />
//                   <input type="number" name="Stock" value={item.Stock} onChange={(e) => handleItemChange(index, e)} placeholder="Stock" />
//                   <input type="number" name="Price" value={item.Price} onChange={(e) => handleItemChange(index, e)} placeholder="Price" />
//                   <input type="number" name="Quantity" value={item.Quantity} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" />
//                   <input type="number" name="Total" value={item.Total} onChange={(e) => handleItemChange(index, e)} placeholder="Total" />
//                   <button type="button" onClick={() => removeItem(index)}>Remove</button>
//                 </div>
//               ))}
//               <button type="button" onClick={addItem}>Add Item</button>
//               <div>
//                 <button type="submit">Save Changes</button>
//                 <button type="button" onClick={closeEditForm}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderList;






































//grok wala code   


// OrderList.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './CSS/orderList.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    invoiceId: true,
    customer: true,
    date: true,
    total: true,
    paid: true,
    due: true,
    staff: true,
    actions: true
  });
  
  const columnMenuRef = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/auth/order-List');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      try {
        const res = await axios.get(`http://localhost:3001/api/auth/search-order?query=${e.target.value}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Error searching orders:', err);
      }
    } else {
      fetchOrders();
    }
  };

  const handlePrint = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/auth/order-details/${orderId}`);
      const order = res.data.orderDetails[0];
      const win = window.open('', '', 'width=800,height=600');
      win.document.write(`
        <h2>Invoice</h2>
        <p><strong>Invoice ID:</strong> ${order.OrderID}</p>
        <p><strong>Customer Name:</strong> ${order.CustomerName}</p>
        <p><strong>Date:</strong> ${new Date(order.OrderDate).toLocaleDateString()}</p>
        <p><strong>Worker:</strong> ${order.WorkerName}</p>
        <p><strong>Subtotal:</strong> ${order.Subtotal}</p>
        <p><strong>Tax:</strong> ${order.Tax}</p>
        <p><strong>Discount:</strong> ${order.Discount}</p>
        <p><strong>Total:</strong> ${order.Total}</p>
        <p><strong>Paid:</strong> ${order.Paid}</p>
        <p><strong>Remaining:</strong> ${order.Remaining}</p>
        <p><strong>Payment Method:</strong> ${order.PaymentMethod}</p>
        <h3>Items:</h3>
        <ul>
          ${res.data.orderDetails.map(item => `
            <li>${item.ProductName} - Qty: ${item.Quantity}, Price: ${item.Price}, Total: ${item.ItemTotal}</li>
          `).join('')}
        </ul>
      `);
      win.document.close();
      win.print();
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      axios.delete(`http://localhost:3001/api/auth/delete-order/${orderId}`)
        .then(() => {
          setOrders(orders.filter(o => o.OrderId !== orderId));
        })
        .catch(err => alert('Failed to delete order'));
    }
  };

  const handleEdit = (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  // Export Functions
  const copyToClipboard = () => {
    // Create headers based on visible columns
    const allHeaders = ['Invoice ID', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Staff', 'Actions'];
    const columnKeys = ['invoiceId', 'customer', 'date', 'total', 'paid', 'due', 'staff', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = orders.map((order) => {
      const allData = [
        order.OrderId,
        order.CustomerName,
        new Date(order.OrderDate).toLocaleDateString(),
        order.Total,
        order.Paid,
        order.Remaining,
        order.WorkerName || 'N/A',
        'Print | Edit | Delete'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const csvContent = [headers, ...rows].map(row => row.join('\t')).join('\n');
    
    navigator.clipboard.writeText(csvContent).then(() => {
      alert('Data copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy data to clipboard');
    });
  };

  const exportToCSV = () => {
    // Create headers based on visible columns
    const allHeaders = ['Invoice ID', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Staff', 'Actions'];
    const columnKeys = ['invoiceId', 'customer', 'date', 'total', 'paid', 'due', 'staff', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = orders.map((order) => {
      const allData = [
        order.OrderId,
        order.CustomerName,
        new Date(order.OrderDate).toLocaleDateString(),
        order.Total,
        order.Paid,
        order.Remaining,
        order.WorkerName || 'N/A',
        'Print | Edit | Delete'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create headers based on visible columns
    const allHeaders = ['Invoice ID', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Staff', 'Actions'];
    const columnKeys = ['invoiceId', 'customer', 'date', 'total', 'paid', 'due', 'staff', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = orders.map((order) => {
      const allData = [
        order.OrderId,
        order.CustomerName,
        new Date(order.OrderDate).toLocaleDateString(),
        order.Total,
        order.Paid,
        order.Remaining,
        order.WorkerName || 'N/A',
        'Print | Edit | Delete'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    
    doc.setFontSize(18);
    doc.text('Orders List', 14, 22);
    
    // Create headers based on visible columns
    const allHeaders = ['Invoice ID', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Staff', 'Actions'];
    const columnKeys = ['invoiceId', 'customer', 'date', 'total', 'paid', 'due', 'staff', 'actions'];
    
    const headers = [allHeaders.filter((header, index) => visibleColumns[columnKeys[index]])];
    
    const rows = orders.map((order) => {
      const allData = [
        order.OrderId,
        order.CustomerName,
        new Date(order.OrderDate).toLocaleDateString(),
        order.Total,
        order.Paid,
        order.Remaining,
        order.WorkerName || 'N/A',
        'Print | Edit | Delete'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: headers[0].reduce((acc, header, index) => {
        acc[index] = { cellWidth: 'auto' };
        return acc;
      }, {})
    });

    doc.save('orders_data.pdf');
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    
    // Create headers based on visible columns
    const allHeaders = ['Invoice ID', 'Customer', 'Date', 'Total', 'Paid', 'Due', 'Staff', 'Actions'];
    const columnKeys = ['invoiceId', 'customer', 'date', 'total', 'paid', 'due', 'staff', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    let tableHTML = `
      <html>
        <head>
          <title>Orders List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #22c55e; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Orders List</h1>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
    `;

    orders.forEach((order) => {
      const allData = [
        order.OrderId,
        order.CustomerName,
        new Date(order.OrderDate).toLocaleDateString(),
        order.Total,
        order.Paid,
        order.Remaining,
        order.WorkerName || 'N/A',
        'Print | Edit | Delete'
      ];
      const visibleData = allData.filter((data, index) => visibleColumns[columnKeys[index]]);
      
      tableHTML += `
        <tr>
          ${visibleData.map(data => `<td>${data}</td>`).join('')}
        </tr>
      `;
    });

    tableHTML += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const toggleColumnMenu = () => {
    setShowColumnMenu(prev => !prev);
  };

  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColumnMenu && !event.target.closest('.column-visibility-container')) {
        setShowColumnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnMenu]);

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className="order-history-container">
          <h2>Order History</h2>
          <input
            type="text"
            placeholder="Search by customer or worker name..."
            value={search}
            onChange={handleSearch}
            className="search-box"
          />
          
          {/* Export Controls */}
          <div className="export-controls">
            <div className="export-buttons">
              <button 
                className="export-btn copy-btn" 
                onClick={copyToClipboard}
                title="Copy to Clipboard"
              >
                📋 Copy
              </button>
              <button 
                className="export-btn csv-btn" 
                onClick={exportToCSV}
                title="Export to CSV"
              >
                📄 CSV
              </button>
              <button 
                className="export-btn excel-btn" 
                onClick={exportToExcel}
                title="Export to Excel"
              >
                📊 Excel
              </button>
              <button 
                className="export-btn pdf-btn" 
                onClick={exportToPDF}
                title="Export to PDF"
              >
                📄 PDF
              </button>
              <button 
                className="export-btn print-btn" 
                onClick={printTable}
                title="Print Table"
              >
                🖨️ Print
              </button>
            </div>
            
            <div className="column-controls">
              <button 
                className="column-btn" 
                onClick={toggleColumnMenu}
                title="Column Visibility"
              >
                ⚙️ Columns
              </button>
              {showColumnMenu && (
                <div className="column-menu" ref={columnMenuRef}>
                  <div className="column-menu-header">Column Visibility</div>
                  {Object.entries(visibleColumns).map(([column, isVisible]) => (
                    <label key={column} className="column-item">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleColumnVisibility(column)}
                      />
                      <span>{column}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <table className="order-history-table">
            <thead>
              <tr>
                {visibleColumns.invoiceId && <th>Invoice ID</th>}
                {visibleColumns.customer && <th>Customer</th>}
                {visibleColumns.date && <th>Date</th>}
                {visibleColumns.total && <th>Total</th>}
                {visibleColumns.paid && <th>Paid</th>}
                {visibleColumns.due && <th>Due</th>}
                {visibleColumns.staff && <th>Staff</th>}
                {visibleColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.OrderId}>
                  {visibleColumns.invoiceId && <td>{order.OrderId}</td>}
                  {visibleColumns.customer && <td>{order.CustomerName}</td>}
                  {visibleColumns.date && <td>{new Date(order.OrderDate).toLocaleDateString()}</td>}
                  {visibleColumns.total && <td>{order.Total}</td>}
                  {visibleColumns.paid && <td>{order.Paid}</td>}
                  {visibleColumns.due && <td>{order.Remaining}</td>}
                  {visibleColumns.staff && <td>{order.WorkerName || 'N/A'}</td>}
                  {visibleColumns.actions && (
                    <td>
                      <button onClick={() => handlePrint(order.OrderId)} className="action-btn print">🖨️</button>
                      <button onClick={() => handleEdit(order.OrderId)} className="action-btn edit">✏️</button>
                      <button onClick={() => handleDelete(order.OrderId)} className="action-btn delete">🗑️</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
