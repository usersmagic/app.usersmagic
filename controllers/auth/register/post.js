// Create a new country with the given data

const Company = require('../../../models/company/Company');

module.exports = (req, res) => {
  Company.createCompany(req.body, (err, company) => {
    if (err) {
      req.session.error = err;
      return res.redirect('/auth/register');
    }

    req.session.company = company;
    return res.redirect('/');
  });
} 
