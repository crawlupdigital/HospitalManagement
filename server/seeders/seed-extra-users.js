const sequelize = require('../config/db');
const { User, Department } = require('../models');
const bcrypt = require('bcryptjs');

async function seedExtra() {
  try {
    console.log('Syncing database for extra users...');
    
    // Get the first department to assign users to
    const dept = await Department.findOne();

    if (!dept) {
        console.error("No departments found. Please run regular seed first.");
        process.exit(1);
    }

    const rolesAndEmails = [
      { role: 'doctor', email: 'doctor@mediflow.com', name: 'Dr. John Doe', empid: 'DOC001' },
      { role: 'receptionist', email: 'reception@mediflow.com', name: 'Jane Reception', empid: 'REC001' },
      { role: 'pharmacist', email: 'pharmacy@mediflow.com', name: 'Phil Pharmacist', empid: 'PHA001' },
      { role: 'lab_tech', email: 'lab@mediflow.com', name: 'Larry Lab', empid: 'LAB001' },
      { role: 'nurse', email: 'nurse@mediflow.com', name: 'Nancy Nurse', empid: 'NUR001' },
      { role: 'billing', email: 'billing@mediflow.com', name: 'Bill Billing', empid: 'BIL001' },
    ];

    const hash = await bcrypt.hash('Test@123', 10);

    for (const u of rolesAndEmails) {
      // Create only if not exists
      const exists = await User.findOne({ where: { email: u.email } });
      if (!exists) {
        await User.create({
          employee_id: u.empid,
          name: u.name,
          email: u.email,
          password_hash: hash,
          phone: '9999999999',
          role: u.role,
          department_id: dept.id,
          is_active: true
        });
        console.log(`Created user: ${u.email} (${u.role})`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('Extra users successfully inserted!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding extra users failed:', error);
    process.exit(1);
  }
}

seedExtra();
