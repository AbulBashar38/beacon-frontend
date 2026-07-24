export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

const TOKEN_KEY = "beacon_access_token";
const USER_KEY = "beacon_auth_user";
export const AUTH_SESSION_EVENT = "beacon-auth-session";

export function saveAuthSession(accessToken: string, user: AuthUser, remember: boolean) {
  clearAuthSession();
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(TOKEN_KEY, accessToken);
  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  const token =
    window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) throw new Error("Invalid token");
    const normalizedPayload = encodedPayload.replaceAll("-", "+").replaceAll("_", "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const payload = JSON.parse(
      window.atob(paddedPayload),
    ) as { exp?: number };
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      clearAuthSession();
      return null;
    }
  } catch {
    clearAuthSession();
    return null;
  }

  return token;
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const value =
    window.localStorage.getItem(USER_KEY) ?? window.sessionStorage.getItem(USER_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}
