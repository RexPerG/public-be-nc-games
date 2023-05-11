const testData = require('../db/data/test-data');
const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('API testing', () => {
    test('responds with an array of category objects', () => {
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
    });