CREATE DATABASE CarCustomShop;
USE CarCustomShop;
-- 1. Create Role table
CREATE TABLE IF NOT EXISTS Role (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Create User table (Staff/Employees)
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    RoleID INT NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

-- 3. Create Customer table
CREATE TABLE IF NOT EXISTS Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Vehicle table
CREATE TABLE IF NOT EXISTS Vehicle (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    Make VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    Color VARCHAR(30),
    LicensePlate VARCHAR(20) UNIQUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- 5. Create WorkOrder table (Modified to include UserID)
CREATE TABLE IF NOT EXISTS WorkOrder (
    WorkOrderID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleID INT NOT NULL,
    UserID INT NOT NULL, -- Tracks which employee created/owns this work order
    Description TEXT,
    Status VARCHAR(20) DEFAULT 'Pending',
    TotalCost DECIMAL(10, 2),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CompletedDate TIMESTAMP NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- ==========================================
-- Insert sample data
-- ==========================================

-- Insert Roles
INSERT INTO Role (RoleName) VALUES 
('Admin'),
('Mechanic'),
('Receptionist');

-- Insert Users (Passwords should be hashed in production, e.g., bcrypt)
INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES 
('admin_ton', 'hashed_pass_1', 'Ton', 'Manager', 1),
('mech_boy', 'hashed_pass_2', 'Boy', 'Fixer', 2),
('rec_jane', 'hashed_pass_3', 'Jane', 'Smile', 3);

-- Insert Customers
INSERT INTO Customer (FirstName, LastName, Phone, Email) VALUES 
('John', 'Doe', '0801234567', 'john@example.com'),
('Jane', 'Smith', '0809876543', 'jane@example.com');

-- Insert Vehicles
INSERT INTO Vehicle (CustomerID, Make, Model, Year, Color, LicensePlate) VALUES 
(1, 'Toyota', 'Camry', 2022, 'Black', 'ABC-1234'),
(2, 'Honda', 'Accord', 2021, 'Silver', 'XYZ-9876');

-- Insert WorkOrders
INSERT INTO WorkOrder (VehicleID, UserID, Description, Status, TotalCost) VALUES 
(1, 3, 'เปลี่ยนถ่ายน้ำมันเครื่องและเช็คระยะ', 'Completed', 2500.00),
(2, 2, 'ติดตั้งชุดแต่งสเกิร์ตรอบคัน', 'In Progress', 15000.00);