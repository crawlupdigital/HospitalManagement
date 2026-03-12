import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import useDashboardStore from '../../store/dashboardStore';
import useSocket from '../../hooks/useSocket';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import ClickableStat from '../../components/ui/ClickableStat';
import LiveIndicator from '../../components/ui/LiveIndicator';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Users, Calendar, IndianRupee, BedDouble, Activity, Plus, UserPlus, FileText, BarChart3, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { STAGE_LABELS, STAGE_COLORS } from '../../utils/constants';
import api from '../../lib/axios';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const socket = useSocket();

    const { stats, setStats, patientFlow, setPatientFlow, isConnected } = useDashboardStore();
    const [revenueChart, setRevenueChart] = useState([]);
    const [departmentLoad, setDepartmentLoad] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchAll = async () => {
        try {
          const [statsRes, flowRes, revRes, deptRes, actRes] = await Promise.all([
            api.get('/dashboard/stats'),
            api.get('/dashboard/patient-flow'),
            api.get('/dashboard/revenue-chart?days=7'),
            api.get('/dashboard/department-load'),
            api.get('/dashboard/recent-activity?limit=8')
          ]);
          if (statsRes.data?.data) setStats(statsRes.data.data);
          if (flowRes.data?.data) setPatientFlow(flowRes.data.data);
          if (revRes.data?.data) setRevenueChart(revRes.data.data);
          if (deptRes.data?.data) setDepartmentLoad(deptRes.data.data);
          if (actRes.data?.data) setRecentActivity(actRes.data.data);
        } catch (err) {
          console.error('Dashboard fetch error', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAll();
    }, []);

    const activityIcons = {
      appointment: <Calendar className="w-4 h-4 text-blue-500" />,
      patient: <UserPlus className="w-4 h-4 text-green-500" />,
      invoice: <FileText className="w-4 h-4 text-indigo-500" />,
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-jakarta text-gray-900 capitalize">
                        Welcome back, {user?.name || 'Administrator'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here's what's happening in your hospital today.</p>
                </div>
                <div className="flex items-center gap-3">
                    {isConnected && <LiveIndicator />}
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => navigate('/appointments')}>
                        <Plus className="w-4 h-4" /> Book Appointment
                    </Button>
                </div>
            </div>

            {/* ─── Clickable Stat Cards ──────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ClickableStat 
                    title="Total Patients" 
                    value={stats.total_patients.toLocaleString('en-IN')} 
                    icon={Users} 
                    colorClass="bg-blue-100 text-blue-600" 
                    href="/patients"
                    loading={isLoading}
                />
                <ClickableStat 
                    title="Today's Appointments" 
                    value={stats.today_appointments} 
                    icon={Calendar} 
                    colorClass="bg-indigo-100 text-indigo-600" 
                    href="/appointments"
                    loading={isLoading}
                />
                <ClickableStat 
                    title="Total Revenue" 
                    value={formatCurrency(stats.total_revenue)}
                    icon={IndianRupee} 
                    colorClass="bg-green-100 text-green-600" 
                    href="/billing"
                    loading={isLoading}
                />
                <ClickableStat 
                    title="Bed Occupancy" 
                    value={`${stats.bed_occupancy.occupied}/${stats.bed_occupancy.total} (${stats.bed_occupancy.rate}%)`}
                    icon={BedDouble} 
                    colorClass="bg-orange-100 text-orange-600" 
                    href="/icu"
                    loading={isLoading}
                />
            </div>

            {/* ─── Quick Actions ─────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Book Appointment', icon: Calendar, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', route: '/appointments' },
                  { label: 'Register Patient', icon: UserPlus, color: 'bg-green-50 text-green-700 hover:bg-green-100', route: '/patients' },
                  { label: 'Generate Invoice', icon: FileText, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100', route: '/billing' },
                  { label: 'View Reports', icon: BarChart3, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', route: '/analytics' },
                ].map(a => (
                  <button key={a.label} onClick={() => navigate(a.route)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${a.color}`}>
                    <a.icon className="w-4 h-4" /> {a.label}
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Revenue Chart (from API) ──────────── */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview (7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueChart.length > 0 ? revenueChart : [{ date: 'No data', revenue: 0 }]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} fontSize={11} fill="#6B7280" tickFormatter={(v) => v.slice(5)} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} fill="#6B7280" tickFormatter={(v) => `₹${v >= 1000 ? Math.floor(v/1000)+'k' : v}`} dx={-10} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                                    <Line type="monotone" dataKey="revenue" stroke="#1A73E8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Live Patient Flow ──────────────────── */}
                <Card className="col-span-1 border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Live Patient Flow
                            {isConnected && <LiveIndicator label="" className="ml-auto" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {patientFlow.length > 0 ? patientFlow.map((item, i) => (
                                <button 
                                  key={i} 
                                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-colors cursor-pointer"
                                  onClick={() => navigate(`/patients?stage=${item.stage}`)}
                                >
                                    <span className="text-sm font-medium text-gray-700 capitalize">{STAGE_LABELS[item.stage] || item.stage}</span>
                                    <StatusBadge status={item.stage} className="min-w-[2rem] text-center" />
                                    <span className="text-lg font-bold text-gray-900 ml-2">{item.count}</span>
                                </button>
                            )) : (
                              <p className="text-sm text-gray-400 italic text-center py-8">No active patient flow data</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ─── Department Load ────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Department Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {departmentLoad.length > 0 ? (
                          <div className="space-y-3">
                            {departmentLoad.map((d, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                <span className="text-sm font-medium text-gray-700 capitalize">{d.department || 'Unknown'}</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">{d.pending_tasks} pending</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic text-center py-8">No pending department tasks</p>
                        )}
                    </CardContent>
                </Card>

                {/* ─── Recent Activity Feed ───────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length > 0 ? (
                          <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {recentActivity.map((a, i) => (
                              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="mt-0.5">{activityIcons[a.type] || <Activity className="w-4 h-4 text-gray-400" />}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">{a.patient}</span>{' '}
                                    <span className="text-gray-500">{a.action}</span>
                                  </p>
                                  <p className="text-xs text-gray-400">{a.detail}</p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic text-center py-8">No recent activity</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
