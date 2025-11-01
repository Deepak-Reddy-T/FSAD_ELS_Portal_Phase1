# School Equipment Lending Portal - Frontend

A React-based frontend for the School Equipment Lending Portal.
Built with a responsive, modern UI and role-based access for students, staff, and administrators.

---

## Quick Start

### Prerequisites

* Node.js v16+
* npm or yarn

### Setup

1. Install dependencies:
   npm install


2. Start the development server:
   npm start


The app will be available at [http://localhost:3000](http://localhost:3000).



## Features

### User Interface

* Responsive design with Bootstrap 5
* Clean and modern layout
* Role-based navigation for students, staff, and admins

### Main Pages

* **Login / Signup:** User authentication and registration
* **Dashboard:** Personalized overview and quick actions
* **Equipment Catalog:** Browse, search, and filter available items
* **My Requests:** Track borrowing history
* **Admin Dashboard:** System overview and quick stats
* **Equipment Management:** Add, edit, delete, and manage inventory
* **Request Management:** Approve or reject borrowing requests

## Core Components

* **EquipmentList:** Displays all equipment with search and availability indicators
* **BorrowRequests:** Shows user request history with status tracking
* **AdminDashboard:** Overview of key system data
* **EquipmentManagement:** CRUD operations for equipment
* **RequestManagement:** Admin controls for processing requests



## State Management and API Integration

### Authentication Context

* Login and logout handling
* JWT token management
* Role-based route protection

### API Integration

* Axios for HTTP requests
* Automatic token attachment
* Error handling and user feedback
* Loading states and UI indicators

---

## Styling

* Built with Bootstrap 5 and React-Bootstrap
* Custom CSS for branding and layout
* Consistent color scheme and component styling
* Card-based layout with clear status badges

---

## Routing

### Access Control

* Only `/login` and `/signup` are public
* Other routes require authentication
* Admin pages restricted by role

### Route Overview

| Route              | Description          |
| ------------------ | -------------------- |
| `/login`           | User login           |
| `/signup`          | User registration    |
| `/dashboard`       | User dashboard       |
| `/equipment`       | Equipment catalog    |
| `/requests`        | Borrowing history    |
| `/admin`           | Admin dashboard      |
| `/admin/equipment` | Equipment management |
| `/admin/requests`  | Request management   |

---

## Development

### Scripts

| Command     | Description                          |
| ----------- | ------------------------------------ |
| `npm start` | Start development server             |
| `npm build` | Build for production                 |
| `npm test`  | Run tests                            |
| `npm eject` | Eject Create React App configuration |

### Environment Setup

* Proxy configuration for backend API
* Environment variables for API endpoints
* CORS setup for local development

---

## Project Structure

src/
├── components/
│   ├── Login.js
│   ├── Signup.js
│   ├── Dashboard.js
│   ├── EquipmentList.js
│   ├── BorrowRequests.js
│   ├── AdminDashboard.js
│   ├── EquipmentManagement.js
│   ├── RequestManagement.js
│   └── Navbar.js
├── contexts/
│   └── AuthContext.js
├── App.js
├── App.css
├── index.js
└── index.css

