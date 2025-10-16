export function setToken(token){ localStorage.setItem('token', token) }
export function getToken(){ return localStorage.getItem('token') }
export function clearToken(){ localStorage.removeItem('token') }
export function authFetch(url, opts={}){
  const token = getToken()
  const headers = opts.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(url, { ...opts, headers })
}

// quick'n'dirty JWT payload decode for UI (dev only)
export function parseJwtPayload(){
  const t = getToken()
  if (!t) return null
  try{
    const p = t.split('.')[1]
    const decoded = atob(p.replace(/-/g,'+').replace(/_/g,'/'))
    return JSON.parse(decoded)
  }catch(e){ return null }
}

export function getUserRole(){ const p = parseJwtPayload(); return p ? p.role : null }
export function getUserId(){ const p = parseJwtPayload(); return p ? p.sub : null }
