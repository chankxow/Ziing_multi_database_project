-- Enhanced Database Schema for Automotive Performance Ecosystem
-- This extends the existing CarCustomShop database with supply chain and build log features

-- User Management Table
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'mechanic', 'customer', 'supplier') NOT NULL,
    Email VARCHAR(100),
    FullName VARCHAR(100),
    Phone VARCHAR(20),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS Supplier (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Address TEXT,
    Website VARCHAR(255),
    Rating DECIMAL(3,2) DEFAULT 0.00,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Parts Table (MySQL for relational integrity)
CREATE TABLE IF NOT EXISTS Part (
    PartID INT AUTO_INCREMENT PRIMARY KEY,
    PartNumber VARCHAR(50) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Category VARCHAR(50),
    Brand VARCHAR(50),
    Model VARCHAR(50),
    YearCompatibility VARCHAR(20),
    Price DECIMAL(10,2),
    Cost DECIMAL(10,2),
    Weight DECIMAL(8,3),
    Dimensions VARCHAR(50),
    SupplierID INT,
    StockQuantity INT DEFAULT 0,
    MinStockLevel INT DEFAULT 5,
    MaxStockLevel INT DEFAULT 100,
    ReorderPoint INT DEFAULT 10,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS PurchaseOrder (
    PurchaseOrderID INT AUTO_INCREMENT PRIMARY KEY,
    OrderNumber VARCHAR(50) UNIQUE NOT NULL,
    SupplierID INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpectedDeliveryDate DATE,
    Status ENUM('pending', 'ordered', 'received', 'cancelled') DEFAULT 'pending',
    TotalAmount DECIMAL(12,2),
    Notes TEXT,
    CreatedBy INT,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID),
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID)
);

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS PurchaseOrderItem (
    PurchaseOrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    PurchaseOrderID INT NOT NULL,
    PartID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2),
    TotalPrice DECIMAL(12,2),
    ReceivedQuantity INT DEFAULT 0,
    FOREIGN KEY (PurchaseOrderID) REFERENCES PurchaseOrder(PurchaseOrderID),
    FOREIGN KEY (PartID) REFERENCES Part(PartID)
);

-- Build Projects Table
CREATE TABLE IF NOT EXISTS BuildProject (
    BuildProjectID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    VehicleID INT NOT NULL,
    CustomerID INT NOT NULL,
    LeadMechanicID INT,
    StartDate DATE,
    EstimatedCompletionDate DATE,
    ActualCompletionDate DATE,
    Status ENUM('planning', 'in_progress', 'testing', 'completed', 'on_hold') DEFAULT 'planning',
    TotalBudget DECIMAL(12,2),
    ActualCost DECIMAL(12,2) DEFAULT 0.00,
    Description TEXT,
    Goals TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (LeadMechanicID) REFERENCES User(UserID)
);

-- Build Stages Table
CREATE TABLE IF NOT EXISTS BuildStage (
    BuildStageID INT AUTO_INCREMENT PRIMARY KEY,
    BuildProjectID INT NOT NULL,
    StageName VARCHAR(100) NOT NULL,
    Description TEXT,
    EstimatedHours DECIMAL(5,2),
    ActualHours DECIMAL(5,2) DEFAULT 0.00,
    Status ENUM('not_started', 'in_progress', 'completed', 'blocked') DEFAULT 'not_started',
    StartDate TIMESTAMP NULL,
    EndDate TIMESTAMP NULL,
    Dependencies TEXT, -- JSON string of dependent stage IDs
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BuildProjectID) REFERENCES BuildProject(BuildProjectID)
);

-- Build Logs Table
CREATE TABLE IF NOT EXISTS BuildLog (
    BuildLogID INT AUTO_INCREMENT PRIMARY KEY,
    BuildProjectID INT NOT NULL,
    BuildStageID INT,
    MechanicID INT,
    LogDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    HoursWorked DECIMAL(4,2) DEFAULT 0.00,
    Description TEXT,
    Notes TEXT,
    Status ENUM('normal', 'issue', 'milestone', 'note') DEFAULT 'normal',
    FOREIGN KEY (BuildProjectID) REFERENCES BuildProject(BuildProjectID),
    FOREIGN KEY (BuildStageID) REFERENCES BuildStage(BuildStageID),
    FOREIGN KEY (MechanicID) REFERENCES User(UserID)
);

