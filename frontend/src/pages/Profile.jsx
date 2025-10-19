import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Profile(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({ id: null, name: '', role: '', photoUrl: null })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const p = await api.getProfile()
        if (!cancelled) setProfile({ id: p.id, name: p.name || '', role: p.role || '', photoUrl: p.photoUrl || null })
      }catch(e){ if (!cancelled) setError(e.message) }
      finally{ if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function onFileChange(e){
    const f = e.target.files && e.target.files[0]
    setFile(f || null)
    if (f){
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  async function onSubmit(e){
    e.preventDefault()
    setSaving(true)
    setError(null)
    try{
      let photoData
      if (file && preview) {
        photoData = preview // already a data URL
      }
      const updated = await api.updateProfile(profile.id, { name: profile.name, photoData })
      setProfile({ id: updated.id, name: updated.name || '', role: updated.role || '', photoUrl: updated.photoUrl || null })
      setFile(null)
      setPreview(null)
    }catch(err){ setError(err.message) }
    finally{ setSaving(false) }
  }

  if (loading) return <p>Chargement du profil…</p>
  if (error) return <p className="error">Erreur: {error}</p>

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
  let imgSrc = preview || profile.photoUrl || null
  if (imgSrc && typeof imgSrc === 'string' && !imgSrc.startsWith('data:') && !imgSrc.startsWith('http')) {
    imgSrc = API_BASE + imgSrc
  }

  return (
    <section>
      <h2>Mon profil</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="form-row">
          <label>Nom d'affichage</label>
          <input value={profile.name} onChange={e=>setProfile({...profile, name: e.target.value})} placeholder="Votre nom" />
        </div>
        <div className="form-row">
          <label>Photo</label>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:72, height:72, borderRadius:'50%', overflow:'hidden', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {imgSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc} crossorigin="anonymous" alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}} />
              ) : (
                <span className="muted small">Aucune</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={onFileChange} />
          </div>
        </div>
        <div className="form-row">
          <button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </section>
  )
}
