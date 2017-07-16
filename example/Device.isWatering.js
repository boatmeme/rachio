const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

client.getDevices()
  .then(devices => devices.map(d => d.isWatering()))
  .then(waterStatuses =>
    waterStatuses.forEach(isWatering => console.log( isWatering
      ? "The lunatic is on the grass"
      : "The lunatic is in my head")))
  .catch(console.error);
