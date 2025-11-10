'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAttraction() {
      const res = await fetch(`/api/attractions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAttraction(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || 'Not found');
      }
      setLoading(false);
    }
    if (id) {
      fetchAttraction();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!attraction) return <div>{error || 'Not found.'}</div>;

  async function onDelete() {
    if (!confirm('Delete this attraction? This cannot be undone.')) return;
    setDeleting(true); setError('');
    try {
      const res = await fetch(`/api/attractions/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Delete failed');
      router.push('/attractions');
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h1>{attraction.name}</h1>
      <img src={attraction.coverimage} alt={attraction.name} />
      <p>{attraction.detail}</p>
      <p>Latitude: {attraction.latitude}</p>
      <p>Longitude: {attraction.longitude}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Link href={`/attractions/${id}/edit`}>Edit</Link>
        <button onClick={onDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
        <Link href='/attractions'>Back</Link>
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </div>
  );
}


