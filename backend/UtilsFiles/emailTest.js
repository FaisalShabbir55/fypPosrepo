import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email function
export const testEmail = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'not configured');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email not configured. Please update .env file with EMAIL_USER and EMAIL_PASS');
      return false;
    }

    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send test email to yourself
      subject: '✅ POS System Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #22c55e; text-align: center;">✅ Email Test Successful!</h2>
          <p>This is a test email from your POS System.</p>
          <p><strong>Configuration Status:</strong> ✅ Working</p>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
          <p>Your email system is ready for signup and login notifications!</p>
        </div>
      `
    };

    await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return false;
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmail();
}
