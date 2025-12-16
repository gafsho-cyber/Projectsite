module.exports = function processData(topic, payload) {
  // topic format: tanks/{tankId}/sensor
  const parts = topic.split('/');
  const tankId = parts[1] || 'unknown';
  // normalize keys: accept various casings
  const normalized = {};
  if (payload.temperature !== undefined) normalized.temperature = Number(payload.temperature);
  if (payload.temp !== undefined) normalized.temperature = Number(payload.temp);
  if (payload.pH !== undefined) normalized.ph = Number(payload.pH);
  if (payload.ph !== undefined) normalized.ph = Number(payload.ph);
  if (payload.ammonia !== undefined) normalized.ammonia = Number(payload.ammonia);
  if (payload.DO !== undefined) normalized.do = Number(payload.DO);
  if (payload.do !== undefined) normalized.do = Number(payload.do);
  if (payload.waterLevel !== undefined) normalized.waterLevel = Number(payload.waterLevel);
  if (payload.water_level !== undefined) normalized.waterLevel = Number(payload.water_level);
  return Object.assign({ tankId, timestamp: new Date().toISOString() }, normalized);
};
