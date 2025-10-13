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

      <button
        type="submit"
        class="w-full rounded-xl bg-[#7ED957] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#71c44f]"
      >
        회원가입
      </button>
      <p class="text-center text-sm text-[#6b7280]">
        이미 계정이 있으신가요?
        <RouterLink to="/signin" class="text-[#2B68FF] hover:underline">로그인</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { signUp } from "@/services/auth";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirm = ref("");
const errors = reactive({ name: "", email: "", password: "", confirm: "" });

function validate() {
  errors.name = name.value ? "" : "이름을 입력해주세요.";
  errors.email = email.value ? "" : "이메일을 입력해주세요.";
  errors.password = password.value ? "" : "비밀번호를 입력해주세요.";
  errors.confirm = confirm.value === password.value ? "" : "비밀번호가 일치하지 않습니다.";
  return !errors.name && !errors.email && !errors.password && !errors.confirm;
}

async function onSubmit() {
  if (!validate()) return;
  try {
    await signUp({ name: name.value, email: email.value, password: password.value });
    router.push("/signin");
  } catch (e) {
    errors.email = e?.message || "회원가입에 실패했습니다.";
  }
}
</script>
