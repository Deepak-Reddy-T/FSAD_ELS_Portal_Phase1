const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',           // Your MySQL username
  password: 'root1234',   // Your MySQL password
  database: 'equipment_lending',
  port: 3306,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Sample data
const sampleUsers = [
  {
    username: 'admin1',
    email: 'admin1@school.edu',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'ADMIN'
  },
  {
    username: 'staff1',
    email: 'staff1@school.edu',
    password: 'staff123',
    firstName: 'Jane',
    lastName: 'Staff',
    role: 'STAFF'
  },
  {
    username: 'student1',
    email: 'student1@school.edu',
    password: 'student123',
    firstName: 'Alice',
    lastName: 'Student',
    role: 'STUDENT'
  },
  {
    username: 'student2',
    email: 'student2@school.edu',
    password: 'student123',
    firstName: 'Bob',
    lastName: 'Student',
    role: 'STUDENT'
  },
  {
    username: 'student3',
    email: 'student3@school.edu',
    password: 'student123',
    firstName: 'Carol',
    lastName: 'Student',
    role: 'STUDENT'
  }
];

const sampleEquipment = [
  {
    name: 'Basketball Set',
    category: 'Sports',
    condition: 'Good',
    quantity: 5,
    description: 'Complete basketball set with balls and hoops'
  },
  {
    name: 'Microscope',
    category: 'Lab',
    condition: 'Excellent',
    quantity: 3,
    description: 'Digital microscope for biology experiments'
  },
  {
    name: 'Guitar',
    category: 'Music',
    condition: 'Good',
    quantity: 2,
    description: 'Acoustic guitar for music classes'
  },
  {
    name: 'Camera',
    category: 'Photography',
    condition: 'Excellent',
    quantity: 4,
    description: 'DSLR camera for photography projects'
  },
  {
    name: 'Laptop',
    category: 'Technology',
    condition: 'Good',
    quantity: 10,
    description: 'Dell laptops for computer science classes'
  },
  {
    name: 'Telescope',
    category: 'Science',
    condition: 'Fair',
    quantity: 2,
    description: 'Astronomical telescope for astronomy club'
  },
  {
    name: 'Volleyball Net',
    category: 'Sports',
    condition: 'Good',
    quantity: 3,
    description: 'Portable volleyball net system'
  },
  {
    name: 'Piano',
    category: 'Music',
    condition: 'Excellent',
    quantity: 1,
    description: 'Digital piano for music department'
  },
  {
    name: 'Chemistry Set',
    category: 'Lab',
    condition: 'Good',
    quantity: 6,
    description: 'Complete chemistry lab equipment set'
  },
  {
    name: 'Projector',
    category: 'Technology',
    condition: 'Good',
    quantity: 8,
    description: 'HD projector for presentations'
  }
];

const samplePurposes = [
  'For science fair project',
  'Class presentation',
  'Research assignment',
  'Group project',
  'Art project',
  'Sports practice',
  'Music performance',
  'Photography assignment',
  'Lab experiment',
  'Educational demonstration'
];

