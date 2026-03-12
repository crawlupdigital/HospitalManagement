import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Calendar, IndianRupee, BedDouble, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/axios';

// Fallback data for revenue chart (can be replaced with a real endpoint later)
const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold font-jakarta text-gray-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend !== undefined && (
            <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
                <span className="text-gray-500 ml-2">vs last week</span>
            </div>
        )}
      </CardContent>
    </Card>
);

const DashboardPage = () => {
    const { user } = useAuthStore();

    const [stats, setStats] = useState({
      total_patients: 0,
      today_appointments: 0,
      total_revenue: 0,
      bed_occupancy: { occupied: 0, total: 0, rate: 0 }
    });
    const [patientFlow, setPatientFlow] = useState([]);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const [statsRes, flowRes] = await Promise.all([
            api.get('/dashboard/stats'),
            api.get('/dashboard/patient-flow')
          ]);
          if (statsRes.data?.data) setStats(statsRes.data.data);
          if (flowRes.data?.data) setPatientFlow(flowRes.data.data);
        } catch (err) {
          console.error('Dashboard stats fetch error', err);
        }
      };
      fetchStats();
    }, []);

    const stageColors = {
      reception: 'bg-gray-100 text-gray-700',
      triage: 'bg-yellow-100 text-yellow-700',
      consultation: 'bg-blue-100 text-blue-700',
      pharmacy: 'bg-purple-100 text-purple-700',
      lab: 'bg-indigo-100 text-indigo-700',
      billing: 'bg-green-100 text-green-700',
      discharged: 'bg-emerald-100 text-emerald-700',
    };

    const stageLabels = {
      reception: 'Waiting Reception',
      triage: 'In Triage',
      consultation: 'Consultation',
      pharmacy: 'Pharmacy / Lab',
      lab: 'Laboratory',
      billing: 'Billing',
      discharged: 'Discharged',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-gray-900 capitalize">
                        Welcome back, {user?.name || 'Administrator'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here is what's happening in your hospital today.</p>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Patients" 
                    value={stats.total_patients.toLocaleString('en-IN')} 
                    icon={Users} 
                    colorClass="bg-blue-100 text-blue-600" 
                />
                <StatCard 
                    title="Today's Appointments" 
                    value={stats.today_appointments} 
                    icon={Calendar} 
                    colorClass="bg-indigo-100 text-indigo-600" 
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${Number(stats.total_revenue).toLocaleString('en-IN')}`}
                    icon={IndianRupee} 
                    colorClass="bg-green-100 text-green-600" 
                />
                <StatCard 
                    title="Bed Occupancy" 
                    value={`${stats.bed_occupancy.rate}%`} 
                    icon={BedDouble} 
                    colorClass="bg-orange-100 text-orange-600" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tickFormatter={(value) => value.slice(0,3)} dy={10} fontSize={12} fill="#6B7280" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} fill="#6B7280" tickFormatter={(value) => `₹${value}`} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#1A73E8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Live Patient Flow */}
                <Card className="col-span-1 border-l-4 border-l-blue-500">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Live Patient Flow
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patientFlow.length > 0 ? patientFlow.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <span className="text-sm font-medium text-gray-700 capitalize">{stageLabels[item.stage] || item.stage}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stageColors[item.stage] || 'bg-gray-100 text-gray-700'}`}>
                                        {item.count}
                                    </span>
                                </div>
                            )) : (
                              [
                                { stage: 'Waiting Reception', count: 0, color: 'bg-gray-100 text-gray-700' },
                                { stage: 'In Triage', count: 0, color: 'bg-yellow-100 text-yellow-700' },
                                { stage: 'Consultation', count: 0, color: 'bg-blue-100 text-blue-700' },
                                { stage: 'Pharmacy / Lab', count: 0, color: 'bg-purple-100 text-purple-700' },
                                { stage: 'Billing', count: 0, color: 'bg-green-100 text-green-700' },
                              ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.color}`}>
                                        {item.count}
                                    </span>
                                </div>
                              ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
