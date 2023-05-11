const db = require('../db/connection');
const endpoints = require('../endpoints.json')
const fs = require('fs/promises');

function fetchCategories() {
  return db.query(`SELECT * FROM categories;`)
    .then((result) => {
        const rows = result.rows;
        return rows;
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        throw error;
      });
};

// console.log(JSON.stringify({ endpoints }));

function fetchAPIs(){
  return fs.readFile(__dirname+'/../endpoints.json', 'utf-8')
  .then((data) => {
    // console.log(data);
    return JSON.parse(data);
  })
  .catch((err) => {
    throw err;
  })
}

module.exports = { fetchCategories, fetchAPIs };