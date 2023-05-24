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

xdescribe('GET /api/reviews/:review_id/comments test suite', () => {
  test('GET /api/review/1/comments should return status 200 and an empty array of comments for valid ID', () => {
    return request(app)
      .get('/api/reviews/1/comments')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body).toBe(true));
        expect(response.body.length).toBe(0);
      });
  });
  test('GET /api/review/2/comments should return status 200 and a comment object, sorted by created_at date, for the specified review', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body).toBe(true));
        expect(response.body.comments).toBeSortedBy('created_at', { 
          descending: true,
        });
        expect(comment).toEqual(
          expect.arrayContaining([
            {
              comment_id: expect.any(Number),
              body: 'I loved this game too!',
              votes: 16,
              author: 'bainesface',
              review_id: 2,
              created_at: new Date(1511354613389),
            },
            {
              comment_id: expect.any(Number),
              body: 'EPIC board game!',
              votes: 16,
              author: 'bainesface',
              review_id: 2,
              created_at: new Date(1511354163389),
            },
            {
              comment_id: expect.any(Number),
              body: 'Now this is a story all about how, board games turned my life upside down',
              votes: 13,
              author: 'mallionaire',
              review_id: 2,
              created_at: new Date(1610965445410),
            },
          ])
        );
      });
  });
  test('GET /api/reviews/not-an-id/comments', () => {
    return request(app)
      .get('/api/reviews/not-an-id/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('GET /api/reviews/999999/comments', () => {
    return request(app)
      .get('/api/reviews/999999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});
