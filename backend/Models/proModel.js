// Models/promodel.js
import { sql, poolPromise } from '../Database.js';

// Get all products from the database
export const getAllProducts = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        ProductID, 
        ProductName, 
        Category, 
        Stock, 
        Supplier, 
        SupplierNumber, 
        ProductBrand, 
        Price, 
        Description 
      FROM Products
    `);
    return result.recordset;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error fetching products from database");
  }
};

// Add a new product to the database
export const addProduct = async ({
  productName,
  category,
  stock,
  supplier,
  supplierNumber,
  productBrand,
  price,
  description
}) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("ProductName", sql.NVarChar, productName)
      .input("Category", sql.NVarChar, category)
      .input("Stock", sql.Int, stock)
      .input("Supplier", sql.NVarChar, supplier)
      .input("SupplierNumber", sql.NVarChar, supplierNumber)
      .input("ProductBrand", sql.NVarChar, productBrand)
      .input("Price", sql.Float, price)
      .input("Description", sql.NVarChar, description)
      .query(`
        INSERT INTO Products (
          ProductName, Category, Stock, Supplier, SupplierNumber, ProductBrand, Price, Description
        ) VALUES (
          @ProductName, @Category, @Stock, @Supplier, @SupplierNumber, @ProductBrand, @Price, @Description
        )
      `);
    return { message: "Product added successfully" };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error adding product to database");
  }
};
