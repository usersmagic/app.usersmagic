const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const getCompanyUser = require('./functions/getCompanyUser');
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const Company = require('../company/Company');

const random_color_values = ['rgb(3, 17, 73)', 'rgb(254, 211, 85)', 'rgb(46, 197, 206)', 'rgb(241, 120, 182)', 'rgb(120, 121, 241)'];
const allowed_types = ['admin', 'user'], allowed_roles = ['ui_designer', 'ux_designer', 'user_researcher', 'full_stack_designer', 'product_manager', 'developer', 'manager', 'sales', 'marketing', 'other'];

const CompanyUserSchema = new Schema({
  company_id: {
    // Id of the Company, same for every user
    type: mongoose.Types.ObjectId,
    required: true
  },
  completed: {
    // If the account is completed. If not, name required
    type: Boolean,
    default: false
  },
  email: {
    // The email of the CompanyUser
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // The password, saved hashed
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1000
  },
  type: {
    // Authentication type of the user. Allowed values: [admin, user]
    type: String,
    required: true
  },
  role: {
    // Role of the CompanyUser in the company. Allowed values: [ui_designer, ux_designer, user_researcher, full_stack_designer, product_manager, developer, manager, sales, marketing, other]
    type: String,
    required: true
  },
  teams: {
    // An array of the teams of the CompanyUser
    type: Array,
    default: []
  },
  profile_photo: {
    // Profile photo of CompanyUser
    type: String,
    default: null // If do not exists, write initials on color
  },
  name: {
    // Name of the CompanyUser
    type: String,
    default: null,
    maxlenght: 1000,
    minlength: 1
  },
  color: {
    // A random color given to each CompanyUser. Choose from random_color_values
    type: String,
    required: true
  }
});

CompanyUserSchema.pre('save', hashPassword);

CompanyUserSchema.statics.findCompanyUserById = function (id, callback) {
  // Finds and returns the CompanyUser with the given id, or an error if it exists
  // Format CompanyUser using getCompanyUser

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const CompanyUser = this;

  CompanyUser.findById(mongoose.Types.ObjectId(id.toString()), (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    CompanyUser.find({
      company_id: company_user.company_id
    }, (err, other_users) => {
      if (err) return callback('database_error');

      getCompanyUser(company_user, other_users,  (err, company_user) => {
        if (err) return callback(err);
  
        return callback(null, company_user);
      });
    });
  });
};

CompanyUserSchema.statics.createCompanyUser = function (data, callback) {
  // Create a new CompanyUser using data
  // Return its id, or an error if it exists

  if (!data || !data.email || !validator.isEmail(data.email.trim()) || !data.password || data.password.trim().length < 6)
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.length)
    return callback('bad_request');

  if (!data.company_id || !validator.isMongoId(data.company_id.toString()))
    return callback('bad_request');

  if (!data.type || !allowed_types.includes(data.type))
    data.type = 'admin';

  if (!data.role || !allowed_roles.includes(data.role))
    data.role = 'new_member' // The role is not yet specified

  const CompanyUser = this;

  const newCompanyUserData = {
    completed: data.completed ? true : false,
    email: data.email.trim(),
    password: data.password.trim(),
    name: data.name.trim(),
    company_id: mongoose.Types.ObjectId(data.company_id.toString()),
    type: data.type,
    role: data.role,
    color: random_color_values[parseInt(Math.random() * (random_color_values.length-1))]
  };

  const newCompanyUser = new CompanyUser(newCompanyUserData);

  newCompanyUser.save((err, company_user) => {
    if (err && err.code == 11000) return callback('duplicated_unique_field');
    if (err) return callback('database_error');

    return callback(null, company_user._id.toString());
  });
};

CompanyUserSchema.statics.findCompanyUser = function (data, callback) {
  if (!data || !data.email || !data.password)
    return callback('bad_request')

  const CompanyUser = this;

  CompanyUser.findOne({
    email: data.email.trim()
  }, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    verifyPassword(data.password, company_user.password, res => {
      if (!res) return callback('password_verification');

      CompanyUser.find({
        company_id: company_user.company_id
      }, (err, other_users) => {
        if (err) return callback('database_error');
  
        getCompanyUser(company_user, other_users,  (err, company_user) => {
          if (err) return callback(err);
    
          return callback(null, company_user);
        });
      });
    });
  });
};

