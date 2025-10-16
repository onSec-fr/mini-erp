import React, { useState, useEffect } from 'react'
import { getToken, clearToken } from '../auth'
import { useLocation } from 'react-router-dom'

export default function Header() {
  const [logged, setLogged] = useState(false)
  const loc = useLocation()
  useEffect(()=> setLogged(Boolean(getToken())), [])

  function logout(){ clearToken(); setLogged(false); window.location.href='/' }

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo">ME</div>
        <div>
          <h1>MiniERP</h1>
          <div className="muted small">Application de gestion d'entreprise</div>
        </div>
      </div>
      {loc.pathname !== '/login' && (
        <div className="header-actions">
          <input placeholder="Rechercher..." className="search" />
          {logged ? (
            <button className="ghost" onClick={logout}>Se déconnecter</button>
          ) : (
            <a href="/login" className="ghost">Se connecter</a>
          )}
        </div>
      )}
    </header>
  )
}
