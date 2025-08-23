#  Microservices Flight Platform

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

<img width="1264" height="810" alt="image" src="https://github.com/user-attachments/assets/63e71c7f-321e-497e-9d5c-b3e12e27d2f4" />


## Troubleshooting
- 404/HTML responses in Swagger UI often indicate a wrong base URL; verify the server dropdown and path
- CORS errors in Swagger usually mean the response didn’t come from the Express service; confirm the URL is correct
- Render 500s with MySQL typically stem from DB config; ensure `DATABASE_URL` and `NODE_ENV=production` are set for `flight_search`
- Docs image build error about `openapi.yaml` path is fixed by building docs from repo root (see `render.yaml` and `docs/Dockerfile`)
