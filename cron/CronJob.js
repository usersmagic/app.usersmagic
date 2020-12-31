// CronJob class for scheduling functions
const cron = require('node-cron');

const deleteImage = require('./functions/deleteImage');

const CronJob = {
  start: callback => {
    const job = cron.schedule('* * * * *', () => {
      deleteImage();
    });

    setTimeout(() => {
      job.start();
      callback();
    }, 10000); // Start cron jobs after 10secs the server is restarted
  }
}

module.exports = CronJob;
