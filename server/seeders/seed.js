const sequelize = require('../config/db');
const { Department, User, Medicine, Ward, Bed, Patient } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Syncing database...');
    // In production we would use migrations, but syncing here for quick setup if needed
    // Assuming models index handles relationships, we'll just test the connection/insert

    // NOTE: Run this AFTER running migrations (`npm run db:migrate`)
    
    // 1. Departments
    const dept = await Department.create({
      name: 'General Medicine',
      code: 'GEN',
      description: 'General OPD',
      floor: '1st Floor',
      is_active: true
    });

    // 2. Admin User
    const hash = await bcrypt.hash('Admin@123', 10);
    await User.create({
      employee_id: 'ADM001',
      name: 'System Admin',
      email: 'admin@mediflow.com',
      password_hash: hash,
      phone: '9999999999',
      role: 'admin',
      department_id: dept.id,
      is_active: true
    });

    // 3. Medicinces (Sample)
    await Medicine.create({
      name: 'Paracetamol 500mg',
      generic_name: 'Acetaminophen',
      category: 'Analgesic',
      unit_price: 2.50,
      stock_quantity: 1000,
      reorder_level: 100
    });

    // 4. Wards & Beds
    const ward = await Ward.create({
      name: 'General Ward Male',
      type: 'general',
      floor: '2nd Floor',
      total_beds: 10,
      charge_per_day: 500.00
    });

    await Bed.create({
      ward_id: ward.id,
      bed_number: 'GW-M-01',
      status: 'available'
    });

    console.log('Basic Seed Data successfully inserted!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
