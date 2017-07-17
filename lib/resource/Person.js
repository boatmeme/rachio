const Resource = require('./Resource');
const Device = require('./Device');

class Person extends Resource {
  constructor(dataStore, data) {
    super('person/{id}', dataStore, data, { devices: Device });
  }

  getCurrentlyLoggedIn() {
    return this.get({ id: 'info' })
      .then(({ id }) => this.get({ id }));
  }
}

module.exports = Person;
