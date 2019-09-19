/* eslint-env jest */

import 'jest-extended'
import Countries from './index'
import countriesArray from './countries.json'

const countries = new Countries()
const countriesObjectKeys = ['country', 'city', 'location', 'independence']

describe('Countries', () => {
  beforeEach(() => countries.reset())

  describe('class', () => {
    test('should be an instance of class Countries', () => {
      expect(countries).toBeInstanceOf(Countries)
    })
  })

  describe('countries json file', () => {
    test('should match the snapshot', () => {
      expect(countriesArray).toMatchSnapshot()
    })
  })

  describe('list', () => {
    test('should return an array of objects with countries data', () => {
      expect(countries.list()).toBe(countriesArray)
    })

    test('should have a list of string countries names', () => {
      const isListOfStrings = ({ country }) => typeof country === 'string'
      expect(countries.list()).toSatisfyAll(isListOfStrings)
    })

    test('should have a list of string/null countries capitals, locations and independence year', () => {
      const isListOfStrings = (item) => (
        (typeof item.city === 'string' || item.city === null) &&
        (typeof item.location === 'string' || item.location === null) &&
        (typeof item.independence === 'string' || item.independence === null)
      )
      expect(countries.list()).toSatisfyAll(isListOfStrings)
    })
  })

  describe('reset', () => {
    test('should reset the countries list when applied a filter and called reset method', () => {
      countries.byName('brazil')
      expect(countries.reset().toJson()).toBe(countries.list())
      countries.byCapital('lisboa')
      expect(countries.reset().toJson()).toBe(countries.list())
      countries.byLocation('america')
      expect(countries.reset().toJson()).toBe(countries.list())
      countries.byIndependence(1950, '>')
      expect(countries.reset().toJson()).toBe(countries.list())
    })
  })

  describe('byName', () => {
    test('should filter the countries list by country name (brazil) and return an array of one element', () => {
      const brazil = countries.byName('brazil')

      expect(brazil.toJson()[0]).toBeObject()
      expect(brazil.toJson()[0]).toContainAllKeys(countriesObjectKeys)
      expect(brazil.capital).toBe('Brasília')
      expect(brazil.capital).toBeString()
    })

    test('should filter the countries list by country partial name (ind) and return an array of three elements', () => {
      const ind = countries.byName('ind')

      const isIndCountry = ({ country }) => ['India', 'Indonesia', 'British Indian Ocean Territory'].includes(country)

      expect(ind.toJson()).toBeArrayOfSize(3)
      expect(ind.toJson()).toSatisfyAll(isIndCountry)
      expect(ind.capital).toBeOneOf(['Jakarta', 'New Delhi', null])
    })

    test('should not filter the countries list if an empty param is given', () => {
      const country = countries.byName('')

      expect(country.toJson()).toStrictEqual(countries.list())
      expect(countries.list().map(({ city }) => city)).toContain(country.capital)
    })
  })

  describe('byCapital', () => {
    test('should filter the countries list by country capital (amsterdam) and return an array of one element', () => {
      const netherlands = countries.byCapital('amsterdam')

      expect(netherlands.toJson()[0]).toBeObject()
      expect(netherlands.toJson()[0]).toContainAllKeys(countriesObjectKeys)
      expect(netherlands.capital).toBe('Amsterdam')
      expect(netherlands.capital).toBeString()
    })

    test('should not filter the countries list if null param is given', () => {
      const country = countries.byCapital(null)
      expect(country.toJson().length).toBeGreaterThan(0)
      expect(countries.list().map(({ city }) => city)).toContain(country.capital)
    })
  })

  describe('byLocation', () => {
    test('should filter the countries list by location (europe) and return an array of countries', () => {
      const europe = countries.byLocation('europe')

      expect(europe.toJson()[0]).toBeObject()
      expect(europe.toJson()[0]).toContainAllKeys(countriesObjectKeys)
      expect(europe.toJson().map(({ city }) => city)).toIncludeAnyMembers(['Berlin', 'Paris', 'Lisboa'])
    })

    test('should return an array of countries if location is null', () => {
      const noLocation = countries.byLocation(null).toJson()
      expect(noLocation.length).toBeGreaterThan(0)
      noLocation.forEach(({ location }) => expect(location).toBe(null))
    })
  })

  describe('locations', () => {
    test('should return an array of unique locations', () => {
      const locations = countries.locations()
      const isArrayOfStrings = location => typeof location === 'string'

      expect(locations).toBeArray()
      expect(locations).toSatisfyAll(isArrayOfStrings)
    })
  })

  describe('byIndependence', () => {
    test('should replace the invalid operator with a valid one and return an array of countries', () => {
      const spy = jest.spyOn(Countries.prototype as any, 'compare')
      const _1822 = countries.byIndependence(1822, '-')

      expect(spy).toHaveBeenCalledWith(1822, '=', 1822)
      expect(_1822.toJson()[0]).toBeObject()
      expect(_1822.toJson()[0]).toContainAllKeys(countriesObjectKeys)
      expect(_1822.toJson().map(({ city }) => city)).toIncludeAllMembers(['Brasília', 'Quito'])

      spy.mockRestore()
    })

    test('should filter the countries list by independece year (1822) and return an array of countries', () => {
      const spy = jest.spyOn(Countries.prototype as any, 'compare')
      const _1822 = countries.byIndependence(1822)

      expect(spy).toHaveBeenCalledWith(1822, '=', 1822)
      expect(_1822.toJson()[0]).toBeObject()
      expect(_1822.toJson()[0]).toContainAllKeys(countriesObjectKeys)
      expect(_1822.toJson().map(({ city }) => city)).toIncludeAllMembers(['Brasília', 'Quito'])

      spy.mockRestore()
    })

    test('should filter the countries list by independece year >= (1900) and return an array of countries', () => {
      const spy = jest.spyOn(Countries.prototype as any, 'compare')
      const youngers = countries.byIndependence(1900, '>=').toJson()

      youngers.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(parseInt(independence as string, 10), '>=', 1900))
      expect(youngers.map(({ country }) => country)).toIncludeAllMembers(['Angola', 'Bulgaria'])

      spy.mockRestore()
    })

    test('should filter the countries list by independece year <= (1000) and return an array of countries', () => {
      const spy = jest.spyOn(Countries.prototype as any, 'compare')

      let elders = countries.byIndependence(1000, '<=').toJson()
      elders.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(parseInt(independence as string, 10), '<=', 1000))
      expect(elders.map(({ country }) => country)).toIncludeAllMembers(['China', 'Japan', 'France'])

      elders = countries.byIndependence(500, '<').toJson()
      elders.forEach(({ independence }) => expect(spy).toHaveBeenCalledWith(parseInt(independence as string, 10), '<', 500))
      expect(elders.map(({ country }) => country)).toIncludeAllMembers(['China', 'Japan', 'Ethiopia'])

      spy.mockRestore()
    })

    test('should return an array of countries if independence is null', () => {
      const noIndependence = countries.byIndependence(null).toJson()
      expect(noIndependence.length).toBeGreaterThan(0)
      noIndependence.forEach(({ independence }) => expect(independence).toBe(null))
    })
  })

  describe('get capital', () => {
    test('should return a random capital from the list given no filter', () => {
      expect(countries.list().map(({ city }) => city)).toContain(countries.capital)
    })

    test('should return a the capital from Brazil (Brasília) given the filter by name "Brazil"', () => {
      expect(countries.byName('brazil').capital).toBe('Brasília')
    })

    test('should thrown an error in case the give filter does not return any country', () => {
      expect(() => countries.byName('doesnotexist').capital).toThrow('Country not found')
    })
  })

  describe('longest', () => {
    test('should return the longest capital in the countries list', () => {
      const spy = jest.spyOn(countries, 'byCapital')
      const longest = countries.longest()

      expect(spy).toHaveBeenCalledWith(longest.capital)
      expect(longest.capital).toBeString()

      spy.mockRestore()
    })
  })
})
