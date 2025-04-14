const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bookstore',
    password: 'qwer', // Change this to your postgres password
    port: 5432,
});

// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, password]
        );
        res.json({ success: true, userId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
        if (result.rows.length > 0) {
            res.json({ success: true, userId: result.rows[0].id });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all books
app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new endpoint for search
app.get('/books/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            const result = await pool.query('SELECT * FROM books');
            return res.json(result.rows);
        }
        
        const result = await pool.query(
            'SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1)',
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Failed to search books' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = app;