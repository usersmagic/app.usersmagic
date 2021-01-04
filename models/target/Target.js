const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getFilters = require('./functions/getFilters');
const getTarget = require('./functions/getTarget');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  status: {
    // The status of the Project: [saved, finished]
    type: String,
    default: 'saved'
  },
  created_at: {
    // UNIX date for the creation time of the object
    type: Date,
    default: Date.now()
  },
  name: {
    // Name of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the Target group
    type: String,
    required: true,
    maxlength: 1000
  },
  country: {
    // The country of the testers
    type: String,
    required: true,
    length: 2
  },
  filter: {
    // The filters that are used to find testers
    type: Array,
    required: true
  },
  submition_limit: {
    // The number of submitions that are allowed, if it is 0 no new user can join the project
    // Starts from 0, when the company tries to send the target to new users it increases
    type: Number,
    default: 0
  },
  users_list: {
    // List of ids from User model. The users in this list can join this target group
    type: Array,
    default: []
  },
  joined_users_list: {
    // List of ids from User model. The users in this list have already joined the project, they cannot join one more time
    type: Array,
    default: []
  }
});

TargetSchema.statics.createTarget = function (data, callback) {
  // Creates a new target document and returns it or an error if there is an error

  if (!data || !data.project_id || !validator.isMongoId(data.project_id.toString()) || !data.country || !data.country.length || !data.name || !data.name.length || !data.description || !data.description.length)
    return callback('bad_request');

  const Target = this;

  const newTargetData = {
    project_id: data.project_id.toString(),
    name: data.name,
    description: data.description,
    country: data.country
  };

  const newTarget = new Target(newTargetData);

  newTarget.save((err, target) => {
    if (err) return callback('bad_request');

    getTarget(target, {}, (err, target) => {
      if (err) return callback(err);

      return callback(null, target);
    });
  });
}

TargetSchema.statics.findByProjectId = function (project_id, callback) {
  // Finds and returns the Target documents with the given project_id, sorted by the created_at field decreasing order

  if (!project_id || !validator.isMongoId(project_id.toString()))
    return callback('bad_request');

  const Target = this;

  Target
    .find({ project_id: project_id.toString() })
    .sort({ created_at: -1 })
    .then(targets => {
      async.timesSeries(
        targets.length,
        (time, next) => getTarget(targets[time], {}, (err, target) => next(err, target)),
        (err, targets) => {
          if (err) return callback(err);

          return callback(null, targets);
        }
      );
    })
    .catch(err => {
      console.log(err);
      return callback('bad_request');
    });
}

TargetSchema.statics.findOneByFields = function (fields, options, callback) {
  // Returns a target with given fields or an error if it exists.
  // Returns error if '_id' or 'project_id' field is not a mongodb object id

  const Target = this;

  const fieldKeys = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'project_id') {
      if (!fieldValues[iterator] || !validator.isMongoId(fieldValues[iterator].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fieldValues[iterator].toString())});
    } else {
      filters.push({[key]: fieldValues[iterator]});
    }
  });

  Target.findOne({$and: filters}, (err, target) => {
    if (err) return callback(err);

    getTarget(target, options, (err, target) => {
      if (err) return callback(err);

      return callback(null, target)
    });
  });
}

TargetSchema.statics.changeSubmitionLimit = function (data, callback) {
  
}

module.exports = mongoose.model('Target', TargetSchema);
