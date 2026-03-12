import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { RadioReceiver, Activity, CheckCircle, FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import api from '../../lib/axios';

const RadiologyPage = () => {
    const [queue, setQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Upload Report Modal
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reportText, setReportText] = useState('');

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/radiology/orders');
            if (res.data && res.data.data) {
                const formatted = res.data.data.map(order => ({
                    id: order.id,
                    scan_type: order.scan_type,
                    patientName: order.Patient ? order.Patient.name : 'Unknown',
                    patientUid: order.Patient ? order.Patient.patient_uid : 'Unknown',
                    status: order.status,
                    time: new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }));
                // For demo, we are showing all. Usually we'd filter by 'pending' or 'scheduled'
                setQueue(formatted);
            }
        } catch (error) {
            console.error('Failed to fetch radiology queue', error);
            // Ignore error for demo if endpoint misses data
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleUploadClick = (order) => {
        setSelectedOrder(order);
        setIsUploadModalOpen(true);
    };

    const handleSaveReport = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.post(`/radiology/orders/${selectedOrder.id}/report`, {
                    report_text: reportText
                }),
                {
                    loading: 'Uploading clinical findings...',
                    success: `Report saved for ${selectedOrder.scan_type}!`,
                    error: 'Failed to upload report.'
                }
            );

            setIsUploadModalOpen(false);
            setReportText('');
            setSelectedOrder(null);
            fetchQueue();
        } catch (error) {
            console.error('Report upload error:', error);
        }
    };

    const columns = [
        { header: 'Order ID', accessorKey: 'id' },
        { 
            header: 'Patient Info', 
            cell: (row) => (
                <div>
                     <div className="font-medium text-gray-900">{row.patientName}</div>
                     <div className="text-xs text-gray-500">{row.patientUid}</div>
                </div>
            )
        },
        { 
            header: 'Scan Ordered', 
            cell: (row) => <span className="font-medium text-indigo-700">{row.scan_type}</span>
        },
        { header: 'Time Requested', accessorKey: 'time' },
        { 
            header: 'Status', 
            cell: (row) => {
                const colors = {
                    'pending': 'bg-yellow-100 text-yellow-700',
                    'scheduled': 'bg-blue-100 text-blue-700',
                    'completed': 'bg-green-100 text-green-700'
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[row.status] || 'bg-gray-100'}`}>
                        {row.status}
                    </span>
                );
            }
        },
        { 
            header: 'Action', 
            cell: (row) => (
                <Button 
                    size="sm" 
                    variant={row.status === 'completed' ? 'ghost' : 'primary'}
                    className={row.status !== 'completed' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                    onClick={() => handleUploadClick(row)}
                    disabled={row.status === 'completed'}
                >
                    {row.status === 'completed' ? 'View Report' : 'Upload Findings'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Radiology Department</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">Pending Scans (X-Ray/MRI)</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">
                                    {queue.filter(q => q.status === 'pending' || q.status === 'scheduled').length}
                                </h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <RadioReceiver className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Scans Completed Today</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">
                                    {queue.filter(q => q.status === 'completed').length}
                                </h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Equipment Status</p>
                                <h3 className="text-xl font-bold font-jakarta mt-2 text-emerald-600">3/3 Online</h3>
                            </div>
                            <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <FileText className="w-5 h-5 text-gray-500" />
                         Active Scan Queue
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={queue}
                         emptyMessage={isLoading ? "Loading requests..." : "No recent scan requests."}
                     />
                 </CardContent>
            </Card>

            {/* Upload Report Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Radiology Findings"
                maxWidth="md"
            >
                {selectedOrder && (
                    <form onSubmit={handleSaveReport} className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-4">
                            <h3 className="font-semibold text-indigo-900">{selectedOrder.patientName}</h3>
                            <p className="text-sm text-indigo-700">Scan Required: <span className="font-bold">{selectedOrder.scan_type}</span></p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Radiologist Conclusions</label>
                            <Textarea 
                                required 
                                placeholder="Enter clinical findings... (e.g. No acute fracture or dislocation.)" 
                                className="h-32"
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                            />
                        </div>

                        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm font-medium">Click to upload DICOM / JPEG scans</p>
                            <p className="text-xs mt-1">Simulated via UI (Not required for this mock)</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" type="button" onClick={() => setIsUploadModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Save & Dispatch to Doctor
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default RadiologyPage;
