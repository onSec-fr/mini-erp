import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', client: '', description: '' })
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const list = await api.listProjects()
      setProjects(list || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    try {
      if (editing) {
        const updated = await api.updateProject(editing.id, form)
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
        setEditing(null)
      } else {
        const created = await api.createProject(form)
        setProjects(prev => [created, ...prev])
      }
      setForm({ name: '', client: '', description: '' })
    } catch (err) { setError(err.message) }
  }

  function startEdit(p) {
    setEditing(p)
    setForm({ name: p.name || '', client: p.client || '', description: p.description || '' })
  }

  async function remove(id) {
    try {
      await api.deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) { setError(err.message) }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="error">Erreur : {error}</p>

  return (
    <section>
      <h2>Projets</h2>

      <form onSubmit={submit} className="form-inline">
        <input placeholder="Nom du projet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
        <input placeholder="Courte description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editing ? 'Enregistrer' : 'Créer'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', client: '', description: '' })}}>Annuler</button>}
      </form>

      {projects.length === 0 ? (
        <p className="muted">Aucun projet enregistré.</p>
      ) : (
        <ul className="card-list">
          {projects.map(p => (
            <li key={p.id} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <strong>{p.name}</strong>
                <div>
                  <button className="btn-action edit" onClick={() => startEdit(p)}>Éditer</button>
                  <button className="btn-action delete" onClick={() => remove(p.id)}>Supprimer</button>
                </div>
              </div>
              <div className="muted">Client: {p.client || '-'}</div>
              {p.description && <p>{p.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
