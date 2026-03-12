/**
 * Phase 12 — Comprehensive Master Seeder
 * ────────────────────────────────────────
 * Run with:  node seeders/seed-phase12.js
 *
 * This script:
 *  1. Syncs any new model tables to MySQL (ALTER / CREATE)
 *  2. Seeds Departments, Medicines, Wards, Beds, Ambulances,
 *     Blood Inventory, Missing Role Users, and Demo Appointments
 */

const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const {
  Department, User, Medicine, Ward, Bed,
  Ambulance, BloodInventory, Patient, Appointment
} = require('../models');

// ─── Helpers ────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function run() {
  try {
    console.log('🔄 Authenticating DB connection...');
    await sequelize.authenticate();

    // 1. Sync all models (creates missing tables, adds columns)
    console.log('🔄 Syncing all model tables...');
    await sequelize.sync({ alter: true });
    console.log('✅ All tables synced.\n');

    // ═══════════════════════════════════════════════════════════════
    // 2. DEPARTMENTS
    // ═══════════════════════════════════════════════════════════════
    const depts = [
      { name: 'Cardiology', code: 'CARD', description: 'Heart & Cardiovascular', floor: '3rd Floor' },
      { name: 'Orthopaedics', code: 'ORTH', description: 'Bones & Joints', floor: '2nd Floor' },
      { name: 'Paediatrics', code: 'PAED', description: 'Child Health', floor: '1st Floor' },
      { name: 'ENT', code: 'ENT', description: 'Ear, Nose & Throat', floor: '1st Floor' },
      { name: 'Emergency', code: 'EMER', description: '24/7 Emergency Services', floor: 'Ground Floor' },
      { name: 'Radiology', code: 'RAD', description: 'Imaging & Diagnostics', floor: 'Basement' },
      { name: 'Pathology', code: 'PATH', description: 'Laboratory & Blood Sciences', floor: 'Basement' },
      { name: 'Obstetrics & Gynaecology', code: 'OBGY', description: "Women's Health", floor: '4th Floor' },
      { name: 'Dermatology', code: 'DERM', description: 'Skin & Cosmetics', floor: '1st Floor' },
      { name: 'Neurology', code: 'NEUR', description: 'Brain & Nervous System', floor: '3rd Floor' },
    ];

    let deptCount = 0;
    for (const d of depts) {
      const [, created] = await Department.findOrCreate({
        where: { code: d.code },
        defaults: { ...d, is_active: true }
      });
      if (created) deptCount++;
    }
    console.log(`✅ Departments: ${deptCount} new created.\n`);

    // ═══════════════════════════════════════════════════════════════
    // 3. MEDICINES (30+ real drugs)
    // ═══════════════════════════════════════════════════════════════
    const meds = [
      { name: 'Ibuprofen 400mg', generic_name: 'Ibuprofen', category: 'NSAID', unit_price: 3.50, stock_quantity: 800, reorder_level: 100 },
      { name: 'Diclofenac 50mg', generic_name: 'Diclofenac Sodium', category: 'NSAID', unit_price: 5.00, stock_quantity: 600, reorder_level: 80 },
      { name: 'Aspirin 150mg', generic_name: 'Acetylsalicylic Acid', category: 'Antiplatelet', unit_price: 1.50, stock_quantity: 1200, reorder_level: 200 },
      { name: 'Amoxicillin 500mg', generic_name: 'Amoxicillin', category: 'Antibiotic', unit_price: 8.00, stock_quantity: 500, reorder_level: 75 },
      { name: 'Azithromycin 500mg', generic_name: 'Azithromycin', category: 'Antibiotic', unit_price: 15.00, stock_quantity: 400, reorder_level: 60 },
      { name: 'Ciprofloxacin 500mg', generic_name: 'Ciprofloxacin', category: 'Antibiotic', unit_price: 10.00, stock_quantity: 350, reorder_level: 50 },
      { name: 'Metronidazole 400mg', generic_name: 'Metronidazole', category: 'Antibiotic', unit_price: 4.00, stock_quantity: 700, reorder_level: 100 },
      { name: 'Ceftriaxone 1g Inj', generic_name: 'Ceftriaxone', category: 'Antibiotic', unit_price: 65.00, stock_quantity: 200, reorder_level: 30 },
      { name: 'Cetirizine 10mg', generic_name: 'Cetirizine', category: 'Antihistamine', unit_price: 2.00, stock_quantity: 900, reorder_level: 150 },
      { name: 'Levocetirizine 5mg', generic_name: 'Levocetirizine', category: 'Antihistamine', unit_price: 3.00, stock_quantity: 700, reorder_level: 100 },
      { name: 'Pantoprazole 40mg', generic_name: 'Pantoprazole', category: 'PPI', unit_price: 6.00, stock_quantity: 600, reorder_level: 80 },
      { name: 'Omeprazole 20mg', generic_name: 'Omeprazole', category: 'PPI', unit_price: 5.00, stock_quantity: 500, reorder_level: 70 },
      { name: 'Domperidone 10mg', generic_name: 'Domperidone', category: 'Antiemetic', unit_price: 3.50, stock_quantity: 400, reorder_level: 60 },
      { name: 'Ondansetron 4mg', generic_name: 'Ondansetron', category: 'Antiemetic', unit_price: 12.00, stock_quantity: 300, reorder_level: 40 },
      { name: 'Amlodipine 5mg', generic_name: 'Amlodipine', category: 'Antihypertensive', unit_price: 4.00, stock_quantity: 800, reorder_level: 120 },
      { name: 'Telmisartan 40mg', generic_name: 'Telmisartan', category: 'Antihypertensive', unit_price: 7.00, stock_quantity: 600, reorder_level: 90 },
      { name: 'Atenolol 50mg', generic_name: 'Atenolol', category: 'Beta Blocker', unit_price: 3.00, stock_quantity: 700, reorder_level: 100 },
      { name: 'Metformin 500mg', generic_name: 'Metformin', category: 'Antidiabetic', unit_price: 2.50, stock_quantity: 1000, reorder_level: 200 },
      { name: 'Glimepiride 2mg', generic_name: 'Glimepiride', category: 'Antidiabetic', unit_price: 5.00, stock_quantity: 500, reorder_level: 80 },
      { name: 'Prednisolone 10mg', generic_name: 'Prednisolone', category: 'Corticosteroid', unit_price: 4.50, stock_quantity: 400, reorder_level: 60 },
      { name: 'Dexamethasone 4mg Inj', generic_name: 'Dexamethasone', category: 'Corticosteroid', unit_price: 25.00, stock_quantity: 250, reorder_level: 40 },
      { name: 'Multivitamin Tab', generic_name: 'Multivitamin', category: 'Supplement', unit_price: 3.00, stock_quantity: 1500, reorder_level: 300 },
      { name: 'Iron + Folic Acid', generic_name: 'Ferrous Sulphate + Folic acid', category: 'Supplement', unit_price: 2.00, stock_quantity: 1000, reorder_level: 200 },
      { name: 'Calcium + Vitamin D3', generic_name: 'Calcium Carbonate + D3', category: 'Supplement', unit_price: 5.00, stock_quantity: 800, reorder_level: 150 },
      { name: 'Adrenaline 1mg Inj', generic_name: 'Epinephrine', category: 'Emergency', unit_price: 30.00, stock_quantity: 150, reorder_level: 20 },
      { name: 'Atropine 0.6mg Inj', generic_name: 'Atropine Sulphate', category: 'Emergency', unit_price: 18.00, stock_quantity: 100, reorder_level: 15 },
      { name: 'Normal Saline 500ml IV', generic_name: 'Sodium Chloride 0.9%', category: 'IV Fluid', unit_price: 35.00, stock_quantity: 500, reorder_level: 100 },
      { name: 'Ringer Lactate 500ml IV', generic_name: 'Ringer Lactate', category: 'IV Fluid', unit_price: 40.00, stock_quantity: 400, reorder_level: 80 },
      { name: 'Salbutamol Inhaler', generic_name: 'Salbutamol', category: 'Bronchodilator', unit_price: 120.00, stock_quantity: 200, reorder_level: 30 },
      { name: 'Montelukast 10mg', generic_name: 'Montelukast', category: 'Antileukotriene', unit_price: 8.00, stock_quantity: 400, reorder_level: 60 },
      { name: 'Betadine Ointment 20g', generic_name: 'Povidone Iodine', category: 'Antiseptic', unit_price: 45.00, stock_quantity: 300, reorder_level: 50 },
      { name: 'Silver Sulfadiazine Cream', generic_name: 'Silver Sulfadiazine', category: 'Burn Treatment', unit_price: 55.00, stock_quantity: 150, reorder_level: 25 },
    ];

    let medCount = 0;
    for (const m of meds) {
      const [, created] = await Medicine.findOrCreate({
        where: { name: m.name },
        defaults: m
      });
      if (created) medCount++;
    }
    console.log(`✅ Medicines: ${medCount} new created (32 total catalogue).\n`);

    // ═══════════════════════════════════════════════════════════════
    // 4. WARDS & BEDS
    // Ward type ENUM: GENERAL, SEMI_PRIVATE, PRIVATE, ICU, NICU, PICU
    // ═══════════════════════════════════════════════════════════════
    const wards = [
      { name: 'ICU Ward', type: 'ICU', floor: '3rd Floor', total_beds: 8, charge_per_day: 5000.00 },
      { name: 'General Ward Female', type: 'GENERAL', floor: '2nd Floor', total_beds: 10, charge_per_day: 500.00 },
      { name: 'Paediatric ICU', type: 'PICU', floor: '1st Floor', total_beds: 6, charge_per_day: 4000.00 },
      { name: 'Neonatal ICU', type: 'NICU', floor: '1st Floor', total_beds: 6, charge_per_day: 4500.00 },
      { name: 'Semi-Private Ward', type: 'SEMI_PRIVATE', floor: '4th Floor', total_beds: 8, charge_per_day: 1500.00 },
      { name: 'Private Room', type: 'PRIVATE', floor: '4th Floor', total_beds: 5, charge_per_day: 3500.00 },
    ];

    let wardCount = 0, bedCount = 0;
    for (const w of wards) {
      const [ward, created] = await Ward.findOrCreate({
        where: { name: w.name },
        defaults: w
      });
      if (created) {
        wardCount++;
        const prefix = w.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        for (let i = 1; i <= w.total_beds; i++) {
          const bedNum = `${prefix}-${String(i).padStart(2, '0')}`;
          await Bed.findOrCreate({
            where: { bed_number: bedNum },
            defaults: {
              ward_id: ward.id,
              bed_number: bedNum,
              status: i <= 2 ? 'occupied' : 'available'
            }
          });
          bedCount++;
        }
      }
    }
    console.log(`✅ Wards: ${wardCount} new | Beds: ${bedCount} new.\n`);

    // ═══════════════════════════════════════════════════════════════
    // 5. AMBULANCE FLEET (5 vehicles)
    // ═══════════════════════════════════════════════════════════════
    const ambulances = [
      { vehicle_no: 'TS-09-MF-1001', type: 'BASIC', driver_name: 'Raju Kumar', driver_phone: '9876501001', status: 'AVAILABLE', current_location: 'Hospital Campus' },
      { vehicle_no: 'TS-09-MF-1002', type: 'ADVANCED', driver_name: 'Suresh Reddy', driver_phone: '9876501002', status: 'AVAILABLE', current_location: 'Hospital Campus' },
      { vehicle_no: 'TS-09-MF-1003', type: 'ICU_MOBILE', driver_name: 'Venkat Rao', driver_phone: '9876501003', status: 'AVAILABLE', current_location: 'Hospital Campus' },
      { vehicle_no: 'AP-16-MF-2001', type: 'BASIC', driver_name: 'Kiran Naidu', driver_phone: '9876502001', status: 'AVAILABLE', current_location: 'Hospital Campus' },
      { vehicle_no: 'AP-16-MF-2002', type: 'ADVANCED', driver_name: 'Prasad Goud', driver_phone: '9876502002', status: 'MAINTENANCE', current_location: 'Service Center' },
    ];

    let ambCount = 0;
    for (const a of ambulances) {
      const [, created] = await Ambulance.findOrCreate({
        where: { vehicle_no: a.vehicle_no },
        defaults: { ...a, is_active: true }
      });
      if (created) ambCount++;
    }
    console.log(`✅ Ambulances: ${ambCount} new vehicles registered.\n`);

    // ═══════════════════════════════════════════════════════════════
    // 6. BLOOD BANK INVENTORY (all 8 groups, all components)
    // ═══════════════════════════════════════════════════════════════
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const components = ['WHOLE_BLOOD', 'PACKED_RBC', 'PLASMA', 'PLATELETS'];
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + 35);

    let bloodCount = 0;
    for (const bg of bloodGroups) {
      for (const comp of components) {
        const [, created] = await BloodInventory.findOrCreate({
          where: { blood_group: bg, component: comp },
          defaults: {
            blood_group: bg,
            component: comp,
            units_available: rand(2, 25),
            collection_date: today.toISOString().split('T')[0],
            expiry_date: expiry.toISOString().split('T')[0],
            status: 'AVAILABLE'
          }
        });
        if (created) bloodCount++;
      }
    }
    console.log(`✅ Blood Inventory: ${bloodCount} entries across ${bloodGroups.length} groups × ${components.length} components.\n`);

    // ═══════════════════════════════════════════════════════════════
    // 7. MISSING ROLE USERS (radiologist, ambulance, extra doctors)
    // ═══════════════════════════════════════════════════════════════
    const dept = await Department.findOne();
    const hash = await bcrypt.hash('Test@123', 10);

    const extraUsers = [
      { role: 'radiologist', email: 'radiology@mediflow.com', name: 'Dr. Priya Sharma', empid: 'RAD001', specialization: 'Diagnostic Radiology' },
      { role: 'ambulance', email: 'ambulance@mediflow.com', name: 'Raju Ambulance Ops', empid: 'AMB001', specialization: null },
      { role: 'doctor', email: 'doctor2@mediflow.com', name: 'Dr. Suresh Cardiology', empid: 'DOC002', specialization: 'Cardiology' },
      { role: 'doctor', email: 'doctor3@mediflow.com', name: 'Dr. Lakshmi Paediatrics', empid: 'DOC003', specialization: 'Paediatrics' },
      { role: 'nurse', email: 'nurse2@mediflow.com', name: 'Anu Nurse ICU', empid: 'NUR002', specialization: null },
    ];

    let userCount = 0;
    for (const u of extraUsers) {
      const [, created] = await User.findOrCreate({
        where: { email: u.email },
        defaults: {
          employee_id: u.empid,
          name: u.name,
          email: u.email,
          password_hash: hash,
          phone: `98765${rand(10000, 99999)}`,
          role: u.role,
          specialization: u.specialization,
          department_id: dept.id,
          is_active: true
        }
      });
      if (created) userCount++;
    }
    console.log(`✅ Users: ${userCount} new role accounts created.\n`);

    // ═══════════════════════════════════════════════════════════════
    // 8. SAMPLE APPOINTMENTS (for today, so dashboards show data)
    // Appointment status ENUM: WAITING, IN-PROGRESS, COMPLETED, CANCELLED, NO-SHOW
    // Appointment type ENUM: WALK-IN, SCHEDULED, EMERGENCY, FOLLOW-UP
    // ═══════════════════════════════════════════════════════════════
    const patients = await Patient.findAll({ limit: 10 });
    const doctors = await User.findAll({ where: { role: 'doctor' }, limit: 3 });

    if (patients.length > 0 && doctors.length > 0) {
      let apptCount = 0;
      const todayStr = today.toISOString().split('T')[0];
      const timeSlots = ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '14:00:00', '14:30:00'];
      const complaints = [
        'General checkup', 'Follow-up visit', 'Fever and cold symptoms',
        'Joint pain in knees', 'Skin rash on arms', 'Persistent headache',
        'Mild chest discomfort', 'Annual health screening'
      ];
      const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'IN-PROGRESS', 'IN-PROGRESS', 'WAITING', 'WAITING', 'WAITING'];

      for (let i = 0; i < Math.min(patients.length, 8); i++) {
        const doctor = doctors[i % doctors.length];
        const [, created] = await Appointment.findOrCreate({
          where: {
            patient_id: patients[i].id,
            appointment_date: todayStr,
            token_no: i + 1
          },
          defaults: {
            patient_id: patients[i].id,
            doctor_id: doctor.id,
            appointment_date: todayStr,
            appointment_time: timeSlots[i],
            token_no: i + 1,
            type: i < 6 ? 'WALK-IN' : 'SCHEDULED',
            chief_complaint: complaints[i],
            status: statuses[i],
            priority: i === 6 ? 'URGENT' : 'NORMAL'
          }
        });
        if (created) apptCount++;
      }
      console.log(`✅ Appointments: ${apptCount} demo appointments for today.\n`);
    } else {
      console.log('⚠️  No patients/doctors found — skipping appointment seeding. Run telugu seeder first.\n');
    }

    // ═══════════════════════════════════════════════════════════════
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Phase 12 Seeding Complete!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\nLogin credentials for all seeded users:');
    console.log('  Admin:        admin@mediflow.com       / Admin@123');
    console.log('  Doctor:       doctor@mediflow.com      / Test@123');
    console.log('  Doctor 2:     doctor2@mediflow.com     / Test@123');
    console.log('  Doctor 3:     doctor3@mediflow.com     / Test@123');
    console.log('  Receptionist: reception@mediflow.com   / Test@123');
    console.log('  Pharmacist:   pharmacy@mediflow.com    / Test@123');
    console.log('  Lab Tech:     lab@mediflow.com         / Test@123');
    console.log('  Nurse:        nurse@mediflow.com       / Test@123');
    console.log('  Nurse 2:      nurse2@mediflow.com      / Test@123');
    console.log('  Billing:      billing@mediflow.com     / Test@123');
    console.log('  Radiologist:  radiology@mediflow.com   / Test@123');
    console.log('  Ambulance:    ambulance@mediflow.com   / Test@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Phase 12 Seeding Failed:', error);
    process.exit(1);
  }
}

run();
