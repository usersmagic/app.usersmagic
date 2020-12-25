const mongoose = require('mongoose');

const Company = require('../models/company/Company');

module.exports = (req, res, next) => {
  if (req.session && req.session.company) {
    Company.findById(mongoose.Types.ObjectId(req.session.company._id), (err, company) => {
      if (err || !company) return res.status(401).redirect('/auth/login');;
      
      req.session.company = company;
      return next();
    });
  } else {
    req.session.redirect = req.originalUrl;
    return res.status(401).redirect('/auth/login');
  };
};
