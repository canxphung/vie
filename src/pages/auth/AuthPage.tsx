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
  Compass,
  Gift,
  KeyRound,
  Landmark,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { useAuth, useI18n, useUI } from '@/hooks';
import type { UserAccount } from '@/types';

type AuthRouteMode = 'login' | 'register' | 'forgot-password';
type IconComponent = React.ComponentType<{ className?: string }>;

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80';

const FIELD_SHELL =
  'flex min-h-12 items-center gap-3 rounded-xl border border-natural-border bg-white px-3.5 transition focus-within:border-natural-accent focus-within:ring-2 focus-within:ring-natural-accent/15';

interface AuthPageProps {
  mode: AuthRouteMode;
}

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconComponent;
  label: string;
  hint?: React.ReactNode;
}

function AuthField({ icon: Icon, label, hint, className = '', ...inputProps }: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase text-stone-600">{label}</span>
      <span className={FIELD_SHELL}>
        <Icon className="h-4 w-4 shrink-0 text-natural-accent" />
        <input
          className={`h-11 min-w-0 flex-1 bg-transparent text-sm text-natural-text outline-none placeholder:text-stone-400 ${className}`}
          {...inputProps}
        />
      </span>
      {hint && <span className="mt-1.5 block text-[11px] leading-relaxed text-stone-500">{hint}</span>}
    </label>
  );
}

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: IconComponent;
  label: string;
}

function AuthSelect({ icon: Icon, label, children, ...selectProps }: AuthSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase text-stone-600">{label}</span>
      <span className={FIELD_SHELL}>
        <Icon className="h-4 w-4 shrink-0 text-natural-accent" />
        <select
          className="h-11 min-w-0 flex-1 appearance-none bg-transparent text-sm font-semibold text-natural-text outline-none"
          {...selectProps}
        >
          {children}
        </select>
      </span>
    </label>
  );
}

