const requiredEnvVars = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
];

export function checkEnv() {
  const missing = requiredEnvVars.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`[env.ts] Missing critical environment variables: ${missing.join(", ")}`);
    } else {
      console.warn(`[env.ts] Warning: Missing environment variables: ${missing.join(", ")}`);
    }
  }
}

// Auto-run checking on import
checkEnv();
