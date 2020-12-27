module.exports = (req, res) => {
  return res.render('projects/create', {
    page: 'projects/create',
    title: 'New Project',
    includes: {
      external: {
        css: ['page', 'general', 'header', 'logo', 'inputs', 'buttons', 'fontawesome'],
        js: ['page', 'duplicateElement', 'dragAndDrop', 'buttonListeners']
      }
    },
    company: {
      name: "Yunus Gürlek",
      profile_photo: "https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png"
    },
    project: {
      _id: "ae31723f384",
      name: "New Project"
    }
  });
}
