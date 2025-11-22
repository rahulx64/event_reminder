# Backend (Express + MongoDB)

Env vars (copy `.env.example` -> `.env`):
- `MONGO_URI`
- `JWT_SECRET`
- `VAPID_PUBLIC` and `VAPID_PRIVATE` (for web push)

Run locally:
```bash
cd backend
npm install
npm run dev
```

API endpoints
- `POST /auth/signup` {email, password}
- `POST /auth/login` {email, password} => {token}
- `GET /events` (auth) => list
- `POST /events` (auth) => create
- `PUT /events/:id` (auth)
- `DELETE /events/:id` (auth)
- `POST /push/subscribe` (auth, subscription payload)
- `POST /push/send` (auth, manual send)

Cron
- A cron job runs every minute and sends notifications for events starting within the next 30 minutes.

Notes
- For production, use a real MongoDB (Atlas) and set env vars on the hosting platform.
