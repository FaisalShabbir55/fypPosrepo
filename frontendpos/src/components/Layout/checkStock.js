import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CSS/stock.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LowStockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
    fetchStatistics();
  }, [threshold]);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/auth/low-stock?threshold=${threshold}`);
      setLowStockProducts(res.data);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/auth/stock-statistics');
      setStatistics(res.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 5) return 'critical';
    if (stock <= 10) return 'low';
    return 'normal';
  };

  const getStockStatusText = (stock) => {
    if (stock <= 5) return 'Critical';
    if (stock <= 10) return 'Low';
    return 'Normal';
  };

  // Export Functions
  const copyToClipboard = () => {
    const headers = ['Product Name', 'Category', 'Current Stock', 'Status', 'Supplier', 'Supplier Contact', 'Price'];
    const data = lowStockProducts.map(product => [
      product.ProductName,
      product.Category,
      product.Stock,
      getStockStatusText(product.Stock),
      product.Supplier,
      product.SupplierNumber,
      `$${product.Price}`
    ]);

    const tableText = [headers, ...data].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(tableText).then(() => {
      alert('Low stock data copied to clipboard!');
    });
  };

  const exportToCSV = () => {
    const headers = ['Product Name', 'Category', 'Current Stock', 'Status', 'Supplier', 'Supplier Contact', 'Price'];
    const data = lowStockProducts.map(product => [
      product.ProductName,
      product.Category,
      product.Stock,
      getStockStatusText(product.Stock),
      product.Supplier,
      product.SupplierNumber,
      product.Price
    ]);

    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `low_stock_alert_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const headers = ['Product Name', 'Category', 'Current Stock', 'Status', 'Supplier', 'Supplier Contact', 'Price'];
    const data = lowStockProducts.map(product => [
      product.ProductName,
      product.Category,
      product.Stock,
      getStockStatusText(product.Stock),
      product.Supplier,
      product.SupplierNumber,
      product.Price
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Low Stock Alert');
    XLSX.writeFile(wb, `low_stock_alert_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Low Stock Alert Report', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Stock Threshold: ≤${threshold}`, 14, 40);
    
    // Add statistics
    doc.text(`Total Products: ${statistics.TotalProducts || 0}`, 14, 50);
    doc.text(`Critical Stock: ${statistics.CriticalStock || 0}`, 14, 58);
    doc.text(`Low Stock: ${statistics.LowStock || 0}`, 14, 66);
    
    // Prepare table data
    const tableHeaders = ['Product Name', 'Category', 'Stock', 'Status', 'Supplier', 'Contact', 'Price'];
    const tableData = lowStockProducts.map(product => [
      product.ProductName,
      product.Category,
      product.Stock,
      getStockStatusText(product.Stock),
      product.Supplier,
      product.SupplierNumber,
      `$${product.Price}`
    ]);

    // Add table
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 75,
      theme: 'striped',
      headStyles: { fillColor: [220, 53, 69] },
      didParseCell: function (data) {
        if (data.row.index >= 0 && data.column.index === 3) {
          const status = data.cell.text[0];
          if (status === 'Critical') {
            data.cell.styles.textColor = [220, 53, 69];
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'Low') {
            data.cell.styles.textColor = [255, 193, 7];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    doc.save(`low_stock_alert_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printTable = () => {
    const printContent = document.querySelector('.table-wrapper').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Low Stock Alert Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .stock-critical { background-color: rgba(220, 53, 69, 0.1); }
            .stock-low { background-color: rgba(255, 193, 7, 0.1); }
            .stock-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
            .stock-badge.critical { background: #dc3545; color: white; }
            .stock-badge.low { background: #ffc107; color: #212529; }
            .status-badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; }
            .status-badge.critical { background: #dc3545; color: white; }
            .status-badge.low { background: #ffc107; color: #212529; }
            .reorder-btn { display: none; }
            @media print {
              .reorder-btn { display: none !important; }
            }
          </style>
        </head>
        <body>
          <h1>Low Stock Alert Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Stock Threshold:</strong> ≤${threshold}</p>
          <p><strong>Total Low Stock Products:</strong> ${lowStockProducts.length}</p>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className="low-stock-container">
          {/* Header */}
          <div className="page-header">
            <h1>Low Stock Alerts</h1>
            <div className="auth-links">
              <span className="logout-link">LOGOUT</span>
              <span className="separator">/</span>
              <span className="dashboard-text">Admin Dashboard</span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card total">
              <h3>Total Products</h3>
              <p className="stat-number">{statistics.TotalProducts || 0}</p>
            </div>
            <div className="stat-card critical">
              <h3>Critical Stock (≤5)</h3>
              <p className="stat-number">{statistics.CriticalStock || 0}</p>
            </div>
            <div className="stat-card low">
              <h3>Low Stock (6-10)</h3>
              <p className="stat-number">{statistics.LowStock || 0}</p>
            </div>
            <div className="stat-card normal">
              <h3>Normal Stock (>10)</h3>
              <p className="stat-number">{statistics.NormalStock || 0}</p>
            </div>
          </div>

          {/* Controls with Export Buttons */}
          <div className="controls">
            <div className="threshold-control">
              <label htmlFor="threshold">Stock Threshold:</label>
              <select
                id="threshold"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
              >
                <option value={5}>5 or less</option>
                <option value={10}>10 or less</option>
                <option value={15}>15 or less</option>
                <option value={20}>20 or less</option>
              </select>
            </div>
            
            {/* Export Buttons */}
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
                title="Print Report"
              >
                🖨️ Print
              </button>
              <button className="refresh-btn" onClick={fetchLowStockProducts}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Low Stock Table */}
          <div className="table-wrapper">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Supplier</th>
                    <th>Supplier Contact</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">
                        No low stock products found!
                      </td>
                    </tr>
                  ) : (
                    lowStockProducts.map((product) => (
                      <tr key={product.ProductID} className={`stock-${getStockStatus(product.Stock)}`}>
                        <td>{product.ProductName}</td>
                        <td>{product.Category}</td>
                        <td className="stock-cell">
                          <span className={`stock-badge ${getStockStatus(product.Stock)}`}>
                            {product.Stock}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStockStatus(product.Stock)}`}>
                            {getStockStatusText(product.Stock)}
                          </span>
                        </td>
                        <td>{product.Supplier}</td>
                        <td>{product.SupplierNumber}</td>
                        <td>${product.Price}</td>
                        <td>
                          <button 
                            className="reorder-btn"
                            onClick={() => alert(`Reorder ${product.ProductName} from ${product.Supplier}`)}
                          >
                            📞 Contact Supplier
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="table-footer">
            <div className="entries-info">
              Showing {lowStockProducts.length} low stock products (threshold: ≤{threshold})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;