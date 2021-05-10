// Get all filters of the given Project

const Country = require('../../../../models/country/Country');
const Project = require('../../../../models/project/Project');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Target.findByProjectId(req.query.id, {
    timezone: req.session.company.timezone
  }, (err, targets) => {
    if (err) return res.redirect('/projects');

    Country.getCountries((err, countries) => {
      if (err) return res.redirect('/project');

      Project.findOneByFields({
        _id: req.query.id,
        creator: req.session.company._id
      }, {
        timezone: req.session.company.timezone
      }, (err, project) => {
        if (err) return res.redirect('/projects');
  
        return res.render('projects/filters/index', {
          page: 'projects/filters/index',
          title: project.name,
          includes: {
            external: {
              css: ['page', 'general', 'confirm', 'header', 'contentHeader', 'logo', 'inputs', 'buttons', 'fontawesome'],
              js: ['page', 'confirm', 'headerListeners', 'inputListeners']
            }
          },
          company: req.session.company,
          targets,
          project,
          countries
        });
      });
    });
  });
}
