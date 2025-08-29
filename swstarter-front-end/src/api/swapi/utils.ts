type GenerateEventParams = {
  clientUuid: string;
  resourceType: string;
  route: string;
  searchParams?: string;
  duration?: number;
  status?: number;
  userAgent?: string;
  isoDate: string;
};

export const generateEvent = ({
  clientUuid,
  resourceType,
  route,
  searchParams,
  duration,
  status,
  userAgent,
  isoDate,
}: GenerateEventParams) => ({
  client_id: clientUuid,
  resource_type: resourceType,
  route,
  query_string: searchParams,
  duration_ms: duration,
  status_code: status,
  user_agent: userAgent,
  occurred_at: isoDate,
});

const STORAGE_KEY = "client_uuid";

export const generateAndStoreUuid = () => {
  let uuid = localStorage.getItem(STORAGE_KEY);

  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, uuid);
  }

  return uuid;
};
