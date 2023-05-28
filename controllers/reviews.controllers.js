const { response } = require('../app');
const {
  fetchReviewById,
  fetchReviews,
  fetchReviewIdComments,
  checkReviewIdExists,
} = require('../models/reviews.models');

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewIdComments = (request, response, next) => {
  const { review_id } = request.params;
  console.log('controller line 27 review_id', review_id);
  fetchReviewIdComments(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return checkReviewIdExists(review_id).then((exists) => {
          if (exists) {
            response.status(200).send(comments);
          } 
          else {
            response.status(404).send({ msg: 'Not found' });
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      response.status(200).send(comments);
    }
  })
  .catch((err) => {
    next(err);
  });
};