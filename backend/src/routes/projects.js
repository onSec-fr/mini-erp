import express from "express";
import { Project } from "../models/project.js";
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  console.log('[POST] /api/projects', req.body)
  try {
    const proj = await Project.create(req.body);
    console.log('Project created:', proj.id)
    res.status(201).json(proj);
  } catch (err) {
    console.error('Create project error:', err)
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.get("/", async (req, res) => {
  console.log('[GET] /api/projects')
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err)
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/:id", async (req, res) => {
  console.log(`[GET] /api/projects/${req.params.id}`)
  try {
    const proj = await Project.findByPk(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    res.json(proj);
  } catch (err) {
    console.error('Fetch project error:', err)
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  console.log(`[PUT] /api/projects/${req.params.id}`, req.body)
  try {
    const proj = await Project.findByPk(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    await proj.update(req.body);
    console.log('Project updated:', proj.id)
    res.json(proj);
  } catch (err) {
    console.error('Update project error:', err)
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  console.log(`[DELETE] /api/projects/${req.params.id}`)
  try {
    const proj = await Project.findByPk(req.params.id);
    if (!proj) return res.status(404).json({ error: "Not found" });
    await proj.destroy();
    console.log('Project deleted:', req.params.id)
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('Delete project error:', err)
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// export
export default router;
