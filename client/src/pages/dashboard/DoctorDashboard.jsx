import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Stethoscope, Clock, CheckCircle2, User, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                // For the demo, let's fetch patients in 'consultation' or 'triage'
                const res = await api.get('/patients');
                if (res.data && res.data.data && res.data.data.rows) {
                    // Filter down to patients waiting for doctor
                    const waitingPatients = res.data.data.rows.filter(
                        p => p.current_stage === 'consultation' || p.current_stage === 'triage'
                    );
                    
                    const formattedQueue = waitingPatients.map((p, index) => {
                        const registeredTime = new Date(p.created_at);
                        const waitTimeMins = Math.floor((new Date() - registeredTime) / 60000);
                        return {
                            id: p.id,
                            name: p.name,
                            age: p.age,
                            gender: p.gender === 'Female' ? 'F' : (p.gender === 'Male' ? 'M' : 'O'),
                            token: `T-${(index + 1).toString().padStart(2, '0')}`,
                            waitTime: `${waitTimeMins}m`,
                            status: p.current_stage === 'triage' ? 'Vitals pending' : 'Ready'
                        };
                    });
                    setQueue(formattedQueue);
                }
            } catch (error) {
                console.error('Failed to fetch queue', error);
                toast.error('Failed to load patient queue');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQueue();
    }, []);

    const queueColumns = [
        { header: 'Token', accessorKey: 'token' },
        { 
            header: 'Patient Info', 
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.age}y • {row.gender}</div>
                    </div>
                </div>
            )
         },
        { 
            header: 'Wait Time', 
            cell: (row) => (
                <span className="flex items-center text-orange-600 font-medium text-sm gap-1">
                    <Clock className="w-3 h-3" /> {row.waitTime}
                </span>
            )
        },
        {
            header: 'Action',
            cell: (row) => (
                <Button 
                    size="sm" 
                    onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Starting Checkup for ${row.name}`);
                        navigate(`/doctor/consultation/${row.id}`);
                    }}
                >
                    Start Consultation
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Doctor Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Patients Seen Today</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">12</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">In Waiting Room</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">4</h3>
                            </div>
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl flex-shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Avg Consultation Time</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">14m</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl flex-shrink-0">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Queue */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold font-jakarta text-gray-900 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                        Today's Queue
                    </h2>
                    <DataTable 
                        columns={queueColumns}
                        data={queue}
                        emptyMessage={isLoading ? "Loading queue..." : "No patients in queue."}
                    />
                </div>

                {/* Quick Actions / Recent */}
                 <div className="space-y-4">
                     <h2 className="text-xl font-bold font-jakarta text-gray-900">Recent Consultations</h2>
                     <div className="space-y-3">
                         {queue.length > 0 ? queue.slice(0, 3).map((p) => (
                             <Card key={p.id} className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate(`/doctor?patient=${p.id}`)}>
                                 <CardContent className="p-4 flex items-center justify-between">
                                     <div>
                                         <p className="font-medium text-gray-900">{p.name}</p>
                                         <p className="text-xs text-gray-500">{p.age} yrs • {p.gender} • Wait: {p.waitTime}</p>
                                     </div>
                                     <Button variant="ghost" size="sm" className="text-blue-600" onClick={(e) => { e.stopPropagation(); navigate(`/doctor?patient=${p.id}`); }}>View Rx</Button>
                                 </CardContent>
                             </Card>
                         )) : (
                             <p className="text-sm text-gray-400 italic">No recent consultation patients.</p>
                         )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
