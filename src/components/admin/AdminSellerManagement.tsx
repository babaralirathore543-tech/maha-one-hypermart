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

// ============================================================
// CONSTANTS
// ============================================================
const ADMIN_EMAIL = 'mahaonehypermarket@gmail.com';
const ADMIN_WHATSAPP = '923033169725';
const SITE_URL = 'https://www.mahaonehypermaket.com';

// ============================================================
// HELPERS
// ============================================================

/** Clean phone number to international format (923XXXXXXXXX) */
const cleanPhone = (phone: string): string => {
  if (!phone) return '';
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Remove leading 0
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);

  // Add 92 if not present
  if (!cleaned.startsWith('92')) cleaned = `92${cleaned}`;

  return cleaned;
};

/** Create slug from store name */
const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/** Open mailto link with pre-filled email */
const openMailto = (
  to: string,
  subject: string,
  body: string
): void => {
  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Open in new tab (mail client will launch)
  window.open(mailtoUrl, '_blank');
};

/** Open WhatsApp with pre-filled message */
const openWhatsApp = (phone: string, message: string): void => {
  const cleaned = cleanPhone(phone);
  if (!cleaned) {
    alert('❌ Phone number not available');
    return;
  }

  const whatsappUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, '_blank');
};

// ============================================================
// INTERFACE
// ============================================================
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

