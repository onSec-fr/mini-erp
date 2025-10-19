import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'

export default function AdminRoute({ children }){
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function check(){
      try{
        const profile = await api.getProfile()
        if (!cancelled) {
          setAllowed(profile?.role === 'admin')
        }
      }catch(e){
        if (!cancelled) setError(e)
      }finally{
        if (!cancelled) setLoading(false)
      }
    }
    check()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div>Vérification des droits…</div>
  if (error || !allowed) return <Navigate to="/" replace />
  return children
}

