import { http } from "@/lib/http";

// GET /api/calendar?userId=...&yearMonth=YYYY-MM
export async function fetchCalendar({ userId, yearMonth }) {
  if (!userId || !yearMonth) {
    throw Object.assign(new Error("Missing required params"), { status: 400 });
  }
  try {
    const { data } = await http.get("/api/calendar", { params: { userId, yearMonth } });
    console.log(data);
    return data;
  } catch (err) {
    // err already normalized in axios interceptor
    // Surface specific statuses for caller to branch (404, 400, 409, etc.)
    throw err;
  }
}