function SocialButton({
  platform,
  onClick,
}: {
  platform: 'Google' | 'Facebook';
  onClick: () => void;
}) {
  const isGoogle = platform === 'Google';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold shadow-sm transition cursor-pointer ${
        isGoogle
          ? 'border-natural-border bg-white text-stone-700 hover:bg-natural-beige-light'
          : 'border-[#1877F2] bg-[#1877F2] text-white hover:bg-[#166FE5]'
      }`}
    >
      {isGoogle ? (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.63 5.63 0 0 1 8.35 12.89a5.63 5.63 0 0 1 5.64-5.626c1.558 0 2.972.616 4.022 1.624l3.1-3.1C19.14 3.86 16.54 2.5 13.99 2.5a10.37 10.37 0 0 0-10.4 10.39 10.37 10.37 0 0 0 10.4 10.39c5.78 0 10.11-4.06 10.11-10.28 0-.69-.08-1.22-.22-1.72H12.24Z"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )}
      <span>{platform}</span>
    </button>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { language } = useI18n();
  const { users, login, register } = useAuth();
  const { setView, navigateHome } = useUI();
  const isVi = language === 'vi';
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState<'user' | 'admin'>('user');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [sentCode, setSentCode] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [forgotStep, setForgotStep] = React.useState<'input-email' | 'verify-code' | 'new-pass'>('input-email');

  React.useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [mode]);

  const copy = {
    login: {
      title: isVi ? 'Đăng nhập' : 'Sign In',
      subtitle: isVi ? 'Đăng nhập để tiếp tục đặt dịch vụ, lưu hành trình và quản lý hồ sơ của bạn.' : 'Sign in to keep booking, save trips and manage your profile.',
      button: isVi ? 'Đăng nhập' : 'Sign In',
    },
    register: {
      title: isVi ? 'Tạo tài khoản' : 'Create Account',
      subtitle: isVi ? 'Tạo tài khoản để nhận ưu đãi riêng và gợi ý hành trình phù hợp với bạn.' : 'Create an account to unlock member perks and trip suggestions made for you.',
      button: isVi ? 'Tạo tài khoản' : 'Create Account',
    },
    'forgot-password': {
      title: isVi ? 'Quên mật khẩu' : 'Forgot Password',
      subtitle: isVi ? 'Nhập Gmail đã đăng ký để nhận mã xác nhận và đặt lại mật khẩu.' : 'Enter your registered Gmail to receive a code and reset your password.',
      button: isVi ? 'Tiếp tục' : 'Continue',
    },
  } satisfies Record<AuthRouteMode, { title: string; subtitle: string; button: string }>;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const loginCredential = username.trim().toLowerCase();
    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === loginCredential ||
        u.email.toLowerCase() === loginCredential ||
        u.phone === loginCredential,
    );

    if (!matched) {
      setErrorMsg(isVi ? 'Số điện thoại/Gmail hoặc tên đăng nhập không chính xác.' : 'Incorrect phone, Gmail or username.');
      return;
    }

    setSuccessMsg(isVi ? `Chào mừng trở lại, ${matched.fullName}!` : `Welcome back, ${matched.fullName}!`);
    setTimeout(() => {
      login(matched);
      navigateHome();
    }, 700);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg(isVi ? 'Tên đăng nhập này đã tồn tại.' : 'Username already exists.');
      return;
    }

    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg(isVi ? 'Địa chỉ Gmail này đã được sử dụng.' : 'Gmail address is already registered.');
      return;
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim() || username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: isVi ? 'Thành viên của cộng đồng du lịch VietCharm.' : 'Member of the VietCharm travel community.',
      role,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSuccessMsg(isVi ? 'Tạo tài khoản thành công! Đang đưa bạn về trang chủ...' : 'Account created! Taking you home...');
    setTimeout(() => {
      register(newUser);
      navigateHome();
    }, 800);
  };

  const handleSocialLogin = (platform: 'Google' | 'Facebook') => {
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const socialUser: UserAccount = {
      id: `u-social-${Date.now()}`,
      username: `${platform.toLowerCase()}_user${randomSuffix}`,
      fullName: platform === 'Google' ? `Google User #${randomSuffix}` : `Facebook User #${randomSuffix}`,
      email: `${platform.toLowerCase()}.${randomSuffix}@st.uel.edu.vn`,
      phone: `0987${randomSuffix}244`,
      bio: isVi ? `Tài khoản đăng nhập qua ${platform}.` : `Linked and authenticated securely via ${platform}.`,
      role: 'user',
      avatar:
        platform === 'Google'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSuccessMsg(isVi ? `Đã liên kết với ${platform} thành công!` : `Authorized with ${platform}!`);
    setTimeout(() => {
      register(socialUser);
      navigateHome();
    }, 700);
  };

  const handleForgotPasswordEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg(isVi ? 'Vui lòng nhập Gmail hợp lệ.' : 'Please enter a valid Gmail.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotStep('verify-code');
    setSuccessMsg(isVi ? `Đã gửi mã xác nhận đến Gmail của bạn. Mã mẫu: ${code}` : `Verification code sent to your Gmail. Demo code: ${code}`);
  };

  const handleVerifyForgotCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (verificationCode.trim() !== sentCode) {
      setErrorMsg(isVi ? 'Mã xác nhận không khớp.' : 'Incorrect verification code.');
      return;
    }
    setForgotStep('new-pass');
    setSuccessMsg(isVi ? 'Xác minh thành công. Hãy đặt mật khẩu mới.' : 'Code verified. Choose a new password.');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.trim().length < 6) {
      setErrorMsg(isVi ? 'Mật khẩu mới phải từ 6 ký tự trở lên.' : 'Password must be at least 6 characters.');
      return;
    }

    setSuccessMsg(isVi ? 'Đặt mật khẩu mới thành công. Vui lòng đăng nhập.' : 'New password saved. Please sign in.');
    setTimeout(() => setView('login'), 900);
  };

  return (
    <motion.main
      className="bg-natural-bg"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.22 }}
    >
      <section className="relative overflow-hidden border-b border-natural-border">
        <div className="absolute inset-0">
          <img src={AUTH_IMAGE} alt="VietCharm heritage travel" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(30,29,21,0.88),rgba(74,74,53,0.72),rgba(253,252,248,0.84))]" />
        </div>

        <Container className="relative grid min-h-[calc(100vh-130px)] items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl text-white">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase backdrop-blur">
              <Landmark className="h-4 w-4 text-natural-gold" />
              VietCharm Portal
            </span>
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl">
              {isVi ? 'Một tài khoản cho trọn vẹn hành trình miền Trung.' : 'One account for your whole Central Vietnam journey.'}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/78">
              {isVi
                ? 'Đăng nhập hoặc tạo tài khoản để lưu hồ sơ, quản lý đặt chỗ và nhận ưu đãi phù hợp với chuyến đi của bạn.'
                : 'Sign in or create an account to save your profile, manage bookings and unlock travel perks.'}
            </p>

            <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
              {[
                { icon: Compass, label: isVi ? 'Lưu hành trình' : 'Saved trips' },
                { icon: ShieldCheck, label: isVi ? 'Hồ sơ an toàn' : 'Secure profile' },
                { icon: Gift, label: isVi ? 'Ưu đãi riêng' : 'Member perks' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-white/18 bg-white/12 p-4 text-sm font-bold backdrop-blur">
                  <Icon className="mb-3 h-5 w-5 text-natural-gold" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/70 bg-natural-bg/96 p-5 shadow-2xl backdrop-blur sm:p-7">
            <div className="mb-6">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-800 ring-1 ring-emerald-100">
                <Sparkles className="h-3.5 w-3.5" />
                {isVi ? 'Khu vực thành viên' : 'Member Area'}
              </span>
              <h2 className="font-serif text-3xl font-black text-natural-text">{copy[mode].title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{copy[mode].subtitle}</p>
            </div>

            {mode !== 'forgot-password' && (
              <div className="mb-5 grid grid-cols-2 rounded-xl bg-natural-beige p-1">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                    mode === 'login' ? 'bg-white text-natural-accent shadow-sm' : 'text-stone-500 hover:text-natural-text'
                  }`}
                >
                  <User className="h-4 w-4" />
                  {isVi ? 'Đăng nhập' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                    mode === 'register' ? 'bg-white text-natural-accent shadow-sm' : 'text-stone-500 hover:text-natural-text'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  {isVi ? 'Đăng ký' : 'Register'}
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <AuthField
                  icon={User}
                  label={isVi ? 'SĐT / Gmail / Tên đăng nhập' : 'Phone / Gmail / Username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isVi ? 'Nhập thông tin đăng nhập' : 'Enter your credential'}
                  hint={
                    <>
                      {isVi ? 'Tài khoản mẫu: ' : 'Demo account: '}
                      <span className="font-mono font-semibold text-stone-700">0987654321</span>
                    </>
                  }
                  required
                />
                <AuthField
                  icon={LockKeyhole}
                  label={isVi ? 'Mật khẩu' : 'Password'}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-natural-accent hover:text-natural-olive cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    {isVi ? 'Quên mật khẩu?' : 'Forgot password?'}
                  </button>
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-accent px-5 text-sm font-black text-white shadow-lg shadow-natural-accent/20 transition hover:bg-natural-olive cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {copy.login.button}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <AuthField icon={BadgeCheck} label={isVi ? 'Tên đăng nhập' : 'Username'} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="kimngan26" required />
                  <AuthField icon={User} label={isVi ? 'Họ và tên' : 'Full Name'} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isVi ? 'Đặng Thị Kim Ngân' : 'Kim Ngan Dang'} required />
                </div>
                <AuthField icon={Mail} label={isVi ? 'Địa chỉ Gmail' : 'Email Address'} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ngan@gmail.com" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <AuthField icon={Phone} label={isVi ? 'Số điện thoại' : 'Phone Number'} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0987654321" required />
                  <AuthSelect icon={ShieldCheck} label={isVi ? 'Vai trò' : 'Role'} value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')}>
                    <option value="user">{isVi ? 'Khách du lịch' : 'Traveler'}</option>
                    <option value="admin">{isVi ? 'Quản trị hệ thống' : 'Administrator'}</option>
                  </AuthSelect>
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-gold px-5 text-sm font-black text-natural-ink shadow-lg shadow-natural-gold/25 transition hover:bg-natural-gold-dark cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  {copy.register.button}
                </button>
              </form>
            )}

            {mode === 'forgot-password' && (
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-natural-accent transition hover:text-natural-olive cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isVi ? 'Quay lại đăng nhập' : 'Back to sign in'}
                </button>

                {forgotStep === 'input-email' && (
                  <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                    <AuthField icon={Mail} label={isVi ? 'Gmail nhận mã' : 'Recovery Gmail'} type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="ngandtk244111@st.uel.edu.vn" required />
                    <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-accent px-5 text-sm font-black text-white shadow-lg shadow-natural-accent/20 transition hover:bg-natural-olive cursor-pointer">
                      <Mail className="h-4 w-4" />
                      {isVi ? 'Gửi mã xác nhận' : 'Send Verification Code'}
                    </button>
                  </form>
                )}

                {forgotStep === 'verify-code' && (
                  <form onSubmit={handleVerifyForgotCode} className="space-y-4">
                    <AuthField icon={KeyRound} label={isVi ? 'Mã gồm 6 chữ số' : '6-digit Code'} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="839201" className="text-center font-black tracking-[0.35em]" maxLength={6} inputMode="numeric" required />
                    <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-gold px-5 text-sm font-black text-natural-ink shadow-lg shadow-natural-gold/25 transition hover:bg-natural-gold-dark cursor-pointer">
                      <BadgeCheck className="h-4 w-4" />
                      {isVi ? 'Xác nhận mã' : 'Verify Code'}
                    </button>
                  </form>
                )}

                {forgotStep === 'new-pass' && (
                  <form onSubmit={handleSaveNewPassword} className="space-y-4">
                    <AuthField icon={LockKeyhole} label={isVi ? 'Mật khẩu mới' : 'New Password'} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
                    <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 cursor-pointer">
                      <CheckCircle2 className="h-4 w-4" />
                      {isVi ? 'Lưu mật khẩu mới' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {mode !== 'forgot-password' && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-natural-border" />
                  <span className="text-xs font-semibold text-stone-400">{isVi ? 'Hoặc tiếp tục với' : 'Or continue with'}</span>
                  <span className="h-px flex-1 bg-natural-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SocialButton platform="Google" onClick={() => handleSocialLogin('Google')} />
                  <SocialButton platform="Facebook" onClick={() => handleSocialLogin('Facebook')} />
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </motion.main>
  );
}
