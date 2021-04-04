const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  order: {
    // The order of the Template, the Templates are ordered by this number while they are send to users
    type: Number,
    required: true
  },
  type: {
    // Type of the template: [survey, web_test, app_test]
    type: String,
    required: true
  },
  paused: {
    // Field showing if the template is paused or not
    type: Boolean,
    default: true
  },
  title: {
    // The title that the template belongs to
    type: String,
    required: true,
    maxlength: 1000
  },
  name: {
    // Name of the template
    type: String,
    required: true,
    maxlength: 1000
  },
  image: {
    // Image of the template
    type: String,
    required: true,
    maxlength: 1000
  },
  description: {
    // Description of the template,
    type: String,
    default: '',
    maxlength: 1000
  },
  questions: {
    // Questions array
    type: Array,
    default: []
  },
  questions_update: {
    // Questions array, save updated field
    type: Array,
    default: []
  },
  welcome_screen: {
    // Content of the welcome_screen
    type: Object,
    default: {
      opening: '',
      details: '',
      image: ''
    }
  },
  welcome_screen_update: {
    // Content of the welcome_screen
    type: Object,
    default: {
      opening: '',
      details: '',
      image: ''
    }
  },
  countries: {
    // An array of the Countries' alpha2_codes that the Template will be used for
    type: Array,
    required: true,
    minlength: 1
  }
});

TemplateSchema.statics.getTemplates = function (filter, callback) {
  // Find and return all templates matching the given filters, or an error it exists
  // Allowed filters: country

  const Template = this;

  const filters = {
    paused: false
  };

  if (filter && filter.country && filter.country.length == 2)
    filters.countries = filter.country;

  Template
    .find(filters)
    .sort({ order: 1 })
    .then(templates => callback(null, templates))
    .catch(err => callback('database_error'));
};

TemplateSchema.statics.getTemplatesGroupedByTitle = function (filter, callback) {
  // Get all the templates with the given filter grouped by their title
  // Return an object where each key is a title and value is an array of templates, or an error if it exists

  const Template = this;

  const filters = {
    paused: false
  };

  if (filter && filter.country && filter.country.length == 2)
    filters.countries = filter.country;

  Template
    .find(filters)
    .sort({ order: 1 })
    .then(templates => {
      const grouped_templates = {};

      async.timesSeries(
        templates.length,
        (time, next) => {
          const template = templates[time];

          if (!grouped_templates[template.title])
            grouped_templates[template.title] = [];

          grouped_templates[template.title].push(template);

          next(null);
        },
        err => {
          if (err) return callback('unknown_error');

          return callback(null, grouped_templates);
        }
      );
    })
    .catch(err => callback('database_error'));
};

TemplateSchema.statics.getTemplateById = function (id, callback) {
  // Find and return the Template with the given id, or an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Template = this;

  Template.findById(mongoose.Types.ObjectId(id.toString()), (err, template) => {
    if (err) return callback('database_error');
    if (!template) return callback('document_not_found');

    return callback(null, template);
  });
};

module.exports = mongoose.model('Template', TemplateSchema);
