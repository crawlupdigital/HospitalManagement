import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const funnelData = [
  { stage: 'Registration', count: 1540 },
  { stage: 'Triage', count: 1210 },
  { stage: 'Consultation', count: 1100 },
  { stage: 'Pharmacy', count: 850 },
  { stage: 'Lab', count: 420 },
  { stage: 'Billing', count: 1050 },
  { stage: 'Discharge', count: 1050 },
];

const FeatureAdoptionPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-jakarta text-gray-900">Patient Flow & Feature Adoption</h1>
                <p className="text-gray-500 text-sm mt-1">Analyze conversion rates across hospital departments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-indigo-600" />
                             Patient Journey Funnel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontWeight: 500}} />
                                    <Tooltip 
                                        cursor={{fill: '#F3F4F6'}}
                                        formatter={(value) => [`${value} Patients`, 'Volume']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]}>
                                        {/* Optional: Add custom label for conversion % later */}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                 </Card>

                 <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Module Adoption Rates (30 Days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                 {[
                                     { name: 'Electronic Prescribing', rate: 92, status: 'Excellent' },
                                     { name: 'Digital Lab Results', rate: 78, status: 'Good' },
                                     { name: 'Online Check-in', rate: 45, status: 'Needs Improvement' },
                                     { name: 'Insurance Portal', rate: 62, status: 'Average' }
                                 ].map((mod, i) => (
                                     <div key={i} className="flex flex-col gap-1">
                                         <div className="flex justify-between text-sm font-medium">
                                             <span className="text-gray-700">{mod.name}</span>
                                             <span className={mod.rate > 80 ? 'text-green-600' : mod.rate > 50 ? 'text-yellow-600' : 'text-red-600'}>
                                                 {mod.rate}%
                                             </span>
                                         </div>
                                         <div className="w-full bg-gray-100 rounded-full h-2">
                                             <div 
                                                className={`h-2 rounded-full ${mod.rate > 80 ? 'bg-green-500' : mod.rate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${mod.rate}%` }}
                                             ></div>
                                         </div>
                                         <p className="text-xs text-gray-400 text-right">{mod.status}</p>
                                     </div>
                                 ))}
                             </div>
                        </CardContent>
                     </Card>
                 </div>
            </div>
        </div>
    );
};

export default FeatureAdoptionPage;
