import SystemService from '../services/systemService.js';

class SystemController {
   backupDatabase = async (req, res) => {
      try {
         const result = await SystemService.backupDatabase();
         res.status(result.statusCode).json({ message: result.message });
      } catch (err) {
         res.status(err.statusCode || 500).json({ message: err.message });
      }
   };

   restoreDatabase = async (req, res) => {
      try {
         const { filename } = req.body;

         if (!filename) {
            return res.status(400).json({
               message: 'filename is required',
            });
         }

         const result = await SystemService.restoreDatabase(filename);

         res.status(result.statusCode).json({
            message: result.message,
         });
      } catch (err) {
         res.status(err.statusCode || 500).json({
            message: err.message || 'Restore failed',
         });
      }
   };
}

export default SystemController;
