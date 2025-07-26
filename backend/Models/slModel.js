import { sql, poolPromise } from '../Database.js'; // Import database connection and pool promise
import bcrypt from 'bcrypt';

// Function to create a new user (signup)


export const createUser = async (name, email, password, role = 'user') => {
  try {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.request()
      .input('Name', sql.NVarChar, name)
      .input('Email', sql.NVarChar, email)
      .input('Password', sql.NVarChar, hashedPassword)
      .input('Role', sql.NVarChar, role)
      .query(`
        INSERT INTO Users (Name, Email, Password, Role)
        VALUES (@Name, @Email, @Password, @Role)
      `);
    return result.rowsAffected;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};




export const findUserByEmail = async (email) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query(`SELECT Id, Name, Email, Password, Role FROM Signup WHERE Email = @Email`);
    return result.recordset[0]; // Return the user if found
  } catch (err) {
    console.error('Error finding user:', err);
    throw err;
  }
};










// export const createUser = async (name, email, password) => {
//   try {
//     const pool = await poolPromise;
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash password
//     const result = await pool.request()
//       .input('Name', sql.NVarChar, name)
//       .input('Email', sql.NVarChar, email)
//       .input('Password', sql.NVarChar, hashedPassword)
//       .query(
//         `INSERT INTO Users (Name, Email, Password) VALUES (@Name, @Email, @Password)`
//       );
//     return result.rowsAffected; // Returns the number of affected rows (if insertion is successful)
//   } catch (err) {
//     console.error('Error creating user:', err);
//     throw err; // Rethrow error to be handled elsewhere
//   }
// };

// Function to find a user by email
// export const findUserByEmail = async (email) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input('Email', sql.NVarChar, email)
//       .query(`SELECT * FROM Users WHERE Email = @Email`);
//     return result.recordset[0]; // Return the user if found
//   } catch (err) {
//     console.error('Error finding user:', err);
//     throw err; // Rethrow error to be handled elsewhere
//   }
// };
