const mongoose = require('mongoose');

const Company = require('../models/company/Company');

module.exports = (req, res, next) => {
  if (req.session && req.session.company) {
    Company.findCompanyById(req.session.company._id, (err, company) => {
      if (err || !company) return res.status(401).redirect('/auth/login');;
      
      req.session.company = company;
      return next();
    });
  } else {
    if (req.file && req.file.filename) { // If already a file is uploaded on the server
      fs.unlink('./public/res/uploads/' + req.file.file_name, () => {	
        req.session.redirect = req.originalUrl;
        return res.status(401).redirect('/auth/login');
      });
    } else {
      req.session.redirect = req.originalUrl;
      return res.status(401).redirect('/auth/login');
    }
  };
};
