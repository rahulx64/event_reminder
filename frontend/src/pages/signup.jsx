import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Client-side validation
    if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if(password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/signup', {
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({email,password})
      });
      const data = await res.json();
      
      if(data.token){
        setSuccess('Account created! Redirecting to dashboard...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        
        // try to register service worker + push
        try { 
          const { registerSW, subscribeForPush } = await import('../registerServiceWorker.js');
          await registerSW();
          await subscribeForPush(data.token);
        }catch(e){
          console.warn('Push registration failed:', e);
        }
        
        setTimeout(() => navigate('/dashboard'), 1000);
      }else{
        setError(data.error || 'Signup failed');
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
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join Event Reminder to manage your events</p>
      
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
          placeholder="Password (min 6 characters)" 
          type="password" 
          required
          disabled={loading}
        />
        <input 
          value={confirmPassword} 
          onChange={e=>setConfirmPassword(e.target.value)} 
          placeholder="Confirm password" 
          type="password" 
          required
          disabled={loading}
        />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
          <button type="button" className="btn secondary" onClick={()=>{setEmail('');setPassword('');setConfirmPassword('');setError('');}} disabled={loading}>Clear</button>
        </div>
      </form>
      
      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}
