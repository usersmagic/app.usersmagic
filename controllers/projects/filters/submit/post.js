// Change submition limit of target with the given id
// XMLHTTP request

const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.changeSubmitionLimit(req.query ? req.query.id : null, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
