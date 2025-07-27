import { poolPromise, sql } from '../Database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
import { findUserByEmail } from '../Models/slModel.js'; // adjust path if needed

// Use createRequire to import nodemailer properly
const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

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

    // Send login notification email
    try {
      const currentDate = new Date().toLocaleString();
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Login Notification - POS System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #22c55e; text-align: center;">🔐 Login Notification</h2>
            <p>Hello <strong>${user.Name}</strong>,</p>
            <p>We noticed that you just logged into your POS System account.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Login Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>📧 Email:</strong> ${email}</li>
                <li><strong>👤 Role:</strong> ${user.Role}</li>
                <li><strong>🕒 Time:</strong> ${currentDate}</li>
                <li><strong>🌐 Browser:</strong> Web Application</li>
              </ul>
            </div>
            
            <p>If this was not you, please contact your system administrator immediately.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; font-size: 14px;">
                This is an automated security notification from your POS System.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">
              © 2025 POS System | Secure Business Management
            </p>
          </div>
        `
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Login notification email sent to:', email);
      }
    } catch (emailError) {
      console.error('Error sending login notification email:', emailError);
      // Don't fail login if email fails
    }

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