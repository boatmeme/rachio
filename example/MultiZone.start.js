const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

// I'm going to grab all of the zones from my first device
// and water each for 10 minutes
const durationInSeconds = 600;

client.getDevices()
  .then(([{ zones }]) =>
    zones.reduce((multi, zone) => multi.add(zone, durationInSeconds), client.multiZone()))
  .then(multi => multi.start())
  .catch(console.error);
