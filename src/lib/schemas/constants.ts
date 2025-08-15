export const ECOPIN_LNG_LAT_DEFAULT_VAL = 0;

export const ECOPIN_TITLE_MIN_LENGTH = 4;
export const ECOPIN_TITLE_MAX_LENGTH = 300;

export const ECOPIN_CONTENT_MIN_LENGTH = 10;
export const ECOPIN_CONTENT_MAX_LENGTH = 40000;

export const ECO_CONTENT_MIN_LENGTH = 10;
export const ECO_CONTENT_MAX_LENGTH = 10000;

export const ECO_REPLY_CONTENT_MIN_LENGTH = ECO_CONTENT_MIN_LENGTH;
export const ECO_REPLY_CONTENT_MAX_LENGTH = ECO_CONTENT_MAX_LENGTH;

export const ALL_ECOPIN_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const ALL_ECOPIN_CATEGORIES = [
    "infrastructure",
    "security",
    "health",
    "education",
    "corruption",
    "environment",
    "other",
] as const;
