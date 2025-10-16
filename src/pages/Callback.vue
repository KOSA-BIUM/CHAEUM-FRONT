<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http, setAccessToken, setRefreshToken } from '@/lib/http'

const router = useRouter()

onMounted(async () => {
  const q = new URLSearchParams(location.search)
  const code = q.get('code')
  if (!code) return router.replace('/login')

  const verifier = sessionStorage.getItem('pkce_verifier')
  if (!verifier) return router.replace('/login')

  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback',
      client_id: import.meta.env.VITE_CLIENT_ID || 'vue-spa',
      code_verifier: verifier
    })
    const { data } = await http.post('/oauth2/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    })

    // ★ 여기서 메모리 저장 (필수)
    setAccessToken(data.access_token)
    if (data.refresh_token) setRefreshToken(data.refresh_token)
    sessionStorage.removeItem('pkce_verifier')

    // 보호 라우트로 이동
    router.replace('/profile')
  } catch (e) {
    console.error('token exchange failed', e)
    router.replace('/login')
  }
})
</script>
