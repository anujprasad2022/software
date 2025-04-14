const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Test database connection before starting server
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

testConnection();

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
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Failed to process login' });
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

// Search endpoint
app.get('/books/search', async (req, res) => {
    try {
        const { query } = req.query;
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

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

module.exports = app;
