import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import DataTable from '../../components/ui/DataTable';
import { Plus, Search, Filter, Save, Eye, Pencil, Activity, Calendar, Droplet, Phone, MapPin, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import api from '../../lib/axios';

const PatientsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // View Modal
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewPatient, setViewPatient] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // Edit Modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    // Registration Form
    const [formData, setFormData] = useState({
        name: '', age: '', gender: 'MALE', phone: '', blood_group: 'A+', city: 'Hyderabad'
    });

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/patients');
            if (res.data?.data) {
                const raw = res.data.data;
                const rows = Array.isArray(raw) ? raw : (raw.rows || []);
                const formatted = rows.map(p => ({
                    id: p.id,
                    uid: p.patient_uid,
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    phone: p.phone,
                    blood_group: p.blood_group,
                    city: p.city,
                    status: (p.current_stage || 'reception').replace('_', ' '),
                    registeredAt: p.created_at ? new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'
                }));
                setPatients(formatted);
            }
        } catch (err) {
            console.error('Failed to fetch patients', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    // ─── View Patient ────────────────────────────────────────
    const handleView = async (patient) => {
        setViewLoading(true);
        setIsViewOpen(true);
        try {
            const res = await api.get(`/patients/${patient.id}`);
            if (res.data?.data) {
                setViewPatient(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to load patient details');
            console.error(err);
        } finally {
            setViewLoading(false);
        }
    };

    // ─── Edit Patient ────────────────────────────────────────
    const handleEditOpen = (patient) => {
        setEditData({
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            blood_group: patient.blood_group || 'A+',
            city: patient.city || 'Hyderabad'
        });
        setIsEditOpen(true);
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.put(`/patients/${editData.id}`, {
                    name: editData.name,
                    age: parseInt(editData.age),
                    gender: editData.gender,
                    phone: editData.phone,
                    blood_group: editData.blood_group,
                    city: editData.city
                }),
                {
                    loading: 'Updating patient...',
                    success: `${editData.name} updated successfully!`,
                    error: 'Update failed.'
                }
            );
            setIsEditOpen(false);
            fetchPatients();
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Register Patient ────────────────────────────────────
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.post('/patients', {
                    name: formData.name,
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    phone: formData.phone,
                    blood_group: formData.blood_group,
                    city: formData.city
                }),
                {
                    loading: 'Registering patient...',
                    success: `Patient ${formData.name} registered successfully!`,
                    error: 'Registration failed.',
                }
            );
            setIsRegModalOpen(false);
            setFormData({ name: '', age: '', gender: 'MALE', phone: '', blood_group: 'A+', city: 'Hyderabad' });
            fetchPatients();
        } catch (error) {
            console.error(error);
        }
    };

    const stageColors = {
        'reception': 'bg-gray-100 text-gray-700',
        'triage': 'bg-yellow-100 text-yellow-700',
        'consultation': 'bg-blue-100 text-blue-700',
        'pharmacy': 'bg-purple-100 text-purple-700',
        'lab': 'bg-indigo-100 text-indigo-700',
        'nursing': 'bg-rose-100 text-rose-700',
        'billing': 'bg-green-100 text-green-700',
        'discharged': 'bg-emerald-100 text-emerald-700',
        'admitted': 'bg-orange-100 text-orange-700',
    };

    const columns = [
        { header: 'Patient ID', accessorKey: 'uid' },
        { 
            header: 'Patient Info', 
            cell: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.age} yrs • {row.gender}</div>
                </div>
            )
        },
        { header: 'Contact', accessorKey: 'phone' },
        { 
            header: 'Current Status', 
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${stageColors[row.status] || 'bg-gray-100 text-gray-700'}`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Registered', accessorKey: 'registeredAt' },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 gap-1" onClick={() => handleView(row)}>
                        <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50 gap-1" onClick={() => handleEditOpen(row)}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                </div>
            )
        }
    ];

    const filteredPatients = searchTerm
        ? patients.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.uid.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.phone.includes(searchTerm)
          )
        : patients;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-gray-900">Patients Directory</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage registrations, queues, and profiles.</p>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setIsRegModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Register New Patient
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                                placeholder="Search by name, ID, or phone..." 
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable 
                        columns={columns} 
                        data={filteredPatients} 
                        emptyMessage={isLoading ? 'Loading patients...' : 'No patients found matching your search.'}
                    />
                </CardContent>
            </Card>

            {/* ═══ PATIENT VIEW MODAL ═══ */}
            <Modal isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); setViewPatient(null); }} title="Patient Details" maxWidth="lg">
                {viewLoading ? (
                    <div className="py-12 text-center text-gray-500">Loading patient details...</div>
                ) : viewPatient ? (
                    <div className="space-y-6">
                        {/* Header card */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                        {viewPatient.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{viewPatient.name}</h2>
                                        <p className="text-sm text-blue-700 font-medium">{viewPatient.patient_uid}</p>
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${stageColors[viewPatient.current_stage] || 'bg-gray-100 text-gray-700'}`}>
                                            {viewPatient.current_stage?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-gray-500 gap-1" onClick={() => { setIsViewOpen(false); handleEditOpen(viewPatient); }}>
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </Button>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoItem icon={User} label="Age / Gender" value={`${viewPatient.age} yrs • ${viewPatient.gender}`} />
                            <InfoItem icon={Phone} label="Phone" value={viewPatient.phone} />
                            <InfoItem icon={Droplet} label="Blood Group" value={viewPatient.blood_group || '-'} />
                            <InfoItem icon={MapPin} label="City" value={viewPatient.city || '-'} />
                        </div>

                        {viewPatient.allergies && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-red-800">⚠️ Allergies</p>
                                <p className="text-sm text-red-700 mt-1">{viewPatient.allergies}</p>
                            </div>
                        )}

                        {viewPatient.chronic_conditions && (
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                                <p className="text-sm font-semibold text-amber-800">Chronic Conditions</p>
                                <p className="text-sm text-amber-700 mt-1">{viewPatient.chronic_conditions}</p>
                            </div>
                        )}

                        {/* Vitals History */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-rose-500" /> Recent Vitals
                            </h3>
                            {viewPatient.Vitals && viewPatient.Vitals.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-500 border-b">
                                                <th className="pb-2 pr-4 font-medium">BP</th>
                                                <th className="pb-2 pr-4 font-medium">HR</th>
                                                <th className="pb-2 pr-4 font-medium">Temp</th>
                                                <th className="pb-2 pr-4 font-medium">SpO2</th>
                                                <th className="pb-2 font-medium">Recorded</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewPatient.Vitals.slice(0, 5).map((v, i) => (
                                                <tr key={i} className="border-b border-gray-50">
                                                    <td className="py-2 pr-4 font-medium">{v.blood_pressure || '-'}</td>
                                                    <td className="py-2 pr-4">{v.heart_rate || '-'} bpm</td>
                                                    <td className="py-2 pr-4">{v.temperature || '-'}°F</td>
                                                    <td className="py-2 pr-4">{v.spo2 || '-'}%</td>
                                                    <td className="py-2 text-gray-500">{v.recorded_at ? new Date(v.recorded_at).toLocaleString() : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No vitals recorded yet.</p>
                            )}
                        </div>

                        {/* Appointments History */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" /> Appointments
                            </h3>
                            {viewPatient.Appointments && viewPatient.Appointments.length > 0 ? (
                                <div className="space-y-2">
                                    {viewPatient.Appointments.slice(0, 5).map((a, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Token #{a.token_no} — {a.appointment_date}</p>
                                                <p className="text-xs text-gray-500">{a.chief_complaint || a.notes || 'No complaint noted'}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                                a.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                a.status === 'IN-PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {a.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No appointments yet.</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </Modal>

            {/* ═══ PATIENT EDIT MODAL ═══ */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Patient" maxWidth="md">
                <form onSubmit={handleEditSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <Input 
                                required 
                                value={editData.name || ''} 
                                onChange={e => setEditData({...editData, name: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <Input 
                                required type="number" 
                                value={editData.age || ''} 
                                onChange={e => setEditData({...editData, age: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editData.gender || 'MALE'}
                                onChange={e => setEditData({...editData, gender: e.target.value})}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input 
                                required 
                                value={editData.phone || ''} 
                                onChange={e => setEditData({...editData, phone: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editData.blood_group || 'A+'}
                                onChange={e => setEditData({...editData, blood_group: e.target.value})}
                            >
                                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <Input 
                                value={editData.city || ''} 
                                onChange={e => setEditData({...editData, city: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                        <Button variant="ghost" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* ═══ REGISTER MODAL ═══ */}
            <Modal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} title="Register New Patient" maxWidth="lg">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ram Charan" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <Input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Age" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.gender}
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. 9876543210" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.blood_group}
                                onChange={e => setFormData({...formData, blood_group: e.target.value})}
                            >
                                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            >
                                <option>Hyderabad</option><option>Visakhapatnam</option><option>Vijayawada</option>
                                <option>Guntur</option><option>Warangal</option><option>Tirupati</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                        <Button variant="ghost" type="button" onClick={() => setIsRegModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save & Register
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Small info display component
const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="p-2 bg-white rounded-lg border border-gray-200">
            <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
        </div>
    </div>
);

export default PatientsPage;
