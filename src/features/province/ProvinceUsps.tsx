/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Sparkles, Headset, BadgePercent } from 'lucide-react';
import { Container, Reveal } from '@/components/ui';

interface ProvinceUspsProps {
  items: Array<{ title: string; subtitle: string }>;
}

const ICONS = [ShieldCheck, Sparkles, Headset, BadgePercent];

export function ProvinceUsps({ items }: ProvinceUspsProps) {
  return (
    <Container className="pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="group h-full flex items-start gap-3.5 rounded-2xl border border-natural-border bg-white/70 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:border-natural-gold/45 hover:shadow-luxe">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-natural-gold/25 to-natural-bronze/15 text-natural-bronze transition group-hover:from-natural-gold/40">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-stone-900">{item.title}</span>
                  <p className="text-[11px] leading-relaxed text-stone-500">{item.subtitle}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
