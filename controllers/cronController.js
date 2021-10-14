const cron = require('node-cron');
const { findAll, updateOne } = require('../db/databaseHelper');
const { createNotification } = require('./notificationController');
const sync = require('./syncController');

const userIds = ['6145cf0c285e4a1840207426', '6145cefc285e4a1840207423', '6145cefc285e4a1840207429'];

const dateInPast = (firstDate, secondDate) => {
  if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  return false;
};

exports.SyncJob = () => {
  cron.schedule('0 0 0 * * *', () => {
    sync();
  });
};

module.exports = () => {
  // cron scheduler runs every 12am
  cron.schedule('0 0 0 * * *', async () => {
    // list of organisation ids
    const orgList = await findAll('orgs', 'fictionalorganisationtokeeptrack');
    const orgs = orgList.data.data;
    // for each organisation, get all goals
    orgs.forEach(async (org) => {
      const findGoals = await findAll('goals', org.orgId);
      // for each goal, iterate through where date is past, update db.
      const goals = findGoals.data.data;
      goals.forEach(async (goal) => {
        if (dateInPast(new Date(goal.due_date), new Date()) && !goal.is_completed) {
          // eslint-disable-next-line no-underscore-dangle
          await updateOne('goals', { isExpired: true, is_expired: true }, {}, org.orgId, goal._id);
          await createNotification(userIds, org.orgId, goal.room_id, goal.goal_name, 'expiredGoal');
        }
      });
    });
  });
};
