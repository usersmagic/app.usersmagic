// Get /auth/register page with the countries list

const Country = require('../../../models/country/Country');

module.exports = (req, res) => {
  let error = null;
  if (req.session && req.session.error) {
    error = req.session.error;
    req.session.destroy();
  }
  
  return res.render('auth/register', {
    page: 'auth/register',
    title: 'Sign Up',
    includes: {
      external: {
        css: ['page', 'general', 'logo', 'inputs', 'buttons', 'fontawesome'],
        js: ['page']
      }
    },
    error
  });
}
