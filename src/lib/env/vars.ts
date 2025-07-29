import { EnvVars } from "@/types/env-vars";

const { DATABASE_URL, NEXT_PUBLIC_NOMINATIM_URL } = process.env as unknown as EnvVars;

export const envVars = {
    DATABASE_URL: DATABASE_URL,
    NEXT_PUBLIC_NOMINATIM_URL: NEXT_PUBLIC_NOMINATIM_URL,
} as EnvVars;
