"use client";

import React from "react";
import { ResultItem, PEOPLE } from "@/api/swapi/types";
import { useRouter } from "next/navigation";


interface SearchResultsWrapperProps {
  children: React.ReactNode;
  isSmall: boolean;
}

const SearchResultsWrapper = ({ children, isSmall }: SearchResultsWrapperProps) => {  
  return (
    <div className={`p-6 bg-white rounded-xl shadow-lg mt-4 w-[720px] text-center ${isSmall ? 'h-[360px] flex flex-col' : 'h-auto'}`}>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">Results</h3>
      <hr className={`w-full border-gray-300 ${!isSmall ? 'mb-4' : 'mb-[96px]'}`} />
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

const SearchResults = ({ results, isLoading, error, type }: SearchResultsProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-lg">Searching...</p>
        </div>
      </SearchResultsWrapper>
    );
  }

  if (error) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <p className="text-red-500 text-lg">Error: {error.toString()}</p>
        <p className="text-gray-500 text-lg">Please, try again.</p>
      </SearchResultsWrapper>
    );
  }

  if (!results || results.length === 0) {
    return (
      <SearchResultsWrapper isSmall={true}>
        <p className="text-gray-500 text-lg">There are zero matches.</p>
        <p className="text-gray-500 text-lg">
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
      <ul className="space-y-4">
        {results.map((result: ResultItem) => (
          <li
            key={result.uid}
            className="flex justify-between items-center p-4 border-b-2 border-gray-200 rounded-md"
          >
            <p className="text-gray-800 font-medium">
              {type === PEOPLE
                ? result.properties.name
                : result.properties.title}
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
              onClick={() => handleSeeDetails(result.uid)}
            >
              SEE DETAILS
            </button>
          </li>
        ))}
      </ul>
    </SearchResultsWrapper>
  );
};

export default SearchResults;