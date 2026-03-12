# MediFlow HMS - Complete Application Specifications

> **Auto-generated from MediFlow-HMS-Architecture-Blueprint.docx and MediFlow-HMS-Analytics-Addendum.docx**

---

## Part 1: Core Architecture & Database Blueprint


MEDIFLOW HMS
Hospital Management System
Complete Architecture & Development Blueprint
Tech Stack: React + Vite + Tailwind CSS | Node.js + Express | MySQL
Version 1.0 | March 2026
Prepared for: Claude Code Automated Build

Table of Contents



1. Project Overview
MediFlow HMS is a comprehensive, full-stack Hospital Management System that digitizes the complete patient lifecycle from hospital entrance to exit. The system covers every operational department including reception, consultation, pharmacy, nursing, laboratory, radiology, billing, blood bank, ambulance tracking, ICU/ward management, insurance processing, and administrative oversight.

1.1 Core Objectives
•	End-to-end patient lifecycle tracking with real-time status updates
•	Automatic prescription routing: medicines to Pharmacy, injections to Nursing, tests to Lab, imaging to Radiology
•	Role-based dashboards with separate views for each department
•	Real-time notifications and alerts across all departments
•	Mobile-responsive design that works on all devices (phone, tablet, desktop)
•	Clean, light-themed, playful yet professional UI with intuitive interactions
•	MySQL database with proper relational schema and data integrity
•	RESTful API architecture with JWT authentication

1.2 Tech Stack Summary
Layer
Technology
Version
Purpose
Frontend
React 18 + Vite
Latest
SPA with fast HMR
Styling
Tailwind CSS 3
Latest
Utility-first responsive CSS
Icons
Lucide React
Latest
Clean SVG icon library
Charts
Recharts
Latest
Dashboard analytics
State
Zustand
Latest
Lightweight global state
HTTP Client
Axios
Latest
API calls with interceptors
Routing
React Router v6
Latest
Client-side routing
Forms
React Hook Form + Zod
Latest
Form validation
Date
date-fns
Latest
Date formatting
Notifications
React Hot Toast
Latest
Toast notifications
Backend
Node.js + Express
Latest LTS
REST API server
ORM
Sequelize
Latest
MySQL ORM with migrations
Auth
JWT + bcrypt
Latest
Token authentication
Validation
Joi
Latest
Request validation
Realtime
Socket.io
Latest
Live notifications
Database
MySQL 8
8.x
Relational database
File Upload
Multer
Latest
File handling
Email
Nodemailer
Latest
Email notifications
PDF
PDFKit
Latest
Bill/report generation

1.3 User Roles (12 Roles)
Role
Access Level
Primary Functions
Admin
Full System
Dashboard, all modules, user management, reports, settings
Receptionist
Reception
Patient registration, appointment booking, queue management
Doctor
Consultation
Patient consultation, prescription writing, medical records
Nurse
Nursing Station
Injection administration, vitals recording, wound care
Pharmacist
Pharmacy
Medicine dispensing, inventory management, prescriptions
Lab Technician
Laboratory
Sample collection, test processing, result entry
Radiologist
Radiology
Imaging orders, scan processing, report upload
Billing Staff
Billing
Invoice generation, payment collection, insurance claims
Blood Bank Tech
Blood Bank
Blood inventory, donor management, cross-matching
ICU Manager
ICU/Wards
Bed management, critical care monitoring, ventilator tracking
Ambulance Coordinator
Ambulance
Fleet tracking, dispatch, emergency response
Insurance/TPA
Insurance
Claim processing, pre-auth, TPA coordination

2. Complete Project Folder Structure
Below is the exact file-by-file structure. Every file listed must be created by Claude Code.

2.1 Root Structure
mediflow-hms/
package.json
.env.example
.gitignore
README.md
docker-compose.yml  (optional)
client/              (React Frontend)
server/              (Node.js Backend)
database/            (SQL Scripts)

2.2 Frontend: client/ Directory
client/
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js
.env
public/
favicon.ico
logo.svg
src/
main.jsx
App.jsx
index.css
api/
axios.js
auth.api.js
patients.api.js
appointments.api.js
prescriptions.api.js
pharmacy.api.js
nursing.api.js
lab.api.js
radiology.api.js
billing.api.js
bloodbank.api.js
ambulance.api.js
icu.api.js
insurance.api.js
staff.api.js
dashboard.api.js
notifications.api.js
store/
useAuthStore.js
usePatientStore.js
useNotificationStore.js
useUIStore.js
hooks/
useAuth.js
useSocket.js
useDebounce.js
usePagination.js
utils/
constants.js
formatters.js
validators.js
helpers.js
components/
layout/
AppLayout.jsx
Sidebar.jsx
Topbar.jsx
MobileNav.jsx
NotificationPanel.jsx
common/
Button.jsx
Input.jsx
Select.jsx
Modal.jsx
ConfirmDialog.jsx
DataTable.jsx
Badge.jsx
Card.jsx
StatCard.jsx
EmptyState.jsx
LoadingSpinner.jsx
SearchInput.jsx
Pagination.jsx
DatePicker.jsx
FileUpload.jsx
Toast.jsx
Tabs.jsx
Tooltip.jsx
Avatar.jsx
patient/
PatientJourneyTracker.jsx
PatientCard.jsx
PatientForm.jsx
PatientVitals.jsx
PatientHistory.jsx
PatientSearch.jsx
prescription/
PrescriptionForm.jsx
PrescriptionCard.jsx
PrescriptionRouting.jsx
charts/
PatientFlowChart.jsx
DepartmentLoadChart.jsx
RevenueChart.jsx
BedOccupancyChart.jsx
pages/
auth/
LoginPage.jsx
ForgotPasswordPage.jsx
dashboard/
AdminDashboard.jsx
DashboardWidgets.jsx
reception/
ReceptionDashboard.jsx
PatientRegistration.jsx
AppointmentBooking.jsx
QueueManagement.jsx
TokenDisplay.jsx
doctor/
DoctorDashboard.jsx
ConsultationRoom.jsx
PatientExamination.jsx
PrescriptionWriter.jsx
MedicalHistory.jsx
pharmacy/
PharmacyDashboard.jsx
DispenseQueue.jsx
MedicineInventory.jsx
MedicineSearch.jsx
nursing/
NursingDashboard.jsx
InjectionQueue.jsx
VitalsEntry.jsx
NursingNotes.jsx
lab/
LabDashboard.jsx
TestQueue.jsx
SampleCollection.jsx
ResultEntry.jsx
LabReports.jsx
radiology/
RadiologyDashboard.jsx
ImagingQueue.jsx
ScanUpload.jsx
RadiologyReports.jsx
billing/
BillingDashboard.jsx
InvoiceGenerator.jsx
PaymentCollection.jsx
BillingHistory.jsx
bloodbank/
BloodBankDashboard.jsx
BloodInventory.jsx
DonorManagement.jsx
CrossMatch.jsx
BloodRequest.jsx
ambulance/
AmbulanceDashboard.jsx
FleetManagement.jsx
DispatchControl.jsx
TripHistory.jsx
icu/
ICUDashboard.jsx
BedManagement.jsx
WardManagement.jsx
VentilatorTracking.jsx
CriticalAlerts.jsx
insurance/
InsuranceDashboard.jsx
ClaimProcessing.jsx
PreAuthorization.jsx
TPAManagement.jsx
admin/
UserManagement.jsx
StaffDirectory.jsx
SystemSettings.jsx
AuditLog.jsx
Reports.jsx
routes/
AppRoutes.jsx
ProtectedRoute.jsx
RoleRoute.jsx

2.3 Backend: server/ Directory
server/
package.json
.env
app.js
server.js
config/
db.js
jwt.js
cors.js
socket.js
multer.js
email.js
middleware/
auth.middleware.js
role.middleware.js
validate.middleware.js
error.middleware.js
logger.middleware.js
upload.middleware.js
models/
index.js
User.model.js
Patient.model.js
Appointment.model.js
Prescription.model.js
PrescriptionItem.model.js
Medicine.model.js
Dispensing.model.js
NursingTask.model.js
LabOrder.model.js
LabResult.model.js
RadiologyOrder.model.js
RadiologyReport.model.js
Invoice.model.js
InvoiceItem.model.js
Payment.model.js
BloodInventory.model.js
BloodDonor.model.js
BloodRequest.model.js
Ambulance.model.js
AmbulanceTrip.model.js
Bed.model.js
BedAllocation.model.js
Ward.model.js
InsuranceClaim.model.js
InsuranceProvider.model.js
Notification.model.js
AuditLog.model.js
Department.model.js
Vitals.model.js
PatientJourney.model.js
routes/
index.js
auth.routes.js
patient.routes.js
appointment.routes.js
prescription.routes.js
pharmacy.routes.js
nursing.routes.js
lab.routes.js
radiology.routes.js
billing.routes.js
bloodbank.routes.js
ambulance.routes.js
icu.routes.js
insurance.routes.js
staff.routes.js
dashboard.routes.js
notification.routes.js
admin.routes.js
controllers/
auth.controller.js
patient.controller.js
appointment.controller.js
prescription.controller.js
pharmacy.controller.js
nursing.controller.js
lab.controller.js
radiology.controller.js
billing.controller.js
bloodbank.controller.js
ambulance.controller.js
icu.controller.js
insurance.controller.js
staff.controller.js
dashboard.controller.js
notification.controller.js
admin.controller.js
services/
auth.service.js
patient.service.js
prescription.routing.service.js
notification.service.js
billing.service.js
journey.service.js
pdf.service.js
email.service.js
validators/
auth.validator.js
patient.validator.js
appointment.validator.js
prescription.validator.js
billing.validator.js
utils/
constants.js
helpers.js
tokenGenerator.js
errorHandler.js
seeders/
seed.js
departments.seed.js
users.seed.js
medicines.seed.js
wards.seed.js
beds.seed.js
bloodInventory.seed.js
ambulances.seed.js
insuranceProviders.seed.js

2.4 Database: database/ Directory
database/
schema.sql
seed-data.sql
migrations/
001_create_departments.sql
002_create_users.sql
003_create_patients.sql
004_create_appointments.sql
005_create_prescriptions.sql
006_create_pharmacy.sql
007_create_nursing.sql
008_create_lab.sql
009_create_radiology.sql
010_create_billing.sql
011_create_bloodbank.sql
012_create_ambulance.sql
013_create_beds_wards.sql
014_create_insurance.sql
015_create_notifications.sql
016_create_audit_log.sql
017_create_vitals.sql
018_create_patient_journey.sql

3. Complete MySQL Database Schema
All tables use InnoDB engine, UTF8MB4 charset, with proper foreign keys and indexes.

3.1 departments

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Department ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | e.g. General Medicine, Cardiology |
| code | VARCHAR(20) | NOT NULL, UNIQUE | Short code e.g. GEN, CARD |
| description | TEXT | NULL | Department description |
| head_doctor_id | INT | FK -> users.id, NULL | Head of department |
| floor | VARCHAR(20) | NULL | Floor/Building location |
| phone_ext | VARCHAR(10) | NULL | Internal phone extension |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last update |

3.2 users (Staff/Login)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | User ID |
| employee_id | VARCHAR(20) | NOT NULL, UNIQUE | e.g. EMP001 |
| name | VARCHAR(150) | NOT NULL | Full name |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| phone | VARCHAR(15) | NOT NULL | Mobile number |
| role | ENUM(...) | NOT NULL | admin,receptionist,doctor,nurse,pharmacist,lab_tech,radiologist,billing,blood_bank,icu_manager,ambulance,insurance |
| department_id | INT | FK -> departments.id | Assigned department |
| specialization | VARCHAR(100) | NULL | Doctor specialization |
| qualification | VARCHAR(200) | NULL | Degrees e.g. MBBS, MD |
| license_no | VARCHAR(50) | NULL | Medical license number |
| avatar_url | VARCHAR(500) | NULL | Profile photo URL |
| is_available | BOOLEAN | DEFAULT TRUE | On-duty status |
| is_active | BOOLEAN | DEFAULT TRUE | Account active |
| last_login | TIMESTAMP | NULL | Last login time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |  |

3.3 patients

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Patient ID |
| patient_uid | VARCHAR(20) | NOT NULL, UNIQUE | Display ID e.g. MF-2026-0001 |
| name | VARCHAR(150) | NOT NULL | Full name |
| date_of_birth | DATE | NULL | DOB |
| age | INT | NOT NULL | Age in years |
| gender | ENUM('Male','Female','Other') | NOT NULL | Gender |
| phone | VARCHAR(15) | NOT NULL | Primary phone |
| alt_phone | VARCHAR(15) | NULL | Alternative phone |
| email | VARCHAR(150) | NULL | Email address |
| address | TEXT | NULL | Full address |
| city | VARCHAR(100) | NULL | City |
| state | VARCHAR(100) | NULL | State |
| pincode | VARCHAR(10) | NULL | PIN code |
| blood_group | ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') | NULL | Blood group |
| aadhar_no | VARCHAR(12) | NULL, UNIQUE | Aadhar number |
| emergency_contact_name | VARCHAR(150) | NULL | Emergency contact |
| emergency_contact_phone | VARCHAR(15) | NULL | Emergency phone |
| insurance_provider_id | INT | FK -> insurance_providers.id, NULL | Insurance provider |
| insurance_policy_no | VARCHAR(50) | NULL | Policy number |
| allergies | TEXT | NULL | Known allergies |
| chronic_conditions | TEXT | NULL | Chronic conditions |
| current_stage | ENUM(...) | DEFAULT 'reception' | reception,triage,consultation,pharmacy,nursing,lab,radiology,billing,discharged,admitted |
| is_admitted | BOOLEAN | DEFAULT FALSE | Inpatient flag |
| registered_by | INT | FK -> users.id | Receptionist who registered |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |  |

