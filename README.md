## 🔹 Architecture Diagram
![Architecture Diagram](https://github.com/user-attachments/assets/63e71c7f-321e-497e-9d5c-b3e12e27d2f4)

---

## 🔹 Project Flow (Example: Booking Delhi ✈️ Jaipur)

1. **User Auth**  
   - User hits **Auth Service** (Docker container) → JWT issued after login/signup.

2. **Search Flights**  
   - Request to **Flight Search Service** → **MySQL (Sequelize, ACID)** queried for Delhi → Jaipur availability.

3. **Create Booking**  
   - User picks flight → **Booking Service** creates booking with **ACID transaction**.  
   - Payment executed with **idempotency key**.

4. **Publish Notification**  
   - **Booking Service** publishes event to **RabbitMQ** (async, durable).

5. **Send Email**  
   - **Notification Service** consumes event → sends confirmation email.
