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
import { Customer } from "./models/customer.js";
import bcrypt from 'bcrypt'
import usersRoutes from './routes/users.js'
import { authenticate, requireRole } from './middleware/auth.js'
import customersRoutes from './routes/customers.js'
import profileRoutes from './routes/profile.js'

app.use("/api/employees", employeeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/users', authenticate, usersRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/profile', profileRoutes)

// health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// explicit export
export async function initServer() {
  console.log("▶️ Initializing server...");

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database ready.");

    const count = await User.count();
    // check if user table is empty
    if (count === 0) {
      console.log("🚀 First initialization: creating default users and customers...");

      // ---- ADMIN ----
      const envPw = process.env.INIT_ADMIN_PASSWORD;
      const adminPw = envPw && envPw.length > 0 ? envPw : Math.random().toString(36).slice(2, 10);
      const adminHash = await bcrypt.hash(adminPw, 10);
      await User.create({
        username: "admin",
        passwordHash: adminHash,
        role: "admin",
      });
      if (envPw) {
        console.log("✅ Admin user created: username=admin (password from env)");
      } else {
        console.log("✅ Admin user created: username=admin password=", adminPw);
      }

      // ---- TEST USERS ----
      const testPw = "0nlyForT3esting!";
      const testHash = await bcrypt.hash(testPw, 10);
      const testUsers = [
        { username: "testuser1", role: "user", passwordHash: testHash },
        { username: "testuser2", role: "user", passwordHash: testHash },
        { username: "testuser3", role: "user", passwordHash: testHash },
      ];
      await User.bulkCreate(testUsers);
      console.log("✅ Test users created:");
      console.log(testUsers.map(u => ` - ${u.username} / ${testPw}`).join("\n"));

      // ---- TEST CUSTOMERS ----
      const customers = [
        { name: "Société AlphaTech", address: "12 rue du Parc, 75003 Paris", email: "contact@alphatech.fr", phone: "+33 1 42 56 12 78" },
        { name: "Boulangerie Dupont", address: "45 avenue des Lilas, 69007 Lyon", email: "dupont.boulangerie@gmail.com", phone: "+33 4 72 65 98 10" },
        { name: "Agence Comet", address: "22 rue de la République, 13001 Marseille", email: "hello@comet-agency.fr", phone: "+33 4 91 45 23 67" },
        { name: "GreenGarden", address: "8 chemin des Fleurs, 31000 Toulouse", email: "info@greengarden.fr", phone: "+33 5 61 42 11 89" },
        { name: "Café du Marché", address: "5 place du Marché, 44000 Nantes", email: "cafedumarche@outlook.fr", phone: "+33 2 40 35 21 47" },
        { name: "Studio Lumière", address: "11 rue du Soleil, 06000 Nice", email: "contact@studiolumiere.com", phone: "+33 4 93 22 88 14" },
        { name: "Garage Martin", address: "28 route de Bordeaux, 33000 Bordeaux", email: "garage.martin@orange.fr", phone: "+33 5 56 78 90 22" },
        { name: "Pharmacie Centrale", address: "14 rue Nationale, 59000 Lille", email: "pharmacie.centrale@gmail.com", phone: "+33 3 20 15 60 34" },
        { name: "Imprimerie du Nord", address: "19 boulevard Victor Hugo, 59800 Lille", email: "contact@imprimeriedunord.fr", phone: "+33 3 28 70 43 12" },
        { name: "Hôtel BelleVue", address: "7 quai Saint-Pierre, 21000 Dijon", email: "reservation@hotelbellevue.fr", phone: "+33 3 80 55 11 05" },
        { name: "Optique Vision+", address: "3 rue des Peupliers, 35000 Rennes", email: "contact@visionplus.fr", phone: "+33 2 99 65 43 21" },
        { name: "Pâtisserie Lemoine", address: "27 rue du Commerce, 45000 Orléans", email: "patisserie.lemoine@wanadoo.fr", phone: "+33 2 38 54 12 19" },
        { name: "Atelier Bois&Co", address: "17 chemin des Artisans, 73000 Chambéry", email: "contact@boisetco.fr", phone: "+33 4 79 60 87 45" },
        { name: "Cabinet Médical Saint-Roch", address: "33 avenue du Général Leclerc, 34000 Montpellier", email: "secretariat@cabinet-saintroch.fr", phone: "+33 4 67 92 03 58" },
        { name: "AutoServices 44", address: "24 rue de Bretagne, 44100 Nantes", email: "autoservices44@free.fr", phone: "+33 2 40 74 91 67" },
        { name: "École Les Petits Chênes", address: "5 allée des Écoliers, 72000 Le Mans", email: "contact@petitschenes.fr", phone: "+33 2 43 76 32 15" },
        { name: "Fleuriste Magnolia", address: "9 rue des Roses, 25000 Besançon", email: "magnolia.fleurs@gmail.com", phone: "+33 3 81 82 42 19" },
        { name: "Coiffure Élégance", address: "10 place de la Liberté, 10000 Troyes", email: "elegance.coiffure@gmail.com", phone: "+33 3 25 73 65 22" },
        { name: "Librairie du Centre", address: "6 boulevard Carnot, 80000 Amiens", email: "librairiecentre@wanadoo.fr", phone: "+33 3 22 97 44 20" },
        { name: "Restaurant Le Gourmet", address: "2 rue des Gourmets, 54000 Nancy", email: "contact@legourmet.fr", phone: "+33 3 83 36 77 29" }
      ];

      await Customer.bulkCreate(customers);
      console.log(`✅ ${customers.length} customers created.`);
    }

  } catch (err) {
    console.error("❌ DB error:", err);
  }

  return app;
}
