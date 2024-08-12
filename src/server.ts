import app from './app';
import db from './models';
import logger from './utils/logger';  // Certifique-se de que o caminho está correto

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    logger.error('Unable to connect to the database: ' + (err as Error).message);
});
