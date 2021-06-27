import { ArgumentsHost, ExceptionFilter, InternalServerErrorException, Logger } from '@nestjs/common';
import { Catch } from "@nestjs/common";
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
    private logger = new Logger(InternalServerErrorFilter.name);

    catch(exception: InternalServerErrorException, host: ArgumentsHost) {
        this.logger.error(exception);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response
            .status(500)
            .json({
                statusCode: 500,
                message: 'Internal server error'
            })
    }
}