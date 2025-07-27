import sql from 'mssql';
import { poolPromise } from '../Database.js';

// Get low stock products (stock <= 10 or custom threshold)
export const getLowStockProducts = async (req, res) => {
    try {
        const threshold = req.query.threshold || 10; // Default threshold is 10
        const pool = await poolPromise;
        const result = await pool.request()
            .input('threshold', sql.Int, threshold)
            .query(`
                SELECT 
                    ProductID,
                    ProductName,
                    Category,
                    Stock,
                    Supplier,
                    SupplierNumber,
                    Price,
                    ProductBrand
                FROM Products 
                WHERE Stock <= @threshold
                ORDER BY Stock ASC
            `);
        
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get Low Stock Products Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get stock statistics
export const getStockStatistics = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                COUNT(*) as TotalProducts,
                SUM(CASE WHEN Stock <= 5 THEN 1 ELSE 0 END) as CriticalStock,
                SUM(CASE WHEN Stock <= 10 AND Stock > 5 THEN 1 ELSE 0 END) as LowStock,
                SUM(CASE WHEN Stock > 10 THEN 1 ELSE 0 END) as NormalStock,
                AVG(CAST(Stock as FLOAT)) as AverageStock
            FROM Products
        `);
        
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Get Stock Statistics Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};