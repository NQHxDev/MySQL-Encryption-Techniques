import fs from 'fs';
import jwt from 'jsonwebtoken';
import { uuidv7 } from 'uuidv7';
import bcrypt from 'bcrypt';

import { encrypt, decrypt } from '../security/AES.js';
import RepoUser from '../repositories/repoUser.js';

const privateKey = fs.readFileSync('certs/jwt_private.key');

class AuthService {
   static register = async (user) => {
      // user: username, password, fullName, email, phone
      try {
         const encrypted_email = encrypt(user.email);
         const encrypted_phone = encrypt(user.phone);

         const newUser = {
            id: uuidv7(),
            fullname: user.fullname,
            username: user.username,
            password_hash: await bcrypt.hash(user.password, 10),
            encrypted_email: encrypted_email,
            encrypted_phone: encrypted_phone,
         };

         await RepoUser.createNewUser(newUser);

         return {
            statusCode: 200,
            message: 'Tạo tài khoản thành công!',
            data: newUser,
         };
      } catch (error) {
         console.log('Error Register:', error);
         return {
            statusCode: 500,
            message: 'Đã xảy ra lỗi khi tạo tài khoản! Vui lòng thử lại!',
            data: null,
         };
      }
   };

   static login = async ({ username, password }) => {
      try {
         const userLogin = await RepoUser.getUserByUsername(username);
         if (!userLogin) {
            return {
               statusCode: 401,
               message: 'Tài khoản này không tồn tại!',
               data: null,
            };
         }

         const correctPassword = await bcrypt.compare(password, userLogin.password_hash);

         if (!correctPassword) {
            return {
               statusCode: 401,
               message: 'Sai mật khẩu!',
               data: null,
            };
         }

         const payload = {
            id: userLogin.id,
            fullname: userLogin.full_name,
            username: username,
            role: userLogin.role,
         };

         const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '30m',
         });

         return {
            statusCode: 200,
            message: 'Đăng nhập thành công!',
            data: {
               accessToken: accessToken,
               user: payload,
            },
         };
      } catch (error) {
         console.error('Error Login:', error);
         return {
            statusCode: 500,
            message: 'Đã xảy ra lỗi khi đăng nhập! Vui lòng thử lại!',
            data: null,
         };
      }
   };
}

export default AuthService;
