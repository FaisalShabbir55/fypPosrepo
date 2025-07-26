create database AuthDb;
use AuthDb;


--create Table Signup (
--name varchar(250),
--email varchar(250),
--password varchar (250)


--);


--ALTER TABLE Signup ADD Role NVARCHAR(50);
--ALTER TABLE Signup
--ADD Id INT PRIMARY KEY IDENTITY(1,1);



--ALTER TABLE Signup
--ADD lastActive DATETIME DEFAULT GETDATE();



--insert into Signup values ('abdullah', 'abbcb@gmail.com', 'sixbb$jhheh4263');





CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50),
    Price DECIMAL(10, 2),
    Stock INT,
    Supplier NVARCHAR(100),
    SupplierNumber NVARCHAR(20),
    ProductBrand NVARCHAR(50),
    Description NVARCHAR(255)
);

--payment 

ALTER TABLE Products
ADD TotalPayment DECIMAL(10, 2),
    PaidAmount DECIMAL(10, 2),
    RemainingAmount AS (TotalPayment - PaidAmount) PERSISTED;



  


-- Drop the old table
--DROP TABLE Products;

CREATE TABLE Categories (
  Id INT PRIMARY KEY IDENTITY(1,1),
  CategoryName NVARCHAR(100) NOT NULL
);



--staff 

CREATE TABLE Staff (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Role NVARCHAR(50) NOT NULL,
    Contact NVARCHAR(20) NULL,  -- Changed to allow NULL
    Password NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Add this line to modify existing table if it already exists
-- ALTER TABLE Staff ALTER COLUMN Contact NVARCHAR(20) NULL;



--orders


CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerName NVARCHAR(100),
	CustomerContact NVARCHAR(100),
    WorkerId INT FOREIGN KEY REFERENCES Staff(Id), -- reference Staff table via ID
    OrderDate DATE,
    Subtotal DECIMAL(10, 2),
    Tax DECIMAL(10, 2),
    Discount DECIMAL(10, 2),
    Total DECIMAL(10, 2),
    Paid DECIMAL(10, 2),
    Remaining DECIMAL(10, 2),
    PaymentMethod NVARCHAR(20)
);


CREATE TABLE OrderItems (
    ItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    ProductName NVARCHAR(100),
    Stock INT,
    Price DECIMAL(10, 2),
    Quantity INT,
    Total DECIMAL(10, 2)
);


SELECT o.OrderID, o.CustomerName, s.Name AS WorkerName, o.OrderDate, o.Total
FROM Orders o
JOIN Staff s ON o.WorkerId = s.Id;




select * from Categories;


select * from Staff;

select * from Products; 

select * from Orders;