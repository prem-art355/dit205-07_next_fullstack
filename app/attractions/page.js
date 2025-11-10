'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const res = await fetch('/api/attractions', { cache: 'no-store' });
        const data = await res.json();
        setAttractions(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    fetchAttractions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Attractions</h1>
      <div>
        <Link href="/attractions/new">Create New Attraction</Link>
      </div>
      <ul>
        {attractions.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            {item.coverimage ? (
              <img src={item.coverimage} height={200} alt={item.name} />
            ) : null}
            <p>{item.detail}</p>
            <Link href={`/attractions/${item.id}`}>Read More</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


