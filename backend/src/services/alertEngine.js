const lastAlertAt = new Map();
const DEBOUNCE_MS = Number(process.env.ALERT_DEBOUNCE_MS || 300000); // 5 minutes

const thresholds = {
  temperature: { min: 20, max: 30 },
  ph: { min: 6.5, max: 8.0 },
  ammonia: { max: 0.5 },
  do: { min: 5 },
  waterLevel: { min: 30 }
};

function nowTs() { return Date.now(); }

module.exports = function alertEngine(data, mqttClient, wss) {
  for (const [metric, t] of Object.entries(thresholds)) {
    const v = data[metric];
    if (v === undefined || v === null || Number.isNaN(v)) continue;
    let trigger = false;
    let level = 'OK';
    if (t.min !== undefined && v < t.min) { trigger = true; level = 'LOW'; }
    if (t.max !== undefined && v > t.max) { trigger = true; level = 'HIGH'; }
    if (trigger) {
      const key = `${data.tankId}:${metric}:${level}`;
      const last = lastAlertAt.get(key) || 0;
      if (nowTs() - last < DEBOUNCE_MS) continue; // debounce
      lastAlertAt.set(key, nowTs());
      const alert = { id: key + ':' + nowTs(), tankId: data.tankId, metric, level, value: v, ts: new Date().toISOString() };
      console.warn('[ALERT]', alert);
      // publish to mqtt alerts topic
      try { mqttClient && mqttClient.publish(`tanks/${data.tankId}/alerts`, JSON.stringify(alert), { qos: 1 }); } catch(e) {}
      // broadcast to websocket clients
      try { wss && wss.broadcast({ type: 'alert', alert }); } catch(e) {}
    }
  }
};
