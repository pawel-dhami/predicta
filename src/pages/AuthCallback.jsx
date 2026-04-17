/**
 * AuthCallback.jsx
 *
 * Landing page for Supabase OAuth redirects.
 * Supabase returns the user here with a hash fragment:
 *   https://placeiq-app.netlify.app/auth/callback#access_token=...
 *
 * We let the Supabase client pick up the hash automatically
 * via onAuthStateChange, then navigate to the dashboard.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Supabase JS v2 automatically exchanges the hash fragment for a session.
        // We just need to listen for it.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setStatus('success');
                setTimeout(() => navigate('/dashboard', { replace: true }), 800);
            } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
                setStatus('error');
                setErrorMsg('Sign-in failed or was cancelled. Please try again.');
                setTimeout(() => navigate('/login', { replace: true }), 2500);
            }
        });

        // Also check immediately in case the session is already set
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                setStatus('error');
                setErrorMsg(error.message);
                setTimeout(() => navigate('/login', { replace: true }), 2500);
            } else if (session) {
                setStatus('success');
                setTimeout(() => navigate('/dashboard', { replace: true }), 800);
            }
            // If no session yet, wait for onAuthStateChange
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div style={{
            display: 'grid', placeItems: 'center', minHeight: '100vh',
            background: 'var(--bg-root)',
        }}>
            {/* Background blob */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 20, padding: 40, textAlign: 'center',
                    background: 'var(--bg-card)',
                    borderRadius: 20, border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    maxWidth: 360, width: '90%',
                }}
            >
                {status === 'loading' && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: 60, height: 60, borderRadius: 16,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'grid', placeItems: 'center',
                                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                            }}
                        >
                            <Sparkles size={28} color="#fff" />
                        </motion.div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                Signing you in…
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                Verifying your credentials
                            </div>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                width: 60, height: 60, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                display: 'grid', placeItems: 'center',
                                boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
                            }}
                        >
                            <CheckCircle size={28} color="#fff" />
                        </motion.div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                You're in! 🎉
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                Redirecting to your dashboard…
                            </div>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{
                            width: 60, height: 60, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ef4444, #f87171)',
                            display: 'grid', placeItems: 'center',
                        }}>
                            <AlertCircle size={28} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                                Sign-in failed
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                {errorMsg || 'Something went wrong. Redirecting back…'}
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
