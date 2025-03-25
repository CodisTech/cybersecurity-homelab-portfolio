import { createContext, useState, useCallback, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Service, Document, Tutorial } from '@shared/schema';

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  searchQuery: string;
  searchResults: {
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  };
  handleSearch: (query: string) => void;
}

export const SearchContext = createContext<SearchContextType>({
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
  searchQuery: '',
  searchResults: {
    services: [],
    documents: [],
    tutorials: []
  },
  handleSearch: () => {},
});

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    services: Service[];
    documents: Document[];
    tutorials: Tutorial[];
  }>({
    services: [],
    documents: [],
    tutorials: []
  });

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    // Clear search when modal is closed
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults({
        services: [],
        documents: [],
        tutorials: []
      });
      return;
    }
    
    try {
      const res = await apiRequest('GET', `/api/search?q=${encodeURIComponent(query)}`, undefined);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({
        services: [],
        documents: [],
        tutorials: []
      });
    }
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        searchQuery,
        searchResults,
        handleSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
