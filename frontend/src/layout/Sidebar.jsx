import React from 'react'
import { NavLink } from 'react-router-dom'
import { getUserRole } from '../auth'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/profile" className={({isActive})=>isActive? 'active':''}>Mon profil</NavLink>
        <div className="separator"></div>
        <NavLink to="/" end className={({isActive})=>isActive? 'active':''}>Tableau de bord</NavLink>
        <NavLink to="/employees" className={({isActive})=>isActive? 'active':''}>Collaborateurs</NavLink>
        <NavLink to="/projects" className={({isActive})=>isActive? 'active':''}>Projets</NavLink>
        <NavLink to="/assignments" className={({isActive})=>isActive? 'active':''}>Affectations</NavLink>
        <NavLink to="/reports" className={({isActive})=>isActive? 'active':''}>Rapports</NavLink>
        <NavLink to="/settings" className={({isActive})=>isActive? 'active':''}>Paramètres</NavLink>
        <NavLink to="/crm" className={({isActive})=>isActive? 'active':''}>Processus d'entreprise</NavLink>
        <NavLink to="/dashboard-advanced" className={({isActive})=>isActive? 'active':''}>Personnalisation</NavLink>
        <NavLink to="/permissions" className={({isActive})=>isActive? 'active':''}>Intégrations</NavLink>
        <div className="separator"></div>
        <NavLink to="/admin" className={({isActive})=>isActive? 'active':''}>Administration</NavLink>
      </nav>
    </aside>
  )
}
