/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Compass, Home, SearchX } from 'lucide-react';
import { Button, Container } from '@/components/ui';
import { useI18n, useUI } from '@/hooks';

export default function NotFoundPage() {
  const { isVi } = useI18n();
  const { setView, openAllServices } = useUI();

  return (
    <motion.main
      key="not-found"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="py-12 md:py-16"
    >
      <Container>
        <section className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-natural-border bg-white px-6 py-12 text-center shadow-xs">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-natural-beige text-natural-accent">
            <SearchX className="h-8 w-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-natural-bronze">404</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-natural-ink md:text-4xl">
            {isVi ? 'Không tìm thấy hành trình' : 'This route is off the map'}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-500">
            {isVi
              ? 'Đường dẫn này chưa có trong VietCharm. Bạn có thể quay lại trang chủ hoặc mở danh mục dịch vụ để tiếp tục đặt lịch trình.'
              : 'This link does not match an active VietCharm page. Head home or browse services to continue planning.'}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="goldDeep" onClick={() => setView('regions')}>
              <Home className="h-4 w-4" />
              <span>{isVi ? 'Về trang chủ' : 'Go home'}</span>
            </Button>
            <Button type="button" variant="secondary" onClick={() => openAllServices('hotels', 'not-found')}>
              <Compass className="h-4 w-4" />
              <span>{isVi ? 'Xem dịch vụ' : 'Browse services'}</span>
            </Button>
          </div>
        </section>
      </Container>
    </motion.main>
  );
}
