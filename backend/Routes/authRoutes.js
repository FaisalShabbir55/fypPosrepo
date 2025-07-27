import express from 'express'
import { signup } from '../Controller/regStaff.js';
import { login } from '../Controller/AuthController.js';
import { getAllProducts, addProduct, deleteProduct, updateProduct, searchProduct } from '../Controller/productController.js';
import { getSuppliers, updateSupplier, deleteSupplier } from '../Controller/Supplierinfo.js';
import { getAllStaff, deleteStaff } from '../Controller/manageStaff.js';
import { addCategory , getCategories, deleteCategory,searchCategory} from '../Controller/category.js';
import { createOrder, getOrders, searchOrders, deleteOrder, editOrder, getOrderDetails, updateOrder } from '../Controller/orderForm.js';

import { getLowStockProducts, getStockStatistics } from '../Controller/checkStock.js'; 
import { getTrendingProducts } from '../Controller/trendingProducts.js'; 
// ProductRoutes







const router = express.Router();

// Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// Products Routes
router.get('/products', getAllProducts);
router.post('/add-products', addProduct);
router.delete('/delete-products/:id', deleteProduct);
router.put('/update-products/:id', updateProduct);
router.get('/search-product', searchProduct);

// Supplier Routes
router.get('/suppliers', getSuppliers);
router.put('/edit-supplier', updateSupplier);
router.delete('/delete-supplier', deleteSupplier);

// Staff Management Routes
router.get('/staff', getAllStaff);
router.delete('/staff/:id', deleteStaff);

// Category Routes
router.post('/add-category', addCategory);
router.get('/get-category', getCategories);
router.delete('/delete-category/:id', deleteCategory);
router.get('/search-category', searchCategory);

// Order Routes 

router.post('/create-order', createOrder);
router.get('/order-List', getOrders)
router.get('/search-order', searchOrders);
router.delete('/delete-order/:id', deleteOrder);
router.put('/edit-order/:id', editOrder);
router.get('/order-details/:id',getOrderDetails)
router.put('/update-order/:id', updateOrder)




//stock routes


router.get('/low-stock', getLowStockProducts);
router.get('/stock-statistics', getStockStatistics);





// trending  Products API's Here  


router.get('/trending-products', getTrendingProducts);







export default router;




