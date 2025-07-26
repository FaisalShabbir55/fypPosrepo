import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CSS/products.css'
import Sidebar from './sidebar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    no: true,
    productName: true,
    category: true,
    price: true,
    stock: true,
    supplier: true,
    supplierNumber: true,
    productBrand: true,
    description: true,
    actions: true
  });
  const [formData, setFormData] = useState({
    ProductName: '', Category: '', Price: '', Stock: '',
    Supplier: '', SupplierNumber: '', ProductBrand: '', Description: '',
    TotalPayment: '', PaidAmount: ''
  });

  const columnMenuRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ProductBrand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/auth/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3001/api/auth/delete-products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const startEdit = (product) => {
    setEditing(product.ProductID);
    setFormData(product);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      ProductName: '', Category: '', Price: '', Stock: '',
      Supplier: '', SupplierNumber: '', ProductBrand: '', Description: '',
      TotalPayment: '', PaidAmount: ''
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/auth/update-products/${editing}`, formData);
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Export Functions
  const copyToClipboard = () => {
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Product Name', 'Category', 'Price', 'Stock', 'Supplier', 'Supplier#', 'Product Brand', 'Description'];
    const columnKeys = ['no', 'productName', 'category', 'price', 'stock', 'supplier', 'supplierNumber', 'productBrand', 'description'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = filteredProducts.map((product, rowIndex) => {
      const allData = [
        rowIndex + 1,
        product.ProductName,
        product.Category,
        product.Price,
        product.Stock,
        product.Supplier,
        product.SupplierNumber,
        product.ProductBrand,
        product.Description
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
    const allHeaders = ['No.', 'Product Name', 'Category', 'Price', 'Stock', 'Supplier', 'Supplier#', 'Product Brand', 'Description'];
    const columnKeys = ['no', 'productName', 'category', 'price', 'stock', 'supplier', 'supplierNumber', 'productBrand', 'description'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = filteredProducts.map((product, rowIndex) => {
      const allData = [
        rowIndex + 1,
        product.ProductName,
        product.Category,
        product.Price,
        product.Stock,
        product.Supplier,
        product.SupplierNumber,
        product.ProductBrand,
        product.Description
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Product Name', 'Category', 'Price', 'Stock', 'Supplier', 'Supplier#', 'Product Brand', 'Description'];
    const columnKeys = ['no', 'productName', 'category', 'price', 'stock', 'supplier', 'supplierNumber', 'productBrand', 'description'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = filteredProducts.map((product, rowIndex) => {
      const allData = [
        rowIndex + 1,
        product.ProductName,
        product.Category,
        product.Price,
        product.Stock,
        product.Supplier,
        product.SupplierNumber,
        product.ProductBrand,
        product.Description
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
    
    doc.setFontSize(18);
    doc.text('Products List', 14, 22);
    
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Product Name', 'Category', 'Price', 'Stock', 'Supplier', 'Supplier#', 'Product Brand', 'Description'];
    const columnKeys = ['no', 'productName', 'category', 'price', 'stock', 'supplier', 'supplierNumber', 'productBrand', 'description'];
    
    const headers = [allHeaders.filter((header, index) => visibleColumns[columnKeys[index]])];
    
    const rows = filteredProducts.map((product, rowIndex) => {
      const allData = [
        rowIndex + 1,
        product.ProductName,
        product.Category,
        product.Price,
        product.Stock,
        product.Supplier,
        product.SupplierNumber,
        product.ProductBrand,
        product.Description
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: headers[0].reduce((acc, header, index) => {
        acc[index] = { cellWidth: 'auto' };
        return acc;
      }, {})
    });

    doc.save('products_data.pdf');
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Product Name', 'Category', 'Price', 'Stock', 'Supplier', 'Supplier#', 'Product Brand', 'Description'];
    const columnKeys = ['no', 'productName', 'category', 'price', 'stock', 'supplier', 'supplierNumber', 'productBrand', 'description'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    let tableHTML = `
      <html>
        <head>
          <title>Products List</title>
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
          <h1>Products List</h1>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
    `;

    filteredProducts.forEach((product, rowIndex) => {
      const allData = [
        rowIndex + 1,
        product.ProductName,
        product.Category,
        product.Price,
        product.Stock,
        product.Supplier,
        product.SupplierNumber,
        product.ProductBrand,
        product.Description
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

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className="products-container">
          {/* Header Section */}
          <div className="page-header">
            <h1>Products List</h1>
            <div className="auth-links">
              <span className="logout-link">LOGOUT</span>
              <span className="separator">/</span>
              <span className="dashboard-text">Admin Dashboard</span>
            </div>
          </div>

          {/* Product Data Section */}
          <div className="product-data-header">
            <h2>Product Data</h2>
          </div>

          {/* Export Buttons and Search */}
          <div className="table-controls">
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
                    {Object.entries(visibleColumns).map(([key, visible]) => (
                      <label key={key} className="column-item">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={() => toggleColumnVisibility(key)}
                        />
                        <span>{
                          key === 'no' ? 'No.' :
                          key === 'productName' ? 'Product Name' :
                          key === 'category' ? 'Category' :
                          key === 'price' ? 'Price' :
                          key === 'stock' ? 'Stock' :
                          key === 'supplier' ? 'Supplier' :
                          key === 'supplierNumber' ? 'Supplier#' :
                          key === 'productBrand' ? 'Product Brand' :
                          key === 'description' ? 'Description' :
                          'Actions'
                        }</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="search-container">
              <label htmlFor="search">Search:</label>
              <input
                id="search"
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  {visibleColumns.no && <th>No. ↑↓</th>}
                  {visibleColumns.productName && <th>Product Name ↑↓</th>}
                  {visibleColumns.category && <th>Category ↑↓</th>}
                  {visibleColumns.price && <th>Price ↑↓</th>}
                  {visibleColumns.stock && <th>Stock ↑↓</th>}
                  {visibleColumns.supplier && <th>Supplier ↑↓</th>}
                  {visibleColumns.supplierNumber && <th>Supplier# ↑↓</th>}
                  {visibleColumns.productBrand && <th>Product Brand ↑↓</th>}
                  {visibleColumns.description && <th>Description ↑↓</th>}
                  {visibleColumns.actions && <th>Edit ↑↓</th>}
                  {visibleColumns.actions && <th>Delete ↑↓</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  editing === product.ProductID ? (
                    <tr key={product.ProductID} className="edit-row">
                      {visibleColumns.no && <td>{index + 1}</td>}
                      {visibleColumns.productName && <td><input name="ProductName" value={formData.ProductName} onChange={handleChange} /></td>}
                      {visibleColumns.category && <td><input name="Category" value={formData.Category} onChange={handleChange} /></td>}
                      {visibleColumns.price && <td><input name="Price" type="number" value={formData.Price} onChange={handleChange} /></td>}
                      {visibleColumns.stock && <td><input name="Stock" type="number" value={formData.Stock} onChange={handleChange} /></td>}
                      {visibleColumns.supplier && <td><input name="Supplier" value={formData.Supplier} onChange={handleChange} /></td>}
                      {visibleColumns.supplierNumber && <td><input name="SupplierNumber" value={formData.SupplierNumber} onChange={handleChange} /></td>}
                      {visibleColumns.productBrand && <td><input name="ProductBrand" value={formData.ProductBrand} onChange={handleChange} /></td>}
                      {visibleColumns.description && <td><input name="Description" value={formData.Description} onChange={handleChange} /></td>}
                      {visibleColumns.actions && (
                        <td>
                          <button className="save-btn" onClick={handleUpdate}>✓</button>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td>
                          <button className="cancel-btn" onClick={cancelEdit}>✗</button>
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr key={product.ProductID}>
                      {visibleColumns.no && <td>{index + 1}</td>}
                      {visibleColumns.productName && <td>{product.ProductName}</td>}
                      {visibleColumns.category && <td>{product.Category}</td>}
                      {visibleColumns.price && <td>{product.Price}</td>}
                      {visibleColumns.stock && <td>{product.Stock}</td>}
                      {visibleColumns.supplier && <td>{product.Supplier}</td>}
                      {visibleColumns.supplierNumber && <td>{product.SupplierNumber}</td>}
                      {visibleColumns.productBrand && <td>{product.ProductBrand}</td>}
                      {visibleColumns.description && <td>{product.Description}</td>}
                      {visibleColumns.actions && (
                        <td>
                          <button className="edit-btn" onClick={() => startEdit(product)}>✎</button>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td>
                          <button className="delete-btn" onClick={() => deleteProduct(product.ProductID)}>🗑</button>
                        </td>
                      )}
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="table-footer">
            <div className="entries-info">
              Showing 1 to {filteredProducts.length} of {filteredProducts.length} entries
            </div>
            <div className="pagination">
              <button className="pagination-btn">Previous</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;