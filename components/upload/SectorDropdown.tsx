'use client';

import { Listbox } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

export interface SectorOption {
  value: string;
  label: string;
}

interface SectorDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SectorOption[];
}

export function SectorDropdown({ value, onChange, options }: SectorDropdownProps) {
  const { dict } = useLanguage();
  const opts = options ?? [{ value: 'fintech-payments', label: dict.upload.sectorFintech }];
  const selected = opts.find((o) => o.value === value) ?? opts[0];

  return (
    <div>
      <label className="mb-1.5 block text-sm text-text-muted">{dict.upload.sectorLabel}</label>
      <Listbox value={selected.value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-start text-text outline-none focus:border-primary">
            <span>{selected.label}</span>
            <ChevronDown size={18} className="text-text-muted transition-transform ui-open:rotate-180" />
          </Listbox.Button>
          <Listbox.Options className="glass absolute z-10 mt-2 w-full rounded-lg py-1 shadow-lg">
            {opts.map((opt) => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  cn(
                    'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm',
                    active ? 'bg-white/10 text-text' : 'text-text-muted'
                  )
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span>{opt.label}</span>
                    {isSelected && <Check size={16} className="text-primary-light" />}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
