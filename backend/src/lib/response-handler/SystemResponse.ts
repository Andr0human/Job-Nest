import { type Response } from 'express';
import HttpStatusCode from './StatusCodes';

class SystemResponse {
    private readonly res: Response;

    private readonly message: string;

    private readonly data: any;

    constructor(res: Response, message: string, data: any) {
        this.res = res;
        this.message = message;
        this.data = data;
    }

    ok = (): void => {
        this.res.status(HttpStatusCode.Ok).json({
            status: true,
            message: this.message,
            data: this.data,
        });
    };

    created = (): void => {
        this.res.status(HttpStatusCode.Created).json({
            status: true,
            message: this.message,
            data: this.data,
        });
    };

    badRequest = (): void => {
        this.res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    unauthorized = (): void => {
        this.res.status(HttpStatusCode.Unauthorized).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    forbidden = (): void => {
        this.res.status(HttpStatusCode.Forbidden).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    notFound = (): void => {
        this.res.status(HttpStatusCode.NotFound).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    conflict = (): void => {
        this.res.status(HttpStatusCode.Confict).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    tooManyRequests = (): void => {
        this.res.status(HttpStatusCode.TooManyRequests).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };

    internalServerError = (): void => {
        this.res.status(HttpStatusCode.InternalServerError).send({
            status: false,
            message: this.message,
            error: this.data,
        });
    };
}

export default SystemResponse;
