import AuthService from '../services/authService.js';

class AuthController {
   register = async (req, res) => {
      // username, password, fullName, email, phone
      const user = req.body;

      const result = await AuthService.register(user);

      res.status(result.statusCode).send({
         message: result.message,
         data: result.data,
      });
   };

   login = async (req, res) => {
      const { username, password } = req.body;

      const result = await AuthService.login({ username, password });

      res.status(result.statusCode).send({
         message: result.message,
         data: result.data,
      });
   };
}

export default AuthController;
