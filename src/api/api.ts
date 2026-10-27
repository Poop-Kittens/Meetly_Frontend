import type {
  BasicMeetingResponse,
  CategoryResponse,
  CreateMeetingRequest,
  LoginRequest,
  MeetingParticipantResponse,
  MeetingResponse,
  MeetingReviewRequest,
  MeetingSearchRequest,
  UpdateMeetingRequest,
  UserRegister,
  UserResponse,
} from "../types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

// Ett eget felobjekt som förutom meddelandet också bär med sig statuskoden,
// Används tex i login och profile: e instanceof ApiError ? e.message : ...
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // skickar med auth-cookien
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new ApiError(res.status, problem?.detail ?? "Något gick fel.");
  }

  // 204 No Content (t.ex. avanmälan) har ingen body
  if (res.status === 204) return undefined as T;

  // Endpoints som returnerar en ren sträng (register/login) skickas som text, inte JSON
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("json")) return (await res.text()) as T;

  return res.json() as Promise<T>;
}

const json = (data: unknown) => JSON.stringify(data);

// Bygger "?a=1&b=2" och hoppar över tomma värden
function toQuery(params: object): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

// ---------- Användare ----------
export const register = (data: UserRegister) =>
  request<string>("/api/user/register", { method: "POST", body: json(data) });

export const login = (data: LoginRequest) =>
  request<string>("/api/user/login", { method: "POST", body: json(data) });

export const logout = () =>
  request<string>("/api/user/logout", { method: "POST" });

export const getCurrentUser = () => request<UserResponse>("/api/user/me");

// ---------- Möten ----------
export const getUpcomingMeetings = () =>
  request<BasicMeetingResponse[]>("/api/meeting/upcoming");

export const searchMeetings = (filters: MeetingSearchRequest) =>
  request<BasicMeetingResponse[]>(`/api/meeting/search${toQuery(filters)}`);

export const getMeeting = (id: number) =>
  request<MeetingResponse>(`/api/meeting/${id}`);

export const getMyMeetings = () =>
  request<BasicMeetingResponse[]>("/api/meeting/user");

export const createMeeting = (data: CreateMeetingRequest) =>
  request<MeetingResponse>("/api/meeting", {
    method: "POST",
    body: json(data),
  });

export const updateMeeting = (id: number, data: UpdateMeetingRequest) =>
  request<MeetingResponse>(`/api/meeting/${id}`, {
    method: "PUT",
    body: json(data),
  });

export const getCategories = () =>
  request<CategoryResponse[]>("/api/meeting/categories");

// ---------- Anmälan och recension ----------
export const signUp = (meetingId: number) =>
  request<MeetingResponse>(`/api/meeting/${meetingId}/registration`, {
    method: "POST",
  });

export const cancelRegistration = (meetingId: number) =>
  request<void>(`/api/meeting/${meetingId}/registration`, { method: "DELETE" });

export const reviewMeeting = (meetingId: number, data: MeetingReviewRequest) =>
  request<MeetingParticipantResponse>(
    `/api/meeting/${meetingId}/review${toQuery(data)}`,
    { method: "PUT" },
  );
