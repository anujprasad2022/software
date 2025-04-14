const request = require('supertest');
const app = require('../server');

describe('Book Store API Tests', () => {
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
