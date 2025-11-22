import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

function Header(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function logout(){
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <header className="app-header">
      <div className="brand-small">
        <div className="logo">ER</div>
        <div className="brand">Event Reminder</div>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        {!token && <Link to="/login">Login</Link>}
        {token && <button className="logout" onClick={logout}>Logout</button>}
      </nav>
    </header>
  )
}

export default function App(){
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
