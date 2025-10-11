import { SearchResult } from '../../types';

  export const getSearchResults = async function (service: string, query: string): Promise<SearchResult[]> {
    const url = `/api/search/${service}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as SearchResult[];
    return data;
  };