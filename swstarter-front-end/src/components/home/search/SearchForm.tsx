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
    <div className="p-6 max-w-lg mx-auto rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">What are you searching for?</h2>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="search-type"
              value={PEOPLE}
              checked={searchType === PEOPLE}
              onChange={handleRadioChange}
              className="hidden"
            />
            <span
              className={`relative flex items-center justify-center w-4 h-4 rounded-full border 
        ${searchType === PEOPLE ? "border-white bg-white" : "border-gray-400"}`}
            >
              {searchType === PEOPLE && (
                <span className="absolute w-2 h-2 bg-black rounded-full"></span>
              )}
            </span>
            <span
              className={searchType === PEOPLE ? "text-white" : "text-gray-400"}
            >
              People
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="search-type"
              value={MOVIES}
              checked={searchType === MOVIES}
              onChange={handleRadioChange}
              className="hidden"
            />
            <span
              className={`relative flex items-center justify-center w-4 h-4 rounded-full border 
        ${searchType === MOVIES ? "border-white bg-white" : "border-gray-400"}`}
            >
              {searchType === MOVIES && (
                <span className="absolute w-2 h-2 bg-black rounded-full"></span>
              )}
            </span>
            <span
              className={searchType === MOVIES ? "text-white" : "text-gray-400"}
            >
              Movies
            </span>
          </label>
        </div>

        <div className="flex">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={
              searchType === "people"
                ? "e.g. Chewbacca, Yoda, Boba Fett"
                : "e.g. Star Wars, The Phantom Menace"
            }
            className="flex-[3] space-x-2 px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className={`
       flex-[1] space-x-2 py-2 px-4 font-bold transition duration-300
      ${
        isSearchTermValid
          ? "bg-gray-600 hover:bg-gray-500 text-white"
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
      }
    `}
            disabled={!isSearchTermValid}
          >
            {isLoading ? "SEARCHING" : "SEARCH"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
