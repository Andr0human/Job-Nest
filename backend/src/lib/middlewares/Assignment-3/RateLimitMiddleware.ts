import { type Request, type Response, type NextFunction } from 'express';
import { SystemResponse } from '../../response-handler';
import logger from '../../logger';

class RateLimitMiddleware {
    maxRequests: number;

    currentRequestCounter: number;

    intervalMs: number;

    startClock: number;

    constructor(maxRequests: number, intervalMs: number) {
        this.maxRequests = maxRequests;
        this.currentRequestCounter = 0;
        this.intervalMs = intervalMs;
        this.startClock = new Date().getTime();
    }

    // Check if query limit exceeded in current interval
    isInInterval = (): boolean => {
        const endClock: number = new Date().getTime();
        return endClock - this.startClock < this.intervalMs;
    };

    check = (): boolean => {
        if (this.currentRequestCounter < this.maxRequests) {
            this.currentRequestCounter += 1;
            return true;
        }

        if (this.isInInterval()) {
            return false;
        }

        // Reset interval + requestCounter
        this.startClock = new Date().getTime();
        this.currentRequestCounter = 1;
        return true;
    };

    fetch = (req: Request, res: Response, next: NextFunction): void => {
        if (this.check()) {
            logger.info('Query within interval!');
            next();
        } else {
            logger.warn('Query rate exceeded!');

            new SystemResponse(
                res,
                'Query limit exceeded! Please wait.',
                {},
            ).tooManyRequests();
        }
    };
}

export default RateLimitMiddleware;
