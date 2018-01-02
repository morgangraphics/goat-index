const newsapi = require('./news.api');
const reddit = require('./reddit');

module.export = Object.assign({}, newsapi, reddit);
