// Save the data of filters on the target with id from the query

const Target = require('../../../../../models/target/Target');

module.exports = (req, res) => {

  // update target
  Target.saveFilters(req.query ? req.query.id : null, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
