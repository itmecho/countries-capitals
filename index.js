'use strict';

const countriesArray = require('./countries');
const randomItem = require('random-item');
const isEmpty = require('lodash.isempty');

class Countries {
  constructor(countries = countriesArray) {
    this.countries = countries;
    this.original = countries;
  }

  list() {
    return this.original;
  }

  reset() {
    this.countries = this.original;
    return this;
  }

  containString(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase());
  }

  isValidInput(input) {
    return typeof input === 'string' || input === null;
  }

  byName(name) {
    if (isEmpty(name) || !this.isValidInput(name)) {
      return this;
    }

    this.countries = this.countries.filter(({ country }) => this.containString(country, name));
    return this;
  }

  byCapital(capital) {
    if (!this.isValidInput(capital)) {
      return this;
    }

    this.countries = this.countries.filter(({ city }) => {
      if (capital === null) {
        return city === null;
      }

      if (city === null) {
        return false;
      }

      return this.containString(city, capital);
    });

    return this;
  }

  byLocation(region) {
    if (!this.isValidInput(region)) {
      return this;
    }

    this.countries = this.countries.filter(({ location }) => {
      if (region === null) {
        return location === null;
      }

      if (location === null) {
        return false;
      }

      return this.containString(location, region);
    });

    return this;
  }

  locations() {
    return [...new Set(this.original.map(item => item.location).filter(Boolean))].sort();
  }

  byIndependence(year, operator) {
    if (!(typeof year === 'number' || year === null)) {
      return this;
    }

    const validOperators = ['=', '>', '>=', '<', '<='];
    const op = validOperators.includes(operator) ? operator : '=';

    this.countries = this.countries.filter(({ independence }) => {
      if (year === null) {
        return independence === null;
      }

      if (independence === null) {
        return false;
      }

      return this.compare(independence, op, year);
    });

    return this;
  }

  compare(firstValue, operator, secondValue) {
    switch (operator) {
      case '>': return firstValue > secondValue;
      case '>=': return firstValue >= secondValue;
      case '<': return firstValue < secondValue;
      case '<=': return firstValue <= secondValue;
      default: return firstValue == secondValue;
    }
  }

  toJson() {
    return this.countries;
  }

  get capital() {
    const countriesFound = this.countries.length;

    if (!countriesFound) {
      throw new Error('Country not found');
    }

    if (countriesFound === 1) {
      return this.countries[0].city;
    }

    return randomItem(this.countries).city;
  }
}

module.exports = Countries;
