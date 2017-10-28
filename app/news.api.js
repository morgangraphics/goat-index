const https = require('https');
const async = require('async');

const defaults = {
  hostname: 'newsapi.org',
  path: '',
  method: 'GET',
  headers: {
    'X-Api-Key': 'cb826524964e4e16b790dad71cef4257',
  },
};
const formats = ['json'];

const getSources = async (req, res, cb) => {
  const callback = cb || {};
  const opts = Object.assign({}, defaults);
  opts.path = '/v1/sources';

  await https.request(opts, (resp) => {
    const data = [];
    resp.setEncoding('utf8');
    resp.on('data', (chunk) => {
      data.push(chunk);
    }).on('end', () => {
      callback(data);
    });
  }).on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  }).end();
};

const getNews = async (src, cb) => {
  const callback = cb || {};
  const sources = (src instanceof Function) ? [] : src;
  const opts = Object.assign({}, defaults);
  const foo = []
  async.map(sources, (id) => {
    opts.path = `/v1/articles?source=${id}`;

    https.request(opts, (resp) => {
      const data = [];
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => {
        data.push(chunk);
      }).on('end', () => {
        callback(data);
      });
    }).on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    }).end();

}, (err, results) => {
    // completion function
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    if (!err) {
      // process all results in the array here
      console.log('====================================================================================================', results);
    } else {
      // handle error here
      console.log('####################################################################################################', err);
    }
  });
};

const formatter = async (req, res) => {
  const fmt = req.params.format;
  await getSources(req, res, (data) => {
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


module.exports = {
  formatter,
  getNews,
  getSources,
};
