// Login to the account, set req.session.user
// XMLHTTP Request

const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  CompanyUser.findCompanyUser(req.body, (err, company_user) => {
    if (err || !company_user) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    req.session.user = company_user;

    res.write(JSON.stringify({ redirect: req.session.redirect, success: true }));
    return res.end();
  });
}
