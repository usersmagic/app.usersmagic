// Format the given CompanyUser using Company

const Company = require('../../company/Company');

module.exports = (company_user, other_users, callback) => {
  if (!company_user || !company_user._id || !other_users || !Array.isArray(other_users))
    return callback('document_not_found');

  const company_user_data = {
    _id: company_user._id.toString(),
    completed: company_user.completed,
    email: company_user.email,
    type: company_user.type,
    role: company_user.role,
    name: company_user.name,
    teams: company_user.teams,
    profile_photo: company_user.profile_photo,
    color: company_user.color,
    company_id: company_user.company_id
  };

  Company.findCompanyById(company_user.company_id, (err, company) => {
    if (err) return callback(err);

    company_user_data.company = company;
    company_user_data.company.users = other_users.map(company_user => {
      return {
        _id: company_user._id.toString(),
        completed: company_user.completed,
        email: company_user.email,
        type: company_user.type,
        role: company_user.role,
        name: company_user.name,
        team: company_user.team,
        profile_photo: company_user.profile_photo,
        color: company_user.color
      };
    });

    return callback(null, company_user_data);
  });
};
