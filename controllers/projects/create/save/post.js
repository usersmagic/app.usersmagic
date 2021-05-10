// Update project information
// XMLHTTP request

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.updateProject(req.query.id, req.session.company._id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    Project.saveQuestions(req.query.id, req.session.company._id, req.body, err => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      res.write(JSON.stringify({ success: true }));
      return res.end();
    });
  });
}
