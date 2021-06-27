const mongoose = require('mongoose');
const validator = require('validator');

const Country = require('../country/Country');
const User = require('../user/User');

const getCompany = require('./functions/getCompany');

const Schema = mongoose.Schema;

const random_color_values = ['rgb(3, 17, 73)', 'rgb(254, 211, 85)', 'rgb(46, 197, 206)', 'rgb(241, 120, 182)', 'rgb(120, 121, 241)'];

const CompanySchema = new Schema({
  country: {
    // Alpha 2 country code of the Company
    type: String,
    default: null,
    length: 2
  },
  name: {
    // Name of the account Company
    type: String,
    default: null,
    maxlenght: 1000,
    minlength: 1
  },
  phone_number: {
    // Phone number of the Company
    type: String,
    required: true,
    unique: true
  },
  profile_photo: {
    // Profile photo of Company
    type: String,
    default: '/res/images/default/company.png'
  },
  teams: {
    // An array of teams under Company, { name: String, color: String }
    type: Array,
    default: [],
    maxlength: 1000
  },
  credit: {
    // Credit of the Company account. Stripe payment
    type: Number,
    default: 0
  },
  plan: {
    // The payment plan of the Company. Allowed values: [free, basic, professional, enterprise]
    type: String,
    default: 'free'
  }
});

CompanySchema.statics.findCompanyById = function (id, callback) {
  // Finds and returns the Company with the given id, or an error if it exists
  // Format Company using getCompany

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');

    getCompany(company, (err, company) => {
      if (err) return callback(err);

      return callback(null, company);
    });
  })
};

CompanySchema.statics.createCompany = function (data, callback) {
  // Create a new Company using data. Use admin_id to pull values. Not provided, create as a new admin
  // Return its id, or an error if it exists

  if (!data || !data.country || !data.company_name || !data.phone_number || typeof data.phone_number != 'string')
    return callback('bad_request');

  data.phone_number = data.phone_number.trim().split(' ').join(''); // Format phone number

  if (!validator.isMobilePhone(data.phone_number))
    return callback('bad_request');

  const Company = this;

  Country.getCountryWithAlpha2Code(data.country, (err, country) => {
    if (err || !country) return callback('bad_request');

    const newCompanyData = {
      country: data.country,
      name: data.company_name.trim(),
      phone_number: data.phone_number.trim()
    };

    const newCompany = new Company(newCompanyData);

    newCompany.save((err, company) => {
      if (err && err.code == 11000) return callback('duplicated_unique_field');
      if (err) return callback('database_error');

      return callback(null, company._id.toString());
    });
  });
};

CompanySchema.statics.pushTeamUnderCompany = function (id, team, callback) {
  // Push the given team ({ name, color }) under Company with given id
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !team || !team._id || !team.name || typeof team.name != 'string' || !team.color || !random_color_values.includes(team.color))
    return callback('bad_request');

  team.name = team.name.trim();

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');
    if (company.teams.find(each => each.name == team.name || each._id == team._id))
      return callback('duplicated_unique_field');

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$push: {
      teams: {
        _id: team._id,
        name: team.name,
        color: team.color
      }
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

CompanySchema.statics.checkIfGivenTeamIsUnderCompany = function (id, team, callback) {
  // Check if the given team is under the Company with the given id
  // Return true or false, the team does or does not exist, respectively

  if (!id || !validator.isMongoId(id.toString()) || !team || typeof team != 'string')
    return callback(false);

  team = team.trim();

  const Company = this;

  Company.findCompanyById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback(false);

    if (company.teams.find(each => each.name == team))
      return callback(true);

    return callback(false);
  });
};

CompanySchema.statics.pullTeam = function (id, team, callback) {
  // Pop the given team from the Company with the given id
  // Return an error if it exists

  if (!id || !team || typeof team != 'string')
    return callback('bad_request');

  team = team.trim();

  const Company = this;

  Company.findCompanyById(id, (err, company) => {
    if (err || !company) return callback('document_not_found');

    if (!company.teams.find(each => each.name == team))
      return callback('document_not_found');

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$pull: {
      "teams.name": team
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

CompanySchema.statics.updateCompany = function (id, data, callback) {
  // Update name of the given Company
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data)
    return callback('bad_request');

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');

    Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      name: (data.name && data.name.length ? data.name : company.name),
      profile_photo: (typeof data.profile_photo == 'string' ? (data.profile_photo.length ? data.profile_photo : '/res/images/default/company.png') : company.profile_photo) // Use to delete and upload photo, empty string deletes
    }}, err => {
      if (err) return callback('database_error');
  
      return callback(null);
    });
  });
};

module.exports = mongoose.model('Company', CompanySchema);
