import express from 'express'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// GET /api/profile
// Returns the current user's name and role
router.get('/', authenticate, async (req, res) => {
  const user = req.userRecord
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ name: user.username, role: user.role })
})

export default router

