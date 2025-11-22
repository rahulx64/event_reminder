# Frontend (Vite + React)

Environment
- `VITE_API_URL` - backend API base URL (e.g. http://localhost:4000)
- `VITE_VAPID_PUBLIC` - VAPID public key for push subscriptions (optional)

Run locally:
```bash
cd frontend
npm install
npm run dev
```

Notes
- After login, the app will attempt to register a service worker and subscribe to push.
- For push to work, set `VITE_VAPID_PUBLIC` (base64 url-safe public key) and backend VAPID keys.
