// Get /templates page with the templates matching company's country
// Id required on the query

const Country = require('../../../models/country/Country');
const Project = require('../../../models/project/Project');
const Template = require('../../../models/template/Template');

module.exports = (req, res) => {
  const company = req.session.company;

  Project.findOneByFields({
    _id: req.query.id,
    creator: req.session.company._id
  }, {}, (err, project) => {
    if (err) return res.redirect('/');

    if (project.status != 'template')
      return res.redirect('/');

    Template.getTemplatesGroupedByTitle({
      country: company.country
    }, (err, templates) => {
      if (err) return res.redirect('/');

      Country.getAllCountries((err, countries) => {
        if (err) return res.redirect('/');

        return res.render('templates/index', {
          page: 'templates/index',
          title: 'Templates',
          includes: {
            external: {
              css: ['page', 'general', 'header', 'confirm', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
              js: ['page', 'inputListeners', 'confirm', 'serverRequest', 'headerListeners']
            }
          },
          company,
          project,
          templates,
          countries
        });
      });
    });
  });
}
