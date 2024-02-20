import { type Request, type Response, type NextFunction } from 'express';

class HeaderMiddleware {
    headerName: string;

    headerValue: string;

    constructor(headerName: string, headerValue: string) {
        this.headerName = headerName;
        this.headerValue = headerValue;
    }

    setHeader = (req: Request, res: Response, next: NextFunction): void => {
        res.setHeader(this.headerName, this.headerValue);
        next();
    };
}

export default HeaderMiddleware;
