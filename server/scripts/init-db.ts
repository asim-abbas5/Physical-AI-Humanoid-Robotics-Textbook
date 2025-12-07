import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  console.log("Initializing BetterAuth database schema...");

  try {
    // BetterAuth will automatically create tables on first run
    // This script ensures the database connection is working
    const client = await pool.connect();

    // Test connection
    const result = await client.query("SELECT NOW()");
    console.log("✅ Database connection successful:", result.rows[0].now);

    // BetterAuth tables will be created automatically when the server starts
    // The main tables are:
    // - user (id, email, name, emailVerified, image, createdAt, updatedAt)
    // - session (id, expiresAt, token, userId, createdAt, updatedAt)
    // - account (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
    // - verification (id, identifier, token, expires, createdAt)

    console.log(`
✅ Database initialization complete!

BetterAuth will automatically create the following tables on first run:
  - user (with custom fields: programmingLanguage, developmentEnvironment)
  - session
  - account
  - verification

Next steps:
  1. Start the server with: npm run server
  2. The tables will be created automatically on first authentication request
  3. Start the frontend with: npm start
    `);

    client.release();
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
