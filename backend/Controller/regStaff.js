import { poolPromise, sql } from '../Database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Add your email
    pass: process.env.EMAIL_PASS || 'your-app-password'    // Add your app password
  }
});

// Signup Controller for Staff Table
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (name, email, password, role) are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one special character' 
      });
    }

    const pool = await poolPromise;

    // Check if email already exists in Staff table
    const findUserQuery = `SELECT * FROM Staff WHERE Email = @Email`;
    const findUserRequest = pool.request();
    findUserRequest.input('Email', sql.NVarChar, email);
    const existingUser = await findUserRequest.query(findUserQuery);

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new staff member
    const insertUserQuery = `
      INSERT INTO Staff (Name, Email, Password, Role)
      VALUES (@Name, @Email, @Password, @Role)
    `;
    const insertUserRequest = pool.request();
    insertUserRequest.input('Name', sql.NVarChar, name);
    insertUserRequest.input('Email', sql.NVarChar, email);
    insertUserRequest.input('Password', sql.NVarChar, hashedPassword);
    insertUserRequest.input('Role', sql.NVarChar, role);

    await insertUserRequest.query(insertUserQuery);

    // Send welcome email (optional - won't fail signup if email fails)
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Welcome to Our POS System!',
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Your account has been successfully created in our POS system.</p>
          <p><strong>Account Details:</strong></p>
          <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Role: ${role}</li>
          </ul>
          <p>You can now log in to the system using your email and password.</p>
          <p>Thank you for joining our team!</p>
          <br>
          <p>Best regards,<br>POS System Team</p>
        `
      };

      // Only attempt to send email if EMAIL_USER is configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
      } else {
        console.log('Email not configured - skipping welcome email');
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Staff user created successfully!' 
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating staff user. Please try again.' 
    });
  }
};
