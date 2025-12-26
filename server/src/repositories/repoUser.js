import { executeQuery, transactionQuery } from '../services/databaseService.js';

class RepoUser {
   static createNewUser = async (newUser) => {
      /*
         `id` int NOT NULL AUTO_INCREMENT,
         `username` varchar(50) DEFAULT NULL,
         `password_hash` varchar(255) DEFAULT NULL,
         `full_name` varbinary(255) DEFAULT NULL,
         `email` varbinary(255) DEFAULT NULL,
         `phone` varbinary(255) DEFAULT NULL,
      */
      const queryInsert =
         'Insert into users (id, username, password_hash, full_name, email, phone) values (?, ?, ?, ?, ?, ?)';

      /*
         const newUser = {
            id: uuidv7(),
            fullname: user.fullname,
            username: user.username,
            password_hash: await bcrypt.hash(user.password, 10),
            encrypted_email: encrypted_email,
            encrypted_phone: encrypted_phone,
         };
      */
      const result = await executeQuery(queryInsert, [
         newUser.id,
         newUser.username,
         newUser.password_hash,
         newUser.fullname,
         newUser.encrypted_email,
         newUser.encrypted_phone,
      ]);

      return result;
   };

   static checkExistsAccount = async (typeCheck = 'username', value) => {
      const allowedFields = ['username'];

      if (!allowedFields.includes(typeCheck)) {
         throw new Error('Invalid Check Type!');
      }

      const queryCheck = `Select 1 From users where ${typeCheck} = ? Limit 1`;

      const result = await executeQuery(queryCheck, [value]);

      return result.length > 0;
   };

   static getUserByUsername = async (username) => {
      const queryGetUser =
         'Select id, full_name, password_hash, role from users where username = ?';

      const [result] = await executeQuery(queryGetUser, [username]);

      return result;
   };
}

export default RepoUser;
