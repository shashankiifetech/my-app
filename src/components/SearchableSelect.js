import React, { useEffect, useState } from "react";

const SearchableSelect = ({ placeholder, fetchUrl, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) return;
      try {
        const res = await fetch(`${fetchUrl}?q=${query}`);
        const data = await res.json();
        setResults(data.rows);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, fetchUrl]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        className="w-full border-b-2 border-gray-300 bg-transparent focus:outline-none"
      />
      {query.length > 2 && showDropdown && (results.length > 0 ? (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onMouseDown={() => {
                setQuery(item.name);
                setShowDropdown(false);
                onSelect(item);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow p-2">
          No results found
        </div>
      ))}
    </div>
  );
};

export default SearchableSelect;
