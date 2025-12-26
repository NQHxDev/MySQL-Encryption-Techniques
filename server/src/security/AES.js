import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({
   quiet: true,
   overwrite: false,
});

const algorithm = 'aes-256-gcm';

const key = Buffer.from(
   process.env.AES_KEY || '4b71930c6247efc6e22c1a500db15a6e37afae0379e2548b8ee4cc4a1a17f461',
   'hex'
);

/**
 * Mã hóa Nội dung
 * @param {string} text - Nội dung cần mã hóa
 * @returns {Buffer} - Buffer chứa iv + authTag + Ciphertext
 */
export const encrypt = (text) => {
   const iv = crypto.randomBytes(12);

   const cipher = crypto.createCipheriv(algorithm, key, iv);

   const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

   const authTag = cipher.getAuthTag();

   return Buffer.concat([iv, authTag, encrypted]);
};

/**
 * Giải mã Buffer
 * @param {Buffer} buffer - Buffer chứa dữ liệu đã mã hóa (iv + authTag + Ciphertext)
 * @returns {string} - Nội dung đã được giải mã
 */
export const decrypt = (buffer) => {
   // Phân tách Buffer
   const iv = buffer.subarray(0, 12);
   const authTag = buffer.subarray(12, 28);
   const encrypted = buffer.subarray(28);

   // Tạo Decipher
   const decipher = crypto.createDecipheriv(algorithm, key, iv);

   // Set authentication tag để xác thực
   decipher.setAuthTag(authTag);

   // Giải mã
   let decrypted = decipher.update(encrypted, 'binary', 'utf8');
   decrypted += decipher.final('utf8');

   return decrypted;
};
