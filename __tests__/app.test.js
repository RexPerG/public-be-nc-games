const testData = require('../db/data/test-data');
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const endpoint = require('../endpoints.json');

beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    return db.end()
});

describe('API endpoint testing', () => {
    test('GET /api/categories responds with an array of category objects', () => {
        return request(app)
          .get('/api/categories')
          .then((response) => {
            expect(response.statusCode).toBe(200);
            response.body.categories.forEach((category) => {
              expect(typeof category.slug).toBe('string');
              expect(typeof category.description).toBe('string');
            });
          });
      });
    test('GET /api responds with JSON describing all the available API endpoints', () => {
      return request(app)
        .get('/api')
        .then((response) => {
          console.log(response.body);
          const { apis } = response.body;
          expect(response.statusCode).toBe(200);
          expect(apis).toEqual(endpoint);
          expect(apis).toHaveProperty('GET /api/categories')
          })
        })
    })