import { poolPromise, sql } from '../Database.js';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../Models/slModel.js'; // adjust path if needed

// login Api



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email in Staff table
    const pool = await poolPromise;
    const findUserQuery = `SELECT * FROM Staff WHERE Email = @Email`;
    const findUserRequest = pool.request();
    findUserRequest.input('Email', sql.NVarChar, email);
    const result = await findUserRequest.query(findUserQuery);

    if (result.recordset.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = result.recordset[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.StaffID,
        email: user.Email,
        role: user.Role
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.StaffID,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};























// export const signup = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const pool = await poolPromise;

//     // Check if email already exists
//     const findUserQuery = `SELECT * FROM Signup WHERE email = @Email`;
//     const findUserRequest = pool.request();
//     findUserRequest.input('Email', sql.VarChar, email);
//     const existingUser = await findUserRequest.query(findUserQuery);

//     if (existingUser.recordset.length > 0) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert new user
//     const insertUserQuery = `INSERT INTO Signup (name, email, password) VALUES (@Name, @Email, @Password)`;
//     const insertUserRequest = pool.request();
//     insertUserRequest.input('Name', sql.VarChar, name);
//     insertUserRequest.input('Email', sql.VarChar, email);
//     insertUserRequest.input('Password', sql.VarChar, hashedPassword);

//     await insertUserRequest.query(insertUserQuery);
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (err) {
//     console.error('Error during signup:', err);
//     res.status(500).json({ message: 'Error creating user' });
//   }
// };

// Login Controller
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const pool = await poolPromise;

//     // Find user by email
//     const findUserQuery = `SELECT * FROM Signup WHERE email = @Email`;
//     const findUserRequest = pool.request();
//     findUserRequest.input('Email', sql.VarChar, email);
//     const result = await findUserRequest.query(findUserQuery);

//     if (result.recordset.length === 0) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const user = result.recordset[0];

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     res.status(200).json({
//       message: 'Login successful',
//       user: { id: user.UserID, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ message: 'Error logging in' });
//   }
// };





// export const getProductsController = async (req, res) => {
//   try {
//     const pool = await poolPromise;

//     const getProductsQuery = `SELECT * FROM Products`;
//     const getProductsRequest = pool.request();
//     const result = await getProductsRequest.query(getProductsQuery);

//     res.status(200).json({
//       message: 'Products retrieved successfully',
//       products: result.recordset,
//     });
//   } catch (err) {
//     console.error('Error retrieving products:', err);
//     res.status(500).json({ message: 'Error retrieving products' });
//   }

//   try {
//     let pool = await sql.connect(dbConfig);
//     let products = await pool.request().query(
//         "SELECT ProductID, Name, Category, Stock, Supplier, Price FROM Products"
//     );
//     return products.recordset;
// } catch (err) {
//     console.error("Database Error:", err);
//     throw err;
// }
// };

// Add Product Controller
// Add Product Controller (Updated)
// export const addProductController = async (req, res) => {
//   try {
//     const { name, price, quantity } = req.body; // Removed category
//     if (!name || !price || !quantity) {
//       return res.status(400).json({ message: 'Please provide name, price, and quantity' });
//     }

//     const pool = await poolPromise;
//     await pool
//       .request()
//       .input('name', sql.NVarChar, name)  // Changed to NVARCHAR
//       .input('price', sql.Float, price)   // Float type
//       .input('quantity', sql.Int, quantity) // Int type
//       .query('INSERT INTO Products (Name, Price, Quantity) VALUES (@name, @price, @quantity)');

//     res.status(201).json({ message: 'Product added successfully' });
//   } catch (error) {
//     console.error('Error adding product:', error);
//     res.status(500).json({ error: 'Error adding product' });
//   }
// };



//add category function 
// export const addCategory = async (req, res) => {
//   const { name } = req.body;  // Get category name from request

//   if (!name) {
//       return res.status(400).json({ message: "Category name is required" });
//   }

//   try {
//       let pool = await sql.connect(dbConfig);
//       await pool.request()
//           .input("name", sql.NVarChar, name)
//           .query("INSERT INTO Categories (Name) VALUES (@name)");

//       res.status(201).json({ message: "Category added successfully" });
//   } catch (error) {
//       console.error("Error adding category:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// };

















// import { getProducts, addProduct } from "../models/ProductModel.js";

// export const getProductsController = async (req, res) => {
//   try {
//     const products = await getProducts();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const addProductController = async (req, res) => {
//   try {
//     const newProduct = await addProduct(req.body);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };