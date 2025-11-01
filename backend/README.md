# School Equipment Lending Portal - Backend

Spring Boot REST API for managing school equipment loans.

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup
1. Create MySQL database:
```sql
CREATE DATABASE equipment_lending;
```

2. Update `src/main/resources/application.properties` with your database credentials

3. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Equipment Endpoints
- `GET /api/equipment/public/all` - Get all equipment
- `GET /api/equipment/public/available` - Get available equipment
- `GET /api/equipment/public/category/{category}` - Get equipment by category
- `GET /api/equipment/public/search?name={name}` - Search equipment
- `POST /api/equipment` - Add equipment (Admin only)
- `PUT /api/equipment/{id}` - Update equipment (Admin only)
- `DELETE /api/equipment/{id}` - Delete equipment (Admin only)

### Request Endpoints
- `POST /api/requests` - Create borrow request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/pending` - Get pending requests (Admin/Staff)
- `GET /api/requests/all` - Get all requests (Admin)
- `PUT /api/requests/{id}/approve` - Approve request
- `PUT /api/requests/{id}/reject` - Reject request
- `PUT /api/requests/{id}/borrowed` - Mark as borrowed
- `PUT /api/requests/{id}/returned` - Mark as returned

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Encrypted)
- firstName
- lastName
- role (STUDENT, STAFF, ADMIN)

### Equipment Table
- id (Primary Key)
- name
- category
- condition
- quantity
- availableQuantity
- description

### Borrow Requests Table
- id (Primary Key)
- user_id (Foreign Key)
- equipment_id (Foreign Key)
- quantity
- requestDate
- borrowDate
- returnDate
- status (PENDING, APPROVED, REJECTED, BORROWED, RETURNED)
- purpose
- adminNotes

## Security Configuration

- JWT token-based authentication
- Role-based access control
- Password encryption with BCrypt
- CORS enabled for frontend communication

## Development

### Running Tests
```bash
mvn test
```

### Building JAR
```bash
mvn clean package
```

### Database Migration
The application uses Hibernate's `ddl-auto=update` for automatic schema management. For production, consider using Flyway or Liquibase for proper database migrations.
