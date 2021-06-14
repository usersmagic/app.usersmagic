// Create a new Company and CompanyUser with the given data
// XMLHTTP Request

const Company = require('../../../models/company/Company');
const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  Company.createCompany(req.body, (err, company_id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    req.body.company_id = company_id;
    req.body.completed = true; // Admin account is completed

    CompanyUser.createCompanyUser(req.body, (err, company_user_id) => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      CompanyUser.findCompanyUserById(company_user_id, (err, company_user) => {
        if (err) {
          res.write(JSON.stringify({ error: err, success: false }));
          return res.end();
        }

        req.session.user = company_user;

        res.write(JSON.stringify({ success: true }));
        return res.end();
      });
    });
  });
} 
