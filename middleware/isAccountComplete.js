// Check if the account logged in in the session is complete or not, redirect to /settings if it is not complete

const Company = require('../models/company/Company');

module.exports = (req, res, next) => {
  Company.isCompanyDataComplete(req.session.company._id, result => {
    if (!result) return res.redirect('/settings');

    return next();
  });
}
