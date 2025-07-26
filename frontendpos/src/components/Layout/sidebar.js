import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/sidebar.css';
import { logout } from '../../utils/auth';

export default function Sidebar() {
   const navigate = useNavigate();
   
   const handleLogout = () => {
     logout();
   };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">POS System</h2>
      <ul className="sidebar-list">
         <li onClick={() => navigate('/signup')}>Staff Registration</li>
        <li onClick={() => navigate('/')}>Create New Order</li>
        <li onClick={() => navigate('/products')}>My Products</li>
        <li onClick={() => navigate('/order-List')}>Order List</li>
        <li onClick={() => navigate('/add-product')}>Add new Product</li>
        <li onClick={() => navigate('/suppliers')}>My Vendors</li>
        <li onClick={() => navigate('/users')}>Staff Data</li>
        <li onClick={() => navigate('/category')}>Add new Category</li>     
        <li onClick={() => navigate('/create-order')}>Create New Order</li>                      
        <li onClick={handleLogout} className="logout-item">Logout</li>
      </ul>
    </div>
  );
}
