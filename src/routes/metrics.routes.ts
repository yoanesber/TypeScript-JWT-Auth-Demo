import Router from 'express';
import client from 'prom-client';


/**
 * Metrics routes for Prometheus monitoring.
 * This module defines the route for exposing application metrics to Prometheus.
 * It initializes the Prometheus client and collects default metrics.
 */
const router = Router();

// Inisialisasi registry dan default metrics hanya sekali
client.collectDefaultMetrics();
const register = client.register;

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
