const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const filterArrayToObject = require('./functions/filterArrayToObject');
const filterObjectToArray = require('./functions/filterObjectToArray');
const filtersArrayToSearchQuery = require('./functions/filtersArrayToSearchQuery');
const getTarget = require('./functions/getTarget');

const Company = require('../company/Company');
const Country = require('../country/Country');
const Project = require('../project/Project');
const TargetUserList = require('../target_user_list/TargetUserList');
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
  approved_submition_count: {
    // The number of approved Submitions under this Target
    type: Number,
    default: 0
  },
  price: {
    // The price that will be paid to each user
    type: Number,
    default: null
  },
  last_update: {
    type: Number,
    default: 0
  }
});

TargetSchema.statics.createTarget = function (data, callback) {
  // Creates a new target document and returns it or an error if there is an error

  if (!data || !data.project_id || !validator.isMongoId(data.project_id.toString()) || !data.country || !data.country.length || !data.name || !data.name.length || !data.description || !data.description.length)
    return callback('bad_request');

  const Target = this;

  Country.getCountryWithAlpha2Code(data.country, (err, country) => {
    if (err) return callback(err);

    const newTargetData = {
      project_id: data.project_id.toString(),
      name: data.name,
      description: data.description,
      country: country.alpha2_code
    };
  
    const newTarget = new Target(newTargetData);
  
    newTarget.save((err, target) => {
      if (err) return callback('bad_request');
  
      getTarget(target, {}, (err, target) => {
        if (err) return callback(err);
  
        return callback(null, target);
      });
    });
  });
};

TargetSchema.statics.findTargetById = function (id, callback) {
  // Find and return the Target with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err || !target) return callback('document_not_found');

    getTarget(target, {}, (err, target) => {
      if (err) return callback(err);

      return callback(null, target);
    });
  });
};

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
};

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
};

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
};

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
};

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
};

TargetSchema.statics.changeSubmitionLimit = function (id, data, callback) {
  // Changes the submition limit of the target with the given id using the limit key in data variable, returns an error if it exists
  // The given submition limit must be able to paid by given Company's credits. 
  
  if (!id || !validator.isMongoId(id.toString()) || !data || !Number.isInteger(data.limit))
    return callback('bad_request');

  if (data.limit > 1000) // The submition limit max be 1000
    return callback('bad_request');
  
  const Target = this;

  Target.findById(mongoose.Types.ObjectId(id.toString()), (err, target) => {
    if (err || !target) return callback('document_not_found');

    if (target.approved_submition_count > 9999)
      return callback('bad_request');

    Project.findProjectById(target.project_id, (err, project) => {
      if (err) return callback(err);

      Company.findCompanyById(project.creator, (err, company) => {
        if (err) return callback(err);

        Country.getCountryWithAlpha2Code(target.country, (err, country) => {
          if (err) return callback(err);

          let credit = company.credit;

          if (credit < parseInt(country.credit_per_user) * data.limit)
            return callback('request_is_not_payed');

          credit -= parseInt(country.credit_per_user) * data.limit;
          
          Company.updateCredit(project.creator, {
            credit
          }, err => {
            if (err) return callback(err);

            Target.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
              submition_limit: data.limit
            }}, err => {
              if (err) return callback('database_error');

              TargetUserList.updateEachTargetUserListSubmitionLimit(id, data.limit, err => {
                if (err) return callback(err);

                return callback(null);
              });
            });    
          }); 
        });
      });
    });
  });
};

module.exports = mongoose.model('Target', TargetSchema);
