import { IMovie, IPeople } from 'interfaces';

export const filterListItem = (query: string) => (
  item: IMovie | IPeople,
): boolean => {
  if (!query) return true;

  const searchField = (item as IMovie).title
    ? (item as IMovie).title
    : (item as IPeople).name;

  return searchField.toLowerCase().indexOf(query.toLowerCase()) > -1;
};
