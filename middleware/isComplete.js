// Check if the session account is complete, redirect to /auth/complete if not

const CompanyUser = require('../models/company_user/CompanyUser');

module.exports = (req, res, next) => {
  CompanyUser.findCompanyUserById(req.session.user._id, (err, company_user) => {
    if (err) return res.redirect('/auth/login');

    if (!company_user.completed)
      return res.redirect('/auth/complete')
    
    return next(); 
  });
}
