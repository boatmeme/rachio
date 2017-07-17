const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

client.getDevices()
  .then(devices =>
    devices.forEach(d =>
      console.log(`${d.name} : ${d.model} : ${d.id}`)))
  .catch(console.error);
