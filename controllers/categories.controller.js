const { fetchCategories, fetchAPIs } = require('../models/categories.models');

function getCategories(request, response, next) {
    fetchCategories()
      .then((categories) => {
        response.status(200).send({ categories });
      })
      .catch((err) => {
        next(err);
      });
  };

  function getAPIs (request, response, next) {
    fetchAPIs()
    .then((apis) => {
      response.status(200).send({ apis });
    })
    .catch((err) => {
      next(err);
    });
  };

 module.exports = { getCategories, getAPIs };