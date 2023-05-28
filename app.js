const express = require('express');
const app = express();
const { getCategories, getAPIs } = require ('./controllers/categories.controller');
const { getReviewById, getReviews, getReviewIdComments } = require('./controllers/reviews.controllers');

app.get('/api', getAPIs);

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getReviewIdComments)

app.all("*", (request, response) => {
    response.status(404).send({ msg: "Not Found!" })
})

app.use((err, request, response, next) => {
    if(err.code === '22P02'){
        response.status(400).send({ msg: 'Bad request' })
    } else {
        next(err);
    }
})

app.use((err, request, response, next) => {
    if(err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg})
    } else {
        next(err);
    }
});

app.use((err, request, response) => {
    response.status(500).send({ msg: 'Internal server error'});
});


module.exports = app;