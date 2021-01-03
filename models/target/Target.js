const mongoose = require('mongoose');
const validator = require('validator');

const getFilters = require('./functions/getFilters');

const Schema = mongoose.Schema;

const TargetSchema = new Schema({
  project_id: {
    // The id of the Project the Target is created for
    type: String,
    required: true
  },
  country: {
    // The country of the testers
    type: String,
    required: true
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

  if (!data || !data.project_id || !validator.isMongoId(data.project_id.toString()) || !data.country)
    return callback('bad_request')
}

TargetSchema.statics.changeSubmitionLimit = function (data, callback) {
  
}

module.exports = mongoose.model('Target', TargetSchema);
