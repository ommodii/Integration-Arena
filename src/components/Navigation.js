"use client";

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { LogIn, LogOut, Code, User } from 'lucide-react';

export default function Navigation() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 0',
      marginBottom: '2rem',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Code size={24} color="var(--accent-primary)" />
        Integral Arena
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>...</div>
        ) : user ? (
          <>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <User size={18} />
              <span className="hide-mobile">{user.user_metadata?.full_name || 'Dashboard'}</span>
            </Link>
            
            {/* Show Admin Link only if configured */}
            {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <Link href="/admin" style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>
                Admin
              </Link>
            )}
            
            <button onClick={signOut} className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <LogOut size={16} /> <span style={{ marginLeft: '4px' }}>Sign Out</span>
            </button>
          </>
        ) : (
          <button onClick={signInWithGoogle} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <LogIn size={16} /> <span style={{ marginLeft: '4px' }}>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
