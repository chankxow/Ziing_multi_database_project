-- Sample initialization SQL for CarCustomShop Database
-- This file will be executed automatically when MySQL container starts

-- Create Customer table
CREATE TABLE IF NOT EXISTS Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(100),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Vehicle table
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

-- Create WorkOrder table
CREATE TABLE IF NOT EXISTS WorkOrder (
    WorkOrderID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleID INT NOT NULL,
    Description TEXT,
    Status VARCHAR(20) DEFAULT 'Pending',
    TotalCost DECIMAL(10, 2),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CompletedDate TIMESTAMP NULL,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID)
);

-- Insert sample data
INSERT INTO Customer (FirstName, LastName, Phone, Email) VALUES 
('John', 'Doe', '0801234567', 'john@example.com'),
('Jane', 'Smith', '0809876543', 'jane@example.com');

INSERT INTO Vehicle (CustomerID, Make, Model, Year, Color, LicensePlate) VALUES 
(1, 'Toyota', 'Camry', 2022, 'Black', 'ABC-1234'),
(2, 'Honda', 'Accord', 2021, 'Silver', 'XYZ-9876');
