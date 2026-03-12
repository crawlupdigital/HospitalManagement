import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import ClickableStat from '../../components/ui/ClickableStat';
import StatusBadge from '../../components/ui/StatusBadge';
import SearchInput from '../../components/ui/SearchInput';
import SmartBookingModal from './SmartBookingModal';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Play, CheckSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDate, formatTime, getToday } from '../../utils/formatters';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterDate, setFilterDate] = useState(getToday());
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [doctors, setDoctors] = useState([]);

    // Stats
    const [stats, setStats] = useState({ total: 0, waiting: 0, inProgress: 0, completed: 0 });

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterDate) params.append('date', filterDate);
            if (filterStatus) params.append('status', filterStatus);
            if (filterDoctor) params.append('doctor_id', filterDoctor);
            if (search) params.append('search', search);

            const res = await api.get(`/appointments?${params}`);
            if (res.data?.data) {
                const list = res.data.data;
                setAppointments(list);
                setStats({
                    total: list.length,
                    waiting: list.filter(a => a.status === 'WAITING').length,
                    inProgress: list.filter(a => a.status === 'IN-PROGRESS').length,
                    completed: list.filter(a => a.status === 'COMPLETED').length,
                });
            }
        } catch (err) {
            console.error('Fetch appointments error', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [filterDate, filterStatus, filterDoctor, search]);

    useEffect(() => {
        api.get('/appointments/doctors/available').then(res => {
            if (res.data?.data) setDoctors(res.data.data);
        }).catch(() => {});
    }, []);

    // ─── Actions ──────────────────────────────
    const handleCheckIn = async (id) => {
        try {
            await toast.promise(api.put(`/appointments/${id}/checkin`), {
                loading: 'Checking in...', success: 'Patient checked in!', error: 'Failed'
            });
            fetchAppointments();
        } catch (e) {}
    };

    const handleStartConsultation = async (id) => {
        try {
            await toast.promise(api.put(`/appointments/${id}/start`), {
                loading: 'Starting...', success: 'Consultation started!', error: 'Failed'
            });
            fetchAppointments();
        } catch (e) {}
    };

    const handleComplete = async (id) => {
        try {
            await toast.promise(api.put(`/appointments/${id}/end`), {
                loading: 'Completing...', success: 'Consultation completed!', error: 'Failed'
            });
            fetchAppointments();
        } catch (e) {}
    };

    const handleCancel = async (id) => {
        try {
            await toast.promise(api.put(`/appointments/${id}`, { status: 'CANCELLED' }), {
                loading: 'Cancelling...', success: 'Appointment cancelled.', error: 'Failed'
            });
            fetchAppointments();
        } catch (e) {}
    };

    const columns = [
        {
            header: 'Token',
            cell: (row) => {
                const colors = { NORMAL: 'bg-blue-500', URGENT: 'bg-orange-500', EMERGENCY: 'bg-red-500' };
                return (
                    <div className={`w-10 h-10 rounded-lg ${colors[row.priority] || 'bg-blue-500'} text-white flex items-center justify-center font-bold text-sm`}>
                        {row.token_no}
                    </div>
                );
            }
        },
        {
            header: 'Patient / Visitor',
            cell: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.Patient?.name || row.Visitor?.name || '-'}</p>
                    <p className="text-xs text-gray-500">
                        {row.Patient?.patient_uid || ''} 
                        {row.visitor_type && row.visitor_type !== 'PATIENT' && (
                            <span className="ml-1 text-xs text-purple-600">({row.visitor_type.replace('_',' ')})</span>
                        )}
                    </p>
                </div>
            )
        },
        {
            header: 'Doctor',
            cell: (row) => (
                <div>
                    <p className="font-medium text-gray-800">{row.User?.name || '-'}</p>
                    <p className="text-xs text-gray-500">{row.User?.specialization || ''}</p>
                </div>
            )
        },
        {
            header: 'Time',
            cell: (row) => (
                <div className="text-sm">
                    <p className="text-gray-800">{row.time_slot || formatTime(row.appointment_time)}</p>
                    <p className="text-xs text-gray-400">{formatDate(row.appointment_date)}</p>
                </div>
            )
        },
        {
            header: 'Type',
            cell: (row) => <StatusBadge status={row.type || 'WALK-IN'} />
        },
        {
            header: 'Priority',
            cell: (row) => <StatusBadge status={row.priority || 'NORMAL'} />
        },
        {
            header: 'Status',
            cell: (row) => <StatusBadge status={row.status} />
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-1">
                    {row.status === 'WAITING' && !row.checked_in_at && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-1 text-xs" onClick={() => handleCheckIn(row.id)}>
                            <CheckSquare className="w-3 h-3" /> Check In
                        </Button>
                    )}
                    {(row.status === 'WAITING' && row.checked_in_at) && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs" onClick={() => handleStartConsultation(row.id)}>
                            <Play className="w-3 h-3" /> Start
                        </Button>
                    )}
                    {row.status === 'IN-PROGRESS' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs" onClick={() => handleComplete(row.id)}>
                            <CheckCircle className="w-3 h-3" /> Complete
                        </Button>
                    )}
                    {(row.status === 'WAITING' || row.status === 'IN-PROGRESS') && (
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 text-xs" onClick={() => handleCancel(row.id)}>
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold font-jakarta text-gray-900">Appointments</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsBookingOpen(true)}>
                    <Plus className="w-4 h-4" /> Book Appointment
                </Button>
            </div>

            {/* ─── Clickable Stat Cards ──────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ClickableStat title="Today's Total" value={stats.total} icon={Calendar} colorClass="bg-blue-100 text-blue-600" onClick={() => { setFilterStatus(''); setFilterDate(getToday()); }} loading={isLoading} />
                <ClickableStat title="Waiting" value={stats.waiting} icon={Clock} colorClass="bg-yellow-100 text-yellow-600" onClick={() => setFilterStatus('WAITING')} loading={isLoading} />
                <ClickableStat title="In Progress" value={stats.inProgress} icon={AlertCircle} colorClass="bg-blue-100 text-blue-600" onClick={() => setFilterStatus('IN-PROGRESS')} loading={isLoading} />
                <ClickableStat title="Completed" value={stats.completed} icon={CheckCircle} colorClass="bg-green-100 text-green-600" onClick={() => setFilterStatus('COMPLETED')} loading={isLoading} />
            </div>

            {/* ─── Filters ───────────────────────────── */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <SearchInput
                            placeholder="Search patient, phone, UID..."
                            onSearch={(q) => setSearch(q)}
                            className="flex-1 min-w-[200px]"
                        />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
                        />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">All Statuses</option>
                            <option value="WAITING">Waiting</option>
                            <option value="IN-PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <select
                            value={filterDoctor}
                            onChange={e => setFilterDoctor(e.target.value)}
                            className="h-10 px-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        {(filterStatus || filterDoctor || search) && (
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { setFilterStatus(''); setFilterDoctor(''); setSearch(''); }}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ─── Table ─────────────────────────────── */}
            <Card>
                <CardContent className="p-0">
                    <DataTable
                        columns={columns}
                        data={appointments}
                        emptyMessage={isLoading ? 'Loading appointments...' : 'No appointments found.'}
                    />
                </CardContent>
            </Card>

            {/* ─── Smart Booking Modal ────────────────── */}
            <SmartBookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                onBooked={fetchAppointments}
            />
        </div>
    );
};

export default AppointmentsPage;
