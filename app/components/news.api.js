const https = require('https');
const async = require('async');
const joi = require('joi');

/**
* Private Object
* Format needed to grab news API data via AJAX
*/
const _defaults = {
  hostname: 'newsapi.org',
  path: '',
  method: 'GET',
  headers: {
    'X-Api-Key': '',
  },
};

/**
* Private Function
* Schema Validation to make sure NEWS_API_KEY is in the environment before doing anything
*/
const _envVarsSchema = joi.object({
  NEWS_API_KEY: joi.string()
    .required(),
}).unknown()
  .required();

const { err, value: envVars } = joi.validate(process.env, _envVarsSchema);
if (err) {
  throw new Error(`Config validation error: ${err.message}`);
}


/**
* Private function
* Uses native Node https function to handle AJAX requests
* @param {object} opts - HTTP Request options
* @param {function} callback - function that passes results back to getNews
* @return {object} Parsed JSON object
*/
const _buildRequest = async (opts, callback) => {
  await https.request(opts, (resp) => {
    const data = [];
    resp.setEncoding('utf8');
    resp.on('data', (chunk) => {
      data.push(chunk);
    }).on('end', () => {
      callback(null, JSON.parse(data));
    });
  }).on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    callback(null, { e });
  }).end();
};

/**
* getSources returns a list of news source ID's
* @param {object} req - The Request Object
* @param {function} cb - Callback function
* @return {object} JSON object of News Sources
*/
const getSources = async (req, cb) => {
  try {
    const opts = Object.assign({}, _defaults);
    opts.path = '/v1/sources';
    opts.headers['X-Api-Key'] = envVars.NEWS_API_KEY;
    await _buildRequest(opts, cb);
  } catch (e) {
    console.error(`problem with getSources: ${e.message}`);
    cb({ error: e });
  }
};

/**
* getNews takes an array of news source ID's and returns a concatenated array of
* news articles. Because this is network level processing we take advantage of
* async.map which allows for anync parallel processing.
* @param {object} req - The Request Object
* @param {array} src - Array of news source ID's
* @param {function} cb - Callback function
* @return {object} JSON object of news Articles
*/
const getNews = async (req, src, cb) => {
  const sources = (src instanceof Function) ? [] : src;
  const opts = Object.assign({}, _defaults);
  opts.headers['X-Api-Key'] = envVars.NEWS_API_KEY;
  const iterator = (id, callback) => {
    opts.path = `/v1/articles?source=${id}`;
    _buildRequest(opts, callback);
  };
  async.map(sources, iterator, (e, results) => {
    cb(results);
  });
};

module.exports = {
  getNews,
  getSources,
};
