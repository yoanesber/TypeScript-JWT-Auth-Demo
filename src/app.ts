import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import requestId from 'express-request-id';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// routes
import authRoutes from './routes/auth.routes';
import metricRoutes from './routes/metrics.routes';
import noteRoutes from './routes/note.routes';

// middlewares
import cors from './middlewares/cors.middleware';
import detectParameterPollution from './middlewares/pollution.middleware';
import errorHandler from './middlewares/error.middleware';
import logger from './middlewares/logger.middleware';
import notFoundResource from './middlewares/not-found-resource.middleware';
import validateContentType from './middlewares/validate-content-type.middleware';
import { authenticateJWT } from './middlewares/auth.middleware';
import { loginRateLimiter, generalRateLimiter } from './middlewares/rate-limiter.middleware';
import { prometheusMetrics } from './middlewares/prometheus.metrics.middleware';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// to log incoming requests to the console, which can be useful for debugging
app.use(logger);

// to enable Prometheus metrics collection, which allows you to monitor the performance and health of your application.
app.use(prometheusMetrics);

// to protect your application from common web vulnerabilities by setting appropriate HTTP headers.
app.use(helmet());

// to register the Prometheus metrics endpoint, which allows Prometheus to scrape metrics from your application.
// apply this before cors middleware to ensure that the metrics endpoint is accessible.
app.use('/monitoring', metricRoutes);

// to enable Cross-Origin Resource Sharing (CORS) for your application, allowing it to accept requests from different origins.
app.use(cors);

// to parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.
app.use(express.json());

// to check if any query parameters have multiple values and throws an error if it detects such pollution
app.use(detectParameterPollution);

// to generate a unique request ID for each incoming request, which can be useful for tracking and debugging purposes.
app.use(requestId());

// to compress the response bodies of HTTP requests, which can help reduce the size of the response and improve performance.
app.use(compression());

// to validate the Content-Type header of incoming requests
app.use(validateContentType('application/json'));

// register all routes
app.use('/auth', loginRateLimiter, authRoutes);
app.use('/api/notes', generalRateLimiter, authenticateJWT, noteRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// to handle requests for resources that are not found
app.use(notFoundResource);

// to handle errors that occur in your application
app.use(errorHandler);

export default app;
