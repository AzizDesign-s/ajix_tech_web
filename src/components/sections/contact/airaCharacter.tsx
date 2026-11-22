import { airaConfig } from '@/config/aira';
import { cn } from '@/lib/utils/cn';
import { AiraPlaceholder } from '@/components/sections/contact/airaPlaceholder';
import { AiraPhoto } from '@/components/sections/contact/airaPhoto';

/**
 * The Contact page's visual centrepiece.
 *
 * Swapping in the official character is a one-line change to
 * `src/config/aira.ts` — set `src` to the asset path. Nothing here, in the
 * hero, or in the surrounding composition needs to change, and the intrinsic
 * dimensions in that config keep the layout stable so the swap cannot
 * introduce a layout shift.
 */
export function AiraCharacter({ className }: { className?: string }) {
  return (
    <div className={cn('aira-drift relative select-none', className)}>
      {airaConfig.src ? <AiraPhoto src={airaConfig.src} /> : <AiraPlaceholder />}
    </div>
  );
}
