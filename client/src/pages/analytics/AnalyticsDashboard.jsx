import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Users, Clock, MousePointerClick, CalendarRange } from 'lucide-react';
import toast from 'react-hot-toast';

const eventTrendData = [
  { date: '10/20', events: 1200 },
  { date: '10/21', events: 1450 },
  { date: '10/22', events: 1100 },
  { date: '10/23', events: 1800 },
  { date: '10/24', events: 2200 },
  { date: '10/25', events: 2100 },
  { date: '10/26', events: 2600 },
];

const featureUsageData = [
  { name: 'Patient Reg', usage: 450 },
  { name: 'Prescribing', usage: 380 },
  { name: 'Lab Orders', usage: 220 },
  { name: 'Billing', usage: 180 },
  { name: 'Inventory', usage: 110 },
];

const AnalyticsDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-gray-900">Platform Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Usage intelligence and operational insights.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <CalendarRange className="w-4 h-4" />
                        Last 7 Days
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success('Exporting Report as CSV...')}>Export Report</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Events Captured</p>
                                <h3 className="text-3xl font-bold font-jakarta mt-2 text-gray-900">12.4k</h3>
                            </div>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Daily Active Users</p>
                                <h3 className="text-3xl font-bold font-jakarta mt-2 text-gray-900">42</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Avg Triage Wait Time</p>
                                <h3 className="text-3xl font-bold font-jakarta mt-2 text-gray-900">18m</h3>
                            </div>
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">API Calls</p>
                                <h3 className="text-3xl font-bold font-jakarta mt-2 text-gray-900">48.2k</h3>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <MousePointerClick className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Event Activity Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={eventTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="events" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Feature Usage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Feature Modules Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={featureUsageData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 12, fontWeight: 500}} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="usage" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                 <CardHeader>
                     <CardTitle>System Modules Health Check</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {['Authentication', 'Prescription Writer', 'Socket.io Server', 'Database Cluster'].map((module, i) => (
                             <div key={i} className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                                 <span className="text-sm font-medium text-gray-700">{module}</span>
                                 <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                     <span className="text-xs text-gray-500">Online</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;