3.4 appointments

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT | Appointment ID |
| patient_id | INT | FK -> patients.id, NOT NULL | Patient |
| doctor_id | INT | FK -> users.id, NOT NULL | Assigned doctor |
| department_id | INT | FK -> departments.id | Department |
| appointment_date | DATE | NOT NULL | Date |
| appointment_time | TIME | NOT NULL | Time slot |
| token_no | INT | NOT NULL | Queue token number |
| type | ENUM('walk-in','scheduled','emergency','follow-up') | DEFAULT 'walk-in' | Visit type |
| status | ENUM('waiting','in-progress','completed','cancelled','no-show') | DEFAULT 'waiting' | Status |
| chief_complaint | TEXT | NULL | Reason for visit |
| priority | ENUM('normal','urgent','emergency') | DEFAULT 'normal' | Priority level |
| notes | TEXT | NULL | Additional notes |
| checked_in_at | TIMESTAMP | NULL | Check-in time |
| consultation_start | TIMESTAMP | NULL | Consult start |
| consultation_end | TIMESTAMP | NULL | Consult end |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.5 vitals

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| patient_id | INT | FK -> patients.id | Patient |
| appointment_id | INT | FK -> appointments.id, NULL | Related appointment |
| recorded_by | INT | FK -> users.id | Nurse/staff who recorded |
| blood_pressure_sys | INT | NULL | Systolic BP |
| blood_pressure_dia | INT | NULL | Diastolic BP |
| temperature | DECIMAL(4,1) | NULL | Body temp (F) |
| pulse_rate | INT | NULL | Pulse BPM |
| spo2 | INT | NULL | Oxygen saturation % |
| respiratory_rate | INT | NULL | Breaths per minute |
| weight_kg | DECIMAL(5,1) | NULL | Weight in KG |
| height_cm | DECIMAL(5,1) | NULL | Height in CM |
| blood_sugar | INT | NULL | Blood sugar mg/dL |
| notes | TEXT | NULL | Additional observations |
| recorded_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.6 prescriptions

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| patient_id | INT | FK -> patients.id | Patient |
| doctor_id | INT | FK -> users.id | Prescribing doctor |
| appointment_id | INT | FK -> appointments.id | Related appointment |
| diagnosis | TEXT | NULL | Diagnosis text |
| clinical_notes | TEXT | NULL | Doctor notes |
| follow_up_date | DATE | NULL | Next visit date |
| status | ENUM('draft','active','completed','cancelled') | DEFAULT 'active' |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.7 prescription_items

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| prescription_id | INT | FK -> prescriptions.id | Parent prescription |
| type | ENUM('medicine','injection','lab_test','xray','imaging','procedure') | NOT NULL | Item type - determines routing |
| item_name | VARCHAR(200) | NOT NULL | Medicine/test/scan name |
| dosage | VARCHAR(100) | NULL | e.g. 500mg, 1g |
| frequency | VARCHAR(100) | NULL | e.g. 1-0-1, BD, TDS |
| duration | VARCHAR(100) | NULL | e.g. 5 days, 1 week |
| route | VARCHAR(50) | NULL | Oral, IV, IM, Topical |
| instructions | TEXT | NULL | Special instructions |
| quantity | INT | DEFAULT 1 | Quantity |
| is_urgent | BOOLEAN | DEFAULT FALSE | Priority flag |
| routed_to | ENUM('pharmacy','nursing','lab','radiology') | NOT NULL | Auto-determined destination |
| status | ENUM('pending','processing','completed','cancelled') | DEFAULT 'pending' |  |
| completed_by | INT | FK -> users.id, NULL | Staff who completed |
| completed_at | TIMESTAMP | NULL | Completion time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.8 medicines (Pharmacy Inventory)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| name | VARCHAR(200) | NOT NULL | Medicine name |
| generic_name | VARCHAR(200) | NULL | Generic compound name |
| category | VARCHAR(100) | NULL | e.g. Antibiotic, Analgesic |
| manufacturer | VARCHAR(200) | NULL | Manufacturer |
| batch_no | VARCHAR(50) | NULL | Batch number |
| expiry_date | DATE | NULL | Expiry date |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| stock_quantity | INT | DEFAULT 0 | Current stock |
| reorder_level | INT | DEFAULT 10 | Minimum stock alert |
| storage_location | VARCHAR(100) | NULL | Shelf/rack location |
| requires_prescription | BOOLEAN | DEFAULT TRUE |  |
| is_active | BOOLEAN | DEFAULT TRUE |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.9 dispensings (Pharmacy Dispensing)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| prescription_item_id | INT | FK -> prescription_items.id | Linked prescription item |
| medicine_id | INT | FK -> medicines.id | Dispensed medicine |
| patient_id | INT | FK -> patients.id | Patient |
| dispensed_by | INT | FK -> users.id | Pharmacist |
| quantity_dispensed | INT | NOT NULL | Quantity given |
| unit_price | DECIMAL(10,2) | NOT NULL | Price charged |
| total_price | DECIMAL(10,2) | NOT NULL | Quantity x Price |
| status | ENUM('dispensed','returned','partial') | DEFAULT 'dispensed' |  |
| dispensed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.10 nursing_tasks

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| prescription_item_id | INT | FK -> prescription_items.id | Linked item |
| patient_id | INT | FK -> patients.id | Patient |
| assigned_nurse_id | INT | FK -> users.id, NULL | Assigned nurse |
| task_type | ENUM('injection','iv_drip','dressing','vitals','observation') | NOT NULL | Task type |
| task_name | VARCHAR(200) | NOT NULL | Description |
| instructions | TEXT | NULL | Special instructions |
| priority | ENUM('normal','urgent','critical') | DEFAULT 'normal' |  |
| status | ENUM('pending','in-progress','completed','cancelled') | DEFAULT 'pending' |  |
| notes | TEXT | NULL | Nurse notes |
| completed_at | TIMESTAMP | NULL |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.11 lab_orders

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| prescription_item_id | INT | FK -> prescription_items.id |  |
| patient_id | INT | FK -> patients.id |  |
| ordered_by | INT | FK -> users.id | Doctor |
| test_name | VARCHAR(200) | NOT NULL | Test name |
| test_category | VARCHAR(100) | NULL | e.g. Hematology, Biochemistry |
| sample_type | VARCHAR(50) | NULL | Blood, Urine, Stool etc. |
| sample_collected | BOOLEAN | DEFAULT FALSE |  |
| sample_collected_by | INT | FK -> users.id, NULL |  |
| sample_collected_at | TIMESTAMP | NULL |  |
| priority | ENUM('normal','urgent','critical') | DEFAULT 'normal' |  |
| status | ENUM('ordered','sample_collected','processing','completed','cancelled') | DEFAULT 'ordered' |  |
| unit_price | DECIMAL(10,2) | DEFAULT 0 | Test cost |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.12 lab_results

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| lab_order_id | INT | FK -> lab_orders.id |  |
| parameter_name | VARCHAR(100) | NOT NULL | e.g. Hemoglobin, WBC |
| result_value | VARCHAR(100) | NOT NULL | Actual result |
| normal_range | VARCHAR(100) | NULL | Reference range |
| unit | VARCHAR(50) | NULL | mg/dL, cells/mcL etc. |
| is_abnormal | BOOLEAN | DEFAULT FALSE | Flag if out of range |
| entered_by | INT | FK -> users.id | Lab tech |
| entered_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.13 radiology_orders

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| prescription_item_id | INT | FK -> prescription_items.id |  |
| patient_id | INT | FK -> patients.id |  |
| ordered_by | INT | FK -> users.id | Doctor |
| scan_type | VARCHAR(100) | NOT NULL | X-Ray, CT, MRI, USG |
| body_part | VARCHAR(100) | NOT NULL | Chest, Knee, Brain etc. |
| clinical_indication | TEXT | NULL | Reason for scan |
| priority | ENUM('normal','urgent','critical') | DEFAULT 'normal' |  |
| status | ENUM('ordered','scheduled','in-progress','completed','cancelled') | DEFAULT 'ordered' |  |
| report_text | TEXT | NULL | Radiologist report |
| report_file_url | VARCHAR(500) | NULL | DICOM/image file |
| reported_by | INT | FK -> users.id, NULL | Radiologist |
| completed_at | TIMESTAMP | NULL |  |
| unit_price | DECIMAL(10,2) | DEFAULT 0 |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.14 invoices

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| invoice_no | VARCHAR(20) | NOT NULL, UNIQUE | e.g. INV-2026-0001 |
| patient_id | INT | FK -> patients.id |  |
| appointment_id | INT | FK -> appointments.id, NULL |  |
| consultation_fee | DECIMAL(10,2) | DEFAULT 0 | Doctor fee |
| medicine_total | DECIMAL(10,2) | DEFAULT 0 | Pharmacy total |
| lab_total | DECIMAL(10,2) | DEFAULT 0 | Lab charges |
| radiology_total | DECIMAL(10,2) | DEFAULT 0 | Imaging charges |
| nursing_total | DECIMAL(10,2) | DEFAULT 0 | Nursing charges |
| bed_charges | DECIMAL(10,2) | DEFAULT 0 | Room/bed charges |
| other_charges | DECIMAL(10,2) | DEFAULT 0 | Miscellaneous |
| subtotal | DECIMAL(10,2) | NOT NULL | Before discount |
| discount | DECIMAL(10,2) | DEFAULT 0 | Discount amount |
| tax | DECIMAL(10,2) | DEFAULT 0 | GST |
| grand_total | DECIMAL(10,2) | NOT NULL | Final amount |
| insurance_amount | DECIMAL(10,2) | DEFAULT 0 | Insurance covers |
| patient_payable | DECIMAL(10,2) | NOT NULL | Patient pays |
| status | ENUM('draft','pending','paid','partial','cancelled') | DEFAULT 'pending' |  |
| generated_by | INT | FK -> users.id | Billing staff |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.15 payments

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| invoice_id | INT | FK -> invoices.id |  |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| payment_method | ENUM('cash','card','upi','netbanking','insurance','wallet') | NOT NULL | Method |
| transaction_ref | VARCHAR(100) | NULL | UPI/Card reference |
| received_by | INT | FK -> users.id |  |
| paid_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.16 blood_inventory

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| blood_group | ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') | NOT NULL |  |
| component | ENUM('whole_blood','packed_rbc','plasma','platelets') | NOT NULL |  |
| units_available | INT | NOT NULL | Current stock |
| collection_date | DATE | NULL |  |
| expiry_date | DATE | NULL |  |
| donor_id | INT | FK -> blood_donors.id, NULL |  |
| status | ENUM('available','reserved','expired','used') | DEFAULT 'available' |  |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |  |

3.17 ambulances

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| vehicle_no | VARCHAR(20) | NOT NULL, UNIQUE | e.g. AP-07-AMB-001 |
| type | ENUM('basic','advanced','icu_mobile') | DEFAULT 'basic' |  |
| driver_name | VARCHAR(100) | NOT NULL |  |
| driver_phone | VARCHAR(15) | NOT NULL |  |
| status | ENUM('available','on_trip','maintenance','offline') | DEFAULT 'available' |  |
| current_location | VARCHAR(200) | NULL |  |
| gps_lat | DECIMAL(10,7) | NULL | GPS latitude |
| gps_lng | DECIMAL(10,7) | NULL | GPS longitude |
| is_active | BOOLEAN | DEFAULT TRUE |  |

3.18 beds & wards

| Column | Type | Constraints | Description |
|---|---|---|---|
| wards.id | INT | PK |  |
| wards.name | VARCHAR(100) | NOT NULL | e.g. General Ward, ICU |
| wards.type | ENUM('general','semi_private','private','icu','nicu','picu') | NOT NULL |  |
| wards.floor | VARCHAR(20) | NULL | Floor number |
| wards.total_beds | INT | NOT NULL |  |
| wards.charge_per_day | DECIMAL(10,2) | NOT NULL | Daily rate |
| beds.id | INT | PK |  |
| beds.ward_id | INT | FK -> wards.id |  |
| beds.bed_number | VARCHAR(20) | NOT NULL | e.g. ICU-01, GW-A-12 |
| beds.has_ventilator | BOOLEAN | DEFAULT FALSE |  |
| beds.has_monitor | BOOLEAN | DEFAULT FALSE |  |
| beds.status | ENUM('available','occupied','maintenance','reserved') | DEFAULT 'available' |  |

3.19 insurance_claims

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| patient_id | INT | FK -> patients.id |  |
| invoice_id | INT | FK -> invoices.id, NULL |  |
| insurance_provider_id | INT | FK -> insurance_providers.id |  |
| policy_no | VARCHAR(50) | NOT NULL |  |
| claim_amount | DECIMAL(10,2) | NOT NULL |  |
| approved_amount | DECIMAL(10,2) | NULL |  |
| status | ENUM('submitted','under_review','approved','rejected','settled') | DEFAULT 'submitted' |  |
| tpa_reference | VARCHAR(100) | NULL | TPA tracking number |
| remarks | TEXT | NULL |  |
| submitted_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
| resolved_at | TIMESTAMP | NULL |  |

3.20 patient_journey (Activity Log)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| patient_id | INT | FK -> patients.id |  |
| appointment_id | INT | FK -> appointments.id, NULL |  |
| stage | ENUM('reception','triage','consultation','pharmacy','nursing','lab','radiology','billing','discharged','admitted') | NOT NULL |  |
| department_id | INT | FK -> departments.id, NULL |  |
| handled_by | INT | FK -> users.id, NULL | Staff member |
| action | VARCHAR(200) | NOT NULL | e.g. Patient registered, Prescription created |
| notes | TEXT | NULL |  |
| entered_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.21 notifications

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| user_id | INT | FK -> users.id, NULL | Target user (NULL for broadcast) |
| target_role | VARCHAR(30) | NULL | Target role (e.g. pharmacist) |
| title | VARCHAR(200) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Detail text |
| type | ENUM('info','warning','urgent','success') | DEFAULT 'info' |  |
| reference_type | VARCHAR(50) | NULL | e.g. prescription, lab_order |
| reference_id | INT | NULL | FK to referenced record |
| is_read | BOOLEAN | DEFAULT FALSE |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

