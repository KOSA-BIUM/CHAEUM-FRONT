<template>
  <div class="min-h-screen bg-[#F6F7FB] text-[#2B2B2B]">
    <div class="mx-auto flex max-w-[1200px] gap-6 p-6">
      <!-- Sidebar -->
      <aside class="sticky top-6 h-[calc(100vh-3rem)] w-60 rounded-2xl bg-white p-4 shadow-sm">
        <div class="mb-8 flex items-center gap-2 px-2">
          <img :src="logo" alt="채움 로고" class="h-5 w-5" />
          <span class="text-lg font-semibold">채움</span>
        </div>

        <nav class="space-y-1">
          <RouterLink
            to="/calendar"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-[#F1F3F7]"
            :class="isActive('/calendar') ? 'font-semibold text-[#2B2B2B]' : 'text-[#7D7D7D]'"
          >
            <span>캘린더</span>
          </RouterLink>
          <RouterLink
            to="/ai_meal"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-[#F1F3F7]"
            :class="isActive('/ai_meal') ? 'font-semibold text-[#2B2B2B]' : 'text-[#7D7D7D]'"
          >
            <span>AI 식단추천</span>
          </RouterLink>
          <RouterLink
            to="/profile"
            class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-[#F1F3F7]"
            :class="isActive('/profile') ? 'font-semibold text-[#2B2B2B]' : 'text-[#7D7D7D]'"
          >
            <span>프로필</span>
          </RouterLink>
        </nav>

        <div class="absolute right-4 bottom-4 left-4">
          <RouterLink
            to="/login"
            class="inline-flex w-full items-center justify-center rounded-xl border bg-[#F6F7FB] px-3 py-2 text-sm text-[#7D7D7D] hover:bg-[#EEF0F6]"
          >
            로그아웃
          </RouterLink>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <!-- Header -->
        <header class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
        </header>

        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";
import logo from "@/assets/logo.svg";

const route = useRoute();
const isActive = path => route.path === path;
const pageTitle = computed(() => route.meta?.title || "");
</script>

<style scoped>
/* Hide scrollbars for the sidebar area on Windows for a cleaner look */
aside::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* Ensure the logout button is positioned within the sidebar */
aside {
  position: sticky;
}
aside > div:last-child {
  position: absolute;
}
</style>
