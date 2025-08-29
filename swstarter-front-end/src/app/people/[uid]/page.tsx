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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {person.properties.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Details
            </h2>
            <hr className="border-gray-300 mb-4" />
            <ul className="space-y-1 text-gray-800">
              <li>Birth Year: {person.properties.birth_year}</li>
              <li>Gender: {person.properties.gender}</li>
              <li>Eye Color: {person.properties.eye_color}</li>
              <li>Hair Color: {person.properties.hair_color}</li>
              <li>Height: {person.properties.height}</li>
              <li>Mass: {person.properties.mass}</li>
            </ul>
          </div>

          {/* Movies */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Movies</h2>
            <hr className="border-gray-300 mb-4" />
            {person.filmDetails.length > 0 ? (
              <ul className="space-y-2">
                {person.filmDetails.map((film, idx) => (
                  <p key={film?.uid} className="inline-block text-gray-800">
                    <Link
                      href={`/movies/${film?.uid}`}
                      className="text-blue-600 hover:underline"
                    >
                      {film?.title}
                    </Link>
                    {idx < person.filmDetails.length - 1 && ", "}
                  </p>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No movies listed.</p>
            )}
          </div>
        </div>

        {/* Back button */}
        <div className="mt-8">
          <Link href="/">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300">
              BACK TO SEARCH
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
