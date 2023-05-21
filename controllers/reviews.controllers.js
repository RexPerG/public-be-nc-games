const { response } = require('../app')
const { fetchReviewById, fetchReviews } = require('../models/reviews.models')

exports.getReviewById = (request, response, next) => {
    const { review_id } = request.params;
    fetchReviewById(review_id)
    .then((review) => {
        response.status(200).send({ review });
    })
    .catch((err) => {
        next(err);
    });
}

exports.getReviews = (request, response, next) => {
    fetchReviews()
        .then((reviews) => {
            response.status(200).send({ reviews});
        })
        .catch((err) => {
            next(err)
        })
}