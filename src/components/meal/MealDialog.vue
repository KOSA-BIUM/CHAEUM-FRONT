<template>
  <Dialog v-model:open="modelOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>

      <!-- Scrollable body so footer can stick at bottom -->
      <div class="custom-dialog-body mt-2 flex-1 overflow-auto">
        <div v-if="mode === 'view'" class="space-y-5">
          <!-- Summary -->

          <div class="flex items-center gap-4">
            <div class="text-muted-foreground w-16 shrink-0 text-sm">날짜</div>
            <div class="flex-1 text-sm">{{ dateLabel }}</div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-muted-foreground w-16 shrink-0 text-sm">분류</div>
            <div class="flex-1">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                :class="dietBadgeClass"
                >{{ meal.diet }}</span
              >
            </div>
          </div>

          <!-- Items -->
          <div class="space-y-4">
            <Card
              v-for="(item, idx) in meal.items"
              :key="idx"
              class="mx-2 rounded-2xl border-0 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <CardHeader class="pb-2">
                <CardTitle class="truncate text-base">{{ item.name || "이름 없음" }}</CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <div class="flex items-start gap-4">
                  <div class="text-muted-foreground w-16 shrink-0 text-sm">재료</div>
                  <div class="flex-1 text-sm whitespace-pre-wrap">
                    {{ item.ingredients || "-" }}
                  </div>
                </div>
                <div>
                  <div class="text-muted-foreground mb-2 text-sm">영양정보</div>
                  <div class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
                    <div class="flex flex-col items-center rounded-md border-0 bg-[#C2E66E] p-3">
                      <div class="text-muted-foreground">칼로리</div>
                      <div>{{ item.nutrition?.kcal ?? "-" }} kcal</div>
                    </div>
                    <div class="flex flex-col items-center rounded-md border-0 bg-[#FFCB65] p-3">
                      <div class="text-muted-foreground">탄수화물</div>
                      <div>{{ item.nutrition?.carbs ?? "-" }} g</div>
                    </div>
                    <div class="flex flex-col items-center rounded-md border-0 bg-[#FFA257] p-3">
                      <div class="text-muted-foreground">단백질</div>
                      <div>{{ item.nutrition?.protein ?? "-" }} g</div>
                    </div>
                    <div class="flex flex-col items-center rounded-md border-0 bg-[#E1E1E2] p-3">
                      <div class="text-muted-foreground">지방</div>
                      <div>{{ item.nutrition?.fat ?? "-" }} g</div>
                    </div>
                    <div class="flex flex-col items-center rounded-md border-0 bg-[#FFE1E3] p-3">
                      <div class="text-muted-foreground">나트륨</div>
                      <div>{{ item.nutrition?.sodium ?? "-" }} mg</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div class="h-2"></div>
        </div>

        <MealForm v-else v-model:modelValue="editing" :mode="mode" />
      </div>

      <DialogFooter class="mt-auto flex items-center justify-center gap-4 pt-2">
        <!-- Actions vary by mode -->
        <template v-if="mode === 'create'">
          <Button @click="close" class="cursor-pointer bg-[#E1E1E2]">취소</Button>
          <Button
            variant="default"
            class="cursor-pointer bg-lime-500 text-white hover:bg-lime-600"
            @click="submitCreate"
            >등록</Button
          >
        </template>
        <template v-else-if="mode === 'edit'">
          <Button variant="secondary" @click="close" class="cursor-pointer">취소</Button>
          <Button
            variant="default"
            class="cursor-pointer bg-lime-500 text-white hover:bg-lime-600"
            @click="submitUpdate"
            >저장</Button
          >
        </template>
        <template v-else>
          <Button @click="$emit('delete')" class="cursor-pointer bg-[#FFA257]">삭제</Button>
          <Button variant="secondary" @click="$emit('edit')" class="cursor-pointer">수정</Button>
        </template>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch, toRaw } from "vue";
import MealForm from "./MealForm.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: "create" }, // 'create' | 'view' | 'edit'
  meal: {
    type: Object,
    default: () => ({
      id: undefined,
      date: "",
      diet: "아침",
      name: "",
      ingredients: "",
      memo: "",
      nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
      photos: [],
    }),
  },
});
const emit = defineEmits(["update:open", "submit", "update", "delete", "edit"]);

const modelOpen = computed({ get: () => props.open, set: v => emit("update:open", v) });
const title = computed(() =>
  props.mode === "create" ? "식단 등록" : props.mode === "edit" ? "식단 수정" : "식단 상세",
);

function deepClone(obj) {
  try {
    // Try structuredClone first if the data is plain
    return typeof structuredClone === "function"
      ? structuredClone(obj)
      : JSON.parse(JSON.stringify(obj));
  } catch (e) {
    // Fallback for non-cloneable (e.g., reactive proxies): strip reactivity then JSON clone
    try {
      const raw = toRaw(obj);
      return JSON.parse(JSON.stringify(raw));
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  }
}

const editing = ref(deepClone(props.meal));
watch(
  () => props.meal,
  v => {
    const cloned = deepClone(v);
    if (!Array.isArray(cloned.items) || cloned.items.length === 0) {
      cloned.items = [
        {
          name: "",
          ingredients: "",
          nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
        },
      ];
    }
    editing.value = cloned;
  },
  { deep: true },
);

function parseYmd(str) {
  const [y, m, d] = (str || "").split("-").map(x => Number(x));
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}
const dateLabel = computed(() => {
  const d = parseYmd(props.meal?.date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
});

const dietBadgeClass = computed(() => {
  const c = (props.meal?.diet || "").trim();
  const map = {
    아침: "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-100",
    점심: "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-100",
    저녁: "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-100",
    간식: "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-100",
  };
  return map[c] || "bg-zinc-100 text-zinc-800 ring-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-100";
});

const totalNutrition = computed(() => {
  const totals = { kcal: 0, carbs: 0, protein: 0, fat: 0, sodium: 0 };
  const items = Array.isArray(props.meal?.items) ? props.meal.items : [];
  for (const it of items) {
    const n = it?.nutrition || {};
    totals.kcal += Number(n.kcal || 0);
    totals.carbs += Number(n.carbs || 0);
    totals.protein += Number(n.protein || 0);
    totals.fat += Number(n.fat || 0);
    totals.sodium += Number(n.sodium || 0);
  }
  return totals;
});

function close() {
  modelOpen.value = false;
}
function submitCreate() {
  // Ensure at least one item
  const payload = { ...editing.value };
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    payload.items = [
      {
        meal: "",
        ingredients: "",
        nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
      },
    ];
  }
  emit("submit", payload);
}
function submitUpdate() {
  emit("update", { ...editing.value });
}
</script>
