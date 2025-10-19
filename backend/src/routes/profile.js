import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticate } from '../middleware/auth.js'
import { User } from '../models/user.js'

const router = express.Router()

// GET /api/profile
// Returns the current user's name and role
router.get('/', authenticate, async (req, res) => {
  const user = req.userRecord
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({
    id: user.id,
    username: user.username,
    name: user.displayName || user.username,
    role: user.role,
    photoUrl: user.photoUrl || null
  })
})

// PUT /api/profile/:id
// Update target user's profile (self or admin): name and optional photo (data URL)
router.put('/:id', authenticate, async (req, res) => {
  const current = req.userRecord
  if (!current) return res.status(404).json({ error: 'Not found' })

  const targetId = Number(req.params.id)
  if (!Number.isInteger(targetId)) return res.status(400).json({ error: 'Invalid id' })

  const { name, photoData } = req.body || {}
  try {
    // Load target user by URL param
    const target = await User.findByPk(targetId)
    if (!target) return res.status(404).json({ error: 'Not found' })

    if (typeof name === 'string') {
      target.displayName = name
    }

    if (typeof photoData === 'string' && photoData.startsWith('data:image/')) {
      // Parse data URL
      const match = photoData.match(/^data:(image\/(png|jpeg|jpg|gif));base64,(.+)$/i)
      if (!match) return res.status(400).json({ error: 'Invalid image data' })
      const mime = match[1]
      const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1]
      const base64 = match[3]
      const buffer = Buffer.from(base64, 'base64')

      // Enforce server-side size limit (e.g., 2 MB)
      const MAX_IMAGE_BYTES = Number(process.env.MAX_AVATAR_BYTES || 2 * 1024 * 1024)
      if (buffer.length > MAX_IMAGE_BYTES) {
        return res.status(413).json({ error: 'Image trop volumineuse (max 2 Mo)' })
      }

      // Resolve upload path
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const uploadDir = path.resolve(__dirname, '../../uploads/avatars')
      fs.mkdirSync(uploadDir, { recursive: true })
      const filename = `user-${target.id}.${ext}`
      const filePath = path.join(uploadDir, filename)
      fs.writeFileSync(filePath, buffer)

      // Public URL path
      target.photoUrl = `/uploads/avatars/${filename}`
    }

    await target.save()

    return res.json({
      id: target.id,
      username: target.username,
      name: target.displayName || target.username,
      role: target.role,
      photoUrl: target.photoUrl || null
    })
  } catch (e) {
    console.error('Update profile error:', e)
    return res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
