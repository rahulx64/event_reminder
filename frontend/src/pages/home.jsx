import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

function TimeWidget(){
  const [t, setT] = useState(new Date());
  useEffect(()=>{
    const id = setInterval(()=>setT(new Date()), 1000);
    return ()=>clearInterval(id);
  },[]);
  return <div className="widget time"><strong>{t.toLocaleTimeString()}</strong><div className="muted">Local time</div></div>
}

function WeatherWidget(){
  // Placeholder — lightweight and offline-friendly.
  return <div className="widget weather"><strong>Sunny</strong><div className="muted">24°C • Clear</div></div>
}

export default function Home(){
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="title-animate green-60">Never miss an event</h1>
          <p className="muted">Create events, receive reminders, and stay on top of your schedule.</p>
          <div className="cta">
            <Link className="btn" to="/signup">Get Started</Link>
            <Link className="btn secondary" to="/login">Login</Link>
          </div>
        </div>
        <div className="preview-grid">
          <div className="card animate-hover">
            <img src="https://images.unsplash.com/photo-1517260739330-2b2d2f2b6d9f?w=800&q=60" alt="event"/>
            <div className="card-body">
              <h3>Birthday Party</h3>
              <p className="muted">May 22, 2026 — Upcoming</p>
            </div>
          </div>
          <div className="card animate-hover">
            <img src="https://images.unsplash.com/photo-1508685096481-1c050f1f1f4b?w=800&q=60" alt="event"/>
            <div className="card-body">
              <h3>Team Meeting</h3>
              <p className="muted">Dec 1, 2025 — Upcoming</p>
            </div>
          </div>
        </div>
      </section>

      <section className="widgets">
        <TimeWidget />
        <WeatherWidget />
      </section>
    </div>
  )
}
