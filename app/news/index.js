/* app/news/index.js */

const express = require('express');
const news = require('../components/news.api');
const red = require('../components/reddit');
const utils = require('../components/utils');

const router = express.Router();

// Get sources from News-api.org - return stringified JSON
const articles = (req, res) => {
  news.getNews(req, ['al-jazeera-english', 'ars-technica'], (data) => {

    data.forEach((source) => {
      source.articles.forEach((article) => {
        // synonym dictionary for keyword
        const filterd = new utils.Filter('president', [article.title, article.description]).findKeyword();
        if (filterd) {
          console.log('send to queue = ', article);
          // Send to queue
          // Python consumes queue
          // Store original article details & news source
          // Fetch images
          // Fetch actual article/content
          // 
        }
      });
    });

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

// Get sources from News-api.org - return JSON
const reddit = (req, res) => {
  const keyword = req.params.keyword;
  red.getSubReddit(keyword, (data) => {
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
router.get('/news/:keyword', reddit);
// router.get('/news/:format', format);

module.exports = router;
