import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, Bell, Shield, Palette, Globe, Moon, Sun, Lock, Mail, Save } from 'lucide-react';

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

    const Toggle = ({ on, onToggle }) => (
        <button onClick={onToggle}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative ${on ? 'bg-indigo-500' : 'bg-gray-200'}`}>
            <motion.div animate={{ x: on ? 20 : 2 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md" />
        </button>
    );

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Settings</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-900 mb-6">
                Settings
            </motion.h1>

            <div className="max-w-2xl space-y-6">
                {/* Profile */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><User size={16} className="text-indigo-500" /> Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <input type="text" defaultValue="Mark Bennet"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                            <input type="email" defaultValue="admin@tpc.edu"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Role</label>
                            <input type="text" defaultValue="TPC Admin" disabled
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Department</label>
                            <input type="text" defaultValue="Training & Placement Cell"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                        </div>
                    </div>
                    <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/20">
                        <Save size={14} /> Save Changes
                    </button>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Bell size={16} className="text-indigo-500" /> Notifications</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Email Notifications', desc: 'Receive updates about placements via email', on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
                            { label: 'Push Notifications', desc: 'Get real-time alerts for interviews and deadlines', on: pushNotifs, toggle: () => setPushNotifs(!pushNotifs) },
                            { label: 'Weekly Digest', desc: 'Receive a summary of weekly placement activity', on: weeklyDigest, toggle: () => setWeeklyDigest(!weeklyDigest) },
                        ].map((n, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <div>
                                    <div className="text-sm font-semibold text-gray-700">{n.label}</div>
                                    <div className="text-xs text-gray-400">{n.desc}</div>
                                </div>
                                <Toggle on={n.on} onToggle={n.toggle} />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Appearance */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Palette size={16} className="text-indigo-500" /> Appearance</h3>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="text-sm font-semibold text-gray-700">Dark Mode</div>
                            <div className="text-xs text-gray-400">Toggle dark/light theme</div>
                        </div>
                        <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield size={16} className="text-indigo-500" /> Security</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                            <div className="flex items-center gap-3">
                                <Lock size={14} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Change Password</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
                            <div className="flex items-center gap-3">
                                <Shield size={14} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
