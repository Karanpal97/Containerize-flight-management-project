# KaranFlight – Microservices Flight Platform

A production-style flight booking system built with Node.js, Express, MySQL (via Sequelize), RabbitMQ, and OpenAPI. The system is decomposed into services for Authentication, Flight Search & Inventory, Booking & Payments, Notifications (email), and API Documentation.

## Highlights
- Service-oriented architecture with clear service boundaries
- MySQL-backed persistence using Sequelize ORM
- Message-driven notifications with RabbitMQ
- JWT-based authentication and role management
- Rate limiting and request validation
- Idempotent payments to prevent double-charging
- Unified OpenAPI 3.0 spec (`openapi.yaml`), served via a dedicated docs service
- CORS enabled across services for safe browser access

## Architecture
- Auth Service (`Auth_service`): user signup/signin, roles, lightweight API gateway proxy to booking
- Flight Search (`flight-Search`): manages airplanes, airports, cities, flights, and seats
- Booking Service (`Booking-Service`): creates bookings and executes payments (idempotent), publishes notifications
- Notification Service (`notification_service`): consumes messages from RabbitMQ and sends transactional emails
- Docs (`docs`): serves Swagger UI for the combined OpenAPI (`openapi.yaml`)

### Data Consistency and ACID
- Primary data store is MySQL, which provides ACID guarantees at the database level
- Create/update operations are executed via Sequelize, which translates to SQL statements respecting ACID on the server
- Idempotency for payments (via `x-idempotency-key`) strengthens consistency under retries
- Outbox-like approach for notifications using a queue (RabbitMQ) supports reliable, eventually consistent side effects without blocking the main transaction

## Repository Layout
```
Auth_service/
Booking-Service/
flight-Search/
notification_service/
docs/
openapi.yaml
render.yaml
Docker-compose.yml
```

## Services Overview

### Auth Service
- Base path: `/api`
- Routes:
  - `GET /api/v1/info` – health
  - `GET /api/v1/user` – list users (supports query params)
  - `POST /api/v1/user/signup` – signup `{ email, password }`
  - `POST /api/v1/user/signin` – signin `{ email, password }`
  - `POST /api/v1/user/role` – admin-only; requires `x-access-token`
- Security: JWT, rate limiting, request validation

### Flight Search Service
- Base path: `/api`
- Entities: airplanes, airports, cities, flights, seats
- Routes (v1):
  - Airplanes: `GET/POST /airplanes`, `GET/DELETE/PATCH /airplanes/:id`
  - Airports: `GET/POST /airports`, `GET/DELETE/PATCH /airports/:id`
  - Cities: `POST /cities`
  - Flights: `GET/POST /flights`, `GET /flights/:id`, `PATCH /flights/:id/seats`

### Booking Service
- Base path: `/api`
- Routes (v1):
  - `POST /bookings` – create booking `{ flightId, userId, noOfSeats }`
  - `POST /bookings/payments` – make payment `{ totalCost, userId, bookingId }` with header `x-idempotency-key`
- Publishes notifications to RabbitMQ (`noti-queue`)

### Notification Service
- Base path: `/api`
- Routes (v1):
  - `GET /info` – health
  - `POST /ticket` – send email `{ subject, content, receipentEmail }`
- Background consumer reads from `noti-queue` and sends transactional emails

### Docs Service
- Serves Swagger UI generated from `openapi.yaml`
- Supports multiple server bases (local/Render/etc.) using server variables

## OpenAPI
- File: `openapi.yaml`
- Combined spec for all services (Auth, Flight Search, Booking, Notification)
- Use the server dropdown in Swagger UI to select or paste correct base URLs (e.g., `http://localhost:3001` or a deployed Render/Vercel URL)

## Running Locally

### Prerequisites
- Node.js 18+
- Docker (recommended for RabbitMQ)
- MySQL 8+ (or a hosted instance)

### Start with Docker Compose (recommended)
This brings up RabbitMQ and you can run services alongside.

```bash
# From repo root
docker-compose up -d rabbitmq
```

Then run each service locally (in separate terminals):

