import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({
   quiet: true,
   overwrite: false,
});

class SystemService {
   static backupDatabase = () => {
      return new Promise((resolve, reject) => {
         try {
            const backupDir = path.resolve('../backups');
            if (!fs.existsSync(backupDir)) {
               fs.mkdirSync(backupDir, { recursive: true });
            }

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            const timestamp = `${day}_${month}_${year}-${hours}_${minutes}`;
            const sqlFile = `${backupDir}/backup_${timestamp}.sql`;
            const encFile = `${backupDir}/backup_${timestamp}.sql.enc`;

            const { DB_USER, DB_PASS, DB_NAME, BACKUP_SECRET } = process.env;

            const dumpCmd = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe" -u${DB_USER} -p${DB_PASS} ${DB_NAME} > "${sqlFile}"`;
            const encCmd = `openssl enc -aes-256-cbc -salt -pbkdf2 -in "${sqlFile}" -out "${encFile}" -pass pass:${BACKUP_SECRET}`;

            exec(dumpCmd, (err) => {
               if (err) {
                  console.error('Error Backup:', err);
                  return reject({
                     statusCode: 500,
                     message: 'Backup Failed!',
                  });
               }

               exec(encCmd, (err) => {
                  if (err) {
                     console.error('Error Encrypt:', err);
                     return reject({
                        statusCode: 500,
                        message: 'Encrypt Failed!',
                     });
                  }

                  fs.unlinkSync(sqlFile);
                  resolve({
                     statusCode: 200,
                     message: 'Backup & Encrypt Successful!',
                  });
               });
            });
         } catch (error) {
            reject({
               statusCode: 500,
               message: 'Error Backup & Encrypt!',
            });
         }
      });
   };

   static restoreDatabase = (filename) => {
      return new Promise((resolve, reject) => {
         try {
            const backupDir = path.resolve('../backups');
            const encFile = path.join(backupDir, filename);
            const sqlFile = path.join(backupDir, 'restore.sql');

            if (!fs.existsSync(encFile)) {
               return reject({
                  statusCode: 404,
                  message: 'Backup file not found',
               });
            }

            const { DB_USER, DB_PASS, DB_NAME, BACKUP_SECRET } = process.env;

            const OPENSSL = `"C:\\Program Files\\OpenSSL-Win64\\bin\\openssl.exe"`;
            const MYSQL = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe"`;

            const decCmd =
               `${OPENSSL} enc -d -aes-256-cbc -pbkdf2 ` +
               `-in "${encFile}" -out "${sqlFile}" -pass pass:${BACKUP_SECRET}`;

            const restoreCmd = `${MYSQL} -u${DB_USER} -p${DB_PASS} ${DB_NAME} < "${sqlFile}"`;

            exec(decCmd, (err) => {
               if (err) {
                  return reject({
                     statusCode: 500,
                     message: 'Decrypt failed',
                  });
               }

               exec(restoreCmd, (err) => {
                  if (err) {
                     return reject({
                        statusCode: 500,
                        message: 'Restore failed',
                     });
                  }

                  fs.unlinkSync(sqlFile);

                  resolve({
                     statusCode: 200,
                     message: 'Restore successful',
                  });
               });
            });
         } catch (error) {
            reject({
               statusCode: 500,
               message: 'Restore error',
            });
         }
      });
   };
}

export default SystemService;
