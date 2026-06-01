import { useQuery } from "@tanstack/react-query";
import configs from "../config";

export async function fetchActiveSession({ token, onUnauthorized } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${configs.baseUrl}/api/v1/sessions/active`, {
    method: "GET",
    redirect: "follow",
    headers,
  });

  if (response.status === 401) {
    if (onUnauthorized) {
      onUnauthorized();
      return null;
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let message = "Failed to load active session";
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      const text = await response.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  const result = await response.json();
  if (result.ok) {
    return result.data;
  }
  throw new Error(result.message || "Failed to load active session");
}

export function useActiveSession({ token, enabled = true, onUnauthorized } = {}) {
  const query = useQuery({
    queryKey: ["activeSession", token],
    queryFn: () => fetchActiveSession({ token, onUnauthorized }),
    enabled,
  });

  const session = query.data ?? null;
  const minutesLeft = session?.minutesLeft ?? null;
  const isClosed = minutesLeft != null ? minutesLeft < 1 : false;

  return {
    session,
    minutesLeft,
    isClosed,
    isOpen: session?.isOpen ?? false,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useActiveSession;
