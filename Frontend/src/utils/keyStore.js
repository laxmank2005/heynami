/**
 * keyStore.js
 * 
 * A lightweight, secure wrapper around IndexedDB to store WebCrypto CryptoKey objects.
 * Storing keys in IndexedDB is MUCH safer than localStorage because:
 * 1. CryptoKey objects cannot be serialised/read as raw text (the browser protects the key material).
 * 2. XSS scripts cannot extract the underlying key bytes — they can only use the key through the
 *    Web Crypto API if it was created with `extractable: false`.
 *
 * Usage:
 *   import { savePrivateKey, getPrivateKey, clearPrivateKey } from "./keyStore";
 *   await savePrivateKey(userId, cryptoKeyObject);
 *   const key = await getPrivateKey(userId);
 *   await clearPrivateKey(userId);
 */

const DB_NAME    = "heynami_keystore";
const DB_VERSION = 1;
const STORE_NAME = "private_keys";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "userId" });
      }
    };

    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
}

/**
 * Save a CryptoKey for the given userId.
 * @param {string} userId
 * @param {CryptoKey} cryptoKey
 */
export async function savePrivateKey(userId, cryptoKey) {
  const db   = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req   = store.put({ userId, key: cryptoKey });
    req.onsuccess  = () => resolve();
    req.onerror    = (e) => reject(e.target.error);
  });
}

/**
 * Retrieve the CryptoKey for the given userId.
 * Returns null if no key is found (e.g., user needs to log in again).
 * @param {string} userId
 * @returns {Promise<CryptoKey|null>}
 */
export async function getPrivateKey(userId) {
  try {
    const db   = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req   = store.get(userId);
      req.onsuccess  = (e) => resolve(e.target.result?.key ?? null);
      req.onerror    = (e) => reject(e.target.error);
    });
  } catch {
    return null;
  }
}

/**
 * Delete the stored key for the given userId (called on logout).
 * @param {string} userId
 */
export async function clearPrivateKey(userId) {
  try {
    const db   = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req   = store.delete(userId);
      req.onsuccess  = () => resolve();
      req.onerror    = (e) => reject(e.target.error);
    });
  } catch {
    // Ignore errors on cleanup
  }
}
