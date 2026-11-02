// Client for the Shadawi User API. The website calls it directly; the session lives in
// HttpOnly cookies set by the API, so this code never sees or stores tokens.
const BASE_URL = process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:3060";

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function send(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      method,
      credentials: "include", // send/receive the session cookies
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "network", "Can't reach the server. Check your connection and try again.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    const err = json?.error || {};
    throw new ApiError(res.status, err.code || "error", err.message || "Something went wrong.", err);
  }
  return json.data;
}

// Several requests can hit an expired access token at once — refresh only once for all of them
let refreshing = null;
const refreshSession = () => {
  if (!refreshing) refreshing = send("/auth/refresh", { method: "POST" }).finally(() => { refreshing = null; });
  return refreshing;
};

// Access tokens last 15 minutes: on a 401, refresh quietly and retry once
async function request(path, options) {
  try {
    return await send(path, options);
  } catch (err) {
    if (err.status !== 401 || path.startsWith("/auth/")) throw err;
    await refreshSession();
    return send(path, options);
  }
}

export const userApi = {
  me: () => request("/me"),
  startEmail: (email) => request("/auth/email/start", { method: "POST", body: { email } }),
  verifyEmail: (email, code) => request("/auth/email/verify", { method: "POST", body: { email, code, client: "web" } }),
  google: (idToken) => request("/auth/google", { method: "POST", body: { idToken, client: "web" } }),
  setUsername: (username) => request("/me/username", { method: "PATCH", body: { username } }),
  logout: () => request("/auth/logout", { method: "POST" }),
};
