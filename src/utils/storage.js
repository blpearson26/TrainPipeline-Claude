// Storage adapter that works both in Claude and in browser
const storage = {
  async get(key) {
    // Try Claude's storage first
    if (window.storage && window.storage.get) {
      try {
        return await window.storage.get(key);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    
    // Use localStorage as fallback
    const value = localStorage.getItem(key);
    return value ? { key, value, shared: false } : null;
  },

  async set(key, value) {
    // Try Claude's storage first
    if (window.storage && window.storage.set) {
      try {
        return await window.storage.set(key, value);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    
    // Use localStorage as fallback
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },

  async delete(key) {
    // Try Claude's storage first
    if (window.storage && window.storage.delete) {
      try {
        return await window.storage.delete(key);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    
    // Use localStorage as fallback
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },

  async list(prefix = '') {
    // Try Claude's storage first
    if (window.storage && window.storage.list) {
      try {
        return await window.storage.list(prefix);
      } catch (e) {
        // Fall through to localStorage
      }
    }
    
    // Use localStorage as fallback
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return { keys, prefix, shared: false };
  }
};

export default storage;
