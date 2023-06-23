import CryptoJS from 'crypto-js';

export const decrypt = (encryptedMessage: string) => {
  const secretKey: any = process.env.NEXT_PUBLIC_SECRET_KEY;
	
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secretKey);

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

  const decryptedData = JSON.parse(decryptedString);

	return decryptedData;
};
