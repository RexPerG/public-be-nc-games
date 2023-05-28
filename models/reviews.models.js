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
    .query(
      `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, CAST(count(comments.comment_id) as INT) as comment_count FROM reviews JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
    )
    .then((result) => {
      const rows = result.rows;
      return rows;
    })
    .catch((error) => {
      console.error('Error fetching reviews:', error);
      throw error;
    });
};

exports.fetchReviewIdComments = (review_id) => {
  console.log('model line 30', review_id);
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC;`,
      [review_id]
    )
    .then((result) => {
      console.log('model row 34 result', result);
      const rows = result.rows;
      console.log('model line 36 result.rows', result.rows);
      return rows;
    })
    .catch((error) => {
      console.error('Error fetching reviews:', error);
      throw error;
    });
};

exports.checkReviewIdExists = (review_id) => {
  return db
    .query('SELECT EXISTS(SELECT 1 FROM reviews WHERE review_id = $1)', [
      review_id,
    ])
    .then((result) => {
      return result.rows[0].exists;
    });
};
