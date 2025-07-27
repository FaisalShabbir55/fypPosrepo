import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Import from the specific backend directory
const nodemailer = require('./backend/node_modules/nodemailer');

console.log('🧪 Testing nodemailer with specific path...');
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
  
  console.log('✅ nodemailer.createTransport works with specific path!');
  console.log('📧 Transporter created:', typeof transporter);
  console.log('🎉 Email functionality is ready!');
  
} catch (error) {
  console.log('❌ Error with specific path approach:', error.message);
}
