import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'progress-iq-secret-key-2024';

export const encryptData = (data: string): string => {
  if (!SECRET_KEY) {
    console.error("SECRET_KEY is not defined!");
    return data;
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): string | null => {
  try {
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined for decryption");
    }
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export const setEncryptedItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    if(key=='token'){
      localStorage.setItem("token", value);
      return;
    }
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  }
};

export const getEncryptedItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    if(key=='token'){
      return localStorage.getItem("token");
    }
    const encrypted = localStorage.getItem(key);
    if (encrypted) {
      return decryptData(encrypted);
    }
  }
  return null;
};

export const removeEncryptedItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};