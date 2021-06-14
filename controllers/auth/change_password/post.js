// Changes the password of the logged in user
// Takes the old password and the new password
// XMLHTTP Request

const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  CompanyUser.changePassword(req.session.user._id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
