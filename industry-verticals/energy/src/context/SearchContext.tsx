'use client';

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type SearchContextValue = [
  string,
  Dispatch<SetStateAction<string>>,
  unknown[],
  Dispatch<SetStateAction<unknown[]>>,
  unknown[],
  Dispatch<SetStateAction<unknown[]>>,
];

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [searchKeyphrase, setSearchKeyphrase] = useState('');
  const [searchFacets, setSearchFacets] = useState<unknown[]>([]);
  const [selectedSearchFacets, setSelectedSearchFacets] = useState<unknown[]>([]);

  return (
    <SearchContext.Provider
      value={[
        searchKeyphrase,
        setSearchKeyphrase,
        searchFacets,
        setSearchFacets,
        selectedSearchFacets,
        setSelectedSearchFacets,
      ]}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchContextProvider');
  }
  return context;
}
