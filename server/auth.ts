import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    connectionString: process.env.DATABASE_URL || "",
    type: "postgres",
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",
  secret: process.env.BETTER_AUTH_SECRET || "default-secret-change-in-production",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