// ============================================================
// COMPONENT
// ============================================================
const AdminSellerManagement = () => {
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch all seller applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching seller applications...');

      const q = query(collection(db, 'sellers'));
      const querySnapshot = await getDocs(q);

      console.log('📦 Total documents:', querySnapshot.size);

      const apps: SellerApplication[] = [];
      let pending = 0,
        approved = 0,
        rejected = 0;

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
      setStats({
        total: apps.length,
        pending,
        approved,
        rejected,
      });

      console.log('✅ Loaded:', apps.length, 'sellers');
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      alert('Failed to load seller applications. Check console.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ✅ APPROVE SELLER
  // ============================================================
  const handleApprove = async (app: SellerApplication) => {
    if (actionLoading) return;

    if (!confirm(`Approve "${app.storeName}"?`)) return;

    setActionLoading(true);

    try {
      console.log('🔄 Approving seller:', app.storeName);

      // Step 1: Update sellers collection
      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'approved',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Seller status updated');

      // Step 2: Create/Update users collection
      if (app.userId) {
        try {
          const userRef = doc(db, 'users', app.userId);
          await setDoc(
            userRef,
            {
              role: 'seller',
              email: app.email || '',
              name: app.fullName || '',
              phone: app.phone || '',
              isActive: true,
              isVerified: true,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          console.log('✅ User role set to seller');
        } catch (userError: any) {
          console.error('❌ Users update failed:', userError.message);
        }
      }

      // ✅ Step 3: SEND EMAIL (opens mail client)
      const slug = slugify(app.storeName);
      const emailSubject = `🎉 Your Seller Application is Approved! - ${app.storeName}`;
      const emailBody = `Dear ${app.fullName},

Congratulations! 🎉

Your seller application for "${app.storeName}" has been APPROVED.

You can now login to your seller dashboard:
${SITE_URL}/login

Your Store URL:
${SITE_URL}/store/${slug}

Start adding your products and reach thousands of customers across Pakistan!

If you have any questions, feel free to reach out:
📧 ${ADMIN_EMAIL}
📱 +92 303 3169725

Welcome to the MAHA ONE family! 🛍️

Best regards,
MAHA ONE Team
${SITE_URL}`;

      openMailto(app.email, emailSubject, emailBody);
      console.log('📧 Email client opened for:', app.email);

      // ✅ Step 4: OPEN WHATSAPP (after 1.5s delay)
      setTimeout(() => {
        const whatsappMessage = `🎉 *Congratulations ${app.fullName}!*

Your seller application for *${app.storeName}* has been *APPROVED* ✅

✅ Login now and start selling:
${SITE_URL}/login

🌐 Your Store URL:
${SITE_URL}/store/${slug}

Welcome to the MAHA ONE family! 🛍️

Questions? Reply to this message or email us at ${ADMIN_EMAIL}`;

        openWhatsApp(app.phone, whatsappMessage);
        console.log('💬 WhatsApp opened for:', app.phone);
      }, 1500);

      alert(
        `✅ ${app.storeName} approved!\n\n📧 Email client opened\n💬 WhatsApp opened\n\nPlease click "Send" in both apps.`
      );

      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      console.error('❌ Error approving seller:', error);
      alert(`❌ Failed to approve: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // ✅ REJECT SELLER
  // ============================================================
  const handleReject = async (app: SellerApplication) => {
    if (actionLoading) return;

    const reason = prompt(
      `Rejection reason for "${app.storeName}"?\n\n(Ye reason email aur WhatsApp mein jayega)`,
      'Application incomplete or information not verified'
    );

    if (reason === null) return; // Cancelled

    setActionLoading(true);

    try {
      console.log('🔄 Rejecting seller:', app.storeName);

      const sellerRef = doc(db, 'sellers', app.id);
      await updateDoc(sellerRef, {
        verificationStatus: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // ✅ Step 1: SEND EMAIL
      const emailSubject = `Your Seller Application Status - ${app.storeName}`;
      const emailBody = `Dear ${app.fullName},

Thank you for your interest in becoming a seller on MAHA ONE.

After reviewing your application for "${app.storeName}", we regret to inform you that it has been REJECTED.

Reason: ${reason}

What can you do?
1. Review the reason above
2. Update your application with correct information
3. Contact us if you believe this is a mistake

Contact us:
📧 ${ADMIN_EMAIL}
📱 +92 303 3169725

We appreciate your interest and hope to see you on the platform soon.

Best regards,
MAHA ONE Team
${SITE_URL}`;

      openMailto(app.email, emailSubject, emailBody);
      console.log('📧 Rejection email opened for:', app.email);

      // ✅ Step 2: OPEN WHATSAPP
      setTimeout(() => {
        const whatsappMessage = `Dear ${app.fullName},

Your seller application for *${app.storeName}* has been reviewed.

Status: *REJECTED* ❌

Reason: ${reason}

You can reapply after fixing the issue, or contact us:
📧 ${ADMIN_EMAIL}
📱 +92 303 3169725

MAHA ONE Team`;

        openWhatsApp(app.phone, whatsappMessage);
        console.log('💬 WhatsApp opened for:', app.phone);
      }, 1500);

      alert(
        `❌ ${app.storeName} rejected.\n\n📧 Email client opened\n💬 WhatsApp opened\n\nPlease click "Send" in both apps.`
      );

      setShowModal(false);
      fetchApplications();
    } catch (error: any) {
      console.error('❌ Error rejecting seller:', error);
      alert(`❌ Failed to reject: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // ✅ MANUAL EMAIL / WHATSAPP (without approving)
  // ============================================================
  const handleManualEmail = (app: SellerApplication) => {
    const subject = `MAHA ONE - Regarding ${app.storeName}`;
    const body = `Dear ${app.fullName},

`;
    openMailto(app.email, subject, body);
  };

  const handleManualWhatsApp = (app: SellerApplication) => {
    openWhatsApp(
      app.phone,
      `Assalam-o-Alaikum ${app.fullName}, this is MAHA ONE team regarding your seller application.`
    );
  };

  // ✅ Delete Seller
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
      console.error('❌ Error deleting seller:', error);
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

    const matchesStatus =
      filterStatus === 'all' || app.verificationStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={12} />;
      case 'pending':
        return <Clock size={12} />;
      case 'rejected':
        return <XCircle size={12} />;
      default:
        return null;
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
          <p className="text-sm text-gray-500 mt-1">
            Manage seller applications and accounts
          </p>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            className={`bg-white rounded-xl shadow-sm p-6 border-2 text-left transition ${
              filterStatus === stat.status
                ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20'
                : 'border-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Applications ({filteredApplications.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none"
            />
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No Applications Found
            </h3>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'No seller applications yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                            app.verificationStatus === 'approved'
                              ? 'bg-green-500'
                              : app.verificationStatus === 'rejected'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          <Store size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {app.storeName || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.city || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {app.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone size={12} /> {app.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          app.verificationStatus
                        )}`}
                      >
                        {getStatusIcon(app.verificationStatus)}
                        {app.verificationStatus?.charAt(0).toUpperCase() +
                          app.verificationStatus?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Manual Email */}
                        <button
                          onClick={() => handleManualEmail(app)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </button>

                        {/* Manual WhatsApp */}
                        <button
                          onClick={() => handleManualWhatsApp(app)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </button>

                        {/* View */}
                        <button
                          onClick={() => viewDetails(app)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Approve / Reject */}
                        {app.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app)}
                              disabled={actionLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve + Notify"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(app)}
                              disabled={actionLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject + Notify"
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
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Seller Application
                </h2>
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
                    <h3 className="font-semibold text-gray-800">
                      Store Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Store Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedApp.storeName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedApp.verificationStatus
                        )}`}
                      >
                        {getStatusIcon(selectedApp.verificationStatus)}
                        {selectedApp.verificationStatus?.charAt(0).toUpperCase() +
                          selectedApp.verificationStatus?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">
                      {selectedApp.storeDescription || 'No description provided'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>
                      {selectedApp.address || 'N/A'},{' '}
                      {selectedApp.city || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="text-[#0F766E]" />
                    <h3 className="font-semibold text-gray-800">
                      Seller Information
                    </h3>
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

                {/* Manual Contact Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleManualEmail(selectedApp)}
                    className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2.5 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    <Mail size={16} /> Send Email
                  </button>
                  <button
                    onClick={() => handleManualWhatsApp(selectedApp)}
                    className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2.5 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>

                {/* Approve / Reject */}
                {selectedApp.verificationStatus === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Approve + Notify
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject + Notify
                    </button>
                  </div>
                )}

                {selectedApp.verificationStatus !== 'pending' && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => handleDelete(selectedApp)}
                      disabled={actionLoading}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
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