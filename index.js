'use strict';

const countriesArray = require('./countries');
const randomItem = require('random-item');

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

  locations() {
    return [...new Set(this.original.map(item => item.location).filter(Boolean))].sort();
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
