import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './LoginPage';
import OnboardingFlow from './OnboardingFlow';
import AdminDashboard from './AdminDashboard';
import './index.css';

export default function PlacementIQ() {
    const [view, setView] = useState('login'); // login | onboarding | dashboard
    const [role, setRole] = useState(null); // student | tpc

    const handleLogin = (selectedRole) => {
        setRole(selectedRole);
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

    return (
        <div className="h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            `}</style>

            <AnimatePresence mode="wait">
                {view === 'login' && (
                    <LoginPage key="login" onLogin={handleLogin} />
                )}
                {view === 'onboarding' && (
                    <OnboardingFlow key="onboarding" onComplete={handleOnboardingComplete} />
                )}
                {view === 'dashboard' && (
                    <AdminDashboard key="dashboard" role={role} />
                )}
            </AnimatePresence>
        </div>
    );
}