3.22 audit_log

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| user_id | INT | FK -> users.id | Who performed action |
| action | VARCHAR(100) | NOT NULL | e.g. CREATE, UPDATE, DELETE |
| entity_type | VARCHAR(50) | NOT NULL | e.g. patient, prescription |
| entity_id | INT | NOT NULL | Record ID |
| old_values | JSON | NULL | Previous state |
| new_values | JSON | NULL | New state |
| ip_address | VARCHAR(45) | NULL |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
|  | 4. Complete API Endpoints | All endpoints are prefixed with /api/v1. Authentication required unless marked (Public). |  |
4.1 Authentication — /api/v1/auth
Method
Endpoint
Description
Request Body / Params
POST
/login
Staff login (Public)
{ email, password } -> { token, user }
POST
/logout
Invalidate token
Header: Authorization
GET
/me
Get current user profile
-> { user }
PUT
/change-password
Change password
{ oldPassword, newPassword }
POST
/forgot-password
Send reset email (Public)
{ email }
POST
/reset-password
Reset with token (Public)
{ token, newPassword }

4.2 Patients — /api/v1/patients
Method
Endpoint
Description
Details
GET
/
List patients (paginated, filterable)
?page=1&limit=20&stage=reception&search=name
GET
/:id
Get patient full details
Includes vitals, history, prescriptions
POST
/
Register new patient
{ name, age, gender, phone, ... }
PUT
/:id
Update patient info
{ name, phone, address, ... }
GET
/:id/journey
Get patient journey timeline
Array of stage transitions
PUT
/:id/stage
Update patient stage
{ stage } -> triggers notifications
GET
/:id/vitals
Get vitals history
All recorded vitals
POST
/:id/vitals
Record new vitals
{ bp_sys, bp_dia, temp, pulse, spo2 }
GET
/:id/prescriptions
Patient prescriptions
All prescriptions with items
GET
/:id/invoices
Patient billing history
All invoices and payments
GET
/search
Search patients
?q=name/phone/uid
GET
/today
Today's patients
All patients registered today

4.3 Appointments — /api/v1/appointments
Method
Endpoint
Description
Details
GET
/
List appointments
?date=2026-03-12&doctor_id=1&status=waiting
POST
/
Book appointment
{ patient_id, doctor_id, date, time, type }
PUT
/:id
Update appointment
{ status, notes }
PUT
/:id/checkin
Patient check-in
Sets checked_in_at timestamp
PUT
/:id/start
Start consultation
Sets consultation_start
PUT
/:id/complete
End consultation
Sets consultation_end
GET
/slots
Available slots
?doctor_id=1&date=2026-03-12
GET
/queue
Current queue
?department_id=1 -> ordered by token
GET
/today/doctor/:id
Doctor's today list


4.4 Prescriptions — /api/v1/prescriptions
Method
Endpoint
Description
Details
GET
/
List prescriptions
?patient_id=1&doctor_id=1&date=today
GET
/:id
Get prescription with all items
Full details
POST
/
Create prescription (CORE)
{ patient_id, diagnosis, items[] } -> AUTO-ROUTES items to departments
PUT
/:id
Update prescription
{ diagnosis, notes }
PUT
/items/:id/complete
Mark item completed
Pharmacist/Nurse/Lab marks done
GET
/items/pending
Pending items by type
?routed_to=pharmacy&status=pending
CRITICAL — Auto-Routing Logic (prescription.routing.service.js): When a prescription is created, each item's 'type' determines its 'routed_to' destination. type='medicine' routes to 'pharmacy'. type='injection' routes to 'nursing'. type='lab_test' routes to 'lab'. type='xray' or type='imaging' routes to 'radiology'. A notification is sent to each target department via Socket.io.

4.5 Pharmacy — /api/v1/pharmacy
Method
Endpoint
Description
Details
GET
/queue
Pending dispense queue
Items routed_to='pharmacy' & status='pending'
POST
/dispense
Dispense medicines
{ prescription_item_id, medicine_id, qty }
GET
/medicines
Medicine inventory
?search=para&category=analgesic
POST
/medicines
Add new medicine
{ name, generic_name, unit_price, stock }
PUT
/medicines/:id
Update medicine stock
{ stock_quantity, unit_price }
GET
/medicines/low-stock
Low stock alerts
Where stock < reorder_level

4.6 Nursing — /api/v1/nursing
Method
Endpoint
Description
Details
GET
/tasks
Pending nursing tasks
Items routed_to='nursing' & pending
PUT
/tasks/:id/start
Start task
{ assigned_nurse_id }
PUT
/tasks/:id/complete
Complete task
{ notes }
POST
/vitals
Record patient vitals
{ patient_id, bp, temp, pulse, spo2 }

4.7 Laboratory — /api/v1/lab
Method
Endpoint
Description
Details
GET
/orders
Pending lab orders
?status=ordered
PUT
/orders/:id/collect
Mark sample collected
{ collected_by }
PUT
/orders/:id/process
Start processing

POST
/orders/:id/results
Enter results
{ results: [{ parameter, value, range, unit }] }
PUT
/orders/:id/complete
Finalize report

GET
/orders/:id/report
Get lab report
Full results

4.8 Radiology — /api/v1/radiology
Method
Endpoint
Description
Details
GET
/orders
Pending imaging orders
?status=ordered
PUT
/orders/:id/schedule
Schedule scan
{ scheduled_time }
PUT
/orders/:id/start
Start scan

POST
/orders/:id/report
Upload report
{ report_text, report_file }
PUT
/orders/:id/complete
Finalize


4.9 Billing — /api/v1/billing
Method
Endpoint
Description
Details
GET
/invoices
List invoices
?status=pending&patient_id=1
POST
/invoices/generate
Auto-generate invoice
{ patient_id, appointment_id } -> calculates all charges
GET
/invoices/:id
Get invoice detail
With all line items
POST
/invoices/:id/pay
Record payment
{ amount, payment_method, transaction_ref }
GET
/invoices/:id/pdf
Download PDF invoice
Returns PDF buffer
PUT
/invoices/:id/discount
Apply discount
{ amount, reason }
GET
/revenue/today
Today revenue summary

GET
/revenue/report
Revenue report
?from=date&to=date

4.10 Blood Bank — /api/v1/bloodbank
Method
Endpoint
Description
Details
GET
/inventory
Current stock by blood group

PUT
/inventory/:id
Update units
{ units_available }
POST
/donors
Register donor
{ name, blood_group, phone }
GET
/donors
List donors

POST
/requests
Blood request
{ patient_id, blood_group, units }
PUT
/requests/:id/fulfill
Fulfill request
Deducts from inventory

4.11 Ambulance — /api/v1/ambulance
Method
Endpoint
Description
Details
GET
/fleet
All ambulances
With current status
POST
/dispatch
Dispatch ambulance
{ ambulance_id, pickup_location, patient_info }
PUT
/:id/status
Update status
{ status, location }
GET
/trips
Trip history

PUT
/trips/:id/complete
Complete trip
{ drop_location }

4.12 ICU/Wards — /api/v1/icu
Method
Endpoint
Description
Details
GET
/wards
List all wards
With bed counts
GET
/beds
All beds with status
?ward_id=1&status=available
POST
/beds/allocate
Assign bed to patient
{ bed_id, patient_id }
PUT
/beds/:id/release
Release bed
Sets status to available
PUT
/beds/:id/maintenance
Mark maintenance

GET
/beds/available
Available beds summary
Grouped by ward type

4.13 Insurance — /api/v1/insurance
Method
Endpoint
Description
Details
GET
/claims
List claims
?status=submitted
POST
/claims
Submit new claim
{ patient_id, policy_no, claim_amount }
PUT
/claims/:id/review
Update claim status
{ status, approved_amount, remarks }
GET
/providers
Insurance providers list

POST
/providers
Add provider
{ name, contact, email }
POST
/pre-auth
Pre-authorization request
{ patient_id, procedure, estimated_cost }

4.14 Dashboard & Reports — /api/v1/dashboard
Method
Endpoint
Description
Details
GET
/stats
Overview statistics
Patient count, revenue, bed occupancy
GET
/patient-flow
Patient stage distribution
Count per stage
GET
/department-load
Department workload
Pending tasks per department
GET
/revenue/chart
Revenue chart data
?period=daily|weekly|monthly
GET
/bed-occupancy
Bed occupancy rates
By ward type
GET
/staff-activity
Staff activity summary
Actions per staff member

4.15 Notifications — /api/v1/notifications
Method
Endpoint
Description
Details
GET
/
My notifications
Filtered by current user role
PUT
/:id/read
Mark as read

PUT
/read-all
Mark all as read

DELETE
/:id
Delete notification

GET
/unread-count
Unread count
For badge display

4.16 Admin — /api/v1/admin
Method
Endpoint
Description
Details
GET
/users
List all staff

POST
/users
Create staff account
{ name, email, role, department_id }
PUT
/users/:id
Update staff

DELETE
/users/:id
Deactivate staff
Soft delete
GET
/audit-log
Audit trail
?entity_type=patient&user_id=1
GET
/departments
Manage departments

POST
/departments
Create department


5. UI/UX Design System
The design must be light-themed, clean, playful, mobile-first, and easy to understand. NO dark/black backgrounds.

5.1 Color Palette
Token
Hex Code
Usage
Primary
#1A73E8 (Blue)
Buttons, links, active states, headers
Primary Light
#E8F0FE
Hover backgrounds, selected rows
Secondary
#5F6368
Secondary text, icons
Success
#0D8050 (Green)
Completed, available, success badges
Warning
#E65100 (Orange)
Urgent, pending, warnings
Danger
#D32F2F (Red)
Critical, errors, delete, occupied
Info
#0277BD (Cyan)
Info badges, notifications
Background
#F8FAFB
Page background (light gray-white)
Surface
#FFFFFF
Cards, modals, panels
Surface Alt
#F1F3F4
Table headers, sidebar background
Border
#DADCE0
Borders, dividers
Text Primary
#202124
Headings, primary text
Text Secondary
#5F6368
Labels, descriptions
Text Muted
#9AA0A6
Placeholders, timestamps

5.2 Typography
•	Font Family: 'Inter' for body, 'Plus Jakarta Sans' for headings
•	Headings: 28px/700 (H1), 22px/700 (H2), 18px/600 (H3), 15px/600 (H4)
•	Body: 14px/400 regular, 14px/500 medium, 14px/600 semibold
•	Small: 12px for timestamps, badges, labels
•	Monospace: 'JetBrains Mono' for IDs, codes, numeric data

