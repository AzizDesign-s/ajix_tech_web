'use client';

import { useRef } from 'react';
import { Icon } from '@/components/ui/icon';
import { intentOptions, type ContactIntent } from '@/config/contact';
import { cn } from '@/lib/utils/cn';

interface IntentSelectorProps {
  value: ContactIntent;
  onChange: (intent: ContactIntent) => void;
  labelledBy: string;
}

/**
 * A real radiogroup, not four divs with click handlers.
 *
 * Roving tabindex: the group is a single tab stop and arrow keys move between
 * options, which is the expected behaviour for a radio group and the reason
 * this is not just a row of buttons.
 */
export function IntentSelector({ value, onChange, labelledBy }: IntentSelectorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const next = intentOptions[index];
    onChange(next.id);
    refs.current[index]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const last = intentOptions.length - 1;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select(index === last ? 0 : index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select(index === 0 ? last : index - 1);
        break;
      case 'Home':
        event.preventDefault();
        select(0);
        break;
      case 'End':
        event.preventDefault();
        select(last);
        break;
    }
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {intentOptions.map((option, index) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'group focus-visible:ring-ring relative flex h-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              selected
                ? 'border-primary bg-card shadow-glow-blue'
                : 'border-border bg-card/60 hover:border-primary/50 hover:shadow-card',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300',
                  selected
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border text-muted',
                )}
              >
                <Icon name={option.icon} size={18} aria-hidden="true" />
              </span>
              <span
                className={cn('font-heading text-sm', selected ? 'text-primary' : 'text-muted')}
              >
                {option.number}
              </span>
            </div>

            <span className="font-heading text-foreground text-lg font-semibold">
              {option.title}
            </span>
            <span className="text-muted text-sm leading-relaxed">{option.description}</span>

            {/* Selection is carried by border, background and the tick — never
                by colour alone. */}
            <span
              aria-hidden="true"
              className={cn(
                'bg-primary absolute top-4 right-4 h-2 w-2 rounded-full transition-opacity duration-300',
                selected ? 'opacity-100' : 'opacity-0',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
