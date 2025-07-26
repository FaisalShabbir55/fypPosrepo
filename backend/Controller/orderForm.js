import { poolPromise, sql } from '../Database.js';

export const createOrder = async (req, res) => {
  const transaction = new sql.Transaction(await poolPromise);

  try {
    const {
      customerName,
      customerContact,
      workerId,
      orderDate,
      subtotal,
      tax,
      discount,
      total,
      paid,
      remaining,
      paymentMethod,
      items,
    } = req.body;

    console.log("Incoming Request Body:", JSON.stringify(req.body, null, 2));

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "'items' must be a non-empty array" });
    }

    const pool = await poolPromise;
    const workerCheck = await pool
      .request()
      .input('WorkerId', sql.Int, workerId)
      .query('SELECT Id FROM Staff WHERE Id = @WorkerId');

    if (workerCheck.recordset.length === 0) {
      return res.status(400).json({ error: `WorkerId ${workerId} does not exist` });
    }

    // Begin transaction
    await transaction.begin();

    // Insert into Orders table
    const orderRequest = new sql.Request(transaction);
    orderRequest.input('CustomerName', sql.NVarChar(100), customerName);
    orderRequest.input('CustomerContact', sql.NVarChar(20), customerContact);
    orderRequest.input('WorkerId', sql.Int, workerId);
    orderRequest.input('OrderDate', sql.Date, orderDate);
    orderRequest.input('Subtotal', sql.Decimal(10, 2), subtotal);
    orderRequest.input('Tax', sql.Decimal(10, 2), tax);
    orderRequest.input('Discount', sql.Decimal(10, 2), discount);
    orderRequest.input('Total', sql.Decimal(10, 2), total);
    orderRequest.input('Paid', sql.Decimal(10, 2), paid);
    orderRequest.input('Remaining', sql.Decimal(10, 2), remaining);
    orderRequest.input('PaymentMethod', sql.NVarChar(50), paymentMethod);

    const orderResult = await orderRequest.query(`
      INSERT INTO Orders (
        CustomerName, CustomerContact, WorkerId, OrderDate,
        Subtotal, Tax, Discount, Total, Paid, Remaining, PaymentMethod
      )
      OUTPUT INSERTED.OrderId
      VALUES (
        @CustomerName, @CustomerContact, @WorkerId, @OrderDate,
        @Subtotal, @Tax, @Discount, @Total, @Paid, @Remaining, @PaymentMethod
      )
    `);

    const orderId = orderResult.recordset[0].OrderId;

    // Insert each item into OrderItems
    for (const item of items) {
      const itemRequest = new sql.Request(transaction);
      itemRequest.input('OrderId', sql.Int, orderId);
      itemRequest.input('ProductName', sql.NVarChar(100), item.productName);
      itemRequest.input('Stock', sql.Int, item.stock);
      itemRequest.input('Price', sql.Decimal(10, 2), item.price);
      itemRequest.input('Quantity', sql.Int, item.quantity);
      itemRequest.input('Total', sql.Decimal(10, 2), item.total);

      await itemRequest.query(`
        INSERT INTO OrderItems (
          OrderId, ProductName, Stock, Price, Quantity, Total
        ) VALUES (
          @OrderId, @ProductName, @Stock, @Price, @Quantity, @Total
        )
      `);
    }

    await transaction.commit();
    res.status(201).json({ message: "Order placed successfully", orderId });

  } catch (err) {
    console.error("❌ Error placing order:", err);
    await transaction.rollback();
    res.status(500).json({ error: "Failed to place order" });
  }
};






// get order of cutsomer api here





export const getOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        o.OrderID AS OrderId,
        o.CustomerName,
        o.OrderDate,
        o.Total,
        o.Paid,
        o.Remaining,
        s.Name AS WorkerName
      FROM Orders o
      LEFT JOIN Staff s ON o.WorkerId = s.Id
      ORDER BY o.OrderDate DESC
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};










//search product api

