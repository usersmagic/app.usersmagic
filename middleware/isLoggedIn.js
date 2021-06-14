// Check if there is an account information on session, redirect to /auth/login if the request is not logged in

const CompanyUser = require('../models/company_user/CompanyUser');

module.exports = (req, res, next) => {
  if (req.session && req.session.user) { // If logged in
    CompanyUser.findCompanyUserById(req.session.user._id, (err, company_user) => {
      if (err || !company_user) return res.status(401).redirect('/auth/login');;
      
      req.session.user = company_user; // Update session
      return next();
    });
  } else {
    if (req.file && req.file.filename) { // If already a file is uploaded on the server
      fs.unlink('./public/res/uploads/' + req.file.file_name, () => {	 // Delete the file, as it is not authenticated
        req.session.redirect = req.originalUrl; // Save redirection url 
        return res.status(401).redirect('/auth/login');
      });
    } else {
      req.session.redirect = req.originalUrl; // Save redirection url
      return res.status(401).redirect('/auth/login');
    }
  };
};
