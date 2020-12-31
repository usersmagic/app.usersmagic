const Image = require('../../models/image/Image');

module.exports = () => {
  Image.deleteOldImages(err => {
    if (err) console.log(err);
  });
}
