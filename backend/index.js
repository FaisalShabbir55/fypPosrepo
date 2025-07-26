import express from 'express';

// import sql from 'mssql';
import dotenv from 'dotenv'; // dotenv for environment variables
import morgan from 'morgan';

import {  poolPromise } from './Database.js';
// npm install node-cron axios


// const cors = require('cors');
import bodyParser from 'body-parser';
// const cron = require('node-cron');

import cors from 'cors';
//import router file here 
import authRoutes from './Routes/authRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());






// const dbConfig = {
//     user: 'sa',
//     password: 'abdu1234',
//     server: 'localhost', // e.g., localhost or IP address
//     database: 'AuthDb',
//     options: {
//         encrypt: true,
//         trustServerCertificate: true
//     }
// };

// sql.connect(dbConfig, err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         return;
//     }
//     console.log('Connected to SQL Server');
// });




poolPromise
  .then(() => {
    console.log('Database connection pool is ready');
  })
  .catch((err) => {
    console.error('Failed to initialize database connection pool:', err);
  });

app.use('/api/auth', authRoutes);

// app.use('/api/products', productRoutes); // Add new route here


const PORT = process.env.PORT || 3001 ;


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});











// app.post('/api/signup', (req, res) => {
//     const { name, email, password } = req.body;
//     const request = new sql.Request();
//     const query = `INSERT INTO Signup (name, email, password) VALUES (@Name, @Email, @Password)`;

//     request.input('Name', sql.VarChar, name);
//     request.input('Email', sql.VarChar, email);
//     request.input('Password', sql.VarChar, password);

//     request.query(query, (err, result) => {
//         if (err) {
//             console.error('Insert query failed:', err.message); // Log the specific error message
//             res.status(500).json({ success: false, message: 'Error occurred during signup' });
//             return;
//         }
//         res.json({ success: true, message: 'Signup success' });
//     });
// });





// //login page data
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;

//     const request = new sql.Request();
//     const query = `SELECT * FROM Signup WHERE email = @Email AND password = @Password`;

//     request.input('Email', sql.VarChar, email);
//     request.input('Password', sql.VarChar, password);

//     request.query(query, (err, result) => {
//         if (err) {
//             console.error('Query failed:', err);
//             res.status(500).json({ success: false, message: 'Error occurred during login' });
//             return;
//         }

//         if (result.recordset.length > 0) { const updateRequest = new sql.Request();
//             // code to check inactuve user
//             const updateQuery = `UPDATE Signup SET lastActive = GETDATE() WHERE email = @Email`;

//             updateRequest.input('Email', sql.VarChar, email);
//             updateRequest.query(updateQuery, (err, result) => {
//                 if (err) {
//                     console.error('Failed to update lastActive timestamp:', err);
//                 }
//             });

//             res.json({ success: true, message: 'Login successful' });
//         } else {
//             res.json({ success: false, message: 'Invalid email or password' });
//         }
//     });
// });


//code for inactivity using cron method
//code for cron 
// cron.schedule('*/5 * * * *', () => {
//     axios.post('http://localhost:3001/api/users/check-inactivity')
//         .then(response => {
//             console.log('Inactivity check completed:', response.data.message);
//         })
//         .catch(error => {
//             console.error('Error during inactivity check:', error);
//         });
// });

//This endpoint will periodically be called (e.g., by a cron job) to check if users have been inactive for a certain period (e.g., 30 minutes) and update their status


// app.post('/api/users/check-inactivity', (req, res) => {
//     const request = new sql.Request();
//     const inactivityThreshold = 30; // In minutes

//     const query = `
//         UPDATE Signup
//         SET isActive = 0
//         WHERE DATEDIFF(MINUTE, lastActive, GETDATE()) > @Threshold AND isActive = 1
//     `;

//     request.input('Threshold', sql.Int, inactivityThreshold);
//     request.query(query, (err, result) => {
//         if (err) {
//             console.error('Inactivity check failed:', err);
//             res.status(500).json({ success: false, message: 'Error occurred during inactivity check' });
//             return;
//         }
//         res.json({ success: true, message: 'Inactivity check completed', affectedRows: result.rowsAffected });
//     });
// });


// //api to get active inactuve user data



// app.get('/api/users/inactive', (req, res) => {
//     const request = new sql.Request();

//     const query = `SELECT name, email, lastActive FROM Signup WHERE isActive = 0`;

//     request.query(query, (err, result) => {
//         if (err) {
//             console.error('Failed to retrieve inactive users:', err);
//             res.status(500).json({ success: false, message: 'Error occurred while retrieving inactive users' });
//             return;
//         }

//         res.json({ success: true, data: result.recordset });
//     });
// });


