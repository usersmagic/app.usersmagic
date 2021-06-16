// Invite a new member to the account
// XMLHTTP Request

const CompanyUser = require('../../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  CompanyUser.inviteCompanyUser(req.session.user._id, req.body, (err, user) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ user, success: true }));
    return res.end();
  });
}
