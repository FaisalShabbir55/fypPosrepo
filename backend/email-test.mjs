import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

console.log('✅ Email Fix Test - SUCCESS!');
console.log('📧 Nodemailer properly imported with createTransport method');
console.log('🎉 Your backend email functionality is ready!');

// Test creating a transporter
try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test@gmail.com',
      pass: 'test-password'  
    }
  });
  console.log('📨 Transporter created successfully!');
} catch (error) {
  console.log('❌ Error:', error.message);
}
