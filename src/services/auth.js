import api, { setToken, clearToken } from '@/lib/axios'

export async function signIn(payload) {
  // payload: { email, password }
  const { data } = await api.post('/auth/signin', payload)
  if (data?.accessToken) setToken(data.accessToken)
  return data
}

export async function signUp(payload) {
  // payload: { name, email, password }
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function signOut() {
  try {
    await api.post('/auth/signout')
  } finally {
    clearToken()
  }
}

export async function getProfile() {
  const { data } = await api.get('/me')
  return data
}
