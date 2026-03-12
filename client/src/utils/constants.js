export const STAGE_COLORS = {
  reception: 'bg-gray-100 text-gray-700',
  triage: 'bg-yellow-100 text-yellow-700',
  consultation: 'bg-blue-100 text-blue-700',
  pharmacy: 'bg-purple-100 text-purple-700',
  nursing: 'bg-rose-100 text-rose-700',
  lab: 'bg-indigo-100 text-indigo-700',
  radiology: 'bg-cyan-100 text-cyan-700',
  billing: 'bg-green-100 text-green-700',
  discharged: 'bg-emerald-100 text-emerald-700',
  admitted: 'bg-orange-100 text-orange-700',
};

export const STAGE_LABELS = {
  reception: 'Reception',
  triage: 'Triage',
  consultation: 'Consultation',
  pharmacy: 'Pharmacy',
  nursing: 'Nursing',
  lab: 'Lab',
  radiology: 'Radiology',
  billing: 'Billing',
  discharged: 'Discharged',
  admitted: 'Admitted',
};

export const STATUS_COLORS = {
  'WAITING': 'bg-yellow-100 text-yellow-700',
  'IN-PROGRESS': 'bg-blue-100 text-blue-700',
  'COMPLETED': 'bg-green-100 text-green-700',
  'CANCELLED': 'bg-red-100 text-red-700',
  'NO-SHOW': 'bg-gray-100 text-gray-500',
};

export const PRIORITY_COLORS = {
  'NORMAL': 'bg-blue-100 text-blue-700',
  'URGENT': 'bg-orange-100 text-orange-700',
  'EMERGENCY': 'bg-red-100 text-red-700',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const VISITOR_TYPES = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'MEDICAL_REP', label: 'Medical Rep' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
  { value: 'ATTENDANT', label: 'Attendant/Visitor' },
];
