/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  X,
} from 'lucide-react';
import type { Language, UserAccount } from '@/types';

interface UserAuthModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  users: UserAccount[];
  onRegisterNew: (user: UserAccount) => void;
}

type AuthView = 'login' | 'register' | 'forgot';
type IconComponent = React.ComponentType<{ className?: string }>;

const AUTH_HERO_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';

const FIELD_WRAPPER =
  'group flex min-h-12 items-center gap-3 rounded-xl border border-natural-border bg-white px-3.5 transition focus-within:border-natural-accent focus-within:ring-2 focus-within:ring-natural-accent/15';

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: IconComponent;
  label: string;
  hint?: React.ReactNode;
}

function AuthField({ icon: Icon, label, hint, className = '', ...inputProps }: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase text-stone-600">
        {label}
      </span>
      <span className={FIELD_WRAPPER}>
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

function AuthSelect({ icon: Icon, label, className = '', children, ...selectProps }: AuthSelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase text-stone-600">
        {label}
      </span>
      <span className={FIELD_WRAPPER}>
        <Icon className="h-4 w-4 shrink-0 text-natural-accent" />
        <select
          className={`h-11 min-w-0 flex-1 appearance-none bg-transparent text-sm font-semibold text-natural-text outline-none ${className}`}
          {...selectProps}
        >
          {children}
        </select>
      </span>
    </label>
  );
}

interface SocialButtonProps {
  platform: 'Google' | 'Facebook';
  onClick: () => void;
}

