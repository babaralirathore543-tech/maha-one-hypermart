// src/components/admin/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaUserCheck,
  FaUserTimes,
  FaEye,
  FaTimes,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaShoppingBag,
  FaHeart
} from 'react-icons/fa';
import { db, collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from '../../config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: any;
  wishlist?: string[];
  cart?: any[];
  address?: any;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      setUpdatingId(userId);
      try {
        await updateDoc(doc(db, 'users', userId), {
          isActive: !currentStatus
        });
        await fetchUsers();
        alert(`✅ User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } catch (error) {
        console.error('❌ Error updating user status:', error);
        alert('❌ Failed to update user status');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (window.confirm(`Change user role to "${newRole}"?`)) {
      setUpdatingId(userId);
      try {
        await updateDoc(doc(db, 'users', userId), {
          role: newRole
        });
        await fetchUsers();
        alert(`✅ User role updated to: ${newRole}`);
      } catch (error) {
        console.error('❌ Error updating user role:', error);
        alert('❌ Failed to update user role');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        await fetchUsers();
        alert('✅ User deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        alert('❌ Failed to delete user');
      }
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      vendor: 'bg-blue-100 text-blue-800',
      seller: 'bg-blue-100 text-blue-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.customer;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const roleOptions = [
    { value: 'customer', label: 'Customer' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'seller', label: 'Seller' },
    { value: 'admin', label: 'Admin' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">👥 Users Management</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="text-[#0F766E] hover:text-[#065F46] transition text-sm whitespace-nowrap"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <p className="text-lg sm:text-2xl font-bold text-gray-800">{users.length}</p>
          <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <p className="text-lg sm:text-2xl font-bold text-green-600">
            {users.filter(u => u.isActive !== false).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <p className="text-lg sm:text-2xl font-bold text-red-600">
            {users.filter(u => u.isActive === false).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Inactive</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          <p className="text-lg sm:text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Admins</p>
        </div>
      </div>

      {/* Users */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <div className="text-5xl sm:text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-base sm:text-lg">
            {searchTerm ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      ) : (
        <>
          {/* ============ MOBILE CARD VIEW ============ */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold shrink-0">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'N/A'}</p>
                    <p className="text-[10px] text-gray-400">{user.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getRoleBadge(user.role)}`}>
                    {user.role || 'customer'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    user.isActive !== false
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {user.isActive !== false ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                {/* Role select */}
                <div className="mb-2">
                  <select
                    value={user.role || 'customer'}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg"
                    disabled={updatingId === user.id}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => viewUserDetails(user)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-blue-50 text-blue-700 py-2 rounded-lg"
                  >
                    <FaEye size={12} /> View
                  </button>
                  <button
                    onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg ${
                      user.isActive !== false
                        ? 'bg-red-50 text-red-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                    disabled={updatingId === user.id}
                  >
                    {user.isActive !== false ? (
                      <><FaUserTimes size={12} /> Disable</>
                    ) : (
                      <><FaUserCheck size={12} /> Enable</>
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ============ DESKTOP TABLE ============ */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-sm font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <p className="text-sm font-medium text-gray-800">{user.name || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{user.email || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{user.phone || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role || 'customer'}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#0F766E] outline-none cursor-pointer ${getRoleBadge(user.role)}`}
                          disabled={updatingId === user.id}
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isActive !== false
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {user.isActive !== false ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="text-blue-600 hover:text-blue-800 transition p-1.5 rounded hover:bg-blue-50"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                            className={`transition p-1.5 rounded ${
                              user.isActive !== false
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            disabled={updatingId === user.id}
                          >
                            {user.isActive !== false ? <FaUserTimes size={16} /> : <FaUserCheck size={16} />}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 transition p-1.5 rounded hover:bg-red-50"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <FaTimes size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-14 h-14 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-bold text-gray-800 truncate">
                    {selectedUser.name || 'Unknown'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role || 'customer'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedUser.isActive !== false
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <FaEnvelope className="text-gray-400 mt-1 shrink-0" />
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-800 break-all flex-1">{selectedUser.email || 'N/A'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FaPhone className="text-gray-400 mt-1 shrink-0" />
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-800">{selectedUser.phone || 'N/A'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FaCalendarAlt className="text-gray-400 mt-1 shrink-0" />
                  <span className="text-gray-500">Joined:</span>
                  <span className="text-gray-800">{formatDate(selectedUser.createdAt)}</span>
                </p>
                <p className="flex items-start gap-2">
                  <FaUser className="text-gray-400 mt-1 shrink-0" />
                  <span className="text-gray-500">Verified:</span>
                  <span className={selectedUser.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.isVerified ? '✅ Verified' : '❌ Not Verified'}
                  </span>
                </p>
              </div>

              {selectedUser.address && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">📍 Address</h4>
                  <div className="text-sm space-y-0.5">
                    <p>{selectedUser.address.street || 'N/A'}</p>
                    <p>
                      {selectedUser.address.city || 'N/A'},{' '}
                      {selectedUser.address.province || 'N/A'}
                    </p>
                    <p>{selectedUser.address.country || 'Pakistan'}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <FaHeart className="mx-auto text-red-500 text-lg sm:text-xl" />
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    {selectedUser.wishlist?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">Wishlist</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <FaShoppingBag className="mx-auto text-[#0F766E] text-lg sm:text-xl" />
                  <p className="text-lg sm:text-xl font-bold mt-1">
                    {selectedUser.cart?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">Cart Items</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;