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

#### Conventions & Hints
 - All calls are in the context of the api token used to instantiate the client
 - All functions return native Promises unless otherwise noted
 - All resource objects implement ```.toPlainObject()``` and ```.toJson()``` functions that can aid in application / development / debugging.
 - Don't instantiate the Resource classes directly. Always get an instance from the ```RachioClient``` or returned from a method on another Resource instance.
 - There are often multiple ways to accomplish the same tasks in this library. For instance, the ```RachioClient``` provides entry points to every resource class provided you know the ids, but as you're learning and exploring the API, it might help to consider a relational approach, i.e., use the ```RachioClient``` to get ```Devices``` to get ```Zones```, etc.

#### Classes
- [RachioClient](#rachioclient)
- [Device](#device)
- [Zone](#zone)
- [MultiZone](#multizone)
- CurrentConditions
- CurrentSchdeule
- Event
- Forecast
- Person
- ScheduleItem
- ScheduleRule
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
#### getScheduleRule(scheduleRuleId)
Gets the ```ScheduleRule``` for the given id
#### getFlexScheduleRule(flexScheduleRuleId)
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
 - A ```Promise``` resolving to ```true``` if the device is currently watering
 - A ```Promise``` resolving to ```false``` if the device is not currently watering

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

## stopWater ( )
##### returns
 - ```true```

##### Use Case
- Tell the device to halt any currently running watering activity

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.stopWater())
  .then(success => console.log(success));
```

###### output
```
true
```

## getActiveZone ( )
##### returns
 - a ```Promise``` to return a ```Zone``` object that is currently watering.
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

## standbyOn ( )
##### returns
- a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Tell the device to stand-by and cease running any current or future scheduled activity

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.standbyOn())
  .then(success => console.log(success));
```

###### output
```
true
```

## standbyOff ( )
##### returns
- a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Tell the device to resume all scheduled activity, if it was previously in stand-by mode

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.standbyOff())
  .then(success => console.log(success));
```

###### output
```
true
```

## rainDelay (durationInSeconds)
##### parameters
- **durationInSeconds** (_default = 1 day_), a ```Number``` representing the number of seconds from now you would like the rain delay to persist
##### returns
- a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Set a rain delay for the next 8 hours

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';
const duration = 28800; // 8 hours, in seconds

client.getDevice(deviceId)
  .then(device => device.rainDelay(duration))
  .then(success => console.log(success));
```

###### output
```
true
```

## rainDelayCancel ()
##### returns
- a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Cancel a previously set rain delay

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.rainDelayCancel())
  .then(success => console.log(success));
```

###### output
```
true
```

#### Tip
- This is equivalent to calling ```Device.rainDelay(0)```


## getEvents (startTime, endTime, filters)
##### parameters
- **startTime** (_optional_), a ```Number``` representing the Unix time in milliseconds for which you would like to start your event filter
  - Cannot be a number < 28 days from present
- **endTime** (_optional_), a ```Number``` representing the Unix time in milliseconds for which you would like to end your event filter
- **filters** (_optional_), an ```Object``` whose properties and values you would like to use as a filter for events.

##### returns
 - a ```Promise``` to return an ```Array``` of device ```Event``` objects that match your specified filters

##### Use Case
- Show me every time my ```Device``` has set a rain delay in the past week

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';
const endTime = Date.now();
const startTime = endTime - 604800000; // 1 Week in millis
const filters = {
  category: 'DEVICE',
  type: 'RAIN_DELAY',
  subType: 'RAIN_DELAY_ON'
};

client.getDevice(deviceId)
  .then(device => device.getEvents(startTime, endTime, filters))
  .then(events => events.forEach(e => console.log(e.toPlainObject())));
```
###### output
```
...
{ createDate: 1499458409090,
  lastUpdateDate: 1499458409090,
  id: '15117336-668c-4f74-a162-efc9c36f95ea',
  deviceId: '2a5e7d3c-c140-4e2e-91a1-a212a518adc5',
  category: 'DEVICE',
  type: 'RAIN_DELAY',
  eventDate: 1499458409090,
...
  iconUrl: 'http://media.rach.io/icons/api/rain-delay-activated.png',
  summary: 'Rain delay active until Saturday, July 8 02:13 PM',
  subType: 'RAIN_DELAY_ON',
  hidden: false,
  topic: 'DEVICE' }
...
```

#### Tip
- I haven't seen great documentation on the possible event types / values. The best way to figure out what's available to you with Events is to just call ```Device.getEvents()``` and explore the data returned from your device.

## getForecast (startTime, endTime, filters)
##### parameters
- **startTime** (_optional_), a ```Number``` representing the lower-bound Unix time in milliseconds for which you would like to fetch the forecasts. _Rounds down to 00:00 of the day represented by the timestamp_
- **endTime** (_optional_), a ```Number``` representing the upper-bound Unix time in milliseconds for which you would like to fetch the forecasts. _Rounds up to 23:59 of the day represented by the timestamp_
- **units** (_defaults to "US"_), a ```String``` with the value of ```US``` or ```METRIC```, determining the forecast data representation

##### returns
 - a ```Promise``` to return an ```Array``` of device ```Forecast``` objects that match your specified parameters

##### Use Case
- See the next 3 days of forecast data for your device

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';
const startTime = Date.now();
const endTime = startTime + 259200000; // 3 days in millis

client.getDevice(deviceId)
  .then(device => device.getForecast(startTime, endTime))
  .then(forecasts => forecasts.forEach(f => console.log(f.toPlainObject())));
```
###### output
```
...
{ localizedTimeStamp: 1500296400000,
  precipIntensity: 0,
  precipProbability: 0.1,
  temperatureMin: 64.4,
  temperatureMax: 91.4,
  windSpeed: 4.34,
  humidity: 0.55,
  cloudCover: 0.31,
  dewPoint: 51.8,
  weatherType: 'partly-cloudy-day',
  unitType: 'US',
  weatherSummary: 'Partly Cloudy with Isolated Storms',
  iconUrl: 'http://media.rach.io/images/weather/v2/active_partly_cloudy_day_2x.png',
  icons: {},
  calculatedPrecip: 0,
  prettyTime: '2017-07-17T13:00:00Z',
  time: 1500296400 }
...
```

#### Tip
- When called with no parameters, ```Device.getForecast()``` will return the next 14 days of ```Forecast``` objects

## getForecastToday (units)
##### parameters
- **units** (_defaults to "US"_), a ```String``` with the value of ```US``` or ```METRIC```, determining the forecast data representation

##### returns
 - a ```Promise``` to return a ```Forecast``` object for today

## getForecastTomorrow (units)
##### parameters
- **units** (_defaults to "US"_), a ```String``` with the value of ```US``` or ```METRIC```, determining the forecast data representation

##### returns
- a ```Promise``` to return a ```Forecast``` object for tomorrow

## getForecastNextRain (probabilityThreshold, units)
##### parameters
- **probabilityThreshold** (_defaults to 0.25_), a ```Number``` representing the probability threshold beyond which to classify a Forecast as "rainy"
- **units** (_defaults to "US"_), a ```String``` with the value of ```US``` or ```METRIC```, determining the forecast data representation

##### returns
 - a ```Promise``` to return the earliest ```Forecast``` object that it is projected to rain within the next 14 days


## getForecastTomorrow (units)
##### parameters
- **units** (_defaults to "US"_), a ```String``` with the value of ```US``` or ```METRIC```, determining the forecast data representation

##### returns
- a ```Promise``` to return a ```Forecast``` object for tomorrow

# Zone

## getDevice ( )
##### returns
 - a ```Promise``` to return the parent ```Device``` to which this zone belongs

##### Use Case
- I need to get from ```Zone``` objects, back to ```Device``` objects

##### Example
###### code
```
const zoneId = 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a';

client.getZone(zoneId)
  .then(zone => device.getDevice())
  .then(device => console.log(`${d.name} : ${d.model} : ${d.id}`));
```

###### output
```
Rachio-Garage : 8ZR2ULW : 2a5e7d3c-c140-4e2e-91a1-a212a518adc5
```

## isWatering ( )
##### returns
 - a ```Promise``` to return a ```Boolean```, ```true``` if the zone is currently watering, ```false``` otherwise

##### Use Case
- Tell me if a specific zone is watering.

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';

client.getDevice(deviceId)
  .then(device => device.getZones())
  .then([zone1, zone2, ...rest] => zone2.isWatering());
  .then(console.log);
```
I look out the window and see zone 2 watering...
###### output
```
true
```

## start (durationInSeconds)
##### parameters
- **durationInSeconds** (_defaults to 60_), a ```Number``` representing the minutes that this zone should water, beginning now.

##### returns
 - a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Start a zone watering, right now

##### Example
###### code
```
const zoneId = 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a';
const durationInSeconds = 300;

client.getZone(zoneId)
  .then(zone => zone.start(durationInSeconds))
  .then(console.log);
```
###### output
```
true
```

## stop ()
##### returns
 - a ```Promise``` that resolves to a ```Boolean``` dependent on the success of the operation

##### Use Case
- Stop a zone that is currently watering

##### Example
###### code
```
const zoneId = 'f0e042bd-7ba1-4aba-bede-6d8b16857d3a';

client.getZone(zoneId)
  .then(zone => zone.stop())
  .then(console.log);
```
###### output
```
true
```

#### Tip
- This is the same as calling ```Device.stopWater()```, and as such it will also stop all other zones that may be currently watering or were scheduled for a manual run (i.e., from a MultiZone.start())

# MultiZone

This class is used for operations that span multiple zones such as manually starting one or more zones for immediate watering. The best way to work with this class is to first obtain an instance from the ```RachioClient``` as here:

```
...
const multi = client.multiZone();
...
```

_Note that this function is synchronous and does not return a ```Promise```_

## add (zone, durationInSeconds )
##### parameters
- **zone**, a ```Zone``` - or ```Object``` with a property ```id``` - representing the zone you would like to add to the multi zone operation
- **durationInSeconds** (_defaults to 60_), a ```Number``` representing the minutes that this zone should water, beginning now.

##### returns
 - a ```MultiZone``` itself, allowing you to chain multiple ```add()``` calls together to compose your multi zone operation
  - _Note that this function is synchronous and does not return a ```Promise```_

##### Use Case
- see ```MultiZone.start()``` below

##### Example
- see ```MultiZone.start()``` below

## start ()
##### returns
 - A ```Promise``` resolving to ```true``` if the operation is successful

##### Use Case
- I want to water all of the zones on my device, immediately, for 5 minutes each

##### Example
###### code
```
const deviceId = '2a5e7d3c-c140-4e2e-91a1-a212a518adc5';
const durationInSeconds = 300;

client.getDevice(deviceId)
  .then(device => device.getZones())
  .then(zones => zones.reduce((multi, zone) => multi.add(zone, durationInSeconds), client.multiZone()))
  .then(multi => multi.start())
  .then(console.log);
```
###### output
```
true
// Looking out my window, I notice each of the zones watering for 5 minutes, in numerical order
```

# ScheduleRule

TODO: Documentation

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
