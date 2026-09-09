import 'dotenv/config';
import { connectDB } from './db/connection.js';
import { seedAll } from './db/seed.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3001);

async function start(): Promise<void> {
  // 1. Connect to MongoDB Atlas
  await connectDB();

  // 2. Seed collections that are empty (no-op when data already exists)
  await seedAll();

  // 3. Start the HTTP server
  createApp().listen(port, () => {
    console.log(`GeneticMedicine API listening on http://localhost:${port}`);
  });
}

start().catch((err: unknown) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
