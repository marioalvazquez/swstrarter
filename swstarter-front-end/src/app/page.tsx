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
    <div className="flex flex-col items-star justify-center p-8 bg-gray-950 space-x-8 text-white">
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
