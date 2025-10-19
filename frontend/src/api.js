const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

import { authFetch } from './auth'

// get/post utils
async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function post(path, body) {
  const res = await authFetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const api = {
  listEmployees: () => get('/api/employees'),
  createEmployee: (body) => post('/api/employees', body),
  updateEmployee: (id, body) => authFetch(`${BASE}/api/employees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
  deleteEmployee: (id) => authFetch(`${BASE}/api/employees/${id}`, { method: 'DELETE' }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
  listProjects: () => get('/api/projects'),
  createProject: (body) => post('/api/projects', body),
  updateProject: (id, body) => authFetch(`${BASE}/api/projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
  deleteProject: (id) => authFetch(`${BASE}/api/projects/${id}`, { method: 'DELETE' }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
  listAssignments: () => get('/api/assignments'),
  createAssignment: (payload) => post('/api/assignments', payload),
  deleteAssignment: (id) => authFetch(`${BASE}/api/assignments/${id}`, { method: 'DELETE' }).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))),
  getProfile: () => authFetch(`${BASE}/api/profile`).then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
}
