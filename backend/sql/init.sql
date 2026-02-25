-- CarCustomShop Database Initialization Script

-- ======================
-- Customer
-- ======================
CREATE DATABASE CarCustomShop;
USE CarCustomShop;
CREATE TABLE IF NOT EXISTS Customer (
  CustomerID INT PRIMARY KEY AUTO_INCREMENT,
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  Phone VARCHAR(20),
  Email VARCHAR(100),
  Address TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Brands
-- ======================
CREATE TABLE IF NOT EXISTS Brands (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeName VARCHAR(50)
);

-- ======================
-- Vehicle
-- ======================
CREATE TABLE IF NOT EXISTS Vehicle (
  VehicleID INT PRIMARY KEY AUTO_INCREMENT,
  CustomerID INT,
  TypeID INT,
  Model VARCHAR(100),
  Year INT,
  LicensePlate VARCHAR(20),
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE,
  FOREIGN KEY (TypeID) REFERENCES Brands(TypeID) ON DELETE SET NULL
);

-- ======================
-- Employee
-- ======================
CREATE TABLE IF NOT EXISTS Employee (
  EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  Position VARCHAR(50),
  Phone VARCHAR(20),
  HireDate DATE,
  Salary DECIMAL(10,2),
  IsActive TINYINT(1) DEFAULT 1
);

-- ======================
-- Service
-- ======================
CREATE TABLE IF NOT EXISTS Service (
  ServiceID INT PRIMARY KEY AUTO_INCREMENT,
  ServiceName VARCHAR(100),
  ServicePrice DECIMAL(10,2),
  IsActive TINYINT(1) DEFAULT 1
);

-- ======================
-- Part
-- ======================
CREATE TABLE IF NOT EXISTS Part (
  PartID INT PRIMARY KEY AUTO_INCREMENT,
  PartName VARCHAR(100),
  Cost DECIMAL(10,2),
  StockQty INT
);

-- ======================
-- WorkOrder
-- ======================
CREATE TABLE IF NOT EXISTS WorkOrder (
  WorkOrderID INT PRIMARY KEY AUTO_INCREMENT,
  VehicleID INT,
  WorkDate DATE,
  Status VARCHAR(50),
  Notes TEXT,
  FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE
);

-- ======================
-- WorkOrderEmployee
-- ======================
CREATE TABLE IF NOT EXISTS WorkOrderEmployee (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT,
  EmployeeID INT,
  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) ON DELETE CASCADE,
  FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) ON DELETE CASCADE
);

-- ======================
-- WorkOrderDetail
-- ======================
CREATE TABLE IF NOT EXISTS WorkOrderDetail (
  DetailID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT,
  ServiceID INT,
  PartID INT,
  Quantity INT,
  UnitPrice DECIMAL(10,2),
  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) ON DELETE CASCADE,
  FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID) ON DELETE SET NULL,
  FOREIGN KEY (PartID) REFERENCES Part(PartID) ON DELETE SET NULL
);

-- ======================
-- Invoice
-- ======================
CREATE TABLE IF NOT EXISTS Invoice (
  InvoiceID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT,
  InvoiceDate DATE,
  Subtotal DECIMAL(10,2),
  Tax DECIMAL(10,2),
  Discount DECIMAL(10,2),
  TotalAmount DECIMAL(10,2),
  Status VARCHAR(50),
  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) ON DELETE CASCADE
);

-- ======================
-- Payment
-- ======================
CREATE TABLE IF NOT EXISTS Payment (
  PaymentID INT PRIMARY KEY AUTO_INCREMENT,
  InvoiceID INT,
  PaymentDate DATE,
  Amount DECIMAL(10,2),
  PaymentMethod VARCHAR(50),
  FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID) ON DELETE CASCADE
);

-- ======================
-- Sample Data (Optional)
-- ======================
INSERT INTO Brands (TypeName) VALUES 
('Toyota'), ('Honda'), ('BMW');

INSERT INTO Customer (FirstName, LastName, Phone, Email, Address) VALUES
('Ammy', 'Ster', '0800000000', 'ammy@email.com', 'Bangkok'),
('Phu', 'Doe', '0811111111', 'd@email.com', 'Bangkok');

INSERT INTO Vehicle (CustomerID, TypeID, Model, Year, LicensePlate) VALUES
(1, 1, 'Supra', 2022, 'AAA-111'),
(2, 2, 'Civic', 2021, 'BBB-222');