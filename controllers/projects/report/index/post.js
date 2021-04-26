// Get project results index page

const Project = require('../../../../models/project/Project');
const Submition = require('../../../../models/submition/Submition');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  Submition.getNumberOfApprovedSubmitions(req.query, (err, number) => {
    if (err) return err;

    if (number > 0) {
      Submition.findSubmitionsCumulativeData(req.query, req.body.filters, (err, questions) => {
        if (err) return res.redirect('/');

        Project.findOneByFields({
          _id: req.query.id
        }, {}, (err, project) => {
          if (err) return res.redirect('/');

          Target.findByFields({
            project_id: req.query.id
          }, {}, (err, targets) => {
            if (err) return res.redirect('/');

            res.write(JSON.stringify({questions, targets}));
            return res.end();
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

          res.write(JSON.stringify({targets}));
          return res.end();
        });
      });
    }
  });
}
