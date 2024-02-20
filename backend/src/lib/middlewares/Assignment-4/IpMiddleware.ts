import { type Request, type Response, type NextFunction } from 'express';
import { SystemResponse } from '../../response-handler';
import logger from '../../logger';

class IpMiddleware {
    private readonly expectedIp: string;

    constructor() {
        this.expectedIp = '::1';
    }

    check = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        const clientIp: string | undefined = req.ip;

        if (clientIp !== this.expectedIp) {
            new SystemResponse(
                res,
                'access denied! invalid IP address.',
                {},
            ).forbidden();
            return;
        }

        logger.info('valid ip address');
        next();
    };
}

export default IpMiddleware;
