<script setup>
import { ref } from 'vue'
import { http } from '@/lib/http' // AS_BASE에 붙는 인스턴스
import { startLogin } from '@/services/startLogin.js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function onSubmit(e) {
  e.preventDefault()
  errorMsg.value = ''
  loading.value = true
  try {
    // 1) 세션 로그인 (쿠키 수립)
    await http.post('/api/auth/session/login', { email: email.value, password: password.value }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    // 2) PKCE authorize 시작 (리다이렉트)
    await startLogin()
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main style="max-width:420px;margin:80px auto">
    <h1 style="margin-bottom:16px">로그인</h1>
    <form @submit="onSubmit">
      <div style="margin-bottom:12px">
        <label>이메일</label>
        <input v-model="email" type="email" required style="width:100%" />
      </div>
      <div style="margin-bottom:12px">
        <label>비밀번호</label>
        <input v-model="password" type="password" required style="width:100%" />
      </div>
      <div v-if="errorMsg" style="color:#c00;margin-bottom:8px">{{ errorMsg }}</div>
      <button :disabled="loading" type="submit" style="width:100%">
        {{ loading ? '로그인 중…' : '로그인' }}
      </button>
    </form>
  </main>
</template>