```bash
# Auth
cd Auth_service
npm install
PORT=3006 JWT_SECRET_KEY=change_me EXPIRES_IN=1d node src/index.js

# Flight Search
cd ../flight-Search
npm install
PORT=3001 NODE_ENV=development node src/index.js

# Booking Service
cd ../Booking-Service
npm install
PORT=4000 RABBIT_MQ_SERVICE=amqp://localhost:5672 \
FLIGHT_SERVICE=http://localhost:3001 USER_SERVICE=http://localhost:3006 \
node src/index.js

# Notification Service
cd ../notification_service
npm install
PORT=3000 RABBIT_MQ_SERVICE=amqp://localhost:5672 \
GMAIL_EMAIL=change_me GMAIL_PASSWORD=change_me \
node src/index.js
```

Docs server locally (two options):

- Docker
```bash
docker build -t karanflight-docs -f docs/Dockerfile .
docker run --rm -p 8080:8080 karanflight-docs
# Open http://localhost:8080
```

- Node (no Docker)
```bash
node docs/server.js
# Open http://localhost:8080
```

### Environment Variables
Minimal list per service (set via shell, `.env`, or Render dashboard):

- Auth: `PORT`, `JWT_SECRET_KEY`, `EXPIRES_IN`
- Flight Search: `PORT`, `NODE_ENV` (development/production), and database settings (see below)
- Booking: `PORT`, `FLIGHT_SERVICE`, `USER_SERVICE`, `RABBIT_MQ_SERVICE`
- Notification: `PORT`, `GMAIL_EMAIL`, `GMAIL_PASSWORD`, `RABBIT_MQ_SERVICE`

#### Database configuration (Flight Search)
- Development is configured in `flight-Search/src/config/config.json`
- Production uses `DATABASE_URL` (e.g., `mysql://user:pass@host:3306/dbname`); `NODE_ENV=production`
- Sequelize is set to support optional SSL in production

## Deployment (Render)
- `render.yaml` defines web services for `auth_service`, `booking_service`, `delivery_service`, `flight_search`, and `docs`
- Set environment variables in the Render dashboard (no secrets committed in Git)
- Docs service builds from project root and serves `openapi.yaml`
- In Swagger UI on Render, pick each service base URL in the server dropdown

## Security and Reliability
- CORS allowed for cross-origin API access (browser clients, Swagger UI)
- Rate limiting applied in Auth service
- Request validation middlewares across services
- JWT authentication with role checks
- Idempotent payment endpoint with `x-idempotency-key`
- Message queue decouples notifications from request path

## API Samples

- Create Airplane
```bash
curl -X POST 'http://localhost:3001/api/v1/airplanes' \
  -H 'Content-Type: application/json' \
  -d '{"modelName":"airbus102","capacity":500}'
```

- List Flights
```bash
curl 'http://localhost:3001/api/v1/flights'
```

- Signup / Signin
```bash
curl -X POST 'http://localhost:3006/api/v1/user/signup' \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"123456"}'

curl -X POST 'http://localhost:3006/api/v1/user/signin' \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"123456"}'
```

- Create Booking
```bash
curl -X POST 'http://localhost:4000/api/v1/bookings' \
  -H 'Content-Type: application/json' \
  -d '{"flightId":1,"userId":1,"noOfSeats":2}'
```

- Make Payment (idempotent)
```bash
curl -X POST 'http://localhost:4000/api/v1/bookings/payments' \
  -H 'Content-Type: application/json' \
  -H 'x-idempotency-key: some-unique-key-123' \
  -d '{"totalCost":1234,"userId":1,"bookingId":1}'
```

- Send Notification Ticket
```bash
curl -X POST 'http://localhost:3000/api/v1/ticket' \
  -H 'Content-Type: application/json' \
  -d '{"subject":"Your Booking","content":"Thanks for booking","receipentEmail":"user@example.com"}'
```

## Troubleshooting
- 404/HTML responses in Swagger UI often indicate a wrong base URL; verify the server dropdown and path
- CORS errors in Swagger usually mean the response didn’t come from the Express service; confirm the URL is correct
- Render 500s with MySQL typically stem from DB config; ensure `DATABASE_URL` and `NODE_ENV=production` are set for `flight_search`
- Docs image build error about `openapi.yaml` path is fixed by building docs from repo root (see `render.yaml` and `docs/Dockerfile`)

## License
This project is for educational purposes. Adjust and extend for production needs (observability, retries, circuit breakers, migrations, schema versioning, etc.).