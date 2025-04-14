CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);


INSERT INTO books (title, author, price) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 9.99),
('To Kill a Mockingbird', 'Harper Lee', 12.99),
('1984', 'George Orwell', 10.99);