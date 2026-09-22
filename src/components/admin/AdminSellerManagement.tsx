// src/components/admin/AdminSellerManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, CheckCircle, XCircle, Clock, Search, Eye,
  Store, User, Mail, Phone, MapPin, Loader2, MessageCircle,
} from 'lucide-react';
import {
  collection, query, getDocs, doc, updateDoc, setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

const ADMIN_EMAIL = 'mahaonehypermarket@gmail.com';
const SITE_URL = 'https://www.mahaonehypermaket.com';

const cleanPhone = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith('92')) cleaned = `92${cleaned}`;
  return cleaned;
};

const slugify = (name: string): string => {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
};

const openMailto = (to: string, subject: string, body: string): void => {
  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl, '_blank');
};

const openWhatsApp = (phone: string, message: string): void => {
  const cleaned = cleanPhone(phone);
  if (!cleaned) {
    alert('❌ Phone number not available');
    return;
  }
  const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

interface SellerApplication {
  id: string;
  userId: string;
  sellerId: string;
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'sellers'));
      const querySnapshot = await getDocs(q);

      const apps: SellerApplication[] = [];
      let pending = 0, approved = 0, rejected = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const app = {
          id: doc.id,
          userId: data.userId || doc.id,
          sellerId: data.sellerId || doc.id,
          ...data,
        } as SellerApplication;

        apps.push(app);
        if (data.verificationStatus === 'pending') pending++;
        else if (data.verificationStatus === 'approved') approved++;
        else if (data.verificationStatus === 'rejected') rejected++;
      });

      apps.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setApplications(apps);
      setStats({ total: apps.length, pending, approved, rejected });
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      alert('Failed to load seller applications. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: SellerApplication) => {
    if (actionLoading) return;
    if (!confirm(`Approve "${app.storeName}"?`)) return;

    setActionLoading(true);
    try {
      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (app.userId) {
        try {
          const userRef = doc(db, 'users', app.userId);
          await setDoc(userRef, {
            role: 'seller',
            email: app.email || '',
            name: app.fullName || '',
            phone: app.phone || '',
            isActive: true,
            isVerified: true,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (userError: any) {
          console.error('❌ Users update failed:', userError.message);
        }
      }

      const slug = slugify(app.storeName);
      const emailSubject = `🎉 Your Seller Application is Approved! - ${app.storeName}`;
      const emailBody = `Dear ${app.fullName},\n\nCongratulations! 🎉\n\nYour seller application for "${app.storeName}" has been APPROVED.\n\nYou can now login to your seller dashboard:\n${SITE_URL}/login\n\nYour Store URL:\n${SITE_URL}/store/${slug}\n\nStart adding your products and reach thousands of customers across Pakistan!\n\nBest regards,\nMAHA ONE Team\n${SITE_URL}`;

      openMailto(app.email, emailSubject, emailBody);

      setTimeout(() => {
        const whatsappMessage = `🎉 *Congratulations ${app.fullName}!*\n\nYour seller application for *${app.storeName}* has been *APPROVED* ✅\n\n✅ Login now and start selling:\n${SITE_URL}/login\n\n🌐 Your Store URL:\n${SITE_URL}/store/${slug}\n\nWelcome to the MAHA ONE family! 🛍️`;
        openWhatsApp(app.phone, whatsappMessage);
      }, 1500);

      alert(`✅ ${app.storeName} approved!\n\n📧 Email client opened\n💬 WhatsApp opened`);
      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      alert(`❌ Failed to approve: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (app: SellerApplication) => {
    if (actionLoading) return;

    const reason = prompt(
      `Rejection reason for "${app.storeName}"?`,
      'Application incomplete or information not verified'
    );

    if (reason === null) return;

    setActionLoading(true);
    try {
      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const emailSubject = `Your Seller Application Status - ${app.storeName}`;
      const emailBody = `Dear ${app.fullName},\n\nThank you for your interest in becoming a seller on MAHA ONE.\n\nAfter reviewing your application for "${app.storeName}", we regret to inform you that it has been REJECTED.\n\nReason: ${reason}\n\nBest regards,\nMAHA ONE Team\n${SITE_URL}`;

      openMailto(app.email, emailSubject, emailBody);

      setTimeout(() => {
        const whatsappMessage = `Dear ${app.fullName},\n\nYour seller application for *${app.storeName}* has been reviewed.\n\nStatus: *REJECTED* ❌\n\nReason: ${reason}\n\nMAHA ONE Team`;
        openWhatsApp(app.phone, whatsappMessage);
      }, 1500);

      alert(`❌ ${app.storeName} rejected.\n\n📧 Email opened\n💬 WhatsApp opened`);
      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      alert(`❌ Failed to reject: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualEmail = (app: SellerApplication) => {
    const subject = `MAHA ONE - Regarding ${app.storeName}`;
    const body = `Dear ${app.fullName},\n\n`;
    openMailto(app.email, subject, body);
  };

  const handleManualWhatsApp = (app: SellerApplication) => {
    openWhatsApp(app.phone, `Assalam-o-Alaikum ${app.fullName}, this is MAHA ONE team regarding your seller application.`);
  };

  const handleDelete = async (app: SellerApplication) => {
    if (actionLoading) return;
    if (!confirm(`Delete "${app.storeName}"? This cannot be undone.`)) return;

    setActionLoading(true);
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'sellers', app.id));
      alert(`🗑️ ${app.storeName} deleted`);
      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      alert(`❌ Failed to delete: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const viewDetails = (app: SellerApplication) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'rejected': return <XCircle size={12} />;
      default: return null;
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Seller Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage seller applications and accounts
          </p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="px-3 sm:px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#065F46] transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : '🔄'}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'bg-blue-500', status: 'all' as const },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500', status: 'pending' as const },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-500', status: 'approved' as const },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500', status: 'rejected' as const },
        ].map((stat, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setFilterStatus(stat.status)}
            className={`bg-white rounded-xl shadow-sm p-3 sm:p-6 border-2 text-left transition ${
              filterStatus === stat.status
                ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm text-gray-500 truncate">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 sm:p-3 rounded-lg shrink-0`}>
                <stat.icon size={16} className="text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Applications ({filteredApplications.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none text-sm"
            />
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Store className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600">No Applications Found</h3>
            <p className="text-sm text-gray-400 mt-2">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No seller applications yet'}
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <div key={app.id} className="p-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                      app.verificationStatus === 'approved' ? 'bg-green-500'
                      : app.verificationStatus === 'rejected' ? 'bg-red-500'
                      : 'bg-yellow-500'
                    }`}>
                      <Store size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {app.storeName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {app.fullName} • {app.city || 'N/A'}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{app.email}</p>
                      <p className="text-[10px] text-gray-400">{app.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(app.verificationStatus)}`}>
                      {getStatusIcon(app.verificationStatus)}
                      {app.verificationStatus?.charAt(0).toUpperCase() + app.verificationStatus?.slice(1) || 'Pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleManualEmail(app)}
                      className="flex-1 min-w-0 flex items-center justify-center gap-1 text-[11px] bg-purple-50 text-purple-600 py-2 rounded-lg"
                    >
                      <Mail size={11} /> Email
                    </button>
                    <button
                      onClick={() => handleManualWhatsApp(app)}
                      className="flex-1 min-w-0 flex items-center justify-center gap-1 text-[11px] bg-green-50 text-green-600 py-2 rounded-lg"
                    >
                      <MessageCircle size={11} /> WhatsApp
                    </button>
                    <button
                      onClick={() => viewDetails(app)}
                      className="flex-1 min-w-0 flex items-center justify-center gap-1 text-[11px] bg-blue-50 text-blue-600 py-2 rounded-lg"
                    >
                      <Eye size={11} /> View
                    </button>
                  </div>

                  {app.verificationStatus === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApprove(app)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-1 text-[11px] bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                      >
                        <CheckCircle size={11} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(app)}
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-1 text-[11px] bg-red-600 text-white py-2 rounded-lg disabled:opacity-50"
                      >
                        <XCircle size={11} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                            app.verificationStatus === 'approved' ? 'bg-green-500'
                            : app.verificationStatus === 'rejected' ? 'bg-red-500'
                            : 'bg-yellow-500'
                          }`}>
                            <Store size={16} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{app.storeName || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{app.city || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{app.fullName}</p>
                          <p className="text-xs text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={12} /> {app.phone || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.verificationStatus)}`}>
                          {getStatusIcon(app.verificationStatus)}
                          {app.verificationStatus?.charAt(0).toUpperCase() + app.verificationStatus?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleManualEmail(app)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => handleManualWhatsApp(app)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
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
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleReject(app)}
                                disabled={actionLoading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Seller Application</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Store className="text-[#0F766E]" size={18} />
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Store Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Store Name</p>
                      <p className="font-semibold text-gray-800 text-sm">{selectedApp.storeName}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${getStatusColor(selectedApp.verificationStatus)}`}>
                        {getStatusIcon(selectedApp.verificationStatus)}
                        {selectedApp.verificationStatus?.charAt(0).toUpperCase() + selectedApp.verificationStatus?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm text-gray-500">Description</p>
                    <p className="text-gray-700 text-sm">{selectedApp.storeDescription || 'No description provided'}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <MapPin size={14} className="shrink-0" />
                    <span>{selectedApp.address || 'N/A'}, {selectedApp.city || 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="text-[#0F766E]" size={18} />
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Seller Information</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400 shrink-0" />
                      <span className="font-medium truncate">{selectedApp.fullName}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <span className="break-all">{selectedApp.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span>{selectedApp.phone || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleManualEmail(selectedApp)}
                    className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2.5 rounded-lg hover:bg-purple-100 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button
                    onClick={() => handleManualWhatsApp(selectedApp)}
                    className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2.5 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>

                {selectedApp.verificationStatus === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                      Approve + Notify
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                      Reject + Notify
                    </button>
                  </div>
                )}

                {selectedApp.verificationStatus !== 'pending' && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleDelete(selectedApp)}
                      disabled={actionLoading}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                      Delete Seller
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