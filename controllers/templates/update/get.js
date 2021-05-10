// Update the Project with the given id using the Template with the given template_id
// XMLHTTP Request

const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.updateByTemplate(req.query, req.session.company._id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
