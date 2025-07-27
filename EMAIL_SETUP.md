# 📧 Email Setup Instructions for POS System

## ✅ Status: FIXED AND READY!

Your POS system now sends professional email notifications for:
- ✅ **User Signup** - Welcome emails with account details
- ✅ **User Login** - Security notification emails
- ✅ **Error Fixed** - Nodemailer import issue resolved with `createRequire`

## 🚀 Quick Setup

### 1. Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Factor Authentication if not already enabled

2. **Generate App Password**
   - In Google Account settings, go to "Security" → "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update Environment Variables**
   - Open `backend/.env` file
   - Update these lines with your credentials:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 2. Test Email Configuration

Run this command to test your email setup:
```bash
cd backend
node UtilsFiles/emailTest.js
```

## 📋 Email Templates

### Signup Email Features:
- 🎉 Professional welcome message
- 📋 Account details summary
- 🚀 Next steps guide
- 🎨 Modern HTML design with gradients

### Login Email Features:
- 🔐 Security notification
- 📍 Login details (time, email, role)
- ⚠️ Security warning for unauthorized access
- 🛡️ Professional security design

## 🔧 Alternative Email Providers

### Using Outlook/Hotmail:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Using Custom SMTP:
Update the transporter configuration in:
- `backend/Controller/AuthController.js`
- `backend/Controller/regStaff.js`

```javascript
const transporter = nodemailer.createTransport({
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 📱 Testing the System

1. **Signup Test:**
   - Register a new user through the frontend
   - Check email inbox for welcome message

2. **Login Test:**
   - Login with the registered user
   - Check email inbox for login notification

## ⚙️ Troubleshooting

### ✅ FIXED: Common Issues

1. **~~"createTransport is not a function" error~~** ✅ SOLVED
   - Fixed by using `createRequire` for proper ES module import
   - Updated in `AuthController.js` and `regStaff.js`

2. **"Authentication failed" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2FA is enabled on your Google account

3. **"Connection refused" error**
   - Check your internet connection
   - Verify EMAIL_USER and EMAIL_PASS are correct

4. **Emails not received**
   - Check spam/junk folder
   - Verify email address is correct
   - Test with the emailTest.js utility

### Debug Steps:
```bash
# Check if email variables are loaded
cd backend
node -e "console.log('EMAIL_USER:', process.env.EMAIL_USER)"

# Run email test
node UtilsFiles/emailTest.js

# Check server logs for email errors
npm run server
```

## 🎯 Email Features Summary

| Feature | Signup | Login |
|---------|--------|-------|
| Professional HTML template | ✅ | ✅ |
| Account details | ✅ | ✅ |
| Security information | ➖ | ✅ |
| Welcome message | ✅ | ➖ |
| Next steps guide | ✅ | ➖ |
| Responsive design | ✅ | ✅ |
| Error handling | ✅ | ✅ |

## 📞 Support

If you need help setting up emails:
1. Check the troubleshooting section above
2. Run the email test utility
3. Verify your .env file configuration
4. Check server console logs for detailed error messages

---
*Email functionality is optional - the system will work normally even if emails are not configured.*
