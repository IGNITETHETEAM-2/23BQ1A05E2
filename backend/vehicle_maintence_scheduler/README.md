# Vehicle Maintenance Scheduler

A backend service for scheduling and tracking vehicle maintenance tasks, with automated daily reminders via cron jobs.

## Features

- 🚗 Vehicle management (CRUD)
- 🔧 Maintenance schedule management (CRUD)
- ⏰ Automated daily reminders (cron job at 8 AM)
- 📅 7-day upcoming maintenance alerts

## Installation

```bash
cd vehicle_maintence_scheduler
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/vehicle_maintenance
```

## Running the App

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Vehicles
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/vehicles`    | List all vehicles    |
| GET    | `/api/vehicles/:id`| Get vehicle by ID    |
| POST   | `/api/vehicles`    | Create vehicle       |
| PUT    | `/api/vehicles/:id`| Update vehicle       |
| DELETE | `/api/vehicles/:id`| Delete vehicle       |

### Maintenance
| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | `/api/maintenance`             | List all schedules             |
| GET    | `/api/maintenance/:vehicleId`  | Get schedules for a vehicle    |
| POST   | `/api/maintenance`             | Create a schedule              |
| PUT    | `/api/maintenance/:id`         | Update a schedule              |
| DELETE | `/api/maintenance/:id`         | Delete a schedule              |

## Project Structure

```
vehicle_maintence_scheduler/
├── src/
│   ├── routes/
│   │   ├── vehicleRoutes.js
│   │   └── maintenanceRoutes.js
│   ├── controllers/
│   │   ├── vehicleController.js
│   │   └── maintenanceController.js
│   ├── services/
│   │   └── maintenanceService.js
│   └── app.js
├── package.json
└── README.md
```
