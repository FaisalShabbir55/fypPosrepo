

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar'
import './CSS/supplier.css'


const SupplierData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState({
    NewSupplierName: '',
    NewSupplierContact: '',
    TotalPayment: '',
    PaidAmount: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(' http://localhost:3001/api/auth/suppliers');
      setSuppliers(res.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleEditClick = (index) => {
    const supplier = suppliers[index];
    setEditIndex(index);
    setEditedSupplier({
      NewSupplierName: supplier.SupplierName,
      NewSupplierContact: supplier.SupplierContact,
      TotalPayment: supplier.TotalPayment,
      PaidAmount: supplier.Paid
    });
  };

  const handleEditChange = (e) => {
    setEditedSupplier({ ...editedSupplier, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (originalSupplier) => {
    try {
      await axios.put(' http://localhost:3001/api/auth/edit-supplier', {
        SupplierName: originalSupplier.SupplierName,
        SupplierContact: originalSupplier.SupplierContact,
        ...editedSupplier
      });
      setEditIndex(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleDelete = async (supplier) => {
    try {
      await axios.delete(' http://localhost:3001/api/auth/delete-supplier', {
        data: {
          SupplierName: supplier.SupplierName,
          SupplierContact: supplier.SupplierContact
        }
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (

    <div className="main1">
      <Sidebar />
      <div className="main-content">
        <div>
          <h2>Supplier List</h2>
          <table className="styled-table" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Stock</th>
                <th>Total Payment</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={index}>
                  {editIndex === index ? (
                    <>
                      <td><input name="NewSupplierName" value={editedSupplier.NewSupplierName} onChange={handleEditChange} /></td>
                      <td><input name="NewSupplierContact" value={editedSupplier.NewSupplierContact} onChange={handleEditChange} /></td>
                      <td>{supplier.Stock}</td>
                      <td><input name="TotalPayment" value={editedSupplier.TotalPayment} onChange={handleEditChange} /></td>
                      <td><input name="PaidAmount" value={editedSupplier.PaidAmount} onChange={handleEditChange} /></td>
                      <td>{(editedSupplier.TotalPayment - editedSupplier.PaidAmount).toFixed(2)}</td>
                      <td>
                        <button onClick={() => handleEditSubmit(supplier)}>Save</button>
                      </td>
                      <td>
                        <button onClick={() => setEditIndex(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{supplier.SupplierName}</td>
                      <td>{supplier.SupplierContact}</td>
                      <td>{supplier.Stock}</td>
                      <td>{supplier.TotalPayment}</td>
                      <td>{supplier.Paid}</td>
                      <td>{supplier.RemainingPayment}</td>
                      <td>
                        <button onClick={() => handleEditClick(index)}>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(supplier)}>Delete</button>
                      </td>
                    </>
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

export default SupplierData;
