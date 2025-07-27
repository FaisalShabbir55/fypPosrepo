// Users.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CSS/getUsers.css'; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust as needed
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/api/auth/staff')
      .then((response) => {
        console.log('API Response:', response.data); // Debug log
        if (response.data.success) {
          const staffData = response.data.staff || response.data.users || [];
          const userArray = Array.isArray(staffData) ? staffData : [];
          setUsers(userArray);
          setFilteredUsers(userArray); // Initialize filtered users
        } else {
          setError(response.data.message || 'No users found');
          setUsers([]); // Ensure users is always an array
          setFilteredUsers([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch users');
        setUsers([]); // Ensure users is always an array
        setFilteredUsers([]);
      });
  };

  // Automatic search effect - triggers whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset to first page after search
  }, [searchTerm, users]);

  const deleteUser = (userId, userName) => {
    // Check if current user has permission
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Manager') {
      alert('Access denied. Only Admins and Managers can delete staff members.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      const token = localStorage.getItem('token');
      
      axios.delete(`http://localhost:3001/api/auth/staff/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success !== false) {
          // Refresh the user list
          fetchUsers();
          alert('Staff member deleted successfully');
        } else {
          alert(response.data.message || 'Failed to delete user');
        }
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Failed to delete user';
        alert(errorMessage);
      });
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className="users-container">
          <h2>All Staff Users</h2>
          
          {/* Role indicator */}
          {JSON.parse(localStorage.getItem('user') || '{}').role === 'Employee' && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              color: '#856404', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px' 
            }}>
              <strong>Note:</strong> You are logged in as an Employee. Only Admins and Managers can delete staff members.
            </div>
          )}
          
          {/* Search Section */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {error && <p className="error">{error}</p>}
          
          {/* User count display */}
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Showing {currentUsers.length} of {filteredUsers.length} users
            {searchTerm && ` (filtered from ${users.length} total)`}
          </p>
          
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.Name}</td>
                    <td>{user.Email}</td>
                    <td>{user.Role}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(user.Id, user.Name)}
                        className="action-btn delete"
                        disabled={JSON.parse(localStorage.getItem('user') || '{}').role === 'Employee'}
                        title={JSON.parse(localStorage.getItem('user') || '{}').role === 'Employee' ? 'Only Admins and Managers can delete staff' : 'Delete staff member'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="no-data">No users found</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="pagination">
              <button onClick={prevPage} className="pagination-btn" disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={nextPage} className="pagination-btn" disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}