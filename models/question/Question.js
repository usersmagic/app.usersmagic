const mongoose = require('mongoose');
const validator = require('validator');

const getFilters = require('./functions/getFilters');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  name: {
    // Name of the questions, visible to admin and companies
    type: String,
    required: true
  },
  description: {
    // Description of the question, visible to admin
    type: String,
    required: true
  },
  text: {
    // The question text
    type: String,
    required: true
  },
  type: {
    // Type of the question: [short_text, long_text, checked, radio, range]
    type: String,
    required: true
  },
  answer_length: {
    // The allowed answer length for the question, used in short_text and long_text
    type: Number,
    default: 1000
  },
  choices: {
    // An array of strings, showing the choices for checked and radio types
    type: Array,
    default: null
  },
  other_option: {
    // A boolean value showing if other option is open for this checked/radio question
    type: Boolean,
    default: false
  },
  min_value: {
    // Min value of range question
    type: Number,
    default: 0
  },
  max_value: {
    // Max value of range question
    type: Number,
    default: 10
  },
  min_explanation: {
    // Min value explanation for range question
    type: String,
    default: ''
  },
  max_explanation: {
    // Max value explanation for range question
    type: String,
    default: ''
  },
  countries: {
    // Countries that the question can be used to filter
    // Different than the countries of the Campaign, this is only important for company side
    type: Array,
    default: ['tr']
  }
});

QuestionSchema.statics.getFiltersByCountry = function (country, callback) {
  // Finds an returns questions that can be used as a filter by country

  if (!country)
    return callback('bad_request');

  const Question = this;
  const filterTypes = ['radio', 'checked', 'range']; // List of types that can be filtered

  Question.find({
    countries: country,
    type: {$in: filterTypes}
  }, (err, questions) => {
    if (err) return callback(err);

    getFilters(questions, (err, filters) => {
      if (err) return callback(err);

      return callback(null, filters);
    });
  });
}

QuestionSchema.statics.checkIfFilterIsValid = function (filter, callback) {
  // Finds the filter with the given id, checks if its value valid
  // Returns true or false in the callback, showing it is valid or not

  if (!filter) return callback(false);

  const key = Object.keys(filter)[0];
  const value = Object.values(filter)[0];

  if (!key || !key.length || !validator.isMongoId(key) || !value || !Array.isArray(value) || value.length)
    return callback(false);

  const Question = this;

  Question.findById(mongoose.Types.ObjectId(key), (err, question) => {
    if (err || !question) return callback(false);

    if (question.type == 'range') {
      async.timesSeries(
        value.length,
        (time, next) => {
          if (!Number.isInteger(value[time]))
            return next(true);

          if (parseInt(value[time]) < question.min_value || parseInt(value[time]) > question.max_value)
            return next(true);

          return next(false);
        },
        err => {
          if (err) return callback(false);

          return callback(true);
        }
      );
    } else {
      async.timesSeries(
        value.length,
        (time, next) => next(!question.choices.includes(value[time])),
        err => {
          if (err) return callback(false);

          return callback(true);
        }
      );
    }
  });
}

module.exports = mongoose.model('Question', QuestionSchema);
