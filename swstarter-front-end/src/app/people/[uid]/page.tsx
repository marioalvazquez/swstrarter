import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SingleResult,
  PersonProperties,
  FilmProperties,
} from "@/api/swapi/types";
import { fetchWithMetrics } from "@/api/swapi/fetchWithMetrics";

async function getPersonDetails(uid: string) {
  const { data, ok } = await fetchWithMetrics<SingleResult<PersonProperties>>(
    `https://swapi.tech/api/people/${uid}`
  );

  if (!ok || !data) {
    notFound();
  }

  const filmDetailsPromises = data.result.properties.films.map(
    async (filmUrl) => {
      const { data: filmData, ok } = await fetchWithMetrics<
        SingleResult<FilmProperties>
      >(filmUrl);
      if (!ok || !filmData) return null;

      return {
        uid: filmData.result.uid,
        title: filmData.result.properties.title,
        episode_id: filmData.result.properties.episode_id,
      };
    }
  );

  const filmDetails = (await Promise.all(filmDetailsPromises)).filter(Boolean);
  return { ...data.result, filmDetails };
}

interface PersonDetailsPageProps {
  params: {
    uid: string;
  };
}

export default async function PersonDetailsPage({
  params,
}: PersonDetailsPageProps) {
  const { uid } = params;
  const person = await getPersonDetails(uid);

  return (
    <div className="flex flex-col items-center bg-gray-950 text-white min-h-screen">
      <div className="w-full bg-gray-900 flex flex-col md:flex-row items-center p-8 space-y-6 md:space-y-0 md:space-x-8 relative">
        <div className="absolute top-8 left-8">
          <Link href="/" passHref>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              BACK
            </button>
          </Link>
        </div>
        
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-800 flex items-center justify-center">
          <p className="text-sm text-gray-400">Character Portrait</p>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold">{person.properties.name}</h1>
          <p className="text-gray-400 mt-2">
            A person within the Star Wars universe
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              View Films
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              + Add to List
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Character Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-400">
                <p>
                  <span className="font-semibold text-white">Birth Year:</span>{" "}
                  {person.properties.birth_year}
                </p>
                <p>
                  <span className="font-semibold text-white">Gender:</span>{" "}
                  {person.properties.gender}
                </p>
                <p>
                  <span className="font-semibold text-white">Eye Color:</span>{" "}
                  {person.properties.eye_color}
                </p>
                <p>
                  <span className="font-semibold text-white">Hair Color:</span>{" "}
                  {person.properties.hair_color}
                </p>
                <p>
                  <span className="font-semibold text-white">Height:</span>{" "}
                  {person.properties.height} cm
                </p>
                <p>
                  <span className="font-semibold text-white">Mass:</span>{" "}
                  {person.properties.mass} kg
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-400">
                <p>
                  <span className="font-semibold text-white">Skin Color:</span>{" "}
                  {person.properties.skin_color}
                </p>
                <p>
                  <span className="font-semibold text-white">Homeworld:</span>{" "}
                  <Link
                    href="#"
                    className="text-blue-500 hover:underline"
                  >
                    View Planet
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Featured Films</h2>
            <div className="space-y-4">
              {person.filmDetails.length > 0 ? (
                person.filmDetails.map((film) => (
                  <Link
                    key={film?.uid}
                    href={`/movies/${film?.uid}`}
                    passHref
                  >
                    <div className="bg-gray-900 rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-800 transition-colors">
                      <div className="w-16 h-24 bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        <p className="text-xs text-gray-400">Film Poster</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-white">
                          {film?.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Episode {film?.episode_id}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400">No films listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}