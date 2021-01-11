// Changes the password of the logged in user
// Takes the old password and the new password
// XMLHTTP Request

const Company = require('../../../models/company/Company');

module.exports = (req, res) => {
  Company.changePassword(req.query ? req.query.id : null, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
