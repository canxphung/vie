/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Home,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { useAuth, useI18n, useUI } from '@/hooks';

type RecoveryStep = 'email' | 'code' | 'password';
type IconComponent = React.ComponentType<{ className?: string }>;

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80';

const FIELD_SHELL =
  'flex min-h-12 items-center gap-3 rounded-xl border border-natural-border bg-white px-3.5 transition focus-within:border-natural-accent focus-within:ring-2 focus-within:ring-natural-accent/15';

const STEP_ORDER: RecoveryStep[] = ['email', 'code', 'password'];

interface RecoveryFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconComponent;
  label: string;
  hint?: React.ReactNode;
}

function RecoveryField({
  icon: Icon,
  label,
  hint,
  className = '',
  ...inputProps
}: RecoveryFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase text-stone-600">{label}</span>
      <span className={FIELD_SHELL}>
        <Icon className="h-4 w-4 shrink-0 text-natural-accent" />
        <input
          className={`h-11 min-w-0 flex-1 bg-transparent text-sm text-natural-text outline-none placeholder:text-stone-400 ${className}`}
          {...inputProps}
        />
      </span>
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-stone-500">{hint}</span>}
    </label>
  );
}

export default function ForgotPasswordPage() {
  const { language } = useI18n();
  const { users, updatePasswordByEmail } = useAuth();
  const { setView, navigateHome } = useUI();
  const isVi = language === 'vi';
  const [email, setEmail] = React.useState('');
  const [sentCode, setSentCode] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [step, setStep] = React.useState<RecoveryStep>('email');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const currentStepIndex = STEP_ORDER.indexOf(step);

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSendCode = (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setErrorMsg(isVi ? 'Vui lòng nhập Gmail hợp lệ.' : 'Please enter a valid Gmail address.');
      return;
    }

    const matched = users.find((user) => user.email.toLowerCase() === normalizedEmail);
    if (!matched) {
      setErrorMsg(isVi ? 'Gmail này chưa tồn tại trong hệ thống.' : 'This Gmail is not registered.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmail(normalizedEmail);
    setSentCode(code);
    setVerificationCode('');
    setNewPassword('');
    setStep('code');
    setSuccessMsg(
      isVi
        ? `Đã tạo mã xác nhận cho bản demo. Mã của bạn: ${code}`
        : `A demo verification code was generated. Your code: ${code}`,
    );
  };

  const handleVerifyCode = (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (verificationCode.trim() !== sentCode) {
      setErrorMsg(isVi ? 'Mã xác nhận không khớp.' : 'Incorrect verification code.');
      return;
    }

    setStep('password');
    setSuccessMsg(isVi ? 'Xác minh thành công. Hãy đặt mật khẩu mới.' : 'Code verified. Choose a new password.');
  };

  const handleSavePassword = (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const nextPassword = newPassword.trim();
    if (nextPassword.length < 6) {
      setErrorMsg(isVi ? 'Mật khẩu mới phải từ 6 ký tự trở lên.' : 'Password must be at least 6 characters.');
      return;
    }

    const updated = updatePasswordByEmail(email, nextPassword);
    if (!updated) {
      setErrorMsg(isVi ? 'Không tìm thấy tài khoản để cập nhật mật khẩu.' : 'No account found to update.');
      return;
    }

    setSuccessMsg(isVi ? 'Đặt mật khẩu mới thành công. Đang mở trang đăng nhập...' : 'New password saved. Opening sign in...');
    window.setTimeout(() => setView('login'), 900);
  };

  const goBackOneStep = () => {
    clearMessages();
    if (step === 'password') {
      setStep('code');
      return;
    }
    if (step === 'code') {
      setStep('email');
      return;
    }
    setView('login');
  };

  return (
    <motion.main
      className="min-h-[calc(100vh-5rem)] bg-natural-bg"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22 }}
    >
      <section className="relative overflow-hidden border-b border-natural-border">
        <div className="absolute inset-0">
          <img
            src={AUTH_IMAGE}
            alt="VietCharm heritage travel"
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(30,29,21,0.9),rgba(74,74,53,0.68),rgba(253,252,248,0.88))]" />
        </div>

        <Container className="relative grid min-h-[calc(100vh-7rem)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl text-white">
            <button
              type="button"
              onClick={navigateHome}
              className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 text-sm font-bold backdrop-blur transition hover:bg-white/22 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              {isVi ? 'Về trang chủ' : 'Home'}
            </button>
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
              {isVi ? 'Đặt lại mật khẩu VietCharm' : 'Reset your VietCharm password'}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/80">
              {isVi
                ? 'Xác nhận Gmail đã đăng ký, nhập mã bảo mật và tạo mật khẩu mới để tiếp tục quản lý hành trình của bạn.'
                : 'Confirm your registered email, enter the security code and create a new password to continue managing your trips.'}
            </p>
            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
              {(isVi
                ? ['Nhập Gmail', 'Xác nhận mã', 'Mật khẩu mới']
                : ['Enter email', 'Verify code', 'New password']
              ).map((label, index) => {
                const isDone = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div
                    key={label}
                    className={`rounded-2xl border p-4 text-sm font-bold backdrop-blur ${
                      isDone || isCurrent
                        ? 'border-natural-gold/70 bg-white/18 text-white'
                        : 'border-white/16 bg-white/10 text-white/62'
                    }`}
                  >
                    <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/18 text-sm">
                      {isDone ? <CheckCircle2 className="h-4 w-4 text-natural-gold" /> : index + 1}
                    </span>
                    <span className="block">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/70 bg-natural-bg/96 p-5 shadow-2xl backdrop-blur sm:p-7">
            <div className="mb-6">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-800 ring-1 ring-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isVi ? 'Khôi phục tài khoản' : 'Account Recovery'}
              </span>
              <h2 className="font-serif text-3xl font-black text-natural-text">
                {isVi ? 'Quên mật khẩu' : 'Forgot Password'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {isVi
                  ? 'Flow này dùng dữ liệu local của bản demo, nên mã xác nhận sẽ hiện trực tiếp sau khi Gmail hợp lệ.'
                  : 'This demo uses local data, so the verification code appears after a valid email is entered.'}
              </p>
            </div>

            <button
              type="button"
              onClick={goBackOneStep}
              className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-natural-border bg-white px-3 text-sm font-bold text-natural-accent transition hover:bg-natural-beige cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 'email'
                ? isVi
                  ? 'Quay lại đăng nhập'
                  : 'Back to sign in'
                : isVi
                  ? 'Quay lại bước trước'
                  : 'Back one step'}
            </button>

            {errorMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold leading-5 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <RecoveryField
                  icon={Mail}
                  label={isVi ? 'Gmail đã đăng ký' : 'Registered Gmail'}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ngandtk244111@st.uel.edu.vn"
                  autoComplete="email"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-accent px-5 text-sm font-black text-white shadow-lg shadow-natural-accent/20 transition hover:bg-natural-olive cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  {isVi ? 'Gửi mã xác nhận' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <RecoveryField
                  icon={KeyRound}
                  label={isVi ? 'Mã gồm 6 chữ số' : '6-digit Code'}
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="839201"
                  className="text-center font-black tracking-[0.35em]"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-gold px-5 text-sm font-black text-natural-ink shadow-lg shadow-natural-gold/25 transition hover:bg-natural-gold-dark cursor-pointer"
                >
                  <BadgeCheck className="h-4 w-4" />
                  {isVi ? 'Xác nhận mã' : 'Verify Code'}
                </button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleSavePassword} className="space-y-4">
                <RecoveryField
                  icon={LockKeyhole}
                  label={isVi ? 'Mật khẩu mới' : 'New Password'}
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  hint={isVi ? 'Tối thiểu 6 ký tự.' : 'At least 6 characters.'}
                  required
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isVi ? 'Lưu mật khẩu mới' : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </motion.main>
  );
}
