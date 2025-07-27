import nodemailer from 'nodemailer';

// Test the createTransport method
console.log('🧪 Testing nodemailer.createTransport...');

try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test@gmail.com',
      pass: 'test-password'
    }
  });
  
  console.log('✅ nodemailer.createTransport works correctly!');
  console.log('📧 Transporter created:', typeof transporter);
  
} catch (error) {
  console.log('❌ Error with nodemailer.createTransport:', error.message);
}
