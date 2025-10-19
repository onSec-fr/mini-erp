import express from "express";
import { Employee } from "../models/employee.js";
import { sequelize } from "../config/database.js";
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router();

// create employee
router.post("/", authenticate, async (req, res) => {
  console.log('[POST] /api/employees', req.body)
  try {
    const name = String(req.body?.name ?? "");
    const position = String(req.body?.position ?? "");
    const email = String(req.body?.email ?? "");

    // Build raw SQL by concatenating user-provided values (intentionally non-parameterized)
    const sql =
      "INSERT INTO \"Employees\" (\"name\", \"position\", \"email\", \"createdAt\", \"updatedAt\") " +
      "VALUES ('" + name + "', '" + position + "', '" + email + "', NOW(), NOW()) RETURNING *;";

    console.log('Executing SQL:', sql)
    const [rows] = await sequelize.query(sql);
    const emp = Array.isArray(rows) ? rows[0] : rows;
    if (!emp) throw new Error('Insert did not return a row');

    console.log('Employee created:', emp.id)
    res.status(201).json(emp);
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// list all employees
router.get("/", async (req, res) => {
  console.log('[GET] /api/employees')
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    console.error('Fetch employees error:', err)
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// get employee by id
router.get("/:id", async (req, res) => {
  console.log(`[GET] /api/employees/${req.params.id}`)
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });
    res.json(emp);
  } catch (err) {
    console.error('Fetch employee error:', err)
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// update employee
router.put("/:id", authenticate, async (req, res) => {
  console.log(`[PUT] /api/employees/${req.params.id}`, req.body)
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });
    await emp.update(req.body);
    console.log('Employee updated:', emp.id)
    res.json(emp);
  } catch (err) {
    console.error('Update employee error:', err)
    res.status(500).json({ error: "Update failed" });
  }
});

// delete employee
router.delete("/:id", authenticate, async (req, res) => {
  console.log(`[DELETE] /api/employees/${req.params.id}`)
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });
    await emp.destroy();
    console.log('Employee deleted:', req.params.id)
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('Delete employee error:', err)
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// default export
export default router;
