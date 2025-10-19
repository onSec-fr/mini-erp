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
      console.log("🚀 First initialization: creating default users...");

      // ----- ADMIN -----
      const envPw = process.env.INIT_ADMIN_PASSWORD;
      const adminPw = envPw && envPw.length > 0 ? envPw : Math.random().toString(36).slice(2, 10);
      const adminHash = await bcrypt.hash(adminPw, 10);

      await User.create({
        username: "admin",
        passwordHash: adminHash,
        role: "admin",
      });

      if (envPw) {
        console.log("✅ Admin user created: username=admin (password from .env)");
      } else {
        console.log("✅ Admin user created: username=admin password=", adminPw);
      }

      // ----- TEST USERS -----
      const testPw = "0nlyForT3esting!";
      const testHash = await bcrypt.hash(testPw, 10);

      const testUsers = [
        { username: "testuser1", role: "user", passwordHash: testHash },
        { username: "testuser2", role: "user", passwordHash: testHash },
        { username: "testuser3", role: "user", passwordHash: testHash },
      ];

      await User.bulkCreate(testUsers);

      console.log("👥 Test users created:");
      console.log(
        testUsers.map((u) => ` - ${u.username} / ${testPw}`).join("\n")
      );
    }
  } catch (err) {
    console.error("❌ DB error:", err);
  }

  return app;
}