const RachioClient = require('../');

const apiToken = process.env.RACHIO_API_TOKEN || 'YOUR_API_TOKEN';
const client = new RachioClient(apiToken);

client.getDevices()
  .then(devices => Promise.all(devices.map(d => d.getForecast())))
  .then(forecastsByDevice =>
    forecastsByDevice.forEach(forecasts =>
      forecasts.forEach(f => console.log(f.toPlainObject()))))
  .catch(console.error);
