<template>
  <div class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
    <div class="flex flex-row items-center w-full">
      <div class="mb-1 flex basis-1/9 items-center text-base justify-center">
        <span 
          :class="[
          'rounded-md px-2 py-0.5 text-black',
          getTagColors(tag)
          ]">
          {{ tag }}
        </span>
      </div>
      
      <div class="basis-4/9">
        <span class="text-base font-semibold">{{ title }}</span>
      </div>

      <div class="mt-1 basis-4/9 text-base">
    
        <div class="flex flex-row text-gray-600 font-medium text-sm">
            <span class="flex-1 text-center">칼로리</span>
            <span class="flex-1 text-center">탄수화물</span>
            <span class="flex-1 text-center">단백질</span>
            <span class="flex-1 text-center">지방</span>
            <span class="flex-1 text-center">나트륨</span>
        </div>
        
        <div class="flex flex-row font-bold mt-1 text-base">
            <span class="flex-1 text-center">{{ kcal }}kcal</span>
            <span class="flex-1 text-center">{{ carbs }}g</span>
            <span class="flex-1 text-center">{{ protein }}g</span>
            <span class="flex-1 text-center">{{ fat }}g</span>
            <span class="flex-1 text-center">{{ sodium }}mg</span>
        </div>
      </div>
    </div>
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
  sodium: String,
});

const tagColorMap = {
  아침: 'bg-[#C2E66E]',
  점심: 'bg-[#FFCB65]',
  간식: 'bg-[#FFA257]',
  저녁: 'bg-[#E1E1E2]',
  default: 'bg-gray-100',
};

const getTagColors = (tagValue) => {
  return tagColorMap[tagValue] || tagColorMap.default;
};
</script>
