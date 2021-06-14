// Get /settings page

const Country = require('../../../models/country/Country');
const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  Country.getCountries((err, countries) => {
    if (err) return res.redirect('/');

    CompanyUser.getCompanyRoles(company_roles => {
      return res.render('settings/index', {
        page: 'settings/index',
        title: res.__('Settings'),
        includes: {
          external: {
            css: ['page', 'general', 'confirm', 'navbar', 'logo', 'buttons', 'inputs', 'fontawesome'],
            js: ['page', 'inputListeners', 'confirmFunction', 'serverRequests', 'serverRequest', 'headerListeners']
          }
        },
        user: req.session.user,
        countries,
        company_roles,
        selected_page: 'settings'
      });
    });
  });
}
