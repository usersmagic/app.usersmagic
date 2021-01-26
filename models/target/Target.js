const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const filterArrayToObject = require('./functions/filterArrayToObject');
const filterObjectToArray = require('./functions/filterObjectToArray');
const filtersArrayToSearchQuery = require('./functions/filtersArrayToSearchQuery');
const getTarget = require('./functions/getTarget');

const User = require('../user/User');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  status: {
    // The status of the Project: [saved, waiting, approved, rejected]
    type: String,
    default: 'saved'
  },
  error: {
    // Error about the target, if there is any
    type: String,
    default: null,
    maxlength: 1000
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
  filters: {
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

TargetSchema.statics.findByProjectId = function (project_id, options, callback) {
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
        (time, next) => getTarget(targets[time], options, (err, target) => next(err, target)),
        (err, targets) => {
          if (err) return callback(err);

          return callback(null, targets);
        }
      );
    })
    .catch(err => {
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

    filterArrayToObject(target.filters, (err, filters) => {
      if (err) return callback(err);

      options.filters = filters;
      
      getTarget(target, options, (err, target) => {
        if (err) return callback(err);
  
        return callback(null, target)
      });
    });
  });
}

TargetSchema.statics.findByFields = function (fields, options, callback) {
  // Returns a target with given fields or an error if it exists.
  // Returns error if '_id' or 'project_id' field is not a mongodb object id

  const Target = this;

  const fieldKeys = Object.keys(fields);

  if (!fieldKeys.length)
    return callback('bad_request');

  const filters = [];

  fieldKeys.forEach((key, iterator) => {
    if (key == '_id' || key == 'project_id') {
      if (!fields[key] || !validator.isMongoId(fields[key].toString()))
        return callback('bad_request');

      filters.push({[key]: mongoose.Types.ObjectId(fields[key].toString())});
    } else {
      filters.push({[key]: fields[key]});
    }
  });

  Target.find({$and: filters}, (err, targets) => {
    if (err) return callback(err);

    async.times(
      targets.length,
      (time, next) => {
        const target = targets[time];

        filterArrayToObject(target.filters, (err, filters) => {
          if (err) return next(err);
    
          options.filters = filters;
          
          getTarget(target, options, (err, target) => {
            if (err) return next(err);
      
            return next(null, target)
          });
        });
      },
      (err, targets) => callback(err, targets)
    );
  });
}

TargetSchema.statics.saveFilters = function (id, data, callback) {
  // Save the given filters on the Target with the given id, returns an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  filterObjectToArray(data.filters, (err, filters) => {
    if (err) return callback(err);
  
    Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      filters
    }}, err => {
      if (err) return callback(err);

      return callback(null);
    });
  });
}

TargetSchema.statics.finishTarget = function (id, callback) {
  // Find and check the target with the given id, if there is no error change its status to finished

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err) return callback(err);

    if (!target.name || !target.name.length || !target.description || !target.description.length)
      return callback('bad_request');

    Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      status: 'waiting'
    }}, err => {
      if (err) return callback(err);
  
      return callback(null);
    });
  });
}

TargetSchema.statics.changeSubmitionLimit = function (id, data, callback) {
  // Changes the submition limit of the target with the given id using the limit key in data variable, returns an error if it exists
  
  if (!id || !validator.isMongoId(id) || !data || !Number.isInteger(data.limit) || data.limit > 10)
    return callback('bad_request');

  const Target = this;

  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
    submition_limit: data.limit
  }}, err => callback(err));
}

TargetSchema.statics.updateTargetStatus = function (id, data, callback) {
  // Gets an id and updates status of the document with the given id. Returns the target or an error if it exists

  if (!id || !validator.isMongoId(id) || !data)
    return callback('bad_request');

  const Target = this;

  if (!data.approved && !data.reject_message)
    return callback('bad_request');
  
  Target.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: {
    status: data.approved ? 'approved' : 'rejected',
    error: data.approved ? null : data.reject_message
  }}, {new: true}, (err, target) => {
    if (err) return callback(err);

    getTarget(target, {}, (err, target) => {
      if (err) return callback(err);

      return callback(null, target);
    });
  });
}

TargetSchema.statics.updateTargetsUsersList = function (callback) {
  // Finds all the targets that's status is approved, updates their users_list

  const Target = this;

  Target.find({
    status: 'approved',
    submition_limit: {$gt: 0}
  }, (err, targets) => {
    if (err) return callback(err);

    async.timesSeries(
      targets.length,
      (time, next) => {
        const target = targets[time];

        filtersArrayToSearchQuery(target.filters, (err, filters) => {
          if (err) return next(err);

          User.getUsersByFilters(filters, (err, users) => {
            if (err) return next(err);

            Target.findByIdAndUpdate(mongoose.Types.ObjectId(target._id), {$set: {
              users_list: target.users_list.concat(users)
            }}, {}, err => next(err));
          });
        });
      },
      err => {
        if (err) return callback(err);

        return callback(null);
      }
    );
  });
}

module.exports = mongoose.model('Target', TargetSchema);
