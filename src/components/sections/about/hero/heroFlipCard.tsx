'use client';

import Image from 'next/image';

import { FaGithub, FaLinkedin, FaInstagram, FaBehance } from 'react-icons/fa6';
import { SocialLink } from '@/components/ui/socialLink';
import { AvailabilityBadge } from '@/components/shared/availabilityBadge';
import { socials } from '@/config/site';

const photo = '/images/profile/avatar.png'; // placeholder — swap when ready
const qrCode = '/images/profile/social-qr.png'; // placeholder — swap when ready
const logo = '/logo/ajix-full-dark.svg';

export function ProfileCard() {
  return (
    <div className="relative mx-auto h-90 w-70 perspective-[1400px] sm:h-100 sm:w-75 lg:h-110 lg:w-[320px]">
      {/* Ambient blue glow behind the card */}
      <div className="bg-primary absolute inset-0 -z-10 min-w-72 rounded-full opacity-30 blur-3xl" />

      {/* Continuously rotates; pauses on hover, resumes smoothly on mouse leave —
          same animation-play-state technique already used for the Tools marquee. */}
      <div className="animate-card-spin h-full w-full transform-3d hover:[animation-play-state:paused]">
        {/* Front face */}
        <div className="border-border shadow-glow-blue absolute inset-0 overflow-hidden rounded-2xl border backface-hidden">
          <Image
            src={photo}
            alt="Abdul Aziz"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
          />
          <div className="from-background/90 absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-linear-to-t to-transparent p-5 pt-10">
            <SocialLink href={socials.instagram} label="Instagram">
              <FaInstagram size={16} />
            </SocialLink>
            <SocialLink href={socials.linkedin} label="LinkedIn">
              <FaLinkedin size={16} />
            </SocialLink>
            <SocialLink href={socials.behance} label="Behance">
              <FaBehance size={16} />
            </SocialLink>
            <SocialLink href={socials.github} label="GitHub">
              <FaGithub size={16} />
            </SocialLink>
          </div>
        </div>

        {/* Back face */}
        <div className="border-border bg-gradient-surface absolute inset-0 flex transform-[rotateY(180deg)] flex-col items-center justify-center gap-6 rounded-2xl border p-8 backface-hidden">
          <AvailabilityBadge />

          <Image
            src={logo}
            loading="eager"
            alt="AJIX"
            width={40}
            height={40}
            className="h-auto w-auto object-contain"
            priority
          />

          <Image
            src={qrCode}
            alt="Scan to connect"
            width={140}
            height={140}
            priority
            sizes="96px"
            className="bg-foreground h-auto w-auto rounded-lg p-2"
          />
        </div>
      </div>
    </div>
  );
}
