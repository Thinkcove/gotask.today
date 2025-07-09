export const setStorage = (key: string, value: any) => {
  if (localStorage && key && value) {
    if (typeof value == "object") {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } else {
      localStorage.setItem(key, value);
    }
  }
};

export const getStoredObj = <T = any,>(key: string): T | null => {
  if (typeof localStorage !== "undefined" && key) {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getStored = (key: string): string | null => {
  if (typeof localStorage !== "undefined" && key) {
    return localStorage.getItem(key);
  }
  return null;
};

export const removeStorage = (key: string) => {
  if (typeof localStorage !== "undefined" && key) {
    localStorage.removeItem(key);
  }
};
