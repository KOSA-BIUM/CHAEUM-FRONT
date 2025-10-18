<template>
  <div class="space-y-5">
    <!-- 날짜 -->
    <div class="flex items-start gap-4">
      <div class="text-muted-foreground w-16 shrink-0 pt-2 text-sm">날짜</div>
      <div class="flex-1">
        <PopoverRoot v-model:open="datePopover">
          <PopoverTrigger as-child>
            <button
              type="button"
              class="hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <CalendarDays class="h-4 w-4" />
              <span>{{ dateLabel }}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            class="z-50 mt-2 rounded-md border bg-white p-3 shadow-md dark:bg-zinc-900"
          >
            <CalendarRoot
              v-slot="{ grid, weekDays }"
              :week-starts-on="1"
              locale="ko-KR"
              class="p-0"
              @update:modelValue="onPickDate"
            >
              <CalendarHeader class="mb-2">
                <CalendarPrevButton />
                <CalendarHeading />
                <CalendarNextButton />
              </CalendarHeader>
              <div class="mb-1 grid grid-cols-7 gap-1">
                <div
                  v-for="d in weekDays"
                  :key="d"
                  class="text-muted-foreground rounded-md px-2 py-1 text-center text-xs"
                >
                  {{ d }}
                </div>
              </div>
              <div
                v-for="month in grid"
                :key="month.value.toString()"
                class="grid grid-cols-7 gap-1"
              >
                <template v-for="(weekDates, idx) in month.rows" :key="`pick-${idx}`">
                  <template v-for="wd in weekDates" :key="wd.toString()">
                    <CalendarCell :date="wd" class="text-left">
                      <CalendarCellTrigger
                        :day="wd"
                        :month="month.value"
                        class="h-8 w-8 cursor-pointer p-0"
                      />
                    </CalendarCell>
                  </template>
                </template>
              </div>
            </CalendarRoot>
          </PopoverContent>
        </PopoverRoot>
      </div>
    </div>

    <!-- 분류 -->
    <div class="flex items-start gap-4">
      <div class="text-muted-foreground w-16 shrink-0 pt-2 text-sm">분류</div>
      <div class="flex-1 space-y-3">
        <div class="flex items-center gap-2">
          <select
            class="hover:bg-accent w-28 cursor-pointer rounded-md border px-3 py-2 text-sm outline-none"
            :value="form.diet"
            @change="e => updateField('diet', e.target && e.target.value)"
          >
            <option value="아침">아침</option>
            <option value="점심">점심</option>
            <option value="저녁">저녁</option>
            <option value="간식">간식</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 음식 항목들 (여러 개) -->
    <div class="space-y-4">
      <div
        v-for="(it, idx) in items"
        :key="it.mealItemId ?? idx"
        class="mx-1 rounded-md border-0 p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      >
        <div class="mb-2 flex items-center justify-between">
          <div class="text-muted-foreground text-sm font-medium">음식 {{ idx + 1 }}</div>
          <button
            v-if="items.length > 1"
            type="button"
            class="!cursor-pointer text-xs text-rose-600 underline-offset-2 hover:underline"
            @click="removeItem(idx)"
          >
            삭제
          </button>
        </div>
        <MealItemForm v-model="items[idx]" />
      </div>
      <div>
        <button
          type="button"
          class="hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
          @click="addItem"
        >
          + 항목 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { PopoverRoot, PopoverTrigger, PopoverContent } from "radix-vue";
import { CalendarDays } from "lucide-vue-next";
import { CalendarRoot } from "reka-ui";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
} from "@/components/ui/calendar";
import MealItemForm from "./MealItemForm.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      date: "",
      diet: "아침",
      items: [
        {
          name: "",
          ingredients: "",
          nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
        },
      ],
      photos: [],
    }),
  },
  mode: { type: String, default: "create" },
});
const emit = defineEmits(["update:modelValue"]);

const datePopover = ref(false);

const form = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
});

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function updateField(key, value) {
  form.value = { ...form.value, [key]: value };
}

function updateNutrition(key, value) {
  form.value = { ...form.value, nutrition: { ...form.value.nutrition, [key]: value } };
}

function numberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmd(str) {
  const [y, m, d] = (str || "").split("-").map(x => Number(x));
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

function keyOf(day) {
  if (!day) return "";
  if (day instanceof Date) return ymd(day);
  if (typeof day === "string") return day;
  if (typeof day.toString === "function") {
    const s = day.toString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  }
  return "";
}

const dateLabel = computed(() => {
  if (!form.value.date) return "날짜 선택";
  const d = parseYmd(form.value.date);
  if (isNaN(d.getTime())) return "날짜 선택";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
});

function onPickDate(val) {
  const key = keyOf(val);
  if (key) {
    updateField("date", key);
    datePopover.value = false;
  }
}

// Multiple items helpers
const items = computed({
  get: () => form.value.items || [],
  set: v => {
    // Also reflect first item to legacy top-level fields for compatibility
    const first = v[0] || { name: "", ingredients: "", nutrition: {} };
    form.value = {
      ...form.value,
      items: v,
      name: first.name ?? "",
      ingredients: first.ingredients ?? "",
      nutrition: { ...form.value.nutrition, ...first.nutrition },
    };
  },
});

function addItem() {
  items.value = [
    ...items.value,
    {
      name: "",
      ingredients: "",
      nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
    },
  ];
}
function removeItem(idx) {
  const clone = items.value.slice();
  clone.splice(idx, 1);
  items.value = clone.length
    ? clone
    : [
        {
          name: "",
          ingredients: "",
          nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
        },
      ];
}
</script>
