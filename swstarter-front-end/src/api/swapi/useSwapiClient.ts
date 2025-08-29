// En src/hooks/useSwapiClient.ts

import { useCallback } from "react";
import { useApiReducer } from "../useApiReducer";
import { SwapiResponse, ResultItem } from "./types";
import { generateAndStoreUuid } from "./utils";
import { fetchWithMetrics } from "@/api/swapi/fetchWithMetrics";

const SWAPI_BASE_URL = "https://swapi.tech/api";

const EVENTS_URL =
  typeof window !== "undefined"
    ? "/api/v1/events" // client → Next.js rewrite → Laravel
    : `http://${
        process.env.API_HOST || "swstarter-backend:8000"
      }/api/v1/events`;

export function useSwapiClient() {
  const [state, dispatch] = useApiReducer<SwapiResponse<ResultItem>>();

  const search = useCallback(
    async (endpoint: string, query: string) => {
      dispatch({ type: "FETCH_START" });
      try {
        const cleanEndpoint = endpoint.startsWith("/")
          ? endpoint
          : `/${endpoint}`;

        const url = `${SWAPI_BASE_URL}${cleanEndpoint}?name=${encodeURIComponent(
          query
        )}`;

        const clientUuid =
          (typeof window !== "undefined" &&
            localStorage.getItem("client_uuid")) ||
          generateAndStoreUuid();

        const { data, ok, status } = await fetchWithMetrics<
          SwapiResponse<ResultItem>
        >(url, { sendBeaconUrl: EVENTS_URL }, clientUuid);

        if (!ok) {
          throw new Error(`Error: ${status}`);
        }

        if (!data) {
          throw new Error("No data received");
        }

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "FETCH_ERROR", payload: error.message });
        } else {
          dispatch({
            type: "FETCH_ERROR",
            payload: "An unknown error occurred",
          });
        }
      }
    },
    [dispatch]
  );

  return { ...state, search };
}
