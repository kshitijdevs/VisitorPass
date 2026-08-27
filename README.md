# VisitorPass – Visitor Pass Management System

VisitorPass is a MERN-based visitor management application for registering visitors, scheduling and approving appointments, issuing QR-enabled visitor passes, and recording security check-in and check-out activity. It provides separate experiences for administrators, employees, security staff, and visitors submitting a pre-registration request.

## Features

- JWT-based staff authentication
- Role-based authorization for admin, employee, and security users
- Public visitor pre-registration with appointment details
- Staff visitor registration with photo upload
- Appointment creation, approval, and rejection
- QR code generation for approved visitor passes
- PDF visitor-pass badge generation and download
- Security QR scanning for check-in and check-out
- Role-aware dashboard statistics
- Visitor reports with search and company/purpose filters
- CSV export for visitor and check-in/check-out activity reports
- Email notifications for appointment status updates and issued passes

SMS integration is not implemented.

## User roles

| Role | Access |
| --- | --- |
| **Admin** | Can manage visitors and appointments, approve or reject appointments, issue passes, scan passes, view reports, and access dashboard statistics. |
| **Employee** | Can register and view visitors, create appointments, approve or reject appointments, and view the employee dashboard. |
| **Security** | Can view approved appointments, issue passes, scan QR codes for check-in/check-out, and view the security dashboard. |
| **Visitor** | Does not need a staff account; can submit the public pre-registration form. |

## Tech stack

### Frontend

- React
- Vite
- React Router
- `html5-qrcode` for camera-based QR scanning
- `jwt-decode` for reading the client-side JWT role

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`)

### Supporting libraries and services

- Multer for visitor photo uploads
- PDFKit for PDF badge generation
- `qrcode` for pass QR-code generation
- Nodemailer with Gmail SMTP for email notifications
- MongoDB Atlas for the hosted database
- Vercel for the frontend deployment
- Render for the backend deployment

## Project structure

```text
VisitorPass/
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared navigation and protected-route components
│   │   ├── config/           # Frontend API base-URL configuration
│   │   ├── pages/            # Home, login, dashboard, visitors, passes, reports, etc.
│   │   └── style/             # Page-specific styles
│   ├── .env.example          # Example frontend environment configuration
│   └── vercel.json           # SPA refresh-route fallback for Vercel
├── backend/
│   ├── controllers/          # Application workflow logic
│   ├── middleware/           # JWT, role, and upload middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API routes
│   ├── utils/                # Email utilities
│   ├── seed.js               # Development/demo data seed script
│   └── server.js             # Express server entry point
└── README.md
```

## Installation and local setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd VisitorPass
```

### 2. Install dependencies

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Install the backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `backend/.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
EMAIL_USER=your_gmail_address
EMAIL_PASSWORD=your_gmail_app_password
PORT=5000
```

For local frontend development, either rely on the default `http://localhost:5000` API URL or create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Run the application

Start the backend from `backend/`:

```bash
node server.js
```

Start the frontend from `frontend/` in a second terminal:

```bash
npm run dev
```

Open the local Vite URL displayed in the terminal, commonly `http://localhost:5173`.

## Environment variables

| Variable | Required by | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Backend | MongoDB connection string. |
| `JWT_SECRET` | Backend | Signs and verifies JWT authentication tokens. |
| `EMAIL_USER` | Backend | Gmail address used by Nodemailer to send notifications. |
| `EMAIL_PASSWORD` | Backend | Gmail app password used by Nodemailer. |
| `PORT` | Backend | HTTP port; defaults to `5000`. |
| `VITE_API_BASE_URL` | Frontend | Optional backend API base URL. Local development defaults to `http://localhost:5000`; production defaults to the configured Render backend. |

Never commit `.env` files or real credentials.

## Database setup

1. Create a MongoDB Atlas account and a cluster.
2. Create a database user and allow network access for your development machine and/or Render service.
3. Copy the Atlas connection string.
4. Set that value as `MONGO_URI` in `backend/.env` locally and in the Render environment variables for deployment.

The backend creates and uses collections for users, visitors, appointments, passes, and check logs through Mongoose models.

## Demo and seed data

The existing seed script creates demo users, visitors, and appointments:

```bash
cd backend
npm run seed
```

> **Warning:** `seed.js` calls `deleteMany()` for the `User`, `Visitor`, `Appointment`, and `Pass` collections before inserting demo data. Run it only against a safe local/development or demo database—never against production data.

The seeded staff accounts are printed to the terminal when the script finishes.

## API/backend overview

The Express backend exposes these main API areas:

| API area | Base route | Purpose |
| --- | --- | --- |
| Users | `/api/users` | Staff login and admin-protected employee-user creation. |
| Public registration | `/api/visitor-register` | Visitor pre-registration with photo upload and a pending appointment. |
| Visitors | `/api/visitors` | Authenticated visitor creation and listing for admin/employee users. |
| Appointments | `/api/appointments` | Appointment listing, creation, approval, and rejection. |
| Passes | `/api/passes` | Creates one QR-enabled pass for an approved appointment. |
| Check logs | `/api/checklogs` | Security/admin check-in, check-out, and activity listing. |
| Dashboard | `/api/dashboard` | Dashboard statistics based on the logged-in role. |
| PDF | `/api/pdf` | Generates a downloadable visitor-pass PDF. |

## Deployment

The project is configured for this deployment setup:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Set the backend environment variables in Render. For the frontend, set `VITE_API_BASE_URL` in Vercel when a different backend URL is needed. The included Vercel rewrite configuration supports React Router page refreshes.

## Screenshots / demo

Add screenshots or a demo video here when available:

- `[Add home page screenshot]`
- `[Add dashboard screenshot]`
- `[Add visitor pass / QR scan screenshot]`
- `[Add demo video link]`

## Security notes

- Staff authentication uses JWTs signed with `JWT_SECRET`.
- Backend middleware protects authenticated API routes and enforces role-based access for admin, employee, and security users.
- The frontend uses protected routes to restrict staff pages by role; backend authorization remains the enforcement layer.
- Credentials and deployment-specific configuration are read from environment variables rather than committed source files.
- Photo uploads are limited to JPEG, PNG, JPG, and WebP files, with a 5 MB size limit.

## Known limitations

- SMS notifications are not implemented.
- Visitor photos are currently saved to the backend's local `uploads` directory. On Render, local filesystem storage may not persist across restarts or redeployments; persistent object storage would be needed for durable production uploads.
- The backend package currently does not include an automated test suite.

## License

No license has been specified for this repository.
