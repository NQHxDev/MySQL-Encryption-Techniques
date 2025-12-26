import { body, validationResult } from 'express-validator';

import RepoUser from '../repositories/repoUser.js';

class AuthValidation {
   static register() {
      return [
         body('fullname')
            .trim()
            .notEmpty()
            .withMessage('Vui lòng nhập tên')
            .isLength({ min: 5, max: 100 })
            .withMessage('Tên phải từ 5 đến 100 ký tự')
            .matches(/^[\p{L}\s]+$/u)
            .withMessage('Tên chỉ được chứa chữ cái và khoảng trắng')
            .escape(),

         body('email')
            .trim()
            .notEmpty()
            .withMessage('Email là bắt buộc')
            .isEmail()
            .withMessage('Email không hợp lệ')
            .normalizeEmail(),

         body('phone')
            .optional()
            .trim()
            .matches(/^[0-9]{10}$/)
            .withMessage('Số điện thoại không hợp lệ'),

         body('username')
            .trim()
            .notEmpty()
            .withMessage('Vui lòng nhập Tên đăng nhập')
            .isLength({ min: 6, max: 30 })
            .withMessage('Tài khoản phải từ 6 đến 30 ký tự')
            .escape()
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Tài khoản chỉ được chứa chữ, số và _')
            .custom(async (value) => {
               const existing = await RepoUser.checkExistsAccount('username', value);
               if (existing) {
                  throw new Error('Tài khoản này đã được đăng ký!');
               }
            }),

         body('password')
            .trim()
            .notEmpty()
            .withMessage('Mật khẩu là bắt buộc')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),

         body('confirmPassword')
            .trim()
            .notEmpty()
            .withMessage('Xác nhận mật khẩu là bắt buộc')
            .custom((value, { req }) => {
               if (value !== req.body.password) {
                  throw new Error('Mật khẩu xác nhận không khớp');
               }
               return true;
            }),

         handleValidation,
      ];
   }

   static login() {
      return [
         body('username')
            .trim()
            .notEmpty()
            .withMessage('Vui lòng nhập Tên đăng nhập')
            .isLength({ min: 6, max: 30 })
            .withMessage('Tài khoản phải từ 6 đến 30 ký tự')
            .escape()
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Tài khoản chỉ được chứa chữ, số và _'),

         body('password')
            .trim()
            .notEmpty()
            .withMessage('Mật khẩu là bắt buộc')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),

         handleValidation,
      ];
   }
}

const handleValidation = (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({
         success: false,
         message: 'Validation error',
         errors: errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
         })),
      });
   }

   next();
};

export default AuthValidation;
