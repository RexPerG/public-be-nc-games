const { response } = require('../app')
const { fetchReviewById } = require('../models/reviews.models')

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