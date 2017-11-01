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
};
