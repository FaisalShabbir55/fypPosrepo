import sql from 'mssql'

const config = {
  user: 'sa',
  password: 'abdu@1234',
  server: 'localhost',

  database: 'AuthDb',
  options: {
    encrypt: false, 
    trustServerCertificate: true, // For self-signed certificates in development
  },
};

// Create a pool instance for database connections
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    throw err;
  });

  export { sql, poolPromise }; 
