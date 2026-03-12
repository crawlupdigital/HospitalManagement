import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { User, Activity, FileText, Pill, Plus, Save, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ConsultationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form States
    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    
    // New Rx Item State
    const [newRx, setNewRx] = useState({
        item_type: 'medicine',
        name: '',
        dosage: '',
        frequency: '1-0-1',
        duration_days: '5',
        instructions: 'After Food'
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await api.get(`/patients/${id}`);
                setPatient(res.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load patient data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleAddRx = () => {
        if (!newRx.name) return toast.error('Item name is required');
        
        let routed_to = 'pharmacy';
        if (newRx.item_type === 'lab') routed_to = 'lab';
        else if (newRx.item_type === 'radiology') routed_to = 'radiology';
        else if (newRx.item_type === 'nursing') routed_to = 'nursing';
        
        setPrescriptions([...prescriptions, { ...newRx, routed_to }]);
        setNewRx({ ...newRx, name: '', dosage: '' });
    };

    const handleRemoveRx = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleCompleteConsultation = async () => {
        if (!diagnosis) return toast.error('Diagnosis is required');
        
        try {
            await toast.promise(
                api.post('/prescriptions', {
                    patient_id: id,
                    diagnosis,
                    clinical_notes: clinicalNotes,
                    items: prescriptions
                }),
                {
                    loading: 'Saving consultation & routing prescriptions...',
                    success: 'Consultation completed successfully!',
                    error: 'Failed to save consultation.'
                }
            );
            
            // Advance patient stage to billing (or discharge if needed)
            await api.put(`/patients/${id}/stage`, { stage: 'billing' });
            
            navigate('/doctor');
        } catch (error) {
            console.error('Save error', error);
        }
    };

    if (isLoading) return <div className="p-8">Loading patient data...</div>;
    if (!patient) return <div className="p-8">Patient not found</div>;

    const latestVitals = patient.Vitals && patient.Vitals.length > 0 
        ? patient.Vitals[patient.Vitals.length - 1] 
        : null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" className="p-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-gray-900">Consultation</h1>
                    <p className="text-sm text-gray-500">Patient: {patient.name} ({patient.patient_uid})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Patient Profile & Vitals */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="p-4 pb-2 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" /> Patient Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Age / Gender</span>
                                <span className="font-medium">{patient.age}y / {patient.gender}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Blood Group</span>
                                <span className="font-medium text-red-600">{patient.blood_group || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">{patient.phone}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4 pb-2 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="w-4 h-4 text-rose-600" /> Triage Vitals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {latestVitals ? (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">BP</p>
                                        <p className="font-medium">{latestVitals.blood_pressure || '-'} mmHg</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Heart Rate</p>
                                        <p className="font-medium">{latestVitals.heart_rate || '-'} bpm</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Temp</p>
                                        <p className="font-medium">{latestVitals.temperature || '-'} °F</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">SpO2</p>
                                        <p className="font-medium">{latestVitals.spo2 || '-'}%</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500 text-xs mb-1">Weight</p>
                                        <p className="font-medium">{latestVitals.weight || '-'} kg</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No vitals recorded in Triage.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Diagnosis & Prescription Editor */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="p-4 pb-2 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" /> Clinical Diagnosis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis *</label>
                                <Input 
                                    placeholder="e.g., Acute Viral Pharyngitis" 
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                                <Textarea 
                                    placeholder="Patient complaints, examination findings..." 
                                    className="h-24"
                                    value={clinicalNotes}
                                    onChange={(e) => setClinicalNotes(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-4 pb-2 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Pill className="w-4 h-4 text-green-600" /> Electronic Prescription (eRx) / Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            
                            {/* Rx Order Form */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                                        <select 
                                            className="w-full text-sm border-gray-300 rounded-md p-2"
                                            value={newRx.item_type}
                                            onChange={(e) => setNewRx({...newRx, item_type: e.target.value})}
                                        >
                                            <option value="medicine">Medicine (Pharmacy)</option>
                                            <option value="lab">Lab Test</option>
                                            <option value="radiology">Radiology Scan</option>
                                            <option value="nursing">Nursing Procedure</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <Input 
                                            placeholder={newRx.item_type === 'medicine' ? "Medicine Name (e.g. Paracetamol 500mg)" : "Test / Procedure Name"}
                                            value={newRx.name}
                                            onChange={(e) => setNewRx({...newRx, name: e.target.value})}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                                
                                {newRx.item_type === 'medicine' && (
                                    <div className="grid grid-cols-3 gap-3">
                                        <Input 
                                            placeholder="Dosage (e.g. 1 tab)" 
                                            className="text-sm"
                                            value={newRx.dosage}
                                            onChange={(e) => setNewRx({...newRx, dosage: e.target.value})}
                                        />
                                        <select 
                                            className="w-full text-sm border-gray-300 rounded-md p-2"
                                            value={newRx.frequency}
                                            onChange={(e) => setNewRx({...newRx, frequency: e.target.value})}
                                        >
                                            <option>1-0-1</option>
                                            <option>1-1-1</option>
                                            <option>1-0-0</option>
                                            <option>0-0-1</option>
                                            <option>SOS</option>
                                        </select>
                                        <div className="flex items-center">
                                            <Input 
                                                type="number" 
                                                placeholder="Days" 
                                                className="text-sm rounded-r-none border-r-0"
                                                value={newRx.duration_days}
                                                onChange={(e) => setNewRx({...newRx, duration_days: e.target.value})}
                                            />
                                            <span className="bg-gray-100 p-2 text-sm text-gray-500 border border-gray-300 rounded-r-md">Days</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2 isolate">
                                    <Input 
                                        placeholder="Special Instructions (e.g. After Food)" 
                                        className="text-sm flex-1"
                                        value={newRx.instructions}
                                        onChange={(e) => setNewRx({...newRx, instructions: e.target.value})}
                                    />
                                    <Button size="sm" type="button" onClick={handleAddRx} className="flex-shrink-0">
                                        <Plus className="w-4 h-4 mr-1"/> Add Item
                                    </Button>
                                </div>
                            </div>

                            {/* Applied Prescriptions List */}
                            {prescriptions.length > 0 && (
                                <div className="mt-4 border rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                                <th className="px-4 py-3 min-w-[50px]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {prescriptions.map((rx, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">
                                                        {rx.name}
                                                        <span className="block text-xs font-normal text-indigo-600 capitalize mt-0.5">{rx.item_type}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {rx.item_type === 'medicine' ? (
                                                            <>
                                                                <span className="font-medium text-gray-800">{rx.dosage}</span> • {rx.frequency} • {rx.duration_days} Days
                                                                <br/><span className="text-xs text-gray-400">{rx.instructions}</span>
                                                            </>
                                                        ) : (
                                                            <span>{rx.instructions || 'Standard processing'}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button onClick={() => handleRemoveRx(idx)} className="text-red-500 hover:text-red-700">
                                                            <Trash2 className="w-4 h-4"/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                    
                    {/* Action Bar */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => navigate('/doctor')}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={handleCompleteConsultation}>
                            <Save className="w-4 h-4" /> Finalize Consultation & Auto-Route
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationPage;
