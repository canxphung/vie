/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, MapPin, Phone, Mail, Award, Key, Calendar, ShieldCheck, Database, BarChart3, Plus, Trash2, Check, X, FileText, ClipboardList, Car, Star, Tag, Gift, BookOpen, Compass, Info, CheckCircle2, ChevronRight, Sparkles, Heart } from 'lucide-react';
import type { Language, BookingCartItem, UserAccount, PartnershipApplication, PromoVoucher, SystemBooking, ViewableItem } from '@/types';
import { TOURIST_LOCATIONS } from '@/constants/seed/touristLocations';
import { PREDEFINED_COMBOS } from '@/constants/seed/tourCombos';

// 1. COMPONENT: USER ACCOUNT AUTH (REGISTER & LOGIN)
// ==========================================
interface UserAuthModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  users: UserAccount[];
  onRegisterNew: (user: UserAccount) => void;
}

export function UserAuthModal({ language, isOpen, onClose, onLoginSuccess, users, onRegisterNew }: UserAuthModalProps) {
  const [authView, setAuthView] = React.useState<'login' | 'register' | 'forgot'>('login');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState<'user' | 'admin'>('user');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  // Forgot password flow states
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [sentCode, setSentCode] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [forgotStep, setForgotStep] = React.useState<'input-email' | 'verify-code' | 'new-pass'>('input-email');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const loginCredential = username.trim().toLowerCase();
    
    // Find matching user by username, email, or phone
    const matched = users.find(u => 
      u.username.toLowerCase() === loginCredential || 
      u.email.toLowerCase() === loginCredential || 
      u.phone === loginCredential
    );
    
    if (matched) {
      setSuccessMsg(language === 'vi' ? `Đăng nhập thành công! Chào mừng ${matched.fullName}.` : `Welcome back, ${matched.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(matched);
        onClose();
        setSuccessMsg('');
        setUsername('');
        setPassword('');
      }, 1000);
    } else {
      setErrorMsg(language === 'vi' ? 'Số điện thoại/Gmail hoặc mật khẩu không chính xác! Hãy đăng ký tài khoản mới nếu chưa có.' : 'Incorrect Phone number/Gmail/Username or Password!');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg(language === 'vi' ? 'Tên đăng nhập này đã tồn tại!' : 'Username already exists!');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg(language === 'vi' ? 'Địa chỉ Gmail này đã được sử dụng!' : 'Gmail address is already registered!');
      return;
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      username: username.trim(),
      fullName: fullName.trim() || username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: language === 'vi' ? 'Thành viên tự hào của VietCharm Hoi An.' : 'Proud member of VietCharm Hoi An.',
      role: role,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegisterNew(newUser);
    setSuccessMsg(language === 'vi' ? 'Đăng ký tài khoản thành công! Đang tự động kết nối và đăng nhập...' : 'Account created successfully! Logging in...');
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
      bio: language === 'vi' ? `Đăng nhập liên kết thành công qua tài khoản ${platform}.` : `Linked and authenticated securely via ${platform}.`,
      role: 'user',
      avatar: platform === 'Google' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    onRegisterNew(socialUser);
    setSuccessMsg(language === 'vi' ? `Ủy quyền tài khoản ${platform} thành công! Đang đăng nhập...` : `Authorized with ${platform}! Entering system...`);
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
      setErrorMsg(language === 'vi' ? 'Vui lòng nhập địa chỉ Gmail hợp lệ!' : 'Please enter a valid Gmail!');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotStep('verify-code');
    setSuccessMsg(language === 'vi' ? `Mã khôi phục đã gửi vào ${forgotEmail}! (Mã mẫu: ${code})` : `Verification code sent to ${forgotEmail}! (Demo code: ${code})`);
  };

  const handleVerifyForgotCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (verificationCode.trim() === sentCode) {
      setForgotStep('new-pass');
      setSuccessMsg(language === 'vi' ? 'Xác minh thành công! Hãy đặt mật khẩu mới của bạn.' : 'Code verified! Choose a new password.');
    } else {
      setErrorMsg(language === 'vi' ? 'Mã xác nhận không khớp! Thử lại.' : 'Incorrect code! Please try again.');
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.trim().length < 6) {
      setErrorMsg(language === 'vi' ? 'Mật khẩu mới phải từ 6 ký tự trở lên!' : 'Password must be at least 6 characters!');
      return;
    }

    // Mock successful password reset for existing users
    const matched = users.find(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (matched) {
      setSuccessMsg(language === 'vi' ? `Khôi phục thành công mật khẩu cho tài khoản ${matched.fullName}! Vui lòng đăng nhập.` : 'Password successfully reset! Please login.');
    } else {
      setSuccessMsg(language === 'vi' ? 'Đặt mật khẩu mới thành công! Đang quay lại màn hình đăng nhập.' : 'New password saved successfully!');
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-natural-bg rounded-3xl p-6 md:p-8 w-full max-w-md border border-natural-border shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-black text-2xl"
        >
          &times;
        </button>

        {/* Logo Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-natural-accent rounded-full flex items-center justify-center text-white mx-auto shadow-md mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-natural-text">
            {authView === 'login' && (language === 'vi' ? 'ĐĂNG NHẬP VIETCHARM' : 'MEMBER SIGN IN')}
            {authView === 'register' && (language === 'vi' ? 'ĐĂNG KÝ TÀI KHOẢN' : 'CREATE ACCOUNT')}
            {authView === 'forgot' && (language === 'vi' ? 'KHÔI PHỤC MẬT KHẨU' : 'RESET PASSWORD')}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'vi' ? 'Hệ thống du lịch thông minh & đặt phòng Miền Trung' : 'Central heritage smart portal'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 mb-4 font-medium">
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 mb-4 font-bold animate-pulse">
            ✓ {successMsg}
          </div>
        )}

        {/* 1. LOGIN VIEW */}
        {authView === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === 'vi' ? 'SĐT / Gmail / Tên đăng nhập' : 'Phone / Gmail / Username'}
              </label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'vi' ? 'SĐT, Gmail hoặc tên đăng nhập...' : 'Phone, Gmail or Username...'} 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
              <span className="text-[10px] text-stone-400 mt-1 block">💡 Demo Admin SĐT/Gmail: <span className="font-mono text-stone-600">0987654321</span> hoặc <span className="font-mono text-stone-600">ngandtk244111@st.uel.edu.vn</span></span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-stone-700 uppercase">{language === 'vi' ? 'Mật khẩu' : 'Password'}</label>
                <button 
                  type="button" 
                  onClick={() => { setAuthView('forgot'); setErrorMsg(''); }}
                  className="text-xs text-natural-accent hover:underline font-semibold"
                >
                  {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-natural-accent hover:bg-natural-olive text-white font-bold py-3 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
            >
              {language === 'vi' ? 'Đăng nhập ngay' : 'Login'}
            </button>

            {/* Social Authentication Options */}
            <div className="relative my-6 text-center">
              <span className="bg-natural-bg px-3 text-xs text-stone-400 z-10 relative">
                {language === 'vi' ? 'Hoặc đăng nhập bằng' : 'Or sign in with'}
              </span>
              <div className="absolute w-full h-[1px] bg-natural-border top-1/2 left-0 z-0"></div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-natural-border py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200 text-stone-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.63 5.63 0 0 1 8.35 12.89a5.63 5.63 0 0 1 5.64-5.626c1.558 0 2.972.616 4.022 1.624l3.1-3.1C19.14 3.86 16.54 2.5 13.99 2.5a10.37 10.37 0 0 0-10.4 10.39 10.37 10.37 0 0 0 10.4 10.39c5.78 0 10.11-4.06 10.11-10.28 0-.69-.08-1.22-.22-1.72H12.24Z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-stone-500">
                {language === 'vi' ? 'Chưa có tài khoản?' : 'No account yet?'} 
                <button 
                  type="button" 
                  onClick={() => { setAuthView('register'); setErrorMsg(''); }}
                  className="text-natural-accent hover:underline font-bold ml-1"
                >
                  {language === 'vi' ? 'Đăng ký ngay' : 'Register here'}
                </button>
              </span>
            </div>
          </form>
        )}

        {/* 2. REGISTER VIEW */}
        {authView === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Tên đăng nhập (viết liền)' : 'Username (no spaces)'}</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: kimngan26" 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Họ và tên' : 'Full Name'}</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Đặng Thị Kim Ngân" 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Địa chỉ Gmail' : 'Email Address'}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: ngan@gmail.com" 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Số điện thoại' : 'Phone Number'}</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0987654321" 
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Vai trò thành viên' : 'Membership Role'}</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
              >
                <option value="user">{language === 'vi' ? 'Khách du lịch (User)' : 'Traveler (User)'}</option>
                <option value="admin">{language === 'vi' ? 'Quản trị hệ thống (Admin)' : 'Administrator (Admin)'}</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-text font-black py-2.5 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
            >
              {language === 'vi' ? 'Hoàn tất Đăng ký' : 'Complete Registration'}
            </button>

            {/* Social Authentication Options */}
            <div className="relative my-4 text-center">
              <span className="bg-natural-bg px-3 text-[10px] text-stone-400 z-10 relative">
                {language === 'vi' ? 'Hoặc đăng ký bằng' : 'Or register with'}
              </span>
              <div className="absolute w-full h-[1px] bg-natural-border top-1/2 left-0 z-0"></div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 border border-natural-border py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200 text-stone-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.63 5.63 0 0 1 8.35 12.89a5.63 5.63 0 0 1 5.64-5.626c1.558 0 2.972.616 4.022 1.624l3.1-3.1C19.14 3.86 16.54 2.5 13.99 2.5a10.37 10.37 0 0 0-10.4 10.39 10.37 10.37 0 0 0 10.4 10.39c5.78 0 10.11-4.06 10.11-10.28 0-.69-.08-1.22-.22-1.72H12.24Z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-stone-500">
                {language === 'vi' ? 'Đã có tài khoản?' : 'Already registered?'} 
                <button 
                  type="button" 
                  onClick={() => { setAuthView('login'); setErrorMsg(''); }}
                  className="text-natural-accent hover:underline font-bold ml-1"
                >
                  {language === 'vi' ? 'Đăng nhập' : 'Sign In'}
                </button>
              </span>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD VIEW */}
        {authView === 'forgot' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed mb-2">
              {language === 'vi' 
                ? 'Nhập địa chỉ Gmail đăng ký tài khoản của bạn. Hệ thống VietCharm sẽ tự động gửi mã khôi phục 6 chữ số qua hòm thư điện tử.' 
                : 'Enter your registered Gmail. VietCharm will automatically dispatch a 6-digit recovery code to your inbox.'}
            </p>

            {forgotStep === 'input-email' && (
              <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Nhập Gmail nhận mã' : 'Enter Gmail'}</label>
                  <input 
                    type="email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Ex: ngandtk244111@st.uel.edu.vn" 
                    className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-natural-accent hover:bg-natural-olive text-white font-bold py-3 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
                >
                  {language === 'vi' ? 'Gửi mã xác nhận về Gmail' : 'Send Code to Gmail'}
                </button>
              </form>
            )}

            {forgotStep === 'verify-code' && (
              <form onSubmit={handleVerifyForgotCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Nhập mã gồm 6 chữ số' : 'Enter 6-digit Code'}</label>
                  <input 
                    type="text" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Ex: 839201" 
                    className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none text-center tracking-widest font-bold"
                    maxLength={6}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-text font-black py-2.5 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
                >
                  {language === 'vi' ? 'Xác nhận mã bảo mật' : 'Verify Security Code'}
                </button>
              </form>
            )}

            {forgotStep === 'new-pass' && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter New Password'}</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full text-sm border border-natural-border bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
                >
                  {language === 'vi' ? 'Lưu mật khẩu & Đăng nhập' : 'Save & Login'}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => { setAuthView('login'); setErrorMsg(''); setForgotStep('input-email'); }}
                className="text-xs text-natural-accent hover:underline font-bold"
              >
                ← {language === 'vi' ? 'Quay lại Đăng nhập' : 'Back to Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================
