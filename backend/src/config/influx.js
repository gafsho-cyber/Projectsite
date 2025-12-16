const Influx = require('influx');
const client = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST || 'localhost',
  database: process.env.INFLUX_DB || 'aquaponics'
});

// ensure DB exists (best effort)
client.getDatabaseNames()
  .then(names => { if (!names.includes(process.env.INFLUX_DB || 'aquaponics')) return client.createDatabase(process.env.INFLUX_DB || 'aquaponics'); })
  .catch(err => console.warn('[Influx] getDatabaseNames error', err));

async function writePoint(data) {
  // data: { tankId, timestamp, temperature, ph, ammonia, do, waterLevel }
  const point = {
    measurement: 'readings',
    tags: { tankId: data.tankId },
    fields: {
      temperature: data.temperature || null,
      ph: data.ph || null,
      ammonia: data.ammonia || null,
      do: data.do || null,
      waterLevel: data.waterLevel || null
    },
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
  };
  try {
    await client.writePoints([point]);
  } catch (e) {
    console.error('[Influx] writePoints error', e);
  }
}

module.exports = { writePoint };
