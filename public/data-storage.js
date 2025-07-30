/**
 * @file data-storage.js
 * @description Manages local storage of user data.  Note: This is a simplification for browser-only execution. A real application would require a secure server-side solution.
 */

class DataStorage {
  constructor(encryptionKey) {
    if (!encryptionKey || typeof encryptionKey !== 'string') {
      throw new Error('Encryption key must be a non-empty string.');
    }
    this.encryptionKey = encryptionKey;
  }

  /**
   * Encrypts data using the provided key.  Uses a simple substitution cipher for demonstration - INSUFFICIENT FOR PRODUCTION
   * @param {string} data - The data to encrypt.
   * @returns {string} The encrypted data.
   */
  encrypt(data) {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      const encryptedCharCode = (charCode + this.encryptionKey.charCodeAt(i % this.encryptionKey.length)) % 256;
      encrypted += String.fromCharCode(encryptedCharCode);
    }
    return btoa(encrypted); // Base64 encoding for storage
  }

  /**
   * Decrypts data using the provided key. Uses a simple substitution cipher for demonstration - INSUFFICIENT FOR PRODUCTION
   * @param {string} data - The encrypted data to decrypt.
   * @returns {string} The decrypted data.
   * @throws {Error} If decryption fails.
   */
  decrypt(data) {
    try {
      let decrypted = '';
      const decoded = atob(data);
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const decryptedCharCode = (charCode - this.encryptionKey.charCodeAt(i % this.encryptionKey.length) + 256) % 256;
        decrypted += String.fromCharCode(decryptedCharCode);
      }
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }


  /**
   * Stores data in local storage.
   * @param {string} key - The key under which to store the data.
   * @param {object} data - The data to store.
   * @throws {Error} If data storage fails.
   */
  async storeData(key, data) {
    try {
      const encryptedData = this.encrypt(JSON.stringify(data));
      localStorage.setItem(key, encryptedData);
    } catch (error) {
      throw new Error('Data storage failed: ' + error.message);
    }
  }


  /**
   * Retrieves data from local storage.
   * @param {string} key - The key under which the data is stored.
   * @returns {object|null} The retrieved data, or null if the key is not found.
   * @throws {Error} If data retrieval fails.
   */
  async retrieveData(key) {
    try {
      const encryptedData = localStorage.getItem(key);
      if (!encryptedData) {
        return null;
      }
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      throw new Error('Data retrieval failed: ' + error.message);
    }
  }


  /**
   * Removes data from local storage.
   * @param {string} key - The key of the data to remove.
   */
  removeData(key) {
    localStorage.removeItem(key);
  }

  /**
   * Clears all data from local storage.  Use with caution!
   */
  clearAllData() {
    localStorage.clear();
  }
}


// Example usage (replace with your actual encryption key -  THIS IS A PLACEHOLDER AND NOT SUITABLE FOR PRODUCTION)
const dataStorage = new DataStorage('MySuperSecretEncryptionKey');

//Asynchronous Example
async function testStorage() {
    try {
        await dataStorage.storeData('userData', { name: 'John Doe', age: 30 });
        const retrievedData = await dataStorage.retrieveData('userData');
        console.log(retrievedData); // Output: { name: 'John Doe', age: 30 }
        dataStorage.removeData('userData');
    } catch (error) {
        console.error("Error:", error);
    }
}

testStorage();