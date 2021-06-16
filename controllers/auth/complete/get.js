// Get /auth/complete page
// Use this page to complete CompanyUser documents who are newly invited to an existing company

const CompanyUser = require('../../../models/company_user/CompanyUser');

module.exports = (req, res) => {
  if (req.session.user.completed)
    return res.redirect('/'); // Do not allow completed users to revisit this page

  CompanyUser.getCompanyRoles(company_roles => {
    return res.render('auth/complete', {
      page: 'auth/complete',
      title: res.__('Complete Your Account'),
      includes: {
        external: {
          css: ['page', 'general', 'logo', 'inputs', 'buttons', 'fontawesome'],
          js: ['page', 'serverRequest', 'inputListeners']
        }
      },
      company_roles,
      user: req.session.user
    });
  });
}
