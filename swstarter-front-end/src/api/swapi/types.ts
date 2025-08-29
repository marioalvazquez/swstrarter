export interface SearchParams {
  searchTerm: string;
  searchType: string;
}

export type SwapiResponse<T> = {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  result: T[];
};

export type PersonResult = {
  uid: string;
  name: string;
  url: string;
  properties: Properties;
};

export type Properties = {
  name: string;
  title: string;
}

export type FilmResult = {
  uid: string;
  name: string;
  url: string;
  properties: Properties;
};

export type SingleResult<T> = {
  message: string;
  result: {
    properties: T;
    _id: string;
    uid: string;
    description: string;
    __v: number;
  };
};

export type PersonProperties = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
  url: string;
  created: string;
  edited: string;
};

export type FilmProperties = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  url: string;
  created: string;
  edited: string;
};

export type ResultItem = PersonResult | FilmResult;

export const PEOPLE = "people";

export const MOVIES = "films";
