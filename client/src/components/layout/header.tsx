import { useState } from "react";
import { Link } from "wouter";
import { useSearch } from "@/hooks/use-search";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSearchOpen, openSearch, closeSearch, searchResults, searchQuery, handleSearch } = useSearch();

  return (
    <header className="bg-surface border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-server text-primary text-2xl mr-2"></i>
            </div>
            <Link href="/">
              <div className="text-xl font-semibold text-text-primary cursor-pointer">Homelab GitHub</div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <button 
                  onClick={openSearch}
                  className="text-gray-400 hover:text-white p-2 rounded-full"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="ml-3 relative">
                <a href="#" className="text-gray-400 hover:text-white p-2 rounded-full">
                  <i className="fas fa-cog"></i>
                </a>
              </div>
              <div className="ml-3 relative">
                <a href="https://github.com" target="_blank" className="text-gray-400 hover:text-white p-2 rounded-full">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <div className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                Overview
              </div>
            </Link>
            <Link href="/documentation">
              <div className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                Documentation
              </div>
            </Link>
            <Link href="/services">
              <div className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                Services
              </div>
            </Link>
            <Link href="/tutorials">
              <div className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
                Tutorials
              </div>
            </Link>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
        <DialogContent className="sm:max-w-[500px] bg-surface border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Search Documentation</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-3 rounded-md bg-background border border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {searchResults.documents.map((doc) => (
                <div 
                  key={`doc-${doc.id}`}
                  className="p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => {
                    closeSearch();
                    window.location.href = `/documentation#${doc.slug}`;
                  }}
                >
                  <h4 className="font-medium text-primary">{doc.title}</h4>
                  <p className="text-sm text-text-secondary">
                    {doc.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
              {searchResults.tutorials.map((tutorial) => (
                <div 
                  key={`tutorial-${tutorial.id}`}
                  className="p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => {
                    closeSearch();
                    window.location.href = `/tutorials/${tutorial.slug}`;
                  }}
                >
                  <h4 className="font-medium text-primary">{tutorial.title}</h4>
                  <p className="text-sm text-text-secondary">{tutorial.summary}</p>
                </div>
              ))}
              {searchResults.services.map((service) => (
                <div 
                  key={`service-${service.id}`}
                  className="p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => {
                    closeSearch();
                    window.location.href = `/services#${service.name.toLowerCase().replace(/\s+/g, '-')}`;
                  }}
                >
                  <h4 className="font-medium text-primary">{service.name}</h4>
                  <p className="text-sm text-text-secondary">{service.description}</p>
                </div>
              ))}
              {searchResults.documents.length === 0 && searchResults.tutorials.length === 0 && searchResults.services.length === 0 && searchQuery && (
                <div className="p-4 text-center text-text-secondary">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeSearch}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
