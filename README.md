# rachio [![npm version](https://badge.fury.io/js/rachio.svg)](https://badge.fury.io/js/rachio)

Node.js client for Rachio Smart Sprinkler controller

_Note: Development in progress. npm version 0.0.1 has no exposed api and is therefore useless. Follow the [changelog](https://github.com/boatmeme/rachio/blob/master/CHANGELOG.md) for progress, or clone the repo if you're so inclined._

---
## Install

```
npm install rachio
```

## Usage

```javascript
const RachioApi = require('rachio');
const rachio = new RachioApi('[YOUR-API-TOKEN]');
```
# API

#### Conventions
 - All calls are in the context of the api token used to instantiate the client
 - All functions return native Promises.

---
## getDevices (  )
Returns an array of all Rachio devices associated to the API token

##### Example

## getDevice ( device_id )
Returns information about the specified *device_id*

##### Example

## getDeviceEvents ( device_id, startTime, endTime [, filters] )
Returns an array of all events from the specified *device_id*, between the _startTime_ and _endTime_.
Both the _startTime_ and _endTime_ parameters are numbers representing the desired times as Unix epoch in milliseconds.

Optionally, you can specify a the parameter _filters_, an Object used to filter the results according to its property names and values.

##### Example Code
```
rachio.getDeviceEvents( 'my-device-id', 1497877200000, 1497963600000, { category: "DEVICE" } )
  .then( events => {
      // ...do something with the events...
  });
```
##### Example Response
```
[ { createDate: 1497230972140,
    lastUpdateDate: 1497230972140,
    id: 'some-event-id1',
    deviceId: 'some-device-id',
    category: 'DEVICE',
    type: 'RAIN_DELAY',
    eventDate: 1497230972140,
    eventDatas: [ [Object], [Object], [Object] ],
    iconUrl: 'http://media.rach.io/icons/api/rain-delay-activated.png',
    summary: 'Rain delay active until Monday, June 12 08:26 PM',
    subType: 'RAIN_DELAY_ON',
    hidden: false,
    topic: 'DEVICE' },
  { createDate: 1497220229669,
    lastUpdateDate: 1497220229669,
    id: 'some-event-id2',
    deviceId: 'some-device-id',
    category: 'DEVICE',
    type: 'DEVICE_STATUS',
    eventDate: 1497220229669,
    eventDatas: [ [Object] ],
    iconUrl: 'http://media.rach.io/icons/api/power-cycle.png',
    summary: 'Device status power cycle',
    subType: 'COLD_REBOOT',
    hidden: false,
    topic: 'DEVICE' } ]
```

## getDeviceCurrentSchedule ( device_id )

##### Example

## getDeviceCurrentConditions ( device_id )

##### Example

## getDeviceForecast ( device_id [, startTime, endTime, units] )

##### Example

## getDeviceForecastToday ( device_id )

##### Example

## getZonesByDevice ( device_id )

Returns an array of zones for the specified *device_id*

##### Example

## Development

### Todo

- Refactor existing api after I get a better feel for the relationships between the entities. Will publish 0.0.2 to NPM after I settle on a better api representation.
- Mock the backing Rachio Api for testing
- Start implementing PUTs / POSTs / DELETEs
- Fill in gaps in the backing Rachio Api, where useful. Ex. there's no endpoint for getting devices, but we can glue it together by calling /person/info followed by /person/:id, and taking the device list from there
- Better, friendlier date handling. The client-facing api doesn't have to be exclusively epoch-based.
- Documentation, documentation...
- Continuous integration

#### Testing

I need to mock out some stubs for the Api, as I've currently been running them as Integration Tests against my personal Rachio device - not ideal. That said, you can run the tests yourself by setting an environment variable *RACHIO\_API\_TOKEN* with the value of the api access token from the Rachio Web App.

```
RACHIO_API_TOKEN=MY-API-TOKEN npm run mocha
```

## License

    MIT License

    Copyright (c) 2017 Jonathan Griggs

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
