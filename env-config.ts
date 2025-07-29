import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const requiredEnvVars = ["DATABASE_URL", "NEXT_PUBLIC_NOMINATIM_URL"];

const missing = requiredEnvVars.filter((name) => !process.env[name]);

if (missing.length > 0) {
    throw new Error(`❌ Missing required environment variables: ${missing.join(", ")}`);
}
