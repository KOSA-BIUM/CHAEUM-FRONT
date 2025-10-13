<template>
  <MainLayout>
    <section class="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">캘린더</h2>
      </div>

      <!-- Notion-like Calendar using shadcn calendar primitives -->
      <CalendarRoot
        v-slot="{ grid, weekDays }"
        v-model:modelValue="selected"
        :week-starts-on="1"
        fixed-weeks
        weekday-format="short"
        locale="ko-KR"
        class="p-0"
      >
        <CalendarHeader class="mb-3">
          <div class="flex items-center gap-2">
            <CalendarPrevButton />
            <CalendarNextButton />
          </div>
          <CalendarHeading class="text-base font-semibold sm:text-lg" />
        </CalendarHeader>

        <!-- Weekday headings -->
        <div class="mb-1 grid grid-cols-7 gap-1">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-muted-foreground rounded-md px-2 py-1 text-[0.8rem] font-normal"
          >
            {{ day }}
          </div>
        </div>

        <!-- Month grid -->
        <div v-for="month in grid" :key="month.value.toString()" class="grid grid-cols-7 gap-1">
          <template v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`">
            <template v-for="weekDate in weekDates" :key="weekDate.toString()">
              <!-- Day cell -->
              <CalendarCell
                :date="weekDate"
                class="group h-36 overflow-hidden rounded-md border p-0 text-left"
              >
                <div class="relative flex h-full flex-col">
                  <!-- Date number top-right -->
                  <CalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="absolute top-1 right-1 h-7 w-7 rounded-sm p-0 text-[11px]"
                  />

                  <!-- Hover plus button -->
                  <button
                    type="button"
                    class="bg-background text-muted-foreground hover:bg-accent cursor-point absolute top-1 left-1 hidden size-6 cursor-pointer items-center justify-center rounded-md border shadow-sm transition-colors group-hover:flex"
                    title="추가"
                    @click.stop="openFor(weekDate)"
                  >
                    <Plus class="size-4" />
                  </button>

                  <!-- Events list -->
                  <div class="mt-8 flex flex-1 flex-col gap-1 px-1 pb-1">
                    <button
                      v-for="ev in eventsFor(weekDate)"
                      :key="ev.id"
                      type="button"
                      class="group flex w-full cursor-pointer items-center gap-1 truncate rounded-[4px] px-1 py-0.5 text-left text-[11px] transition-colors"
                      :class="ev.colorClass"
                      @click.stop="openMeal(ev)"
                    >
                      <span
                        class="block h-2 w-2 shrink-0 rounded-[3px] opacity-80"
                        :class="ev.dotClass"
                      />
                      <span class="truncate">{{ ev.title }}</span>
                    </button>
                  </div>
                </div>
              </CalendarCell>
            </template>
          </template>
        </div>
      </CalendarRoot>

      <!-- Meal create/edit/detail dialog -->
      <MealDialog
        v-model:open="mealDialogOpen"
        :mode="mealDialogMode"
        :meal="mealEditing"
        @submit="onMealSubmit"
        @edit="onMealEdit"
        @update="onMealUpdate"
        @delete="onMealDelete"
      />
    </section>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
} from "@/components/ui/calendar";
import { CalendarRoot } from "reka-ui";
import { computed, ref } from "vue";
import { Plus } from "lucide-vue-next";
import MealDialog from "@/components/meal/MealDialog.vue";

// Simple sample events for the current month
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

// Mock meals store keyed by mealId
const meals = ref({
  "m-seed-1": {
    id: "m-seed-1",
    date: ymd(new Date(currentYear, currentMonth, 2)),
    diet: "아침",
    items: [
      {
        name: "오트밀",
        ingredients: "귀리 60g, 우유 200ml",
        nutrition: { kcal: 300, carbs: 50, protein: 12, fat: 6, sodium: 200 },
      },
      {
        name: "삶은 계란",
        ingredients: "계란 2개",
        nutrition: { kcal: 140, carbs: 2, protein: 12, fat: 9, sodium: 120 },
      },
      {
        name: "바나나",
        ingredients: "1개",
        nutrition: { kcal: 110, carbs: 27, protein: 1, fat: 0, sodium: 1 },
      },
    ],
    photos: [],
  },
});

const events = ref([
  {
    id: "e1",
    date: ymd(new Date(currentYear, currentMonth, 2)),
    title: "아침",
    color: "blue",
    mealId: "m-seed-1",
  },
]);

const colorMap = {
  blue: {
    colorClass:
      "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/40",
    dotClass: "bg-blue-500",
  },
  green: {
    colorClass:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:hover:bg-emerald-900/40",
    dotClass: "bg-emerald-500",
  },
  purple: {
    colorClass:
      "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-200 dark:hover:bg-violet-900/40",
    dotClass: "bg-violet-500",
  },
  red: {
    colorClass:
      "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/40",
    dotClass: "bg-rose-500",
  },
  yellow: {
    colorClass:
      "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/40",
    dotClass: "bg-amber-500",
  },
  gray: {
    colorClass:
      "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-200 dark:hover:bg-zinc-900/40",
    dotClass: "bg-zinc-400",
  },
};

// Map meal diet (분류) to event color keys
const dietColorMap = { 아침: "blue", 점심: "purple", 저녁: "red", 간식: "yellow" };

const eventsByDay = computed(() => {
  const map = {};
  // Build grouped map and carry original index for stable fallbacks
  events.value.forEach((e, idx) => {
    const key = e.date;
    const { colorClass, dotClass } = colorMap[e.color] || colorMap.gray;
    const withStyle = { ...e, colorClass, dotClass, __idx: idx };
    if (!map[key]) map[key] = [];
    map[key].push(withStyle);
  });

  // Desired diet order for meal events
  const dietOrder = { 아침: 0, 점심: 1, 저녁: 2, 간식: 3 };

  // Sort each day's events: meals by diet order first, then others by original order
  Object.keys(map).forEach(key => {
    map[key].sort((a, b) => {
      const ai = dietOrder[a.title];
      const bi = dietOrder[b.title];
      const aIsMeal = ai !== undefined;
      const bIsMeal = bi !== undefined;
      if (aIsMeal && bIsMeal) return ai - bi;
      if (aIsMeal && !bIsMeal) return -1;
      if (!aIsMeal && bIsMeal) return 1;
      // Neither is a meal event; keep insertion order
      return (a.__idx ?? 0) - (b.__idx ?? 0);
    });
  });

  return map;
});

// Helpers
function keyOf(day) {
  if (!day) return "";
  if (day instanceof Date) return ymd(day);
  if (typeof day === "string") return day;
  if (typeof day.toString === "function") {
    const s = day.toString();
    // Expect YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  }
  return "";
}

function eventsFor(dayLike) {
  const key = keyOf(dayLike);
  return eventsByDay.value[key] ?? [];
}

const selected = ref(null); // CalendarRoot selection (CalendarDate or string)

// Meal dialog state
const mealDialogOpen = ref(false);
const mealDialogMode = ref("create"); // 'create' | 'view' | 'edit'
function makeEmptyMeal(date = "") {
  return {
    id: undefined,
    date,
    diet: "아침",
    items: [
      {
        name: "",
        ingredients: "",
        nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
      },
    ],
    photos: [],
  };
}
const mealEditing = ref(makeEmptyMeal(""));

function openFor(dayLike) {
  const dateKey = keyOf(dayLike);
  mealEditing.value = makeEmptyMeal(dateKey);
  mealDialogMode.value = "create";
  mealDialogOpen.value = true;
}

function onMealSubmit(payload) {
  // Optionally reflect the new meal on the calendar as an event pill
  // Use the selected diet (분류) as the event title instead of a generic label
  const diet = typeof payload?.diet === "string" ? payload.diet.trim() : "";
  const title = diet || "식단";
  const date = payload?.date;
  if (title && date) {
    const mealId = `m-${Date.now()}`;
    meals.value = { ...meals.value, [mealId]: { ...payload, id: mealId } };
    const color = dietColorMap[title] || "green";
    events.value = [...events.value, { id: `ev-${Date.now()}`, date, title, color, mealId }];
  }
  mealDialogOpen.value = false;
}

function onMealEdit() {
  // Switch dialog into edit mode while keeping it open
  mealDialogMode.value = "edit";
}

function onMealUpdate(payload) {
  if (!payload || !payload.id) {
    // No id to update; keep dialog state unchanged
    return;
  }
  // Persist meal changes
  meals.value = { ...meals.value, [payload.id]: { ...payload } };

  // Update linked calendar event (title/color/date)
  const idx = events.value.findIndex(e => e.mealId === payload.id);
  const title = (payload.diet || "").trim() || "식단";
  const color = dietColorMap[title] || "green";
  if (idx >= 0) {
    const prev = events.value[idx];
    const updated = { ...prev, title, color, date: payload.date };
    const next = events.value.slice();
    next.splice(idx, 1, updated);
    events.value = next;
  } else {
    // If no event existed (edge case), create one now
    events.value = [
      ...events.value,
      { id: `ev-${Date.now()}`, date: payload.date, title, color, mealId: payload.id },
    ];
  }

  // Reflect updated meal in dialog and return to view mode
  mealEditing.value = JSON.parse(JSON.stringify(payload));
  mealDialogMode.value = "view";
}

function onMealDelete() {
  const id = mealEditing.value?.id;
  if (!id) {
    mealDialogOpen.value = false;
    return;
  }
  // Remove from meals store
  const { [id]: _omit, ...rest } = meals.value;
  meals.value = rest;
  // Remove all events linked to this meal
  events.value = events.value.filter(e => e.mealId !== id);
  // Close and reset dialog state
  mealDialogOpen.value = false;
  mealEditing.value = makeEmptyMeal("");
  mealDialogMode.value = "create";
}

function openMeal(ev) {
  if (!ev?.mealId) return;
  const meal = meals.value[ev.mealId];
  if (!meal) return;
  // Open MealDialog in view mode with the selected meal
  mealEditing.value = JSON.parse(JSON.stringify(meal));
  mealDialogMode.value = "view";
  mealDialogOpen.value = true;
}
</script>
