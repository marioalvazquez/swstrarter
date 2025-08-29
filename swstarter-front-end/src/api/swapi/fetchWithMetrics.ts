import { generateEvent } from "@/api/swapi/utils";

interface FetchWithMetricsOptions extends RequestInit {
  sendBeaconUrl?: string; // default: "/api/v1/events"
}

export async function fetchWithMetrics<T>(
  requestUrl: string,
  options: FetchWithMetricsOptions = {},
  uuid?: string
): Promise<{ data: T | null; ok: boolean; status: number }> {
  const start = performance.now();
  let duration = Infinity;
  let res: Response | null = null;

  try {
    res = await fetch(requestUrl, options);

    duration = Math.round(performance.now() - start);

    let clientUuid: string;
    if (typeof window !== "undefined") {
      // Client-side: receive it from params
      clientUuid = uuid || "unknown";
    } else {
      // Server-side: use a UUID library
      const { v4: uuidv4 } = await import("uuid");
      clientUuid = uuidv4();
    }

    const { pathname, search, href } = new URL(
      requestUrl,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000"
    );
    const paths = pathname.split("/");
    const pathName =
      typeof window === "undefined" ? paths[paths.length - 2] : paths.pop();

    const event = generateEvent({
      clientUuid,
      resourceType: pathName || "",
      route: href,
      searchParams: search.toString(),
      duration,
      status: res.status,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Server",
      isoDate: new Date().toISOString(),
    });

    let beaconUrl = options.sendBeaconUrl ?? "/api/v1/events";
    if (typeof window === "undefined") {
      // On the server, prepend the host from environment variables
      const protocol = "http";
      const host = process.env.API_HOST || "swstarter-backend:8000";
      beaconUrl = `${protocol}://${host}/api/v1/events`;
    }

    try {
      const beaconResponse = await fetch(beaconUrl, {
        method: "POST",
        body: JSON.stringify(event),
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: true,
      });

      if (!beaconResponse.ok) {
        console.error(
          "Failed to send event:",
          beaconResponse.status,
          beaconResponse.statusText
        );
      }
    } catch (beaconErr) {
      console.error("Error sending beacon-like request:", beaconErr);
    }

    if (!res.ok) {
      return { data: null, ok: false, status: res.status };
    }

    const json = (await res.json()) as T;
    return { data: json, ok: true, status: res.status };
  } catch (err) {
    duration = Math.round(performance.now() - start);
    console.error(`fetchWithMetrics error for ${requestUrl}`, err);
    return { data: null, ok: false, status: res?.status ?? 0 };
  }
}
