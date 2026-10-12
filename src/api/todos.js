const API_URL = 'http://localhost:3000/api/todos';

// Helper to build headers with the JWT token
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // ignore non-json response body
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

export function getTodos() {
  return request('', {
    headers: getHeaders(),
  });
}

export function createTodo(title) {
  return request('', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });
}

export function setTodoCompleted(id, completed) {
  return request(`/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ completed }),
  });
}

export function deleteTodo(id) {
  return request(`/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
}