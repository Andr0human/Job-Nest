import { type Request, type Response, type NextFunction } from 'express';
import { serverConfig } from '../../../config';
import logger from '../../logger';

class LogMiddleware {
    static log = (req: Request, res: Response, next: NextFunction): void => {
        logger.info(`method: ${req.method}, path: http://localhost:${serverConfig.port}${req.url}, time: ${new Date().toUTCString()}`);
        next();
    };
}

export default LogMiddleware;
