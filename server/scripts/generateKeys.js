import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const certDir = path.join(process.cwd(), 'certs');

if (!fs.existsSync(certDir)) {
   fs.mkdirSync(certDir);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
   modulusLength: 2048,
   publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
   },
   privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
   },
});

fs.writeFileSync(path.join(certDir, 'jwt_private.key'), privateKey);
fs.writeFileSync(path.join(certDir, 'jwt_public.key'), publicKey);

console.log('JWT RSA key pair generated successfully!');
