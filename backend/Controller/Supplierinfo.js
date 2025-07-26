import sql from 'mssql';
import { poolPromise } from '../Database.js';

// get API 



export const getSuppliers = async (req, res) => {
  try {
    let pool = await poolPromise;
    let result = await pool.request().query(`
      SELECT 
        Supplier AS SupplierName,
        SupplierNumber AS SupplierContact,
        SUM(CAST(Stock AS INT)) AS Stock,
        SUM(CAST(TotalPayment AS FLOAT)) AS TotalPayment,
        SUM(CAST(PaidAmount AS FLOAT)) AS Paid,
        SUM(CAST(TotalPayment AS FLOAT)) - SUM(CAST(PaidAmount AS FLOAT)) AS RemainingPayment
      FROM Products
      GROUP BY Supplier, SupplierNumber
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Error fetching supplier data' });
  }
};



// update API 

export const updateSupplier = async (req, res) => {
  const { Supplier, SupplierNumber, NewSupplierName, NewSupplierContact, TotalPayment, PaidAmount } = req.body;

  try {
    let pool = await poolPromise;

    await pool.request()
      .input('Supplier', sql.NVarChar, Supplier)
      .input('SupplierNumber', sql.NVarChar, SupplierNumber)
      .input('NewSupplierName', sql.NVarChar, NewSupplierName)
      .input('NewSupplierContact', sql.NVarChar, NewSupplierContact)
      .input('TotalPayment', sql.Float, TotalPayment)
      .input('PaidAmount', sql.Float, PaidAmount)
      .query(`
        UPDATE Products
        SET 
          Supplier = @NewSupplierName,
          SupplierNumber = @NewSupplierContact,
          TotalPayment = @TotalPayment,
          PaidAmount = @PaidAmount
        WHERE Supplier = @SupplierName AND SupplierNumber = @SupplierContact
      `);

    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ message: 'Error updating supplier data' });
  }
};





// delete API

export const deleteSupplier = async (req, res) => {
  const { SupplierName, SupplierContact } = req.body;

  try {
    let pool = await poolPromise;

    await pool.request()
      .input('Supplier', sql.NVarChar, SupplierName)
      .input('SupplierNumber', sql.NVarChar, SupplierContact)
      .query(`
        DELETE FROM Products
        WHERE Supplier = @Supplier AND SupplierNumber = @SupplierNumber
      `);

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ message: 'Error deleting supplier data' });
  }
};
