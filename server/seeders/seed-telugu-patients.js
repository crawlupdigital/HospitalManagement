const sequelize = require('../config/db');
const { Patient } = require('../models');

const teluguNames = [
    { first: 'Ravi', last: 'Teja' },
    { first: 'Srinivas', last: 'Reddy' },
    { first: 'Pawan', last: 'Kalyan' },
    { first: 'Nani', last: 'Ganta' },
    { first: 'Mahesh', last: 'Babu' },
    { first: 'Allu', last: 'Arjun' },
    { first: 'Ram', last: 'Charan' },
    { first: 'Samantha', last: 'Ruth Prabhu' },
    { first: 'Anushka', last: 'Shetty' },
    { first: 'Keerthy', last: 'Suresh' },
    { first: 'Kajal', last: 'Aggarwal' },
    { first: 'Sreeleela', last: 'Reddy' },
    { first: 'Venkatesh', last: 'Daggubati' },
    { first: 'Nagarjuna', last: 'Akkineni' },
    { first: 'Chiranjeevi', last: 'Konidela' },
    { first: 'Varun', last: 'Tej' },
    { first: 'Sai', last: 'Pallavi' },
    { first: 'Vijay', last: 'Deverakonda' },
    { first: 'NTR', last: 'Rama Rao' },
    { first: 'Balakrishna', last: 'Nandamuri' }
];

const locations = [
    { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    { city: 'Warangal', state: 'Telangana', pincode: '506001' },
    { city: 'Nizamabad', state: 'Telangana', pincode: '503001' },
    { city: 'Karimnagar', state: 'Telangana', pincode: '505001' },
    { city: 'Khammam', state: 'Telangana', pincode: '507001' },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530001' },
    { city: 'Vijayawada', state: 'Andhra Pradesh', pincode: '520001' },
    { city: 'Guntur', state: 'Andhra Pradesh', pincode: '522001' },
    { city: 'Nellore', state: 'Andhra Pradesh', pincode: '524001' },
    { city: 'Kurnool', state: 'Andhra Pradesh', pincode: '518001' },
    { city: 'Tirupati', state: 'Andhra Pradesh', pincode: '517501' },
    { city: 'Rajahmundry', state: 'Andhra Pradesh', pincode: '533101' }
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generatePatients(count = 50) {
    try {
        console.log(`Connecting to database and authenticating...`);
        await sequelize.authenticate();
        console.log(`Generating ${count} dummy Telugu patients...`);

        const newPatients = [];
        
        for (let i = 0; i < count; i++) {
            const nameObj = getRandomElement(teluguNames);
            const locationObj = getRandomElement(locations);
            const gender = getRandomElement(genders);
            // Add some noise to names to prevent duplicates
            const firstName = i > 15 ? `${nameObj.first} ${getRandomInt(1,99)}` : nameObj.first;
            
            const p = {
                patient_uid: `PT-${new Date().getFullYear()}-${getRandomInt(10000, 99999)}`,
                name: `${firstName} ${nameObj.last}`,
                date_of_birth: new Date(getRandomInt(1950, 2010), getRandomInt(0, 11), getRandomInt(1, 28)),
                age: new Date().getFullYear() - getRandomInt(1950, 2010),
                gender: gender.toUpperCase(),
                phone: `91${getRandomInt(90000, 99999)}${getRandomInt(10000, 99999)}`.substring(0,15),
                email: `${firstName.replace(' ', '').toLowerCase()}.${nameObj.last.replace(' ', '').toLowerCase()}${getRandomInt(1,100)}@example.com`,
                address: `Plot No ${getRandomInt(1, 500)}, Street ${getRandomInt(1, 15)}`,
                city: locationObj.city,
                state: locationObj.state,
                pincode: locationObj.pincode,
                blood_group: getRandomElement(bloodGroups),
                emergency_contact_name: `${nameObj.last} Relative`,
                emergency_contact_phone: `91${getRandomInt(80000, 89999)}${getRandomInt(10000, 99999)}`.substring(0,15),
            };
            newPatients.push(p);
        }

        // Use bulkCreate to insert faster
        let created = await Patient.bulkCreate(newPatients);
        console.log(`Successfully seeded ${created.length} patients from AP and TS.`);
        process.exit(0);
    } catch (error) {
        console.error('Error generating Telugu dummy patients:', error);
        process.exit(1);
    }
}

generatePatients(50);
