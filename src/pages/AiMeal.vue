<template>
  <MainLayout>
    <!-- Featured Menu Card -->
    <section class="mb-8 grid grid-cols-12 gap-4">
      <div class="col-span-8 rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex gap-4">
          <div class="h-28 w-40 overflow-hidden rounded-xl bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop"
              alt="Featured"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h2 class="mb-2 text-xl leading-snug font-bold">
              Grilled Turkey Breast with Steamed Asparagus and Brown Rice
            </h2>
            <div class="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#7D7D7D]">
              <span class="rounded-md bg-[#FFF5CC] px-2 py-0.5 text-[#A67C00]">Lunch</span>
              <span>•</span>
              <span>4.8/5 (125 reviews)</span>
              <span>•</span>
              <span>Difficulty Medium</span>
              <span>•</span>
              <span>Cook 10 minutes</span>
            </div>
            <button
              class="mt-1 rounded-xl bg-[#9AD77C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#89c36e]"
            >
              Add to Meal Plan
            </button>
          </div>
        </div>
      </div>
      <div class="col-span-4 space-y-3">
        <div class="rounded-xl bg-[#E2F3C9] p-3">
          <p class="text-xs text-[#4D6B2F]">Calories</p>
          <p class="text-lg font-semibold text-[#2B2B2B]">450 kcal</p>
        </div>
        <div class="rounded-xl bg-[#FFE4AF] p-3">
          <p class="text-xs text-[#7C4A00]">Carbs</p>
          <p class="text-lg font-semibold text-[#2B2B2B]">40 gr</p>
        </div>
        <div class="rounded-xl bg-[#FFD7CC] p-3">
          <p class="text-xs text-[#7E3321]">Proteins</p>
          <p class="text-lg font-semibold text-[#2B2B2B]">35 gr</p>
        </div>
        <div class="rounded-xl bg-[#EAEAEA] p-3">
          <p class="text-xs text-[#5F5F5F]">Fats</p>
          <p class="text-lg font-semibold text-[#2B2B2B]">12 gr</p>
        </div>
      </div>
    </section>

    <!-- All Menu -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm">
          <span class="rounded-full bg-[#2ECC71]/10 px-3 py-1 font-medium text-[#2ECC71]">All</span>
          <button class="rounded-full px-3 py-1 text-[#7D7D7D] hover:bg-[#F1F3F7]">
            Breakfast
          </button>
          <button class="rounded-full px-3 py-1 text-[#7D7D7D] hover:bg-[#F1F3F7]">Lunch</button>
          <button class="rounded-full px-3 py-1 text-[#7D7D7D] hover:bg-[#F1F3F7]">Snack</button>
          <button class="rounded-full px-3 py-1 text-[#7D7D7D] hover:bg-[#F1F3F7]">Dinner</button>
        </div>
        <div class="flex items-center gap-3 text-sm text-[#7D7D7D]">
          <button class="rounded-lg border px-3 py-1 hover:bg-[#F1F3F7]">Filter</button>
          <div class="flex items-center gap-2">
            <span>Sort by:</span>
            <select class="rounded-lg border px-2 py-1">
              <option>Calories</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <MenuItem
          title="Avocado Toast with Poached Egg"
          tag="Breakfast"
          kcal="320"
          carbs="30"
          protein="14"
          fat="18"
          health="9"
          image="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop"
        />
        <MenuItem
          title="Grilled Shrimp Tacos with Mango Salsa"
          tag="Lunch"
          kcal="400"
          carbs="45"
          protein="28"
          fat="12"
          health="8"
          image="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop"
        />
        <MenuItem
          title="Baked Chicken Breast with Quinoa and Kale"
          tag="Dinner"
          kcal="480"
          carbs="50"
          protein="40"
          fat="15"
          health="9"
          image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"
        />
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-10 rounded-2xl bg-white p-4 text-center text-sm text-[#7D7D7D] shadow-sm">
      Copyright © 2025 (주)비움
    </footer>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import MenuItem from "@/components/menu/MenuItem.vue";
</script>

<style scoped>
/* page-specific styles can go here */
</style>
