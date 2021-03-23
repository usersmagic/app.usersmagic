// Get projects index page

const Country = require('../../../models/country/Country');
const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findByFields({
    creator: req.session.company._id
  }, {
    timezone: req.session.company.timezone
  }, (err, projects) => {
    if (err) return res.redirect('/auth/login');

    Country.getCountries((err, countries) => {
      if (err) return res.redirect('/');

      return res.render('projects/index/index', {
        page: 'projects/index/index',
        title: 'Projects',
        includes: {
          external: {
            css: ['page', 'general', 'header', 'confirm', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
            js: ['page', 'inputListeners', 'confirm', 'headerListeners']
          }
        },
        projects,
        countries,
        company: req.session.company
      });
    });
  });
}
