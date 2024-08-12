import winston from 'winston';
import moment from 'moment';

// Configuração do Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            const formattedTimestamp = moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
            return `${formattedTimestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    const formattedTimestamp = moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
                    return `${formattedTimestamp} [${level}]: ${message}`;
                })
            ),
        }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ],
});

export default logger;
