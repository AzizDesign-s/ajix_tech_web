'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
  delay?: number;
}

// Floating metric card beside the Hero orbit visual. Reusable
// wherever a highlighted stat is needed (e.g. About page).
export function StatCard({ value, label, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      <div className="animate-float border-border bg-card flex flex-col items-start justify-center gap-0 rounded-lg border px-4 py-3">
        <p className="font-heading bg-gradient-primary bg-clip-text text-3xl font-bold text-transparent">
          {value}
        </p>
        <p className="text-muted text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
