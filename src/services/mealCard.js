import { http } from "@/lib/http";
// GET /api/mealCard?calendarId=cal-abc
export async function listMealCards({ calendarId }) {
  if (!calendarId) {
    const err = new Error("calendarId is required");
    err.status = 400;
    throw err;
  }
  const { data } = await http.get("/api/mealCard", { params: { calendarId } });
  return data;
}

// GET /api/mealCard/{mealCardId}
export async function getMealCard(mealCardId) {
  if (!mealCardId) {
    const err = new Error("mealCardId is required");
    err.status = 400;
    throw err;
  }
  const { data } = await http.get(`/api/mealCard/${encodeURIComponent(mealCardId)}`);
  return data;
}

// POST /api/mealCard
// Body supports either { calendarId, ... } or { userId, yearMonth, ... }
export async function createMealCard(body) {
  if (!body || !body.recordDate || !body.division) {
    const err = new Error("recordDate and division are required");
    err.status = 400;
    throw err;
  }
  // backend returns 201 + Location header; axios exposes data as response.data
  const res = await http.post("/api/mealCard", body);
  return res.data;
}

// PUT /api/mealCard/{mealCardId}
export async function updateMealCard(mealCardId, body) {
  if (!mealCardId) {
    const err = new Error("mealCardId is required");
    err.status = 400;
    throw err;
  }
  const { data } = await http.put(`/api/mealCard/${encodeURIComponent(mealCardId)}`, body);
  return data;
}

// DELETE /api/mealCard/{mealCardId}
export async function deleteMealCard(mealCardId) {
  if (!mealCardId) {
    const err = new Error("mealCardId is required");
    err.status = 400;
    throw err;
  }
  await http.delete(`/api/mealCard/${encodeURIComponent(mealCardId)}`);
  return true;
}
