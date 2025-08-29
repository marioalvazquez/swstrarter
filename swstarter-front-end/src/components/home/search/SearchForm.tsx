"use client";

import { MOVIES, PEOPLE, SearchParams } from "@/api/swapi/types";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [searchType, setSearchType] = useState("people");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchType(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      searchTerm,
      searchType,
    });
  };

  const isSearchTermValid = searchTerm.length > 0;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        What are you searching for?
      </h2>

      <div className="flex space-x-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="search-type"
            value={PEOPLE}
            checked={searchType === PEOPLE}
            onChange={handleRadioChange}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">People</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="search-type"
            value={MOVIES}
            checked={searchType === MOVIES}
            onChange={handleRadioChange}
            className="form-radio h-5 w-5 text-gray-400"
          />
          <span className="text-gray-700">Movies</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={
            searchType === "people"
              ? "e.g. Chewbacca, Yoda, Boba Fett"
              : "e.g. Star Wars, The Phantom Menace"
          }
          className="placeholder:text-gray-500 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800"
        />

        <button
          type="submit"
          className={`
            w-full py-2 px-4 font-bold rounded-full transition duration-300
            ${
              isSearchTermValid
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-500 text-white cursor-not-allowed"
            }
          `}
          disabled={!isSearchTermValid}
        >
          {isLoading ? 'SEARCHING' : 'SEARCH'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
