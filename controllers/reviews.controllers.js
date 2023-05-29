const { response } = require('../app');
const {
  fetchReviewById,
  fetchReviews,
  fetchReviewIdComments,
  checkReviewIdExists,
  addReviewIdComments,
  checkUserExists
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
  fetchReviewIdComments(review_id)
    .then((comments) => {
      if (comments.length === 0) {
        return checkReviewIdExists(review_id)
          .then((exists) => {
            if (exists) {
              response.status(200).send(comments);
            } else {
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

exports.postReviewIdComments = (request, response, next) => {
  const { review_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    response.status(400).send({ msg: 'Missing required fields' });
    return;
  }

  return checkReviewIdExists(review_id)
    .then((exists) => {
      console.log('controller line 68 exists:', exists)
      if (exists) {
        return checkUserExists(username).then((exists) => {
          if (exists) {
            return addReviewIdComments(review_id, username, body)
              .then((comment) => {
                console.log('controller line 74 comment:', comment )
                response.status(201).send({ comment });
              })
              .catch((err) => {
                console.error(err); // Log the error
                next(err);
              });
          } else {
            response.status(404).send({ msg: 'Not found' });
          }
        })
        .catch((err) => {
          console.error(err); // Log the error
          next(err);
        });
      } else {
        response.status(404).send({ msg: 'Not found' });
      }
    })
    .catch((err) => {
      if (err.message.includes('invalid input syntax for type integer')) {
        response.status(400).send({ msg: 'Invalid ID' });
      } else {
        console.error(err);
        next(err);
      }
    });

  console.log('controller line 61 review_id:', review_id);
  console.log('controller line 62 username:', username);
  console.log('controller line 63 body:', body);
};
