import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SingleResult,
  FilmProperties,
  PersonProperties,
} from "@/api/swapi/types";
import { fetchWithMetrics } from "@/api/swapi/fetchWithMetrics";

export async function getMovieDetails(uid: string) {
  const { data, ok } = await fetchWithMetrics<SingleResult<FilmProperties>>(
    `https://swapi.tech/api/films/${uid}`
  );

  if (!ok || !data) {
    notFound();
  }

  const characterDetailsPromises = data.result.properties.characters.map(
    async (characterUrl) => {
      const { data: characterData, ok } = await fetchWithMetrics<
        SingleResult<PersonProperties>
      >(characterUrl);
      if (!ok || !characterData) return null;

      return {
        uid: characterData.result.uid,
        name: characterData.result.properties.name,
      };
    }
  );

  const characterDetails = (
    await Promise.all(characterDetailsPromises)
  ).filter(Boolean);
  return { ...data.result, characterDetails };
}

export default async function MovieDetailsPage({
  params,
}: {
  params: { uid: string };
}) {
  const { uid } = params;
  const movie = await getMovieDetails(uid);

  return (
    <div className="flex flex-col items-center bg-gray-950 text-white min-h-screen">
      <div className="w-full bg-gray-900 p-8 pt-24 text-center relative">
        <div className="absolute top-8 left-8">
          <Link href="/" passHref>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              BACK
            </button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-2">{movie.properties.title}</h1>
        <p className="text-gray-400 mb-4">
          {movie.properties.release_date.split('-')[0]} | Episode {movie.properties.episode_id}
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              ></path>
            </svg>
            Play
          </button>
          <button className="bg-gray-700 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors">
            + My List
          </button>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Opening Crawl</h2>
            <div className="space-y-4 text-gray-400 whitespace-pre-line">
              <p>{movie.properties.opening_crawl}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Movie Info</h2>
            <div className="text-gray-400 space-y-2">
              <p>
                <span className="font-semibold text-white">Director:</span>{" "}
                {movie.properties.director}
              </p>
              <p>
                <span className="font-semibold text-white">Producer:</span>{" "}
                {movie.properties.producer}
              </p>
              <p>
                <span className="font-semibold text-white">Release Date:</span>{" "}
                {movie.properties.release_date}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {movie.characterDetails.length > 0 ? (
              movie.characterDetails.map((character) => (
                <Link key={character?.uid} href={`/people/${character?.uid}`} passHref>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="bg-gray-700 h-40 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Image</p>
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-md font-semibold text-white">
                        {character?.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No characters listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}