CompanyUserSchema.statics.changePassword = function (id, data, callback) {
  // Takes a CompanyUser id, old password and a new password. Changes the document's password with the given id to the new password
  // Returns an error if it exists

  if (!data || !id|| !validator.isMongoId(id.toString()) || !data.old_password || !data.new_password || data.new_password.trim().length < 6)
    return callback('bad_request')

  const CompanyUser = this;

  CompanyUser.findById(mongoose.Types.ObjectId(id.toString()), (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    verifyPassword(data.old_password, company_user.password, res => {
      if (!res) return callback('password_verification');

      company_user.password = data.new_password.trim();

      company_user.save(err => {
        if (err) return callback(err);

        return callback(null);
      });
    });
  });
};

CompanyUserSchema.statics.updateCompanyUser = function (id, data, callback) {
  // Update the give CompanyUser
  // If data.company_name exists and CompanyUser is admin, update company_name as well
  // Return an error if it exists

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(id, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    CompanyUser.findByIdAndUpdate(mongoose.Types.ObjectId(id.toString()), {$set: {
      name: data.name && typeof data.name == 'string' && data.name.length ? data.name : company_user.name,
      role: data.role && allowed_roles.includes(data.role) ? data.role : company_user.role,
      profile_photo: typeof data.profile_photo == 'string' ? (data.profile_photo.length ? data.profile_photo : null) : company_user.profile_photo // Use to delete and upload photo, empty string deletes
    }}, err => {
      if (err) return callback('database_error');

      if (company_user.type != 'admin' || !data.company_name || typeof data.company_name != 'string' || !data.company_name.length)
        return callback(null);

      Company.updateName(company_user.company_id, data.company_name, err => {
        if (err) return callback(err);

        return callback(null);
      });
    });
  });
};

CompanyUserSchema.statics.getCompanyRoles = function (callback) {
  // Return list of allowed company roles
  return callback(allowed_roles);
};

CompanyUserSchema.statics.deleteCompanyUserById = function (id, user_id, callback) {
  // Delete the CompanyUser with the given id, authenticate request using user_id
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()) || !user_id)
    return callback('bad_request');

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, user) => {
    if (err) return callback(err);
    if (user.type != 'admin') return callback('not_authenticated_request');

    CompanyUser.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id.toString()),
      company_id: user.company_id
    }, (err, user) => {
      if (err || !user) return callback('document_not_found');
    });
  });
};

CompanyUserSchema.statics.inviteUserToCompany = function (user_id, data, callback) {
  // Authenticate the invite request of the user with the given user_id
  // Create a new CompanyUser if there is no error
  // Return id of the new CompanyUser, or an error if it exists

  if (!user_id || !data)
    return callback('bad_request');
  
  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, company_user) => {
    if (err) return callback(err);
    if (company_user.type != 'admin')
      return callback('not_authenticated_request');

    data.company_id = company_user.company_id;

    CompanyUser.createCompanyUser(data, (err, id) => {
      if (err) return callback(err);

      
    });
  });
}

CompanyUserSchema.statics.addTeamToCompany = function (user_id, data, callback) {
  // Add a new team to Company, push it under given CompanyUser documents
  // Name of each team must be unique, return an error instead
  // Return an error if it exists

  if (!user_id || !data || !data.name || typeof data.name != 'string' || !data.color || !random_color_values.includes(data.color) || !data.members || !Array.isArray(data.members))
    return callback('bad_request');

  data.name = data.name.trim();

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');
    if (company_user.type != 'admin') return callback('not_authenticated_request');

    Company.findCompanyById(company_user.company_id, (err, company) => {
      if (err || !company) return callback('document_not_found');
      if (company.teams.find(each => each.name == data.name))
        return callback('duplicatated_unique_field');

      const newTeamData = {
        name: data.name,
        color: data.color
      };

      async.timesSeries(
        data.members.length,
        (time, next) => {
          CompanyUser.findByIdAndUpdate(mongoose.Types.ObjectId(data.members[time]), {$push: {
            teams: data.name
          }}, (err, company_user) => {
            if (err || !company_user) return next('database_error');
            return next(null);
          });
        },
        err => {
          if (err) return callback(err);

          Company.pushTeamUnderCompany(company_user.company_id, newTeamData, err => {
            if (err) return callback(err);

            return callback(null);
          });
        }
      );
    });
  });
};

