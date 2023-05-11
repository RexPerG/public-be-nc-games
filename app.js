const express = require('express');
const app = express();
const { getCategories } = require ('./controllers/categories.controller');

// console.log(app.get('/api/categories', getCategories));
// console.log(getCategories());

//define an api endpoint listening for get categories (needs to return an array of category objects with 'slugs' and 'description') and 
app.get('/api/categories', getCategories);

module.exports = app;