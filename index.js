const countries = require('./countries');
const randomItem = require('random-item');

class Countries {
  constructor(countries = countries) {
    this.countries = countries;
    this.original = countries;
  }

  list() {
    return this.original;
  }

  byName(name) {
    this.countries = this.countries.filter(item => item.country.toLowerCase().includes(name.toLowerCase()));
    return this;
  }

  byCapital(city) {
    this.countries = this.countries.filter(item => {
      if (item.city === null) {
        return false;
      }

      return item.city.toLowerCase().includes(city.toLowerCase());
    });

    return this;
  }

  byLocation(region) {
    this.countries = this.countries.filter(item => {
      if (item.location === null) {
        return false;
      }

      return item.location.toLowerCase().includes(region.toLowerCase());
    });

    return this;
  }

  byIndependence(year, operator) {
    const validOperators = ['=', '>', '>=', '<', '<='];
    let op = '=';

    if (validOperators.includes(operator)) {
      op = operator;
    }

    this.countries = this.countries.filter(item => {
      if (item.independence === null) {
        return false;
      }

      return this.compare(item.independence, op, year);
    });

    return this;
  }

  reset() {
    this.countries = this.original;
    return this;
  }

  toJson() {
    return this.countries;
  }

  get val() {
    const countriesFound = this.countries.length;

    if (!countriesFound) {
      throw new Error('Country not found');
    }

    if (countriesFound === 1) {
      return this.countries[0].city;
    }

    return randomItem(this.countries).city;
  }

  // https://stackoverflow.com/a/2042711/2614584
  compare(post, operator, value) {
    switch (operator) {
      case '>': return post > value;
      case '<': return post < value;
      case '>=': return post >= value;
      case '<=': return post <= value;
      default: return post == value;
    }
  }
}

module.exports = new Countries(countries);