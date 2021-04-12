import { IPeople } from 'index';
import { PaginationWrapper } from 'interfaces';

export interface ICredit {
  credits: {
    cast: IPeople[];
  };
}

export interface IPeopleList extends PaginationWrapper<IPeople> {}
