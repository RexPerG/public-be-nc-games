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

describe('TASK 3 GET /api/categories Test Suite', () => {
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

describe('TASK 3.5 GET /api Test Suite', () => {
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

describe('TASK 4 GET /api/review/:review_id Test Suite', () => {
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

describe('TASK 5 GET /api/reviews test suite', () => {
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

xdescribe('TASK 6 GET /api/reviews/:review_id/comments test suite', () => {
  test('GET /api/review/1/comments should return status 200 and an empty array of comments for valid ID', () => {
    return request(app)
      .get('/api/reviews/1/comments')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body).toBe(true));
        expect(response.body.comments.length).toBe(0);
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
        expect(response.body.comments.length).toBe(3);
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
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

xdescribe('TASK 7 POST /api/reviews/:review_id/comments', () => {
  test('POST /api/reviews/:review_id/comments should return a 201 for created comments', () => {
    const newComment = { username: 'mallionaire', body: 'Awesome!!'}
    return request(app)
      .post('/api/reviews/3/comments').send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(newComment)
        // Status 201, created comment object
        // Status 201, ignores unnecessary properties
        // Status 400, invalid ID, e.g. string of "not-an-id"
        // Status 404, non existent ID, e.g. 0 or 9999
        // Status 400, missing required field(s), e.g. no username or body properties
        // Status 404, username does not exist
      });
  });
});
xdescribe('TASK 8 PATCH /api/reviews/:review_id', () => {
  // Status 200, updated single review object.
  // Status 400, invalid ID, e.g. string of "not-an-id"
  // Status 404, non existent ID, e.g. 0 or 9999
  // Status 400, incorrect body, e.g. inc_votes property is not a number
});

xdescribe('TASK 9 DELETE /api/comments/:comment_id', () => {});
