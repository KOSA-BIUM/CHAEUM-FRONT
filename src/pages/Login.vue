<script setup>
import { reactive, ref } from "vue";
import { http } from "@/lib/http"; // AS_BASE에 붙는 인스턴스
import { startLogin } from "@/services/startLogin.js";
import AuthLayout from "@/layouts/AuthLayout.vue";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const errors = reactive({ email: "", password: "" });

function validate() {
  errors.email = email.value ? "" : "이메일을 입력해주세요.";
  errors.password = password.value ? "" : "비밀번호를 입력해주세요.";
  return !errors.email && !errors.password;
}

async function onSubmit(e) {
  e.preventDefault();
  errorMsg.value = "";
  loading.value = true;
  try {
    // 1) 세션 로그인 (쿠키 수립)
    await http.post(
      "/api/auth/session/login",
      { email: email.value, password: password.value },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );
    // 2) PKCE authorize 시작 (리다이렉트)
    await startLogin();
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || "로그인에 실패했습니다.";
    errors.password = e?.message || "로그인에 실패했습니다.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthLayout>
    <h1 class="mb-1 text-xl font-bold">로그인</h1>
    <p class="mb-6 text-sm text-[#7D7D7D]">계정에 접속하려면 정보를 입력하세요.</p>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium">이메일</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-xl border border-[#E6E8EE] bg-white px-4 py-2 text-sm outline-none placeholder:text-[#B2B6C3] focus:ring-2 focus:ring-[#7ED957]"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>
      <div>
        <label for="password" class="mb-1 block text-sm font-medium">비밀번호</label>
        <input
          id="password"
          v-model.trim="password"
          type="password"
          placeholder="비밀번호"
          class="w-full rounded-xl border border-[#E6E8EE] bg-white px-4 py-2 text-sm outline-none placeholder:text-[#B2B6C3] focus:ring-2 focus:ring-[#7ED957]"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>
      <div class="flex items-center justify-end">
        <RouterLink to="/signup" class="text-sm text-[#2B68FF] hover:underline"
          >회원가입</RouterLink
        >
      </div>
      <button
        type="submit"
        class="w-full rounded-xl bg-[#7ED957] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#71c44f]"
        :disabled="loading"
      >
        {{ loading ? "로그인 중…" : "로그인" }}
      </button>
    </form>
  </AuthLayout>
</template>
