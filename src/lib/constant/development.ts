export const developmentConfig = {
  enabled: import.meta.env.VITE_DEVELOPMENT_MODE === "true",
  developerName: "Shubham",
} as const;