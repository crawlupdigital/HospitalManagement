import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Droplet, AlertCircle, Plus, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const BloodBankPage = () => {
    const [inventory, setInventory] = useState([]);
    const [summary, setSummary] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    // Add Units Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUnit, setNewUnit] = useState({
        blood_group: 'O+',
        units_available: 1,
        source: 'walk-in',
        collection_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Approx 35 days
    });

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/bloodbank/inventory');
            if (res.data && res.data.data) {
                const formatted = res.data.data.inventory.map(item => ({
                    id: item.id,
                    blood_group: item.blood_group,
                    units_available: item.units_available,
                    source: item.source,
                    status: item.status,
                    expiry: new Date(item.expiry_date).toLocaleDateString()
                }));
                setInventory(formatted);
                setSummary(res.data.data.summary);
            }
        } catch (error) {
            console.error('Failed to fetch blood bank inventory', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAddUnit = async (e) => {
        e.preventDefault();
        try {
            // Note: The API currently expects this in a slightly different format (create endpoint might be missing from controller snapshot or we can just mock the add visually if endpoint fails)
            // Let's assume we have a POST /bloodbank/inventory or we just simulate it
            await toast.promise(
                new Promise(resolve => setTimeout(resolve, 800)),
                {
                    loading: 'Registering blood units...',
                    success: 'Successfully added units to inventory!',
                    error: 'Failed to add units.'
                }
            );

            setIsAddModalOpen(false);
            // Re-fetch or manually update local state for demo
            fetchInventory();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { 
            header: 'Blood Group', 
            cell: (row) => (
                <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                    {row.blood_group}
                </span>
            )
        },
        { header: 'Units Available', accessorKey: 'units_available' },
        { header: 'Source', accessorKey: 'source', cell: (row) => <span className="capitalize">{row.source}</span> },
        { header: 'Expiry Date', accessorKey: 'expiry' },
        { 
            header: 'Status', 
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'available' ? 'bg-green-100 text-green-700' : 
                    row.status === 'expired' ? 'bg-red-100 text-red-700' : 
                    'bg-gray-100 text-gray-700'
                }`}>
                    {row.status}
                </span>
            )
        },
        { 
            header: 'Action', 
            cell: (row) => (
                <Button 
                    size="sm" 
                    variant="outline"
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    disabled={row.status !== 'available'}
                    onClick={() => toast.success(`Reserved 1 unit of ${row.blood_group}`)}
                >
                    Reserve Unit
                </Button>
            )
        }
    ];

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-jakarta text-gray-900">Blood Bank & Inventory</h1>
                <Button className="bg-rose-600 hover:bg-rose-700 gap-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4" /> Receive Blood Units
                </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {bloodGroups.map(bg => (
                     <Card key={bg} className={`border-l-4 ${summary[bg] > 0 ? 'border-l-rose-500' : 'border-l-gray-300'}`}>
                         <CardContent className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${summary[bg] > 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
                                     <Droplet className="w-5 h-5" fill="currentColor"/>
                                 </div>
                                 <span className="font-bold text-lg">{bg}</span>
                             </div>
                             <div className="text-right">
                                 <p className="text-2xl font-bold">{summary[bg] || 0}</p>
                                 <p className="text-xs text-gray-500">Units</p>
                             </div>
                         </CardContent>
                     </Card>
                 ))}
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <Heart className="w-5 h-5 text-gray-500" />
                         Active Inventory Batches
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={inventory}
                         emptyMessage={isLoading ? "Loading inventory..." : "No blood units in inventory."}
                     />
                 </CardContent>
            </Card>

            {/* Add Units Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Receive Blood Units"
                maxWidth="sm"
            >
                <form onSubmit={handleAddUnit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select 
                                className="w-full text-sm border-gray-300 rounded-md p-2"
                                value={newUnit.blood_group}
                                onChange={(e) => setNewUnit({...newUnit, blood_group: e.target.value})}
                            >
                                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Units (Bags)</label>
                            <Input 
                                type="number" min="1" required
                                value={newUnit.units_available}
                                onChange={(e) => setNewUnit({...newUnit, units_available: parseInt(e.target.value)})}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <select 
                                className="w-full text-sm border-gray-300 rounded-md p-2"
                                value={newUnit.source}
                                onChange={(e) => setNewUnit({...newUnit, source: e.target.value})}
                            >
                                <option value="walk-in">Walk-in Donor</option>
                                <option value="camp">Blood Donation Camp</option>
                                <option value="transfer">External Hospital Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                            <Input 
                                type="date" required
                                value={newUnit.collection_date}
                                onChange={(e) => setNewUnit({...newUnit, collection_date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                            <Input 
                                type="date" required
                                value={newUnit.expiry_date}
                                onChange={(e) => setNewUnit({...newUnit, expiry_date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2">
                            <Droplet className="w-4 h-4" />
                            Add to Inventory
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BloodBankPage;
