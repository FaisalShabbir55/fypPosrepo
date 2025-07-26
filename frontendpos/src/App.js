import './App.css';

import Signup from "./components/auth/signup.js";
import Login from "./components/auth/login.js";
// import Inactive_User from "./checkuser";
import Sidebar from "./components/Layout/sidebar.js";
import Products from "./components/Layout/products.js";
import AddProduct from "./components/Layout/addproduct.js";
import SupplierData from "./components/Layout/Supplier.js";
import Users from "./components/Layout/getUsers.js"
import Category from "./components/Layout/addCategory.js";
import OrderForm from "./components/Layout/orderForm.js";
import OrderList from "./components/Layout/orderList.js";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import OrderBill from "./components/Layout/bill.js";
import EditOrderForm from './components/Layout/editOrder.js';
import ProtectedRoute from './components/ProtectedRoute.js';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sidebar" element={<ProtectedRoute><Sidebar/></ProtectedRoute>}/>
          <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>}/>
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><SupplierData/></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
          <Route path="/category" element={<ProtectedRoute><Category/></ProtectedRoute>}/>
          <Route path="/create-order" element={<ProtectedRoute><OrderForm/></ProtectedRoute>}/>
          <Route path="/order-List" element={<ProtectedRoute><OrderList/></ProtectedRoute>}/>
          <Route path="/bill" element={<ProtectedRoute><OrderBill orderId={6}/></ProtectedRoute>}/>
          <Route path="/edit-order/:id" element={<ProtectedRoute><EditOrderForm/></ProtectedRoute>}/>
          {/* <Route path="/inactive-users" element={<Inactive_User/>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;