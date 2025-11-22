import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/login', {
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({email,password})
      });
      const data = await res.json();
      
      if(data.token){
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        
        // try to register for push after login
        try { 
          const { registerSW, subscribeForPush } = await import('../registerServiceWorker.js');
          await registerSW();
          await subscribeForPush(data.token);
        }catch(e){
          console.warn('Push registration failed:', e);
        }
        
        setTimeout(() => navigate('/dashboard'), 1000);
      }else{
        setError(data.error || 'Login failed');
      }
    } catch(err) {
      setError('Network error. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2>Welcome Back</h2>
      <p className="auth-subtitle">Sign in to manage your events</p>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={submit} className="auth-form">
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email address" 
          type="email" 
          required
          disabled={loading}
        />
        <input 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="Password" 
          type="password" 
          required
          disabled={loading}
        />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button type="button" className="btn secondary" onClick={()=>{setEmail('');setPassword('');setError('');}} disabled={loading}>Clear</button>
        </div>
      </form>
      
      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  )
}
