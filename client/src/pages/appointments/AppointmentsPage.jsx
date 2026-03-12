import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { CalendarDays, Plus, UserCheck, Play, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookData, setBookData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/appointments');
      if (res.data?.data) {
        const formatted = res.data.data.map(a => ({
          id: a.id,
          token: a.token_no,
          patientName: a.Patient?.name || 'Unknown',
          patientUid: a.Patient?.patient_uid || '-',
          doctorName: a.User?.name || 'Unassigned',
          specialization: a.User?.specialization || '',
          date: a.appointment_date,
          reason: a.reason,
          status: a.status,
          checkedIn: !!a.checked_in_at
        }));
        setAppointments(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [pRes] = await Promise.all([
        api.get('/patients')
      ]);
      if (pRes.data?.data) {
        const pData = pRes.data.data;
        setPatients(Array.isArray(pData) ? pData : (pData.rows || []));
      }
    } catch (e) { /* ignore for demo */ }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDropdowns();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        api.post('/appointments', bookData),
        {
          loading: 'Booking appointment...',
          success: 'Appointment booked! Token generated.',
          error: 'Failed to book appointment.'
        }
      );
      setIsBookOpen(false);
      setBookData({ patient_id: '', doctor_id: '', appointment_date: new Date().toISOString().split('T')[0], reason: '' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await toast.promise(
        api.put(`/appointments/${id}/checkin`),
        {
          loading: 'Checking in patient...',
          success: 'Patient checked in. Stage moved to Triage.',
          error: 'Check-in failed.'
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async (id) => {
    try {
      await toast.promise(
        api.put(`/appointments/${id}/start`),
        {
          loading: 'Starting consultation...',
          success: 'Consultation started.',
          error: 'Failed to start consultation.'
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await toast.promise(
        api.put(`/appointments/${id}/complete`),
        {
          loading: 'Completing consultation...',
          success: 'Consultation completed.',
          error: 'Failed to complete.'
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status, checkedIn) => {
    const map = {
      waiting: checkedIn ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-violet-100 text-violet-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    {
      header: 'Token',
      cell: (row) => (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
          {row.token}
        </span>
      )
    },
    {
      header: 'Patient',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.patientName}</div>
          <div className="text-xs text-gray-500">{row.patientUid}</div>
        </div>
      )
    },
    {
      header: 'Doctor',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.doctorName}</div>
          <div className="text-xs text-indigo-500">{row.specialization}</div>
        </div>
      )
    },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Reason', accessorKey: 'reason', cell: (row) => <span className="text-sm text-gray-600">{row.reason || '-'}</span> },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(row.status, row.checkedIn)}`}>
          {row.checkedIn && row.status === 'waiting' ? 'Checked In' : row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          {row.status === 'waiting' && !row.checkedIn && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1" onClick={() => handleCheckIn(row.id)}>
              <UserCheck className="w-3 h-3" /> Check In
            </Button>
          )}
          {row.status === 'waiting' && row.checkedIn && (
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1" onClick={() => handleStart(row.id)}>
              <Play className="w-3 h-3" /> Start
            </Button>
          )}
          {row.status === 'in-progress' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={() => handleComplete(row.id)}>
              <CheckCircle className="w-3 h-3" /> Complete
            </Button>
          )}
          {row.status === 'completed' && (
            <span className="text-xs text-green-600 font-medium">Done</span>
          )}
        </div>
      )
    }
  ];

  const todayAppts = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-jakarta text-gray-900">Appointment Scheduler</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsBookOpen(true)}>
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
          <CardContent className="p-5">
            <p className="text-blue-100 text-sm">Today's Appointments</p>
            <h3 className="text-3xl font-bold mt-1">{todayAppts.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm">Waiting</p>
            <h3 className="text-3xl font-bold text-yellow-600 mt-1">{appointments.filter(a => a.status === 'waiting').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm">In Progress</p>
            <h3 className="text-3xl font-bold text-violet-600 mt-1">{appointments.filter(a => a.status === 'in-progress').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm">Completed</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">{appointments.filter(a => a.status === 'completed').length}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gray-500" /> All Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={appointments}
            emptyMessage={isLoading ? 'Loading appointments...' : 'No appointments found.'}
          />
        </CardContent>
      </Card>

      {/* Book Appointment Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="Book New Appointment" maxWidth="md">
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              required
              className="w-full text-sm border-gray-300 rounded-md p-2"
              value={bookData.patient_id}
              onChange={(e) => setBookData({ ...bookData, patient_id: e.target.value })}
            >
              <option value="">Select Patient…</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.patient_uid})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
            <Input
              type="date"
              required
              value={bookData.appointment_date}
              onChange={(e) => setBookData({ ...bookData, appointment_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Complaint</label>
            <Input
              placeholder="e.g. Persistent cough for 3 days"
              value={bookData.reason}
              onChange={(e) => setBookData({ ...bookData, reason: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsBookOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 gap-2">
              <CalendarDays className="w-4 h-4" /> Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
