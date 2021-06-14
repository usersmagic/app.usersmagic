// Get /auth/register page with the countries list

const Country = require('../../../models/country/Country');
const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    CompanyUser.getCompanyRoles(company_roles => {
      return res.render('auth/register', {
        page: 'auth/register',
        title: res.__('Sign Up'),
        includes: {
          external: {
            css: ['page', 'general', 'logo', 'inputs', 'buttons', 'fontawesome'],
            js: ['page', 'serverRequest', 'inputListeners']
          }
        },
        countries,
        company_roles
      });
    });
  });
}
