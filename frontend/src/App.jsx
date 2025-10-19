import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Dashboard from './pages/Dashboard'
import UnderConstruction from './pages/UnderConstruction'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import Admin from './pages/Admin'
import AdminRoute from './components/AdminRoute'
import Employees from './components/Employees'
import Projects from './components/Projects'
import Assignments from './components/Assignments'
import Profile from './pages/Profile'

export default function App(){
  const location = useLocation();
  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        {/* Hide sidebar on login page */}
        {location.pathname !== '/login' && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><Employees/></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><Projects/></PrivateRoute>} />
            <Route path="/assignments" element={<PrivateRoute><Assignments/></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><UnderConstruction/></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><UnderConstruction/></PrivateRoute>} />
            <Route path="/crm" element={<PrivateRoute><UnderConstruction/></PrivateRoute>} />
            <Route path="/dashboard-advanced" element={<PrivateRoute><UnderConstruction/></PrivateRoute>} />
            <Route path="/permissions" element={<PrivateRoute><UnderConstruction/></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminRoute><Admin/></AdminRoute></PrivateRoute>} />
          </Routes>
        </main>
      </div>
      <footer>
        &copy; {new Date().getFullYear()} Minisoft. Tous droits réservés.
      </footer>
    </div>
  )
}
