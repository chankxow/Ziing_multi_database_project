-- Insert test users with proper bcrypt hashes
INSERT INTO User (Username, PasswordHash, FirstName, LastName, RoleID) VALUES 
('admin_user', '$2b$12$VzyevjdpfreL2rWJw7RaruaWjjVZDFtBd5eJVVaJOh6boq/jfrCdi', 'Admin', 'User', 1),
('staff_user', '$2b$12$JWDFmMIRyQ75Fbp/ZI0UQ.gxLgs6cBSVfFF3dL9sxvCbAkjJsUS2m', 'Staff', 'User', 2),
('customer_user', '$2b$12$jJaSsyXPoOZDJTaITZ/H0.w0yVtWChQnAPoFyiOdTHuf3xed6xL1.', 'Customer', 'User', 3);
