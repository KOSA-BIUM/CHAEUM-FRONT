<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F6F7FB] px-4">
    <div class="w-full max-w-md">
      <div class="mb-6 flex items-center justify-center gap-2">
        <img :src="logo" alt="채움 로고" class="h-5 w-5" />
        <span class="text-lg font-semibold">채움</span>
      </div>
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <slot />
      </div>
      <p class="mt-4 text-center text-xs text-[#7D7D7D]">© 2025 (주)비움</p>
    </div>
  </div>
</template>

<script setup>
import logo from '@/assets/logo.svg'
</script>
