import express from 'express';
import cors from 'cors';
import { AgentKernel } from './agentKernel.js';
import { TelemetrySimulator } from './telemetry.js';

const app = express();
const kernel = AgentKernel.getInstance();
const telemetry = TelemetrySimulator.getInstance();

app.use(cors());
app.use(express.json());

app.get('/agent/status', (req, res) => {
  res.json({ status: kernel.getStatus() });
});

app.post('/agent/scan', async (req, res) => {
  await kernel.runCycle();
  res.json({ success: true });
});

app.get('/agent/diagnostics', (req, res) => {
  res.json(kernel.getBeliefState());
});

app.get('/agent/actions', (req, res) => {
  res.json(kernel.getPendingActions());
});

app.post('/agent/actions/:id/approve', (req, res) => {
  kernel.approveAction(req.params.id);
  res.json({ success: true });
});

app.post('/agent/actions/:id/reject', (req, res) => {
  kernel.rejectAction(req.params.id);
  res.json({ success: true });
});

app.get('/agent/logs', (req, res) => {
  res.json(kernel.getLogs());
});

app.get('/agent/signals', (req, res) => {
  res.json(telemetry.getSignals());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ AEGIS Backend running on http://localhost:${PORT}`);
  kernel.runCycle();
});