function SocialButton({ platform, onClick }: SocialButtonProps) {
  const isGoogle = platform === 'Google';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition shadow-sm cursor-pointer ${
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

export function UserAuthModal({
  language,
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  onRegisterNew,
}: UserAuthModalProps) {
  const isVi = language === 'vi';
  const [authView, setAuthView] = React.useState<AuthView>('login');
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

  const content = {
    login: {
      title: isVi ? 'Chào mừng trở lại' : 'Welcome Back',
      subtitle: isVi
        ? 'Đăng nhập để tiếp tục hành trình cùng VietCharm.'
        : 'Sign in to continue your VietCharm journey.',
    },
    register: {
      title: isVi ? 'Tạo tài khoản mới' : 'Create Account',
      subtitle: isVi
        ? 'Lưu hồ sơ du lịch và kết nối ưu đãi thành viên.'
        : 'Save your travel profile and member privileges.',
    },
    forgot: {
      title: isVi ? 'Khôi phục mật khẩu' : 'Reset Password',
      subtitle: isVi
        ? 'Nhận mã xác minh và đặt lại mật khẩu an toàn.'
        : 'Verify your email and set a secure new password.',
    },
  } satisfies Record<AuthView, { title: string; subtitle: string }>;

  const changeAuthView = (view: AuthView) => {
    setAuthView(view);
    setErrorMsg('');
    setSuccessMsg('');
    if (view !== 'forgot') {
      setForgotStep('input-email');
    }
  };

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

    if (matched) {
      setSuccessMsg(isVi ? `Đăng nhập thành công! Chào mừng ${matched.fullName}.` : `Welcome back, ${matched.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(matched);
        onClose();
        setSuccessMsg('');
        setUsername('');
        setPassword('');
      }, 1000);
    } else {
      setErrorMsg(
        isVi
          ? 'Số điện thoại/Gmail hoặc mật khẩu không chính xác! Hãy đăng ký tài khoản mới nếu chưa có.'
          : 'Incorrect Phone number/Gmail/Username or Password!',
      );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg(isVi ? 'Tên đăng nhập này đã tồn tại!' : 'Username already exists!');
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg(isVi ? 'Địa chỉ Gmail này đã được sử dụng!' : 'Gmail address is already registered!');
      return;
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim() || username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: isVi ? 'Thành viên tự hào của VietCharm Hoi An.' : 'Proud member of VietCharm Hoi An.',
      role,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterNew(newUser);
    setSuccessMsg(
      isVi
        ? 'Đăng ký tài khoản thành công! Đang tự động kết nối và đăng nhập...'
        : 'Account created successfully! Logging in...',
    );
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
      setSuccessMsg('');
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
      setPhone('');
    }, 1200);
  };

  const handleSocialLogin = (platform: 'Google' | 'Facebook') => {
    setErrorMsg('');
    const randomSuffix = Math.floor(Math.random() * 900) + 100;
    const socialUser: UserAccount = {
      id: `u-social-${Date.now()}`,
      username: `${platform.toLowerCase()}_user${randomSuffix}`,
      fullName: platform === 'Google' ? `Google User #${randomSuffix}` : `Facebook User #${randomSuffix}`,
      email: `${platform.toLowerCase()}.${randomSuffix}@st.uel.edu.vn`,
      phone: `0987${randomSuffix}244`,
      bio: isVi
        ? `Đăng nhập liên kết thành công qua tài khoản ${platform}.`
        : `Linked and authenticated securely via ${platform}.`,
      role: 'user',
      avatar:
        platform === 'Google'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterNew(socialUser);
    setSuccessMsg(isVi ? `Ủy quyền tài khoản ${platform} thành công! Đang đăng nhập...` : `Authorized with ${platform}! Entering system...`);
    setTimeout(() => {
      onLoginSuccess(socialUser);
      onClose();
      setSuccessMsg('');
    }, 1200);
  };

  const handleForgotPasswordEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!forgotEmail.trim() || !forgotEmail.trim().includes('@')) {
      setErrorMsg(isVi ? 'Vui lòng nhập địa chỉ Gmail hợp lệ!' : 'Please enter a valid Gmail!');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotStep('verify-code');
    setSuccessMsg(isVi ? `Mã khôi phục đã gửi vào ${forgotEmail}! Mã mẫu: ${code}` : `Verification code sent to ${forgotEmail}! Demo code: ${code}`);
  };

  const handleVerifyForgotCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (verificationCode.trim() === sentCode) {
      setForgotStep('new-pass');
      setSuccessMsg(isVi ? 'Xác minh thành công! Hãy đặt mật khẩu mới của bạn.' : 'Code verified! Choose a new password.');
    } else {
      setErrorMsg(isVi ? 'Mã xác nhận không khớp! Thử lại.' : 'Incorrect code! Please try again.');
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.trim().length < 6) {
      setErrorMsg(isVi ? 'Mật khẩu mới phải từ 6 ký tự trở lên!' : 'Password must be at least 6 characters!');
      return;
    }

    const matched = users.find((u) => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (matched) {
      setSuccessMsg(isVi ? `Khôi phục thành công mật khẩu cho tài khoản ${matched.fullName}! Vui lòng đăng nhập.` : 'Password successfully reset! Please login.');
    } else {
      setSuccessMsg(isVi ? 'Đặt mật khẩu mới thành công! Đang quay lại màn hình đăng nhập.' : 'New password saved successfully!');
    }

    setTimeout(() => {
      setAuthView('login');
      setForgotStep('input-email');
      setForgotEmail('');
      setVerificationCode('');
      setNewPassword('');
      setSuccessMsg('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 p-3 backdrop-blur-sm sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative grid max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-natural-bg shadow-2xl md:grid-cols-[0.95fr_1.05fr]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={isVi ? 'Đóng' : 'Close'}
              className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/85 text-stone-600 shadow-sm transition hover:bg-white hover:text-stone-950 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <aside className="relative hidden min-h-[650px] overflow-hidden bg-natural-ink text-white md:block">
              <img
                src={AUTH_HERO_IMAGE}
                alt="Hoi An heritage travel"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(18,27,25,0.92),rgba(31,40,34,0.62),rgba(158,118,58,0.4))]" />
              <div className="relative flex h-full flex-col justify-between p-9">
                <div>
                  <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    <Landmark className="h-4 w-4 text-natural-gold" />
                    <span>VIETCHARM</span>
                  </div>

                  <h2 className="max-w-sm font-serif text-4xl font-black leading-tight">
                    {isVi ? 'Một tài khoản cho cả chuyến đi.' : 'One account for the whole trip.'}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-white/78">
                    {isVi
                      ? 'Đặt dịch vụ, lưu hành trình và nhận chăm sóc thành viên trong cùng một không gian.'
                      : 'Book services, save itineraries and keep member care in one place.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: Compass,
                      title: isVi ? 'Hành trình rõ ràng' : 'Clear Journey',
                      body: isVi ? 'Theo dõi điểm đến và dịch vụ đã chọn.' : 'Track selected places and services.',
                    },
                    {
                      icon: ShieldCheck,
                      title: isVi ? 'Thông tin bảo mật' : 'Secure Profile',
                      body: isVi ? 'Hồ sơ cá nhân được giữ trong tài khoản.' : 'Your profile stays in your account.',
                    },
                    {
                      icon: Gift,
                      title: isVi ? 'Ưu đãi thành viên' : 'Member Perks',
                      body: isVi ? 'Kết nối voucher và gợi ý phù hợp.' : 'Connect vouchers and tailored picks.',
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-natural-gold backdrop-blur">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{title}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-white/70">{body}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="max-h-[calc(100vh-1.5rem)] overflow-y-auto p-5 sm:p-7 md:p-9">
              <div className="mb-6 overflow-hidden rounded-2xl bg-natural-ink md:hidden">
                <div className="relative min-h-32">
                  <img src={AUTH_HERO_IMAGE} alt="VietCharm" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-natural-ink/58" />
                  <div className="relative flex h-full min-h-32 flex-col justify-end p-5 text-white">
                    <span className="mb-1 text-[11px] font-bold uppercase tracking-[0.28em] text-natural-gold">
                      VietCharm
                    </span>
                    <span className="font-serif text-2xl font-black">
                      {isVi ? 'Chuyến đi bắt đầu tại đây' : 'Your trip starts here'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-5 pr-11">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-800 ring-1 ring-emerald-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isVi ? 'Cổng thành viên' : 'Member Portal'}
                </span>
                <h3 id="auth-modal-title" className="font-serif text-3xl font-black leading-tight text-natural-text">
                  {content[authView].title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{content[authView].subtitle}</p>
              </div>

              {authView !== 'forgot' && (
                <div className="mb-5 grid grid-cols-2 rounded-xl bg-natural-beige p-1">
                  <button
                    type="button"
                    onClick={() => changeAuthView('login')}
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                      authView === 'login'
                        ? 'bg-white text-natural-accent shadow-sm'
                        : 'text-stone-500 hover:text-natural-text'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    {isVi ? 'Đăng nhập' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeAuthView('register')}
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                      authView === 'register'
                        ? 'bg-white text-natural-accent shadow-sm'
                        : 'text-stone-500 hover:text-natural-text'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    {isVi ? 'Đăng ký' : 'Register'}
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    key="auth-error"
                    className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {successMsg && (
                  <motion.div
                    key="auth-success"
                    className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {authView === 'login' && (
                  <motion.form
                    key="login"
                    onSubmit={handleLogin}
                    className="space-y-4"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <AuthField
                      icon={User}
                      label={isVi ? 'SĐT / Gmail' : 'Phone / Gmail'}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={isVi ? 'Nhập thông tin đăng nhập' : 'Enter your credential'}
                      hint={
                        <>
                          {isVi ? 'Tài khoản mẫu: ' : 'Demo account: '}
                          <span className="font-mono font-semibold text-stone-700">0987654321</span>
                          <span> / </span>
                          <span className="font-mono font-semibold text-stone-700">ngandtk244111@st.uel.edu.vn</span>
                        </>
                      }
                      required
                    />

                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase text-stone-600">
                          {isVi ? 'Mật khẩu' : 'Password'}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeAuthView('forgot')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-natural-accent transition hover:text-natural-olive cursor-pointer"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          {isVi ? 'Quên mật khẩu?' : 'Forgot?'}
                        </button>
                      </div>
                      <span className={FIELD_WRAPPER}>
                        <LockKeyhole className="h-4 w-4 shrink-0 text-natural-accent" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-natural-text outline-none placeholder:text-stone-400"
                          required
                        />
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-accent px-5 text-sm font-black text-white shadow-lg shadow-natural-accent/20 transition hover:bg-natural-olive cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {isVi ? 'Đăng nhập ngay' : 'Sign In'}
                    </button>

                    <div className="flex items-center gap-3 py-1">
                      <span className="h-px flex-1 bg-natural-border" />
                      <span className="text-xs font-semibold text-stone-400">
                        {isVi ? 'Hoặc tiếp tục với' : 'Or continue with'}
                      </span>
                      <span className="h-px flex-1 bg-natural-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <SocialButton platform="Google" onClick={() => handleSocialLogin('Google')} />
                      <SocialButton platform="Facebook" onClick={() => handleSocialLogin('Facebook')} />
                    </div>
                  </motion.form>
                )}

                {authView === 'register' && (
                  <motion.form
                    key="register"
                    onSubmit={handleRegister}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AuthField
                        icon={BadgeCheck}
                        label={isVi ? 'Tên đăng nhập' : 'Username'}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="kimngan26"
                        required
                      />
                      <AuthField
                        icon={User}
                        label={isVi ? 'Họ và tên' : 'Full Name'}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isVi ? 'Đặng Thị Kim Ngân' : 'Kim Ngan Dang'}
                        required
                      />
                    </div>

                    <AuthField
                      icon={Mail}
                      label={isVi ? 'Địa chỉ Gmail' : 'Email Address'}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ngan@gmail.com"
                      required
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <AuthField
                        icon={Phone}
                        label={isVi ? 'Số điện thoại' : 'Phone Number'}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0987654321"
                        required
                      />
                      <AuthSelect
                        icon={ShieldCheck}
                        label={isVi ? 'Vai trò' : 'Role'}
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                      >
                        <option value="user">{isVi ? 'Khách du lịch' : 'Traveler'}</option>
                        <option value="admin">{isVi ? 'Quản trị hệ thống' : 'Administrator'}</option>
                      </AuthSelect>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-natural-gold px-5 text-sm font-black text-natural-ink shadow-lg shadow-natural-gold/25 transition hover:bg-natural-gold-dark cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      {isVi ? 'Hoàn tất đăng ký' : 'Complete Registration'}
                    </button>

                    <div className="flex items-center gap-3 py-1">
                      <span className="h-px flex-1 bg-natural-border" />
                      <span className="text-xs font-semibold text-stone-400">
                        {isVi ? 'Hoặc đăng ký bằng' : 'Or register with'}
                      </span>
                      <span className="h-px flex-1 bg-natural-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <SocialButton platform="Google" onClick={() => handleSocialLogin('Google')} />
                      <SocialButton platform="Facebook" onClick={() => handleSocialLogin('Facebook')} />
                    </div>
                  </motion.form>
                )}

                {authView === 'forgot' && (
                  <motion.div
                    key="forgot"
                    className="space-y-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <button
                      type="button"
                      onClick={() => changeAuthView('login')}
                      className="inline-flex items-center gap-2 text-sm font-bold text-natural-accent transition hover:text-natural-olive cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isVi ? 'Quay lại đăng nhập' : 'Back to sign in'}
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'input-email', label: isVi ? 'Email' : 'Email' },
                        { id: 'verify-code', label: isVi ? 'Mã' : 'Code' },
                        { id: 'new-pass', label: isVi ? 'Mật khẩu' : 'Password' },
                      ].map((step, index) => {
                        const steps = ['input-email', 'verify-code', 'new-pass'];
                        const currentIndex = steps.indexOf(forgotStep);
                        const isActive = index <= currentIndex;

                        return (
                          <div key={step.id} className="flex items-center gap-2">
                            <span
                              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                isActive ? 'bg-natural-accent text-white' : 'bg-natural-beige text-stone-400'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className={`text-xs font-bold ${isActive ? 'text-natural-text' : 'text-stone-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {forgotStep === 'input-email' && (
                      <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                        <AuthField
                          icon={Mail}
                          label={isVi ? 'Gmail nhận mã' : 'Recovery Gmail'}
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="ngandtk244111@st.uel.edu.vn"
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

                    {forgotStep === 'verify-code' && (
                      <form onSubmit={handleVerifyForgotCode} className="space-y-4">
                        <AuthField
                          icon={KeyRound}
                          label={isVi ? 'Mã gồm 6 chữ số' : '6-digit Code'}
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="839201"
                          className="text-center font-black tracking-[0.35em]"
                          maxLength={6}
                          inputMode="numeric"
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

                    {forgotStep === 'new-pass' && (
                      <form onSubmit={handleSaveNewPassword} className="space-y-4">
                        <AuthField
                          icon={LockKeyhole}
                          label={isVi ? 'Mật khẩu mới' : 'New Password'}
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
