//Undo changes in the project with the specified id on query
//update back_up and original fields in the database

const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.undoChanges( req.query ? req.query.id : null, err => {
    if(err){
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }// Return error and success: false if there is an error

    res.write(JSON.stringify({ success: true}));
    return res.end();
  })
}
