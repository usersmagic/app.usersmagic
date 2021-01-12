// CronJob class for scheduling functions
const cron = require('node-cron');

const deleteImage = require('./functions/deleteImage');
const updateTargets = require('./functions/updateTargets');

const CronJob = {
  start: callback => {
    updateTargets();
    const job = cron.schedule('* * * * *', () => {
      // deleteImage(); Set Image used when you use it.......
      updateTargets();
    });

    setTimeout(() => {
      job.start();
      callback();
    }, 1000); // Start cron jobs after the function called
  }
}

module.exports = CronJob;
