export type FilterInput = string | null;

export interface CountryItem {
  country: string;
  city: string | null;
  location: string | null;
  independence: string | null;
}

export interface CountryItems extends Array<CountryItem>{}
