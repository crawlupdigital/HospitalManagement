import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { ShieldCheck, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import api from '../../lib/axios';

const InsurancePage = () => {
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [reviewData, setReviewData] = useState({
        status: 'approved', // approved, rejected, settled
        approved_amount: 0,
        remarks: ''
    });

    const fetchClaims = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/insurance/claims');
            if (res.data && res.data.data) {
                const formatted = res.data.data.map(claim => ({
                    id: claim.id,
                    patientName: claim.Patient?.name || 'Unknown',
                    patientUid: claim.Patient?.patient_uid || 'Unknown',
                    provider: claim.provider_name,
                    policy: claim.policy_number,
                    claimedAmount: claim.claimed_amount,
                    approvedAmount: claim.approved_amount || 0,
                    status: claim.status,
                    date: new Date(claim.created_at).toLocaleDateString()
                }));
                setClaims(formatted);
            }
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleOpenReview = (claim) => {
        setSelectedClaim(claim);
        setReviewData({
            status: 'approved',
            approved_amount: claim.claimedAmount,
            remarks: ''
        });
        setIsReviewOpen(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.put(`/insurance/review/${selectedClaim.id}`, reviewData),
                {
                    loading: 'Processing claim review...',
                    success: 'Claim updated successfully!',
                    error: 'Failed to update claim.'
                }
            );

            setIsReviewOpen(false);
            fetchClaims();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusColors = (status) => {
        switch(status) {
            case 'submitted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'settled': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const columns = [
        { header: 'Claim ID', accessorKey: 'id' },
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
            header: 'Insurance Details', 
            cell: (row) => (
                <div>
                     <div className="font-medium text-indigo-900">{row.provider}</div>
                     <div className="text-xs text-indigo-500">Policy: {row.policy}</div>
                </div>
            )
        },
        { 
            header: 'Amounts (₹)', 
            cell: (row) => (
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Claimed: {row.claimedAmount}</div>
                    {row.status !== 'submitted' && row.status !== 'rejected' && (
                        <div className="text-xs font-bold text-green-600">Approved: {row.approvedAmount}</div>
                    )}
                </div>
            )
        },
        { 
            header: 'Status', 
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusColors(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Filed On', accessorKey: 'date' },
        { 
            header: 'Action', 
            cell: (row) => (
                <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={row.status === 'settled' || row.status === 'rejected'}
                    onClick={() => handleOpenReview(row)}
                >
                    {row.status === 'submitted' ? 'Review Claim' : 'Mark Settled'}
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-jakarta text-gray-900">Insurance Claims Manager</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                 <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm font-medium">Pending Review</p>
                            <h3 className="text-3xl font-bold mt-1">{claims.filter(c => c.status === 'submitted').length}</h3>
                        </div>
                        <FileText className="w-8 h-8 opacity-80" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Approved / Unpaid</p>
                            <h3 className="text-3xl font-bold mt-1 text-blue-600">{claims.filter(c => c.status === 'approved').length}</h3>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-200" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Settled</p>
                            <h3 className="text-3xl font-bold mt-1 text-green-600">{claims.filter(c => c.status === 'settled').length}</h3>
                        </div>
                        <ShieldCheck className="w-8 h-8 text-green-200" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Rejected</p>
                            <h3 className="text-3xl font-bold mt-1 text-red-600">{claims.filter(c => c.status === 'rejected').length}</h3>
                        </div>
                        <XCircle className="w-8 h-8 text-red-200" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <ShieldCheck className="w-5 h-5 text-gray-500" />
                         Claims Database
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                     <DataTable 
                         columns={columns}
                         data={claims}
                         emptyMessage={isLoading ? "Loading claims..." : "No insurance claims found."}
                     />
                 </CardContent>
            </Card>

            {/* Review Modal */}
            <Modal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                title={`Review Claim - Provider: ${selectedClaim?.provider}`}
                maxWidth="md"
            >
                {selectedClaim && (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                         <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Claimed Amount</p>
                                <p className="text-xl font-bold text-gray-900">₹{selectedClaim.claimedAmount}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Patient</p>
                                <p className="font-medium text-gray-900">{selectedClaim.patientName}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Decision Status</label>
                            <select 
                                className="w-full text-sm border-gray-300 rounded-md p-2"
                                value={reviewData.status}
                                onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                            >
                                {selectedClaim.status === 'submitted' && (
                                    <>
                                        <option value="approved">Approve Claim</option>
                                        <option value="rejected">Reject Claim</option>
                                    </>
                                )}
                                {selectedClaim.status === 'approved' && (
                                    <option value="settled">Mark as Settled (Payment Received)</option>
                                )}
                            </select>
                        </div>

                        {reviewData.status !== 'rejected' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Approved Payout Amount (₹)</label>
                                <Input 
                                    type="number" 
                                    required 
                                    max={selectedClaim.claimedAmount}
                                    value={reviewData.approved_amount}
                                    onChange={(e) => setReviewData({...reviewData, approved_amount: parseFloat(e.target.value)})}
                                />
                                <p className="text-xs text-gray-500 mt-1">Cannot exceed original claimed amount of ₹{selectedClaim.claimedAmount}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Processor Remarks</label>
                            <Textarea 
                                placeholder="Add notes mapping to authorization ID or rejection codes..." 
                                className="h-24"
                                value={reviewData.remarks}
                                onChange={(e) => setReviewData({...reviewData, remarks: e.target.value})}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button variant="ghost" type="button" onClick={() => setIsReviewOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className={`flex items-center gap-2 ${reviewData.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                <CheckCircle className="w-4 h-4" />
                                Save Decision
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default InsurancePage;