-- Parts Usage Table
CREATE TABLE IF NOT EXISTS PartsUsage (
    PartsUsageID INT AUTO_INCREMENT PRIMARY KEY,
    BuildProjectID INT NOT NULL,
    PartID INT NOT NULL,
    QuantityUsed INT NOT NULL,
    UnitCost DECIMAL(10,2),
    TotalCost DECIMAL(12,2),
    UsageDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MechanicID INT,
    Notes TEXT,
    FOREIGN KEY (BuildProjectID) REFERENCES BuildProject(BuildProjectID),
    FOREIGN KEY (PartID) REFERENCES Part(PartID),
    FOREIGN KEY (MechanicID) REFERENCES User(UserID)
);

-- Performance Data Table
CREATE TABLE IF NOT EXISTS PerformanceData (
    PerformanceDataID INT AUTO_INCREMENT PRIMARY KEY,
    BuildProjectID INT NOT NULL,
    TestDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TestType ENUM('dyno', 'track', 'quarter_mile', 'braking', 'handling') NOT NULL,
    Horsepower DECIMAL(6,2),
    Torque DECIMAL(6,2),
    QuarterMileTime DECIMAL(5,3),
    TopSpeed DECIMAL(5,2),
    BrakingDistance60to0 DECIMAL(5,2),
    LateralG DECIMAL(4,2),
    WeatherConditions VARCHAR(100),
    Track VARCHAR(100),
    Notes TEXT,
    FOREIGN KEY (BuildProjectID) REFERENCES BuildProject(BuildProjectID)
);

-- Media Attachments Table
CREATE TABLE IF NOT EXISTS MediaAttachment (
    MediaAttachmentID INT AUTO_INCREMENT PRIMARY KEY,
    BuildProjectID INT,
    BuildLogID INT,
    FileName VARCHAR(255) NOT NULL,
    OriginalFileName VARCHAR(255),
    FilePath VARCHAR(500),
    FileType ENUM('image', 'video', 'document') NOT NULL,
    FileSize DECIMAL(12,2),
    Description TEXT,
    UploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UploadedBy INT,
    FOREIGN KEY (BuildProjectID) REFERENCES BuildProject(BuildProjectID),
    FOREIGN KEY (BuildLogID) REFERENCES BuildLog(BuildLogID),
    FOREIGN KEY (UploadedBy) REFERENCES User(UserID)
);

-- Inventory Transactions Table
CREATE TABLE IF NOT EXISTS InventoryTransaction (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    PartID INT NOT NULL,
    TransactionType ENUM('purchase', 'usage', 'adjustment', 'return') NOT NULL,
    Quantity INT NOT NULL,
    UnitCost DECIMAL(10,2),
    TotalCost DECIMAL(12,2),
    ReferenceID INT, -- Can reference PurchaseOrderID, BuildProjectID, etc.
    ReferenceType VARCHAR(50),
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,
    Notes TEXT,
    FOREIGN KEY (PartID) REFERENCES Part(PartID),
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID)
);

-- Insert default admin user (password: admin123)
INSERT INTO User (Username, PasswordHash, Role, Email, FullName) VALUES 
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', 'admin', 'admin@automotive.com', 'System Administrator');

-- Insert sample suppliers
INSERT INTO Supplier (Name, ContactPerson, Email, Phone, Address) VALUES 
('Performance Parts Inc.', 'John Smith', 'orders@performanceparts.com', '555-0101', '123 Industrial Way, Detroit, MI 48201'),
('Speed Shop Supplies', 'Sarah Johnson', 'info@speedshop.com', '555-0102', '456 Racing Blvd, Charlotte, NC 28206'),
('Turbo Dynamics', 'Mike Wilson', 'sales@turbodynamics.com', '555-0103', '789 Boost Lane, Los Angeles, CA 90001');

-- Create indexes for performance optimization
CREATE INDEX idx_parts_supplier ON Part(SupplierID);
CREATE INDEX idx_parts_category ON Part(Category);
CREATE INDEX idx_build_project_vehicle ON BuildProject(VehicleID);
CREATE INDEX idx_build_project_customer ON BuildProject(CustomerID);
CREATE INDEX idx_build_stage_project ON BuildStage(BuildProjectID);
CREATE INDEX idx_build_log_project ON BuildLog(BuildProjectID);
CREATE INDEX idx_parts_usage_project ON PartsUsage(BuildProjectID);
CREATE INDEX idx_performance_data_project ON PerformanceData(BuildProjectID);
CREATE INDEX idx_inventory_transaction_part ON InventoryTransaction(PartID);
CREATE INDEX idx_media_attachment_project ON MediaAttachment(BuildProjectID);
