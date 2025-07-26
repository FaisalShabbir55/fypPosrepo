# Point of Sale (POS) System - Final Year Project

A comprehensive Point of Sale system built with React.js frontend and Node.js backend.

## 🚀 Features

- **Product Management**: Add, edit, delete, and search products
- **Category Management**: Organize products by categories
- **Order Management**: Create and manage customer orders
- **Order History**: View and manage past orders
- **Export Functions**: Export data to CSV, Excel, PDF formats
- **Print Functionality**: Print receipts and reports
- **Column Visibility**: Customize table views
- **Search & Filter**: Advanced search capabilities
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3
- Axios for API calls
- XLSX for Excel export
- jsPDF for PDF generation

### Backend
- Node.js
- Express.js
- SQL Server Database

## 📁 Project Structure

```
FYP/
├── backend/                 # Backend API server
│   ├── Controllers/         # Route controllers
│   ├── Models/             # Database models
│   ├── Routes/             # API routes
│   ├── UtilsFiles/         # Utility files
│   └── index.js            # Server entry point
├── frontendpos/            # React frontend
│   ├── public/             # Public assets
│   └── src/
│       ├── components/     # React components
│       │   ├── auth/       # Authentication components
│       │   └── Layout/     # Main layout components
│       └── App.js          # Main App component
└── SQLQuery1.sql           # Database schema
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- SQL Server
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection in `Database.js`

4. Start the server:
   ```bash
   npm start
   ```
   Server runs on: `http://localhost:3001`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontendpos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Frontend runs on: `http://localhost:3000`

## 🔗 API Endpoints

- `GET /api/auth/products` - Get all products
- `POST /api/auth/add-products` - Add new product
- `PUT /api/auth/update-products/:id` - Update product
- `DELETE /api/auth/delete-products/:id` - Delete product
- `GET /api/auth/get-category` - Get all categories
- `GET /api/auth/order-List` - Get order history
- And more...

## 📊 Features Overview

### Export Functionality
- **Copy**: Copy table data to clipboard
- **CSV Export**: Download data in CSV format
- **Excel Export**: Generate Excel spreadsheets
- **PDF Export**: Create formatted PDF documents
- **Print**: Direct printing capabilities

### Column Management
- Show/hide table columns
- Responsive column visibility
- Custom column filtering

## 🎯 Usage

1. **Products Page**: Manage your inventory with full CRUD operations
2. **Categories Page**: Organize products into categories
3. **Orders Page**: Create new orders and manage order history
4. **Export Features**: Use the export buttons to download or print data

## 🤝 Contributing

This is a Final Year Project. For any questions or suggestions, please contact the developer.

## 📄 License

This project is developed as part of academic requirements.

## 👨‍💻 Developer

**Abdullah Arshad**
- Final Year Project
- [Your University Name]
- [Your Email] (optional)

---

**Note**: This is a student project developed for educational purposes.
