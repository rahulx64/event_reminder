import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/home'
import Dashboard from './pages/Dashboard'
import './styles.css'
import { registerSW } from './registerServiceWorker'

function RequireAuth({ children }){
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function Root(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={ localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Home/> } />
          <Route path="login" element={<Login/>} />
          <Route path="signup" element={<Signup/>} />
          <Route path="dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<Root />)

// Register service worker in background
if(typeof window !== 'undefined'){
  registerSW().catch(()=>{});
}
