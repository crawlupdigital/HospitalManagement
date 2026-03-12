import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Pill, Package, CheckCircle, AlertCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import api from '../../lib/axios';

const mockDispenseQueue = [
  { id: 101, patient: 'Amit Kumar', doctor: 'Dr. Sarah', items: 3, time: '10 mins ago', status: 'Pending' },
  { id: 102, patient: 'Sneha Reddy', doctor: 'Dr. John', items: 1, time: '2 mins ago', status: 'Pending' }
];

const PharmacyPage = () => {
    const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleDispenseClick = (order) => {
        setSelectedOrder(order);
        setIsDispenseModalOpen(true);
    };

    const handleConfirmDispense = async () => {
        try {
            await toast.promise(
                api.post('/pharmacy/dispense', {
                    prescription_item_id: selectedOrder.id, // using order id as prescription_item_id for dummy payload
                    medicine_id: 1, // hardcoded dummy medicine ID
                    quantity: selectedOrder.items,
                    patient_id: 1 // hardcoded dummy patient ID
                }),
                {
                    loading: 'Processing dispense record...',
                    success: `Order #${selectedOrder?.id} fully dispensed!`,
                    error: 'Failed to process.',
                }
            );
            setIsDispenseModalOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Dispense error:', error);
        }
    };

    const columns = [
        { header: 'Order ID', accessorKey: 'id' },
        { 
            header: 'Patient Info', 
            cell: (row) => (
                <div>
                     <div className="font-medium text-gray-900">{row.patient}</div>
                     <div className="text-xs text-gray-500">Prescribed by {row.doctor}</div>
                </div>
            )
        },
        { header: 'Items', accessorKey: 'items' },
        { header: 'Time', accessorKey: 'time' },
        { 
            header: 'Action', 
            cell: () => (
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleDispenseClick(row)}>
                    Process Dispense
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Pharmacy Operations</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Pending Processing</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">18</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Pill className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">5</h3>
                            </div>
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Dispensed Today</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">84</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <Package className="w-5 h-5 text-gray-500" />
                         Live Dispense Queue
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={mockDispenseQueue}
                         emptyMessage="No pending prescriptions."
                     />
                 </CardContent>
            </Card>

            {/* Dispense Confirmation Modal */}
            <Modal
                isOpen={isDispenseModalOpen}
                onClose={() => setIsDispenseModalOpen(false)}
                title={`Dispense Order #${selectedOrder?.id || ''}`}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-4">
                            <h3 className="font-semibold text-purple-900">{selectedOrder.patient}</h3>
                            <p className="text-sm text-purple-700">Prescribed by {selectedOrder.doctor}</p>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Paracetamol 500mg</p>
                                    <p className="text-sm text-gray-500">1-0-1 (After Food) for 5 days</p>
                                </div>
                                <span className="font-medium">10 Tabs</span>
                            </div>
                            {selectedOrder.items > 1 && (
                                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Amoxicillin 250mg</p>
                                        <p className="text-sm text-gray-500">1-1-1 for 3 days</p>
                                    </div>
                                    <span className="font-medium">9 Caps</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" onClick={() => setIsDispenseModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2" onClick={handleConfirmDispense}>
                                <CheckCircle className="w-4 h-4" />
                                Confirm & Dispense
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PharmacyPage;
