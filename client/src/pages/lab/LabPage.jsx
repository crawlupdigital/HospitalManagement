import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Microscope, Beaker, FileCheck, AlertTriangle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const mockLabQueue = [
  { id: 'LAB-401', patient: 'John Doe', test: 'Complete Blood Count (CBC)', priority: 'High', status: 'Pending Sample' },
  { id: 'LAB-402', patient: 'Suresh Raina', test: 'Lipid Profile', priority: 'Normal', status: 'Processing' }
];

const LabPage = () => {
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const handleActionClick = (row) => {
        if (row.status === 'Processing') {
            setSelectedTest(row);
            setIsResultModalOpen(true);
        } else {
            toast.success(`Sample collection registered for ${row.patient}`);
        }
    };

    const handleSaveResult = async () => {
         try {
             await toast.promise(
                api.post('/lab/results', {
                    prescription_item_id: selectedTest.id, // using order id as prescription_item_id
                    results: { value1: 'Normal', value2: 'Negative' },
                    pathologist_remarks: 'Tested via dummy lab form'
                }),
                {
                    loading: 'Saving results...',
                    success: `Results saved and verified for ${selectedTest?.test}!`,
                    error: 'Failed to save.',
                }
            );
            setIsResultModalOpen(false);
            setSelectedTest(null);
         } catch (error) {
             console.error('Save lab result error:', error);
         }
    };

    const columns = [
        { header: 'Order ID', accessorKey: 'id' },
        { header: 'Patient Name', accessorKey: 'patient' },
        { header: 'Test Requested', accessorKey: 'test' },
        { 
            header: 'Priority', 
            cell: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {row.priority}
                </span>
            )
        },
        { 
            header: 'Status', 
            cell: (row) => (
                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {row.status}
                </span>
            )
        },
        { 
            header: 'Action', 
            cell: (row) => (
                <Button size="sm" variant={row.status === 'Processing' ? 'primary' : 'secondary'} onClick={() => handleActionClick(row)}>
                    {row.status === 'Processing' ? 'Enter Results' : 'Collect Sample'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Laboratory Operations</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">Pending Samples</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">12</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Beaker className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Processing</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">8</h3>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Microscope className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Critical Values</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">2</h3>
                            </div>
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <FileCheck className="w-5 h-5 text-gray-500" />
                         Live Test Queue
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={mockLabQueue}
                         emptyMessage="No pending lab tests."
                     />
                 </CardContent>
            </Card>

            {/* Results Entry Modal */}
            <Modal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                title="Enter Lab Results"
                maxWidth="lg"
            >
                {selectedTest && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                            <div>
                                <p className="text-xs text-gray-500">Patient</p>
                                <p className="font-medium text-gray-900">{selectedTest.patient}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Test</p>
                                <p className="font-medium text-gray-900">{selectedTest.test}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Result Value 1</label>
                            <Input placeholder="Enter numeric value or text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Result Value 2 (if applicable)</label>
                            <Input placeholder="Enter numeric value or text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pathologist Remarks / Impression</label>
                            <textarea 
                                className="w-full h-24 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                                placeholder="Enter clinical correlation or remarks..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" onClick={() => setIsResultModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={handleSaveResult}>
                                <Save className="w-4 h-4" />
                                Save & Verify
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LabPage;
