import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Construction } from 'lucide-react';

export default function GenericPage({ title, breadcrumb = [] }) {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full flex flex-col">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage {breadcrumb.map((b, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        <ChevronRight size={10} />
                        {i === breadcrumb.length - 1
                            ? <span className="text-gray-700 font-semibold">{b}</span>
                            : b
                        }
                    </span>
                ))}
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-900 mb-6"
            >
                {title}
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex items-center justify-center"
            >
                <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                        <Construction size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-700 mb-2">Coming Soon</h2>
                    <p className="text-sm text-gray-400 max-w-sm">
                        This feature is under development. We're working hard to bring you the best experience.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
