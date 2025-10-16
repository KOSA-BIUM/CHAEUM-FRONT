import { randomString, sha256Base64Url } from '@/util/pkce';

const AS_BASE = import.meta.env.VITE_AS_BASE || 'http://localhost:8080';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'vue-spa';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback';
const SCOPES = (import.meta.env.VITE_SCOPES || 'openid profile api.read api.write').split(/\s+/);

export async function startLogin() {
  const codeVerifier = randomString(64);
  const codeChallenge = await sha256Base64Url(codeVerifier);

  sessionStorage.setItem('pkce_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  window.location.href = `${AS_BASE}/oauth2/authorize?${params.toString()}`;
}
