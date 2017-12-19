'use strict';

const express = require('express'); // does all the server stuff
const bodyparser = require('body-parser').urlencoded({extended: true}); // dependency for express
const pg = require('pg'); // postgress database

const app = express(); // invoke express
const PORT = process.env.PORT || 3000; // export PORT=###
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4567'; // export CLIENT_URL=###
const API_KEY = process.env.API_KEY; // export API_KEY='###'

const client = new pg.Client(process.env.DATABASE_URL); // invoke database
client.connect(); // new pg connection
client.on('error', err => console.error(err)); // send error message to server


app.get('*', (req, res) => res.redirect(CLIENT_URL)); // listen for all routes, send to homepage
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // send confirmation to node console