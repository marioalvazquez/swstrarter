"use client";

import React from "react";
import { ResultItem, PEOPLE } from "@/api/swapi/types";
import { useRouter } from "next/navigation";

interface SearchResultsWrapperProps {
  children: React.ReactNode;
  isSmall: boolean;
}

const SearchResultsWrapper = ({
  children,
  isSmall,
}: SearchResultsWrapperProps) => {
  return (
    <div className="w-full p-6 mx-auto flex flex-col">
      <h3 className="text-xl font-semibold mb-2">Search Results</h3>
      <hr
        className={`w-full border-gray-300 ${!isSmall ? "mb-4" : "mb-[96px]"}`}
      />
      {children}
    </div>
  );
};

interface SearchResultsProps {
  results: ResultItem[];
  isLoading: boolean;
  error: Error | string | null;
  type: typeof PEOPLE | string;
}

const SearchResults = ({
  results,
  isLoading,
  error,
  type,
}: SearchResultsProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <div className="flex flex-col items-center">
          <p className="text-lg">Searching...</p>
        </div>
      </SearchResultsWrapper>
    );
  }

  if (error) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <p className="text-red-500 text-lg">Error: {error.toString()}</p>
        <p className="text-lg">Please, try again.</p>
      </SearchResultsWrapper>
    );
  }

  if (!results || results.length === 0) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <p className="text-lg text-center">There are zero matches.</p>
        <p className="text-lg text-center">
          Use the form to search for People or Movies.
        </p>
      </SearchResultsWrapper>
    );
  }

  const handleSeeDetails = (uid: string) => {
    const path = `/${type === PEOPLE ? "people" : "movies"}/${uid}`;
    router.push(path);
  };

  return (
    <SearchResultsWrapper isSmall={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {results.map((result: ResultItem) => (
          <div
            key={result.uid}
            className="flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="bg-gray-700 h-48 flex items-center justify-center text-gray-400">
              {type === PEOPLE ? "Character Image" : "Movie Poster"}
            </div>

            <div className="flex flex-col p-6 space-y-2">
              <h3 className="text-white text-xl font-semibold">
                {type === PEOPLE
                  ? result.properties.name
                  : result.properties.title}
              </h3>
            </div>

            <div className="p-6 pt-0">
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                onClick={() => handleSeeDetails(result.uid)}
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </SearchResultsWrapper>
  );
};

export default SearchResults;
