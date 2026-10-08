const API_URL = 'http://localhost:3000/api/todos';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Shared by every call: send the request, check the result, return the data
async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // the error body wasn't JSON: keep the default message
    }
    throw new Error(message);
  }

  // 204 No Content (delete) has no body to read
  if (response.status === 204) return null;

  return response.json();
}

export function getTodos() {
  return request();
}

export function createTodo(title) {
  return request('', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ title }),
  });
}

export function setTodoCompleted(id, completed) {
  return request(`/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ completed }),
  });
}

export function deleteTodo(id) {
  return request(`/${id}`, { method: 'DELETE' });
}