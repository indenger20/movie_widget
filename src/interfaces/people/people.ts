import { PaginationWrapper } from 'interfaces';
import { IMovie } from 'interfaces/movie/movie';

export interface IPeople {
  profile_path: string;
  adult: boolean;
  id: number;
  known_for: IMovie[];
  name: string;
  popularity: number;
}

export interface IPeopleList extends PaginationWrapper<IPeople> {}
