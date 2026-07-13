import cron from 'node-cron';
import { deleteExpiredNotifications } from '../services/notification.service.js';


export const startNotificationCleanupJob = () => {
  // Runs once a day at 3am server time — light load, no rush
  cron.schedule('0 3 * * *', async () => {
    try {
      const count = await deleteExpiredNotifications();
      if (count > 0) {
        console.log(`Cleaned up ${count} expired notification(s)`);
      }
    } catch (err) {
      console.error('Notification cleanup job failed:', err.message);
    }
  });
};

