import fs from 'fs';
import jwt from 'jsonwebtoken';

const publicKey = fs.readFileSync('certs/jwt_public.key');

export const verifyAdmin = (req, res, next) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({
            message: 'Không đủ điều kiện để có thể thực hiện lệnh này!',
         });
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, publicKey, {
         algorithms: ['RS256'],
      });

      if (decoded.role !== 'admin') {
         return res.status(403).json({
            message: 'Bạn không có quyền thực hiện lệnh này!',
         });
      }

      req.user = decoded;

      next();
   } catch (error) {
      return res.status(401).json({
         message: 'Token không hợp lệ hoặc đã hết hạn! Vui lòng thử lại sau!',
         error: error.message,
      });
   }
};
