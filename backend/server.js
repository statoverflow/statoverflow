'use strict';


/***** MIDDLEWARE DECLARATIONS *****/


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

// route to the main page
app.get('/', (req, res) => res.sendFile('index.html', {root: '../frontend'})); // test that we can load a basic page


/***** API QUERIES *****/


let baseUrl = 'https://api.stackexchange.com/2.2/';

app.get('/api', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// return all questions defined by tags
app.get('/api/v1/questions/', (req, res) => {
  superagent.get(baseUrl += 'questions') // searching within questions
    .query({tagged: `${req.query.tags}`})
    .query({order: 'desc'})
    .query({sort: 'activity'})
    .query({site: 'stackoverflow'})
    .query({key: `${API_KEY}`})
    .then (res => res.body.items.map((question, idx) => {
      return {
        title: question.title ? question.title : 'no question title',
        link: question.link ? question.link: 'no question link',
        user: question.owner.display_name ? question.owner.display_name : 'no username',
        user_image: question.owner.profile_image ? question.owner.profile_image : 'no user image',
        user_link: question.owner.link ? question.owner.link : 'no user link',
        creation_date: question.creation_date ? question.creation_date : 'no date of creation',
        is_answered: question.is_answered ? question.is_answered : 'unsure if answered'
      }
    }))
    .then(arr => res.send(arr))
    .catch(console.error)
});

// return top users
app.get('/api/v1/top-users/', (req, res) => {
  superagent.get(baseUrl += 'users')
  // .query({tagged: `${req.query.tags}`})
  .query({order: 'desc'})
  .query({sort: 'reputation'})
  .query({site: 'stackoverflow'})
  .query({key: `${API_KEY}`})
  .then (res => res.body.items.map((user, idx) => {
    return {
      user: user.display_name ? user.display_name : 'no user name',
      link: user.link ? user.link: 'no user link',
      user_image: user.profile_image ? user.profile_image : 'no user image',
      reputation: user.reputation ? user.reputation : 'user reputation unavailable',
      location: user.location ? user.location : 'no user location'
    }
  }))
  .then(arr => res.send(arr))
  .catch(console.error)
});

app.get('/questions/lang=javascript&terms=regex', (req, res) => {
    client.query(`SELECT * FROM ourtable WHERE;`)
      .then(results => res.send(results.rows))
      .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL)); // listen for all routes, send to homepage
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // send confirmation to node console
