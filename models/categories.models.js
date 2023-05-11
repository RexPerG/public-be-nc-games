const db = require('../db/connection');
// const categories = require('../db/data/test-data/categories');
console.log('in categories.models');

function fetchCategories() {
  console.log('in fetchCategories');  
  return db.query(`SELECT * FROM categories;`)
    .then((result) => {
        const rows = result.rows;
        console.log(rows, 'in the model; in fetchCategories')
        return rows;
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        throw error;
      });
};

module.exports = { fetchCategories };