// GET /api/orders/search?query=Ali
export const searchOrders = async (req, res) => {
  const { query } = req.query;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('query', `%${query}%`);

    const result = await request.query(`
      SELECT 
        o.OrderID AS OrderId,
        o.CustomerName,
        o.OrderDate,
        o.Total,
        o.Paid,
        o.Remaining,
        s.Name AS WorkerName
      FROM Orders o
      LEFT JOIN Staff s ON o.WorkerId = s.Id
      WHERE 
        o.CustomerName LIKE @query OR
        s.Name LIKE @query
      ORDER BY o.OrderDate DESC
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error searching orders', error: err.message });
  }
};







//delete order api here   



// DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const connection = await pool.connect();
    const transaction = connection.transaction(); // ✅ No "new"

    await transaction.begin();

    const request = transaction.request();
    await request.input('OrderID', id);

    // First delete child records
    await request.query(`DELETE FROM OrderItems WHERE OrderID = @OrderID`);
    // Then delete parent record
    await request.query(`DELETE FROM Orders WHERE OrderID = @OrderID`);

    await transaction.commit();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
};



//edit order api here 




// PUT /api/orders/:id
export const editOrder = async (req, res) => {
  const { id } = req.params;
  const {
    CustomerName,
    CustomerContact,
    WorkerId,
    OrderDate,
    Subtotal,
    Tax,
    Discount,
    Total,
    Paid,
    Remaining,
    PaymentMethod
  } = req.body;

  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('OrderID', id);
    request.input('CustomerName', CustomerName);
    request.input('CustomerContact', CustomerContact);
    request.input('WorkerId', WorkerId);
    request.input('OrderDate', OrderDate);
    request.input('Subtotal', Subtotal);
    request.input('Tax', Tax);
    request.input('Discount', Discount);
    request.input('Total', Total);
    request.input('Paid', Paid);
    request.input('Remaining', Remaining);
    request.input('PaymentMethod', PaymentMethod);

    await request.query(`
      UPDATE Orders SET
        CustomerName = @CustomerName,
        CustomerContact = @CustomerContact,
        WorkerId = @WorkerId,
        OrderDate = @OrderDate,
        Subtotal = @Subtotal,
        Tax = @Tax,
        Discount = @Discount,
        Total = @Total,
        Paid = @Paid,
        Remaining = @Remaining,
        PaymentMethod = @PaymentMethod
      WHERE OrderID = @OrderID
    `);

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
};














//get order / bill api here   



export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('OrderID', id);

    const result = await request.query(`
      SELECT 
        o.OrderID, 
        o.CustomerName, 
        s.Name AS WorkerName,       -- Corrected: using "Name" from Staff table
        o.OrderDate, 
        o.Subtotal, 
        o.Tax, 
        o.Discount, 
        o.Total, 
        o.Paid, 
        o.Remaining, 
        o.PaymentMethod,
        oi.ProductName, 
        oi.Stock, 
        oi.Price, 
        oi.Quantity, 
        oi.Total AS ItemTotal
      FROM Orders o
      JOIN Staff s ON o.WorkerId = s.Id
      JOIN OrderItems oi ON o.OrderID = oi.OrderID
      WHERE o.OrderID = @OrderID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ orderDetails: result.recordset });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order details', error: err.message });
  }
};





//update api for edit order and add new items



export const updateOrder = async (req, res) => {
  const { id } = req.params; // Get order ID from URL parameter
  const {
    customerName,
    customerContact,
    date,
    workerId,
    subtotal,
    tax,
    discount,
    total,
    paid,
    remaining,
    paymentMethod,
    items
  } = req.body;

  console.log("Update Order Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Order ID from URL:", id);

  // Validate required fields
  if (!id) {
    return res.status(400).json({ error: 'Order ID is required in URL' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and cannot be empty' });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1. Check if order exists
    const orderCheck = await transaction
      .request()
      .input('orderId', sql.Int, id)
      .query('SELECT OrderID FROM Orders WHERE OrderID = @orderId');

    if (orderCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // 2. Validate worker ID
    const workerResult = await transaction
      .request()
      .input('workerId', sql.Int, workerId)
      .query('SELECT Id FROM Staff WHERE Id = @workerId');

    if (workerResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid worker ID' });
    }

    // 3. Update Orders table
    await transaction
      .request()
      .input('orderId', sql.Int, id)
      .input('customerName', sql.NVarChar(100), customerName)
      .input('customerContact', sql.NVarChar(100), customerContact)
      .input('orderDate', sql.Date, date)
      .input('workerId', sql.Int, workerId)
      .input('subtotal', sql.Decimal(10, 2), subtotal)
      .input('tax', sql.Decimal(10, 2), tax)
      .input('discount', sql.Decimal(10, 2), discount)
      .input('total', sql.Decimal(10, 2), total)
      .input('paid', sql.Decimal(10, 2), paid)
      .input('remaining', sql.Decimal(10, 2), remaining)
      .input('paymentMethod', sql.NVarChar(20), paymentMethod)
      .query(`
        UPDATE Orders SET
          CustomerName = @customerName,
          CustomerContact = @customerContact,
          OrderDate = @orderDate,
          WorkerId = @workerId,
          Subtotal = @subtotal,
          Tax = @tax,
          Discount = @discount,
          Total = @total,
          Paid = @paid,
          Remaining = @remaining,
          PaymentMethod = @paymentMethod
        WHERE OrderID = @orderId
      `);

    // 4. Delete existing OrderItems
    await transaction
      .request()
      .input('orderId', sql.Int, id)
      .query('DELETE FROM OrderItems WHERE OrderID = @orderId');

    // 5. Re-insert updated OrderItems
    for (const item of items) {
      // Validate each item
      if (!item.productName || item.quantity == null || item.price == null) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'Each item must have productName, quantity, and price' 
        });
      }

      await transaction
        .request()
        .input('orderId', sql.Int, id)
        .input('productName', sql.NVarChar(100), item.productName)
        .input('stock', sql.Int, item.stock || 0)
        .input('price', sql.Decimal(10, 2), item.price)
        .input('quantity', sql.Int, item.quantity)
        .input('total', sql.Decimal(10, 2), item.total)
        .query(`
          INSERT INTO OrderItems (OrderID, ProductName, Stock, Price, Quantity, Total)
          VALUES (@orderId, @productName, @stock, @price, @quantity, @total)
        `);
    }

    await transaction.commit();
    res.status(200).json({ message: 'Order updated successfully' });

  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Update Order error:', err.message);
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
};
