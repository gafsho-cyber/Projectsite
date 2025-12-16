const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const mqtt = require('mqtt');
const influx = require('./config/influx');
const processData = require('./services/dataProcessor');
const alertEngine = require('./services/alertEngine');

const MQTT_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8081;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Aquaponics backend running'));

// WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });
wss.on('connection', (ws) => {
  console.log('[WS] client connected');
  ws.send(JSON.stringify({ msg: 'welcome' }));
});
wss.broadcast = (data) => {
  const s = JSON.stringify(data);
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(s);
  });
};

// MQTT client
const client = mqtt.connect(MQTT_URL);
client.on('connect', () => {
  console.log('[MQTT] connected to', MQTT_URL);
  client.subscribe('tanks/+/sensor', { qos: 1 }, (err) => {
    if (err) console.error('[MQTT] subscribe error', err);
    else console.log('[MQTT] subscribed to tanks/+/sensor');
  });
});
client.on('error', (e) => console.error('[MQTT] error', e));

client.on('message', async (topic, message) => {
  try {
    const payloadStr = message.toString();
    let payload;
    try { payload = JSON.parse(payloadStr); } catch(e) { console.warn('[MQTT] non-JSON payload'); payload = {}; }
    const data = processData(topic, payload);
    // write to influx
    await influx.writePoint(data);
    // run alert engine
    alertEngine(data, client, wss);
    // broadcast via websocket
    wss.broadcast({ type: 'sensor:update', data });
  } catch (err) {
    console.error('[MQTT] message handler error', err);
  }
});

app.listen(HTTP_PORT, () => console.log(`[HTTP] API running on ${HTTP_PORT}`));
console.log(`[WS] WebSocket server running on ${WS_PORT}`);
