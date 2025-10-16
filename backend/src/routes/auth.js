import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' })
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
})

router.get('/me', authenticate, async (req, res) => {
  const user = req.userRecord
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ id: user.id, username: user.username, role: user.role })
})

export default router

