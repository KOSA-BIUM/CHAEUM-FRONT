<template>
  <div class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
    <div class="h-16 w-16 overflow-hidden rounded-xl bg-gray-200">
      <img :src="image" alt="" class="h-full w-full object-cover" />
    </div>
    <div class="flex-1">
      <div class="mb-1 flex items-center gap-2 text-xs">
        <span class="rounded-md bg-[#EAF6D9] px-2 py-0.5 text-[#4D6B2F]">{{ tag }}</span>
        <span class="rounded-md bg-[#F3F6FB] px-2 py-0.5 text-[#7D7D7D]">Easy</span>
      </div>
      <h3 class="text-base font-semibold">{{ title }}</h3>
      <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#7D7D7D]">
        <span>{{ kcal }} kcal</span>
        <span>{{ carbs }}g carbs</span>
        <span>{{ protein }}g protein</span>
        <span>{{ fat }}g fats</span>
      </div>
    </div>
    <div class="hidden items-center gap-2 md:flex">
      <div class="text-sm text-[#7D7D7D]">
        Health Score:
        <span class="font-semibold text-[#2B2B2B]">{{ health }}/10</span>
      </div>
      <div class="flex gap-0.5">
        <span
          v-for="n in 10"
          :key="n"
          class="h-2 w-2 rounded-full"
          :class="n <= Number(health) ? 'bg-[#FF8C5A]' : 'bg-[#F0F0F0]'"
        ></span>
      </div>
    </div>
    <button
      class="rounded-xl bg-[#9AD77C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#89c36e]"
    >
      Add to Meal Plan
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  tag: String,
  kcal: String,
  carbs: String,
  protein: String,
  fat: String,
  health: String,
  image: String,
});
</script>
