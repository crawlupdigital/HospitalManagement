import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Activity, Thermometer, HeartPulse, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const NursingDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal State
    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [vitalsData, setVitalsData] = useState({
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        spo2: '',
        weight: '',
        height: ''
    });

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            // Fetch patients in reception or triage
            const res = await api.get('/patients');
            if (res.data && res.data.data && res.data.data.rows) {
                const waitingPatients = res.data.data.rows.filter(
                    p => p.current_stage === 'reception' || p.current_stage === 'triage'
                );
                
                const formattedQueue = waitingPatients.map(p => ({
                    id: p.id,
                    name: p.name,
                    uid: p.patient_uid,
                    age: p.age,
                    gender: p.gender,
                    status: p.current_stage === 'reception' ? 'Awaiting Triage' : 'In Triage',
                    time: new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }));
                setQueue(formattedQueue);
            }
        } catch (error) {
            console.error('Failed to fetch queue', error);
            toast.error('Failed to load nursing queue');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        // Option to add setInterval polling here for live queue updates if Socket.io is not fully connected on frontend yet
    }, []);

    const handleOpenVitals = (patient) => {
        setSelectedPatient(patient);
        setIsVitalsModalOpen(true);
    };

    const handleSaveVitals = async (e) => {
        e.preventDefault();
        try {
            // Depending on backend logic, you might need to enforce 'triage' stage before recording vitals.
            // Let's ensure patient is in triage to activate the auto-route logic.
            if (selectedPatient.status === 'Awaiting Triage') {
                await api.put(`/patients/${selectedPatient.id}/stage`, { stage: 'triage' });
            }

            // Save Vitals (backend will auto-promote to 'consultation' after this)
            await toast.promise(
                api.post(`/patients/${selectedPatient.id}/vitals`, vitalsData),
                {
                    loading: 'Recording vitals...',
                    success: 'Vitals recorded! Patient routed to Doctor Consultation Queue.',
                    error: 'Failed to record vitals.'
                }
            );

            setIsVitalsModalOpen(false);
            setVitalsData({ blood_pressure: '', heart_rate: '', temperature: '', spo2: '', weight: '', height: '' });
            fetchQueue(); // Refresh queue
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { header: 'Patient ID', accessorKey: 'uid' },
        { 
            header: 'Patient Info', 
            cell: (row) => (
                <div>
                     <div className="font-medium text-gray-900">{row.name}</div>
                     <div className="text-xs text-gray-500">{row.age}y • {row.gender}</div>
                </div>
            )
        },
        { header: 'Registered Time', accessorKey: 'time' },
        { 
            header: 'Status', 
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.status === 'In Triage' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                    {row.status}
                </span>
            )
        },
        { 
            header: 'Action', 
            cell: (row) => (
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => handleOpenVitals(row)}>
                    Record Vitals
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Nursing & Triage</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-rose-100 text-sm font-medium">Patients Awaiting Triage</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">
                                    {queue.filter(p => p.status === 'Awaiting Triage').length}
                                </h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Currently In Triage</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">
                                    {queue.filter(p => p.status === 'In Triage').length}
                                </h3>
                            </div>
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Cleared for Doctor</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">-</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <HeartPulse className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <Thermometer className="w-5 h-5 text-gray-500" />
                         Triage Queue
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={queue}
                         emptyMessage={isLoading ? "Loading patients..." : "No patients in queue."}
                     />
                 </CardContent>
            </Card>

            {/* Record Vitals Modal */}
            <Modal
                isOpen={isVitalsModalOpen}
                onClose={() => setIsVitalsModalOpen(false)}
                title={`Record Vitals`}
                maxWidth="md"
            >
                {selectedPatient && (
                    <form onSubmit={handleSaveVitals} className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                            <h3 className="font-semibold text-gray-900">{selectedPatient.name}</h3>
                            <p className="text-sm text-gray-500">{selectedPatient.uid} • {selectedPatient.age}y {selectedPatient.gender}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
                                <Input 
                                    required 
                                    placeholder="120/80" 
                                    value={vitalsData.blood_pressure}
                                    onChange={(e) => setVitalsData({...vitalsData, blood_pressure: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                                <Input 
                                    required 
                                    type="number"
                                    placeholder="72" 
                                    value={vitalsData.heart_rate}
                                    onChange={(e) => setVitalsData({...vitalsData, heart_rate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                                <Input 
                                    required 
                                    type="number" step="0.1"
                                    placeholder="98.6" 
                                    value={vitalsData.temperature}
                                    onChange={(e) => setVitalsData({...vitalsData, temperature: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SpO2 (%)</label>
                                <Input 
                                    required 
                                    type="number" max="100"
                                    placeholder="98" 
                                    value={vitalsData.spo2}
                                    onChange={(e) => setVitalsData({...vitalsData, spo2: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <Input 
                                    type="number" step="0.1"
                                    placeholder="70" 
                                    value={vitalsData.weight}
                                    onChange={(e) => setVitalsData({...vitalsData, weight: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <Input 
                                    type="number"
                                    placeholder="175" 
                                    value={vitalsData.height}
                                    onChange={(e) => setVitalsData({...vitalsData, height: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" type="button" onClick={() => setIsVitalsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Save & Proceed to Doctor
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default NursingDashboard;
