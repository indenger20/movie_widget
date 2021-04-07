import { PaginationWrapper } from 'interfaces';
import { IMovie } from 'interfaces/movie/movie';

export interface IPeople {
  profile_path: string;
  adult: boolean;
  id: number;
  name: string;
  popularity: number;
}

export interface ICredit {
  credits: {
    cast: IPeople[];
  };
}

export interface IPeopleList extends PaginationWrapper<IPeople> {}
