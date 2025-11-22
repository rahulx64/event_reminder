import React, {useEffect, useState} from 'react'

const DUMMY_IMAGES = [
  'https://images.unsplash.com/photo-1519671482677-88d4c9ee0d05?w=400&q=60',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60',
  'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&q=60',
  'https://images.unsplash.com/photo-1478749485323-41c690495cb9?w=400&q=60',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=60',
  'https://images.unsplash.com/photo-1516534775068-bb4c4dde4b13?w=400&q=60'
];

function EventCard({ev, onDelete, onEdit, onStatusChange}){
  const imageIndex = ev._id ? ev._id.charCodeAt(0) % DUMMY_IMAGES.length : 0;
  const imageUrl = ev.image || DUMMY_IMAGES[imageIndex];
  const isUpcoming = ev.status === 'Upcoming';
  
  return (
    <div className="event-card animate-hover">
      <img src={imageUrl} alt={ev.title} onError={(e) => e.target.src = DUMMY_IMAGES[0]}/>
      <div className="card-body">
        <h4>{ev.title}</h4>
        <p className="muted">{new Date(ev.date).toLocaleString()}</p>
        <div className={"status " + (isUpcoming ? 'up':'done')}>{ev.status}</div>
        <div className="card-actions">
          {isUpcoming && (
            <button className="action-btn small" onClick={() => onStatusChange(ev._id, 'Completed')} title="Mark as completed">✓</button>
          )}
          <button className="action-btn small edit" onClick={() => onEdit(ev)} title="Edit event">✎</button>
          <button className="action-btn small delete" onClick={() => onDelete(ev._id)} title="Delete event">✕</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const [events,setEvents] = useState([]);
  const [filter,setFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({title:'', date:'', image:''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const email = localStorage.getItem('email') || 'User';

  async function load(){
    const token = localStorage.getItem('token');
    const q = filter ? `?status=${filter}` : '';
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/events' + q, {
        headers: {Authorization: `Bearer ${token}`}
      });
      const data = await res.json();
      setEvents(data || []);
    } catch(err) {
      setError('Failed to load events');
      console.error(err);
    }
  }

  useEffect(()=>{ load() }, [filter]);

  async function create(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {...form};
    
    if(!payload.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if(payload.date && !payload.date.endsWith('Z')){
      payload.date = new Date(payload.date).toISOString();
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/events', {
        method:'POST', 
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, 
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if(res.ok) {
        setSuccess('Event created successfully!');
        setShowCreate(false);
        setForm({title:'',date:'',image:''});
        setTimeout(() => setSuccess(''), 2000);
        load();
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch(err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateEvent(e) {
    e.preventDefault();
    if (!editingId) return;
    
    const token = localStorage.getItem('token');
    const payload = {...form};
    
    if(!payload.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if(payload.date && !payload.date.endsWith('Z')){
      payload.date = new Date(payload.date).toISOString();
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + `/events/${editingId}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if(res.ok) {
        setSuccess('Event updated successfully!');
        setShowEdit(false);
        setEditingId(null);
        setForm({title:'',date:'',image:''});
        setTimeout(() => setSuccess(''), 2000);
        load();
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch(err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    if(!confirm('Are you sure you want to delete this event?')) return;
    
    const token = localStorage.getItem('token');
    setError('');
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + `/events/${id}`, {
        method:'DELETE',
        headers:{'Authorization':`Bearer ${token}`}
      });
      const data = await res.json();
      
      if(res.ok) {
        setSuccess('Event deleted!');
        setTimeout(() => setSuccess(''), 2000);
        load();
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch(err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  }

  async function changeStatus(id, status) {
    const token = localStorage.getItem('token');
    setError('');
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + `/events/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        body: JSON.stringify({status})
      });
      
      if(res.ok) {
        setSuccess('Event status updated!');
        setTimeout(() => setSuccess(''), 2000);
        load();
      } else {
        setError('Failed to update status');
      }
    } catch(err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  }

  function openEdit(ev) {
    setEditingId(ev._id);
    setForm({
      title: ev.title,
      date: ev.date.slice(0, 16),
      image: ev.image || ''
    });
    setShowEdit(true);
    setShowCreate(false);
  }

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Welcome, {email.split('@')[0]}!</h2>
          <p className="muted">Manage your events and stay on track</p>
        </div>
      </div>

      <div className="dash-top">
        <div className="totals">
          <div className="tile">
            <div className="tile-number">{events.length}</div>
            <div className="tile-label">Total</div>
          </div>
          <div className="tile">
            <div className="tile-number">{events.filter(e=>e.status==='Upcoming').length}</div>
            <div className="tile-label">Upcoming</div>
          </div>
          <div className="tile">
            <div className="tile-number">{events.filter(e=>e.status==='Completed').length}</div>
            <div className="tile-label">Completed</div>
          </div>
        </div>
        <div className="controls">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="">All Events</option>
            <option value="Upcoming">Active</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="btn" onClick={()=>{setShowCreate(s=>!s); setShowEdit(false);}}>+ New Event</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className={"create-form " + (showCreate && !showEdit ? 'open':'') }>
        <form onSubmit={create}>
          <h3>Create New Event</h3>
          <input 
            placeholder="Event title" 
            value={form.title} 
            onChange={e=>setForm({...form, title:e.target.value})} 
            required
            disabled={loading}
          />
          <input 
            type="datetime-local" 
            placeholder="Date and time" 
            value={form.date} 
            onChange={e=>setForm({...form, date:e.target.value})} 
            required
            disabled={loading}
          />
          <input 
            placeholder="Image URL (optional)" 
            value={form.image} 
            onChange={e=>setForm({...form, image:e.target.value})}
            disabled={loading}
          />
          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button type="button" className="btn secondary" onClick={()=>setShowCreate(false)} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>

      <div className={"create-form edit-form " + (showEdit ? 'open':'') }>
        <form onSubmit={updateEvent}>
          <h3>Edit Event</h3>
          <input 
            placeholder="Event title" 
            value={form.title} 
            onChange={e=>setForm({...form, title:e.target.value})} 
            required
            disabled={loading}
          />
          <input 
            type="datetime-local" 
            placeholder="Date and time" 
            value={form.date} 
            onChange={e=>setForm({...form, date:e.target.value})} 
            required
            disabled={loading}
          />
          <input 
            placeholder="Image URL (optional)" 
            value={form.image} 
            onChange={e=>setForm({...form, image:e.target.value})}
            disabled={loading}
          />
          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn secondary" onClick={()=>{setShowEdit(false); setEditingId(null);}} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create one to get started!</p>
          </div>
        ) : (
          events.map(ev => <EventCard 
            key={ev._id} 
            ev={ev} 
            onDelete={deleteEvent}
            onEdit={openEdit}
            onStatusChange={changeStatus}
          />)
        )}
      </div>
    </div>
  )
}
