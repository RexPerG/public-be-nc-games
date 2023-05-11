const express = require('express');
const app = express();
const { getCategories, getAPIs } = require ('./controllers/categories.controller');


//define an api endpoint listening for get categories (needs to return an array of category objects with 'slugs' and 'description') and 
app.get('/api/categories', getCategories);

app.get('/api', getAPIs);

module.exports = app;