5.3 Component Styling Rules
•	Cards: White background, 1px border #DADCE0, border-radius 12px, shadow-sm on hover, padding 20px
•	Buttons: Height 40px, border-radius 8px, font-weight 600, transition 150ms. Primary: blue bg. Ghost: transparent + border
•	Inputs: Height 40px, border 1px #DADCE0, border-radius 8px, focus: ring-2 ring-blue-200 border-blue-500
•	Tables: Striped rows (alternate #F8FAFB), sticky header, hover highlight #E8F0FE, rounded corners
•	Modals: Centered, max-width 560px, backdrop blur, slide-up animation
•	Badges: Rounded-full, padding 4px 12px, colored bg at 10% opacity + colored text
•	Sidebar: Width 260px, light gray bg (#F8FAFB), collapsible, active item: blue bg + blue text
•	Toast Notifications: Top-right, slide-in, auto-dismiss 4s, colored left border

5.4 Patient Journey Tracker Component
This is the HERO component of the system. It shows a horizontal pipeline of nodes representing each stage in the patient lifecycle. Each node shows an icon, label, and timestamp. Completed nodes are green with a checkmark. The current node pulses with orange/amber animation. Future nodes are gray/dimmed. Connecting lines between nodes change from green (done) to gray (pending). This component appears on the Admin dashboard for ALL patients and on individual patient detail views.

5.5 Responsive Breakpoints
•	Mobile: < 640px — single column, bottom tab navigation, collapsed sidebar
•	Tablet: 640px-1024px — 2 columns, sidebar overlay with hamburger
•	Desktop: > 1024px — full sidebar + content, 3-4 column grids

5.6 Page Layout Structure
Every page follows this layout: Sidebar (left, fixed) + Main Area. Main Area = Topbar (sticky, has search + notifications + user avatar) + Page Content. Page Content = Stats Row (top metric cards) + Main Content (tables, forms, queues). Mobile: sidebar becomes slide-out overlay, topbar shows hamburger icon.

6. Core Business Logic & Workflows

6.1 Complete Patient Flow (End-to-End)
•	RECEPTION: Receptionist registers patient with demographics and creates appointment with token number.
•	TRIAGE: Nurse records vitals (BP, temperature, pulse, SpO2, weight). Patient stage updates to 'triage'.
•	CONSULTATION: Doctor sees patient, records diagnosis, writes prescription with items. Each prescription item has a 'type' field.
•	AUTO-ROUTING: The system reads each prescription item type and automatically creates tasks in the correct department: medicines -> pharmacy queue, injections -> nursing queue, lab_test -> lab queue, xray/imaging -> radiology queue.
•	PHARMACY: Pharmacist sees medicine orders in queue, dispenses medicines, deducts inventory, marks completed.
•	NURSING: Nurse sees injection tasks, administers injections/IV, records notes, marks completed.
•	LABORATORY: Lab tech sees test orders, collects sample, processes test, enters results, marks completed.
•	RADIOLOGY: Radiologist sees imaging orders, performs scan, uploads report, marks completed.
•	BILLING: System auto-generates invoice aggregating all charges (consultation fee + medicine costs + lab costs + radiology costs + nursing charges + bed charges). Billing staff collects payment.
•	DISCHARGE: After payment, patient is discharged. Journey is complete. All records preserved.

6.2 Prescription Auto-Routing Service (MOST IMPORTANT)
File: server/services/prescription.routing.service.js
This is the heart of the system. When a doctor creates a prescription via POST /api/v1/prescriptions, the routing service processes each item:
async function routePrescriptionItems(prescriptionId, items) {
for (const item of items) {
let routed_to;
switch (item.type) {
case 'medicine':    routed_to = 'pharmacy';   break;
case 'injection':   routed_to = 'nursing';    break;
case 'lab_test':    routed_to = 'lab';        break;
case 'xray':
case 'imaging':     routed_to = 'radiology';  break;
case 'procedure':   routed_to = 'nursing';    break;
}
// Create PrescriptionItem with routed_to
// Create corresponding order (lab_order, radiology_order, etc.)
// Send Socket.io notification to target department
// Update patient stage if needed
}
}

6.3 Real-Time Notifications (Socket.io)
File: server/config/socket.js
Socket.io channels are organized by role. When a prescription is routed, the server emits to the target role channel. Each department dashboard listens on its role channel and auto-refreshes the queue.
•	Channel: 'role:pharmacist' -> Pharmacy queue updates
•	Channel: 'role:nurse' -> Nursing task updates
•	Channel: 'role:lab_tech' -> Lab order updates
•	Channel: 'role:radiologist' -> Radiology order updates
•	Channel: 'role:billing' -> Billing alerts
•	Channel: 'role:admin' -> All system events
•	Channel: 'patient:{id}' -> Patient-specific journey updates

6.4 Invoice Auto-Generation
File: server/services/billing.service.js
When billing staff clicks 'Generate Invoice' for a patient, the service aggregates: consultation fee from appointments table, medicine costs from dispensings table, lab costs from lab_orders, radiology costs from radiology_orders, bed charges from bed_allocations (days x daily rate), and any additional nursing charges. GST is calculated at 5%. Insurance deduction applied if patient has active policy.

6.5 Token/Queue System
File: server/services/patient.service.js
Each department maintains a daily queue. When a patient is registered, they get a token number (auto-incremented per department per day). The reception screen shows a TokenDisplay component with current and next token numbers. The queue is ordered by priority first (emergency > urgent > normal) then by token number.

7. Seed Data Requirements
The seed script (server/seeders/seed.js) must populate the database with realistic demo data so the system is immediately usable after setup.

•	15 Departments: General Medicine, Cardiology, Orthopedics, Pediatrics, Neurology, Dermatology, ENT, Ophthalmology, Gynecology, Urology, Oncology, Psychiatry, Emergency, Dental, Pulmonology
•	20+ Staff members across all 12 roles with realistic Indian names
•	100+ Medicines with real names, categories, prices (Paracetamol, Amoxicillin, Metformin, Amlodipine, Ceftriaxone, etc.)
•	8 Wards: General Male, General Female, Private, Semi-Private, ICU, NICU, PICU, Maternity
•	50+ Beds spread across wards with varied statuses
•	Blood inventory for all 8 blood groups
•	3-5 Ambulances
•	5+ Insurance providers (Star Health, ICICI Lombard, Bajaj Allianz, New India Assurance, Max Bupa)
•	10-15 Sample patients at various stages of their journey to demonstrate the full flow
•	Default admin login: admin@mediflow.com / Admin@123

8. Setup & Run Instructions

8.1 Prerequisites
•	Node.js 18+ LTS
•	MySQL 8.x running locally or remote
•	npm or yarn package manager

8.2 Environment Variables
File: server/.env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mediflow_hms
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=mediflow_jwt_secret_key_2026
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

File: client/.env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MediFlow HMS

8.3 Install & Run Commands
# 1. Clone and setup
cd mediflow-hms

# 2. Setup backend
cd server
npm install
# Create MySQL database first:
#   CREATE DATABASE mediflow_hms;
npm run db:migrate    # Runs all migration SQL files
npm run db:seed       # Seeds demo data
npm run dev           # Starts server on port 5000

# 3. Setup frontend (new terminal)
cd client
npm install
npm run dev           # Starts Vite on port 5173

8.4 Package.json Scripts (Server)
"scripts": {
"dev": "nodemon server.js",
"start": "node server.js",
"db:migrate": "node scripts/migrate.js",
"db:seed": "node seeders/seed.js",
"db:reset": "node scripts/reset.js"
}

9. Instructions for Claude Code (AI Builder)
This section contains the exact prompt and instructions to give to Claude Code to build this entire application.

9.1 Master Build Prompt
Copy-paste the following prompt into Claude Code:

--- START PROMPT ---

Build a complete Hospital Management System called 'MediFlow HMS' with the following exact specifications. Create EVERY file listed below. Do NOT skip any file. Build the complete application end-to-end.

TECH STACK (MANDATORY):
•	Frontend: React 18 + Vite + Tailwind CSS 3 + React Router v6 + Zustand + Axios + Recharts + Lucide React + React Hook Form + Zod + React Hot Toast + Socket.io-client + date-fns
•	Backend: Node.js + Express + Sequelize ORM + MySQL2 + JWT (jsonwebtoken) + bcryptjs + Joi + Socket.io + Multer + PDFKit + Nodemailer + cors + dotenv + morgan + nodemon
•	Database: MySQL 8 with InnoDB engine

DESIGN REQUIREMENTS (MANDATORY):
•	LIGHT THEME ONLY. Background: #F8FAFB. Cards: white. NO dark/black backgrounds anywhere.
•	Primary color: #1A73E8 (Google Blue). Clean, playful, modern, professional.
•	Fonts: 'Inter' for body, 'Plus Jakarta Sans' for headings via Google Fonts CDN.
•	Border radius: 12px cards, 8px buttons/inputs. Subtle shadows.
•	Fully responsive: mobile-first. Sidebar collapses on mobile. Bottom nav on mobile.
•	Patient Journey Tracker: horizontal pipeline with colored nodes showing real-time patient stage.
•	Smooth animations: page transitions, modal slide-up, toast slide-in, hover effects.
•	Every table must be sortable, searchable, and paginated.
•	Every form must have validation with inline error messages.

CORE FEATURE — PRESCRIPTION AUTO-ROUTING:
When a doctor creates a prescription, each item MUST auto-route based on its type: 'medicine' items create pharmacy queue entries, 'injection' items create nursing tasks, 'lab_test' items create lab orders, 'xray'/'imaging' items create radiology orders. Each routing triggers a real-time Socket.io notification to the target department. The patient's current_stage updates accordingly.

BUILD ORDER:
•	First: Create the complete MySQL schema (all 22+ tables with foreign keys, indexes, enums)
•	Second: Create the Sequelize models with all associations
•	Third: Create the seed data (departments, staff, medicines, wards, beds, blood inventory, sample patients)
•	Fourth: Create the Express server with middleware (auth, role, validation, error handling, CORS, Socket.io)
•	Fifth: Create all routes, controllers, services, and validators
•	Sixth: Create the React frontend with layout (sidebar, topbar, routing)
•	Seventh: Create all 12 role-based dashboard pages with their sub-pages
•	Eighth: Create the reusable component library (Button, Input, Modal, DataTable, Badge, Card, etc.)
•	Ninth: Wire up all API calls, Zustand stores, and Socket.io listeners
•	Tenth: Test the complete patient flow from registration to discharge

--- END PROMPT ---

9.2 Important Notes for Claude Code
•	Create every single file listed in Section 2 of this document.
•	Follow the database schema EXACTLY as defined in Section 3.
•	Implement EVERY API endpoint listed in Section 4.
•	Use the color palette and design rules from Section 5.
•	The prescription routing service (Section 6.2) is the MOST CRITICAL business logic.
•	Seed data must make the application immediately demo-ready after setup.
•	Every page must handle loading states, empty states, and error states.
•	All sensitive data (passwords) must be hashed with bcrypt.
•	JWT tokens must include user role for role-based route protection.
•	All API responses must follow format: { success: true/false, data: {...}, message: '...' }

10. Complete File Index (Quick Reference)
Total files to create: ~150+ files across frontend, backend, and database.

10.1 Frontend Files (75+ files)
src/api/ — 16 API service files (one per module)
src/store/ — 4 Zustand store files
src/hooks/ — 4 custom React hooks
src/utils/ — 4 utility files
src/components/layout/ — 5 layout components
src/components/common/ — 18 reusable UI components
src/components/patient/ — 6 patient-specific components
src/components/prescription/ — 3 prescription components
src/components/charts/ — 4 chart components
src/pages/ — 40+ page components across 14 module folders
src/routes/ — 3 routing files

10.2 Backend Files (65+ files)
config/ — 6 configuration files
middleware/ — 6 middleware files
models/ — 26 Sequelize model files
routes/ — 17 route files
controllers/ — 17 controller files
services/ — 8 service files
validators/ — 5 validation files
utils/ — 4 utility files
seeders/ — 9 seed data files

10.3 Database Files (20 files)
schema.sql — Complete schema creation script
seed-data.sql — SQL seed data
migrations/ — 18 individual migration files


---

## Part 2: Analytics & Intelligence Engine Addendum


MEDIFLOW HMS
Analytics, Event Logging & Intelligence Engine
Addendum to Architecture Blueprint — PX-Style Analytics Module
Gainsight PX-Inspired: Adoption Explorer | Funnel Reports | Query Builder | KPI Dashboards | Audit Logging
Version 1.1 | March 2026

Table of Contents



11. Analytics & Intelligence Engine — Overview
This module adds a Gainsight PX-inspired analytics layer to MediFlow HMS. It provides deep insight into hospital operations, staff behavior, patient flow bottlenecks, and clinical efficiency. Every action inside the system is tracked, logged, and available for analysis.

11.1 Analytics Module Architecture
The analytics engine consists of 8 sub-modules that work together:

Module
Inspired By
Purpose
Primary Users
Event Tracking Engine
PX Event System
Captures every user action, click, page view, data change as structured events
System (auto)
KPI Dashboard
PX Dashboard
Real-time hospital performance metrics with customizable widgets
Admin, Department Heads
Patient Flow Funnel
PX Funnel Reports
Visualize patient drop-off and time spent at each stage
Admin, Operations
Feature Adoption Explorer
PX Adoption Explorer
Track which HMS features each staff member uses
Admin, HR, Training
Custom Query Builder
PX Audience Builder
Drag-and-drop visual query builder on any data entity
Admin, Analysts
Scheduled Reports
PX Report Scheduler
Auto-generate and email reports on schedule
Admin, Management
Audit Trail Viewer
PX Change Logs
Complete change history with old/new value diff for every record
Admin, Compliance
Role-Specific Insights
PX Health Scores
Tailored analytics per role solving their daily pain points
All Roles

11.2 New Folder Structure (Analytics Addition)
Add these files to the existing project structure:

11.2.1 Frontend — New Analytics Files
client/src/
components/
analytics/
EventTimeline.jsx            # Scrollable event feed with filters
KPIWidget.jsx                # Single KPI metric card with trend line
KPIDashboardGrid.jsx         # Draggable grid of KPI widgets
FunnelChart.jsx              # Patient flow funnel visualization
FunnelStageDetail.jsx        # Drill-down into a funnel stage
AdoptionHeatmap.jsx          # Feature usage heatmap by role/user
AdoptionTrendLine.jsx        # Feature adoption over time
AdoptionUserList.jsx         # Users ranked by feature usage
QueryBuilder.jsx             # Main drag-and-drop query builder
QueryFilterRow.jsx           # Single filter condition row
QueryFilterGroup.jsx         # AND/OR grouped conditions
QueryEntitySelector.jsx      # Select entity (patients, staff, etc.)
QueryColumnPicker.jsx        # Choose columns to display
QueryResultTable.jsx         # Results table with export
QuerySaveDialog.jsx          # Save/name custom queries
AuditDiffViewer.jsx          # Side-by-side old vs new value diff
AuditTimeline.jsx            # Chronological audit trail
AuditFilterBar.jsx           # Filter by user, entity, date range
ScheduledReportForm.jsx      # Create/edit scheduled report
ReportTemplateCard.jsx       # Preset report template selector
InsightCard.jsx              # Role-specific insight card
BottleneckAlert.jsx          # Alert for operational bottlenecks
WaitTimeTracker.jsx          # Real-time wait time by department
StaffPerformanceCard.jsx     # Staff performance metrics
PatientSatisfactionGauge.jsx # Satisfaction score gauge
charts/
HeatmapChart.jsx             # Generic heatmap (hour x day)
SankeyDiagram.jsx            # Patient flow sankey diagram
GaugeChart.jsx               # KPI gauge (speedometer style)
SparklineChart.jsx           # Inline mini trend charts
StackedBarChart.jsx          # Stacked comparison bars
TreemapChart.jsx             # Hierarchical treemap
WaterfallChart.jsx           # Revenue waterfall breakdown
RadarChart.jsx               # Multi-axis comparison radar
TimeSeriesChart.jsx          # Time-based line chart with zoom
DonutChart.jsx               # Donut/pie with center label
pages/
analytics/
AnalyticsHub.jsx             # Central analytics navigation page
KPIDashboardPage.jsx         # Customizable KPI dashboard
PatientFunnelPage.jsx        # Patient flow funnel analysis
AdoptionExplorerPage.jsx     # Feature adoption analysis
QueryBuilderPage.jsx         # Visual query builder
SavedQueriesPage.jsx         # List of saved custom queries
AuditLogPage.jsx             # Enhanced audit trail viewer
ScheduledReportsPage.jsx     # Manage scheduled reports
OperationalInsightsPage.jsx  # Real-time ops intelligence
StaffAnalyticsPage.jsx       # Staff performance analytics
RevenueAnalyticsPage.jsx     # Financial analytics
PatientAnalyticsPage.jsx     # Patient demographics & trends
DepartmentAnalyticsPage.jsx  # Per-department deep dive
WaitTimeAnalyticsPage.jsx    # Wait time analysis
PeakHoursPage.jsx            # Peak hours & load balancing
CustomReportPage.jsx         # Build custom reports
role-insights/
DoctorInsightsPage.jsx       # Doctor-specific analytics
NurseInsightsPage.jsx        # Nurse workload & efficiency
PharmacistInsightsPage.jsx   # Pharmacy analytics
ReceptionInsightsPage.jsx    # Reception efficiency
LabInsightsPage.jsx          # Lab turnaround analytics
BillingInsightsPage.jsx      # Revenue & collections
HRInsightsPage.jsx           # Staff attendance & productivity
store/
useAnalyticsStore.js           # Analytics state management
useQueryBuilderStore.js        # Query builder state
useEventStore.js               # Event stream state
api/
analytics.api.js               # Analytics API calls
events.api.js                  # Event tracking API calls
querybuilder.api.js            # Query builder API calls
reports.api.js                 # Reports API calls
hooks/
useEventTracker.js             # Auto-track user interactions
usePageTracker.js              # Track page views & time spent
useSessionTracker.js           # Track session duration

11.2.2 Backend — New Analytics Files
server/
models/
Event.model.js                 # User action events
Session.model.js               # User sessions
PageView.model.js              # Page view tracking
FeatureUsage.model.js          # Feature adoption tracking
SavedQuery.model.js            # Saved custom queries
ScheduledReport.model.js       # Report schedules
KPISnapshot.model.js           # Daily KPI snapshots for trends
WaitTimeLog.model.js           # Patient wait time records
StaffPerformance.model.js      # Aggregated staff metrics
BottleneckAlert.model.js       # System-detected bottlenecks
routes/
analytics.routes.js            # Analytics endpoints
events.routes.js               # Event ingestion & query
querybuilder.routes.js         # Query execution
reports.routes.js              # Report generation
controllers/
analytics.controller.js
events.controller.js
querybuilder.controller.js
reports.controller.js
services/
event.tracking.service.js      # Event capture & processing
analytics.aggregation.service.js  # KPI computation
funnel.service.js              # Funnel report logic
adoption.service.js            # Feature adoption computation
querybuilder.service.js        # Dynamic SQL query builder
report.generator.service.js    # PDF/Excel report generation
bottleneck.detector.service.js # Auto-detect operational bottlenecks
waittime.service.js            # Wait time calculation
scheduler.service.js           # Cron-based report scheduler
middleware/
eventCapture.middleware.js      # Auto-capture API events
sessionTracker.middleware.js    # Track user sessions

11.2.3 Database — New Migration Files
database/migrations/
019_create_events.sql
020_create_sessions.sql
021_create_page_views.sql
022_create_feature_usage.sql
023_create_saved_queries.sql
024_create_scheduled_reports.sql
025_create_kpi_snapshots.sql
026_create_wait_time_logs.sql
027_create_staff_performance.sql
028_create_bottleneck_alerts.sql

12. Event Tracking & Logging System
Every interaction inside MediFlow HMS is captured as a structured event. This is the foundation for all analytics. Inspired by Gainsight PX's event tracking model.

12.1 Event Categories
Category
Event Type
Example
Data Captured
User Action
CLICK
Staff clicks 'Dispense' button
user_id, element_id, page, component, timestamp
User Action
FORM_SUBMIT
Doctor submits prescription
user_id, form_name, fields_count, page
User Action
SEARCH
Receptionist searches patient
user_id, search_query, results_count, page
Navigation
PAGE_VIEW
Nurse opens Nursing Dashboard
user_id, page_path, referrer, time_on_page
Navigation
TAB_SWITCH
Admin switches to Billing tab
user_id, from_tab, to_tab, page
Data Change
RECORD_CREATE
New patient registered
user_id, entity_type, entity_id, new_values
Data Change
RECORD_UPDATE
Patient stage changed
user_id, entity_type, entity_id, old_values, new_values, changed_fields
Data Change
RECORD_DELETE
Appointment cancelled
user_id, entity_type, entity_id, deleted_values
Workflow
STAGE_TRANSITION
Patient moved reception->triage
patient_id, from_stage, to_stage, triggered_by
Workflow
PRESCRIPTION_ROUTED
Rx item routed to pharmacy
prescription_id, item_id, routed_to, item_type
Workflow
TASK_COMPLETED
Lab test result entered
task_type, task_id, completed_by, duration_mins
Workflow
INVOICE_GENERATED
Auto invoice created
invoice_id, patient_id, total_amount
System
LOGIN
User logged in
user_id, ip_address, device, browser
System
LOGOUT
User logged out
user_id, session_duration_mins
System
SESSION_START
New browser session
user_id, session_id, device_info
System
SESSION_END
Session timeout/close
user_id, session_id, duration, pages_visited
System
ERROR
API error occurred
user_id, endpoint, status_code, error_message
Alert
BOTTLENECK_DETECTED
Lab queue > 15 patients
department, queue_size, avg_wait_mins
Alert
LOW_STOCK
Medicine below reorder level
medicine_id, current_stock, reorder_level
Alert
CRITICAL_VITAL
Patient SpO2 dropped below 90%
patient_id, vital_type, value, threshold

12.2 events Table Schema

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Event ID (high volume table) |
| event_id | VARCHAR(36) | NOT NULL, UNIQUE, INDEX | UUID for deduplication |
| category | ENUM('user_action','navigation','data_change','workflow','system','alert') | NOT NULL, INDEX | Event category |
| event_type | VARCHAR(50) | NOT NULL, INDEX | e.g. CLICK, PAGE_VIEW, RECORD_UPDATE |
| user_id | INT | FK -> users.id, INDEX | Who triggered the event |
| user_role | VARCHAR(30) | NOT NULL | Role at time of event (denormalized for fast queries) |
| session_id | VARCHAR(36) | INDEX | Browser session ID |
| page_path | VARCHAR(200) | NULL | e.g. /doctor/consultation |
| component | VARCHAR(100) | NULL | e.g. PrescriptionForm, DispenseButton |
| element_id | VARCHAR(100) | NULL | DOM element identifier |
| entity_type | VARCHAR(50) | NULL, INDEX | e.g. patient, prescription, lab_order |
| entity_id | INT | NULL, INDEX | ID of affected record |
| action | VARCHAR(200) | NOT NULL | Human-readable action description |
| old_values | JSON | NULL | Previous state (for data changes) |
| new_values | JSON | NULL | New state (for data changes) |
| changed_fields | JSON | NULL | Array of field names that changed |
| metadata | JSON | NULL | Additional context (search_query, results_count, etc.) |
| ip_address | VARCHAR(45) | NULL | Client IP |
| user_agent | VARCHAR(500) | NULL | Browser user agent |
| device_type | ENUM('desktop','tablet','mobile') | NULL | Detected device |
| duration_ms | INT | NULL | Time spent on action (for page views) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, INDEX | Event timestamp |
| INDEX STRATEGY: Composite indexes on (user_id, created_at), (entity_type, entity_id, created_at), (category, event_type, created_at), (session_id, created_at) for fast analytics queries. Partition by month for tables exceeding 10M rows. |  | 12.3 sessions Table Schema | Column |
| Type | Constraints | Description | id |
| INT | PK, AUTO_INCREMENT |  | session_id |
| VARCHAR(36) | NOT NULL, UNIQUE | Client-generated UUID | user_id |
| INT | FK -> users.id, INDEX |  | started_at |
| TIMESTAMP | NOT NULL | Session start | ended_at |
| TIMESTAMP | NULL | Session end (null = active) | duration_seconds |
| INT | NULL | Computed on session end | pages_visited |
| INT | DEFAULT 0 | Count of page views | actions_performed |
| INT | DEFAULT 0 | Count of user actions | ip_address |
| VARCHAR(45) | NULL |  | device_type |
| VARCHAR(20) | NULL | desktop/tablet/mobile | browser |
| VARCHAR(100) | NULL | e.g. Chrome 122 | os |
| VARCHAR(100) | NULL | e.g. Windows 11, macOS | is_active |
| BOOLEAN | DEFAULT TRUE |  |  |
12.4 page_views Table Schema

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |  |
| user_id | INT | FK -> users.id, INDEX |  |
| session_id | VARCHAR(36) | INDEX |  |
| page_path | VARCHAR(200) | NOT NULL, INDEX | e.g. /pharmacy/queue |
| page_title | VARCHAR(200) | NULL | e.g. Pharmacy Dashboard |
| referrer_path | VARCHAR(200) | NULL | Previous page |
| entered_at | TIMESTAMP | NOT NULL | When page was opened |
| exited_at | TIMESTAMP | NULL | When user left page |
| time_on_page_seconds | INT | NULL | Duration on page |
| scroll_depth_percent | INT | NULL | How far they scrolled (0-100) |
| interactions_count | INT | DEFAULT 0 | Clicks/actions on this page |

12.5 feature_usage Table Schema

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |  |
| user_id | INT | FK -> users.id, INDEX |  |
| feature_key | VARCHAR(100) | NOT NULL, INDEX | e.g. patient_registration, prescription_writer, dispense_medicine |
| feature_category | VARCHAR(50) | NOT NULL | Module: reception, doctor, pharmacy, lab, etc. |
| used_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
| usage_count | INT | DEFAULT 1 | Times used in this session |
| context | JSON | NULL | Additional context |

12.6 wait_time_logs Table Schema

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| patient_id | INT | FK -> patients.id, INDEX |  |
| appointment_id | INT | FK -> appointments.id, NULL |  |
| stage | VARCHAR(30) | NOT NULL, INDEX | reception, triage, consultation, etc. |
| department_id | INT | FK -> departments.id, NULL |  |
| entered_stage_at | TIMESTAMP | NOT NULL | When patient entered this stage |
| exited_stage_at | TIMESTAMP | NULL | When patient left this stage |
| wait_duration_minutes | INT | NULL | Computed: exit - enter |
| served_by | INT | FK -> users.id, NULL | Staff who served the patient |
| date | DATE | NOT NULL, INDEX | For daily aggregation |

12.7 kpi_snapshots Table Schema

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| snapshot_date | DATE | NOT NULL, INDEX | Date of snapshot |
| snapshot_hour | INT | NULL | Hour (0-23) for hourly snapshots |
| metric_key | VARCHAR(100) | NOT NULL, INDEX | e.g. opd_count, avg_wait_time, revenue_total |
| metric_value | DECIMAL(15,2) | NOT NULL | Numeric value |
| department_id | INT | FK -> departments.id, NULL | NULL for hospital-wide |
| metadata | JSON | NULL | Breakdown details |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

12.8 saved_queries Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| name | VARCHAR(200) | NOT NULL | Query name |
| description | TEXT | NULL | What this query does |
| created_by | INT | FK -> users.id | Who created it |
| entity_type | VARCHAR(50) | NOT NULL | Primary entity (patients, appointments, etc.) |
| filters | JSON | NOT NULL | Array of filter conditions |
| columns | JSON | NOT NULL | Array of selected columns |
| sort_by | JSON | NULL | Sort configuration |
| group_by | JSON | NULL | Grouping configuration |
| aggregations | JSON | NULL | COUNT, SUM, AVG functions |
| is_shared | BOOLEAN | DEFAULT FALSE | Visible to others |
| is_scheduled | BOOLEAN | DEFAULT FALSE | Has scheduled export |
| last_run_at | TIMESTAMP | NULL | Last execution time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

12.9 scheduled_reports Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| name | VARCHAR(200) | NOT NULL | Report name |
| report_type | ENUM('kpi_summary','patient_flow','revenue','department_load','staff_performance','custom_query') | NOT NULL |  |
| saved_query_id | INT | FK -> saved_queries.id, NULL | For custom query type |
| schedule | ENUM('daily','weekly','monthly') | NOT NULL |  |
| day_of_week | INT | NULL | 1-7 for weekly |
| day_of_month | INT | NULL | 1-31 for monthly |
| time_of_day | TIME | DEFAULT '08:00:00' | When to generate |
| format | ENUM('pdf','excel','csv','email_body') | DEFAULT 'pdf' | Output format |
| recipients | JSON | NOT NULL | Array of email addresses |
| created_by | INT | FK -> users.id |  |
| is_active | BOOLEAN | DEFAULT TRUE |  |
| last_generated_at | TIMESTAMP | NULL |  |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

12.10 staff_performance Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| user_id | INT | FK -> users.id, INDEX | Staff member |
| date | DATE | NOT NULL, INDEX | Performance date |
| patients_handled | INT | DEFAULT 0 | Patients served |
| tasks_completed | INT | DEFAULT 0 | Tasks finished |
| avg_handling_time_mins | DECIMAL(6,1) | NULL | Avg time per patient/task |
| avg_patient_rating | DECIMAL(3,1) | NULL | Patient feedback score (1-5) |
| login_duration_mins | INT | DEFAULT 0 | Total active time |
| idle_time_mins | INT | DEFAULT 0 | Inactive periods |
| errors_count | INT | DEFAULT 0 | Errors/corrections made |
| prescriptions_written | INT | DEFAULT 0 | For doctors |
| medicines_dispensed | INT | DEFAULT 0 | For pharmacists |
| tests_completed | INT | DEFAULT 0 | For lab techs |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |

12.11 bottleneck_alerts Table

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | INT | PK, AUTO_INCREMENT |  |
| alert_type | ENUM('queue_overflow','long_wait','staff_shortage','bed_shortage','stock_low','system_error') | NOT NULL |  |
| severity | ENUM('low','medium','high','critical') | NOT NULL |  |
| department_id | INT | FK -> departments.id, NULL |  |
| title | VARCHAR(200) | NOT NULL |  |
| description | TEXT | NOT NULL |  |
| metric_key | VARCHAR(100) | NULL | Which KPI triggered this |
| threshold_value | DECIMAL(10,2) | NULL | Threshold that was breached |
| actual_value | DECIMAL(10,2) | NULL | Actual measured value |
| suggested_action | TEXT | NULL | AI-suggested resolution |
| is_resolved | BOOLEAN | DEFAULT FALSE |  |
| resolved_by | INT | FK -> users.id, NULL |  |
| resolved_at | TIMESTAMP | NULL |  |
| detected_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |  |
|  | 13. Event Capture Implementation |  | 13.1 Backend Event Capture Middleware |
| File: server/middleware/eventCapture.middleware.js | This middleware wraps EVERY API route and automatically captures events for all write operations (POST, PUT, PATCH, DELETE). It compares old vs new values for updates and logs the complete change. |  | // eventCapture.middleware.js — Auto-captures all API mutations |
| const captureEvent = (entityType) => async (req, res, next) => { | const originalJson = res.json.bind(res); | let oldValues = null; |  |
| // For UPDATE/DELETE, fetch current state BEFORE the change | if (['PUT','PATCH','DELETE'].includes(req.method) && req.params.id) { | const Model = getModelForEntity(entityType); | const existing = await Model.findByPk(req.params.id); |
| if (existing) oldValues = existing.toJSON(); | } |  | res.json = (data) => { |
| // After response, log the event asynchronously | setImmediate(async () => { | await EventService.track({ | category: 'data_change', |
| event_type: methodToEventType(req.method), | user_id: req.user?.id, | user_role: req.user?.role, | entity_type: entityType, |
| entity_id: req.params.id \|\| data?.data?.id, | action: buildActionDescription(req.method, entityType), | old_values: oldValues, | new_values: data?.data \|\| req.body, |
| changed_fields: computeChangedFields(oldValues, req.body), | ip_address: req.ip, | user_agent: req.headers['user-agent'], | page_path: req.headers['x-page-path'], |
| }); | }); | return originalJson(data); | }; |
| next(); | }; |  | 13.2 Frontend Event Tracking Hook |
| File: client/src/hooks/useEventTracker.js | A React hook that auto-tracks user interactions and sends them to the backend in batches. |  | // useEventTracker.js — Auto-tracks UI interactions |
| const useEventTracker = () => { | const { user } = useAuthStore(); | const sessionId = useSessionStore(s => s.sessionId); | const buffer = useRef([]); |
|  | const track = useCallback((eventType, data = {}) => { | buffer.current.push({ | event_id: crypto.randomUUID(), |
| category: 'user_action', | event_type: eventType, | session_id: sessionId, | page_path: window.location.pathname, |
| component: data.component, | element_id: data.elementId, | metadata: data.metadata, | timestamp: new Date().toISOString(), |
| }); | // Flush every 10 events or every 5 seconds | if (buffer.current.length >= 10) flush(); | }, [sessionId]); |
|  | const flush = async () => { | if (!buffer.current.length) return; | const batch = [...buffer.current]; |
| buffer.current = []; | await eventsApi.trackBatch(batch); | }; |  |
| // Flush on unmount and every 5s | useEffect(() => { | const interval = setInterval(flush, 5000); | return () => { clearInterval(interval); flush(); }; |
| }, []); |  | return { track }; | }; |

13.3 Frontend Page View Tracker
File: client/src/hooks/usePageTracker.js
Automatically tracks every page navigation with time-on-page calculation.

// usePageTracker.js — wrap in AppLayout to auto-track
const usePageTracker = () => {
const location = useLocation();
const enteredAt = useRef(Date.now());

useEffect(() => {
const enterTime = Date.now();
enteredAt.current = enterTime;

// Track page entry
eventsApi.trackPageView({
page_path: location.pathname,
page_title: document.title,
referrer_path: document.referrer,
});

return () => {
// On leave, record time spent
const duration = Math.round((Date.now() - enterTime) / 1000);
eventsApi.trackPageExit({
page_path: location.pathname,
time_on_page_seconds: duration,
});
};
}, [location.pathname]);
};

14. KPI Dashboard System
Customizable, widget-based dashboard inspired by Gainsight PX dashboards. Admin can drag, resize, add, and remove KPI widgets.

14.1 Hospital-Wide KPIs
KPI Metric
Calculation
Visualization
Alert Threshold
OPD Count (Today)
COUNT patients WHERE created_at = today
Big number + daily trend sparkline
> 200: overcrowded warning
Average Wait Time
AVG(wait_duration_minutes) grouped by department
Gauge chart per department
> 30 mins: bottleneck alert
Patient Throughput Rate
Patients discharged per hour
Time series line chart
< 5/hour: staff shortage
Bed Occupancy Rate
occupied_beds / total_beds * 100
Donut chart + percentage
> 90%: critical alert
ICU Occupancy
occupied_icu / total_icu * 100
Gauge (red zone > 85%)
> 85%: critical
Today Revenue
SUM(payments.amount) WHERE paid_at = today
Big number + comparison to yesterday

