const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const getCompany = require('./functions/getCompany');
const hashPassword = require('./functions/hashPassword');
const verifyNewCompanyData = require('./functions/verifyNewCompanyData');
const verifyPassword = require('./functions/verifyPassword');

const Country = require('../country/Country');

const CompanySchema = new Schema({
  email: {
    // The email of the account
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // The password, saved hashed
    type: String,
    required: true,
    minlength: 6
  },
  country: {
    // Alpha 2 country code of the company
    type: String,
    default: null,
    length: 2
  },
  company_name: {
    // Name of the account company
    type: String,
    default: null,
    maxlenght: 1000
  },
  phone_number: {
    // Phone number of the company
    type: String,
    default: null
  },
  profile_photo: {
    // Profile photo of company
    type: String,
    default: '/res/images/default/company.png'
  },
  account_holder_name: {
    // Name of the account holder
    type: String,
    default: null,
    maxlenght: 1000
  },
  timezone: {
    // Timezone of the account
    type: String,
    default: null
  }
});

CompanySchema.pre('save', hashPassword);

CompanySchema.statics.findCompanyById = function (id, callback) {
  // Finds and returns the document with the given id, or an error if it exists

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
}

CompanySchema.statics.createCompany = function (data, callback) {
  const Company = this;

  verifyNewCompanyData(data, (err, newCompanyData) => {
    if (err) return callback(err);

    const newCompany = new Company(newCompanyData);

    newCompany.save((err, company) => {
      if (err && err.code == 11000) return callback('email_duplication');
      if (err) return callback('unknown_error');

      getCompany(company, (err, company) => {
        if (err) return callback(err);

        callback(null, company);
      });
    });
  });
}

CompanySchema.statics.updateCompany = function (id, data, callback) {
  // Updates the data of the document with the given id. If data does not include a field, the field is returned to its default value
  // Returns an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !data)
    return callback('bad_request');

  if (data.phone_number && data.phone_number.length && !validator.isMobilePhone(data.phone_number))
    return callback('phone_validation');

  if (data.timezone && data.timezone.length && !Country.isTimezoneExists(data.timezone))
    return callback('timezone_validation');

  const Company = this;

  if (data.country && data.country.length) {
    Country.getCountryWithAlphe2Code(data.country, (err, country) => {
      if (err || !country) return callback('bad_request');

      Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
        country: data.country,
        company_name: data.company_name && data.company_name.length ? data.company_name : null,
        phone_number: data.phone_number && data.phone_number.length ? data.phone_number : null,
        account_holder_name: data.account_holder_name && data.account_holder_name.length ? data.account_holder_name : null,
        timezone: data.timezone && data.timezone.length ? data.timezone : null,
        profile_photo: data.profile_photo && data.profile_photo.length ? data.profile_photo : '/res/images/default/company.png'
      }}, (err, company) => {
        if (err) return callback(err);
        if (!company) return callback('document_not_found');
  
        return callback(null);
      });
    });
  } else {
    Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      company_name: data.company_name && data.company_name.length ? data.company_name : null,
      phone_number: data.phone_number && data.phone_number.length ? data.phone_number : null,
      account_holder_name: data.account_holder_name && data.account_holder_name.length ? data.account_holder_name : null,
      timezone: data.timezone && data.timezone.length ? data.timezone : null,
      profile_photo: data.profile_photo && data.profile_photo.length ? data.profile_photo : '/res/images/default/company.png'
    }}, (err, company) => {
      if (err) return callback(err);
      if (!company) return callback('document_not_found');

      return callback(null);
    });
  }

  Company.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
    country: data.country && data.country.length == 2
  }})
}

CompanySchema.statics.isCompanyDataComplete = function (id, callback) {
  // Finds the document with the given id and checks if its status is 'complete': its country and company_name fields are complete
  // Returns a boolean field showing success

  if (!id || !validator.isMongoId(id.toString()))
    return callback(false);

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company)
      return callback(false);

    if (!company.company_name || !company.company_name.length || !company.country || !company.country.length)
      return callback(false);

    return true;
  });
}

CompanySchema.statics.findCompany = function (data, callback) {
  if (!data || !data.email || !data.password)
    return callback('bad_request')

  const Company = this;

  Company.findOne({
    email: data.email.trim()
  }, (err, company) => {
    if (err || !company) return callback('document_not_found');

    verifyPassword(data.password, company.password, res => {
      if (!res) return callback('password_verification');

      getCompany(company, (err, company) => {
        if (err) return callback(err);

        callback(null, company);
      });
    });
  });
};

CompanySchema.statics.changePassword = function (id, data, callback) {
  // Takes a user id, old password and a new password. Changes the document's password with the given id to the new password
  // Returns an error if it exists

  if (!data || !id|| !validator.isMongoId(id.toString()) || !data.old_password || !data.new_password || data.new_password.length < 6)
    return callback('bad_request')

  const Company = this;

  Company.findById(mongoose.Types.ObjectId(id.toString()), (err, company) => {
    if (err || !company) return callback('document_not_found');

    verifyPassword(data.old_password, company.password, res => {
      if (!res) return callback('password_verification');

      company.password = data.new_password;

      company.save(err => {
        if (err) return callback(err);

        return callback(null)
      });
    });
  });
}

module.exports = mongoose.model('Company', CompanySchema);
