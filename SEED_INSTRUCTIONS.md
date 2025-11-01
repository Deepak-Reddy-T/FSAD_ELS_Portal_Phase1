# Database Seeding Instructions

## Prerequisites
- Node.js installed
- MySQL running
- Backend application should be stopped (to avoid conflicts)

## Setup

1. **Set up MySQL database and user:**
```bash
# Run the database setup script
mysql -u root -p < setup_database.sql
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update database credentials in `seed.js` if needed:**
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'equipment_user',           // Database user
  password: 'your_password',       // Database password
  database: 'equipment_lending'
};
```

4. **Run the seed script:**
```bash
npm run seed
```

## What the seed script creates:

### Users (5 accounts)
- **Admin:** admin1 / admin123
- **Staff:** staff1 / staff123  
- **Students:** student1, student2, student3 / student123

### Equipment (10 items)
- Basketball Set, Microscope, Guitar, Camera, Laptop
- Telescope, Volleyball Net, Piano, Chemistry Set, Projector
- Various categories: Sports, Lab, Music, Technology, Science

### Borrow Requests (15 requests)
- Random statuses: PENDING, APPROVED, BORROWED, RETURNED, REJECTED
- Realistic dates and purposes
- Equipment availability automatically calculated

## After seeding:

1. **Start the backend:**
```bash
cd backend
mvn spring-boot:run
```

2. **Start the frontend:**
```bash
cd frontend
npm start
```

3. **Test the application:**
- Login as admin1/admin123 to manage equipment and requests
- Login as student1/student123 to browse and request equipment
- Check the admin dashboard for statistics

## Notes:
- The script clears existing data before seeding
- Passwords are properly hashed with bcrypt
- Equipment availability is calculated based on active borrow requests
- All foreign key relationships are maintained
