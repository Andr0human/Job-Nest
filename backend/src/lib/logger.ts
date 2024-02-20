import winston from 'winston';

const logger: winston.Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: 'app.log' }),
    ],
});

export default logger;
