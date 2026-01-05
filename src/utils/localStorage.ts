export const localStorageUtils = {
  get: (key: string): string | null => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting key "${key}" from storage:`, error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting key "${key}" in storage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing key "${key}" from storage:`, error);
    }
  },
};
