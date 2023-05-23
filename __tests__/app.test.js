const testData = require('../db/data/test-data');
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const endpoint = require('../endpoints.json');
require('jest-sorted');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/categories Test Suite', () => {
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

describe('GET /api Test Suite', () => {
  test('GET /api responds with JSON describing all the available API endpoints', () => {
    return request(app)
      .get('/api')
      .then((response) => {
        const { apis } = response.body;
        expect(response.statusCode).toBe(200);
        expect(apis).toEqual(endpoint);
        expect(apis).toHaveProperty('GET /api/categories');
      });
  });
});

describe('GET /api/review/:review_id Test Suite', () => {
  test('should respond with a review object with the required properties', () => {
    return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
              'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: expect.any(String),
            votes: 1,
          })
        );
      });
  });
  test('should respond with a 400 bad request if an invalid endpoint is provided', () => {
    return request(app)
      .get('/api/reviews/invalidId')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('should respond with a 404 not found if valid endpoint that does not exist is provided', () => {
    return request(app)
      .get('/api/reviews/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('GET /api/reviews test suite', () => {
  test('GET /api/reviews responds with an array of review objects', () => {
    return request(app)
      .get('/api/reviews')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        response.body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test('GET /api/reviews responds with the array of review objects sorted by date order', () => {
    return request(app)
      .get('/api/reviews')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.reviews).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

// xdescribe('GET /api/reviews/:review_id/comments test suite', () => {
//   return request(app)
//   .get('/api/reviews/1/comments')
//   .then((response) => {
//     expect
//   })
// });
