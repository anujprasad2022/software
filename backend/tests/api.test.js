const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

describe('Book Store API Tests', () => {
    // Before all tests, ensure we have test data
    beforeAll(async () => {
        try {
            // Insert test user
            await pool.query(`
                INSERT INTO users (username, password)
                VALUES ('testuser', 'testpass')
                ON CONFLICT (username) DO NOTHING
            `);
        } catch (err) {
            console.error('Test setup error:', err);
        }
    });

    // After all tests, clean up
    afterAll(async () => {
        await pool.end();
    });

    test('GET /books/search should return matching books', async () => {
        const response = await request(app)
            .get('/books/search')
            .query({ query: 'Gatsby' });
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: expect.stringContaining('Gatsby')
                })
            ])
        );
    });

    test('POST /login with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'testuser',
                password: 'testpass'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
    });
});
