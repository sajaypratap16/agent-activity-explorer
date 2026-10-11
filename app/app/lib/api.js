const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: response.statusText };
      }
      throw new ApiError(
        errorBody.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      throw new ApiError("Request timed out", 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error - unable to reach API", 0);
    }
    throw new ApiError(error.message || "Unknown error", 0);
  }
}

export const api = {
  async getEvents(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set("q", params.q);
    if (params.agent) searchParams.set("agent", params.agent);
    if (params.status) searchParams.set("status", params.status);
    if (params.from) searchParams.set("from", params.from);
    if (params.to) searchParams.set("to", params.to);
    if (params.cursor) searchParams.set("cursor", params.cursor);
    if (params.limit) searchParams.set("limit", String(params.limit));

    const url = `${API_BASE}/events${searchParams.toString() ? `?${searchParams}` : ""}`;
    return fetchJson(url);
  },

  async getEvent(id) {
    const url = `${API_BASE}/events/${encodeURIComponent(id)}`;
    return fetchJson(url);
  },

  async getAgents() {
    const url = `${API_BASE}/agents`;
    return fetchJson(url);
  },

  async getHistogram(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set("q", params.q);
    if (params.agent) searchParams.set("agent", params.agent);
    if (params.status) searchParams.set("status", params.status);
    if (params.from) searchParams.set("from", params.from);
    if (params.to) searchParams.set("to", params.to);
    if (params.bucket) searchParams.set("bucket", params.bucket);

    const url = `${API_BASE}/events/histogram${searchParams.toString() ? `?${searchParams}` : ""}`;
    return fetchJson(url);
  },
};

export { ApiError };
export default api;