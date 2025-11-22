# 📅 Event Reminder Application

A modern, fully-featured event reminder app with push notifications, beautiful UI, and seamless frontend-backend integration.

## 🎯 Quick Start

**Want to start immediately?** → See [QUICKSTART.md](./QUICKSTART.md)

**Need detailed setup?** → See [SETUP.md](./SETUP.md)

## ✨ Features

- 🔐 **Secure Authentication** - Signup and login with JWT
- 📝 **Event Management** - Create, edit, delete, and track events
- 🔔 **Push Notifications** - Real-time browser notifications
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📸 **Dummy Images** - Automatic fallback images for events
- ✓ **Status Tracking** - Mark events as Upcoming or Completed
- 📊 **Filtering** - View all, active, or completed events
- ⚡ **Fast & Reliable** - Built with React, Express, and MongoDB

## 🚀 Get Started in 5 Minutes

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and start creating events!

## 🏗️ Architecture

```
Event Reminder App
├── Frontend (React + Vite)
│   ├── Authentication pages (Login/Signup)
│   ├── Dashboard (Event management)
│   ├── Service Worker (Push notifications)
│   └── Responsive UI (Mobile + Desktop)
│
└── Backend (Node.js + Express)
    ├── User authentication (JWT)
    ├── Event API (CRUD operations)
    ├── Push notification service
    └── MongoDB database
```

## 📋 What's Pre-Configured

✅ MongoDB Atlas connection with credentials  
✅ VAPID keys for Web Push  
✅ Environment variables configured  
✅ API endpoints fully integrated  
✅ 6 beautiful dummy images  
✅ Service Worker for notifications  
✅ Complete error handling and validation  

## 🛠️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Web Push API
- node-cron for scheduling

### Frontend
- React 18
- Vite (lightning-fast build tool)
- React Router v6
- Modern CSS3 with animations
- Service Workers

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Fast setup guide
- **[SETUP.md](./SETUP.md)** - Detailed documentation
- **[API Endpoints](./SETUP.md#api-endpoints)** - Backend endpoints
- **[Troubleshooting](./SETUP.md#troubleshooting)** - Common issues

## 🎨 User Experience

### Dashboard Features
- **Create Events** - Add title, date, and optional custom image
- **Edit Events** - Modify any event details
- **Delete Events** - Remove events with confirmation
- **Track Status** - Mark events as completed with one click
- **Filter View** - Quick filter by event status
- **Real-time Updates** - See changes immediately

### Authentication
- **Email Validation** - Ensure valid email format
- **Password Security** - Minimum 6 characters with hashing
- **Token-based Auth** - Secure API access
- **Auto-logout** - 7-day token expiration

## 🔔 Push Notifications

- Automatic subscription on login
- Background notification delivery
- Scheduled reminders (30 minutes before event)
- Click to open app
- Dismiss notifications

## 📱 Responsive Design

- **Desktop** - Full-featured layout
- **Tablet** - Optimized spacing and touch targets
- **Mobile** - Compact single-column layout
- **Accessibility** - WCAG compliant

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS enabled
- Input validation
- Error handling

## 📊 Database Schema

### User
```javascript
{
  email: String (unique),
  passwordHash: String,
  createdAt: Date
}
```

### Event
```javascript
{
  userId: ObjectId,
  title: String,
  date: Date,
  image: String,
  status: String (Upcoming/Completed),
  createdAt: Date
}
```

### Subscription
```javascript
{
  endpoint: String (unique),
  keys: Object,
  expirationTime: Date,
  createdAt: Date
}
```

## 🎯 API Usage Examples

### Register User
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}
```

### Create Event
```bash
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "date": "2025-12-22T10:00:00",
  "image": "https://example.com/image.jpg"
}
```

### Get Events
```bash
GET /events?status=Upcoming
Authorization: Bearer <token>
```

## 💡 Tips & Tricks

- Use the dummy images for quick event creation
- Enable notifications for timely reminders
- Filter by status to focus on active events
- Update events before time changes
- Check browser console for debugging info

## 🐛 Having Issues?

1. **Backend not starting?** - Check port 4000 is free
2. **Frontend can't connect?** - Verify VITE_API_URL in .env
3. **Notifications not working?** - Allow browser permissions
4. **MongoDB error?** - Check internet and cluster status

See [Troubleshooting](./SETUP.md#troubleshooting) for more help.

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)
```bash
cd backend
heroku create your-app
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd frontend
vercel
# or
netlify deploy
```

**Important:** Update `VITE_API_URL` to your backend URL in production!

## 📚 File Structure

```
event_reminder/
├── backend/
│   ├── routes/          # API endpoints
│   ├── models/          # Database schemas
│   ├── cron.js         # Notification scheduler
│   ├── index.js        # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/      # Auth, Dashboard, Home
│   │   ├── App.jsx     # Main app component
│   │   ├── styles.css  # All styling
│   │   └── service-worker.js
│   ├── index.html
│   └── package.json
│
├── QUICKSTART.md       # Fast setup
├── SETUP.md           # Detailed docs
└── README.md          # This file
```

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source for educational purposes.

## 🎉 Ready to Go?

```bash
# Start the app now
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

Open http://localhost:5173 and create your first event! 🎊

---

**Questions?** Check [SETUP.md](./SETUP.md) for comprehensive documentation.

Structure
- `/backend` - Express API, MongoDB models, JWT auth, web-push and cron
- `/frontend` - React app (Vite), service worker, UI pages

Quick setup (local)
1. Backend
   - Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET`, `VAPID_PUBLIC`, `VAPID_PRIVATE`.
   - Install & run:

```bash
cd backend
npm install
npm run dev
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Notes
- For push notifications generate VAPID keys (https://github.com/web-push-libs/web-push).
- The backend cron job checks events and sends push notifications 30 minutes before the event.

Deployment
- Backend: deploy on Railway/Render (set env vars)
- Frontend: deploy on Vercel/Netlify (set backend API URL environment variable)

See `/backend/README.md` and `/frontend/README.md` for more details.
