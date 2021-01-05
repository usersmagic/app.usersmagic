// Finish project with specified id on query, set its status as waiting
// XMLHTTP request

const Target = require('../../../../../models/target/Target');

module.exports = (req, res) => {
  Target.finishTarget(req.query ? req.query.id : null, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }; // Return error and success: false if there is an error

    res.write(JSON.stringify({ success: true }));
    return res.end(); // Return success: true
  });
}
