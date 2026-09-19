// src/components/customer/tabs/AddressesTab.tsx
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaTrash, FaSpinner, FaTimes } from 'react-icons/fa';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

const AddressesTab = () => {
  const { user } = useAuth();
  const userData: any = user;
  const userId = userData?.uid || userData?.id;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: '', street: '', city: '', province: '', postalCode: '', country: 'Pakistan'
  });

  useEffect(() => {
    if (!userId) return;

    const fetchAddresses = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          setAddresses(snap.data().addresses || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAddr: Address = { id: Date.now().toString(), ...newAddress };
      const updated = [...addresses, newAddr];
      await updateDoc(doc(db, 'users', userId), {
        addresses: updated,
        updatedAt: serverTimestamp(),
      });
      setAddresses(updated);
      setNewAddress({ name: '', street: '', city: '', province: '', postalCode: '', country: 'Pakistan' });
      setShowForm(false);
      alert('✅ Address added!');
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const updated = addresses.filter((a) => a.id !== id);
      await updateDoc(doc(db, 'users', userId), {
        addresses: updated,
        updatedAt: serverTimestamp(),
      });
      setAddresses(updated);
    } catch (error: any) {
      alert('❌ Failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-[#0F766E]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">📍 Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#065F46]"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Address Name (e.g. Home)" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Province" value={newAddress.province} onChange={(e) => setNewAddress({...newAddress, province: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
            <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
            <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <button type="submit" disabled={saving} className="mt-3 bg-[#0F766E] text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No addresses saved</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <p className="font-medium">{address.name}</p>
              <p className="text-sm text-gray-600">{address.street}</p>
              <p className="text-sm text-gray-600">{address.city}, {address.province}</p>
              <p className="text-sm text-gray-600">{address.postalCode}, {address.country}</p>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-xs text-red-600 hover:underline mt-2 flex items-center gap-1"
              >
                <FaTrash size={10} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;