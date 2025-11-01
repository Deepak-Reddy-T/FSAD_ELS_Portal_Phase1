# School Equipment Lending Portal

A full-stack web application for managing school equipment loans, built with React (frontend) and Java Spring Boot (backend) with MySQL database.

## Features

### User Authentication & Roles
- Login/signup for students, staff, and admins
- Role-based access control (student, staff, admin)
- JWT token-based authentication

### Equipment Management
- Add, edit, or delete equipment items (admin only)
- Each item has name, category, condition, quantity, and availability
- Equipment categories: Sports, Lab, Music, Camera, etc.

### Borrowing & Return System
- Students can request equipment with purpose description
- Staff/admin can approve or reject requests
- Track borrowing status: Pending → Approved → Borrowed → Returned
- Prevent overlapping bookings for the same item
- Automatic availability updates

### Dashboard & Search
- Equipment listing with search and filter capabilities
- User dashboard showing personal statistics
- Admin dashboard with system overview
- Real-time availability status

### Responsive UI
- Modern React frontend with Bootstrap styling
- Mobile-responsive design
- Intuitive navigation and user experience

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT authentication)
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0**
- **Maven** (dependency management)

### Frontend
- **React 18**
- **React Router DOM** (routing)
- **Bootstrap 5** (UI framework)
- **React Bootstrap** (components)
- **Axios** (HTTP client)

### Database
- **MySQL 8.0**
- Automatic schema creation and updates

## Project Structure

```
FSAD/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/school/equipmentlending/
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # Data Access Layer
│   │   ├── service/           # Business Logic
│   │   ├── controller/        # REST Controllers
│   │   ├── security/          # Security Configuration
│   │   └── dto/              # Data Transfer Objects
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # React Components
│   │   ├── contexts/          # React Contexts
│   │   └── App.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE equipment_lending;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Equipment (Public)
- `GET /api/equipment/public/all` - Get all equipment
- `GET /api/equipment/public/available` - Get available equipment
- `GET /api/equipment/public/category/{category}` - Get equipment by category
- `GET /api/equipment/public/search?name={name}` - Search equipment

### Equipment Management (Admin)
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

### Borrow Requests
- `POST /api/requests` - Create borrow request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/pending` - Get pending requests (admin)
- `GET /api/requests/all` - Get all requests (admin)
- `PUT /api/requests/{id}/approve` - Approve request
- `PUT /api/requests/{id}/reject` - Reject request
- `PUT /api/requests/{id}/borrowed` - Mark as borrowed
- `PUT /api/requests/{id}/returned` - Mark as returned

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

## User Roles

### Student
- Browse equipment catalog
- Submit borrowing requests
- View personal request history
- Update profile information

### Staff
- All student permissions
- Additional equipment access
- Can be assigned admin privileges

### Admin
- All staff permissions
- Manage equipment (add, edit, delete)
- Approve/reject borrowing requests
- View system statistics
- Manage user accounts

### Equipment Management
- **Categories**: Sports, Lab Equipment, Musical Instruments, Cameras, Project Materials
- **Conditions**: Excellent, Good, Fair, Poor
- **Availability Tracking**: Real-time quantity updates
- **Search & Filter**: By name, category, availability

### Request Workflow
1. **Request**: Student submits request with purpose
2. **Review**: Admin reviews and approves/rejects
3. **Issue**: Equipment is marked as borrowed
4. **Return**: Equipment is returned and marked available

### Security Features
- JWT token-based authentication
- Role-based access control
- Password encryption (BCrypt)
- CORS configuration for frontend-backend communication
