import React from 'react'
import DashboardCharts from './DashboardCharts'

export default function Dashboard(){
  return (
    <div className="dashboard">
      <div className="cards">
        <div className="card">
          <h3>Collaborateurs actifs</h3>
          <div className="big">24</div>
          <div className="muted">Moins que le mois dernier: -2</div>
        </div>
        <div className="card">
          <h3>Projets en cours</h3>
          <div className="big">8</div>
          <div className="muted">2 nouveaux ce mois</div>
        </div>
        <div className="card">
          <h3>Charge totale (heures)</h3>
          <div className="big">1,240</div>
          <div className="muted">Moyenne par personne: 51h</div>
        </div>
      </div>
      <section className="panel">
        <h3>Dernières affectations</h3>
        <table className="table small">
          <thead><tr><th>Employé</th><th>Projet</th><th>Heures</th><th></th></tr></thead>
          <tbody>
            <tr><td>Anna Martin</td><td>Refonte site</td><td>32</td><td className="muted">Terminée</td></tr>
            <tr><td>Jean Dupont</td><td>API interne</td><td>18</td><td className="muted">En cours</td></tr>
            <tr><td>Lucie Bernard</td><td>Migration DB</td><td>40</td><td className="muted">Planifié</td></tr>
          </tbody>
        </table>
      </section>
      <DashboardCharts />
    </div>
  )
}
