<script setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { http } from '@/lib/http'
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirm = ref("");
const loading = ref(false)

const errors = reactive({ name: "", email: "", password: "", confirm: "" });
const errorMsg = ref('')
const successMsg = ref('')

function validate() {
  errors.name = name.value ? "" : "이름을 입력해주세요.";
  errors.email = email.value ? "" : "이메일을 입력해주세요.";
  errors.password = password.value ? "" : "비밀번호를 입력해주세요.";
  errors.confirm = confirm.value === password.value ? "" : "비밀번호가 일치하지 않습니다.";
  return !errors.name && !errors.email && !errors.password && !errors.confirm;
}

async function onSubmit() {
  if (!validate()) return;
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true
  try {
    // 1) 회원가입
    const payload = {
      email: email.value,
      password: password.value,
      name: name.value || undefined,
    }
    await http.post('/api/auth/signup', payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    successMsg.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
    setTimeout(() => router.replace('/login'), 800)

  } catch (err) {
    errorMsg.value = err?.response?.data?.message || err?.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <h1 class="mb-1 text-xl font-bold">회원가입</h1>
    <p class="mb-6 text-sm text-[#7D7D7D]">필수 정보를 입력하고 계정을 만들어보세요.</p>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label for="name" class="mb-1 block text-sm font-medium">이름</label>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          placeholder="홍길동"
          class="w-full rounded-xl border border-[#E6E8EE] bg-white px-4 py-2 text-sm outline-none placeholder:text-[#B2B6C3] focus:ring-2 focus:ring-[#7ED957]"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>
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
          placeholder="********"
          class="w-full rounded-xl border border-[#E6E8EE] bg-white px-4 py-2 text-sm outline-none placeholder:text-[#B2B6C3] focus:ring-2 focus:ring-[#7ED957]"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>
      <div>
        <label for="confirm" class="mb-1 block text-sm font-medium">비밀번호 확인</label>
        <input
          id="confirm"
          v-model.trim="confirm"
          type="password"
          placeholder="********"
          class="w-full rounded-xl border border-[#E6E8EE] bg-white px-4 py-2 text-sm outline-none placeholder:text-[#B2B6C3] focus:ring-2 focus:ring-[#7ED957]"
        />
        <p v-if="errors.confirm" class="mt-1 text-xs text-red-500">{{ errors.confirm }}</p>
      </div>

      <div v-if="errorMsg" style="color:#c00;margin-bottom:8px">{{ errorMsg }}</div>
      <div v-if="successMsg" style="color:#0a0;margin-bottom:8px">{{ successMsg }}</div>

      <button
        type="submit"
        class="w-full rounded-xl bg-[#7ED957] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#71c44f]"
      >
        회원가입
      </button>
      <p class="text-center text-sm text-[#6b7280]">
        이미 계정이 있으신가요?
        <RouterLink to="/login" class="text-[#2B68FF] hover:underline">로그인</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>

