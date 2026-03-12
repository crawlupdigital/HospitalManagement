import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/ui/Modal';
import StepWizard from '../../components/ui/StepWizard';
import TimeSlotPicker from '../../components/ui/TimeSlotPicker';
import Tabs from '../../components/ui/Tabs';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, User, CheckCircle, Printer, AlertCircle } from 'lucide-react';
import { VISITOR_TYPES, BLOOD_GROUPS } from '../../utils/constants';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const SmartBookingModal = ({ isOpen, onClose, onBooked }) => {
  const [step, setStep] = useState(0);
  const [visitorType, setVisitorType] = useState('PATIENT');

  // Step 1 — Patient lookup
  const [phone, setPhone] = useState('');
  const [lookupResult, setLookupResult] = useState(null); // null = not searched, false = not found, object = found
  const [isSearching, setIsSearching] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'MALE', blood_group: '', city: '' });

  // Medical Rep fields
  const [repData, setRepData] = useState({ name: '', company: '', phone: '', purpose: '' });

  // Step 2 — Appointment details
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    department_id: '', doctor_id: '', appointment_date: new Date().toISOString().split('T')[0],
    time_slot: '', appointment_time: '', priority: 'NORMAL', type: 'WALK-IN', chief_complaint: ''
  });

  // Step 3 — Result
  const [bookingResult, setBookingResult] = useState(null);

  // ─── Fetch departments on mount
  useEffect(() => {
    if (isOpen) {
      api.get('/appointments/doctors/available').then(res => {
        if (res.data?.data) setDoctors(res.data.data);
      }).catch(() => {});
    }
  }, [isOpen]);

  // ─── Phone Lookup
  const handlePhoneLookup = async () => {
    if (phone.length < 10) return;
    setIsSearching(true);
    try {
      const res = await api.get(`/patients/lookup?phone=${phone}`);
      if (res.data?.found) {
        setLookupResult(res.data.data);
      } else {
        setLookupResult(false);
      }
    } catch (e) {
      setLookupResult(false);
    } finally {
      setIsSearching(false);
    }
  };

  // ─── Fetch doctors when date changes
  useEffect(() => {
    if (form.appointment_date) {
      const params = new URLSearchParams({ date: form.appointment_date });
      if (form.department_id) params.append('department_id', form.department_id);
      api.get(`/appointments/doctors/available?${params}`).then(res => {
        if (res.data?.data) setDoctors(res.data.data);
      }).catch(() => {});
    }
  }, [form.appointment_date, form.department_id]);

  // ─── Can proceed to step 2?
  const canProceedStep1 = () => {
    if (visitorType === 'MEDICAL_REP') return repData.name && repData.company;
    if (lookupResult) return true; // existing patient
    if (lookupResult === false) return newPatient.name && newPatient.age && newPatient.gender;
    return false;
  };

  // ─── Submit booking
  const handleSubmit = async () => {
    const patientInfo = lookupResult || {};
    
    const body = {
      phone: visitorType === 'MEDICAL_REP' ? repData.phone : phone,
      visitor_type: visitorType,
      name: visitorType === 'MEDICAL_REP' ? repData.name : (patientInfo.name || newPatient.name),
      age: patientInfo.age || parseInt(newPatient.age) || 0,
      gender: patientInfo.gender || newPatient.gender,
      blood_group: patientInfo.blood_group || newPatient.blood_group || null,
      city: patientInfo.city || newPatient.city || null,
      company: repData.company || null,
      purpose: repData.purpose || null,
      doctor_id: parseInt(form.doctor_id),
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time || '09:00',
      time_slot: form.time_slot || null,
      type: form.type,
      priority: form.priority,
      chief_complaint: form.chief_complaint || null
    };

    try {
      const res = await toast.promise(
        api.post('/appointments/quick-book', body),
        { loading: 'Booking appointment...', success: 'Appointment booked!', error: (e) => e.response?.data?.message || 'Booking failed' }
      );
      if (res.data?.data) {
        setBookingResult(res.data.data);
        setStep(2);
        if (onBooked) onBooked();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Reset
  const handleClose = () => {
    setStep(0); setPhone(''); setLookupResult(null); setNewPatient({ name: '', age: '', gender: 'MALE', blood_group: '', city: '' });
    setRepData({ name: '', company: '', phone: '', purpose: '' });
    setForm({ department_id: '', doctor_id: '', appointment_date: new Date().toISOString().split('T')[0], time_slot: '', appointment_time: '', priority: 'NORMAL', type: 'WALK-IN', chief_complaint: '' });
    setBookingResult(null); setVisitorType('PATIENT');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Smart Appointment Booking" maxWidth="lg">
      <StepWizard steps={['Identification', 'Appointment Details', 'Confirmation']} currentStep={step}>

        {/* ═══ STEP 1: Identification ═══ */}
        {step === 0 && (
          <div className="space-y-5">
            <Tabs 
              tabs={VISITOR_TYPES.slice(0, 4)}
              activeTab={visitorType} 
              onChange={(v) => { setVisitorType(v); setLookupResult(null); setPhone(''); }}
            />

            {visitorType === 'MEDICAL_REP' ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rep Name *</label>
                    <Input value={repData.name} onChange={e => setRepData({...repData, name: e.target.value})} placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <Input value={repData.company} onChange={e => setRepData({...repData, company: e.target.value})} placeholder="Pharma Company" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input value={repData.phone} onChange={e => setRepData({...repData, phone: e.target.value})} placeholder="Phone Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <Input value={repData.purpose} onChange={e => setRepData({...repData, purpose: e.target.value})} placeholder="Meeting purpose" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Phone Lookup */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setLookupResult(null); }}
                      onKeyDown={e => e.key === 'Enter' && handlePhoneLookup()}
                      placeholder="Enter 10-digit phone number..."
                      className="w-full h-10 pl-9 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button 
                    type="button" 
                    className="bg-blue-600 hover:bg-blue-700" 
                    onClick={handlePhoneLookup}
                    disabled={phone.length < 10 || isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {/* Found — Patient Card */}
                {lookupResult && lookupResult !== false && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">
                      {lookupResult.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{lookupResult.name}</p>
                      <p className="text-xs text-gray-500">{lookupResult.patient_uid} • {lookupResult.age}y • {lookupResult.gender} • {lookupResult.phone}</p>
                      {lookupResult.allergies && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Allergies: {lookupResult.allergies}</p>
                      )}
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}

                {/* Not Found — Inline Registration */}
                {lookupResult === false && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                      <User className="w-4 h-4" /> Patient not found — register inline:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                        <Input value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="Patient Name" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Age *</label>
                        <Input type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} placeholder="Age" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Gender *</label>
                        <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Blood Group</label>
                        <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm" value={newPatient.blood_group} onChange={e => setNewPatient({...newPatient, blood_group: e.target.value})}>
                          <option value="">-</option>
                          {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                      <Input value={newPatient.city} onChange={e => setNewPatient({...newPatient, city: e.target.value})} placeholder="City" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!canProceedStep1()} onClick={() => setStep(1)}>
                Next: Appointment Details →
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Appointment Details ═══ */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select required className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm" value={form.doctor_id} onChange={e => setForm({...form, doctor_id: e.target.value})}>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialization} ({d.slots_available}/{d.slots_total} slots)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <Input type="date" value={form.appointment_date} onChange={e => setForm({...form, appointment_date: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
              <TimeSlotPicker 
                selectedSlot={form.time_slot}
                onSelect={(slot, time) => setForm({...form, time_slot: slot, appointment_time: time})}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="WALK-IN">Walk-In</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="FOLLOW-UP">Follow-Up</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>
              <div className="col-span-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
              <textarea 
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500"
                value={form.chief_complaint}
                onChange={e => setForm({...form, chief_complaint: e.target.value})}
                placeholder="Patient's primary complaint or reason for visit..."
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={() => setStep(0)}>← Back</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!form.doctor_id} onClick={handleSubmit}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Confirmation ═══ */}
        {step === 2 && bookingResult && (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Appointment Booked Successfully!</h2>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white max-w-xs mx-auto shadow-xl">
              <p className="text-blue-200 text-sm mb-1">Token Number</p>
              <p className="text-6xl font-bold font-jakarta">{bookingResult.token_no}</p>
              <div className="mt-4 space-y-1 text-sm text-blue-100">
                <p>{bookingResult.patient?.name || bookingResult.visitor?.name}</p>
                {bookingResult.patient?.patient_uid && <p className="text-xs opacity-80">{bookingResult.patient.patient_uid} {bookingResult.patient.is_new ? '(NEW)' : ''}</p>}
                <p>{bookingResult.doctor?.name} — {bookingResult.doctor?.specialization}</p>
                <p>{bookingResult.appointment_date} • {bookingResult.time_slot}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="ghost" className="gap-2" onClick={() => window.print()}>
                <Printer className="w-4 h-4" /> Print Token
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </StepWizard>
    </Modal>
  );
};

export default SmartBookingModal;
