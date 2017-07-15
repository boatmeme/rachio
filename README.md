# rachio [![npm version](https://badge.fury.io/js/rachio.svg)](https://badge.fury.io/js/rachio) [![Build Status](https://travis-ci.org/boatmeme/rachio.svg?branch=master)](https://travis-ci.org/boatmeme/rachio) [![codecov](https://codecov.io/gh/boatmeme/rachio/branch/master/graph/badge.svg)](https://codecov.io/gh/boatmeme/rachio) [![Beerpay](https://beerpay.io/boatmeme/rachio/make-wish.svg?style=flat)](https://beerpay.io/boatmeme/rachio?focus=wish)

Node.js client for the Rachio Smart Sprinkler controller

---
## Requirements

- [Rachio Smart Sprinkler Controller](http://rachio.com/)
- [Rachio Api Key](https://rachio.readme.io/docs/authentication)
- [Node.js v6.0.0 or Greater](https://nodejs.org)
---
## Install

```
npm install rachio
```

## Usage

```javascript
const RachioClient = require('rachio');
const client = new RachioClient('[YOUR-API-TOKEN]');
```
# API

#### Conventions
 - All calls are in the context of the api token used to instantiate the client
 - All functions return native Promises unless otherwise noted
 - All resource objects implement ```.toPlainObject()``` and ```.toJson()``` functions that can aid in application / development / debugging.
 - There are often multiple ways to accomplish the same tasks in this library. For instance, the ```RachioClient``` provides entry points to every resource class provided you know the ids, but as you're learning and exploring the API, it might help to consider a relational approach, i.e., use the ```RachioClient``` to get ```Devices``` to get ```Zones```, etc.

#### Classes
- [RachioClient](#rachioclient)
- Device
- Zone
- MultiZone
- CurrentConditions
- Forecast
-
---

# RachioClient

This is the entry point for all of your interaction with the Rachio API. Most programs should start by getting an instance of the client using your [Rachio Api Key](https://rachio.readme.io/docs/authentication).

```
const RachioClient = require('rachio');
const client = new RachioClient('YOUR-API-KEY');

// ... Do something useful
```

All subsequent code examples will presume you have an instance of ```RachioClient``` assigned to the variable ```client``` in the current application scope.

### Methods

## getDevices ( )
##### returns
 - a ```Promise``` to return an ```Array``` of ```Device``` objects

##### Use Case
- Get a list of all Rachio devices associated with the API token

##### Example
###### code
```
client.getDevices()
  .then(devices =>
    devices.forEach(d =>
      console.log(`${d.name} : ${d.model} : ${d.id}`)));
```
###### output
```
Rachio-Garage : 8ZR2ULW : 2a5e7d3c-c140-4e2e-91a1-a212a518adc5
Rachio-Backyard : 8ZR2ULW : 8de4dbf6-7a52-43b0-9c18-7d074b868f67
```

## getDevice ( device_id )
##### parameters
- a ```String``` representing a device id

##### returns
 - a ```Promise``` to return a ```Device``` object

##### Use Case
- Gets a device so that its properties can be inspected and actions can be performed upon it.

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device =>
    console.log(`${device.name} : ${device.model} : ${device.id}`));
```
###### output
```
Rachio-Garage : 8ZR2ULW : 2a5e7d3c-c140-4e2e-91a1-a212a518adc5
```

## Other Methods

As mentioned earlier, the RachioClient provides direct access to every resource class represented in the public API. More detail on how these work will be covered in the documentation for the individual resources

#### getPersonInfo()
Returns information about the currently authenticated user
#### getDeviceEvents(deviceId, startTime, endTime, filters)
Retrieves a list of events for the given device id
#### getDeviceCurrentConditions(deviceId, units)
The ```CurrentConditions``` as reported by your Rachio's preferred PWS
#### getDeviceForecast(deviceId, startTime, endTime, units)
The forecasted conditions reported between the start and end dates
#### getDeviceForecastToday(deviceId, units)
Today's ```Forecast``` for the device
#### getDeviceForecastTomorrow(deviceId, units)
Tomorrow's ```Forecast``` for the device
#### getZonesByDevice(deviceId)
Get all ```Zone``` objects for the specified device
#### getZone(zoneId)
Gets the ```Zone``` specified by the zoneId
#### multiZone()
Gets a new instance of ```MultiZone``` for operations across multiple zones
### getScheduleRule(scheduleRuleId)
Gets the ```ScheduleRule``` for the given id
### getFlexScheduleRule(flexScheduleRuleId)
Gets the ```FlexScheduleRule``` for the given id

# Device

## getZones ( )
##### returns
 - a ```Promise``` to return an ```Array``` of ```Zone``` objects

##### Use Case
- Get a list of all zones associated with the ```Device```

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.getZones())
  .then(zones =>
    zones.forEach(z =>
      console.log(`${z.name} : ${z.zoneNumber} : ${z.enabled} : ${z.id}`)));
```
###### output
```
Zone 1 - Front Door  : 1 : true : ec47f4a6-5771-4d8f-834a-89bc7d889ea4
Zone 2 - Front West : 2 : true : f0e042bd-7ba1-4aba-bede-6d8b16857d3a
Zone 3 - Garage Front : 3 : true : f0e042bd-7ba1-4aba-bede-6d8b16857d3a
Zone 4 - Garage Side : 4 : true : 8de4dbf6-7a52-43b0-9c18-7d074b868f67
Zone 5 - Back Door  : 5 : true : 1f3759cf-8722-4331-8859-aef4e328ce51
Zone 6 - Back Yard : 6 : false : 5bb1b267-7c0d-40a3-b532-d3b4e616c280
Zone 7 : 7 : false : 34c2b94a-2be0-46bd-83af-cc63daa8047c
Zone 8 : 8 : false : d8bd46d1-77ab-4c15-8aa1-b5a529897b37
```

## isWatering ( )
##### returns
 - ```true``` if the device is currently watering
 - ```false``` if the device is not currently watering

##### Use Case
- Are any of the zones on the device currently watering?

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.isWatering())
  .then(isWatering => console.log( isWatering
    ? "The lunatic is on the grass"
    : "The lunatic is in my head"));
```
..._Looking outside, I see zone 5 watering_...
###### output
```
The lunatic is on the grass
```

## getActiveZone()
##### returns
 - a ```Promise``` to return a ```Zone``` objects that is currently watering.
 - ```false``` if no zone is currently watering

##### Use Case
- Get me the zone that is watering right now

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.getActiveZone())
  .then(activeZone => console.log( activeZone
    ? "The lunatic is in ${activeZone.name}"
    : "The lunatic is in my head"));
```
..._Looking outside, I see zone 5 watering_...
###### output
```
The lunatic is in Zone 5 - Back Door
```

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

### Debug

To turn on debugging logs, set the environment variable ```DEBUG=rachio.*``` when starting your nodejs process.

### Todo

- Implement Webhook / Notifications API
- Better, friendlier date handling. The client-facing api doesn't have to be exclusively epoch-based.
- Better documentation and examples
- Explore packaging as a general javascript library (work from browser or node)
- Consider a transpiler to broaden support to older versions of Node.js

#### Testing

```
npm run mocha
```

## Support on Beerpay
Contributions to the :beers: fund are much appreciated!

[![Beerpay](https://beerpay.io/boatmeme/rachio/badge.svg?style=beer-square)](https://beerpay.io/boatmeme/rachio)

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
