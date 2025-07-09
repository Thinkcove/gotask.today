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

export const getStorage = (key: string) => {
  if (localStorage && key) {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch {
      return value;
    }
  }
  return null;
};
