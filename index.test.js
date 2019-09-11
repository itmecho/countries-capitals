const Countries = require('./index');
const countriesArray = require('./countries');

const countries = new Countries();
const countriesObjectKeys = ['country', 'city', 'independence', 'location'];

describe('Countries', () => {
  beforeEach(() => countries.reset());

  describe('class', () => {
    test('should be instance of class Contries', () => {
      expect(countries).toBeInstanceOf(Countries);
    });
  })

  describe('list', () => {
    test('should return an array of objects with countries data', () => {
      const countriesList = countries.list();
      expect(countriesList).toBe(countriesArray);
      expect(countriesList[0]).toBeObject();
      expect(countriesList[0]).toContainAllKeys(countriesObjectKeys);
    });

    test('should have a list of string countries names', () => {
      const isListOfString = ({ country }) => typeof country === 'string';
      expect(countries.list()).toSatisfyAll(isListOfString);
    });

    test('should have a list of string/null capitals, locations and independence year', () => {
      const isListOfString = item => (
        (typeof item.city === 'string' || item.city === null) &&
        (typeof item.location === 'string' || item.location === null) &&
        (typeof item.independence === 'string' || item.independence === null)
      );
      expect(countries.list()).toSatisfyAll(isListOfString);
    });

    test('should always include Brazil in the countries list', () => {
      expect(countries.list()).toContainEqual(expect.objectContaining({ country: 'Brazil' }));
    });
  });

  describe('reset', () => {
    test('should reset the countries list when applied a filter and called reset method', () => {
      countries.byName('brazil');
      expect(countries.reset().toJson()).toBe(countries.list());
      countries.byCapital('lisboa');
      expect(countries.reset().toJson()).toBe(countries.list());
      countries.byLocation('');
      expect(countries.reset().toJson()).toBe(countries.list());
      countries.byIndependence('');
    });
  });

  describe('byName', () => {
    test('should filter the countries list by country name (brazil) and return an array of one element', () => {
      const brazil = countries.byName('brazil');
      expect(brazil.toJson()[0]).toBeObject();
      expect(brazil.toJson()[0]).toContainAllKeys(countriesObjectKeys);
      expect(brazil.capital).toBe('Brasília');
    });

    test('should filter the countries list by country partial name (ind) and return an array of three elements', () => {
      const ind = countries.byName('ind');
      const isIndCountry = ({ country }) => ['India', 'Indonesia', 'British Indian Ocean Territory'].includes(country);
      expect(ind.toJson()).toBeArrayOfSize(3);
      expect(ind.toJson()).toSatisfyAll(isIndCountry);
      expect(ind.capital).toBeOneOf(['Jakarta', 'New Delhi', null]);
    });

    test('should not filter the countries list if an empty param is given', () => {
      const country = countries.byName('');
      expect(country.toJson()).toStrictEqual(countries.list());
      expect(countries.list().map(({ city }) => city)).toContain(country.capital);
    });

    test('should not filter the countries list if null is given', () => {
      const country = countries.byName(null);
      expect(countries.list().map(({ city }) => city)).toContain(country.capital);
    });

    test('should not filter the countries list if an invalid param is given', () => {
      const country = countries.byName({});
      expect(countries.list().map(({ city }) => city)).toContain(country.capital);
    });
  });

  describe('byCapital', () => {
    test('should filter the countries list by capital name (amsterdam) and return an array of one element', () => {
      const netherlands = countries.byCapital('amsterdam');
      expect(netherlands.toJson()[0]).toBeObject();
      expect(netherlands.toJson()[0]).toContainAllKeys(countriesObjectKeys);
      expect(netherlands.capital).toBe('Amsterdam');
    });

    test('should return a contry with no capital if null is given', () => {
      const country = countries.byCapital(null);
      expect(country.capital).toBe(null);
    });

    test('should not filter the countries list if an invalid param is given', () => {
      const country = countries.byLocation('europe').byCapital({});
      expect(country.toJson().map(({ city }) => city)).toContain('Sofia');
    });
  });

  describe('byLocation', () => {
    test('should filter the countries list by location (europe) and return an array of countries', () => {
      const europe = countries.byLocation('europe');
      expect(europe.toJson()[0]).toBeObject();
      expect(europe.toJson()[0]).toContainAllKeys(countriesObjectKeys);
      expect(europe.toJson().map(({ city }) => city)).toContain('Berlin');
    });

    test('should return a contry with no location if null is given', () => {
      const noLocation = countries.byLocation(null).toJson();
      noLocation.forEach(({ location }) => expect(location).toBe(null));
    });

    test('should not filter the countries list if an invalid param is given', () => {
      const country = countries.byLocation({}).byCapital('ams');
      expect(country.toJson().map(({ city }) => city)).toContain('Amsterdam');
    });
  });

  describe('locations', () => {
    test('should return an array of unique Locations', () => {
      const locations = countries.locations();
      const isArrayOsStrings = location => typeof location === 'string';
      expect(locations).toBeArray();
      expect(locations).toSatisfyAll(isArrayOsStrings);
    });

    test('should always include South America in locations list', () => {
      const locations = countries.locations();
      expect(locations).toBeArray();
      expect(locations).toIncludeAnyMembers(['South America']);
    });
  });

  describe('byIndependence', () => {
    test('should filter the countries list by independence year (1822) and return an array countries', () => {
      const spy = jest.spyOn(countries, 'compare');
      const _1822 = countries.byIndependence(1822).toJson();

      expect(spy).toHaveBeenCalledWith('1822', '=', 1822);
      expect(_1822.map(({ country }) => country)).toIncludeAllMembers(['Brazil', 'Ecuador']);

      spy.mockRestore();
    });

    test('should filter the countries list by independence year >= (1900) and return an array countries', () => {
      const spy = jest.spyOn(countries, 'compare');

      let youngers = countries.byIndependence(1900, '>=').toJson();
      youngers.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(independence, '>=', 1900));
      expect(youngers.map(({ country }) => country)).toIncludeAllMembers(['Afghanistan', 'Ukraine']);

      youngers = countries.byIndependence(1900, '>').toJson();
      youngers.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(independence, '>=', 1900));
      expect(youngers.map(({ country }) => country)).toIncludeAllMembers(['Afghanistan', 'Ukraine']);

      spy.mockRestore();
    });

    test('should filter the countries list by independence year <= (100) and return an array countries', () => {
      const spy = jest.spyOn(countries, 'compare');

      let elders = countries.byIndependence(100, '<=').toJson();
      elders.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(independence, '<=', 100));
      expect(elders.map(({ country }) => country)).toIncludeAllMembers(['China', 'Japan']);

      elders = countries.byIndependence(100, '<').toJson();
      elders.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(independence, '<=', 100));
      expect(elders.map(({ country }) => country)).toIncludeAllMembers(['China', 'Japan']);

      spy.mockRestore();
    });

    test('should return a contry with no independence if null is given', () => {
      const noIndependence = countries.byIndependence(null).toJson();
      noIndependence.forEach(({ independence }) => expect(independence).toBe(null));
    });

    test('should not filter the countries list if an invalid param is given', () => {
      const country = countries.byIndependence({}).byCapital('ams');
      expect(country.toJson().map(({ city }) => city)).toContain('Amsterdam');
    });
  });

  describe('get capital', () => {
    test('should return a random capital from the list given no filter', () => {
      expect(countries.list().map(({ city }) => city)).toContain(countries.capital);
    });

    test('should return the capital from Brazil (Brasília) given the filter by name "Brazil"', () => {
      expect(countries.byName('brazil').capital).toBe('Brasília');
    });

    test('should throw and error in case the given filter does not return any country', () => {
      expect(() => countries.byName('nonsense').capital).toThrow('Country not found');
    });
  });
});