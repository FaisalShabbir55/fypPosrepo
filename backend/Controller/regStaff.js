import { poolPromise, sql } from '../Database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';

// Use createRequire to import nodemailer properly
const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

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
      const currentDate = new Date().toLocaleString();
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: '🎉 Welcome to POS System - Account Created Successfully!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0;">🎉 Welcome to POS System!</h1>
              <p style="color: #666; font-size: 18px; margin: 10px 0;">Your account has been created successfully</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 8px; color: white; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0 0 10px 0;">Hello ${name}! 👋</h2>
              <p style="margin: 0; opacity: 0.9;">You're now part of our professional POS system</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 Account Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e9ecef;">
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">👤 Full Name:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e9ecef;">
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">📧 Email:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e9ecef;">
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">🏷️ Role:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #495057;">📅 Created:</td>
                  <td style="padding: 8px 0; color: #6c757d;">${currentDate}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-left: 4px solid #22c55e; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #155724;">🚀 Next Steps:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #155724;">
                <li>Log in to the system using your email and password</li>
                <li>Familiarize yourself with the dashboard and features</li>
                <li>Contact your administrator for any questions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 12px 30px; border-radius: 25px; display: inline-block; text-decoration: none;">
                <strong>🔗 Access POS System</strong>
              </div>
            </div>
            
            <div style="border-top: 2px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6c757d; text-align: center; margin: 0; font-size: 14px;">
                <strong>Need Help?</strong><br>
                Contact your system administrator or IT support team
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px; margin: 0;">
              © 2025 POS System | Professional Business Management Solution<br>
              This is an automated notification. Please do not reply to this email.
            </p>
          </div>
        `
      };

      // Only attempt to send email if EMAIL_USER is configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully to:', email);
      } else {
        console.log('⚠️ Email not configured - skipping welcome email');
      }
    } catch (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
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
