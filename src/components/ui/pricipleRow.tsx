'use client';

import { motion } from 'framer-motion';
import { GlowBadge } from '@/components/shared/glowBadge';
import { fadeUp } from '@/animations/variants';
import type { Principle } from '@/types/principle';

interface PrincipleRowProps {
  principle: Principle;
}

export function PrincipleRow({ principle }: PrincipleRowProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="border-border/40 flex flex-col gap-3 border-b py-6 last:border-b-0"
    >
      <GlowBadge className="w-fit">{`Step ${principle.step}`}</GlowBadge>
      <h3 className="font-heading text-foreground text-base font-semibold">{principle.title}</h3>
      <p className="text-foreground/60 text-sm leading-relaxed">{principle.description}</p>
    </motion.div>
  );
}
