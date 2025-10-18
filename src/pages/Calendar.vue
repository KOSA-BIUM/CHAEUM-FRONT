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
import { computed, ref, watchEffect } from "vue";
import { useCalendar } from "@/composables/useCalendar";
import { mapMealCardsToEvents, divisionToKorean } from "@/lib/calendarMap";
import { useCurrentUser } from "@/composables/useCurrentUser";
import { useCreateMealCard, useUpdateMealCard, useDeleteMealCard } from "@/composables/useMealCard";
import { useQueryClient } from "@tanstack/vue-query";
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
// Track the currently displayed month via CalendarRoot placeholder
const viewMonth = ref(null); // CalendarDate-like object from reka-ui

// User + API calendar data
const { data: me } = useCurrentUser();
const userIdRef = computed(() => me?.value?.userId);
// Compute yearMonth (YYYY-MM) from the visible month; fallback to today's month
const yearMonth = computed(() => {
  const vm = viewMonth?.value;
  if (!vm) {
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  }
  // Try string form first, expected like YYYY-MM or YYYY-MM-DD
  const s = typeof vm?.toString === "function" ? vm.toString() : "";
  const m = s.match(/^(\d{4})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}`;
  // Fallback to properties (CalendarDate has year/month)
  const y = vm.year ?? vm?.value?.year;
  const mm = vm.month ?? vm?.value?.month;
  if (y && mm) return `${y}-${String(mm).padStart(2, "0")}`;
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
});
const { data: calData, isLoading, isError, error } = useCalendar(userIdRef, yearMonth);
// Local UI events (derived from API)
const events = ref([]);
const qc = useQueryClient();
const invalidateCalendar = () => qc.invalidateQueries({ queryKey: ["calendar"] });
watchEffect(() => {
  const mealCards = calData?.value?.mealCards;
  if (mealCards) {
    events.value = mapMealCardsToEvents(mealCards);
  }
  if (isError?.value && error?.value?.status === 404) {
    // 해당 월 데이터 없음 → 빈 달 유지
    events.value = [];
  }
});

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

// Diet mapping between UI(KR) and API enum
const DIET_ENUM = { 아침: "BREAKFAST", 점심: "LUNCH", 저녁: "DINNER", 간식: "SNACK" };

function toRecordDateISO(dateYmd) {
  // Default time at 12:00:00 local; adjust if server expects UTC
  return `${dateYmd}T12:00:00`;
}

function mapMealToApiBody(payload, calendarId) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  return {
    ...(calendarId ? { calendarId } : { userId: userIdRef.value, yearMonth: yearMonth.value }),
    recordDate: toRecordDateISO(payload.date),
    division: DIET_ENUM[payload.diet?.trim()] || "BREAKFAST",
    items: items.map(it => ({
      // mealItemId optional for update
      ...(it.mealItemId ? { mealItemId: it.mealItemId } : {}),
      name: it.name || "",
      ingredient: it.ingredients || "",
      carbohydrate: it.nutrition?.carbs ?? null,
      protein: it.nutrition?.protein ?? null,
      fat: it.nutrition?.fat ?? null,
      sodium: it.nutrition?.sodium ?? null,
      calorie: it.nutrition?.kcal ?? null,
    })),
  };
}

const createMealMut = useCreateMealCard();
const updateMealMut = useUpdateMealCard();
const deleteMealMut = useDeleteMealCard();

async function onMealSubmit(payload) {
  try {
    const calendarId = calData?.value?.calendarId;
    const body = mapMealToApiBody(payload, calendarId);
    await createMealMut.mutateAsync(body);
    await invalidateCalendar();
  } finally {
    mealDialogOpen.value = false;
  }
}

function onMealEdit() {
  // Switch dialog into edit mode while keeping it open
  mealDialogMode.value = "edit";
}

async function onMealUpdate(payload) {
  if (!payload || !payload.id) return;
  const calendarId = calData?.value?.calendarId;
  const body = mapMealToApiBody(payload, calendarId);
  await updateMealMut.mutateAsync({ mealCardId: payload.id, body });
  await invalidateCalendar();
  mealEditing.value = JSON.parse(JSON.stringify(payload));
  mealDialogMode.value = "view";
}

async function onMealDelete() {
  const id = mealEditing.value?.id;
  if (!id) return (mealDialogOpen.value = false);
  await deleteMealMut.mutateAsync(id);
  await invalidateCalendar();
  mealDialogOpen.value = false;
  mealEditing.value = makeEmptyMeal("");
  mealDialogMode.value = "create";
}

function mapMealCardToDialogMeal(card) {
  // Convert API mealCard to MealDialog model
  const d = new Date(card.recordDate);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return {
    id: card.mealCardId,
    date: `${yyyy}-${mm}-${dd}`,
    diet: divisionToKorean[card.division] || "아침",
    items: (card.mealItems || []).map(it => ({
      // preserve id for update mapping
      mealItemId: it.mealItemId,
      name: it.name || "",
      ingredients: it.ingredient || "",
      nutrition: {
        kcal: it.calorie ?? null,
        carbs: it.carbohydrate ?? null,
        protein: it.protein ?? null,
        fat: it.fat ?? null,
        sodium: it.sodium ?? null,
      },
    })),
    photos: [],
  };
}

function openMeal(ev) {
  if (!ev?.mealId) return;
  const card = calData?.value?.mealCards?.find(
    m => m.mealCardId === ev.mealId || m.mealCardId === ev.id,
  );
  if (!card) return;
  mealEditing.value = mapMealCardToDialogMeal(card);
  mealDialogMode.value = "view";
  mealDialogOpen.value = true;
}
</script>

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
        @update:placeholder="val => (viewMonth = val)"
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
