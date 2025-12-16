const mqtt = require('mqtt');
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');
const tanks = process.env.SIM_TANKS ? process.env.SIM_TANKS.split(',') : ['tank1','tank2'];
const intervalMs = Number(process.env.SIM_INTERVAL_MS || 2000);

client.on('connect', () => {
  console.log('[SIM] connected to MQTT');
  setInterval(publishCycle, intervalMs);
});

function publishCycle() {
  const ts = new Date().toISOString();
  for (const tank of tanks) {
    const payload = {
      temperature: +(22 + Math.random()*6).toFixed(2),
      ph: +(6.8 + (Math.random()-0.5)*0.4).toFixed(2),
      ammonia: +(Math.random()*0.6).toFixed(3),
      do: +(5 + Math.random()*2).toFixed(2),
      waterLevel: +(30 + Math.random()*10).toFixed(2),
      ts
    };
    client.publish(`tanks/${tank}/sensor`, JSON.stringify(payload), { qos: 1 }, ()=>{});
  }
}
