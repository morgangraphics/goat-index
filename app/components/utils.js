const https = require('https');

// This could potentially be switched out with another library like Axios or Bluebird
// Putting it here means we only have to make one change

/**
* Private function
* Uses native Node https function to handle AJAX requests
* @param {object} opts - HTTP Request options
* @param {function} callback - function that passes results back to getNews
* @return {object} Parsed JSON object
*/
const buildRequest = async (opts, callback) => {
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


const Filter = class {

  constructor(keyword, text) {
    this.keyword = keyword;
    this.text = !(text instanceof Array) ? [text] : text;
    //this.tag = '';
  }

  //get keyword() {
  //  return this.foundKeyword()
  //}

  //get tag() {
  //  this.tag();
  //}

  findKeyword() {
    return this.text.some(item => new RegExp(this.keyword, 'gi').test(item));
  }
};


module.exports = {
  buildRequest,
  formatter,
  Filter,
};
