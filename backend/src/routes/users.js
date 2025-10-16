import express from 'express'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// list users (no passwordHash)
router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'] })
  res.json(users)
})

// create user
router.post('/', async (req, res) => {
  try {
    const { username, password, role } = req.body
    const hash = await bcrypt.hash(password, 10)
    const u = await User.create({ username, passwordHash: hash, role: role || 'user' })
    res.status(201).json({ id: u.id, username: u.username, role: u.role })
  } catch (err) {
    console.error('Create user error:', err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// update user (role or password)
router.put('/:id', async (req, res) => {
  try {
    const u = await User.findByPk(req.params.id)
    if (!u) return res.status(404).json({ error: 'Not found' })
    const { role, password } = req.body
    if (role) u.role = role
    if (password) u.passwordHash = await bcrypt.hash(password, 10)
    await u.save()
    res.json({ id: u.id, username: u.username, role: u.role })
  } catch (err) {
    console.error('Update user error:', err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// delete user
router.delete('/:id', async (req, res) => {
  const u = await User.findByPk(req.params.id)
  if (!u) return res.status(404).json({ error: 'Not found' })
  await u.destroy()
  res.json({ message: 'Deleted' })
})

// export users as CSV (no password)
router.get('/export/csv', async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'] })
  const rows = users.map(u => `${u.id},"${u.username}","${u.role}","${u.createdAt.toISOString()}","${u.updatedAt.toISOString()}"`)
  const header = 'id,username,role,createdAt,updatedAt\n'
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="users.csv"')
  res.send(header + rows.join('\n'))
})

export default router
