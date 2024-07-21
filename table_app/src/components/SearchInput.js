import React, { useState } from "react";
import "../styles/SearchInput.css";

const Search = ({ onSearch, query }) => {
  const [inputValue, setInputValue] = useState(query);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search users..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default Search;
