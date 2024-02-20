import { type Request, type Response } from 'express';
import { SystemResponse } from '../lib/response-handler';

class HomePageController {
    static assignment3 = (req: Request, res: Response): void => {
        new SystemResponse(res, 'Assignment-3 HomePage', {}).ok();
    };

    static assignment4 = (req: Request, res: Response): void => {
        new SystemResponse(res, 'Assignment-4 HomePage', {}).ok();
    };

    static assignment5 = (req: Request, res: Response): void => {
        new SystemResponse(res, 'Assignment-5 HomePage', {}).ok();
    };
}

export default HomePageController;
