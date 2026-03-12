import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Truck, MapPin, Phone, CheckCircle, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const AmbulancePage = () => {
  const [fleet, setFleet] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dispatch modal
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchData, setDispatchData] = useState({
    ambulance_id: '',
    pickup_location: '',
    patient_info: ''
  });

  const fetchFleet = async () => {
    setIsLoading(true);
    try {
      const [fleetRes, tripsRes] = await Promise.all([
        api.get('/ambulance/fleet'),
        api.get('/ambulance/trips')
      ]);
      if (fleetRes.data?.data) setFleet(fleetRes.data.data);
      if (tripsRes.data?.data) setTrips(tripsRes.data.data);
    } catch (err) {
      console.error('Failed to load ambulance data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleDispatch = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        api.post('/ambulance/dispatch', dispatchData),
        {
          loading: 'Dispatching ambulance...',
          success: 'Ambulance dispatched!',
          error: 'Dispatch failed.'
        }
      );
      setIsDispatchOpen(false);
      setDispatchData({ ambulance_id: '', pickup_location: '', patient_info: '' });
      fetchFleet();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (tripId) => {
    try {
      await toast.promise(
        api.put(`/ambulance/trips/${tripId}/complete`, { drop_location: 'Hospital Campus' }),
        {
          loading: 'Completing trip...',
          success: 'Trip completed. Ambulance back in fleet.',
          error: 'Failed to complete trip.'
        }
      );
      fetchFleet();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'on_trip': return 'bg-amber-100 text-amber-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const availableAmbulances = fleet.filter(a => a.status === 'available');

  const fleetColumns = [
    {
      header: 'Vehicle',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${row.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
            <Truck className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-900">{row.vehicle_no}</span>
        </div>
      )
    },
    {
      header: 'Driver',
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.driver_name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {row.driver_phone}</div>
        </div>
      )
    },
    {
      header: 'Location',
      cell: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" /> {row.current_location || 'Hospital Base'}
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(row.status)}`}>
          {row.status?.replace('_', ' ')}
        </span>
      )
    }
  ];

  const tripColumns = [
    { header: 'Trip ID', accessorKey: 'id' },
    {
      header: 'Ambulance',
      cell: (row) => <span className="font-semibold">{row.Ambulance?.vehicle_no || '-'}</span>
    },
    { header: 'Pickup', accessorKey: 'pickup_location' },
    { header: 'Patient Info', accessorKey: 'patient_info' },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
          row.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Action',
      cell: (row) => row.status !== 'completed' ? (
        <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={() => handleComplete(row.id)}>
          <CheckCircle className="w-3 h-3" /> Complete
        </Button>
      ) : (
        <span className="text-xs text-green-600 font-medium">Done</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-jakarta text-gray-900">Ambulance Fleet Management</h1>
        <Button
          className="bg-amber-600 hover:bg-amber-700 gap-2"
          onClick={() => setIsDispatchOpen(true)}
          disabled={availableAmbulances.length === 0}
        >
          <Send className="w-4 h-4" /> Dispatch Ambulance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Total Fleet</p>
              <h3 className="text-3xl font-bold mt-1">{fleet.length}</h3>
            </div>
            <Truck className="w-10 h-10 opacity-80" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm">Available Now</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">{availableAmbulances.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm">Active Trips</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{trips.filter(t => t.status === 'dispatched').length}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-gray-500" /> Fleet Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={fleetColumns} data={fleet} emptyMessage={isLoading ? 'Loading fleet...' : 'No ambulances registered.'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-500" /> Trip History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={tripColumns} data={trips} emptyMessage="No trips recorded." />
        </CardContent>
      </Card>

      {/* Dispatch Modal */}
      <Modal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} title="Dispatch Ambulance" maxWidth="md">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm border border-amber-100">
            Select an available ambulance and provide pickup information.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
            <select
              required
              className="w-full text-sm border-gray-300 rounded-md p-2"
              value={dispatchData.ambulance_id}
              onChange={(e) => setDispatchData({ ...dispatchData, ambulance_id: e.target.value })}
            >
              <option value="">Choose ambulance…</option>
              {availableAmbulances.map(a => (
                <option key={a.id} value={a.id}>{a.vehicle_no} — {a.driver_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <Input
              required
              placeholder="e.g. 123 Main Street, Hyderabad"
              value={dispatchData.pickup_location}
              onChange={(e) => setDispatchData({ ...dispatchData, pickup_location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient / Caller Info</label>
            <Input
              placeholder="Name, phone or description"
              value={dispatchData.patient_info}
              onChange={(e) => setDispatchData({ ...dispatchData, patient_info: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button variant="ghost" type="button" onClick={() => setIsDispatchOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 gap-2">
              <Send className="w-4 h-4" /> Dispatch Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AmbulancePage;
