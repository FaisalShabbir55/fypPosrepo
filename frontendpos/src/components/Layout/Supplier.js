"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "./sidebar"
import "./CSS/supplier.css"

const SupplierData = () => {
  const [suppliers, setSuppliers] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editedSupplier, setEditedSupplier] = useState({
    NewSupplierName: "",
    NewSupplierContact: "",
    TotalPayment: "",
    PaidAmount: "",
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3001/api/auth/suppliers")
      setSuppliers(res.data)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (index) => {
    const supplier = suppliers[index]
    setEditIndex(index)
    setEditedSupplier({
      NewSupplierName: supplier.SupplierName,
      NewSupplierContact: supplier.SupplierContact,
      TotalPayment: supplier.TotalPayment,
      PaidAmount: supplier.Paid,
    })
  }

  const handleEditChange = (e) => {
    setEditedSupplier({ ...editedSupplier, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (originalSupplier) => {
    try {
      await axios.put("http://localhost:3001/api/auth/edit-supplier", {
        SupplierName: originalSupplier.SupplierName,
        SupplierContact: originalSupplier.SupplierContact,
        ...editedSupplier,
      })
      setEditIndex(null)
      fetchSuppliers()
    } catch (error) {
      console.error("Error updating supplier:", error)
    }
  }

  const handleDelete = async (supplier) => {
    if (window.confirm(`Are you sure you want to delete ${supplier.SupplierName}?`)) {
      try {
        await axios.delete("http://localhost:3001/api/auth/delete-supplier", {
          data: {
            SupplierName: supplier.SupplierName,
            SupplierContact: supplier.SupplierContact,
          },
        })
        fetchSuppliers()
      } catch (error) {
        console.error("Error deleting supplier:", error)
      }
    }
  }

  const calculateStats = () => {
    const totalSuppliers = suppliers.length
    const totalPayment = suppliers.reduce((sum, supplier) => sum + Number.parseFloat(supplier.TotalPayment || 0), 0)
    const totalPaid = suppliers.reduce((sum, supplier) => sum + Number.parseFloat(supplier.Paid || 0), 0)
    const totalRemaining = totalPayment - totalPaid

    return { totalSuppliers, totalPayment, totalPaid, totalRemaining }
  }

  const getPaymentStatus = (totalPayment, paid) => {
    const remaining = totalPayment - paid
    if (remaining <= 0) return "paid"
    if (remaining > totalPayment * 0.5) return "overdue"
    return "pending"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="main1">
        <Sidebar />
        <div className="main-content">
          <div className="loading">Loading suppliers...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="main1">
      <Sidebar />
      <div className="main-content">
        {/* Header Section */}
        <div className="page-header">
          <h1 className="page-title">Supplier Management</h1>
          <p className="page-subtitle">Manage your suppliers, payments, and inventory relationships</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSuppliers}</div>
            <div className="stat-label">Total Suppliers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalPayment)}</div>
            <div className="stat-label">Total Payment</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalPaid)}</div>
            <div className="stat-label">Amount Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalRemaining)}</div>
            <div className="stat-label">Remaining Balance</div>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Supplier Directory</h3>
            <p className="table-description">Complete list of all registered suppliers and their payment status</p>
          </div>

          {suppliers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No Suppliers Found</h3>
              <p className="empty-state-description">Start by adding your first supplier to the system</p>
            </div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Contact Info</th>
                  <th>Stock Level</th>
                  <th>Total Payment</th>
                  <th>Amount Paid</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => {
                  const remaining =
                    Number.parseFloat(supplier.TotalPayment || 0) - Number.parseFloat(supplier.Paid || 0)
                  const status = getPaymentStatus(
                    Number.parseFloat(supplier.TotalPayment || 0),
                    Number.parseFloat(supplier.Paid || 0),
                  )

                  return (
                    <tr key={index}>
                      {editIndex === index ? (
                        <>
                          <td>
                            <input
                              name="NewSupplierName"
                              value={editedSupplier.NewSupplierName}
                              onChange={handleEditChange}
                              className="table-input"
                              placeholder="Supplier name"
                            />
                          </td>
                          <td>
                            <input
                              name="NewSupplierContact"
                              value={editedSupplier.NewSupplierContact}
                              onChange={handleEditChange}
                              className="table-input"
                              placeholder="Contact info"
                            />
                          </td>
                          <td>
                            <span className="amount amount-neutral">{supplier.Stock || "N/A"}</span>
                          </td>
                          <td>
                            <input
                              name="TotalPayment"
                              value={editedSupplier.TotalPayment}
                              onChange={handleEditChange}
                              className="table-input"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </td>
                          <td>
                            <input
                              name="PaidAmount"
                              value={editedSupplier.PaidAmount}
                              onChange={handleEditChange}
                              className="table-input"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                          </td>
                          <td>
                            <span className="amount amount-negative">
                              {formatCurrency(
                                Number.parseFloat(editedSupplier.TotalPayment || 0) -
                                  Number.parseFloat(editedSupplier.PaidAmount || 0),
                              )}
                            </span>
                          </td>
                          <td>
                            <span className="status-badge status-pending">Editing</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleEditSubmit(supplier)} className="btn btn-save">
                                Save
                              </button>
                              <button onClick={() => setEditIndex(null)} className="btn btn-cancel">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <strong>{supplier.SupplierName}</strong>
                          </td>
                          <td>{supplier.SupplierContact}</td>
                          <td>
                            <span className="amount amount-neutral">{supplier.Stock || "N/A"}</span>
                          </td>
                          <td>
                            <span className="amount amount-neutral">{formatCurrency(supplier.TotalPayment)}</span>
                          </td>
                          <td>
                            <span className="amount amount-positive">{formatCurrency(supplier.Paid)}</span>
                          </td>
                          <td>
                            <span className={`amount ${remaining > 0 ? "amount-negative" : "amount-positive"}`}>
                              {formatCurrency(remaining)}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${status}`}>
                              {status === "paid" ? "Paid" : status === "pending" ? "Pending" : "Overdue"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button onClick={() => handleEditClick(index)} className="btn btn-edit">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(supplier)} className="btn btn-delete">
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplierData
