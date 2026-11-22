import type { ReactNode } from 'react';

interface ChannelCardProps {
  /** Any icon node. Taken as a node rather than an icon key because the
   *  LinkedIn mark comes from react-icons — lucide dropped brand icons. */
  icon: ReactNode;
  title: string;
  description: string;
  /** The interactive element — a link or a button. */
  action: ReactNode;
}

export function ChannelCard({ icon, title, description, action }: ChannelCardProps) {
  return (
    <div className="border-border bg-card hover:shadow-card flex h-full flex-col gap-4 rounded-2xl border p-6 transition-shadow duration-300">
      <span className="border-border text-primary flex h-11 w-11 items-center justify-center rounded-xl border">
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-foreground text-lg font-semibold">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-2">{action}</div>
    </div>
  );
}
