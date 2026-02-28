-- ==========================================
-- CarCustomShop Database Initialization
-- Improved Version (SQL + Constraints)
-- ==========================================

DROP DATABASE IF EXISTS CarCustomShop;
CREATE DATABASE CarCustomShop;
USE CarCustomShop;

-- ==========================================
-- Customer
-- ==========================================
CREATE TABLE Customer (
  CustomerID INT PRIMARY KEY AUTO_INCREMENT,
  FirstName VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  Phone VARCHAR(20) NOT NULL UNIQUE,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Address TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ;

-- ==========================================
-- Brands
-- ==========================================
CREATE TABLE Brands (
  TypeID INT PRIMARY KEY AUTO_INCREMENT,
  TypeName VARCHAR(50) NOT NULL UNIQUE
) ;

-- ==========================================
-- Vehicle
-- ==========================================
CREATE TABLE Vehicle (
  VehicleID INT PRIMARY KEY AUTO_INCREMENT,
  CustomerID INT NOT NULL,
  TypeID INT NULL,
  Model VARCHAR(100) NOT NULL,
  Year INT NOT NULL CHECK (Year >= 1950),
  LicensePlate VARCHAR(20) NOT NULL UNIQUE,
  
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) 
      ON DELETE CASCADE,
  FOREIGN KEY (TypeID) REFERENCES Brands(TypeID) 
      ON DELETE SET NULL
) ;

-- ==========================================
-- Employee
-- ==========================================
CREATE TABLE Employee (
  EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
  FirstName VARCHAR(100) NOT NULL,
  LastName VARCHAR(100) NOT NULL,
  Position VARCHAR(50) NOT NULL,
  Phone VARCHAR(20) UNIQUE,
  HireDate DATE NOT NULL,
  Salary DECIMAL(10,2) NOT NULL CHECK (Salary >= 0),
  IsActive TINYINT(1) DEFAULT 1
) ;

-- ==========================================
-- Service
-- ==========================================
CREATE TABLE Service (
  ServiceID INT PRIMARY KEY AUTO_INCREMENT,
  ServiceName VARCHAR(100) NOT NULL UNIQUE,
  ServicePrice DECIMAL(10,2) NOT NULL CHECK (ServicePrice >= 0),
  IsActive TINYINT(1) DEFAULT 1
) ;

-- ==========================================
-- Part (SQL Side - Inventory Control)
-- ==========================================
CREATE TABLE Part (
  PartID INT PRIMARY KEY AUTO_INCREMENT,
  PartName VARCHAR(100) NOT NULL UNIQUE,
  Cost DECIMAL(10,2) NOT NULL CHECK (Cost >= 0),
  StockQty INT NOT NULL DEFAULT 0 CHECK (StockQty >= 0)
) ;

-- ==========================================
-- WorkOrder
-- ==========================================
CREATE TABLE WorkOrder (
  WorkOrderID INT PRIMARY KEY AUTO_INCREMENT,
  VehicleID INT NOT NULL,
  WorkDate DATE NOT NULL DEFAULT (CURRENT_DATE),
  Status ENUM('Pending','In Progress','Completed','Cancelled') 
         DEFAULT 'Pending',
  Notes TEXT,
  
  FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) 
      ON DELETE CASCADE
) ;

-- ==========================================
-- WorkOrderEmployee (Many-to-Many)
-- ==========================================
CREATE TABLE WorkOrderEmployee (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT NOT NULL,
  EmployeeID INT NOT NULL,
  
  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) 
      ON DELETE CASCADE,
  FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID) 
      ON DELETE CASCADE
) ;

-- ==========================================
-- WorkOrderDetail
-- ==========================================
CREATE TABLE WorkOrderDetail (
  DetailID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT NOT NULL,
  ServiceID INT NULL,
  PartID INT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice >= 0),

  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) 
      ON DELETE CASCADE,
  FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID) 
      ON DELETE SET NULL,
  FOREIGN KEY (PartID) REFERENCES Part(PartID) 
      ON DELETE SET NULL
) ;

-- ==========================================
-- Invoice
-- ==========================================
CREATE TABLE Invoice (
  InvoiceID INT PRIMARY KEY AUTO_INCREMENT,
  WorkOrderID INT NOT NULL UNIQUE,
  InvoiceDate DATE NOT NULL DEFAULT (CURRENT_DATE),
  Subtotal DECIMAL(10,2) NOT NULL CHECK (Subtotal >= 0),
  Tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (Tax >= 0),
  Discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (Discount >= 0),
  TotalAmount DECIMAL(10,2) NOT NULL CHECK (TotalAmount >= 0),
  Status ENUM('Unpaid','Paid','Refunded') DEFAULT 'Unpaid',

  FOREIGN KEY (WorkOrderID) REFERENCES WorkOrder(WorkOrderID) 
      ON DELETE CASCADE
) ;

-- ==========================================
-- Payment
-- ==========================================
CREATE TABLE Payment (
  PaymentID INT PRIMARY KEY AUTO_INCREMENT,
  InvoiceID INT NOT NULL,
  PaymentDate DATE NOT NULL DEFAULT (CURRENT_DATE),
  Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
  PaymentMethod ENUM('Cash','Credit Card','Bank Transfer','QR Code') NOT NULL,

  FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID) 
      ON DELETE CASCADE
) ;

-- ==========================================
-- Sample Data
-- ==========================================

INSERT INTO Brands (TypeName) VALUES 
('Toyota'), ('Honda'), ('BMW');

INSERT INTO Customer (FirstName, LastName, Phone, Email, Address) VALUES
('Ammy', 'Ster', '0800000000', 'ammy@email.com', 'Bangkok'),
('Phu', 'Doe', '0811111111', 'd@email.com', 'Bangkok');

INSERT INTO Vehicle (CustomerID, TypeID, Model, Year, LicensePlate) VALUES
(1, 1, 'Supra', 2022, 'AAA-111'),
(2, 2, 'Civic', 2021, 'BBB-222');