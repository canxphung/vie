/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Container } from '@/components/ui';

interface ProvinceUspsProps {
  items: Array<{ title: string; subtitle: string }>;
}

export function ProvinceUsps({ items }: ProvinceUspsProps) {
  return (
    <Container className="pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
        {items.map((item) => (
          <div key={item.title} className="space-y-1">
            <span className="text-sm font-bold text-stone-900 block">{item.title}</span>
            <p className="text-[11px] text-stone-500 leading-relaxed">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
