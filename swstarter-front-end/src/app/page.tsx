"use client";

import SearchResults from "@/components/home/results/SearchResults";
import SearchForm from "@/components/home/search/SearchForm";
import { useSwapiClient } from "../api/swapi/useSwapiClient";
import { useState } from "react";
import { PEOPLE, SearchParams } from "@/api/swapi/types";

export default function Home() {
  const { data, isLoading, error, search } = useSwapiClient();
  const [type, setType] = useState(PEOPLE);

  

  const handleSearch = ({
    searchTerm,
    searchType,
  }: SearchParams): void => {
    search(searchType, searchTerm);
    setType(searchType);
  };

  return (
    <div className="flex flex-row items-star justify-center p-8 bg-gray-100 min-h-screen space-x-8">
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      <SearchResults
        results={data?.result || []}
        isLoading={isLoading}
        error={error}
        type={type}
      />
    </div>
  );
}
