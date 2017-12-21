'use strict';


/***** MIDDLEWARE DECLARATIONS *****/


const express = require('express'); // does all the server stuff
const cors = require('cors');
const bodyparser = require('body-parser'); // dependency for express
const pg = require('pg'); // postgress database
const superagent = require ('superagent'); // for performing backend AJAX calls

const app = express(); // invoke express
const PORT = process.env.PORT || 3000; // export PORT=###
const CLIENT_URL = process.env.CLIENT_URL || 'https://statoverflow.github.io/statoverflow/'; // export CLIENT_URL=###
const API_KEY = process.env.API_KEY; // export API_KEY='###'

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
  // console.log('url endpoint:', baseUrl + 'questions')
  console.log('tags:', req.query.tags, '\nsort:', req.query.sort)
  superagent.get(baseUrl + 'questions') // searching within questions
    .query({tagged: `${req.query.tags}`})
    .query({pagesize: req.query.pagesize})
    .query({order: 'desc'})
    .query({sort: req.query.sort})
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
        is_answered: question.is_answered ? question.is_answered : false
      }
    }))
    .then(arr => res.send(arr))
    .catch(console.error)
});

// return the profile of a single user from an id
// app.get('/api/v1/user/:id', (req, res) => {
//   superagent.get(baseUrl + 'users/:id')
//   .query({order: 'desc'})
//   .query({sort: 'reputation'})
//   .query({site: 'stackoverflow'})
//   .query({key: `${API_KEY}`})
//   .then (res => res.body.items.map((user, idx) => {
//     return {
//       user: user.display_name ? user.display_name : 'no user name',
//       link: user.link ? user.link: 'no user link',
//       user_image: user.profile_image ? user.profile_image : 'no user image',
//       reputation: user.reputation ? user.reputation : 'user reputation unavailable',
//       creation_date: user.creation_date ? user.creation_date : 'creation date unavailable',
//       last_access_date: user.last_access_date ? user.last_access_date : 'no last access date available',
//       location: user.location ? user.location : 'no user location'
//     }
//   }))
//   .then(arr => res.send(arr))
//   .catch(console.error)
// });

// return the profile of a single user from a searched name
app.get('/api/v1/user/', (req, res) => {
  superagent.get(baseUrl + 'users')
  .query({inname: `${req.query.search}`})
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
      creation_date: user.creation_date ? user.creation_date : 'creation date unavailable',
      last_access_date: user.last_access_date ? user.last_access_date : 'no last access date available',
      location: user.location ? user.location : 'no user location'
    }
  }))
  .then(arr => res.send(arr))
  .catch(console.error)
});

// return top answerers for a specific tag
app.get('/api/v1/top-users/', (req, res) => {
  superagent.get(baseUrl + `tags/${req.query.lang}/top-answerers/${req.query.time}`)
  .query({site: 'stackoverflow'})
  .query({key: `${API_KEY}`})
  .then (res => res.body.items.map((item, idx) => {
    return {
      user: item.user.display_name ? item.user.display_name : 'N/A',
      link: item.user.link ? item.user.link: '#',
      user_image: item.user.profile_image ? item.user.profile_image : 'N/A',
      score: item.score ? item.score : 'N/A',
      reputation: item.user.reputation ? item.user.reputation : 'N/A',
      post_count: item.post_count ? item.post_count : 'N/A',
      accept_rate: item.user.accept_rate ? item.user.accept_rate : '-'
    }
  }))
  .then(arr => res.send(arr))
  .catch(console.error)
});

// return unanswered questions for a specific tag
app.get('/api/v1/unanswered-questions/', (req, res) => {
  superagent.get(baseUrl + 'questions/unanswered')
  .query({tagged: `${req.query.tags}`})
  .query({order: 'desc'})
  .query({pagesize: req.query.pagesize})
  .query({sort: req.query.sort})
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
      view_count: question.view_count ? question.view_count : 'view count unavailable'
    }
  }))
  .then(arr => res.send(arr))
  .catch(console.error)
});

// app.get('/questions/lang=javascript&terms=regex', (req, res) => {
//     client.query(`SELECT * FROM ourtable WHERE;`)
//       .then(results => res.send(results.rows))
//       .catch(console.error);
// });

app.get('*', (req, res) => res.redirect(CLIENT_URL)); // listen for all routes, send to homepage
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // send confirmation to node console
