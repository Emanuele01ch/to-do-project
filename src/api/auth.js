const BASE_URL = 'http://localhost:3000/api/auth';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || response.statusText);
  }

  return body;
}

export function register(email, password) {
  return request('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function verifyEmail(token) {
  return request('/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
}