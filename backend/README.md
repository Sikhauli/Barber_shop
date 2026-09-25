# Iron & Oak Barbershop API

Complete Express + MongoDB API matching the uploaded Iron & Oak React frontend.

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## Setup

```bash
npm install
cp .env.example .env
```

Set `MONGODB_URI` and `JWT_SECRET` in `.env`.

Run development:

```bash
npm run dev
```

API: `http://localhost:3000/api`
Health: `GET /api/health`

## Frontend
Your frontend already uses:

```env
VITE_API_URL=http://localhost:3000/api
```

Keep that value for local development.

## Endpoints

### Public
- `GET /api/health`
- `GET /api/services`
- `GET /api/barbers`
- `GET /api/hours`
- `POST /api/bookings`
- `GET /api/bookings/:reference`
- `POST /api/contact`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Authenticated
- `GET /api/bookings/me/all` — requires `Authorization: Bearer <token>`

## Create booking

```json
{
  "customerName":"John Doe",
  "customerEmail":"john@example.com",
  "customerPhone":"+27 82 123 4567",
  "serviceId":"fade",
  "barberId":"miles",
  "bookingDate":"2026-10-01",
  "startTime":"10:00",
  "notes":"Short on the sides",
  "consent":true
}
```

The API validates the service, barber, date, opening hours and overlapping bookings before saving.

## Production
Set:

```env
NODE_ENV=production
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=https://your-frontend-domain.com
```

Then:

```bash
npm start
```

This server is stateless and can be deployed to Render, Railway, Fly.io, a VPS, or another Node host. MongoDB Atlas is recommended for production persistence.
