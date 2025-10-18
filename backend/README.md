# Mini-ERP Backend

Backend API pour le projet Mini-ERP (Node.js, Express, Sequelize).

Prerequis:
- Node.js 16+ / npm

Test en local:

```powershell
cd frontend
npm install
npm run dev
```

Prérequis -avoir une bdd postgres locale :

```powershell
docker run -d --name pg -e POSTGRES_USER=erp_user -e POSTGRES_PASSWORD=erp_pass -e POSTGRES_DB=erp_db -p 5432:5432 postgres
```