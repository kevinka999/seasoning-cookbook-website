// API modules configuration

export const API_MODULES = {
  identity:
    import.meta.env.VITE_IDENTITY_SERVICE_URL || "http://localhost:3000",
  recipes:
    import.meta.env.VITE_SEASONING_COOKBOOK_SERVICE_URL ||
    "http://localhost:3001",
} as const;

export type ApiModule = keyof typeof API_MODULES;

export const getModuleUrl = (module: ApiModule): string => {
  const url = API_MODULES[module];
  if (!url) {
    throw new Error(`Module "${module}" not found in API_MODULES`);
  }
  return url;
};
