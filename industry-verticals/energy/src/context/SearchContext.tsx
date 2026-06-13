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
  string,
  Dispatch<SetStateAction<string>>,
];

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchContextProvider({ children }: { children: ReactNode }) {
  const [searchKeyphrase, setSearchKeyphrase] = useState('');
  const [searchFacets, setSearchFacets] = useState<unknown[]>([]);
  const [selectedSearchFacets, setSelectedSearchFacets] = useState<unknown[]>([]);
  const [previewKeyphrase, setPreviewKeyphrase] = useState('');

  return (
    <SearchContext.Provider
      value={[
        searchKeyphrase,
        setSearchKeyphrase,
        searchFacets,
        setSearchFacets,
        selectedSearchFacets,
        setSelectedSearchFacets,
        previewKeyphrase,
        setPreviewKeyphrase,
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

export function usePreviewKeyphrase(): [string, Dispatch<SetStateAction<string>>] {
  const context = useSearchContext();
  return [context[6], context[7]];
}
