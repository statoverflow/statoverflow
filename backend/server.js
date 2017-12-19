'use strict';

const express = require('express'); // does all the server stuff
const bodyparser = require('body-parser').urlencoded({extended: true}); // dependency for express
const pg = require('pg'); // postgress database
const superagent = require ('superagent'); // for performing backend AJAX calls 

const app = express(); // invoke express
const PORT = process.env.PORT || 3000; // export PORT=###
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4567'; // export CLIENT_URL=###
const API_KEY = process.env.API_KEY; // export API_KEY='###'

const client = new pg.Client(process.env.DATABASE_URL); // invoke database
client.connect(); // new pg connection
client.on('error', err => console.error(err)); // send error message to server

// app.use(cors()); // if cross origin becomes an issue

app.get('/', (req, res) => res.send('Testing 1, 2, 3')); // test that we can load a basic page

// example from book app
app.get('/api/v1/books/find', (req, res) => {
    
    /* const query = `https://www.googleapis.com/books/v1/volumes?`;
    // inauthor:frank%20herbert+intitle:dune+isbn:9780143111580
    superagent.get(`${query}`)
      .query('q' : req.body)
      .end(function(err, res){})  
      */
    
    let url = 'https://api.stackexchange.com/2/2/questions?pagesize=50&order=desc&sort=activity';
    let query = ''
    if(req.query.lang) query += `+lang:${req.query.lang}`;
    if(req.query.terms) query += `+terms:${req.query.terms}`;
    console.log('query-',query);
  
    superagent.get(url)
      .query({'q': query})
      .query({'key': API_KEY})
      .then(response => response.body.items.map((book, idx) => {
        let { title, authors, industryIdentifiers, imageLinks, description } = book.volumeInfo;
        let placeholderImage = 'http://www.newyorkpaddy.com/images/covers/NoCoverAvailable.jpg';
  
        return {
          title: title ? title : 'No title available',
          author: authors ? authors[0] : 'No authors available',
          isbn: industryIdentifiers ? `ISBN_13 ${industryIdentifiers[0].identifier}` : 'No ISBN available',
          image_url: imageLinks ? imageLinks.smallThumbnail : placeholderImage,
          description: description ? description : 'No description available',
          book_id: industryIdentifiers ? `${industryIdentifiers[0].identifier}` : '',
        }
      }))
      .then(arr => res.send(arr))
      .catch(console.error)
  })

app.get('/questions/lang=javascript&terms=regex', (req, res) => {
    client.query(`SELECT * FROM ourtable WHERE;`)
      .then(results => res.send(results.rows))
      .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL)); // listen for all routes, send to homepage
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // send confirmation to node console