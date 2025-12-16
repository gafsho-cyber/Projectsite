const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');
module.exports = client;
