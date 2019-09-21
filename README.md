# Countries Capitals
📦 🇧🇷 A simple package to get the capital of the countries

![Travis (.org)](https://img.shields.io/travis/chgasparoto/countries-capitals?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/chgasparoto/countries-capitals?style=flat-square)
![npm](https://img.shields.io/npm/v/countries-capitals?style=flat-square)
![npm](https://img.shields.io/npm/dw/countries-capitals?style=flat-square)
![NPM](https://img.shields.io/npm/l/countries-capitals?style=flat-square)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/chgasparoto/countries-capitals.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/chgasparoto/countries-capitals/context:javascript)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release?style=flat-square)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli?style=flat-square)
![udemy](https://img.shields.io/badge/udemy--course-countries--capitals-red?style=flat-square)

## Getting Started

### Prerequisites

```sh
node -v
node: v8.3
```

## Installing

#### Using npm
```sh
npm install --save countries-capital
```

#### Using Yarn
```sh
yarn add countries-capital
```

## How to use

```js
const Countries = require('countries-capital')
const countries = new Countries()

// filter by name
const brazil = countries.byName('brazil')

/**
 * Get all country data:
  [{
    "country": "Brazil",
    "city": "Brasília",
    "independence": "1822",
    "location": "South America"
  }]
*/
brazil.toJson()

// get capital
brazil.capital // Brasília

// resetting the filter
countries.reset()

// filter by location and independence year
countries.byLocation('europe').byIndependence(1900, '>=')

/**
 * Get all countries data:
  [{
    "country": "Bulgaria",
    "city": "Sofia",
    "independence": "1908",
    "location": "Eastern Europe"
  },
  {...},
  {...}
  ]
*/
countries.toJson()

// When country has more than one country after applying the filter it returns a random capital every time it calls .capital
countries.capital // Sofia
countries.capital // ...
countries.capital // ...
countries.capital // ...
```

## Full API Reference

```js
const Countries = require('countries-capital')
const countries = new Countries()

// lists all the countries data disregading any filter
countries.list()

// reset any applied filters
countries.reset()

// filter by country name
// passing country full name: single result
countries.byName('brazil')
countries.toJson() // all country data as an array of objects
countries.capital // only country capital as string

// passing country partial name: multiple results
countries.reset().byName('ind')

// filter by capital
countries.byCapital('amsterdam') // single result
countries.byCapital('ber') // multiple result
countries.byCapital(null) // multiple result. All countries without a Capital City

// filter by location
countries.byLocation('europe')
countries.byLocation('South America')
countries.byLocation(null)

// filter by independence date
countries.byIndependence(1822) // implicit = (equal sign) operator
countries.byIndependence(500, '<') // lesser than
countries.byIndependence(2000, '>=') // greater or equal than
countries.byIndependence(null) // countries without independence year

// get the longest capital name of the list
countries.longest().capital

// return all filtered data as array of objects
countries.toJson()

// return capital as string
// if countries.length === 0, throw an error
// if countries.length === 1, return specific capital
// if countries.length > 1, return random capital
countries.capital
```

## Running the tests

To run the tests go to the terminal and enter `npm run test`

## Contributing

If you want to collaborate, please feel free. I appreciate any help :)

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/chgasparoto/countries-capitals/tags).

## Authors

* **Cleber Gasparoto** - [Profile](https://github.com/chgasparoto)

See also the list of [contributors](https://github.com/chgasparoto/countries-capitals/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
