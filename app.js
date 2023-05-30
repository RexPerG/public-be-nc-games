const express = require('express');
const app = express();
const { getCategories, getAPIs } = require ('./controllers/categories.controller');
const { getReviewById, getReviews, getReviewIdComments, postReviewIdComments } = require('./controllers/reviews.controllers');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api', getAPIs);

app.get('/api/categories', getCategories);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id', getReviewById);

app.get('/api/reviews/:review_id/comments', getReviewIdComments)

app.post('/api/reviews/:review_id/comments', postReviewIdComments)

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