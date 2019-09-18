'use strict'

import countriesArray from './countries.json'
import randomItem from 'random-item'

export type FilterInput = string | null;

export interface CountryItem {
  country: string;
  city: string | null;
  location: string | null;
  independence: string | null;
}

export interface CountryItems extends Array<CountryItem>{}

export default class Countries {
  private countries: CountryItems;
  private original: CountryItems;

  constructor (countries: CountryItems = countriesArray) {
    this.countries = countries
    this.original = countries
  }

  public list ():CountryItems {
    return this.original
  }

  public reset ():this {
    this.countries = this.original
    return this
  }

  private containString (str1:string, str2:string):boolean {
    return str1.toLowerCase().includes(str2.toLowerCase())
  }

  public byName (name:string):this {
    this.countries = this.countries.filter(({ country }) => this.containString(country, name))
    return this
  }

  public byCapital (capital:FilterInput):this {
    this.countries = this.countries.filter(({ city }) => {
      if (capital === null) {
        return city === null
      }

      if (city === null) {
        return false
      }

      return this.containString(city, capital)
    })

    return this
  }

  public byLocation (region:FilterInput):this {
    this.countries = this.countries.filter(({ location }) => {
      if (region === null) {
        return location === null
      }

      if (location === null) {
        return false
      }

      return this.containString(location, region)
    })

    return this
  }

  public locations ():string[] {
    const locations = this.original.map(({ location }) => location).filter(Boolean) as string[]
    return [...new Set(locations)].sort()
  }

  public byIndependence (year: number | null, operator: string = '='):this {
    const validOperators:string[] = ['>', '>=', '<', '<=']
    const op:string = validOperators.includes(operator) ? operator : '='

    this.countries = this.countries.filter(({ independence }) => {
      if (year === null) {
        return independence === null
      }

      if (independence === null) {
        return false
      }

      return this.compare(parseInt(independence, 10), op, year)
    })

    return this
  }

  public longest ():this {
    const capitalsArray = this.original.map(({ city }) => city).filter(Boolean) as string[]
    const capital:string = capitalsArray.reduce((acc, cur) => acc.length > cur.length ? acc : cur)

    this.reset().byCapital(capital)

    return this
  }

  private compare (firstValue:number, operator:string, secondValue:number):boolean {
    switch (operator) {
      case '>': return firstValue > secondValue
      case '>=': return firstValue >= secondValue
      case '<': return firstValue < secondValue
      case '<=': return firstValue <= secondValue
      default: return firstValue === secondValue
    }
  }

  public toJson ():CountryItems {
    return this.countries
  }

  public get capital ():string {
    const countriesFound:number = this.countries.length

    if (!countriesFound) {
      throw new Error('Country not found')
    }

    if (countriesFound === 1) {
      return this.countries[0].city as string
    }

    return randomItem(this.countries).city as string
  }
}
