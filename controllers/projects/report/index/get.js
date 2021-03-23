// Get project results index page

const Project = require('../../../../models/project/Project');
const Submition = require('../../../../models/submition/Submition');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Submition.getNumberOfApprovedSubmitions(req.query, (err, number) => {
    if (err) return res.redirect('/');

    if (number > 0) {
      Submition.findSubmitionsCumulativeData(req.query, (err, questions) => {
        if (err) return res.redirect('/');
    
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
                  js: ['page', 'headerListeners']
                }
              },
              company: req.session.company,
              project,
              questions,
              targets
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
                js: ['page']
              }
            },
            company: req.session.company,
            project,
            targets
          });
        });
      });
    }
  });
}
