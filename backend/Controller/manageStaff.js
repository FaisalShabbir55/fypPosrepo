import sql from 'mssql';
import { poolPromise } from '../Database.js';

export const getAllStaff = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT Id, Name, Email, Role FROM Staff');

    res.status(200).json({ success: true, staff: result.recordset });
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ message: 'Error retrieving staff members' });
  }
};





// delete staff api
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    // First, check if the requesting user has permission to delete staff
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify JWT token and extract user info
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    // Check if user has admin/manager role
    if (decoded.role !== 'Admin' && decoded.role !== 'Manager') {
      return res.status(403).json({ 
        message: 'Access denied. Only Admins and Managers can delete staff members.' 
      });
    }

    const pool = await poolPromise;

    // Check if the staff member exists
    const checkStaff = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Staff WHERE Id = @Id');

    if (checkStaff.recordset.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Prevent self-deletion
    if (checkStaff.recordset[0].Id === decoded.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Delete the staff member
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Staff WHERE Id = @Id');

    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Error deleting staff member' });
  }
};
