import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

const TestFirebase = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testCollections = async () => {
      const collections = ['users', 'products', 'orders', 'wishlist'];
      const data: any = {};

      for (const name of collections) {
        try {
          const q = query(collection(db, name), limit(5));
          const snapshot = await getDocs(q);
          data[name] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(`✅ ${name}: ${data[name].length} documents found`);
        } catch (err) {
          console.error(`❌ ${name}: Error`, err);
          data[name] = [];
          setError(`Error fetching ${name}: ${(err as Error).message}`);
        }
      }

      setResults(data);
      setLoading(false);
    };

    testCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing Firebase Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔥 Firebase Connection Test</h1>
        <p className="text-gray-500 mb-8">Testing 4 collections: users, products, orders, wishlist</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-semibold">⚠️ Error:</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(results).map(([name, data]: [string, any]) => (
            <div key={name} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-700 capitalize">{name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.length > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {data.length} docs
                </span>
              </div>

              {data.length > 0 ? (
                <div className="space-y-2">
                  {data.slice(0, 3).map((doc: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                      <code className="text-xs text-gray-600">
                        {JSON.stringify(doc, null, 2).slice(0, 150)}
                        {JSON.stringify(doc).length > 150 && '...'}
                      </code>
                    </div>
                  ))}
                  {data.length > 3 && (
                    <p className="text-xs text-gray-400 mt-1">+ {data.length - 3} more documents</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">⚠️ No documents found in this collection</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800">📋 Status Summary</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            {Object.entries(results).map(([name, data]: [string, any]) => (
              <li key={name}>
                {data.length > 0 ? '✅' : '⚠️'} {name}: {data.length > 0 ? 'Connected' : 'Empty collection'}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Check console for detailed logs (F12 → Console tab)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestFirebase;