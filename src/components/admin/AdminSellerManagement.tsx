// src/components/admin/AdminSellerManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Eye,
  MoreVertical,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';  // ✅ Removed 'City'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface SellerApplication {
  id: string;
  userId: string;
  storeName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  storeDescription: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const AdminSellerManagement = () => {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // ✅ Fetch all seller applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'sellers'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const apps: SellerApplication[] = [];
      let pending = 0, approved = 0, rejected = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const app = { id: doc.id, ...data } as SellerApplication;
        apps.push(app);
        
        if (data.verificationStatus === 'pending') pending++;
        else if (data.verificationStatus === 'approved') approved++;
        else if (data.verificationStatus === 'rejected') rejected++;
      });
      
      setApplications(apps);
      setStats({
        total: apps.length,
        pending,
        approved,
        rejected,
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve Seller
  const handleApprove = async (app: SellerApplication) => {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      // 1. Update seller status
      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Update user role in users collection
      const userRef = doc(db, 'users', app.userId);
      await updateDoc(userRef, {
        role: 'seller',
        status: 'active',
        updatedAt: serverTimestamp(),
      });

      alert(`✅ ${app.storeName} has been approved!`);
      setShowModal(false);
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Error approving seller:', error);
      alert('❌ Failed to approve seller. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Reject Seller
  const handleReject = async (app: SellerApplication) => {
    if (actionLoading) return;
    setActionLoading(true);
    
    try {
      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'rejected',
        updatedAt: serverTimestamp(),
      });

      alert(`❌ ${app.storeName} has been rejected.`);
      setShowModal(false);
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error('Error rejecting seller:', error);
      alert('❌ Failed to reject seller. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ View Details
  const viewDetails = (app: SellerApplication) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  // ✅ Filter applications by search
  const filteredApplications = applications.filter(app =>
    app.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin text-4xl text-[#0F766E] mx-auto" />
          <p className="text-gray-500 mt-4">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage seller applications and accounts</p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : '🔄'}
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sellers', value: stats.total, icon: Users, color: 'bg-blue-500' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Applications ({filteredApplications.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E]"
            />
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No Applications Found</h3>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try adjusting your search' : 'All seller applications have been reviewed'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{app.storeName}</p>
                        <p className="text-sm text-gray-500">{app.city || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800">{app.fullName}</p>
                        <p className="text-xs text-gray-500">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.verificationStatus)}`}>
                        {app.verificationStatus?.charAt(0).toUpperCase() + app.verificationStatus?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(app)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {app.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              disabled={actionLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app)}
                              disabled={actionLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Details Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Seller Application</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Store Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="text-[#0F766E]" />
                    <h3 className="font-semibold text-gray-800">Store Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Store Name</p>
                      <p className="font-semibold text-gray-800">{selectedApp.storeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApp.verificationStatus)}`}>
                        {selectedApp.verificationStatus?.charAt(0).toUpperCase() + selectedApp.verificationStatus?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{selectedApp.storeDescription || 'No description provided'}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{selectedApp.address || 'N/A'}, {selectedApp.city || 'N/A'}</span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="text-[#0F766E]" />
                    <h3 className="font-semibold text-gray-800">Seller Information</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span className="font-medium">{selectedApp.fullName}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span>{selectedApp.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span>{selectedApp.phone || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApp.verificationStatus === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSellerManagement;