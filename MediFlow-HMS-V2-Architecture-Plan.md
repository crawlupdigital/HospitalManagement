# MediFlow HMS v2.0 — Complete Architecture Redesign Plan

**Document Version:** 2.0  
**Date:** March 12, 2026  
**Author:** Nageswara Rao / CrawlUp Digital  
**Stack:** React 18 + Vite + Tailwind CSS | Node.js + Express + Sequelize | MySQL 9.4 | Socket.io

---

## 1. Core Problem Statement

The current MediFlow HMS requires patients to be pre-registered before booking appointments. This creates a 3-step friction: navigate to Patients → Register → navigate to Appointments → Book. In a real hospital, the receptionist handles walk-ins, medical reps, emergency cases, and follow-ups — all of whom need instant appointment booking without pre-registration. Additionally, the dashboard stat cards (Total Patients, Today's Appointments, Revenue, Bed Occupancy) are static on load and do not support click-through navigation to detailed views. Every button and card across the entire application needs to be functional with proper navigation, real-time data, and micro-interactions.

---

## 2. Architecture Decision: Smart Appointment Booking

### 2.1 The "Register-on-the-Fly" Pattern

Instead of forcing pre-registration, the appointment booking modal becomes the single entry point for all visitor types. The system detects whether a patient exists (via phone number lookup) and either links to the existing record or creates a new one inline — all within the same booking flow.

**Flow Diagram:**

```
User clicks "Book Appointment"
        │
        ▼
┌─────────────────────────────┐
│  STEP 1: Quick Identification │
│  ┌─────────────────────────┐ │
│  │ Phone Number Input      │ │
│  │ [9876543210] [Search]   │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
        │
        ├── Patient FOUND ──────────────▶ Auto-fill name, age, gender, UID
        │                                  Show mini patient card
        │                                  Skip to Step 2
        │
        └── Patient NOT FOUND ──────────▶ Show inline registration fields
                                           (Name, Age, Gender, Blood Group, City)
                                           Patient created on appointment submit
                                           └─▶ Continue to Step 2
        │
        ▼
┌─────────────────────────────┐
│  STEP 2: Appointment Details  │
│  ┌─────────────────────────┐ │
│  │ Visitor Type (tabs):    │ │
│  │ [Patient] [MR] [Other]  │ │
│  │                         │ │
│  │ Doctor (auto-suggested  │ │
│  │   by department/reason) │ │
│  │ Date & Time Slot        │ │
│  │ Priority: Normal/Urgent │ │
│  │ Reason/Complaint        │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  STEP 3: Confirm & Token     │
│  Summary card with all info  │
│  [Confirm Booking] button    │
│  Token #42 generated         │
│  Print token slip (optional) │
└─────────────────────────────┘
```

### 2.2 Visitor Types

The appointment model must support different visitor categories since not everyone visiting a doctor is a registered patient:

| Visitor Type | Description | Patient Record? | Fields Required |
|---|---|---|---|
| **Patient** | Regular or new patient | Yes (created if new) | Full patient fields |
| **Medical Rep** | Pharma company representative | No | Name, Company, Phone, Purpose |
| **Attendant/Visitor** | Family visiting admitted patient | No | Name, Phone, Patient reference |
| **Emergency** | Unknown patient, register later | Yes (minimal) | Name (or "Unknown"), Gender, Age estimate |
| **Follow-Up** | Returning patient | Yes (existing) | Phone lookup only |

### 2.3 Database Changes Required

**New table: `visitors`**

```sql
CREATE TABLE visitors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  visitor_type ENUM('PATIENT','MEDICAL_REP','ATTENDANT','EMERGENCY','FOLLOW_UP') NOT NULL,
  patient_id INT NULL,                    -- links to patients table if type=PATIENT/FOLLOW_UP/EMERGENCY
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(15),
  company VARCHAR(150) NULL,              -- for Medical Reps
  purpose TEXT NULL,
  reference_patient_id INT NULL,          -- for Attendants visiting an admitted patient
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (reference_patient_id) REFERENCES patients(id)
);
```

**Modify `appointments` table:**

```sql
ALTER TABLE appointments
  ADD COLUMN visitor_id INT NULL AFTER patient_id,
  ADD COLUMN visitor_type ENUM('PATIENT','MEDICAL_REP','ATTENDANT','EMERGENCY','FOLLOW_UP') DEFAULT 'PATIENT',
  ADD COLUMN time_slot VARCHAR(20) NULL AFTER appointment_time,
  ADD FOREIGN KEY (visitor_id) REFERENCES visitors(id);
```

### 2.4 API Changes

**New endpoint: `POST /api/appointments/quick-book`**

This single endpoint handles the entire flow — patient lookup, optional registration, visitor creation, and appointment booking — in one atomic transaction.

```
POST /api/appointments/quick-book
Body:
{
  "phone": "9876543210",
  "visitor_type": "PATIENT",
  "name": "Ramesh Kumar",           // required if new patient
  "age": 45,                        // required if new patient
  "gender": "MALE",                 // required if new patient
  "blood_group": "B+",              // optional
  "city": "Ongole",                 // optional
  "company": null,                  // for MEDICAL_REP
  "purpose": null,                  // for MEDICAL_REP/ATTENDANT
  "reference_patient_id": null,     // for ATTENDANT
  "doctor_id": 3,
  "appointment_date": "2026-03-12",
  "appointment_time": "10:30",
  "time_slot": "10:30-10:45",
  "type": "WALK-IN",
  "priority": "NORMAL",
  "chief_complaint": "Persistent headache for 3 days"
}

Response:
{
  "success": true,
  "data": {
    "appointment_id": 142,
    "token_no": 42,
    "patient": { "id": 89, "patient_uid": "MF-0089", "name": "Ramesh Kumar", "is_new": true },
    "doctor": { "name": "Dr. Suresh", "specialization": "General Medicine" },
    "appointment_date": "2026-03-12",
    "time_slot": "10:30-10:45"
  }
}
```

**New endpoint: `GET /api/patients/lookup?phone=9876543210`**

Fast phone-based lookup that returns minimal patient info for the booking modal.

```
Response (found):
{ "success": true, "found": true, "data": { "id": 89, "patient_uid": "MF-0089", "name": "Ramesh Kumar", "age": 45, "gender": "MALE", "phone": "9876543210" } }

Response (not found):
{ "success": true, "found": false }
```

**New endpoint: `GET /api/doctors/available?date=2026-03-12&department_id=2`**

Returns doctors with their real-time slot availability for the selected date.

```
Response:
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Dr. Suresh",
      "specialization": "General Medicine",
      "department": "OP",
      "slots_available": 8,
      "slots_total": 20,
      "next_available": "10:45"
    }
  ]
}
```

---

## 3. Real-Time Dashboard Architecture

### 3.1 Current State Problems

1. Dashboard stat cards fetch data once on page load — no real-time updates
2. Cards are not clickable — no drill-down to detailed views
3. Revenue chart uses hardcoded fallback data
4. Patient flow widget has no click-through
5. No Socket.io integration on the frontend for live updates

### 3.2 Real-Time Data Flow Architecture

```
┌─────────────────┐     Socket.io Events      ┌──────────────────┐
│   Server-Side    │ ───────────────────────▶  │   Client-Side     │
│                  │                            │                   │
│  On any DB write │   "stats:update"           │  Zustand Store    │
│  (create/update  │   {                        │  useDashboard()   │
│   patient,       │     total_patients: 1247,  │                   │
│   appointment,   │     today_appointments: 42,│  Updates cards    │
│   invoice,       │     total_revenue: 284500, │  instantly via    │
│   bed change)    │     bed_occupancy: {       │  WebSocket        │
│                  │       occupied: 38,        │                   │
│  Emit socket     │       total: 50,           │  No polling.      │
│  event after     │       rate: 76.0           │  No refresh.      │
│  every mutation  │     }                      │                   │
│                  │   }                        │                   │
└─────────────────┘                            └──────────────────┘
```

### 3.3 Clickable Stat Cards — Navigation Map

Every stat card on every page must be clickable and navigate to the relevant detailed view with pre-applied filters:

**Dashboard Page Cards:**

| Card | Click Destination | Filter Applied |
|---|---|---|
| Total Patients | `/patients` | No filter (show all) |
| Today's Appointments | `/appointments?date=today` | Date = today |
| Total Revenue | `/billing?view=summary` | Revenue summary view |
| Bed Occupancy | `/icu?view=beds` | Bed allocation view |

**Appointments Page Cards:**

| Card | Click Action |
|---|---|
| Today's Appointments | Filter table: date = today |
| Waiting | Filter table: status = waiting |
| In Progress | Filter table: status = in-progress |
| Completed | Filter table: status = completed |

**Billing Page Cards:**

| Card | Click Destination |
|---|---|
| Today's Collection | Filter table: status = PAID, date = today |
| Pending Dues | Filter table: status = PENDING or PARTIAL |
| Total Invoices | Show all invoices |

**Pharmacy Page Cards:**

| Card | Click Action |
|---|---|
| Pending Prescriptions | Filter: status = pending |
| Dispensed Today | Filter: status = dispensed, date = today |
| Low Stock Alerts | Navigate to inventory with low stock filter |

**Lab Page Cards:**

| Card | Click Action |
|---|---|
| Pending Orders | Filter: status = pending |
| In Progress | Filter: status = processing |
| Completed Today | Filter: status = completed, date = today |

**Blood Bank Page Cards:**

| Card | Click Action |
|---|---|
| Total Units | Show all inventory |
| Pending Requests | Filter: status = pending |
| Critical Stock | Filter: units < threshold |

**ICU Dashboard Cards:**

| Card | Click Action |
|---|---|
| Total Beds | Show all beds |
| Occupied | Filter: status = occupied |
| Available | Filter: status = available |
| Critical Patients | Filter: severity = critical |

**Nursing Dashboard Cards:**

| Card | Click Action |
|---|---|
| Active Tasks | Filter: status = pending/in-progress |
| Completed Today | Filter: status = completed, date = today |
| Overdue | Filter: status = overdue |

### 3.4 Implementation Pattern — Reusable ClickableStat Component

```jsx
// components/ui/ClickableStat.jsx
const ClickableStat = ({ title, value, icon, colorClass, onClick, trend, loading }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold font-jakarta text-gray-900">
            {loading ? <Skeleton /> : value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-gray-500 ml-2">vs last week</span>
        </div>
      )}
    </CardContent>
  </Card>
);
```

### 3.5 Zustand Real-Time Store

```jsx
// store/dashboardStore.js
import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  stats: {
    total_patients: 0,
    today_appointments: 0,
    total_revenue: 0,
    bed_occupancy: { occupied: 0, total: 0, rate: 0 }
  },
  patientFlow: [],
  departmentLoad: [],
  revenueChart: [],
  isConnected: false,

  setStats: (stats) => set({ stats }),
  setPatientFlow: (flow) => set({ patientFlow: flow }),
  setDepartmentLoad: (load) => set({ departmentLoad: load }),
  setRevenueChart: (data) => set({ revenueChart: data }),
  setConnected: (val) => set({ isConnected: val }),
}));
```

### 3.6 Socket.io Client Hook

```jsx
// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDashboardStore } from '../store/dashboardStore';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { setStats, setPatientFlow, setConnected } = useDashboardStore();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

    socketRef.current.on('connect', () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));

    socketRef.current.on('stats:update', (data) => setStats(data));
    socketRef.current.on('patient-flow:update', (data) => setPatientFlow(data));
    socketRef.current.on('appointment:new', () => { /* trigger refetch */ });
    socketRef.current.on('appointment:status-change', () => { /* trigger refetch */ });
    socketRef.current.on('invoice:paid', () => { /* trigger refetch */ });
    socketRef.current.on('bed:status-change', () => { /* trigger refetch */ });

    return () => socketRef.current?.disconnect();
  }, []);

  return socketRef.current;
};
```

### 3.7 Server-Side Event Emitter Utility

```javascript
// server/utils/emitDashboardUpdate.js
const { getIo } = require('../config/socket');
const { Patient, Appointment, Invoice, Bed } = require('../models');
const { Op } = require('sequelize');

const emitDashboardUpdate = async () => {
  const io = getIo();
  const today = new Date().toISOString().split('T')[0];

  const [total_patients, today_appointments, total_revenue, occupiedBeds, totalBeds] = await Promise.all([
    Patient.count(),
    Appointment.count({ where: { appointment_date: today } }),
    Invoice.sum('grand_total', { where: { status: 'paid' } }) || 0,
    Bed.count({ where: { status: 'occupied' } }),
    Bed.count()
  ]);

  io.emit('stats:update', {
    total_patients,
    today_appointments,
    total_revenue,
    bed_occupancy: {
      occupied: occupiedBeds,
      total: totalBeds,
      rate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0
    }
  });
};

module.exports = { emitDashboardUpdate };
```

This utility is called after every relevant database mutation (patient create, appointment book, invoice paid, bed status change).

---

## 4. Page-by-Page Micro-Level Specification

### 4.1 Dashboard Page (`/dashboard`)

**Current Issues:**
- Revenue chart uses hardcoded data
- Patient flow widget not clickable
- No department load widget
- No recent activity feed
- Stat cards not clickable

**Required Components:**

| Component | Data Source | Real-Time? | Clickable? |
|---|---|---|---|
| Total Patients Card | `GET /dashboard/stats` + Socket | Yes | → `/patients` |
| Today's Appointments Card | `GET /dashboard/stats` + Socket | Yes | → `/appointments?date=today` |
| Total Revenue Card | `GET /dashboard/stats` + Socket | Yes | → `/billing` |
| Bed Occupancy Card | `GET /dashboard/stats` + Socket | Yes | → `/icu` |
| Revenue Chart (7-day) | `GET /dashboard/revenue-chart` | No (refresh on page load) | No |
| Patient Flow Pipeline | `GET /dashboard/patient-flow` + Socket | Yes | Each stage → filtered patient list |
| Department Load Widget | `GET /dashboard/department-load` | Yes | Each dept → respective page |
| Recent Activity Feed | `GET /dashboard/recent-activity` | Yes (Socket push) | Each item → relevant record |
| Quick Actions Bar | Static | No | Book Appt, Register Patient, Generate Invoice |

**New API Endpoints:**

```
GET /dashboard/revenue-chart?period=7d
→ Returns: [{ date: "2026-03-06", revenue: 45000 }, ...]

GET /dashboard/recent-activity?limit=10
→ Returns: [{ type: "appointment", action: "booked", patient: "Ramesh", time: "2m ago" }, ...]
```

### 4.2 Appointments Page (`/appointments`)

**Current Issues:**
- Booking requires pre-registered patient (critical problem)
- No doctor selection in booking modal
- No time slot picker
- No visitor type support
- Cards not clickable
- No search/filter on table

**Required Components:**

| Component | Specification |
|---|---|
| **Smart Booking Modal** | 3-step wizard: Phone Lookup → Details → Confirm (see Section 2) |
| **Stat Cards (4)** | Today's count, Waiting, In Progress, Completed — all clickable to filter table |
| **Appointment Table** | Columns: Token, Patient/Visitor, Doctor, Time Slot, Type, Priority, Status, Actions |
| **Search Bar** | Search by patient name, phone, UID, or token number |
| **Filter Bar** | Date picker, Status dropdown, Doctor dropdown, Type dropdown |
| **Token Display** | Large token badge with color-coded priority (green=normal, orange=urgent, red=emergency) |
| **Actions per row** | Check In → Start Consultation → Complete — progressive status buttons |
| **Print Token** | Button to print token slip after booking |
| **Calendar View Toggle** | Switch between table and day/week calendar view |

**Booking Modal Detail (3-Step Wizard):**

Step 1 — Identification:
- Phone number input with debounced search (300ms)
- If found: show patient card (name, UID, age, last visit)
- If not found: expand inline registration form (name, age, gender, blood group, city)
- Visitor type tabs: Patient | Medical Rep | Emergency | Other

Step 2 — Appointment Details:
- Department dropdown (auto-filters doctors)
- Doctor dropdown with availability badges (3/20 slots)
- Date picker (default today)
- Time slot grid (15-min intervals, greyed out if booked)
- Priority toggle: Normal | Urgent | Emergency
- Chief complaint text area
- Type: Walk-In | Scheduled | Follow-Up | Emergency

Step 3 — Confirmation:
- Summary card showing all details
- Estimated wait time (based on queue)
- Confirm button → generates token
- Post-confirm: show token number prominently + print option

### 4.3 Patients Page (`/patients`)

**Current Issues:**
- Registration form is minimal (missing address, Aadhar, emergency contact, allergies, insurance)
- View modal loads but some fields are empty
- No patient search by Aadhar or UID
- No patient timeline/journey view
- Stat cards missing

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Total Patients → all, Today's Registrations → today filter, Admitted → admitted filter, Discharged Today → discharged today |
| **Search Bar** | Search by name, phone, patient_uid, or aadhar_no |
| **Filter Bar** | Gender, Blood Group, Current Stage, City |
| **Patient Table** | UID, Name, Age/Gender, Phone, Stage (badge), Last Visit, Actions |
| **Register Modal (Full)** | All fields: Name, DOB, Age, Gender, Phone, Alt Phone, Email, Address, City, State, Pincode, Blood Group, Aadhar, Emergency Contact (name+phone), Insurance (provider+policy), Allergies, Chronic Conditions |
| **View Modal (Rich)** | Patient card header + tabbed view: Overview | Appointments | Prescriptions | Lab Reports | Billing | Journey Timeline |
| **Edit Modal** | Same as register but pre-filled |
| **Quick Book Button** | Inside view modal — book appointment directly for this patient |
| **Journey Timeline** | Visual pipeline showing patient's lifecycle stages with timestamps |
| **Export** | Export patient list as CSV/Excel |

### 4.4 Doctor Dashboard (`/doctor`)

**Current Issues:**
- Basic queue display
- No patient history quick view
- No consultation timer

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Today's Queue, Seen Today, In Consultation, Avg Wait Time — all clickable |
| **Queue List** | Ordered by token, shows patient name, complaint, priority, wait time |
| **Current Patient Card** | Expanded view of in-consultation patient: vitals, history, allergies |
| **Quick Prescribe** | Inline prescription creation without navigating away |
| **Consultation Timer** | Auto-starts when consultation begins, shows elapsed time |
| **Patient History Sidebar** | Past visits, prescriptions, lab results for the current patient |
| **Call Next Button** | One click to call next patient in queue |

### 4.5 Consultation Page (`/doctor/consultation/:id`)

**Current Issues:**
- Prescription form exists but routing logic is basic
- No vitals recording in-page
- No lab result viewing

**Required Components:**

| Component | Specification |
|---|---|
| **Patient Header** | Name, UID, Age, Gender, Blood Group, Allergies (highlighted in red) |
| **Vitals Section** | Record/view BP, Temp, Pulse, SpO2, Weight, Height — with trend charts |
| **Diagnosis Section** | ICD-10 searchable diagnosis input |
| **Prescription Builder** | Add medicines (auto-complete from medicines table), dosage, frequency, duration, route |
| **Auto-Routing Preview** | Shows where each prescription item routes: Pharmacy/Nursing/Lab/Radiology |
| **Lab Orders Section** | Order labs directly, view pending/completed results |
| **Radiology Orders** | Order imaging, view reports |
| **Notes Section** | Doctor's clinical notes with rich text |
| **Referral Button** | Refer to another department/doctor |
| **Complete & Discharge** | End consultation, update patient stage |
| **Print Prescription** | Generate printable prescription PDF |

### 4.6 Pharmacy Page (`/pharmacy`)

**Current Issues:**
- Basic dispensing table
- No medicine inventory management
- No stock alerts

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Pending Rx → filter pending, Dispensed Today → filter today, Low Stock Count → inventory alert view, Revenue Today → filter today's pharmacy revenue |
| **Pending Queue** | Prescription items routed to pharmacy, ordered by priority+time |
| **Dispense Action** | Select medicine from inventory, enter quantity, batch, expiry → mark dispensed |
| **Inventory Tab** | Full medicine inventory: name, stock, reorder level, expiry, price |
| **Add Stock Modal** | Add new stock with batch tracking |
| **Low Stock Alerts** | Highlighted rows for medicines below reorder level |
| **Search** | By patient name, medicine name, or prescription ID |
| **Barcode Scan** | Placeholder for barcode-based dispensing |

### 4.7 Lab Page (`/lab`)

**Current Issues:**
- Basic order list
- No result entry form
- No sample tracking

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Pending → filter, Processing → filter, Completed Today → filter, Avg TAT (turnaround time) |
| **Order Queue** | Lab orders with patient, test name, priority, ordered by, time ordered |
| **Sample Collection** | Mark sample collected with timestamp |
| **Result Entry** | Per-test result form: value, unit, reference range, flag (normal/abnormal) |
| **Result View** | Formatted lab report with normal ranges highlighted |
| **Print Report** | Generate lab report PDF |
| **Status Pipeline** | Visual: Ordered → Sample Collected → Processing → Completed |
| **Bulk Actions** | Mark multiple as collected/processing |

### 4.8 Radiology Page (`/radiology`)

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (3)** | Pending Scans, Completed Today, Avg TAT |
| **Order Queue** | Imaging orders: patient, scan type, priority, referring doctor |
| **Report Entry** | Findings text area, impression, images upload placeholder |
| **Status Updates** | Scheduled → In Progress → Completed |
| **Print Report** | Radiology report PDF |

### 4.9 Nursing Dashboard (`/nursing`)

**Current Issues:**
- Basic task list
- No vitals recording integration
- No shift handover

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Active Tasks → filter, Completed Today → filter, Overdue → filter, Patients Assigned |
| **Task Queue** | Nursing tasks (injections, IV, dressings) with patient, priority, due time |
| **Vitals Recording** | Quick vitals entry per patient: BP, Temp, Pulse, SpO2 |
| **Task Actions** | Start → In Progress → Complete with timestamp |
| **Shift Handover** | View/generate shift summary report |
| **Medication Schedule** | Timeline view of when each medication is due |
| **Alert Badge** | Red badge on overdue tasks |

### 4.10 Billing Page (`/billing`)

**Current Issues:**
- Invoice generation works but stats are client-calculated
- No receipt printing
- Payment modal exists but limited

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Today's Collection, Pending Dues, Total Invoices, Insurance Pending — all clickable |
| **Invoice Table** | Invoice #, Patient, Date, Grand Total, Paid, Balance, Status, Actions |
| **Generate Invoice** | Auto-pull all billable items (consultation, pharmacy, lab, radiology, room charges) |
| **Payment Modal** | Amount, Method (Cash/Card/UPI/Insurance), Transaction Ref, Partial payment support |
| **Invoice View** | Detailed invoice with line items, taxes, discounts, payments made |
| **Print Invoice** | PDF invoice generation |
| **Receipt Print** | PDF receipt for payments |
| **Insurance Claim** | Link to insurance claim creation |
| **Date Range Filter** | Filter invoices by date range |
| **Export** | Export billing data as CSV/Excel |

### 4.11 Insurance Page (`/insurance`)

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (3)** | Pending Claims, Approved Today, Total Claimed Amount |
| **Claims Table** | Claim ID, Patient, Invoice, Provider, Amount, Status, Actions |
| **New Claim** | Link to invoice, select provider, enter policy details, submit |
| **Claim Status Updates** | Submitted → Under Review → Approved/Rejected/Partial |
| **Document Upload** | Placeholder for claim documents |

### 4.12 Blood Bank Page (`/bloodbank`)

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Total Units, Pending Requests → filter, Critical Stock (units < 5), Donors Registered |
| **Inventory Grid** | Blood group wise: A+, A-, B+, B-, AB+, AB-, O+, O- with unit counts + expiry alerts |
| **Request Management** | Incoming requests, match against inventory, approve/reject |
| **Donor Registry** | Donor list with last donation date, eligibility status |
| **Add Stock** | Record incoming units: group, type (whole/packed/plasma/platelets), collection date, expiry |
| **Cross-Match** | Link request to compatible inventory |

### 4.13 ICU Dashboard (`/icu`)

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (4)** | Total Beds, Occupied → filter, Available → filter, Critical Patients |
| **Bed Grid** | Visual grid/map: each bed shows status (color), patient name, admission date |
| **Bed Allocation** | Assign patient to bed with admission details |
| **Discharge from Bed** | Release bed, update patient stage |
| **Ward Filter** | Filter beds by ward (ICU, General, Semi-Private, Private) |
| **Vitals Monitor** | Latest vitals for each occupied bed |
| **Bed Click** | Click any bed → patient details modal |

### 4.14 Ambulance Page (`/ambulance`)

**Required Components:**

| Component | Specification |
|---|---|
| **Stat Cards (3)** | Total Ambulances, On Trip, Available |
| **Ambulance List** | Vehicle #, Driver, Status, Current Trip, Actions |
| **Dispatch** | Assign ambulance to trip: pickup, destination, patient, priority |
| **Trip Tracking** | Status: Dispatched → En Route → Arrived → Returning → Available |
| **Trip History** | Past trips with patient, route, duration |

### 4.15 Settings Page (`/settings`)

**Required Components:**

| Component | Specification |
|---|---|
| **Hospital Profile** | Name, address, phone, email, logo upload placeholder |
| **Department Management** | CRUD departments |
| **User Management** | CRUD users with roles (admin, doctor, nurse, pharmacist, receptionist, lab_tech, etc.) |
| **Role Permissions** | Matrix view: role × feature access |
| **System Config** | Token reset time (daily), appointment slot duration, consultation fee defaults |
| **Audit Log Viewer** | Filterable audit log |

### 4.16 Analytics Page (`/analytics`)

**Required Components:**

| Component | Specification |
|---|---|
| **KPI Overview Cards** | Avg Wait Time, Patient Satisfaction Placeholder, Daily Footfall, Revenue per Day |
| **Charts** | Revenue trend (30d), Department-wise load, Patient demographics, Peak hours heatmap |
| **Feature Adoption** | Feature usage metrics (for product analytics) |
| **Query Builder** | Custom report builder |
| **Export** | Download any chart/report as PDF/CSV |

---

## 5. Reusable UI Components Needed

### 5.1 New Components to Build

| Component | Location | Purpose |
|---|---|---|
| `ClickableStat` | `components/ui/ClickableStat.jsx` | Stat card with click navigation + hover effect |
| `Skeleton` | `components/ui/Skeleton.jsx` | Loading placeholder for cards/tables |
| `StatusBadge` | `components/ui/StatusBadge.jsx` | Reusable colored badge for any status |
| `StepWizard` | `components/ui/StepWizard.jsx` | Multi-step form wrapper (for booking flow) |
| `PhoneLookup` | `components/ui/PhoneLookup.jsx` | Debounced phone search with result display |
| `TimeSlotPicker` | `components/ui/TimeSlotPicker.jsx` | Grid of 15-min slots with availability |
| `FilterBar` | `components/ui/FilterBar.jsx` | Reusable filter row (dropdowns + date + search) |
| `Tabs` | `components/ui/Tabs.jsx` | Tab navigation component |
| `Timeline` | `components/ui/Timeline.jsx` | Vertical timeline for patient journey |
| `EmptyState` | `components/ui/EmptyState.jsx` | Friendly empty state with icon + message |
| `ConfirmDialog` | `components/ui/ConfirmDialog.jsx` | Confirmation before destructive actions |
| `PrintLayout` | `components/ui/PrintLayout.jsx` | Hidden print-friendly layout wrapper |
| `LiveIndicator` | `components/ui/LiveIndicator.jsx` | Green dot + "Live" text for real-time data |
| `SearchInput` | `components/ui/SearchInput.jsx` | Debounced search input with clear button |
| `Pagination` | `components/ui/Pagination.jsx` | Table pagination component |
| `DateRangePicker` | `components/ui/DateRangePicker.jsx` | Date range selector for reports/filters |
| `Tooltip` | `components/ui/Tooltip.jsx` | Info tooltips on hover |

### 5.2 Existing Components to Enhance

| Component | Enhancement |
|---|---|
| `DataTable` | Add sorting, column visibility toggle, row selection, pagination, search |
| `Modal` | Add size variants (sm, md, lg, xl, full), slide-in option |
| `Input` | Add icon prefix/suffix support, error state styling |
| `Button` | Add loading state with spinner, icon-only variant |
| `Card` | Add onClick support, hover states, loading skeleton |

---

## 6. Server-Side Enhancements

### 6.1 New API Endpoints Required

| Method | Endpoint | Purpose | Controller |
|---|---|---|---|
| POST | `/appointments/quick-book` | Smart booking (register + book) | appointment.controller |
| GET | `/patients/lookup?phone=` | Fast phone lookup | patient.controller |
| GET | `/doctors/available?date=&dept=` | Doctor availability | appointment.controller |
| GET | `/dashboard/revenue-chart?period=` | Revenue chart data | dashboard.controller |
| GET | `/dashboard/recent-activity?limit=` | Activity feed | dashboard.controller |
| GET | `/dashboard/department-load` | Already exists, enhance | dashboard.controller |
| GET | `/pharmacy/inventory` | Medicine inventory list | pharmacy.controller |
| POST | `/pharmacy/inventory` | Add stock | pharmacy.controller |
| GET | `/pharmacy/low-stock` | Medicines below reorder | pharmacy.controller |
| POST | `/lab/:id/result` | Enter lab result | lab.controller |
| GET | `/lab/:id/result` | View lab result | lab.controller |
| POST | `/radiology/:id/report` | Enter radiology report | radiology.controller |
| GET | `/patients/:id/timeline` | Patient journey timeline | patient.controller |
| GET | `/patients/export?format=csv` | Export patient list | patient.controller |
| GET | `/billing/export?format=csv` | Export billing data | billing.controller |
| POST | `/appointments/:id/print-token` | Generate token slip | appointment.controller |
| POST | `/billing/:id/print-receipt` | Generate receipt PDF | billing.controller |
| GET | `/settings/audit-log` | Audit log list | settings.controller |
| PUT | `/settings/hospital` | Update hospital settings | settings.controller |
| GET | `/analytics/kpi` | KPI metrics | analytics.controller |

### 6.2 Socket Events to Implement

| Event Name | Triggered When | Data Emitted |
|---|---|---|
| `stats:update` | Any stat-affecting DB write | Full stats object |
| `patient-flow:update` | Patient stage change | Updated stage distribution |
| `appointment:new` | New appointment booked | Appointment summary |
| `appointment:status-change` | Check-in/start/complete | Appointment id + new status |
| `queue:update` | Any queue change | Updated queue for doctor |
| `prescription:new` | New prescription created | Routed items summary |
| `invoice:paid` | Payment recorded | Invoice id + amount |
| `bed:status-change` | Bed alloc/discharge | Bed id + new status |
| `lab:result-ready` | Lab result entered | Order id + patient |
| `pharmacy:dispensed` | Medicine dispensed | Prescription item id |
| `nursing:task-assigned` | New nursing task | Task summary |
| `low-stock:alert` | Stock below reorder | Medicine + current stock |

### 6.3 Middleware Enhancement — Auto-Emit After Mutations

```javascript
// middleware/socketEmitter.middleware.js
const { emitDashboardUpdate } = require('../utils/emitDashboardUpdate');

const socketEmitter = (eventType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Emit after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        emitDashboardUpdate().catch(console.error);
        
        // Emit specific event
        const io = require('../config/socket').getIo();
        io.emit(eventType, data?.data || data);
      }
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = socketEmitter;
```

Usage in routes:

```javascript
router.post('/appointments/quick-book', auth, socketEmitter('appointment:new'), appointmentController.quickBook);
router.put('/appointments/:id/checkin', auth, socketEmitter('appointment:status-change'), appointmentController.checkIn);
```

---

## 7. Global Button & Interaction Audit

Every button in the application must have a defined action. No button should be non-functional.

### 7.1 Global Actions (Present on Every Page)

| Button/Element | Location | Action |
|---|---|---|
| Sidebar menu items | Sidebar | Navigate to respective route |
| Notification bell | Topbar | Open notification dropdown with unread count |
| User avatar | Topbar | Open profile dropdown: Profile, Settings, Logout |
| Search (global) | Topbar | Global search: patients, appointments, invoices by keyword |
| Breadcrumbs | Below topbar | Navigate to parent route |

### 7.2 Common Table Actions

| Button | Action |
|---|---|
| View (Eye icon) | Open detail modal/page |
| Edit (Pencil icon) | Open edit modal |
| Delete (Trash icon) | Confirm dialog → delete |
| Print (Printer icon) | Generate PDF and trigger browser print |
| Download (Download icon) | Download as PDF/CSV |
| Status change buttons | Update status via API + Socket emit |

### 7.3 Quick Action Buttons (Dashboard)

| Button | Action |
|---|---|
| Book Appointment | Open Smart Booking Modal |
| Register Patient | Open Full Registration Modal |
| Generate Invoice | Navigate to billing with create mode |
| View Reports | Navigate to analytics |

---

## 8. Implementation Priority & Phases

### Phase 1 — Critical (Week 1-2)

1. **Smart Booking Modal** — Register-on-the-fly appointment system
2. **`/appointments/quick-book` API** — Atomic registration + booking
3. **`/patients/lookup` API** — Phone-based patient search
4. **ClickableStat component** — Reusable across all pages
5. **Dashboard cards clickable** — Navigate to respective pages
6. **Socket.io client integration** — `useSocket` hook + dashboard store
7. **Server-side socket emitters** — After all mutation endpoints

### Phase 2 — Core Enhancement (Week 3-4)

8. **Dashboard real-time** — Revenue chart API, activity feed, department load
9. **Appointments page** — Filters, search, calendar view toggle
10. **Patients page** — Full registration form, rich view modal with tabs, timeline
11. **Doctor dashboard** — Queue management, consultation timer
12. **Consultation page** — Vitals, prescription builder, auto-routing preview

### Phase 3 — Department Pages (Week 5-6)

13. **Pharmacy** — Inventory management, stock alerts, dispense flow
14. **Lab** — Result entry, sample tracking, status pipeline
15. **Radiology** — Report entry, status management
16. **Nursing** — Task queue, vitals recording, shift handover
17. **Billing** — Receipt printing, insurance claim flow, export

### Phase 4 — Polish (Week 7-8)

18. **ICU** — Bed grid visualization, ward filtering
19. **Blood Bank** — Inventory grid, donor registry, cross-match
20. **Ambulance** — Dispatch, trip tracking
21. **Settings** — User management, role permissions, audit log
22. **Analytics** — KPI dashboard, charts, query builder
23. **Global search** — Cross-module search in topbar
24. **Print/Export** — PDF generation for tokens, invoices, reports, prescriptions

---

## 9. File Structure — New & Modified Files

```
client/src/
├── components/
│   ├── ui/
│   │   ├── ClickableStat.jsx          [NEW]
│   │   ├── Skeleton.jsx               [NEW]
│   │   ├── StatusBadge.jsx            [NEW]
│   │   ├── StepWizard.jsx             [NEW]
│   │   ├── PhoneLookup.jsx            [NEW]
│   │   ├── TimeSlotPicker.jsx         [NEW]
│   │   ├── FilterBar.jsx              [NEW]
│   │   ├── Tabs.jsx                   [NEW]
│   │   ├── Timeline.jsx               [NEW]
│   │   ├── EmptyState.jsx             [NEW]
│   │   ├── ConfirmDialog.jsx          [NEW]
│   │   ├── SearchInput.jsx            [NEW]
│   │   ├── Pagination.jsx             [NEW]
│   │   ├── LiveIndicator.jsx          [NEW]
│   │   ├── DateRangePicker.jsx        [NEW]
│   │   ├── Tooltip.jsx                [NEW]
│   │   ├── PrintLayout.jsx            [NEW]
│   │   ├── DataTable.jsx              [ENHANCE]
│   │   ├── Modal.jsx                  [ENHANCE]
│   │   ├── Input.jsx                  [ENHANCE]
│   │   ├── Button.jsx                 [ENHANCE]
│   │   └── Card.jsx                   [ENHANCE]
│   └── layout/
│       ├── AppLayout.jsx              [ENHANCE - add breadcrumbs]
│       ├── Sidebar.jsx                [ENHANCE - active state, badges]
│       └── Topbar.jsx                 [ENHANCE - global search, notifications]
├── hooks/
│   ├── useSocket.js                   [NEW]
│   ├── useDebounce.js                 [NEW]
│   └── useFilters.js                  [NEW]
├── store/
│   ├── authStore.js                   [EXISTING]
│   ├── uiStore.js                     [EXISTING]
│   └── dashboardStore.js              [NEW]
├── pages/
│   ├── appointments/
│   │   ├── AppointmentsPage.jsx       [REWRITE]
│   │   └── SmartBookingModal.jsx      [NEW]
│   ├── dashboard/
│   │   └── DashboardPage.jsx          [REWRITE]
│   ├── patients/
│   │   └── PatientsPage.jsx           [ENHANCE]
│   └── [all other pages]              [ENHANCE per specs above]
└── utils/
    ├── formatters.js                  [NEW - currency, date, time utils]
    └── constants.js                   [NEW - status colors, stage labels]

server/
├── controllers/
│   ├── appointment.controller.js      [ENHANCE - add quickBook, lookup]
│   ├── dashboard.controller.js        [ENHANCE - add revenueChart, activity]
│   ├── patient.controller.js          [ENHANCE - add lookup, timeline, export]
│   └── [all controllers]              [ENHANCE per API specs]
├── models/
│   └── Visitor.model.js               [NEW]
├── utils/
│   └── emitDashboardUpdate.js         [NEW]
├── middleware/
│   └── socketEmitter.middleware.js     [NEW]
└── routes/
    └── [all routes]                   [ENHANCE - add new endpoints]
```

---

## 10. Technical Standards

### 10.1 API Response Format (Consistent across all endpoints)

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 10.2 Error Response Format

```json
{
  "success": false,
  "message": "Human readable error",
  "code": "VALIDATION_ERROR",
  "errors": [{ "field": "phone", "message": "Phone is required" }]
}
```

### 10.3 Frontend Conventions

- All API calls through `lib/axios.js` with interceptors
- Toast notifications for all mutations (loading, success, error)
- Skeleton loading states on all data-dependent components
- Debounce all search inputs (300ms)
- URL query params for filters (shareable filtered views)
- Responsive: Mobile-first, breakpoints at md (768px) and lg (1024px)

### 10.4 Socket Convention

- Event names: `entity:action` format (e.g., `appointment:new`, `bed:status-change`)
- Always emit full dashboard stats after any stat-affecting mutation
- Client subscribes on mount, unsubscribes on unmount

---

*End of Architecture Plan — MediFlow HMS v2.0*
