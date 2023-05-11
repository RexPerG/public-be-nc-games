const categories = require('../db/data/test-data/categories');
const { fetchCategories } = require('../models/categories.models');

function getCategories(request, response, next) {
    console.log('in getCategories; in the controller');
    fetchCategories()
    // console.log(categories,'in the controller')
      .then((categories) => {
        response.status(200).send({ categories });
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        next(err);
      });
  };

 module.exports = { getCategories };