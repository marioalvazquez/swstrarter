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

  const characterDetails = (await Promise.all(characterDetailsPromises)).filter(Boolean);
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
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div className="p-6 bg-white rounded-xl shadow-lg w-[720px] text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {movie.properties.title}
        </h1>

        <hr className="w-full border-gray-300 mb-4" />

        <div className="flex flex-col md:flex-row md:space-x-8 items-start justify-center mb-6">
          <div className="flex-1 w-full flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Opening Crawl</h2>
              <div className="space-y-4 text-gray-700 whitespace-pre-line">
                <p>{movie.properties.opening_crawl}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full mt-6 md:mt-0">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Characters</h2>
            {movie.characterDetails.length > 0 ? (
              <div className="space-y-2 text-gray-700">
                {movie.characterDetails.map((character, idx) => (
                  <p key={character?.uid} className="inline-block text-gray-800">
                    <Link
                      href={`/people/${character?.uid}`}
                      className="text-blue-600 hover:underline"
                    >
                      {character?.name}
                    </Link>
                    {idx < movie.characterDetails.length - 1 && ", "}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No characters listed.</p>
            )}
          </div>
        </div>

        <div className="w-full">
          <Link href="/">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              BACK TO SEARCH
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
