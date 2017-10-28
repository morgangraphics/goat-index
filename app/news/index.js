/* app/news/index.js */

const express = require('express');
const news = require('../news.api');

const router = express.Router();
const formats = ['json'];

// Get sources from News-api.org - return stringified JSON
const articles = (req, res) => {
  const foo = [];
  news.getNews(['al-jazeera-english', 'ars-technica'], (data) => {
    //res.json(data);
    console.log(data);
    foo.push({ source: data.source, articles: data.articles });
    console.log(foo);
  });
};

// Get sources from News-api.org - return JSON
const format = async (req, res) => {
  const fmt = req.params.format;
  await news.getNews(req, res, (data) => {
    if (formats.indexOf(fmt) !== -1) {
      switch (fmt) {
        case 'json':
        default:
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(JSON.parse(data), null, 4));
      }
    }
  });
};

/* GET News Sources */
router.get('/news', articles);
router.get('/news/:format', format);

module.exports = router;
