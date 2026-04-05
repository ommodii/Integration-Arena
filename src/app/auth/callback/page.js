"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Supabase Implicit Flow handles hash URL extraction seamlessly. 
      // Ensure session is caught by library memory layer properly instead of breaking.
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/dashboard');
      } else {
        // Fallback subscriber listener ensures edge cases evaluate fully
        const { data: authListener } = supabase.auth.onAuthStateChange((event, s) => {
          if (s) {
            router.push('/dashboard');
          }
        });
        
        // Complete fallback error loop escaping infinite hanging
        setTimeout(() => {
          router.push('/');
        }, 4000);
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Authenticating...</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Securing your session securely. Please wait.</p>
    </div>
  );
}
