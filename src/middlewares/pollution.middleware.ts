import { Request, Response, NextFunction } from "express";

import AppError from '../exceptions/app-error.exception';

/**
 * Middleware to detect parameter pollution.
 * It checks if any query parameters have multiple values,
 * which can indicate parameter pollution attacks.
 * If such parameters are found, it throws a BadRequest error.
 */
const detectParameterPollution = (req: Request, res: Response, next: NextFunction) => {
    const pollutedParams: Record<string, string[]> = {};

    for (const key in req.query) {
        const value = req.query[key];
        if (Array.isArray(value)) {
            pollutedParams[key] = value.map((v) => v.toString());
        }
    }

    if (Object.keys(pollutedParams).length > 0) {
        return next(
            AppError.BadRequest(
                "Parameter Pollution Detected",
                `The following parameters were detected with multiple values: ${JSON.stringify(pollutedParams)}`
            )
        );
    }

    next();
};

export default detectParameterPollution;
