const API_URL = 'http://localhost:3000/api/dailies';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function getDailies() {
  const res = await fetch(API_URL, { headers: getHeaders() });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to fetch daily tasks');
  }
  return res.json();
}

export async function createDaily(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create daily task');
  }
  return res.json();
}

export async function setDailyCompleted(id, completed) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ completed })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update daily task');
  }
  return res.json();
}

export async function deleteDaily(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete daily task');
  }
}