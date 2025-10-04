-- Add test accounts for development
-- Password for both accounts is: password123

INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES 
('John', 'Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Client'),
('Jane', 'Admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');