Monthly Revenue
SUM for current month with daily breakdown
Area chart with target line
< 80% of target: warning
Pending Bills
COUNT invoices WHERE status = pending
Number + aging breakdown
> 50: billing backlog
Pharmacy Stock Alerts
COUNT medicines WHERE stock < reorder_level
Number with list tooltip
> 10: procurement alert
Blood Bank Status
MIN units by blood group
Color-coded grid
Any group < 5: critical
Ambulance Availability
COUNT WHERE status = available
Number / total
0 available: emergency alert
Insurance Claims Pending
COUNT WHERE status = submitted or under_review
Number + aging chart
> 20: processing backlog
Staff On-Duty
COUNT users WHERE is_available = true grouped by role
Stacked bar chart
Department < 50% staffed
Lab Turnaround Time
AVG time from sample_collected to completed
Gauge chart
> 4 hours: delay alert
Radiology Queue Depth
COUNT pending radiology orders
Number + trend
> 10: backlog
Patient Satisfaction Score
AVG rating from feedback (1-5)
Gauge + trend line
< 3.5: quality alert
Readmission Rate
Patients returning within 30 days / total discharged
Percentage + trend
> 10%: quality concern
Emergency Response Time
AVG time from ambulance dispatch to arrival
Gauge
> 15 mins: critical
Prescription Error Rate
Returned/cancelled items / total items
Percentage
> 2%: training needed
Department Load Balance
Patient count per department relative to capacity
Heatmap
Imbalance > 40%: redistribute

14.2 KPI Dashboard API Endpoints
Method
Endpoint
Description
Details
GET
/api/v1/analytics/kpi/summary
All KPIs at once
Returns all computed metrics for dashboard
GET
/api/v1/analytics/kpi/:metricKey
Single KPI detail
With trend data (7/30/90 days)
GET
/api/v1/analytics/kpi/:metricKey/trend
KPI trend over time
?period=7d|30d|90d|1y
GET
/api/v1/analytics/kpi/department/:id
Department-specific KPIs
Scoped to one department
POST
/api/v1/analytics/kpi/snapshot
Trigger manual snapshot
Admin only: captures current state
GET
/api/v1/analytics/kpi/compare
Compare periods
?current=this_week&previous=last_week
GET
/api/v1/analytics/kpi/targets
KPI targets/thresholds
Configurable by admin
PUT
/api/v1/analytics/kpi/targets
Update targets
{ metric_key, target_value, alert_threshold }

15. Patient Flow Funnel Reports
Gainsight PX-style funnel analysis applied to patient lifecycle. Shows conversion rates and drop-off at each stage, helping identify bottlenecks.

15.1 Funnel Types
Funnel
Stages
Purpose
Key Metric
Full Patient Journey
Reception > Triage > Consultation > Pharmacy/Lab/Nursing > Billing > Discharge
End-to-end patient lifecycle
Completion rate, avg total time
OPD Flow
Registration > Token > Wait > Consultation > Prescription > Exit
Outpatient efficiency
Avg wait time per stage
Lab Pipeline
Order Placed > Sample Collected > Processing > Results Ready > Delivered
Lab turnaround analysis
Stage-to-stage time
Pharmacy Pipeline
Prescription Received > Medicine Picked > Verified > Dispensed > Handed Over
Pharmacy efficiency
Queue-to-dispense time
Emergency Flow
Ambulance Dispatch > Arrival > Triage > ER Consultation > Stabilize > Admit/Discharge
Emergency response efficiency
Door-to-doctor time
Admission Pipeline
ER/OPD > Decision to Admit > Bed Assigned > Admitted > Treatment > Discharge
Inpatient flow
Bed assignment delay
Insurance Pipeline
Claim Submitted > Documents Verified > Sent to TPA > Under Review > Approved/Rejected > Settled
Claim processing speed
Avg settlement days
Billing Pipeline
Invoice Generated > Shared with Patient > Payment Initiated > Payment Received > Receipt Issued
Collection efficiency
Payment delay time

15.2 Funnel Analysis Features
•	Stage-to-Stage Conversion: Shows % of patients who move from one stage to the next. E.g. 92% of registered patients reach consultation, but only 78% complete billing.
•	Drop-Off Analysis: Highlights where patients exit the funnel (no-shows, cancellations, AMA discharges). Shows reasons and counts.
•	Time-in-Stage Distribution: Histogram showing how long patients spend in each stage. Identifies outliers (patients stuck > 2 hours in waiting).
•	Segment Comparison: Compare funnels across departments (Cardiology vs Orthopedics), time periods (this week vs last week), priorities (emergency vs normal).
•	Cohort Analysis: Group patients by registration date and track their journey completion over days/weeks.
•	Sankey Diagram View: Visual flow diagram showing patient movement between ALL stages including non-linear paths (e.g. Lab then back to Doctor then to Pharmacy).

15.3 Funnel API Endpoints
Method
Endpoint
Description
Details
GET
/api/v1/analytics/funnel/patient-journey
Main patient funnel
?from=date&to=date&department_id=1
GET
/api/v1/analytics/funnel/:funnelType
Specific funnel type
opd, lab, pharmacy, emergency, admission, insurance, billing
GET
/api/v1/analytics/funnel/:type/dropoff
Drop-off analysis
Where patients exit + reasons
GET
/api/v1/analytics/funnel/:type/time-distribution
Time in each stage
Histogram data per stage
GET
/api/v1/analytics/funnel/compare
Compare two funnels
?segment_a=cardiology&segment_b=orthopedics
GET
/api/v1/analytics/funnel/cohort
Cohort analysis
?cohort_date=2026-03-01&granularity=weekly
GET
/api/v1/analytics/funnel/sankey
Sankey diagram data
Node-link format for all stage transitions

16. Feature Adoption Explorer
Tracks which HMS features each staff member uses, how often, and identifies training gaps. Directly inspired by Gainsight PX Adoption Explorer.

16.1 Tracked Features by Module
Module
Feature Key
Feature Name
Expected Role
Reception
patient_registration
Register New Patient
receptionist
Reception
appointment_booking
Book Appointment
receptionist
Reception
queue_management
Manage Queue/Tokens
receptionist
Reception
patient_search
Search Patient Records
receptionist, doctor
Doctor
consultation_start
Start Consultation
doctor
Doctor
prescription_writer
Write Prescription
doctor
Doctor
medical_history_view
View Patient History
doctor
Doctor
vitals_review
Review Vitals
doctor
Doctor
lab_results_review
Review Lab Results
doctor
Doctor
radiology_results_review
Review Imaging Results
doctor
Pharmacy
dispense_medicine
Dispense Prescription
pharmacist
Pharmacy
inventory_check
Check Medicine Stock
pharmacist
Pharmacy
stock_update
Update Inventory
pharmacist
Nursing
injection_admin
Administer Injection
nurse
Nursing
vitals_entry
Record Patient Vitals
nurse
Nursing
nursing_notes
Write Nursing Notes
nurse
Lab
sample_collection
Collect Sample
lab_tech
Lab
result_entry
Enter Test Results
lab_tech
Lab
report_generation
Generate Lab Report
lab_tech
Radiology
scan_processing
Process Imaging Scan
radiologist
Radiology
report_upload
Upload Radiology Report
radiologist
Billing
invoice_generation
Generate Invoice
billing
Billing
payment_collection
Collect Payment
billing
Billing
insurance_claim
Submit Insurance Claim
billing, insurance
Admin
user_management
Manage Staff Accounts
admin
Admin
report_builder
Build Custom Reports
admin
Admin
analytics_dashboard
View Analytics
admin
Analytics
query_builder
Use Query Builder
admin
Analytics
funnel_report
View Funnel Reports
admin
Analytics
audit_log_view
View Audit Logs
admin

16.2 Adoption Visualizations
•	Heatmap (Feature x Role): Grid showing which roles use which features. Color intensity = usage frequency. Immediately reveals under-utilized features.
•	Heatmap (Feature x Hour of Day): Shows when features are used throughout the day. Identifies peak usage hours per module.
•	User Adoption Ranking: Ranked list of staff by total feature engagement. Flags users with low adoption who may need training.
•	Feature Trend Lines: Weekly/monthly trend of each feature's usage count. Shows growth or decline in adoption.
•	New Feature Adoption Curve: When new features are released, track how quickly staff adopt them (Day 1, Day 7, Day 30 usage).
•	Adoption Score (0-100): Composite score per user: (features used / features available for role) * frequency weight. Like PX's Health Score.
•	Training Gap Report: Cross-reference available features for a role vs actually used features. List of features never used = training gap.

16.3 Adoption API Endpoints
Method
Endpoint
Description
Details
GET
/api/v1/analytics/adoption/heatmap
Feature x Role heatmap
?period=30d&group_by=role
GET
/api/v1/analytics/adoption/hourly
Feature x Hour heatmap
?feature_key=prescription_writer
GET
/api/v1/analytics/adoption/ranking
User adoption scores
?role=doctor&sort=score_desc
GET
/api/v1/analytics/adoption/trend
Feature usage trend
?feature_key=dispense_medicine&period=90d
GET
/api/v1/analytics/adoption/gaps
Training gap report
?user_id=5 or ?role=nurse
GET
/api/v1/analytics/adoption/score/:userId
Individual adoption score
Breakdown by feature
GET
/api/v1/analytics/adoption/new-features
New feature adoption curve
?feature_key=query_builder&since=launch_date

17. Visual Query Builder
A full drag-and-drop visual query builder inspired by Gainsight PX's Audience Explorer. Allows admin/analysts to build complex queries without writing SQL. Supports any entity in the system.

17.1 Queryable Entities
Entity
Available Columns
Join Paths
Example Queries
Patients
name, age, gender, blood_group, city, stage, registered_at, is_admitted, allergies
-> appointments, prescriptions, invoices, vitals, journey
Female patients above 50 with diabetes from Guntur
Appointments
date, time, type, status, priority, chief_complaint, doctor, department
-> patients, doctors, prescriptions
Emergency appointments this week that are still waiting
Prescriptions
diagnosis, status, created_at, doctor, items_count
-> patients, items, doctors
Prescriptions with more than 5 items in Cardiology
Prescription Items
type, item_name, routed_to, status, is_urgent
-> prescriptions, patients
All pending urgent lab tests ordered today
Lab Orders
test_name, sample_type, status, priority, ordered_by
-> patients, results
CBC tests pending for more than 2 hours
Invoices
invoice_no, grand_total, status, payment_method, insurance_amount
-> patients, payments
Unpaid invoices above 10,000 rupees
Staff/Users
name, role, department, is_available, last_login
-> events, sessions, performance
Doctors who haven't logged in this week
Events
event_type, category, entity_type, user_role, created_at
-> users, sessions
All data changes made by billing staff yesterday
Beds
bed_number, ward, status, has_ventilator
-> wards, allocations
Available ICU beds with ventilator
Blood Inventory
blood_group, component, units_available, expiry_date
-> donors
Blood groups expiring within 7 days
Insurance Claims
provider, policy_no, claim_amount, status
-> patients, invoices
Claims pending review for more than 5 days
Ambulances
vehicle_no, status, driver, current_location
-> trips
Ambulances currently on emergency trips

