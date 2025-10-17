<template>
  <div class="space-y-2">
    <!-- 음식 이름 -->
    <div class="flex items-start gap-4">
      <div class="text-muted-foreground w-16 shrink-0 pt-2 text-sm">음식 이름</div>
      <div class="flex-1">
        <input
          class="w-full rounded-md border px-3 py-2 text-sm outline-none"
          type="text"
          placeholder="음식 이름"
          :value="model.name"
          @input="e => patch({ name: e.target && e.target.value })"
        />
      </div>
    </div>

    <!-- 재료 -->
    <div class="flex items-start gap-4">
      <div class="text-muted-foreground flex w-16 shrink-0 flex-col items-start gap-1 pt-2 text-sm">
        <div>재료</div>
        <div>(선택사항)</div>
      </div>
      <div class="flex-1">
        <textarea
          class="mt-1 w-full resize-none rounded-md border p-3 text-sm outline-none"
          rows="3"
          placeholder="음식에 들어가는 재료를 적어주세요 (예: 김치, 참치, 두부…)"
          :value="model.ingredients"
          @input="e => patch({ ingredients: e.target && e.target.value })"
        />
      </div>
    </div>

    <!-- 영양정보 -->
    <div class="space-y-2">
      <div class="text-muted-foreground text-sm">영양정보 (선택사항)</div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <div class="flex flex-col items-center gap-2 rounded-md border-0 bg-[#C2E66E] p-3 text-sm">
          <div class="text-muted-foreground">칼로리</div>
          <div class="flex w-full items-center gap-2">
            <div class="relative w-full">
              <input
                class="w-full rounded-md border bg-[#E8FAD6] px-2 py-1 pr-8 text-right outline-none"
                type="text"
                :value="model.nutrition.kcal ?? ''"
                @input="e => patchNutrition('kcal', numberOrNull(e.target && e.target.value))"
              />
              <span
                class="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
                >kcal</span
              >
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 rounded-md border-0 bg-[#FFCB65] p-3 text-sm">
          <div class="text-muted-foreground">탄수화물</div>
          <div class="flex w-full items-center gap-2">
            <div class="relative w-full">
              <input
                class="w-full rounded-md border bg-[#FFF1D6] px-2 py-1 pr-5 text-right outline-none"
                type="text"
                :value="model.nutrition.carbs ?? ''"
                @input="e => patchNutrition('carbs', numberOrNull(e.target && e.target.value))"
              />
              <span
                class="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
                >g</span
              >
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 rounded-md border-0 bg-[#FFA257] p-3 text-sm">
          <div class="text-muted-foreground">단백질</div>
          <div class="flex w-full items-center gap-2">
            <div class="relative w-full">
              <input
                class="w-full rounded-md border bg-[#FFE8D6] px-2 py-1 pr-5 text-right outline-none"
                type="text"
                :value="model.nutrition.protein ?? ''"
                @input="e => patchNutrition('protein', numberOrNull(e.target && e.target.value))"
              />
              <span
                class="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
                >g</span
              >
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 rounded-md border-0 bg-[#E1E1E2] p-3 text-sm">
          <div class="text-muted-foreground">지방</div>
          <div class="flex w-full items-center gap-2">
            <div class="relative w-full">
              <input
                class="w-full rounded-md border bg-[#F7F7F7] px-2 py-1 pr-5 text-right outline-none"
                type="text"
                :value="model.nutrition.fat ?? ''"
                @input="e => patchNutrition('fat', numberOrNull(e.target && e.target.value))"
              />
              <span
                class="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
                >g</span
              >
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2 rounded-md border-0 bg-[#FFE1E3] p-3 text-sm">
          <div class="text-muted-foreground">나트륨</div>
          <div class="flex w-full items-center gap-2">
            <div class="relative w-full">
              <input
                class="w-full rounded-md border bg-[#FFEAEA] px-2 py-1 pr-7 text-right outline-none"
                type="text"
                :value="model.nutrition.sodium ?? ''"
                @input="e => patchNutrition('sodium', numberOrNull(e.target && e.target.value))"
              />
              <span
                class="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
                >mg</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- remove slot/button -->
    <div class="flex justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      mealItemId: undefined,
      name: "",
      ingredients: "",
      nutrition: { kcal: null, carbs: null, protein: null, fat: null, sodium: null },
    }),
  },
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: v => emit("update:modelValue", v),
});

function patch(obj) {
  model.value = { ...model.value, ...obj };
}
function patchNutrition(key, value) {
  model.value = { ...model.value, nutrition: { ...model.value.nutrition, [key]: value } };
}
function numberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}
</script>
