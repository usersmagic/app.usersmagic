const Project = require('../../../../models/project/Project');

module.exports = (req,res) => {
  Project.checkForChanges(req.query ? req.query.id : null, (project, err) => {
    if(err){
      res.write(JSON.stringify({ error: err, success: false}));
      return res.end();
    }
    res.write(JSON.stringify({edited: project.edited}));
    return res.end();
  });
}
