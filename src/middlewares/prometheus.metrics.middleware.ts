import client from 'prom-client';
import os from 'os';
import { Request, Response, NextFunction } from 'express';

/**
 * Prometheus metrics middleware for Express.js applications.
 * This middleware collects metrics for HTTP requests, including total requests,
 * request duration, active requests, and error counts.
 * It uses the prom-client library to create and manage metrics.
 * The collected metrics can be scraped by Prometheus for monitoring and alerting.
 */
const SERVICE_NAME = process.env.SERVICE_NAME || 'unknown_service';
const HOSTNAME = os.hostname();

// Prometheus metrics for HTTP requests
export const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status', 'route', 'service', 'hostname'],
});

// Histogram to measure the duration of HTTP requests in seconds
export const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status', 'route', 'service', 'hostname'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10] // in seconds
});

// Gauge to track the number of active HTTP requests
export const activeRequests = new client.Gauge({
    name: 'active_http_requests',
    help: 'Number of active HTTP requests',
    labelNames: ['service', 'hostname'],
});

// Counter to track the total number of HTTP errors
export const errorCounter = new client.Counter({
    name: 'http_errors_total',
    help: 'Total number of HTTP errors',
    labelNames: ['method', 'status', 'route', 'service', 'hostname'],
});

export const prometheusMetrics = (req: Request, res: Response, next: NextFunction) => {
    activeRequests.labels(SERVICE_NAME, HOSTNAME).inc(); // Increment active requests count
    const startEpoch = Date.now();

    res.on('finish', () => {
        const responseTimeInSeconds = (Date.now() - startEpoch) / 1000;
        const route = req.url || 'unknown_route';
        const hostname = HOSTNAME || 'unknown';
        const commonLabels = {
            method: req.method,
            status: res.statusCode.toString(),
            route,
            service: SERVICE_NAME,
            hostname,
        };

        httpRequestCounter.labels(commonLabels).inc();
        httpRequestDurationSeconds.labels(commonLabels).observe(responseTimeInSeconds);
        if (res.statusCode >= 400) {
            errorCounter.labels(commonLabels).inc();
        }

        activeRequests.labels(SERVICE_NAME, HOSTNAME).dec(); // Decrement active requests count
    });
    next();
};