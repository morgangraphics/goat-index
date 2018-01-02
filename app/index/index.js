/* app/index/index.js */

const express = require('express');
const path = require('path');

const router = express.Router();

const home = (req, res, next) => { res.render(path.join(__dirname, '/index')); }

/* GET home page. */
router.get('/', home);

module.exports = router;