17.2 Filter Operators
Data Type
Available Operators
UI Control
Text/String
equals, not equals, contains, starts with, ends with, is empty, is not empty
Text input with autocomplete suggestions
Number/Decimal
equals, not equals, greater than, less than, between, is empty
Number input(s)
Date/DateTime
equals, before, after, between, in last N days, today, this week, this month
Date picker / range picker / preset buttons
Enum/Select
equals, not equals, in list, not in list
Multi-select dropdown with all enum values
Boolean
is true, is false
Toggle switch
JSON
contains key, key equals value
Key input + value input

17.3 Query Builder UI Components
The Query Builder page has 4 panels:

•	1. Entity Selector (Left Panel): Dropdown to choose primary entity (Patients, Appointments, etc.). Changing entity reloads available columns and filters.
•	2. Filter Builder (Center-Top): Visual rows of conditions. Each row: [Column dropdown] [Operator dropdown] [Value input]. Rows grouped by AND/OR logic. Groups can be nested. Add row/group buttons. Drag to reorder.
•	3. Column Picker (Center-Middle): Checkbox list of available columns. Drag to reorder display columns. Toggle show/hide. Add aggregation (COUNT, SUM, AVG, MIN, MAX) to any numeric column. Add GROUP BY on any column.
•	4. Results Table (Bottom): Live query results with sortable columns, pagination (25/50/100 per page), total count. Export buttons: CSV, Excel, PDF. Save query button.

17.4 Query Builder API
Method
Endpoint
Description
Details
POST
/api/v1/analytics/query/execute
Execute a visual query
{ entity, filters, columns, sort, group_by, aggregations, page, limit }
POST
/api/v1/analytics/query/preview
Preview query (limited rows)
Same as execute but returns max 10 rows
GET
/api/v1/analytics/query/entities
List queryable entities
With column definitions and types
GET
/api/v1/analytics/query/entities/:entity/columns
Columns for entity
Name, type, operators, sample values
GET
/api/v1/analytics/query/saved
List saved queries
?created_by=me
POST
/api/v1/analytics/query/save
Save a query
{ name, description, entity, filters, columns, ... }
PUT
/api/v1/analytics/query/saved/:id
Update saved query

DELETE
/api/v1/analytics/query/saved/:id
Delete saved query

GET
/api/v1/analytics/query/saved/:id/run
Run a saved query
With fresh data
POST
/api/v1/analytics/query/export
Export query results
{ query_config, format: csv|excel|pdf }

17.5 Query Execution Service (Backend)
File: server/services/querybuilder.service.js
Converts the visual filter JSON into a safe, parameterized Sequelize query. NEVER constructs raw SQL from user input. Uses Sequelize Op operators.
// querybuilder.service.js — Converts UI filters to Sequelize queries
const buildWhereClause = (filters) => {
return filters.map(group => ({
[group.logic === 'AND' ? Op.and : Op.or]: group.conditions.map(c => ({
[c.column]: operatorMap[c.operator](c.value)
}))
}));
};

const operatorMap = {
'equals':       (v) => ({ [Op.eq]: v }),
'not_equals':   (v) => ({ [Op.ne]: v }),
'contains':     (v) => ({ [Op.like]: `%${v}%` }),
'greater_than': (v) => ({ [Op.gt]: v }),
'less_than':    (v) => ({ [Op.lt]: v }),
'between':      (v) => ({ [Op.between]: v }),
'in_list':      (v) => ({ [Op.in]: v }),
'is_empty':     ()  => ({ [Op.is]: null }),
'in_last_days': (v) => ({ [Op.gte]: subDays(new Date(), v) }),
};

18. Role-Specific Insights & Problem Solving
Each role in the hospital faces unique daily challenges. This section defines tailored analytics dashboards that solve real problems for each persona. Think of this as Gainsight PX Health Scores but for hospital operations.

18.1 Admin / Hospital Director
Pain Points: No visibility into overall hospital performance. Cannot identify bottlenecks in real-time. Revenue leakage through unbilled services. Staff productivity is a black box.

•	Command Center Dashboard: Single screen showing all critical KPIs, active alerts, staff on duty, bed availability, ambulance status. Auto-refreshes every 30 seconds via Socket.io.
•	Revenue Leakage Detector: Cross-references completed services (prescriptions, lab orders, scans) against generated invoices. Flags any completed service without a corresponding billing entry. Shows estimated lost revenue.
•	Operational Bottleneck Map: Visual representation of all departments showing queue depth, avg wait time, and staff count. Departments exceeding thresholds are highlighted red with suggested actions (add staff, redirect patients).
•	Staff Productivity Scorecard: Per-staff metrics: patients handled, avg handling time, active hours, feature adoption score. Compare across peers in same role. Identify top performers and underperformers.
•	Trend Comparisons: This week vs last week, this month vs last month for all KPIs. Automatic insight generation: 'OPD count is 15% higher than last week, but lab turnaround increased by 22 minutes.'
•	Capacity Forecasting: Based on historical patterns, predict tomorrow/next week patient volume, bed requirements, staff needed per department.

18.2 Receptionist
Pain Points: Long patient queues during peak hours. Cannot predict doctor availability. No visibility into which department is overloaded. Manually tracking token numbers.

•	Smart Queue Manager: Shows real-time queue for each doctor with estimated wait time. Suggests least-busy doctor to reduce patient wait.
•	Peak Hour Prediction: Historical heatmap showing patient arrival patterns by hour and day of week. Helps plan staffing.
•	Patient Return Identifier: When registering a patient, auto-detects if they visited before. Shows last visit summary, doctor seen, conditions treated.
•	Token Efficiency Report: Tracks tokens issued vs patients seen. Identifies no-show rates by department, time slot, and doctor.
•	Appointment Slot Optimizer: Shows available slots across all doctors with color-coded load. Green = low load, yellow = moderate, red = packed.

18.3 Doctor
Pain Points: Too many patients, no time per consultation. No quick view of patient history. Cannot track if prescription was followed through. Waiting for lab results.

•	Patient Queue with Context: Shows today's patient list with summary cards: chief complaint, vitals, past diagnoses, allergies, last medications. Doctor can prepare before calling the patient.
•	Prescription Follow-Through Tracker: For each prescription written, shows real-time status: medicines dispensed (yes/no), injections given (yes/no), lab results (ready/pending), imaging done (yes/no). Alerts if any item is stuck for too long.
•	Clinical Decision Support: When entering diagnosis/medicines, shows drug interaction warnings, allergy alerts (from patient record), and suggested investigations based on diagnosis patterns from historical data.
•	My Performance Analytics: Patients seen today/this week/this month, average consultation time, follow-up rates, patient satisfaction scores, most common diagnoses.
•	Lab Results Notifier: Real-time notification when lab results for your patients are ready. One-click view of results from the dashboard.
•	Referral Patterns: Which departments/doctors you refer to most, and outcomes of those referrals.

18.4 Nurse
Pain Points: Tracking multiple patients and their injection schedules. Missing vitals recording for some patients. No visibility into incoming workload. Night shift handover gaps.

•	Task Priority Board: Kanban-style board: Critical | Urgent | Normal. Each card shows patient name, task type (injection, IV, vitals), doctor who ordered, due time. Overdue tasks flash red.
•	Vitals Compliance Tracker: Shows which admitted patients have had their vitals recorded in the last 4 hours. Flags patients with missing vitals. Critical patients highlighted with last known vital values.
•	Incoming Workload Predictor: Shows prescriptions currently being written by doctors that will route to nursing. Gives 5-10 minute heads-up of incoming injection orders.
•	Shift Handover Report: Auto-generated summary of all pending tasks, critical patients, medication schedules due, and completed tasks for the ending shift. Exportable as PDF.
•	Medication Schedule Timeline: Visual timeline showing all medications/injections due for all patients by hour. Easy to see what's coming up in the next 1-2 hours.

18.5 Pharmacist
Pain Points: Peak-hour prescription floods. Stock-outs of common medicines. Slow dispensing causing patient complaints. Expiry date management. Cannot forecast demand.

•	Prescription Rush Hour Alert: Predicts dispensing volume for next 1-2 hours based on active consultations. Shows which medicines will be needed most.
•	Smart Stock Dashboard: Real-time inventory with: red (out of stock), orange (below reorder), yellow (expiring within 30 days), green (healthy). One-click purchase order generation.
•	Fast-Moving Medicines Report: Top 20 most dispensed medicines this week/month. Trend lines showing increasing/decreasing demand. Helps procurement planning.
•	Dispensing Speed Tracker: Time from prescription arrival to dispense complete. Personal and team average. Identify bottlenecks (waiting for verification, stock issue, etc.).
•	Expiry Alert Calendar: Calendar view showing batches expiring in next 30/60/90 days with remaining quantities. Priority: use-first-expire-first suggestions.
•	Drug Substitution Helper: When a prescribed medicine is out of stock, suggests available alternatives with same generic compound and dosage.

18.6 Lab Technician
Pain Points: Sample backlog during peak hours. Unclear which tests are urgent. Results entry is slow. Doctors keep calling for pending results.

•	Sample Collection Queue: Prioritized queue with urgent/critical samples highlighted. Shows patient location (OPD room, bed number) for sample collection. Auto-prints barcoded labels.
•	Test Turnaround Dashboard: For each test type, shows: average processing time, current queue depth, samples in each stage (collected, processing, reporting). Identifies which test type is causing delays.
•	Urgent Test Escalation: If an urgent test has been pending for more than the threshold (e.g., 1 hour for CBC), auto-escalates with notification to lab manager and ordering doctor.
•	Abnormal Results Flagging: When entering results, system auto-flags values outside normal range. Critical values (e.g., hemoglobin < 7) trigger immediate notification to doctor.
•	Equipment Utilization: Track usage of lab equipment (centrifuge, analyzer, etc.) to identify if machines are bottleneck or underutilized.

18.7 Radiologist
Pain Points: Queue management for different modalities (X-Ray, CT, MRI). Long reporting times. Missed urgent cases.

•	Modality-wise Queue: Separate queues for X-Ray, CT, MRI, USG with estimated scan time. Urgent cases flagged and auto-prioritized.
•	Reporting Turnaround: Average time from scan completion to report upload by radiologist. Comparison across radiologists.
•	Repeat Scan Tracker: Flags cases where same body part was imaged multiple times for same patient (possible quality issue or clinical necessity).

18.8 Billing Staff
Pain Points: Missing charges from services. Patients leaving without paying. Insurance claim delays. Manual calculation errors. End-of-day reconciliation.

•	Unbilled Services Detector: Scans all completed services (dispensed medicines, completed tests, scans) and flags patients who don't have corresponding invoice line items. Shows estimated missing revenue.
•	Payment Collection Dashboard: Today's collections by method (cash, card, UPI), pending amounts, partial payments. Real-time total with comparison to daily target.
•	Insurance Claim Aging Report: Claims grouped by days pending: 0-7 days, 8-14 days, 15-30 days, 30+ days. Oldest claims highlighted for follow-up.
•	Auto-Reconciliation: End-of-day report: total invoices generated vs total payments received. Identifies discrepancies.
•	Revenue by Department: Breakdown of revenue contribution by each department. Identifies most and least profitable departments.

18.9 Blood Bank Technician
Pain Points: Critical shortage of rare blood groups. Expiry management. Emergency cross-match pressure. Donor tracking.

•	Blood Inventory Heatmap: Grid showing all blood groups with traffic-light colors based on stock levels. Includes component-wise breakdown (whole blood, packed RBC, plasma, platelets).
•	Demand Prediction: Based on scheduled surgeries and historical usage, predicts blood requirement for next week by group.
•	Donor Recall System: When stock is critically low, identifies eligible donors (last donation > 3 months) by blood group and generates recall list.

18.10 ICU Manager
Pain Points: Bed availability pressure. Ventilator tracking. Critical patient monitoring. Staffing for ICU.

•	ICU Bed Map: Visual map of ICU showing each bed: occupied (red) with patient name and condition, available (green), maintenance (yellow). Ventilator status per bed.
•	Predicted Discharge: Based on average stay duration by condition, predicts which ICU patients are likely to be shifted/discharged in next 24-48 hours. Helps bed planning.
•	Critical Parameter Alerts: If any admitted patient's vitals go beyond critical thresholds (connected to vitals recording), instant alerts to ICU manager and assigned nurse.

18.11 Ambulance Coordinator
Pain Points: Which ambulance is closest to the emergency? Driver availability. Trip history tracking. Response time optimization.

•	Fleet Map View: Map view showing all ambulance locations in real-time (using GPS coordinates). Click to see status, driver, current trip.
•	Smart Dispatch: When new emergency call comes in, system suggests the nearest available ambulance based on last known GPS location.
•	Response Time Analytics: Average dispatch-to-arrival time by area, time of day, ambulance. Identify areas with consistently poor response times.

18.12 Insurance/TPA Coordinator
Pain Points: Claim rejection rates. Missing documentation. TPA response delays. Pre-authorization bottlenecks.

•	Claim Success Rate Dashboard: Approval rate by insurance provider, claim type, and amount bracket. Identifies which providers reject most.
•	Documentation Completeness Checker: Before submitting a claim, system verifies all required documents are attached (discharge summary, bills, prescriptions, reports). Flags missing items.
•	TPA Response Tracker: Tracks time from claim submission to TPA response by provider. Identifies slowest TPAs for escalation.
•	Pre-Auth Status Board: Active pre-authorization requests with status, hospital contact, patient details, and expected approval timeline.

