import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import OnboardingFlow from './OnboardingFlow';
import AdminDashboard from './AdminDashboard';
import './index.css';

export default function PlacementIQ() {
    const [view, setView] = useState('landing'); // landing | login | onboarding | dashboard
    const [role, setRole] = useState(null); // student | tpc
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleOpenLogin = () => {
        setShowLoginModal(true);
    };

    const handleCloseLogin = () => {
        setShowLoginModal(false);
    };

    const handleLogin = (selectedRole) => {
        setRole(selectedRole);
        setShowLoginModal(false);
        if (selectedRole === 'student') {
            setView('onboarding');
        } else {
            setView('dashboard');
        }
    };

    const handleOnboardingComplete = (profile) => {
        console.log('Onboarding profile:', profile);
        setView('dashboard');
    };

    const handleLogout = () => {
        setView('landing');
        setRole(null);
        setShowLoginModal(false);
    };

    return (
        <div className="h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            `}</style>

            <AnimatePresence mode="wait">
                {(view === 'landing') && (
                    <motion.div key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <LandingPage onOpenLogin={handleOpenLogin} />
                    </motion.div>
                )}
                {view === 'onboarding' && (
                    <motion.div key="onboarding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <OnboardingFlow onComplete={handleOnboardingComplete} />
                    </motion.div>
                )}
                {view === 'dashboard' && (
                    <motion.div key="dashboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                    >
                        <AdminDashboard role={role} onLogout={handleLogout} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ Login Modal Overlay ══ */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={handleCloseLogin}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="relative z-10 w-full max-w-[480px] mx-4"
                        >
                            {/* Close button */}
                            <button
                                onClick={handleCloseLogin}
                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all z-20"
                            >
                                <X size={16} />
                            </button>

                            {/* Login form embedded in modal */}
                            <LoginPage onLogin={handleLogin} isModal />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}