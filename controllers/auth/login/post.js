const Company = require('../../../models/company/Company');

module.exports = (req, res) => {
  Company.findCompany(req.body, (err, company) => {
    if (err || !company) {
      req.session.error = err;
      return res.redirect('/auth/login');
    }

    req.session.company = company;

    if (req.session.redirect)
      return res.redirect(req.session.redirect);
    else
      return res.redirect('/');
  });
}
