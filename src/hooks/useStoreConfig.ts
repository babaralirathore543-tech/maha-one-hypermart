// src/hooks/useStoreConfig.ts
import { useEffect, useState } from 'react';
import { db, collection, query, where, getDocs, limit, doc, getDoc } from '../config/firebase';

export interface StoreData {
  id: string;
  sellerId: string;
  slug: string;
  storeName: string;
  theme: string;
  colors: { primary: string; secondary: string; background: string };
  hero: { heading: string; subtitle: string; bannerImage?: string };
  tagline: string;
  sections: string[];
  about: string;
  seo: { title: string; description: string };
  logo: string | null;
  status: 'draft' | 'published';
}

export function useStoreBySlug(slug: string) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchStore = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'stores'),
          where('slug', '==', slug),
          where('status', '==', 'published'),
          limit(1)
        );
        const snap = await getDocs(q);

        if (!snap.empty) {
          const d = snap.docs[0];
          setStore({ id: d.id, ...d.data() } as StoreData);
        } else {
          setError('Store not found');
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load store');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  return { store, loading, error };
}

export function useSellerStore(sellerId: string | null) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    const fetchStore = async () => {
      setLoading(true);
      try {
        const ref = doc(db, 'stores', sellerId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setStore({ id: snap.id, ...snap.data() } as StoreData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [sellerId]);

  return { store, loading };
}