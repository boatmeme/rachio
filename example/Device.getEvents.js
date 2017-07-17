const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

client.getDevices()
  .then(devices => Promise.all(devices.map(d => d.getEvents())))
  .then(eventsByDevice =>
    eventsByDevice.forEach(events =>
      events.forEach(e => console.log(e.toPlainObject()))))
  .catch(console.error);
