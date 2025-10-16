import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

export async function authenticate(req, res, next){
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = payload
    // attach user record
    req.userRecord = await User.findByPk(payload.sub)
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole(role){
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
