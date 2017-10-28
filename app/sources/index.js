/* app/sources/index.js */

const express = require('express');
const news = require('../news.api');

const router = express.Router();
// TODO Make this configurable
const formats = ['json'];

// Get sources from News-api.org - return stringified JSON
const sources = async (req, res) => {
  await news.getSources(req, res, (data) => {
    res.json(data);
  });
};

// Get sources from News-api.org - return JSON
const format = async (req, res) => {
  const fmt = req.params.format;
  await news.getSources(req, res, (data) => {
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
router.get('/sources', sources);
router.get('/sources/:format', format);

module.exports = router;
