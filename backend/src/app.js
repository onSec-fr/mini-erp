import express from "express";
import helmet from "helmet";
import cors from "cors";
import { sequelize } from "./config/database.js";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

import employeeRoutes from "./routes/employees.js";
import projectRoutes from "./routes/projects.js";
import assignmentRoutes from "./routes/assignments.js";
import authRoutes from "./routes/auth.js";
import { User } from "./models/user.js";
import bcrypt from 'bcrypt'
import usersRoutes from './routes/users.js'
import { authenticate, requireRole } from './middleware/auth.js'

app.use("/api/employees", employeeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/users', authenticate, requireRole('admin'), usersRoutes)

// health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// explicit export
export async function initServer() {
  console.log("▶️ Initializing server...");
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database ready.");
  // make sure admin user exists
    const count = await User.count();
    if (count === 0) {
      const envPw = process.env.INIT_ADMIN_PASSWORD
      const pw = envPw && envPw.length > 0 ? envPw : Math.random().toString(36).slice(2, 10)
      const hash = await bcrypt.hash(pw, 10)
      const admin = await User.create({ username: 'admin', passwordHash: hash, role: 'admin' })
      if (envPw) {
        console.log('✅ Admin user created: username=admin (password from .env)')
      } else {
        console.log('✅ Admin user created: username=admin password=', pw)
      }
    }
  } catch (err) {
    console.error("❌ DB error:", err);
  }
  return app;
}
