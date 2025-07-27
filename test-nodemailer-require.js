const nodemailer = require('nodemailer');

console.log('🧪 Testing nodemailer with require...');
console.log('📦 Nodemailer object:', typeof nodemailer);
console.log('📦 Nodemailer keys:', Object.keys(nodemailer));

try {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test@gmail.com',
      pass: 'test-password'
    }
  });
  
  console.log('✅ nodemailer.createTransport works with require!');
  console.log('📧 Transporter created:', typeof transporter);
  
} catch (error) {
  console.log('❌ Error with require approach:', error.message);
}
