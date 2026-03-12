import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { Receipt, IndianRupee, Wallet, FileText, Download, CreditCard, Eye, CheckCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import api from '../../lib/axios';

const BillingPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ todayCollection: 0, pendingDues: 0, totalInvoices: 0 });

    // Generate Invoice Modal
    const [isGenModalOpen, setIsGenModalOpen] = useState(false);
    const [genData, setGenData] = useState({ patient_id: '', appointment_id: '' });
    const [patients, setPatients] = useState([]);

    // View Invoice Modal
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewInvoice, setViewInvoice] = useState(null);

    // Payment Modal
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [payInvoice, setPayInvoice] = useState(null);
    const [payData, setPayData] = useState({ amount: '', payment_method: 'CASH', transaction_ref: '' });

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/billing/invoices');
            if (res.data?.data) {
                const inv = res.data.data;
                setInvoices(inv);

                // Calculate stats
                const today = new Date().toISOString().split('T')[0];
                const todayPaid = inv
                    .filter(i => i.status === 'PAID' && i.created_at?.startsWith(today))
                    .reduce((sum, i) => sum + parseFloat(i.grand_total || 0), 0);
                const pending = inv
                    .filter(i => i.status === 'PENDING' || i.status === 'PARTIAL')
                    .reduce((sum, i) => sum + parseFloat(i.patient_payable || 0), 0);

                setStats({
                    todayCollection: todayPaid,
                    pendingDues: pending,
                    totalInvoices: inv.length
                });
            }
        } catch (err) {
            console.error('Failed to fetch invoices', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get('/patients');
            if (res.data?.data) {
                const raw = res.data.data;
                setPatients(Array.isArray(raw) ? raw : (raw.rows || []));
            }
        } catch (e) { /* ignore */ }
    };

    useEffect(() => {
        fetchInvoices();
        fetchPatients();
    }, []);

    // ─── Generate Invoice ────────────────────
    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.post('/billing/invoices/generate', {
                    patient_id: parseInt(genData.patient_id),
                    appointment_id: genData.appointment_id ? parseInt(genData.appointment_id) : null
                }),
                {
                    loading: 'Generating invoice...',
                    success: 'Invoice generated successfully!',
                    error: (err) => err.response?.data?.message || 'Failed to generate invoice.'
                }
            );
            setIsGenModalOpen(false);
            setGenData({ patient_id: '', appointment_id: '' });
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    // ─── View Invoice ────────────────────────
    const handleView = async (invoice) => {
        try {
            const res = await api.get(`/billing/invoices/${invoice.id}`);
            if (res.data?.data) {
                setViewInvoice(res.data.data);
                setIsViewOpen(true);
            }
        } catch (err) {
            toast.error('Failed to load invoice details');
        }
    };

    // ─── Collect Payment ─────────────────────
    const handlePayOpen = (invoice) => {
        setPayInvoice(invoice);
        setPayData({
            amount: parseFloat(invoice.patient_payable || invoice.grand_total).toFixed(2),
            payment_method: 'CASH',
            transaction_ref: ''
        });
        setIsPayOpen(true);
    };

    const handlePaySubmit = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.post(`/billing/invoices/${payInvoice.id}/pay`, {
                    amount: parseFloat(payData.amount),
                    payment_method: payData.payment_method,
                    transaction_ref: payData.transaction_ref || null
                }),
                {
                    loading: 'Processing payment...',
                    success: 'Payment recorded successfully!',
                    error: (err) => err.response?.data?.message || 'Payment failed.'
                }
            );
            setIsPayOpen(false);
            setPayInvoice(null);
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const statusColors = {
        'PAID': 'bg-green-100 text-green-700',
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'PARTIAL': 'bg-orange-100 text-orange-700',
        'DRAFT': 'bg-gray-100 text-gray-700',
        'CANCELLED': 'bg-red-100 text-red-700',
    };

    const columns = [
        { header: 'Invoice #', cell: (row) => <span className="font-mono font-medium text-gray-900">{row.invoice_no}</span> },
        { 
            header: 'Patient', 
            cell: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.Patient?.name || '-'}</div>
                    <div className="text-xs text-gray-500">{row.Patient?.patient_uid || ''}</div>
                </div>
            )
        },
        { header: 'Amount', cell: (row) => <span className="font-semibold text-gray-900">{formatCurrency(row.grand_total)}</span> },
        { header: 'Date', cell: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' },
        { 
            header: 'Status', 
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[row.status] || 'bg-gray-100 text-gray-700'}`}>
                    {row.status}
                </span>
            ) 
        },
        { 
            header: 'Actions', 
            cell: (row) => (
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 gap-1" onClick={() => handleView(row)}>
                        <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    {(row.status === 'PENDING' || row.status === 'PARTIAL') && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1 text-white" onClick={() => handlePayOpen(row)}>
                            <CreditCard className="w-3.5 h-3.5" /> Collect
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-jakarta text-gray-900">Billing & Invoicing</h1>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2" onClick={() => setIsGenModalOpen(true)}>
                    <Plus className="w-4 h-4" /> Generate Invoice
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Today's Collection</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2">{formatCurrency(stats.todayCollection)}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <IndianRupee className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Pending Dues</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">{formatCurrency(stats.pendingDues)}</h3>
                            </div>
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                                <Wallet className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Invoices</p>
                                <h3 className="text-4xl font-bold font-jakarta mt-2 text-gray-900">{stats.totalInvoices}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <Receipt className="w-5 h-5 text-gray-500" /> All Invoices
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={invoices}
                         emptyMessage={isLoading ? 'Loading invoices...' : 'No invoices found. Generate one using the button above.'}
                     />
                 </CardContent>
            </Card>

            {/* ═══ GENERATE INVOICE MODAL ═══ */}
            <Modal isOpen={isGenModalOpen} onClose={() => setIsGenModalOpen(false)} title="Generate New Invoice" maxWidth="md">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                        This will automatically aggregate all charges for the patient: consultation fee, medicines dispensed, lab tests, and radiology scans.
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                        <select
                            required
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={genData.patient_id}
                            onChange={(e) => setGenData({...genData, patient_id: e.target.value})}
                        >
                            <option value="">Select patient…</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.patient_uid})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID (Optional)</label>
                        <Input 
                            type="number"
                            placeholder="Leave blank for walk-in billing" 
                            value={genData.appointment_id}
                            onChange={(e) => setGenData({...genData, appointment_id: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button variant="ghost" type="button" onClick={() => setIsGenModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
                            <Download className="w-4 h-4" /> Generate Invoice
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* ═══ VIEW INVOICE MODAL ═══ */}
            <Modal isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); setViewInvoice(null); }} title="Invoice Details" maxWidth="md">
                {viewInvoice && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 font-mono">{viewInvoice.invoice_no}</h2>
                                    <p className="text-sm text-indigo-700">{viewInvoice.Patient?.name} ({viewInvoice.Patient?.patient_uid})</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[viewInvoice.status] || 'bg-gray-100'}`}>
                                    {viewInvoice.status}
                                </span>
                            </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr><th className="text-left p-3 font-medium text-gray-600">Description</th><th className="text-right p-3 font-medium text-gray-600">Amount</th></tr>
                                </thead>
                                <tbody>
                                    <LineItem label="Consultation Fee" amount={viewInvoice.consultation_fee} />
                                    <LineItem label="Medicines" amount={viewInvoice.medicine_total} />
                                    <LineItem label="Lab Tests" amount={viewInvoice.lab_total} />
                                    <LineItem label="Radiology / Imaging" amount={viewInvoice.radiology_total} />
                                    {parseFloat(viewInvoice.nursing_total) > 0 && <LineItem label="Nursing Charges" amount={viewInvoice.nursing_total} />}
                                    {parseFloat(viewInvoice.bed_charges) > 0 && <LineItem label="Bed / Room Charges" amount={viewInvoice.bed_charges} />}
                                    {parseFloat(viewInvoice.other_charges) > 0 && <LineItem label="Other Charges" amount={viewInvoice.other_charges} />}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td className="p-3 font-medium text-gray-700">Subtotal</td>
                                        <td className="p-3 text-right font-semibold">{formatCurrency(viewInvoice.subtotal)}</td>
                                    </tr>
                                    {parseFloat(viewInvoice.discount) > 0 && (
                                        <tr>
                                            <td className="p-3 text-green-700">Discount</td>
                                            <td className="p-3 text-right text-green-700">-{formatCurrency(viewInvoice.discount)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="p-3 text-gray-600">Tax (GST 5%)</td>
                                        <td className="p-3 text-right">{formatCurrency(viewInvoice.tax)}</td>
                                    </tr>
                                    {parseFloat(viewInvoice.insurance_amount) > 0 && (
                                        <tr>
                                            <td className="p-3 text-blue-700">Insurance Coverage</td>
                                            <td className="p-3 text-right text-blue-700">-{formatCurrency(viewInvoice.insurance_amount)}</td>
                                        </tr>
                                    )}
                                    <tr className="border-t-2 border-gray-300">
                                        <td className="p-3 font-bold text-gray-900 text-base">Grand Total</td>
                                        <td className="p-3 text-right font-bold text-gray-900 text-base">{formatCurrency(viewInvoice.grand_total)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold text-indigo-700">Patient Payable</td>
                                        <td className="p-3 text-right font-bold text-indigo-700">{formatCurrency(viewInvoice.patient_payable)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {(viewInvoice.status === 'PENDING' || viewInvoice.status === 'PARTIAL') && (
                            <div className="flex justify-end pt-2">
                                <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => { setIsViewOpen(false); handlePayOpen(viewInvoice); }}>
                                    <CreditCard className="w-4 h-4" /> Collect Payment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* ═══ PAYMENT MODAL ═══ */}
            <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Collect Payment" maxWidth="sm">
                {payInvoice && (
                    <form onSubmit={handlePaySubmit} className="space-y-4">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <p className="text-sm text-green-700 font-medium">Invoice {payInvoice.invoice_no}</p>
                            <p className="text-3xl font-bold text-green-800 mt-1">{formatCurrency(payInvoice.patient_payable || payInvoice.grand_total)}</p>
                            <p className="text-xs text-green-600 mt-1">{payInvoice.Patient?.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
                            <Input 
                                required type="number" step="0.01"
                                value={payData.amount}
                                onChange={(e) => setPayData({...payData, amount: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select 
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={payData.payment_method}
                                onChange={(e) => setPayData({...payData, payment_method: e.target.value})}
                            >
                                <option value="CASH">Cash</option>
                                <option value="CARD">Card (Debit/Credit)</option>
                                <option value="UPI">UPI / PhonePe / GPay</option>
                                <option value="NEFT">NEFT / Bank Transfer</option>
                                <option value="CHEQUE">Cheque</option>
                            </select>
                        </div>

                        {payData.payment_method !== 'CASH' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference</label>
                                <Input 
                                    placeholder="Transaction ID or UPI Ref No." 
                                    value={payData.transaction_ref}
                                    onChange={(e) => setPayData({...payData, transaction_ref: e.target.value})}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" type="button" onClick={() => setIsPayOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Confirm Payment
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

// Reusable invoice line item
const LineItem = ({ label, amount }) => {
    const val = parseFloat(amount || 0);
    if (val === 0) return null;
    return (
        <tr className="border-b border-gray-50">
            <td className="p-3 text-gray-700">{label}</td>
            <td className="p-3 text-right font-medium">₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
    );
};

export default BillingPage;
