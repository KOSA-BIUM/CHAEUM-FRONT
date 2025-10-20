<template>
  <main class="min-h-screen bg-gradient-to-b from-white to-emerald-50">
    <section class="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header class="mb-10 flex items-center justify-between">
        <h1 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
          CHAEUM
          <span class="text-emerald-600"> · 채움</span>
        </h1>
      </header>

      <div class="grid items-center gap-10">
        <div>
          <h2 class="mb-6 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            <span class="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">
              나의 식단을 간편하게 기록하고,
            </span>
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">
              더 건강하게 채우세요
            </span>
          </h2>
          <p class="mb-10 text-base leading-7 text-gray-600 sm:text-lg">
            달력에서 하루 식단을 빠르게 관리하고, 영양정보를 한눈에. AI 추천으로 메뉴 고민도
            줄여보세요.
          </p>
          <div class="flex flex-wrap gap-3">
            <router-link
              to="/login"
              class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-black/5 focus:outline-none"
            >
              로그인
            </router-link>
            <router-link
              to="/signup"
              class="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 focus:ring-2 focus:ring-black/20 focus:outline-none"
            >
              회원가입
            </router-link>
          </div>
        </div>
      </div>

      <section class="mt-20 grid gap-6 sm:grid-cols-3">
        <div
          class="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md supports-[backdrop-filter]:backdrop-blur-md"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"
          />
          <h3 class="mb-2 text-base font-semibold tracking-tight text-gray-900">간편한 기록</h3>
          <p class="text-sm leading-6 text-gray-600">달력에서 하루 식단을 한 번에 관리하세요.</p>
          <div class="mt-4 h-1 w-8 rounded-full bg-black/10 transition group-hover:bg-black/20" />
        </div>
        <div
          class="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md supports-[backdrop-filter]:backdrop-blur-md"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"
          />
          <h3 class="mb-2 text-base font-semibold tracking-tight text-gray-900">영양 정보</h3>
          <p class="text-sm leading-6 text-gray-600">칼로리와 영양소를 함께 입력하고 확인해요.</p>
          <div class="mt-4 h-1 w-8 rounded-full bg-black/10 transition group-hover:bg-black/20" />
        </div>
        <div
          class="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md supports-[backdrop-filter]:backdrop-blur-md"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"
          />
          <h3 class="mb-2 text-base font-semibold tracking-tight text-gray-900">AI 추천</h3>
          <p class="text-sm leading-6 text-gray-600">메뉴 고민을 줄여주는 AI 식단 추천.</p>
          <div class="mt-4 h-1 w-8 rounded-full bg-black/10 transition group-hover:bg-black/20" />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
// 단순 랜딩 페이지 - 라우터 링크만 포함
</script>

<style scoped>
/* 추가적인 간단한 스타일 */
</style>
