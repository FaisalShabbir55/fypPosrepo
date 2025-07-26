












// Category.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CSS/category.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Category() {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    no: true,
    category: true,
    actions: true
  });
  const itemsPerPage = 5;

  const columnMenuRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/get-category');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/add-category', {
        CategoryName: categoryName,
      });
      setMessage(response.data.message);
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/auth/delete-category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete category');
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchKeyword.trim()) {
      fetchCategories();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/auth/search-category?keyword=${searchKeyword}`
      );
      setCategories(response.data);
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed');
    }
  }, [searchKeyword]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on new search or fetch
  }, [categories]);

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Export Functions
  const copyToClipboard = () => {
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Category', 'Actions'];
    const columnKeys = ['no', 'category', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = currentItems.map((cat, rowIndex) => {
      const allData = [
        indexOfFirstItem + rowIndex + 1,
        cat.CategoryName,
        'DELETE'
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
    const allHeaders = ['No.', 'Category', 'Actions'];
    const columnKeys = ['no', 'category', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = currentItems.map((cat, rowIndex) => {
      const allData = [
        indexOfFirstItem + rowIndex + 1,
        cat.CategoryName,
        'DELETE'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'categories_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Category', 'Actions'];
    const columnKeys = ['no', 'category', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    const rows = currentItems.map((cat, rowIndex) => {
      const allData = [
        indexOfFirstItem + rowIndex + 1,
        cat.CategoryName,
        'DELETE'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4'); // portrait orientation
    
    doc.setFontSize(18);
    doc.text('Categories List', 14, 22);
    
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Category', 'Actions'];
    const columnKeys = ['no', 'category', 'actions'];
    
    const headers = [allHeaders.filter((header, index) => visibleColumns[columnKeys[index]])];
    
    const rows = currentItems.map((cat, rowIndex) => {
      const allData = [
        indexOfFirstItem + rowIndex + 1,
        cat.CategoryName,
        'DELETE'
      ];
      return allData.filter((data, index) => visibleColumns[columnKeys[index]]);
    });

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: headers[0].reduce((acc, header, index) => {
        acc[index] = { cellWidth: 'auto' };
        return acc;
      }, {})
    });

    doc.save('categories_data.pdf');
  };

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    
    // Create headers based on visible columns
    const allHeaders = ['No.', 'Category', 'Actions'];
    const columnKeys = ['no', 'category', 'actions'];
    
    const headers = allHeaders.filter((header, index) => visibleColumns[columnKeys[index]]);
    
    let tableHTML = `
      <html>
        <head>
          <title>Categories List</title>
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
          <h1>Categories List</h1>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
    `;

    currentItems.forEach((cat, rowIndex) => {
      const allData = [
        indexOfFirstItem + rowIndex + 1,
        cat.CategoryName,
        'DELETE'
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
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="category-container">
          <div className="card blue-card">
            <h3>Categories Addition</h3>
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleAddCategory}>
              <label htmlFor="itemName">Items Name</label>
              <input
                id="itemName"
                type="text"
                placeholder="Enter Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <button type="submit" className="btn primary-btn">Submit</button>
            </form>
          </div>

          <div className="card green-card">
            <h3>DATA</h3>
            <div className="table-header">
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
                            key === 'category' ? 'Category' :
                            'Actions'
                          }</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  {visibleColumns.no && <th>No.</th>}
                  {visibleColumns.category && <th>Category</th>}
                  {visibleColumns.actions && <th>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length}>No categories found</td>
                  </tr>
                ) : (
                  currentItems.map((cat, index) => (
                    <tr key={cat.Id}>
                      {visibleColumns.no && <td>{indexOfFirstItem + index + 1}</td>}
                      {visibleColumns.category && <td>{cat.CategoryName}</td>}
                      {visibleColumns.actions && (
                        <td>
                          <button className="btn delete-btn" onClick={() => handleDelete(cat.Id)}>
                            DELETE
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagination">
              <span>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, categories.length)} of {categories.length} entries
              </span>
              <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
              <button disabled>{currentPage}</button>
              <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





















//category ka working code before styling 










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // import './CSS/addproduct.css';

// export default function Category() {
//   const [categoryName, setCategoryName] = useState('');
//   const [message, setMessage] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState('');

//   // Fetch all categories
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/auth/get-category');
//       setCategories(response.data);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add category
//   const handleAddCategory = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/add-category', {
//         CategoryName: categoryName,
//       });
//       setMessage(response.data.message);
//       setCategoryName('');
//       fetchCategories();
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.message || 'Error adding category');
//     }
//   };

//   // Delete category
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/api/auth/delete-category/${id}`);
//       fetchCategories();
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert('Failed to delete category');
//     }
//   };

//   // Search category
//   const handleSearch = async () => {
//     if (!searchKeyword.trim()) {
//       fetchCategories();
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:3001/api/auth/search-category?keyword=${searchKeyword}`);
//       setCategories(response.data);
//     } catch (err) {
//       console.error('Search error:', err);
//       alert('Search failed');
//     }
//   };

//   return (
//     <div className='mainform'>
//       <h2>Add Category</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleAddCategory}>
//         <div className='d2'>
//           <input
//             type="text"
//             placeholder="Category Name"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" style={{ marginTop: '10px' }}>Add Category</button>
//       </form>

//       {/* 🔍 Search Input */}
//       <div className='d2' style={{ marginTop: '30px' }}>
//         <input
//           type="text"
//           placeholder="Search Category"
//           value={searchKeyword}
//           onChange={(e) => setSearchKeyword(e.target.value)}
//         />
//         <button
//           onClick={handleSearch}
//           style={{ marginLeft: '10px', padding: '6px 12px', cursor: 'pointer' }}
//         >
//           Search
//         </button>
//       </div>

//       <h2 style={{ marginTop: '30px' }}>All Categories</h2>
//       <table border="1" style={{ width: '100%', marginTop: '10px' }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Category Name</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.length === 0 ? (
//             <tr><td colSpan="3">No categories found</td></tr>
//           ) : (
//             categories.map((cat) => (
//               <tr key={cat.Id}>
//                 <td>{cat.Id}</td>
//                 <td>{cat.CategoryName}</td>
//                 <td>
//                   <button
//                     style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
//                     onClick={() => handleDelete(cat.Id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
