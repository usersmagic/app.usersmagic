// Get /admin/companies

const Company = require('../../../../models/company/Company');

module.exports = (req, res) => {
  Company.getAllCompanies(req.query, (err, response) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/companies/index', {
      page: 'admin/companies/index',
      title: 'Kayıtlı Şirketler',
      includes: {
        external: {
          css: ['page', 'admin', 'general']
        }
      },
      companies: response.companies,
      data: response.data
    });
  })
}
