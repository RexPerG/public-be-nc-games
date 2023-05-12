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

describe('GET /api/categories test suite', () => {
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
});

describe('GET /API test suite', () => {
  test('GET /api responds with JSON describing all the available API endpoints', () => {
    return request(app)
    .get('/api')
    .then((response) => {
      const { apis } = response.body;
      expect(response.statusCode).toBe(200);
      expect(apis).toEqual(endpoint);
      expect(apis).toHaveProperty('GET /api/categories')
    });
  });
});

describe('GET /api/review/:review_id test suite', () => {
  test('should respond with a review object with the required properties', () => {
    return request(app)
    .get('/api/reviews/1')
    .expect(200)
    .then((response) => {
      expect(response.body.review).toEqual(expect.objectContaining({
        review_id: 1,
        title: 'Agricola',
        designer: 'Uwe Rosenberg',
        owner: 'mallionaire',
        review_img_url:
          'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
        review_body: 'Farmyard fun!',
        category: 'euro game',
        created_at: expect.any(String),
        votes: 1
      }));
    });
  });
  test('should respond with a 400 bad request if an invalid endpoint is provided', () => {
    return request(app)
    .get('/api/reviews/invalidId')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request')
    });
  });
  test('should respond with a 404 not found if valid endpoint that does not exist is provided', () => {
    return request(app)
    .get('/api/reviews/999999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not found')
    });
  });
});
