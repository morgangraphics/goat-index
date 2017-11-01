/* app/news/index.js */

const express = require('express');
const news = require('../components/news.api');

const router = express.Router();


// Get sources from News-api.org - return stringified JSON
const articles = (req, res) => {
  news.getNews(req, ['al-jazeera-english', 'ars-technica'], (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 4));
  });
};

// Get sources from News-api.org - return JSON
const sources = (req, res) => {
  const fmt = req.params.format;
  news.getSources(req, (opts, data) => {
    // if (formats.indexOf(fmt) !== -1) {
    //  switch (fmt) {
    //    case 'json':
    //    default:
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(data, null, 4));
    //  }
    // }
  });
};

/* GET News Sources */
router.get('/news/articles', articles);
router.get('/news/articles/:format', articles);
router.get('/news/sources', sources);
router.get('/news/sources/:format', sources);
// router.get('/news/:format', format);

module.exports = router;
