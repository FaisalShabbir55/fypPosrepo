import sql from 'mssql';
import { poolPromise } from '../Database.js';
//here we have ADD GET UPDATE GET APIs in this file

//getProducts API   
export const getAllProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Products");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
//Addproduct API
export const addProduct = async (req, res) => {
    const { ProductName, Category, Price, Stock, Supplier, SupplierNumber, ProductBrand, Description,  TotalPayment,
        PaidAmount } = req.body;

    // Debugging: log what's coming in
    console.log("Received product:", req.body);

    // Basic validation
    if (!ProductName || !Category || !Price || !Stock || !TotalPayment || !PaidAmount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input("ProductName", sql.NVarChar, ProductName)
            .input("Category", sql.NVarChar, Category)
            .input("Price", sql.Decimal(10, 2), Price)
            .input("Stock", sql.Int, Stock)
            .input("Supplier", sql.NVarChar, Supplier)
            .input("SupplierNumber", sql.NVarChar, SupplierNumber)
            .input("ProductBrand", sql.NVarChar, ProductBrand)
            .input("Description", sql.NVarChar, Description)
            .input("TotalPayment", sql.Decimal(10, 2), TotalPayment)
            .input("PaidAmount", sql.Decimal(10, 2), PaidAmount)
            .query(`
                INSERT INTO Products 
                (ProductName, Category, Price, Stock, Supplier, SupplierNumber, ProductBrand, Description, TotalPayment, PaidAmount)
                VALUES 
                (@ProductName, @Category, @Price, @Stock, @Supplier, @SupplierNumber, @ProductBrand, @Description, @TotalPayment, @PaidAmount)
            `);

        res.status(201).json({ message: "Product added" });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};







// DELETE product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("ProductID", sql.Int, id)
      .query("DELETE FROM Products WHERE ProductID = @ProductID");

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





// UPDATE product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    ProductName, Category, Price, Stock, Supplier,
    SupplierNumber, ProductBrand, Description,
    TotalPayment, PaidAmount
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("ProductID", sql.Int, id)
      .input("ProductName", sql.NVarChar, ProductName)
      .input("Category", sql.NVarChar, Category)
      .input("Price", sql.Decimal(10, 2), Price)
      .input("Stock", sql.Int, Stock)
      .input("Supplier", sql.NVarChar, Supplier)
      .input("SupplierNumber", sql.NVarChar, SupplierNumber)
      .input("ProductBrand", sql.NVarChar, ProductBrand)
      .input("Description", sql.NVarChar, Description)
      .input("TotalPayment", sql.Decimal(10, 2), TotalPayment)
      .input("PaidAmount", sql.Decimal(10, 2), PaidAmount)
      .query(`
        UPDATE Products SET
          ProductName = @ProductName,
          Category = @Category,
          Price = @Price,
          Stock = @Stock,
          Supplier = @Supplier,
          SupplierNumber = @SupplierNumber,
          ProductBrand = @ProductBrand,
          Description = @Description,
          TotalPayment = @TotalPayment,
          PaidAmount = @PaidAmount
        WHERE ProductID = @ProductID
      `);

    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// search product



// SEARCH Product
// export const searchProduct = async (req, res) => {
//   const { ProductName = '', Category = '', ProductBrand = '' } = req.query;

//   try {
//     const pool = await poolPromise;

//     const result = await pool.request()
//       .input("ProductName", sql.NVarChar, `%${ProductName}%`)
//       .input("Category", sql.NVarChar, `%${Category}%`)
//       .input("ProductBrand", sql.NVarChar, `%${ProductBrand}%`)
//       .query(`
//         SELECT * FROM Products
//         WHERE 
//           (@ProductName = '%%' OR ProductName LIKE @ProductName) AND
//           (@Category = '%%' OR Category LIKE @Category) AND
//           (@ProductBrand = '%%' OR ProductBrand LIKE @ProductBrand)
//       `);

//     res.status(200).json(result.recordset);
//   } catch (error) {
//     console.error("Search Product Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };











export const searchProduct = async (req, res) => {
  let { query = '' } = req.query;
  query = query.toLowerCase();

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("query", sql.NVarChar, `%${query}%`)
      .query(`
        SELECT ProductName, Stock, Price 
        FROM Products
        WHERE 
          LOWER(ProductName) LIKE @query OR
          LOWER(Category) LIKE @query OR
          LOWER(ProductBrand) LIKE @query
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Search Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
