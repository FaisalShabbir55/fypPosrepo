import { poolPromise, sql } from '../Database.js';

export const addCategory = async (req, res) => {
  const { CategoryName } = req.body;

  if (!CategoryName) {
    return res.status(400).json({ message: 'CategoryName is required' });
  }

  try {
    const pool = await poolPromise;

    // Check if category already exists
    const check = await pool.request()
      .input('CategoryName', sql.NVarChar, CategoryName)
      .query('SELECT * FROM Categories WHERE CategoryName = @CategoryName');

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Insert new category
    await pool.request()
      .input('CategoryName', sql.NVarChar, CategoryName)
      .query('INSERT INTO Categories (CategoryName) VALUES (@CategoryName)');

    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category' });
  }
};



//get categories

export const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT Id, CategoryName FROM Categories');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};





//delete categories


export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Id', sql.Int, categoryId)
      .query('DELETE FROM Categories WHERE Id = @Id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
};




// search category 

export const searchCategory = async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Keyword', sql.NVarChar, `%${keyword}%`)
      .query(`
        SELECT Id, CategoryName 
        FROM Categories 
        WHERE CategoryName COLLATE SQL_Latin1_General_CP1_CI_AS LIKE @Keyword
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error searching categories:', error);
    res.status(500).json({ message: 'Error searching categories' });
  }
};
