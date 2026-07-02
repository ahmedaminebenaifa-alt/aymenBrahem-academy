import 'dotenv/config';
import app from './src/app.js';
import { env } from './src/config/env.js';

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});