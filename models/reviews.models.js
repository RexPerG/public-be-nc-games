const db = require('../db/connection');

exports.fetchReviewById = (review_id) => {
  return db
    .query('SELECT * FROM reviews WHERE review_id = $1;', [review_id])
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return review.rows[0];
    });
};

exports.fetchReviews = () => {
    return db
      .query('SELECT * FROM reviews ORDER BY created_at;')
      .then((result) => {
        const rows = result.rows;
        console.log(rows);
        return rows;
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        throw error;
      });
  };
