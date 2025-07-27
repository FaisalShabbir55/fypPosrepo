// Try the createRequire approach for ES modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

console.log('🧪 Testing nodemailer with createRequire...');
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
  
  console.log('✅ nodemailer.createTransport works with createRequire!');
  console.log('📧 Transporter created:', typeof transporter);
  
} catch (error) {
  console.log('❌ Error with createRequire approach:', error.message);
}
