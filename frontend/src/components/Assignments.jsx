import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ employeeId: '', projectId: '', hours: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([api.listAssignments(), api.listEmployees(), api.listProjects()])
      .then(([a, e, p]) => {
        setAssignments(a || [])
        setEmployees(e || [])
        setProjects(p || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function submit(e) {
    e.preventDefault()
    setError(null)
    try {
      const created = await api.createAssignment({
        employeeId: form.employeeId,
        projectId: form.projectId,
        hours: Number(form.hours || 0)
      })
  // get full list again to get related employee/project data
      const list = await api.listAssignments()
      setAssignments(list || [])
      setForm({ employeeId: '', projectId: '', hours: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p className="error">Erreur : {error}</p>

  return (
    <section>
      <h2>Affectations</h2>

      <form onSubmit={submit} className="form-inline">
        <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} required>
          <option value="">Choisir un employé</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.firstName || emp.firstname || emp.name || `#${emp.id}`}</option>
          ))}
        </select>

        <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required>
          <option value="">Choisir un projet</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name || p.title || `#${p.id}`}</option>
          ))}
        </select>

        <input type="number" min="0" placeholder="Heures" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} />

        <button type="submit">Ajouter</button>
      </form>

      {assignments.length === 0 ? (
        <p className="muted">Aucune affectation.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Collaborateur</th><th>Projet</th><th>Heures</th><th></th></tr>
          </thead>
          <tbody>
            {assignments.map(a => {
              // Sequelize can return included models as 'Employee' or 'employee', so check both
              const emp = a.Employee || a.employee || null
              const proj = a.Project || a.project || null
              const empLabel = emp ? (emp.name || emp.firstName || `#${emp.id}`) : (a.employeeId ? `#${a.employeeId}` : '-')
              const projLabel = proj ? (proj.name || `#${proj.id}`) : (a.projectId ? `#${a.projectId}` : '-')
              return (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{empLabel}</td>
                <td>{projLabel}</td>
                <td>{a.hours ?? '-'}</td>
                <td style={{textAlign:'right'}}>
                  <button className="btn-action delete" onClick={async ()=>{
                    if (!confirm('Supprimer cette affectation ?')) return
                    try {
                      await api.deleteAssignment(a.id)
                      setAssignments(prev => prev.filter(x => x.id !== a.id))
                    } catch (err) { setError(err.message) }
                  }}>Supprimer</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      )}
    </section>
  )
}
