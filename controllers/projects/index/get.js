// Get projects index page

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findByFields({
    creator: req.session.creator._id
  }, {}, (err, projects) => {
    if (err) return res.redirect('/');

    return res.render('projects/index', {
      page: 'projects/index',
      title: 'Projects',
      includes: {
        external: {
          css: ['page', 'fontawesome'],
          js: ['page']
        }
      },
      projects
    });
  });
}
