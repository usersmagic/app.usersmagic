const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const getCompany = require('./functions/getCompany');
const hashPassword = require('./functions/hashPassword');
const verifyNewCompanyData = require('./functions/verifyNewCompanyData');
const verifyPassword = require('./functions/verifyPassword');

const CompanySchema = new Schema({
  email: {
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

CompanySchema.pre('save', hashPassword);

CompanySchema.statics.createCompany = function (data, callback) {
  const Company = this;

  verifyNewCompanyData(data, (err, newCompanyData) => {
    if (err) return callback(err);

    const newCompany = new Company(newCompanyData);

    newCompany.save((err, company) => {
      if (err && err.code == 11000) return callback('email_duplication');
      if (err) return callback('unknown_error');

      callback(null, getCompany(company));
    });
  });
}

CompanySchema.statics.findCompany = function (data, callback) {
  let Company = this;

  if (!data || !data.email || !data.password) return callback('bad_request')

  Company.findOne({
    email: data.email.trim()
  }, (err, company) => {
    if (err || !company) return callback('document_not_found');

    verifyPassword(data.password, company.password, res => {
      if (res) return callback(null, getCompany(company));
      
      return callback('password_verification');
    });
  });
};

module.exports = mongoose.model('Company', CompanySchema);
