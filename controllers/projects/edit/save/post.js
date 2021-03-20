//Update edited project information
//XMLHTTP request

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.updateEditedProject(req.query ? req.query.id : null, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    Project.saveEditedQuestions(req.query ? req.query.id : null, req.body, err => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      res.write(JSON.stringify({ success: true }));
      return res.end();
    });
  });
}
