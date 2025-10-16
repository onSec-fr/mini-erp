import React, { useState } from 'react'
import { setToken, getToken } from '../auth'
import { Navigate } from 'react-router-dom'

export default function Login(){
  if (getToken()) return <Navigate to='/' replace />
  const [form, setForm] = useState({ username:'', password:'' })
  const [error, setError] = useState(null)
  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Authentification échouée')
      const data = await res.json()
      setToken(data.token)
      window.location.href = '/'
    }catch(err){ setError(err.message) }
  }
  return (
    <div style={{padding:20}}>
      <h2>Se connecter</h2>
      <form onSubmit={submit} className="form-inline">
        <input placeholder="Nom d'utilisateur" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
        <input placeholder="Mot de passe" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button type="submit">Connexion</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
