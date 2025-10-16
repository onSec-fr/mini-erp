import React, { useEffect, useState } from 'react'

export default function Admin(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ username:'', password:'', role:'user' })
  const [error, setError] = useState(null)

  async function load(){
    setLoading(true)
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setUsers(data)
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  async function create(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/users', {
        method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`}, body:JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Create failed')
      await load()
      setForm({ username:'', password:'', role:'user' })
    }catch(err){ setError(err.message) }
  }

  async function remove(id){
    if (!confirm('Supprimer cet utilisateur ?')) return
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + `/api/users/${id}`, { method:'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    await load()
  }

  async function exportCsv(){
    const url = (import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/users/export/csv'
    // fetch with Authorization, then download as blob
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      if (!res.ok) throw new Error('Export failed: ' + res.status)
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'users.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="error">Erreur: {error}</p>

  return (
    <div>
      <h2>Administration - Utilisateurs</h2>
      <form onSubmit={create} className="form-inline">
        <input placeholder="Nom d'utilisateur" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
        <input placeholder="Mot de passe" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Créer</button>
      </form>

      <button onClick={exportCsv} style={{marginTop:8}}>Exporter CSV</button>

      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>ID</th><th>Nom</th><th>Rôle</th><th></th></tr></thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.role}</td><td style={{textAlign:'right'}}><button onClick={()=>remove(u.id)}>Supprimer</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
