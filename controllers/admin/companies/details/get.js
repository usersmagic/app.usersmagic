// Get /admin/companies/details page

const Company = require('../../../../models/company/Company');
const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Company.findCompanyById(req.query ? req.query.id : null, (err, company) => {
    if (err || !company)
      return res.redirect('/admin');

    Project.findByFields({
      creator: company._id
    }, {}, (err, projects) => {
      if (err) return res.redirect('/admin');

      return res.render('admin/companies/details', {
        page: 'admin/companies/details',
        title: company.company_name || '-',
        includes: {
          external: {
            css: ['page', 'admin', 'general']
          }
        },
        company,
        projects
      });
    });
  });
}
