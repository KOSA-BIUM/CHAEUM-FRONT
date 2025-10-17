import { http } from "@/lib/http";

// Example: GET /api/users/me returns current user profile { userId, ... }
export async function fetchCurrentUser() {
  const { data } = await http.get("/api/health/secure");
  return data;
}
