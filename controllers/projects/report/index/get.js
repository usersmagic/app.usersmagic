// Get project results index page

const Project = require('../../../../models/project/Project');
const Submition = require('../../../../models/submition/Submition');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Submition.getNumberOfApprovedSubmitions(req.query, (err, number) => {
    if (err) return res.redirect('/');

    if (number > 0) {
      Submition.findSubmitionsCumulativeData(req.query, req.body, (err, questions) => {
        if (err) return res.redirect('/');

        Project.findOneByFields({
          _id: req.query.id,
          creator: req.session.company._id
        }, {}, (err, project) => {
          if (err) return res.redirect('/');

          Target.findByFields({
            project_id: req.query.id
          }, {}, (err, targets) => {
            if (err) return res.redirect('/');

            return res.render('projects/report/index', {
              page: 'projects/report/index',
              title: 'Results',
              includes: {
                external: {
                  css: ['page', 'general', 'header', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
                  js: ['page', 'headerListeners', 'serverRequest']
                }
              },
              company: req.session.company,
              project,
              questions,
              targets,
              target_id: req.query.target_id || null,
              filters: req.query.filters ? req.query.filters : [""]
            });
          });
        });
      });
    } else {
      Project.findOneByFields({
        _id: req.query.id
      }, {}, (err, project) => {
        if (err) return res.redirect('/');

        Target.findByFields({
          project_id: req.query.id
        }, {}, (err, targets) => {
          if (err) return res.redirect('/');

          return res.render('projects/report/index', {
            page: 'projects/report/index',
            title: 'Results',
            includes: {
              external: {
                css: ['page', 'general', 'header', 'contentHeader', 'logo', 'buttons', 'inputs', 'fontawesome'],
                js: ['page', 'headerListeners', 'serverRequest']
              }
            },
            company: req.session.company,
            project,
            targets,
            target_id: req.query.target_id || null
          });
        });
      });
    }
  });
}