async function seedDatabase() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    console.log('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM borrow_requests');
    await connection.execute('DELETE FROM equipment');
    await connection.execute('DELETE FROM users');
    
    // Insert users
    console.log('Inserting users...');
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.execute(
        'INSERT INTO users (username, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, user.email, hashedPassword, user.firstName, user.lastName, user.role]
      );
    }
    
    // Get user IDs for foreign key references
    const [users] = await connection.execute('SELECT id, role FROM users');
    const userIds = users.reduce((acc, user) => {
      acc[user.role.toLowerCase()] = user.id;
      return acc;
    }, {});
    
    // Insert equipment
    console.log('Inserting equipment...');
    const equipmentIds = [];
    for (const equipment of sampleEquipment) {
      const [result] = await connection.execute(
        'INSERT INTO equipment (name, category, condition_text, quantity, available_quantity, description) VALUES (?, ?, ?, ?, ?, ?)',
        [equipment.name, equipment.category, equipment.condition, equipment.quantity, equipment.quantity, equipment.description]
      );
      equipmentIds.push(result.insertId);
    }
    
    // Insert sample borrow requests
    console.log('Inserting borrow requests...');
    const requestStatuses = ['PENDING', 'APPROVED', 'BORROWED', 'RETURNED', 'REJECTED'];
    const studentIds = users.filter(u => u.role === 'STUDENT').map(u => u.id);
    
    // First, get all equipment with their quantities
    const [equipmentList] = await connection.execute('SELECT id, quantity, available_quantity FROM equipment');
    const equipmentMap = equipmentList.reduce((acc, eq) => {
      acc[eq.id] = eq;
      return acc;
    }, {});
    
    let requestsCreated = 0;
    let attempts = 0;
    const MAX_ATTEMPTS = 30; // Prevent infinite loops
    
    while (requestsCreated < 15 && attempts < MAX_ATTEMPTS) {
      attempts++;
      const randomStudentId = studentIds[Math.floor(Math.random() * studentIds.length)];
      const randomEquipmentId = equipmentIds[Math.floor(Math.random() * equipmentIds.length)];
      
      // Get the equipment's current available quantity
      const equipment = equipmentMap[randomEquipmentId];
      if (!equipment) continue;
      
      // Generate a random quantity that won't make available_quantity negative
      const maxPossibleQuantity = Math.min(3, equipment.available_quantity || 0);
      if (maxPossibleQuantity <= 0) continue; // Skip if no available quantity
      
      const randomQuantity = Math.floor(Math.random() * maxPossibleQuantity) + 1;
      const randomPurpose = samplePurposes[Math.floor(Math.random() * samplePurposes.length)];
      
      // Only allow PENDING status if we're running low on available quantity
      const possibleStatuses = maxPossibleQuantity <= 1 
        ? ['PENDING', 'REJECTED'] 
        : requestStatuses;
      
      const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
      
      const requestDate = new Date();
      requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 30));
      const formattedRequestDate = requestDate.toISOString().slice(0, 19).replace('T', ' ');
      
      let borrowDate = null;
      let returnDate = null;
      
      if (randomStatus === 'BORROWED' || randomStatus === 'RETURNED') {
        borrowDate = new Date(requestDate);
        borrowDate.setDate(borrowDate.getDate() + 1);
        borrowDate = borrowDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      if (randomStatus === 'RETURNED') {
        returnDate = new Date(borrowDate);
        returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 7) + 1);
        returnDate = returnDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      try {
        await connection.beginTransaction();
        
        // Insert the borrow request
        await connection.execute(
          'INSERT INTO borrow_requests (user_id, equipment_id, quantity, request_date, borrow_date, return_date, status, purpose, admin_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            randomStudentId,
            randomEquipmentId,
            randomQuantity,
            formattedRequestDate,
            borrowDate,
            returnDate,
            randomStatus,
            randomPurpose,
            randomStatus === 'REJECTED' ? 'Equipment not available' : null
          ]
        );
        
        // Update the available quantity if status is APPROVED or BORROWED
        if (randomStatus === 'APPROVED' || randomStatus === 'BORROWED') {
          await connection.execute(
            'UPDATE equipment SET available_quantity = available_quantity - ? WHERE id = ?',
            [randomQuantity, randomEquipmentId]
          );
          // Update our local cache
          equipmentMap[randomEquipmentId].available_quantity -= randomQuantity;
        }
        
        await connection.commit();
        requestsCreated++;
      } catch (error) {
        await connection.rollback();
        console.warn('Error creating borrow request, rolling back:', error.message);
      }
    }
    
    // Update equipment available quantities based on active requests
    console.log('Updating equipment availability...');
    const [activeRequests] = await connection.execute(
      'SELECT equipment_id, SUM(quantity) as total_borrowed FROM borrow_requests WHERE status IN ("APPROVED", "BORROWED") GROUP BY equipment_id'
    );
    
    for (const request of activeRequests) {
      await connection.execute(
        'UPDATE equipment SET available_quantity = quantity - ? WHERE id = ?',
        [request.total_borrowed, request.equipment_id]
      );
    }
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${sampleUsers.length} users created`);
    console.log(`- ${sampleEquipment.length} equipment items created`);
    console.log('- 15 borrow requests created');
    console.log('\n🔑 Test Accounts:');
    console.log('Admin: admin1 / admin123');
    console.log('Staff: staff1 / staff123');
    console.log('Students: student1, student2, student3 / student123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Database access denied. Please check your credentials in seed.js');
      console.error('Make sure the database user has proper permissions.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Please make sure MySQL is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('❌ Database does not exist. Please create the equipment_lending database first.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the seed function
seedDatabase();
