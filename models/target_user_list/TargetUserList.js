const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const TargetUserListSchema = new Schema({
  target_id: {
    // Id of the Target of the parent element
    type: mongoose.Types.ObjectId,
    required: true
  },
  type: {
    // Type of the user list. Allowed values: answered, valid
    type: String,
    required: true
  },
  user_list: {
    // List of ids of users belonging to this target under the type
    type: Array,
    default: [],
    maxlength: 1000 // Each document has maximum of 1000 elements
  },
  submition_limit: {
    // Submition limit of the Target. When target changes, update all of its chilren
    type: Number,
    default: 0
  }
});

TargetUserListSchema.statics.updateEachTargetUserListSubmitionLimit = function (target_id, submition_limit, callback) {
  // Find all TargetUserList with the given id, update their submition_limit
  // Return an error if it exists

  if (!target_id || !validator.isMongoId(target_id.toString()) || !Number.isInteger(submition_limit))
    return callback('bad_request');

  const TargetUserList = this;

  TargetUserList
    .find({
      target_id: mongoose.Types.ObjectId(target_id.toString()),
      type: 'valid'
    })
    .then(target_user_lists => {
      async.timesSeries(
        target_user_lists.length,
        (time, next) => {
          TargetUserList.findByIdAndUpdate(mongoose.Types.ObjectId(target_user_lists[time]._id.toString()), {$set: {
            submition_limit
          }}, err => next((err ? 'database_error' : null)));
        },
        err => callback(err)
      );
    })
    .catch(err => callback('database_error'));
};

module.exports = mongoose.model('TargetUserList', TargetUserListSchema);
