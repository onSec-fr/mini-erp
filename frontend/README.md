# Mini ERP - Frontend

Petit frontend React (Vite) pour le projet `mini-erp`.

Prerequis:
- Node.js 16+ / npm

Test en local:

```powershell
cd frontend
npm install
npm run dev
```

Le frontend interroge l'API backend sur `http://localhost:3000` par défaut. Pour changer l'adresse, créez un fichier `.env` dans `frontend/` contenant par exemple:

```
VITE_API_BASE=http://localhost:3000
```
