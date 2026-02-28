-- MySQL Setup Script for Car Customization Project
-- Run this script in MySQL to set up the database and user

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS CarCustomShop;

-- Use the database
USE CarCustomShop;

-- Create a dedicated user for the application (optional but recommended)
CREATE USER IF NOT EXISTS 'shopuser'@'localhost' IDENTIFIED BY 'shoppass';
GRANT ALL PRIVILEGES ON CarCustomShop.* TO 'shopuser'@'localhost';
FLUSH PRIVILEGES;

-- Create Users table for authentication
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

SELECT 'Database setup completed successfully!' as message;
