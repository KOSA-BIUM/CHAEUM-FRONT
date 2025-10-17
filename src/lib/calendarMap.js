// Map API mealCards to calendar events used in UI
// API division: 'BREAKFAST'|'LUNCH'|'DINNER'|'SNACK'
export const divisionToKorean = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  SNACK: "간식",
};

export const dietColorMap = { 아침: "blue", 점심: "purple", 저녁: "red", 간식: "yellow" };

export function isoToYmd(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

export function mapMealCardsToEvents(mealCards = []) {
  return mealCards.map(mc => {
    const title = divisionToKorean[mc.division] || "식단";
    const date = isoToYmd(mc.recordDate);
    const color = dietColorMap[title] || "green";
    return {
      id: mc.mealCardId,
      date,
      title,
      color,
      mealId: mc.mealCardId,
    };
  });
}