18.13 HR / Hospital Administration
Pain Points: Staff attendance and punctuality. Overtime tracking. Department-wise staffing adequacy. Training needs assessment.

•	Staff Attendance Dashboard: Login/logout times for each staff member. Late arrivals, early departures, overtime hours. Auto-calculated from session tracking.
•	Department Staffing Adequacy: Compares actual staff on-duty vs recommended staffing levels per department per shift. Highlights under-staffed departments.
•	Training Needs Report: Combines feature adoption scores with error rates to identify staff who need training on specific modules.
•	Staff Utilization Rate: Active time (performing tasks) vs idle time (logged in but not performing actions) per staff member. Identifies capacity for additional work.

19. Enhanced Audit Trail System
Every data change in MediFlow is logged with complete before/after snapshots. This goes beyond the basic audit_log table to provide a compliance-grade change tracking system.

19.1 Audit Trail Features
•	Diff Viewer: Side-by-side comparison showing old value (red/strikethrough) and new value (green/highlight) for every changed field. Like Git diff but for data records.
•	Entity Timeline: For any record (patient, prescription, invoice), view chronological history of all changes with who made each change and when.
•	User Activity Log: For any staff member, view everything they did in the system: records created, modified, deleted, pages visited, time spent.
•	Compliance Filters: Filter audit log by: entity type, specific record, user, role, date range, change type (create/update/delete), specific field changed.
•	Export for Compliance: Export filtered audit logs as PDF or Excel for regulatory compliance, legal disputes, or insurance audits.
•	Tamper Protection: Audit records are append-only. No user (including admin) can edit or delete audit entries. Checksums verify integrity.

19.2 Enhanced Audit Trail API
Method
Endpoint
Description
Details
GET
/api/v1/analytics/audit
Query audit logs
?entity_type=patient&entity_id=5&user_id=3&from=date&to=date&field=stage
GET
/api/v1/analytics/audit/entity/:type/:id
All changes for one record
Complete history of a patient, invoice, etc.
GET
/api/v1/analytics/audit/user/:userId
All actions by one user
Everything this staff member did
GET
/api/v1/analytics/audit/diff/:eventId
Get diff view data
Structured old vs new for rendering
GET
/api/v1/analytics/audit/timeline/:entityType/:entityId
Timeline view
Chronological changes with user avatars
POST
/api/v1/analytics/audit/export
Export audit logs
{ filters, format: pdf|excel }
GET
/api/v1/analytics/audit/summary
Audit summary stats
Changes per entity type, per user, per day

20. Scheduled Reports & Export

20.1 Preset Report Templates
Report
Contents
Default Schedule
Format
Daily OPD Summary
Patient count, department-wise breakdown, avg wait, revenue
Daily 8 PM
PDF + Email
Daily Revenue Report
Collections by method, department, pending amounts, insurance
Daily 9 PM
Excel
Weekly Performance Report
Staff productivity, department load, patient satisfaction, KPIs vs targets
Monday 8 AM
PDF
Monthly Executive Summary
All KPIs with trends, revenue analysis, bed utilization, bottleneck history
1st of month
PDF
Lab Turnaround Report
Average processing times by test type, pending backlogs, abnormal results
Daily 6 PM
PDF
Pharmacy Stock Report
Current inventory, medicines below reorder, expiring soon, fast movers
Weekly Friday
Excel
Blood Bank Status
Inventory levels, transfusions done, expiry alerts, donor activity
Daily 7 AM
PDF
Insurance Claims Report
New claims, approvals, rejections, aging analysis, settlement amounts
Weekly Monday
Excel
Bed Occupancy Report
Ward-wise occupancy rates, average stay duration, turnover rate
Daily 7 AM
PDF
Staff Attendance Report
Login times, active hours, late arrivals, overtime by department
Daily 9 PM
Excel
Patient Flow Funnel
Stage conversion rates, drop-off analysis, time-in-stage averages
Weekly Friday
PDF
Feature Adoption Report
Usage by module, adoption scores by role, training gaps
Monthly
PDF

20.2 Scheduled Reports API
Method
Endpoint
Description
Details
GET
/api/v1/analytics/reports/templates
List preset templates

GET
/api/v1/analytics/reports/scheduled
My scheduled reports

POST
/api/v1/analytics/reports/schedule
Create scheduled report
{ template or saved_query_id, schedule, format, recipients[] }
PUT
/api/v1/analytics/reports/scheduled/:id
Update schedule

DELETE
/api/v1/analytics/reports/scheduled/:id
Remove schedule

POST
/api/v1/analytics/reports/generate-now
Generate report immediately
{ template, date_range, format }
GET
/api/v1/analytics/reports/history
Past generated reports
With download links

20.3 Report Scheduler Service
File: server/services/scheduler.service.js
Uses node-cron to run scheduled report generation. On trigger: executes the query/template, generates PDF or Excel via PDFKit/ExcelJS, saves to uploads/ directory, and sends via Nodemailer to all recipients.

21. Intelligent Bottleneck Detection
An automated monitoring service that continuously checks hospital operations against configurable thresholds and generates alerts when bottlenecks are detected.

21.1 Monitored Conditions
Condition
Threshold (Default)
Severity
Auto-Action
Department queue > N patients
15 patients
High
Notify admin + department head
Average wait time > N minutes
30 minutes
High
Suggest patient redistribution
Lab result pending > N hours
4 hours for normal, 1 hour for urgent
Medium/Critical
Notify lab manager + ordering doctor
Pharmacy queue > N prescriptions
20 prescriptions
Medium
Notify pharmacist + admin
ICU beds available < N
2 beds
Critical
Notify ICU manager + admin + all doctors
Blood group units < N
5 units
Critical
Trigger donor recall + notify blood bank
Ambulances available = 0
0
Critical
Emergency broadcast to all coordinators
Invoice unpaid > N days
7 days
Low
Send payment reminder to patient
Staff member idle > N minutes
30 minutes (no actions)
Low
Log only for HR reporting
Error rate > N% in last hour
5%
High
Notify admin + log for investigation
Medicine stock = 0
0
Critical
Notify pharmacist + procurement
No-show rate > N% today
20%
Medium
Notify reception to over-book 10%
Patient in same stage > N hours
3 hours (non-admitted)
Medium
Notify department + admin
Insurance claim pending > N days
14 days
Medium
Escalation to insurance coordinator

21.2 Bottleneck Detection Service
File: server/services/bottleneck.detector.service.js
Runs every 5 minutes as a background interval. Queries current state of all monitored metrics. If any metric exceeds its threshold, creates a bottleneck_alert record and emits Socket.io notification to relevant roles. Admin dashboard shows all active alerts with 'Acknowledge' and 'Resolve' actions.

21.3 Bottleneck API
Method
Endpoint
Description
Details
GET
/api/v1/analytics/bottlenecks
Active bottleneck alerts
?severity=critical&department_id=1
PUT
/api/v1/analytics/bottlenecks/:id/acknowledge
Acknowledge alert
{ acknowledged_by }
PUT
/api/v1/analytics/bottlenecks/:id/resolve
Mark resolved
{ resolution_notes }
GET
/api/v1/analytics/bottlenecks/history
Past alerts
?from=date&to=date
GET
/api/v1/analytics/bottlenecks/thresholds
View all thresholds
Admin configurable
PUT
/api/v1/analytics/bottlenecks/thresholds
Update thresholds
{ condition_key, new_threshold }

22. Claude Code — Analytics Module Prompt
Append this prompt to the original MediFlow HMS build prompt from the main architecture document (Section 9).

--- START ANALYTICS PROMPT ADDENDUM ---

ADDITIONALLY, build a complete Gainsight PX-inspired analytics engine integrated into MediFlow HMS. This analytics module includes:

1. EVENT TRACKING ENGINE:
•	Auto-capture every user click, form submission, page view, search, and navigation as structured events in the 'events' table (BIGINT IDs for high volume).
•	Backend middleware (eventCapture.middleware.js) wraps all API routes and captures data change events with old_values/new_values JSON diff for every UPDATE and DELETE.
•	Frontend hooks: useEventTracker.js (batch user actions every 5 seconds or 10 events), usePageTracker.js (track page views with time-on-page), useSessionTracker.js (track session start/end/duration).
•	Create these tables: events (with composite indexes for fast queries), sessions, page_views, feature_usage.

2. KPI DASHBOARD:
•	20 hospital KPIs with real-time computation: OPD count, avg wait time, patient throughput, bed occupancy, ICU occupancy, revenue (today/monthly), pending bills, pharmacy stock alerts, blood bank status, ambulance availability, insurance claims pending, staff on-duty, lab turnaround time, radiology queue, patient satisfaction, readmission rate, emergency response time, prescription error rate, department load balance.
•	Each KPI widget shows: big number, trend sparkline (7-day), comparison vs yesterday/last week, alert indicator if threshold exceeded.
•	KPI snapshots stored daily in kpi_snapshots table for historical trend analysis.
•	Draggable, resizable grid layout for dashboard customization.

3. PATIENT FLOW FUNNEL REPORTS:
•	8 funnel types: Full Patient Journey, OPD Flow, Lab Pipeline, Pharmacy Pipeline, Emergency Flow, Admission Pipeline, Insurance Pipeline, Billing Pipeline.
•	Each funnel shows: stage conversion rates (%), drop-off analysis, time-in-stage histogram, segment comparison (department A vs B), cohort analysis.
•	Sankey diagram view showing all patient stage transitions including non-linear paths.

4. FEATURE ADOPTION EXPLORER:
•	Track 30+ features across all modules. Each feature has a key, category, and expected role.
•	Visualizations: Feature x Role heatmap, Feature x Hour of Day heatmap, user adoption ranking, feature trend lines, adoption score (0-100) per user, training gap report.

5. VISUAL QUERY BUILDER (like PX Audience Explorer):
•	Full drag-and-drop interface. User selects entity (patients, appointments, invoices, etc.), adds filter rows with column/operator/value, selects display columns, can group by and add aggregations (COUNT, SUM, AVG).
•	Filters support: equals, not equals, contains, greater than, less than, between, in list, is empty, in last N days, today, this week, this month.
•	Results shown in paginated, sortable table. Export to CSV, Excel, PDF. Save and share queries.
•	Backend converts filter JSON to parameterized Sequelize queries (NEVER raw SQL from user input).

6. ENHANCED AUDIT TRAIL:
•	Diff viewer showing old vs new values side-by-side for every data change.
•	Entity timeline: chronological history of all changes for any record.
•	User activity log: everything a staff member did in the system.
•	Compliance export: filtered audit logs as PDF/Excel.
•	Tamper protection: audit records are append-only, no edits or deletes allowed.

7. SCHEDULED REPORTS:
•	12 preset report templates (Daily OPD Summary, Revenue Report, Weekly Performance, Monthly Executive, Lab Turnaround, Pharmacy Stock, Blood Bank, Insurance Claims, Bed Occupancy, Staff Attendance, Patient Flow, Feature Adoption).
•	Configurable schedule (daily/weekly/monthly), format (PDF/Excel/CSV), and email recipients.
•	Use node-cron for scheduling, PDFKit for PDF generation, ExcelJS for Excel, Nodemailer for email delivery.

8. INTELLIGENT BOTTLENECK DETECTION:
•	Background service runs every 5 minutes checking 14 monitored conditions against configurable thresholds.
•	Auto-generates alerts with severity (low/medium/high/critical) and suggested actions.
•	Alerts pushed via Socket.io to relevant roles.
•	Admin can acknowledge and resolve alerts with notes.

9. ROLE-SPECIFIC INSIGHT DASHBOARDS:
•	Build dedicated analytics pages for each role: Admin (command center, revenue leakage, capacity forecast), Receptionist (smart queue, peak hours, no-show rates), Doctor (follow-through tracker, clinical support, my performance), Nurse (task priority board, vitals compliance, shift handover), Pharmacist (rush hour alert, stock dashboard, dispensing speed), Lab Tech (sample queue, turnaround dashboard, abnormal flagging), Radiologist (modality queues, reporting speed), Billing (unbilled detector, collections dashboard, insurance aging), Blood Bank (inventory heatmap, demand prediction, donor recall), ICU Manager (bed map, predicted discharge, critical alerts), Ambulance (fleet map, smart dispatch, response analytics), Insurance (claim success rate, documentation checker, TPA tracker), HR (attendance, staffing adequacy, training needs, utilization).

DESIGN RULES FOR ANALYTICS PAGES:
•	Use Recharts for all charts (line, bar, area, pie, radar, treemap, funnel).
•	Use a custom SankeyDiagram component with D3.js for patient flow sankey.
•	Use a heatmap component (custom, grid-based with color gradient) for adoption and peak hours.
•	Query builder: use react-dnd or native drag-and-drop for filter reordering.
•	All analytics pages follow the same light theme, card-based layout from the main design system.
•	Every chart should have date range picker, export button, and loading skeleton.

--- END ANALYTICS PROMPT ADDENDUM ---

23. Analytics Module — File Count Summary

Category
New Files
Purpose
Frontend Components
25 files
Analytics widgets, charts, query builder, audit viewer
Frontend Pages
22 files
Analytics hub, role insights, KPI dashboard, funnel, adoption, query builder, audit, reports
Frontend Store/Hooks/API
8 files
State management, tracking hooks, API services
Backend Models
10 files
Events, sessions, page views, feature usage, KPI snapshots, etc.
Backend Routes/Controllers
8 files
Analytics, events, query builder, reports endpoints
Backend Services
9 files
Event tracking, aggregation, funnel, adoption, query builder, report generator, bottleneck detector, scheduler, wait time
Backend Middleware
2 files
Event capture, session tracker
Database Migrations
10 files
New analytics tables
TOTAL NEW FILES
94 files
On top of the 150+ files from the main architecture

Grand Total: ~250 files across the complete MediFlow HMS application with analytics.
Both documents together (main architecture + this analytics addendum) provide the complete blueprint for Claude Code to build the entire application.
