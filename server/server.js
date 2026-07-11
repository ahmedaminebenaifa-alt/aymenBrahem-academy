import 'dotenv/config';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { startNotificationCleanupJob } from './src/jobs/cleanupNotifications.job.js';

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});

startNotificationCleanupJob();