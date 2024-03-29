const mongoose = require('mongoose');
const validator = require('validator');
const async = require('async');

const Schema = mongoose.Schema;

const getUser = require('./functions/getUser');
const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const UserSchema = new Schema({
  email: {
    // Email address of the user
    type: String,
    unique: true,
    minlength: 1,
    required: true
  },
  password: {
    // Password of the user, saved hashed
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1000
  },
  agreement_approved: {
    // If user approved user agreement
    type: Boolean,
    default: false
  },
  completed: {
    // If user completed its account, cannot use the app without completing
    type: Boolean,
    default: false
  },
  country: {
    // Country of the user, required while completing account
    type: String,
    default: null
  },
  name: {
    // Name of the user, required while completing account
    type: String,
    default: null
  },
  phone: {
    // Phone of the user, required while completing acount
    type: String,
    default: null
  },
  gender: {
    // Gender of the user, required while completing acount. Possible values: [erkek, kadın]
    type: String,
    default: null
  },
  birth_year: {
    // Birth year of the user, required while completing acount
    type: Number,
    default: null
  },
  city: {
    // City of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  town: {
    // Town of the user, required before joining a campaign/project
    type: String,
    default: null
  },
  information: {
    // Information field of the user, keeping question data for the user
    // Used to filter users by question from Question model
    type: Object,
    default: {}
  },
  paid_campaigns: {
    // List of ids for the campaigns/projects the user is paid for
    // Extra measure to prevent over payment
    type: Array,
    default: []
  },
  campaigns: {
    // List of ids of the campaigns the user is currently joined
    type: Array,
    default: []
  },
  payment_number: {
    // PayPal or Papara number of the user, required before user asking for a payment
    type: String,
    default: null
  },
  credit: {
    // The current credit of user, gained from campaigns or projects
    type: Number,
    default: 0
  },
  waiting_credit: {
    // The waiting credit of the user, still a document on the Payment model
    type: Number,
    default: 0
  },
  overall_credit: {
    // The overall credit of the user, updated after a waiting credit is complete
    type: Number,
    default: 0
  },
  invitor: {
    // Invitor (id of another user) of the user
    // If there is an invitor, the invitor gains 2 credits when the user receives a waiting credit
    type: String,
    default: null
  },
  password_reset_code: {
    // The secure code for resetting a password
    // Created when the user asks for a password reset
    // The code is send the user via email
    type: String,
    default: null
  },
  password_reset_last_date: {
    // The unix time that the password_reset_code will be deactivated
    // The user cannot reset his/her password using the password_reset_code after the password_reset_last_data passes
    type: Number,
    default: null
  }
});

// Before saving the user to database, hash its password
UserSchema.pre('save', hashPassword);

UserSchema.statics.findUser = function (email, password, callback) {
  // Finds the user with the given email field, then verifies it with the given password
  // Returns the user or an error if there is one

  if (!email || !password || !validator.isEmail(email))
    return callback('bad_request');

  let User = this;

  User.findOne({email}).then(user => {
    if (!user)
      return callback('document_not_found');

    verifyPassword(password, user.password, res => {
      if (!res)
        return callback('password_verification');

      getUser(user, (err, user) => {
        if (err) return callback(err);

        return callback(null, user);
      });
    });
  });
};

UserSchema.statics.getUserById = function (id, callback) {
  // Finds the user with the given id and returns it without deleting any field, or an error if there is one
  // Do NOT use this function while sending it to frontend, use the user object on the cookie instead

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const User = this;

  User.findById(mongoose.Types.ObjectId(id), (err, user) => {
    if (err) return callback(err);

    return callback(null, user);
  });
};

UserSchema.statics.getUsersFromSubmitionsByFilters = function (_submitions, _filters, callback) {
  if(!_filters || Object.entries(_filters).length === 0) return callback("missing filters");
  if(!_submitions) return callback("missing submition");

  const User = this;
  const submitions = [];

//  console.log(_filters.age);

  async.forEachOf(_submitions, (submition, key, callback) =>{
    User.getUserById(submition.user_id, (err, user) =>{
      if(err) callback();
      else{
        let in_age = false;
        let in_gender = false;

        if(_filters.age.length != 0){

          for(age of _filters.age){
            const ages = age.split(" - ");
            const startAge = ages[0];
            const endAge = ages[1];

            const userAge = new Date().getFullYear() - user.birth_year;

            // I used here DNF, e.g. (18-30) or (30-50) or (50-70)
            if( userAge >= startAge && userAge <= endAge) in_age = true;
          }
        }
        else in_age = true;

      if(_filters.gender.length != 0){
        for(gender of _filters.gender){
          const userGender = translateGenderToEnglish(user.gender.toLowerCase());

          //DNF again
          if(gender.toLowerCase() == userGender) in_gender = true;
        }
      }
      else in_gender = true;

        if(in_gender && in_age) submitions.push(submition);
        callback();
      }
    })
  }, err =>{
    if(err) return callback(err);

    return callback(null, submitions);
  })
}
module.exports = mongoose.model('User', UserSchema);

// the system was turkish at the beginning, this is for back compatibility
function translateGenderToEnglish(gender){
  if(gender == "kadın") return "female";
  else if(gender == "erkek") return "male";
  else return gender
}
