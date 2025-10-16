# Mini-ERP Backend

Backend API pour le projet Mini-ERP (Node.js, Express, Sequelize).

Prerequis:
- Node.js 16+ / npm

Installation et lancement:

```powershell
cd frontend
npm install
npm run dev
```
Démarrer une bdd postgres locale : 
```powershell
docker run -d --name pg -e POSTGRES_USER=erp_user -e POSTGRES_PASSWORD=erp_pass -e POSTGRES_DB=erp_db -p 5432:5432 postgres
```