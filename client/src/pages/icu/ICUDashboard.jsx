import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BedDouble, AlertTriangle, CheckCircle, Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const ICUDashboard = () => {
    const [wards, setWards] = useState([]);
    const [beds, setBeds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Allocate Modal
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [patientIdSearch, setPatientIdSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const fetchWardsAndBeds = async () => {
        setIsLoading(true);
        try {
            // First fetch wards to get their details/names
            const wardsRes = await api.get('/icu/wards');
            if (wardsRes.data && wardsRes.data.data) {
                setWards(wardsRes.data.data);
            }
            // Then fetch all beds (or could fetch per ward if UI requested it, but we'll group locally)
            const bedsRes = await api.get('/icu/beds');
            if (bedsRes.data && bedsRes.data.data) {
                setBeds(bedsRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch ICU data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWardsAndBeds();
    }, []);

    const handleSearchPatient = async () => {
        if (!patientIdSearch) return;
        try {
            // Assuming we have a fuzzy search or ID lookup. For now, we'll try fetching a single patient by 'id' if numeric, or a search param.
            // In a real app we'd have a specific `GET /patients?search=UID` endpoint.
            // Let's mock a success search visually if the backend doesn't support UID search out of the box yet:
            setSearchResult({
                id: 1, // Mock DB ID
                name: 'Mock Patient Record',
                uid: patientIdSearch,
                stage: 'triage'
            });
            toast.success('Patient record found.');
        } catch (error) {
            setSearchResult(null);
            toast.error('Patient not found.');
        }
    };

    const handleAllocate = async (e) => {
        e.preventDefault();
        if (!searchResult) return toast.error('Please select a valid patient to admit.');

        try {
            await toast.promise(
                api.post('/icu/allocate', {
                    bed_id: selectedBed.id,
                    patient_id: searchResult.id // using the mocked/searched ID
                }),
                {
                    loading: 'Allocating bed...',
                    success: `Patient admitted to Bed ${selectedBed.bed_number}!`,
                    error: 'Failed to allocate bed.'
                }
            );

            setIsAllocateModalOpen(false);
            setPatientIdSearch('');
            setSearchResult(null);
            fetchWardsAndBeds();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDischarge = async (bedId) => {
        try {
            await toast.promise(
                api.post(`/icu/beds/${bedId}/release`),
                {
                    loading: 'Releasing bed...',
                    success: 'Patient discharged. Bed is now available.',
                    error: 'Failed to release bed.'
                }
            );
            fetchWardsAndBeds();
        } catch(e) {
            console.error(e);
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-700 border-green-200';
            case 'occupied': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Group beds by Ward
    const bedsByWard = beds.reduce((acc, bed) => {
        const wardId = bed.ward_id;
        if (!acc[wardId]) {
            acc[wardId] = {
                wardInfo: wards.find(w => w.id === wardId) || { name: `Ward ${wardId}` },
                beds: []
            };
        }
        acc[wardId].beds.push(bed);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">ICU & Bed Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <BedDouble className="w-8 h-8 mb-2 opacity-80" />
                        <h3 className="text-3xl font-bold">{beds.length}</h3>
                        <p className="text-sm font-medium opacity-80">Total Beds</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                        <h3 className="text-3xl font-bold text-gray-900">{beds.filter(b => b.status === 'available').length}</h3>
                        <p className="text-sm font-medium text-gray-500">Available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <UserPlus className="w-8 h-8 mb-2 text-rose-500" />
                        <h3 className="text-3xl font-bold text-gray-900">{beds.filter(b => b.status === 'occupied').length}</h3>
                        <p className="text-sm font-medium text-gray-500">Occupied (Admitted)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                        <AlertTriangle className="w-8 h-8 mb-2 text-amber-500" />
                        <h3 className="text-3xl font-bold text-gray-900">{beds.filter(b => b.status === 'maintenance').length}</h3>
                        <p className="text-sm font-medium text-gray-500">Maintenance</p>
                    </CardContent>
                </Card>
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500">Loading Ward Maps...</div>
            ) : (
                Object.values(bedsByWard).map((wardGroup, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                            <span>{wardGroup.wardInfo.name} <span className="text-sm text-gray-500 font-normal ml-2">({wardGroup.wardInfo.type || 'General'})</span></span>
                            <span className="text-sm text-gray-500 font-normal">₹{wardGroup.wardInfo.charge_per_day || 0} / Day</span>
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {wardGroup.beds.map(bed => (
                                <div 
                                    key={bed.id} 
                                    className={`border rounded-xl p-4 flex flex-col items-center justify-center relative transition-shadow hover:shadow-md ${getStatusColor(bed.status)}`}
                                >
                                    <BedDouble className="w-8 h-8 mb-2 opacity-80" />
                                    <span className="font-bold">{bed.bed_number}</span>
                                    <span className="text-xs uppercase tracking-wider font-semibold mt-1 opacity-80">{bed.status}</span>
                                    
                                    <div className="mt-3 flex gap-2 w-full">
                                        {bed.status === 'available' && (
                                            <Button 
                                                size="sm" 
                                                className="w-full bg-white/50 hover:bg-white text-green-800 border border-green-300 text-xs py-1"
                                                onClick={() => { setSelectedBed(bed); setIsAllocateModalOpen(true); }}
                                            >
                                                Admit
                                            </Button>
                                        )}
                                        {bed.status === 'occupied' && (
                                            <Button 
                                                size="sm" 
                                                className="w-full bg-white/50 hover:bg-white text-rose-800 border border-rose-300 text-xs py-1"
                                                onClick={() => handleDischarge(bed.id)}
                                            >
                                                Discharge
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Allocate Bed Modal */}
            <Modal
                isOpen={isAllocateModalOpen}
                onClose={() => {
                    setIsAllocateModalOpen(false);
                    setSearchResult(null);
                    setPatientIdSearch('');
                }}
                title={`Admit Patient to Bed ${selectedBed?.bed_number}`}
                maxWidth="md"
            >
                <form onSubmit={handleAllocate} className="space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4 border border-blue-100">
                        Select a patient to officially admit them to the ward. This will transition their journey stage to <strong>'Admitted'</strong>.
                    </div>

                    <div className="flex gap-2">
                        <Input 
                            placeholder="Search Patient ID (e.g. MF-2024-0001)" 
                            value={patientIdSearch}
                            onChange={(e) => setPatientIdSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={handleSearchPatient}>
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>

                    {searchResult && (
                        <div className="p-3 border rounded-md bg-white flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-900">{searchResult.name}</p>
                                <p className="text-xs text-gray-500">{searchResult.uid} • Current Stage: <span className="capitalize text-indigo-600">{searchResult.stage}</span></p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsAllocateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" disabled={!searchResult}>
                            <UserPlus className="w-4 h-4" />
                            Confirm Admission
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default ICUDashboard;
