'use strict';

const express = require('express'); // does all the server stuff
const cors = require('cors');
const bodyparser = require('body-parser'); // dependency for express
const pg = require('pg'); // postgress database
const superagent = require ('superagent'); // for performing backend AJAX calls

const app = express(); // invoke express
const PORT = process.env.PORT || 3000; // export PORT=###
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4567'; // export CLIENT_URL=###
// const API_KEY = process.env.API_KEY; // export API_KEY='###'
const API_KEY = 'zTrL2mWOL*xMGPBgdRsWiw((';

const client = new pg.Client(process.env.DATABASE_URL); // invoke database
client.connect(); // new pg connection
client.on('error', err => console.error(err)); // send error message to server

// app.use(cors()); // if cross origin becomes an issue
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('../frontend'));

app.get('/', (req, res) => res.sendFile('index.html', {root: '../frontend'})); // test that we can load a basic page

app.get('/api', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// example from book app
app.get('/api/v1/questions', (req, res) => {
  console.log('inside questions query');
  // console.log(req);
  console.log('api value: ' + API_KEY);
    /* const query = `https://www.googleapis.com/books/v1/volumes?`;
    // inauthor:frank%20herbert+intitle:dune+isbn:9780143111580
    superagent.get(`${query}`)
      .query('q' : req.body)
      .end(function(err, res){})
      */


  // {lang: 'java', terms: 'item1; item2; item3'}
  let url = 'https://api.stackexchange.com/2.2/';
  let query = 'questions?order=desc&sort=activity';
  query += `&tagged=${req.query.lang}`;
  console.log(`This is our query object!: ${JSON.stringify(req.query)}`)
  if(req.query.terms) query += `;${req.query.terms}`;
  query += `&site=stackoverflow&key=${API_KEY}`;
  console.log('this is the URL: ' + url);
  // console.log('query-',query);

  superagent.get(url+query)

    /*
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
    */
    // .query('')
    .then (response => console.log('my id is: ', response.body.items[2].question_id))
    // .then (response => response.body.items.forEach(entry => {
    //   let title = item.title;
    //   let creation_date = item.creation_date;
    //   let is_answered = item.is_answered;

    //   return {title, creation_date, is_answered}
    // }))

      
    
    // .then(response => response.item.map((item, id) => {
    //   console.log('hello, is this a response?');
    // }))

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
