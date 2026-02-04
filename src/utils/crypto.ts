import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'fallback-key';

export const encryptData = (data: any) => {
    if (!SECRET_KEY) {
        console.error("SECRET_KEY is not defined!");
        return null;
    }
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (cipherText: any) => {
    try {
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined for decryption");
        }
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};