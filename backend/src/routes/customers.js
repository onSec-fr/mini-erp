import express from "express";
import { Customer } from "../models/customer.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// create customer
router.post("/", authenticate, async (req, res) => {
  console.log('[POST] /api/customers', req.body)
  try {
    const c = await Customer.create(req.body);
    console.log('Customer created:', c.id)
    res.status(201).json(c);
  } catch (err) {
    console.error("Create customer error:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// list all customers
router.get("/", async (_req, res) => {
  console.log('[GET] /api/customers')
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    console.error('Fetch customers error:', err)
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// get customer by id
router.get("/:id", async (req, res) => {
  console.log(`[GET] /api/customers/${req.params.id}`)
  try {
    const c = await Customer.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json(c);
  } catch (err) {
    console.error('Fetch customer error:', err)
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// update customer
router.put("/:id", authenticate, async (req, res) => {
  console.log(`[PUT] /api/customers/${req.params.id}`, req.body)
  try {
    const c = await Customer.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    await c.update(req.body);
    console.log('Customer updated:', c.id)
    res.json(c);
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: "Update failed" });
  }
});

// delete customer
router.delete("/:id", authenticate, async (req, res) => {
  console.log(`[DELETE] /api/customers/${req.params.id}`)
  try {
    const c = await Customer.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    await c.destroy();
    console.log('Customer deleted:', req.params.id)
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('Delete customer error:', err)
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;

