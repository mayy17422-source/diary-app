// src/api.js
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getToken() {
  return localStorage.getItem('diary_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  
  console.log(`[API 侦探] 发起请求: ${options.method || 'GET'} ${url}`);
  
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });

  const data = await res.json();  
  if (!res.ok) {
    console.error(`[API 错误] ${url} 失败:`, data);
    throw new Error(data.error || '请求失败');
  }
  
  return data;
}

export const api = {
  register: (username, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getNotes: () => request('/notes'),
  getNote: (id) => request(`/notes/${id}`),
  createNote: (title = '', content = '') =>
    request('/notes', { method: 'POST', body: JSON.stringify({ title, content }) }),
  updateNote: (id, title, content) =>
    request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) }),
  deleteNote: (id) =>
    request(`/notes/${id}`, { method: 'DELETE' }),
  getTodos: () => request('/todos'),
  createTodo: (title = '', due_date = null) =>
    request('/todos', { method: 'POST', body: JSON.stringify({ title, due_date }) }),
  updateTodo: (id, data) =>
    request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTodo: (id) =>
    request(`/todos/${id}`, { method: 'DELETE' }),
};
