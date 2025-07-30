/**
 * @file This component handles the search functionality for the e-commerce website.
 */

import React, { useState, useEffect } from 'react';

/**
 * Search component.
 * @param {object} props - Component properties.
 * @param {function} props.onSearch - Callback function for search results.
 * @returns {JSX.Element} Search component JSX.
 */
const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchTerm.trim() === '') {
          setSearchResults([]);
          return;
        }

        const response = await fetch(`/api/products?q=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          setSearchResults(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const debounceSearch = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search for 300ms

    if (searchTerm.length > 2 || searchTerm.length === 0) {
      handleSearch();
    }

    return () => {
      clearTimeout(debounceSearch);
      isMounted = false;
    };
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              <a href={`/product/${result.id}`}>{result.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;