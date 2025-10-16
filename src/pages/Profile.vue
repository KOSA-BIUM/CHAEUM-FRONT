<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/lib/http'   // Authorization: Bearer 자동 첨부(인터셉터)
import MainLayout from "@/layouts/MainLayout.vue";

const router = useRouter()
const loading = ref(true)
const errorMsg = ref('')
const health = ref(null) // 서버 응답 저장

async function loadSecureHealth() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await http.get('/api/health/secure') // Bearer 자동
    health.value = data
  } catch (e) {
    // 401은 http.js 인터셉터가 refresh 시도 → 실패 시 /login으로 보내는 로직이 있다면 그대로 사용
    const status = e?.response?.status
    if (status === 401) {
      // 인터셉터가 처리하지 않는 경우 대비
      return router.replace('/login')
    }
    errorMsg.value = e?.response?.data?.message || e?.message || '요청에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(loadSecureHealth)
</script>

<template>
  <MainLayout>
  <main style="max-width:960px;margin:40px auto;padding:0 16px">
    <h1 style="margin-bottom:16px">프로필</h1>

    <section style="margin-bottom:20px">
      <button @click="loadSecureHealth" :disabled="loading">
        {{ loading ? '불러오는 중…' : '새로고침' }}
      </button>
    </section>

    <section v-if="errorMsg" style="color:#c00;margin-bottom:16px">
      {{ errorMsg }}
    </section>

    <section v-if="loading">
      <p>보호 리소스에서 데이터를 불러오는 중…</p>
    </section>

    <section v-else-if="health">
      <h2 style="margin:12px 0">보호 리소스 상태</h2>
      <ul style="line-height:1.8">
        <li><strong>status:</strong> {{ health.status }}</li>
        <li><strong>user:</strong> {{ health.user }}</li>
        <li><strong>authorities:</strong> {{ (health.authorities || []).join(', ') }}</li>
        <li><strong>tokenIssuedAt(UTC):</strong> {{ health.tokenIssuedAt }}</li>
        <li><strong>tokenExpiresAt(UTC):</strong> {{ health.tokenExpiresAt }}</li>
      </ul>

      <details style="margin-top:12px">
        <summary>원본 응답(JSON)</summary>
        <pre style="background:#f6f8fa;border:1px solid #eee;padding:12px;overflow:auto;">
{{ JSON.stringify(health, null, 2) }}
        </pre>
      </details>
    </section>

    <section v-else>
      <p>표시할 데이터가 없습니다.</p>
    </section>
  </main>
  </MainLayout>
</template>
