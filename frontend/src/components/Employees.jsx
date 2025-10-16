import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', position: '', email: '' })
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const list = await api.listEmployees()
      setEmployees(list || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    try {
      if (editing) {
        const updated = await api.updateEmployee(editing.id, form)
        setEmployees(prev => prev.map(p => p.id === updated.id ? updated : p))
        setEditing(null)
      } else {
        const created = await api.createEmployee(form)
        setEmployees(prev => [created, ...prev])
      }
      setForm({ name: '', position: '', email: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(emp) {
    setEditing(emp)
    setForm({ name: emp.name || '', position: emp.position || '', email: emp.email || '' })
  }

  async function remove(id) {
    if (!confirm('Supprimer cet employé ?')) return
    try {
      await api.deleteEmployee(id)
      setEmployees(prev => prev.filter(p => p.id !== id))
    } catch (err) { setError(err.message) }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="error">Erreur : {error}</p>

  return (
    <section>
      <h2>Collaborateurs</h2>

      <form onSubmit={submit} className="form-inline">
        <input placeholder="Nom complet" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Poste" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <button type="submit">{editing ? 'Enregistrer' : 'Ajouter'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', position: '', email: '' })}}>Annuler</button>}
      </form>

      {employees.length === 0 ? (
        <p className="muted">Aucun collaborateur enregistré.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Nom</th><th>Poste</th><th>Email</th><th></th></tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.position || '-'}</td>
                <td>{e.email || '-'}</td>
                <td style={{textAlign:'right'}}>
                  <button className="btn-action edit" onClick={() => startEdit(e)}>Éditer</button>
                  <button className="btn-action delete" onClick={() => remove(e.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
