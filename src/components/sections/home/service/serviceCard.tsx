'use client';

import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/shared/spotlightCard';
import { Icon } from '@/components/ui/icon';
import { fadeUp } from '@/animations/variants';
import type { Service } from '@/types/service';
import { Magnetic } from '@/components/shared/magnetic';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <SpotlightCard>
        {/* Ghost index number. Pure decoration: a 5%-opacity watermark behind
            the card, already hidden from assistive tech. WCAG 1.4.3 exempts
            incidental and decorative text from contrast requirements, but
            axe-core cannot infer intent — data-decorative marks it explicitly
            and the accessibility suite excludes those nodes. */}
        <span
          aria-hidden="true"
          data-decorative="true"
          className="font-heading text-foreground/5 absolute -top-10 right-0 text-8xl font-bold select-none"
        >
          {service.number}
        </span>

        <Magnetic>
          <div className="bg-gradient-secondary shadow-glow-blue mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Icon name={service.icon} size={24} className="text-foreground" />
          </div>
        </Magnetic>

        <h3 className="font-heading text-foreground text-xl font-semibold md:text-2xl">
          {service.title}
        </h3>
        <p className="text-foreground/70 mt-2 text-sm leading-relaxed">{service.description}</p>
      </SpotlightCard>
    </motion.div>
  );
}
