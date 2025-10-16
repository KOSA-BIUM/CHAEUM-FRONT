// 랜덤 문자열(code_verifier)
export function randomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf).map(b => charset[b % charset.length]).join('');
}

// SHA-256 → base64url(code_challenge)
export async function sha256Base64Url(input) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  const bytes = new Uint8Array(digest);
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
