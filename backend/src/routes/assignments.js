import express from "express";
import { Assignment } from "../models/assignment.js";
import { Employee } from "../models/employee.js";
import { Project } from "../models/project.js";
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { employeeId, projectId, role, hours } = req.body;
  try {
    const emp = await Employee.findByPk(employeeId);
    const proj = await Project.findByPk(projectId);
    if (!emp || !proj) return res.status(404).json({ error: "Employee or Project not found" });
     const assign = await Assignment.create({ EmployeeId: employeeId, ProjectId: projectId, role, hours });
    // return created with included relations
    const full = await Assignment.findByPk(assign.id, { include: [Employee, Project] });
  console.log('Created assignment payload:', JSON.stringify(full, null, 2));
  res.status(201).json(full);
  } catch (err) {
     console.error('Assignment create error:', err);
     res.status(500).json({ error: "Failed to assign", details: err.message });
  }
});

router.get("/", async (req, res) => {
  const assignments = await Assignment.findAll({ include: [Employee, Project] });
  res.json(assignments);
});

router.get("/:id", async (req, res) => {
  const a = await Assignment.findByPk(req.params.id, { include: [Employee, Project] });
  if (!a) return res.status(404).json({ error: 'Not found' });
  res.json(a);
});

router.delete("/:id", authenticate, async (req, res) => {
  const a = await Assignment.findByPk(req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  await a.destroy();
  res.json({ message: 'Deleted' });
});

// ✅ export par défaut
export default router;
