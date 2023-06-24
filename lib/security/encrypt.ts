import CryptoJS from 'crypto-js';

export const encrypt = (message: any) => {
  const secretKey: any = process.env.NEXT_PUBLIC_SECRET_KEY;

  const data = { message: message };
  const dataString = JSON.stringify(data);

  // Encrypt the data using AES encryption with the secret key
  const encrypted = CryptoJS.AES.encrypt(dataString, secretKey);

  // Get the encrypted data as a string
  const encryptedString = encrypted.toString();
	
	return encryptedString;
};
