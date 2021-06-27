// Create a new team under Company
// XMLHTTP Request

const CompanyUser = require('../../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  CompanyUser.addTeamToCompany(req.session.user._id, req.body, (err, team) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, team }));
    return res.end();
  });
}
