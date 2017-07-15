const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

client.getDevices()
  .then(devices => Promise.all(devices.map(d => d.getZones())))
  .then(zonesByDevice =>
    zonesByDevice.forEach(zones =>
      zones.forEach(z => console.log(`${z.name} : ${z.zoneNumber} : ${z.enabled} : ${z.id}`))));
