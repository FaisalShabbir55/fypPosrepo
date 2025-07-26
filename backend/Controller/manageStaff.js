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
    const pool = await poolPromise;

    // Check if the staff member exists
    const checkStaff = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Staff WHERE Id = @Id');

    if (checkStaff.recordset.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Delete the staff member
    await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Staff WHERE Id = @Id');

    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff:', err);
    res.status(500).json({ message: 'Error deleting staff member' });
  }
};
