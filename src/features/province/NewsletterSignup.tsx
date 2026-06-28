/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Container } from '@/components/ui';

interface NewsletterSignupProps {
  isVi: boolean;
  title: string;
  placeholder: string;
}

export function NewsletterSignup({ isVi, title, placeholder }: NewsletterSignupProps) {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="w-full bg-natural-accent py-14 px-4 shadow-inner text-white">
      <Container size="narrow" className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-4xl font-serif font-bold tracking-tight text-natural-bg">{title}</h3>
          <p className="text-xs md:text-sm text-natural-beige/90 max-w-xl mx-auto leading-relaxed">
            Đăng ký nhập email và dạo bước du lịch Hội An & miền Trung cùng chuỗi đối tác lữ hành VietCharm.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-xs md:text-sm bg-natural-bg text-natural-text placeholder:text-stone-400 px-4 py-3 rounded-xl border border-natural-border focus:ring-1 focus:ring-natural-accent outline-none font-medium"
            required
          />
          <button
            type="submit"
            className="bg-natural-gold hover:bg-natural-gold-dark text-natural-text px-5 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition shadow-md whitespace-nowrap"
          >
            {isVi ? 'Đăng ký' : 'Subscribe'}
          </button>
        </form>

        {subscribed && (
          <p className="text-emerald-800 font-black text-xs animate-bounce mt-2">
            ✓ {isVi ? 'Đăng ký thành công! Voucher ưu đãi 10% đã gửi đi.' : 'Subscribed successfully! 10% Coupon dispatched.'}
          </p>
        )}
      </Container>
    </div>
  );
}
