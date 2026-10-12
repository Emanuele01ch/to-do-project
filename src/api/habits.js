const API_URL = 'http://localhost:3000/api/habits';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function getHabits() {
  const res = await fetch(API_URL, { headers: getHeaders() });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to fetch habits');
  }
  return res.json();
}

export async function createHabit(title, type, frequency) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title, type, frequency })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create habit');
  }
  return res.json();
}

export async function pressHabit(id) {
  const res = await fetch(`${API_URL}/${id}/press`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update habit');
  }
  return res.json();
}

export async function deleteHabit(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete habit');
  }
}