CompanyUserSchema.statics.pushUserToTeam = function (user_id, data, callback) {
  // Push the given team_name under the CompanyUser with the given id
  // Return an error if it exists

  if (!user_id || !data || !data._id || !data.team || typeof data.team != 'string')
    return callback('bad_request');

  data.team = data.team.trim();

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');
    if (company_user.type != 'admin')
      return callback('not_authenticated_request');

    Company.checkIfGivenTeamIsUnderCompany(company_user.company_id, data.team, res => {
      if (!res) return callback('document_not_found');

      CompanyUser.findCompanyUserById(data._id, (err, user) => {
        if (err || !user) return callback('document_not_found');

        if (company_user.company_id != user.company_id)
          return callback('not_authenticated_request');

        CompanyUser.findByIdAndUpdate(mongoose.Types.ObjectId(data._id.toString()), {$push: {
          teams: data.team
        }}, err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
    });
  });
};

CompanyUserSchema.statics.pullUserFromTeam = function (user_id, data, callback) {
  // Pop the CompanyUser from the given team
  // If this is the last user in the team, delete the team as well
  // Return an error if it exists

  if (!user_id || !data || !data._id || !data.team || typeof data.team != 'string')
    return callback('bad_request');

  data.team = data.team.trim();

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    if (company_user.type != 'admin')
      return callback('not_authenticated_request');

    CompanyUser.findCompanyUserById(data._id, (err, user) => {
      if (err || !user) return callback('document_not_found');

      if (company_user.company_id != user.company_id)
        return callback('not_authenticated_request');

      if (!user.teams.includes(data.team))
        return callback(null); // Already pulled, not an error

      CompanyUser.findByIdAndUpdate(mongoose.Types.ObjectId(data._id.toString()), {$pull: {
        teams: data.team
      }}, err => {
        if (err) return callback('database_error');

        CompanyUser
          .find({
            teams: data.team,
            company_id: company_user.company_id
          })
          .countDocuments()
          .then(number => {
            if (number > 0)
              return callback(null); // The team is not empty

            Company.pullTeam(company_user.company_id, data.team, err => {
              if (err) return callback(err);

              return callback(null);
            });
          })
          .catch(err => callback('unknown_error'));
      });
    })
  });
};

CompanyUserSchema.statics.deleteTeam = function (user_id, data, callback) {
  // Delete the team from the Company, pull it from every user
  // Return an error if it exists

  if (!user_id || !data || !data.team || typeof data.team != 'string')
    return callback('bad_request');

  data.team = data.team.trim();

  const CompanyUser = this;

  CompanyUser.findCompanyUserById(user_id, (err, company_user) => {
    if (err || !company_user) return callback('document_not_found');

    if (company_user.type != 'admin')
      return callback('not_authenticated_request');

    CompanyUser.find({
      teams: data.team,
      company_id: company_user.company_id
    }, (err, users) => {
      if (err) return callback('database_error');
      
      async.timesSeries(
        users.length,
        (time, next) => {
          CompanyUser.findByIdAndUpdate(mongoose.Types.ObjectId(users[time]._id.toString()), {$pull: {
            teams: data.team
          }}, err => next(err ? 'database_error' : null))
        },
        err => {
          if (err) return callback(err);

          Company.pullTeam(company_user.company_id, data.team, err => {
            if (err) return callback(err);

            return callback(null);
          });
        }
      );
    });
  });
};

module.exports = mongoose.model('CompanyUser', CompanyUserSchema);
