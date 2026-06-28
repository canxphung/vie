/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Lock, MapPin, Phone, Mail, Award, Key, Calendar, ShieldCheck, 
  Database, BarChart3, Plus, Trash2, Check, X, FileText, ClipboardList, 
  Car, Star, Tag, Gift, BookOpen, Compass, Info, CheckCircle2, ChevronRight, Sparkles, Heart
} from 'lucide-react';
import { Language, BookingCartItem } from '../types';

// State types that we can synchronize with localStorage to behave like a real backend!
export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
}

export interface PartnershipApplication {
  id: string;
  brandName: string;
  contactName: string;
  type: 'hotel' | 'taxi' | 'experience' | 'artisan' | 'guide' | 'vehicle';
  phone: string;
  email: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface PromoVoucher {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  active: boolean;
}

export interface SystemBooking {
  id: string;
  userEmail: string;
  userName: string;
  items: BookingCartItem[];
  total: number;
  discountApplied: number;
  finalTotal: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
}

// Default system data to seed the state
export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'u-1',
    username: 'ngandtk',
    fullName: 'Đặng Thị Kim Ngân',
    email: 'ngandtk244111@st.uel.edu.vn',
    phone: '0987654321',
    bio: 'Đam mê khám phá di sản lịch sử Việt Nam, yêu mến Hội An.',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-06-20',
  },
  {
    id: 'u-2',
    username: 'traveler_ha',
    fullName: 'Lê Hoàng Anh',
    email: 'hoanganh@gmail.com',
    phone: '0912345678',
    bio: 'Thích lướt xe máy Sirius đi dạo phố cổ lồng đèn rực rỡ.',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-06-22',
  }
];

export const DEFAULT_VOUCHERS: PromoVoucher[] = [
  { code: 'VIETCHARM15', description: 'Giảm 15% tổng hóa đơn cho Hội viên VIP', discountType: 'percentage', value: 15, minSpend: 0, active: true },
  { code: 'HOIANWELCOME', description: 'Giảm ngay 100,000đ chào mừng đến Quảng Nam', discountType: 'fixed', value: 100000, minSpend: 300000, active: true },
  { code: 'GENZTRAVEL', description: 'Giảm 20% cho gói phòng nhóm hoặc Tour Combo', discountType: 'percentage', value: 20, minSpend: 500000, active: true },
];

export const DEFAULT_PARTNERSHIPS: PartnershipApplication[] = [
  {
    id: 'VC-PARTNER-3012',
    brandName: 'Hội An Lantern Homestay',
    contactName: 'Nguyễn Thị Hoa',
    type: 'hotel',
    phone: '0905123456',
    email: 'hoalantern@gmail.com',
    description: 'Mong muốn hợp tác cung cấp 5 phòng nghỉ view sông Hoài hoài cổ.',
    status: 'approved',
    date: '2026-06-21',
  },
  {
    id: 'VC-PARTNER-4509',
    brandName: 'Taxi Sông Thu Bồn',
    contactName: 'Trần Văn Tiến',
    type: 'taxi',
    phone: '0989333444',
    email: 'songthutaxi@gmail.com',
    description: 'Hãng xe 4 chỗ và 7 chỗ phục vụ đưa đón sân bay Đà Nẵng về Hội An giá ưu đãi.',
    status: 'pending',
    date: '2026-06-22',
  }
];

export const DEFAULT_SYSTEM_BOOKINGS: SystemBooking[] = [
  {
    id: 'VC-BK-58902',
    userEmail: 'hoanganh@gmail.com',
    userName: 'Lê Hoàng Anh',
    items: [
      { id: 'allegro-hoian', type: 'hotel', name: 'Allegro Hoi An Luxury Hotel & Spa', price: 1250000, quantity: 2, image: '' }
    ],
    total: 2500000,
    discountApplied: 375000,
    finalTotal: 2125000,
    status: 'confirmed',
    date: '2026-06-22',
  }
];


// ==========================================
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
      <div className="bg-[#FDFCF8] rounded-3xl p-6 md:p-8 w-full max-w-md border border-[#E6E2D3] shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-black text-2xl"
        >
          &times;
        </button>

        {/* Logo Icon Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#8C7A5B] rounded-full flex items-center justify-center text-white mx-auto shadow-md mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#4A4A35]">
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
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
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
                  className="text-xs text-[#8C7A5B] hover:underline font-semibold"
                >
                  {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white font-bold py-3 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
            >
              {language === 'vi' ? 'Đăng nhập ngay' : 'Login'}
            </button>

            {/* Social Authentication Options */}
            <div className="relative my-6 text-center">
              <span className="bg-[#FDFCF8] px-3 text-xs text-stone-400 z-10 relative">
                {language === 'vi' ? 'Hoặc đăng nhập bằng' : 'Or sign in with'}
              </span>
              <div className="absolute w-full h-[1px] bg-[#E6E2D3] top-1/2 left-0 z-0"></div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-[#E6E2D3] py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200 text-stone-700"
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
                  className="text-[#8C7A5B] hover:underline font-bold ml-1"
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
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
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
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
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
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
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
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{language === 'vi' ? 'Vai trò thành viên' : 'Membership Role'}</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
              >
                <option value="user">{language === 'vi' ? 'Khách du lịch (User)' : 'Traveler (User)'}</option>
                <option value="admin">{language === 'vi' ? 'Quản trị hệ thống (Admin)' : 'Administrator (Admin)'}</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#E3B04B] hover:bg-[#c99030] text-[#4A4A35] font-black py-2.5 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
            >
              {language === 'vi' ? 'Hoàn tất Đăng ký' : 'Complete Registration'}
            </button>

            {/* Social Authentication Options */}
            <div className="relative my-4 text-center">
              <span className="bg-[#FDFCF8] px-3 text-[10px] text-stone-400 z-10 relative">
                {language === 'vi' ? 'Hoặc đăng ký bằng' : 'Or register with'}
              </span>
              <div className="absolute w-full h-[1px] bg-[#E6E2D3] top-1/2 left-0 z-0"></div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 border border-[#E6E2D3] py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition duration-200 text-stone-700"
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
                  className="text-[#8C7A5B] hover:underline font-bold ml-1"
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
                    className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white font-bold py-3 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
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
                    className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none text-center tracking-widest font-bold"
                    maxLength={6}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#E3B04B] hover:bg-[#c99030] text-[#4A4A35] font-black py-2.5 rounded-xl transition shadow-md uppercase text-xs tracking-wider"
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
                    className="w-full text-sm border border-[#E6E2D3] bg-white rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-[#8C7A5B] focus:border-[#8C7A5B] outline-none"
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
                className="text-xs text-[#8C7A5B] hover:underline font-bold"
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
// 2. COMPONENT: PERSONAL PROFILE MANAGEMENT
// ==========================================
interface PersonalProfileProps {
  language: Language;
  user: UserAccount;
  onUpdateProfile: (updated: UserAccount) => void;
  bookings: SystemBooking[];
  vouchers: PromoVoucher[];
  onNavigateHome: () => void;
  partnershipRequests: PartnershipApplication[];
  favorites: any[];
  recentlyViewed: any[];
  onToggleFavorite: (item: any) => void;
  onViewItem: (item: any) => void;
}

export function PersonalProfile({ 
  language, 
  user, 
  onUpdateProfile, 
  bookings, 
  vouchers, 
  onNavigateHome, 
  partnershipRequests,
  favorites = [],
  recentlyViewed = [],
  onToggleFavorite,
  onViewItem
}: PersonalProfileProps) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<'bookings' | 'favorites' | 'history' | 'partnerships'>('bookings');
  const [fullName, setFullName] = React.useState(user.fullName);
  const [email, setEmail] = React.useState(user.email);
  const [phone, setPhone] = React.useState(user.phone);
  const [bio, setBio] = React.useState(user.bio);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const [isEditing, setIsEditing] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Filter system bookings belonging to this user
  const userBookings = bookings.filter(b => b.userEmail.toLowerCase() === user.email.toLowerCase());
  const userPartnerships = partnershipRequests.filter(p => p.email.toLowerCase() === user.email.toLowerCase());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      fullName,
      email,
      phone,
      bio,
      avatar
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 9999);
    setAvatar(`https://picsum.photos/id/${randomId % 1000}/150/150`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-[#4A4A35]">
      {/* Profile Header Block */}
      <div className="bg-[#F5F2ED] border border-[#E6E2D3] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img 
              src={avatar} 
              alt={isEditing ? fullName : user.fullName} 
              className="w-24 h-24 rounded-full border-4 border-amber-200 object-cover shadow-lg"
            />
            {isEditing && (
              <button 
                onClick={handleRandomAvatar}
                className="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition duration-200"
              >
                Đổi ảnh (Random)
              </button>
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <span className="bg-[#8C7A5B] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full inline-block">
              {user.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'PREMIUM MEMBER'}
            </span>
            <h2 className="text-2xl font-serif font-black text-stone-900">
              {isEditing ? fullName : user.fullName}
            </h2>
            <p className="text-xs text-[#8C7A5B] font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" /> {isEditing ? email : user.email}
            </p>
            <p className="text-xs text-stone-500 italic mt-1 max-w-md">
              "{isEditing ? bio : (user.bio || (isVi ? 'Hội viên cao cấp của VietCharm.' : 'Premium member of VietCharm.'))}"
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white hover:bg-[#FAF8F5] text-[#8C7A5B] border border-[#E6E2D3] px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition shadow-xs tracking-wider cursor-pointer"
          >
            {isEditing ? (isVi ? 'Hủy bỏ' : 'Cancel') : (isVi ? 'Chỉnh sửa hồ sơ' : 'Edit Profile')}
          </button>
          <button 
            onClick={onNavigateHome}
            className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition shadow-md tracking-wider cursor-pointer"
          >
            {isVi ? 'Về Trang chủ' : 'To Home'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-center">
          ✓ {isVi ? 'Cập nhật thông tin cá nhân thành công!' : 'Profile updated successfully!'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Info / Edit Form */}
        <div className="lg:col-span-1 bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-stone-800 border-b border-[#E6E2D3] pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>{isVi ? 'Thông tin cá nhân' : 'Personal Details'}</span>
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Họ và tên' : 'Full Name'}</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs border border-[#E6E2D3] bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#8C7A5B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Địa chỉ Email' : 'Email'}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-[#E6E2D3] bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#8C7A5B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Số điện thoại' : 'Phone'}</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-[#E6E2D3] bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#8C7A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{isVi ? 'Giới thiệu bản thân' : 'Biography'}</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-[#E6E2D3] bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#8C7A5B]"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#E3B04B] hover:bg-[#c99030] text-[#4A4A35] font-black py-2.5 rounded-xl text-xs uppercase transition tracking-wider cursor-pointer"
              >
                {isVi ? 'Lưu thay đổi' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Họ và tên' : 'Full Name'}
                </span>
                <span className="font-serif font-black text-stone-800 text-sm">{user.fullName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Địa chỉ Email' : 'Email'}
                </span>
                <span className="font-semibold text-[#8C7A5B]">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Tên đăng nhập' : 'Username'}
                </span>
                <span className="font-mono font-bold text-stone-800">{user.username}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Số điện thoại' : 'Phone'}
                </span>
                <span className="font-semibold text-stone-800">{user.phone || (isVi ? 'Chưa cung cấp' : 'Not provided')}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Ngày tham gia' : 'Date Joined'}
                </span>
                <span className="text-stone-800 font-medium">{user.createdAt}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                <span className="text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {isVi ? 'Nhóm đặc quyền' : 'Privilege Level'}
                </span>
                <span className="text-emerald-700 font-black">
                  {user.role === 'admin' ? (isVi ? 'Quản trị hệ thống' : 'System SuperAdmin') : (isVi ? 'Thành viên VIP Gold' : 'VIP Gold Member')}
                </span>
              </div>

              {/* Biography display */}
              <div className="pt-3">
                <span className="text-stone-500 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#8C7A5B]" />
                  {isVi ? 'Giới thiệu bản thân' : 'Biography'}
                </span>
                <p className="text-[#4A4A35] bg-[#FAF8F5] border border-[#E6E2D3] p-3 rounded-xl italic leading-relaxed text-stone-600">
                  {user.bio || (isVi ? 'Hội viên chưa thiết lập lời giới thiệu.' : 'No biography provided.')}
                </p>
              </div>

              {/* Voucher Wallet display inside profile */}
              <div className="pt-6 border-t border-[#E6E2D3] mt-6 space-y-3">
                <h4 className="font-serif font-black text-xs text-[#8C7A5B] uppercase flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#E3B04B]" />
                  <span>{isVi ? 'Ví Voucher ưu đãi của tôi' : 'My Coupon Wallet'}</span>
                </h4>
                <div className="space-y-3">
                  {vouchers.map(v => (
                    <div key={v.code} className="relative bg-[#FAF8F5] border border-[#E6E2D3] rounded-2xl p-4 flex justify-between items-center shadow-xs overflow-hidden group hover:border-[#8C7A5B] transition-all duration-300">
                      {/* Ticket half circles decoration */}
                      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white border-r border-[#E6E2D3] rounded-full -translate-y-1/2"></div>
                      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-l border-[#E6E2D3] rounded-full -translate-y-1/2"></div>
                      
                      <div className="pl-3 pr-2 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-[#8C7A5B] tracking-wider select-all cursor-pointer bg-stone-100 px-2 py-0.5 rounded-md hover:bg-[#8C7A5B]/10 transition-colors">
                            {v.code}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 block leading-relaxed">{v.description}</span>
                      </div>
                      
                      <div className="border-l border-dashed border-[#E6E2D3] pl-4 py-1 flex flex-col items-center justify-center shrink-0 min-w-[70px]">
                        <span className="text-[9px] text-stone-400 font-bold uppercase block tracking-wider mb-0.5">{isVi ? 'GIẢM' : 'OFF'}</span>
                        <span className="text-amber-600 font-black text-xs block">
                          {v.discountType === 'percentage' ? `${v.value}%` : `${v.value >= 1000 ? `${v.value / 1000}k` : v.value}đ`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking History, Favorites, Recently Viewed & Partnerships Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-[#F5F2ED] border border-[#E6E2D3] rounded-2xl p-1.5 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-[#8C7A5B] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{isVi ? 'Lịch sử đặt vé' : 'Bookings'}</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{isVi ? 'Yêu thích' : 'Favorites'}</span>
              {favorites.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'favorites' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-600'}`}>
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#8C7A5B] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{isVi ? 'Đã xem' : 'Recent'}</span>
              {recentlyViewed.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'history' ? 'bg-white text-stone-700' : 'bg-stone-200 text-stone-700'}`}>
                  {recentlyViewed.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('partnerships')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'partnerships'
                  ? 'bg-[#8C7A5B] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{isVi ? 'Hợp tác' : 'Partnerships'}</span>
            </button>
          </div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-[#E6E2D3] pb-3 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#8C7A5B]" />
                  <span>{isVi ? 'Lịch sử đặt vé & khách sạn' : 'Booking & Ticket History'}</span>
                </h3>

                {userBookings.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <FileText className="w-10 h-10 mx-auto text-stone-300" />
                    <p>{isVi ? 'Bạn chưa có đơn đặt chỗ nào trong hệ thống.' : 'No active bookings registered yet.'}</p>
                    <button 
                      onClick={onNavigateHome}
                      className="bg-[#FAF8F5] text-[#8C7A5B] px-4 py-2 border border-[#E6E2D3] rounded-xl hover:bg-[#F5F2ED] transition text-[11px] font-bold uppercase"
                    >
                      {isVi ? 'Khám phá và đặt ngay' : 'Explore Attractions Now'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div key={b.id} className="border border-stone-200 rounded-2xl p-4 space-y-3 hover:shadow-md transition">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="font-mono text-[10px] text-stone-500 font-bold">MÃ ĐƠN: {b.id}</span>
                            <h4 className="text-xs font-bold text-stone-800 mt-0.5">{b.date}</h4>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {b.status === 'confirmed' ? 'Đã thanh toán (Thẻ vé hợp lệ)' : b.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                          </span>
                        </div>

                        <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs">
                          {b.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-stone-600">
                              <span>{it.name} <strong className="text-stone-800">x{it.quantity}</strong></span>
                              <span>{(it.price * it.quantity).toLocaleString()}đ</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                          <span className="text-stone-500">{isVi ? 'Giảm voucher:' : 'Discount:'} -{b.discountApplied.toLocaleString()}đ</span>
                          <span className="font-bold text-stone-900">{isVi ? 'Thành tiền:' : 'Paid Balance:'} <strong className="text-[#8C7A5B] font-black text-sm">{b.finalTotal.toLocaleString()}đ</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div
                key="favorites-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-[#E6E2D3] pb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>{isVi ? 'Mục dịch vụ yêu thích của tôi' : 'My Favorite Services'}</span>
                </h3>

                {favorites.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <Heart className="w-10 h-10 mx-auto text-stone-200 animate-pulse" />
                    <p>{isVi ? 'Danh sách yêu thích trống.' : 'No favorites added yet.'}</p>
                    <p className="text-[10px] text-stone-400 max-w-sm mx-auto">{isVi ? 'Hãy bấm hình trái tim tại các khách sạn, trải nghiệm hay thuê xe để lưu lại.' : 'Tap heart icons on hotels, tours, or activities to save them.'}</p>
                    <button 
                      onClick={onNavigateHome}
                      className="bg-[#FAF8F5] text-[#8C7A5B] px-4 py-2 border border-[#E6E2D3] rounded-xl hover:bg-[#F5F2ED] transition text-[11px] font-bold uppercase mt-2"
                    >
                      {isVi ? 'Khám phá ngay' : 'Explore Now'}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <div 
                        key={fav.id}
                        className="bg-[#FAF8F5] border border-[#E6E2D3] rounded-2xl overflow-hidden shadow-xs hover:border-[#8C7A5B] transition flex flex-col justify-between"
                      >
                        <div className="relative h-32 overflow-hidden shrink-0">
                          <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite?.(fav);
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-rose-600 hover:scale-105 transition"
                            title={isVi ? 'Xóa khỏi yêu thích' : 'Remove from favorites'}
                          >
                            <Heart className="w-4 h-4 fill-current text-rose-600" />
                          </button>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[9px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 inline-block mb-1">
                              {fav.type === 'hotel' ? (isVi ? 'Khách sạn' : 'Hotel') : fav.type === 'vehicle' ? (isVi ? 'Thuê xe' : 'Vehicle') : (isVi ? 'Trải nghiệm' : 'Activity')}
                            </span>
                            <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{fav.name}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{fav.description || ''}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                            <span className="font-mono text-xs font-black text-[#8C7A5B]">
                              {fav.price.toLocaleString('vi-VN')}đ{fav.type === 'hotel' ? (isVi ? '/đêm' : '/night') : ''}
                            </span>
                            <button
                              onClick={() => onViewItem?.(fav)}
                              className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white text-[10px] px-3 py-1 rounded-lg font-bold"
                            >
                              {isVi ? 'Xem' : 'View'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-[#E6E2D3] pb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#8C7A5B]" />
                  <span>{isVi ? 'Dịch vụ đã xem gần đây' : 'Recently Viewed'}</span>
                </h3>

                {recentlyViewed.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 space-y-2 text-xs">
                    <Calendar className="w-10 h-10 mx-auto text-stone-200" />
                    <p>{isVi ? 'Bạn chưa xem dịch vụ nào gần đây.' : 'No recently viewed items yet.'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentlyViewed.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => onViewItem?.(item)}
                        className="bg-[#FAF8F5] hover:bg-[#F5F2ED] border border-[#E6E2D3] rounded-xl p-3 flex gap-3 cursor-pointer transition"
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{item.description || ''}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-mono text-[11px] font-black text-[#8C7A5B]">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[9px] text-stone-400 italic">
                              {isVi ? 'Bấm để xem' : 'Click to view'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'partnerships' && (
              <motion.div
                key="partnerships-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-serif font-bold text-stone-800 border-b border-[#E6E2D3] pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span>{isVi ? 'Yêu cầu hợp tác lữ hành' : 'Partnership Applications Status'}</span>
                </h3>

                {userPartnerships.length === 0 ? (
                  <p className="text-center py-4 text-xs text-stone-400">
                    {isVi ? 'Bạn chưa đăng ký liên kết kinh doanh dịch vụ nào.' : 'No brand partnership requests on file.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userPartnerships.map((p) => (
                      <div key={p.id} className="bg-stone-50 border border-stone-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-stone-400 font-bold">{p.id}</span>
                            <strong className="text-stone-800 text-sm">{p.brandName}</strong>
                          </div>
                          <p className="text-stone-500">Người liên hệ: {p.contactName} - Loại hình: <span className="uppercase font-semibold text-[#8C7A5B]">{p.type}</span></p>
                          <span className="text-[10px] text-stone-400 block">Đăng ngày: {p.date}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {p.status === 'approved' ? '✓ ĐÃ PHÊ DUYỆT' : p.status === 'pending' ? '● CHỜ DUYỆT' : '✕ TỪ CHỐI'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 3. COMPONENT: TAXI & TRANSPORT ENGINE WITH DISTANCE ESTIMATOR
// ==========================================
interface TaxiBookingProps {
  language: Language;
  onAddToCart: (item: BookingCartItem) => void;
  onNavigateHome: () => void;
}

const TOURIST_LOCATIONS = [
  { id: 'dad-airport', name: 'Sân bay Quốc tế Đà Nẵng (DAD)', lat: 16.0440, lng: 108.2022 },
  { id: 'dad-station', name: 'Ga đường sắt Đà Nẵng', lat: 16.0689, lng: 108.2140 },
  { id: 'hoian-ancient', name: 'Phố cổ Hội An (Trần Phú)', lat: 15.8771, lng: 108.3267 },
  { id: 'anbang-beach', name: 'Bãi biển An Bàng Hội An', lat: 15.9126, lng: 108.3435 },
  { id: 'myson-sanctuary', name: 'Thánh địa Mỹ Sơn (Duy Xuyên)', lat: 15.7642, lng: 108.1235 },
  { id: 'tamthanh-mural', name: 'Làng bích họa Tam Thanh (Tam Kỳ)', lat: 15.6120, lng: 108.5320 },
];

export function TaxiBooking({ language, onAddToCart, onNavigateHome }: TaxiBookingProps) {
  const isVi = language === 'vi';
  const [pickup, setPickup] = React.useState(TOURIST_LOCATIONS[0].id);
  const [dropoff, setDropoff] = React.useState(TOURIST_LOCATIONS[2].id);
  const [vehicleType, setVehicleType] = React.useState<'vios-4' | 'xpander-7' | 'sirius-moto'>('vios-4');
  const [bookingDate, setBookingDate] = React.useState('2026-06-25');
  const [bookingTime, setBookingTime] = React.useState('14:00');
  const [specialNote, setSpecialNote] = React.useState('');
  const [bookedMsg, setBookedMsg] = React.useState(false);

  // Approximate coordinate distance calculator
  const pickupLoc = TOURIST_LOCATIONS.find(l => l.id === pickup) || TOURIST_LOCATIONS[0];
  const dropoffLoc = TOURIST_LOCATIONS.find(l => l.id === dropoff) || TOURIST_LOCATIONS[2];

  // Simple Euclidean distance multiplier for local terrain
  const calculatedDistance = React.useMemo(() => {
    const latDiff = pickupLoc.lat - dropoffLoc.lat;
    const lngDiff = pickupLoc.lng - dropoffLoc.lng;
    const rawDist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // 1 degree ~ 111km
    return Math.max(parseFloat(rawDist.toFixed(1)), 2.5); // Minimum 2.5km distance
  }, [pickupLoc, dropoffLoc]);

  const pricePerKm = vehicleType === 'vios-4' ? 12000 : vehicleType === 'xpander-7' ? 16000 : 6000;
  const totalCost = Math.round(calculatedDistance * pricePerKm);

  const handleBookTaxi = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleName = vehicleType === 'vios-4' 
      ? 'Taxi 4 Chỗ Toyota Vios (VietCharm Transfer)' 
      : vehicleType === 'xpander-7' 
      ? 'Taxi 7 Chỗ Mitsubishi Xpander (VietCharm Transfer)' 
      : 'Xe Ôm Công Nghệ Sirius/Vision (VietCharm Transfer)';

    onAddToCart({
      id: `taxi-${Date.now()}`,
      type: 'vehicle',
      name: `${vehicleName} [${pickupLoc.name} ➔ ${dropoffLoc.name}]`,
      price: totalCost,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
      details: `${isVi ? 'Ngày đưa đón' : 'Scheduled at'}: ${bookingDate} ${bookingTime}. ${isVi ? 'Quãng đường:' : 'Dist:'} ${calculatedDistance}km.`
    });

    setBookedMsg(true);
    setTimeout(() => setBookedMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#4A4A35]">
      <div className="text-center space-y-2 mb-8">
        <span className="bg-[#8C7A5B] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
          VIETCHARM TAXI & AIRPORT TRANSFER
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐẶT XE TAXI & ĐƯA ĐÓN SÂN BAY' : 'AIRPORT TAXI & PRIVATE TRANSFER'}
        </h2>
        <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
          {isVi 
            ? 'Cổng tính phí tự động chuẩn xác theo km. Xe sạch sẽ, máy lạnh mát rượi, tài xế bản địa cực am hiểu Hội An và Đà Nẵng.'
            : 'Get instant exact distance calculations and flat-rate transparent billing with polite multilingual drivers.'}
        </p>
      </div>

      {bookedMsg && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-center mb-6 animate-bounce">
          ✓ {isVi ? 'Đã thêm dịch vụ đưa đón vào Giỏ hàng! Vui lòng mở giỏ hàng thanh toán thẻ vé.' : 'Taxi ride successfully added to Cart! Proceed to secure checkout.'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Booking parameters Form */}
        <form onSubmit={handleBookTaxi} className="bg-white border border-[#E6E2D3] p-6 rounded-3xl space-y-5 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#8C7A5B] border-b border-[#E6E2D3] pb-2 uppercase flex items-center gap-1.5">
            <Car className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>{isVi ? 'Thông tin lộ trình' : 'Route Details'}</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Điểm Đón (Pick-up Location)' : 'Pick-up'}</label>
              <select 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2.5 font-medium text-stone-800 outline-none"
              >
                {TOURIST_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Điểm Đến (Drop-off Location)' : 'Drop-off'}</label>
              <select 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2.5 font-medium text-stone-800 outline-none"
              >
                {TOURIST_LOCATIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Ngày đưa đón' : 'Date'}</label>
                <input 
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 text-stone-800 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Giờ đón' : 'Time'}</label>
                <input 
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 text-stone-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Chọn Loại Phương Tiện' : 'Vehicle Type'}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('vios-4')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'vios-4' ? 'bg-[#8C7A5B] text-white border-[#8C7A5B]' : 'bg-white border-[#E6E2D3] hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe 4 Chỗ' : '4-Seater'}</span>
                  <span className="text-[9px] block opacity-85">12,000đ/km</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('xpander-7')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'xpander-7' ? 'bg-[#8C7A5B] text-white border-[#8C7A5B]' : 'bg-white border-[#E6E2D3] hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe 7 Chỗ' : '7-Seater'}</span>
                  <span className="text-[9px] block opacity-85">16,000đ/km</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('sirius-moto')}
                  className={`border p-2.5 rounded-xl text-center space-y-1 transition ${
                    vehicleType === 'sirius-moto' ? 'bg-[#8C7A5B] text-white border-[#8C7A5B]' : 'bg-white border-[#E6E2D3] hover:bg-stone-50'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{isVi ? 'Xe ôm Sirius' : 'Sirius Moto'}</span>
                  <span className="text-[9px] block opacity-85">6,000đ/km</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Ghi chú cho tài xế (VD: Sân bay ga quốc tế...)' : 'Driver Notes'}</label>
              <input 
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="Ex: Đón tôi ở cột số 5, ga đến quốc nội Đà Nẵng..."
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pickup === dropoff}
            className="w-full bg-[#E3B04B] hover:bg-[#c99030] disabled:opacity-50 text-[#4A4A35] font-black py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-md"
          >
            {pickup === dropoff 
              ? (isVi ? 'Vui lòng chọn 2 điểm khác nhau' : 'Select different locations') 
              : (isVi ? 'Xác nhận đặt xe lữ hành' : 'Confirm & Add to Cart')}
          </button>
        </form>

        {/* Dynamic Calculation Visualization Mock Map Route */}
        <div className="bg-[#F5F2ED] border border-[#E6E2D3] p-6 rounded-3xl flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-[#E6E2D3] pb-2 uppercase">
              {isVi ? 'Chi tiết chi phí & hành trình' : 'Dynamic Fare Indexing'}
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="bg-white rounded-xl p-3 border border-stone-150 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold uppercase">{isVi ? 'Quãng đường tối ưu:' : 'Route Distance:'}</span>
                  <span className="font-black text-stone-800">{calculatedDistance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold uppercase">{isVi ? 'Đơn giá loại xe:' : 'Fare Rate:'}</span>
                  <span className="font-mono font-bold text-stone-800">{pricePerKm.toLocaleString()} đ / km</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 font-bold text-stone-900">
                  <span className="uppercase">{isVi ? 'Cước xe ước tính:' : 'Base Subtotal:'}</span>
                  <span>{totalCost.toLocaleString()} đ</span>
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-xl p-3 border border-dashed border-amber-300 space-y-1.5 text-[11px] leading-relaxed">
                <strong className="text-amber-800 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> {isVi ? 'ƯU ĐÃI KHÔNG PHỤ PHÍ' : 'FLAT-RATE PROTECTION'}
                </strong>
                <p className="text-stone-600">
                  {isVi 
                    ? 'Giá trên là trọn gói đã bao gồm phí cầu đường BOT sân bay Đà Nẵng, cam kết không phát sinh bất kỳ chi phí ẩn nào khi di chuyển dọc đường.'
                    : 'The rate listed is 100% flat-rate, including all regional highway tolls, airport gate tariffs and luggage protection.'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E6E2D3] pt-4 mt-6 space-y-2 text-center text-xs">
            <p className="text-stone-500 font-serif italic">
              {isVi 
                ? 'Tự động gán tài xế phản hồi nhanh trong 5 phút sau khi thanh toán.'
                : 'Guaranteed polite driver assigned within 5 mins of cart checkout.'}
            </p>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-[#8C7A5B] font-bold hover:underline"
            >
              ← {isVi ? 'Quay về dạo chơi di sản' : 'Browse other experiences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. COMPONENT: DEDICATED TOUR COMBOS PACKAGES
// ==========================================
interface TourCombosProps {
  language: Language;
  onAddToCart: (item: BookingCartItem) => void;
  onNavigateHome: () => void;
  onViewItem?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
  favorites?: any[];
  onToggleFavorite?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
}

const PREDEFINED_COMBOS = [
  {
    id: 'combo-heritage-soul',
    name: 'Combo "Hồn Thiêng Di Sản" Hội An',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    days: '3 Ngày 2 Đêm',
    price: 1950000,
    oldPrice: 2400000,
    includes: [
      '2 đêm tại Allegro Luxury Hotel & Spa 5 sao (Đã gồm ăn sáng)',
      'Vé tham quan khu di sản Phố Cổ & Lớp học gốm Thanh Hà',
      'Đưa đón sân bay Đà Nẵng - Hội An hai chiều riêng tư mát mẻ',
      'Trải nghiệm lãng mạn Thả đèn hoa đăng sông Hoài thơ mộng'
    ],
    rating: 4.9,
    tag: 'Bán Chạy Nhất'
  },
  {
    id: 'combo-coral-adventure',
    name: 'Combo "Biển Xanh & Phiêu Lưu Cù Lao Chàm"',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    days: '2 Ngày 1 Đêm',
    price: 1350000,
    oldPrice: 1750000,
    includes: [
      '1 đêm tại An Bang Beach Hideaway Homestay sát bờ cát rì rào',
      'Cano cao tốc lặn ngắm san hô & Thưởng thức hải sản Cù Lao Chàm',
      'Thuê xe máy Honda Vision Smartkey tự do lướt gió miền biển',
      'Tặng ly nước Mót thảo mộc thanh mát nổi tiếng'
    ],
    rating: 4.8,
    tag: 'Trải Nghiệm Trẻ'
  },
  {
    id: 'combo-central-links',
    name: 'Combo Siêu Liên Tuyến "Hội An - Đà Nẵng - Huế"',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    days: '4 Ngày 3 Đêm',
    price: 3600000,
    oldPrice: 4500000,
    includes: [
      '3 đêm nghỉ ngơi luân phiên tại chuỗi resort liên kết 4-5 sao',
      'Vé cáp treo Bà Nà Hills Cầu Vàng & Đại Nội cố đô Huế trọn gói',
      'Xe riêng máy lạnh đưa đón phục vụ suốt hành trình liên tỉnh',
      'Nghe ca Huế trên thuyền Rồng sông Hương hoàng gia'
    ],
    rating: 5.0,
    tag: 'Đại Gia Đình'
  },
  {
    id: 'combo-hue-heritage',
    name: 'Combo "Sắc Màu Cố Đô Huế" Thơ Mộng',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58bc238517?auto=format&fit=crop&w=600&q=80',
    days: '2 Ngày 1 Đêm',
    price: 1690000,
    oldPrice: 2100000,
    includes: [
      '1 đêm tại Silk Path Grand Hue Hotel 5 sao đẳng cấp (Đã gồm ăn sáng buffet)',
      'Thuyết minh viên riêng đồng hành tại Đại Nội & Lăng Khải Định am hiểu sâu sắc',
      'Nghe Ca Huế trên Thuyền Rồng sông Hương về đêm thả hoa đăng lãng mạn',
      'Thưởng thức yến tiệc cung đình hoàng gia Triều Nguyễn hóa thân vua chúa'
    ],
    rating: 4.9,
    tag: 'Di Sản Thơ Mộng'
  },
  {
    id: 'combo-danang-leisure',
    name: 'Combo "Nắng Vàng Mỹ Khê & Bà Nà Hills"',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    days: '3 Ngày 2 Đêm',
    price: 2450000,
    oldPrice: 3100000,
    includes: [
      '2 đêm phòng Ocean View tại Sala Danang Beach Hotel 4 sao sát bờ cát trắng',
      'Vé cáp treo Bà Nà Hills & Buffet trưa ẩm thực trọn gói 50 món hấp dẫn',
      'Vé tham quan danh thắng Ngũ Hành Sơn & Tour lặn biển ngắm san hô Sơn Trà',
      'Đưa đón sân bay Đà Nẵng hai chiều mát mẻ bằng xe điện VinFast êm ái'
    ],
    rating: 4.8,
    tag: 'Trải Nghiệm Năng Động'
  },
  {
    id: 'combo-slow-travel-retreat',
    name: 'Combo "Chữa Lành & Thiền Định Thủy Biều"',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    days: '3 Ngày 2 Đêm',
    price: 2990000,
    oldPrice: 3800000,
    includes: [
      '2 đêm nghỉ dưỡng tại resort 5 sao tịnh tâm Pilgrimage Village',
      'Liệu trình thiền & yoga phục hồi sinh lực, ngâm chân thảo dược phục hồi',
      'Tour đạp xe dạo quanh làng cổ bưởi thanh trà Thủy Biều mộc mạc thơm ngát',
      'Bữa tối thực dưỡng chay thuần khiết thanh lọc cơ thể tại resort'
    ],
    rating: 4.9,
    tag: 'Chữa Lành Độc Bản'
  },
  {
    id: 'combo-heritage-golf',
    name: 'Combo "Di Sản & Swing Golf Thượng Lưu"',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    days: '3 Ngày 2 Đêm',
    price: 5900000,
    oldPrice: 7500000,
    includes: [
      '2 đêm tại biệt thự có hồ bơi riêng biệt lập Banyan Tree Lăng Cô siêu sang',
      '1 vòng chơi Golf 18 hố đẳng cấp quốc tế tại sân Laguna Golf Lăng Cô tuyệt mỹ',
      'Đưa đón riêng tư suốt hành trình bằng xe Limousine hạng sang đẳng cấp',
      'Tặng khay champagne cao cấp và dâu tây tươi phục vụ tận giường biệt thự'
    ],
    rating: 5.0,
    tag: 'Thượng Lưu Vip'
  }
];

export function TourCombos({ 
  language, 
  onAddToCart, 
  onNavigateHome, 
  onViewItem,
  favorites = [],
  onToggleFavorite
}: TourCombosProps) {
  const isVi = language === 'vi';
  const [successId, setSuccessId] = React.useState<string | null>(null);

  const handleBookCombo = (combo: typeof PREDEFINED_COMBOS[0]) => {
    if (onViewItem) {
      onViewItem({
        id: combo.id,
        type: 'activity',
        name: `[Tour Combo] ${combo.name}`,
        image: combo.image,
        price: combo.price,
        description: combo.includes.join('. ')
      });
    } else {
      onAddToCart({
        id: combo.id,
        type: 'activity',
        name: `[Tour Combo] ${combo.name} (${combo.days})`,
        price: combo.price,
        quantity: 1,
        image: combo.image,
        details: `${isVi ? 'Trọn gói bao gồm các dịch vụ cao cấp: ' : 'Bundled heritage package including: '} ${combo.includes[0]}.`
      });

      setSuccessId(combo.id);
      setTimeout(() => setSuccessId(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-[#4A4A35] space-y-10">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="bg-[#E3B04B] text-[#4A4A35] text-[10px] uppercase font-black tracking-widest px-3.5 py-1 rounded-full">
          EXCLUSIVE HERITAGE BUNDLES
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐẶT COMBO TOUR DU LỊCH TIẾT KIỆM IPP' : 'SAVER HERITAGE TOUR COMBOS'}
        </h2>
        <p className="text-stone-500 text-xs leading-relaxed">
          {isVi 
            ? 'Kết hợp phòng nghỉ cao cấp, xe di chuyển riêng tư và vé tham quan di sản nổi bật với mức chiết khấu độc quyền lên đến 25% tổng hóa đơn.'
            : 'Unite premium hotel stays, private airport transfers, and verified attraction entries with absolute 25% bundling savings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PREDEFINED_COMBOS.map((combo) => (
          <div 
            key={combo.id}
            onClick={() => onViewItem?.({
              id: combo.id,
              type: 'activity',
              name: `[Tour Combo] ${combo.name}`,
              image: combo.image,
              price: combo.price,
              description: combo.includes.join('. ')
            })}
            className="bg-white border border-[#E6E2D3] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={combo.image} alt={combo.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite({
                      id: combo.id,
                      type: 'activity',
                      name: `[Tour Combo] ${combo.name}`,
                      image: combo.image,
                      price: combo.price,
                      description: combo.includes.join('. ')
                    });
                  }}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-md hover:scale-110 transition group/fav cursor-pointer z-10"
                  title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                >
                  <Heart 
                    className={`w-4 h-4 transition duration-200 ${
                      favorites.some(x => x.id === combo.id) 
                        ? 'text-rose-600 fill-rose-600' 
                        : 'text-stone-400 group-hover/fav:text-rose-500'
                    }`} 
                  />
                </button>
              )}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1 shadow-sm border border-stone-200">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{combo.rating}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#8C7A5B] font-bold text-xs tracking-wider uppercase block">{combo.days}</span>
                  <span className="text-stone-400 text-xs line-through">{combo.oldPrice.toLocaleString()}đ</span>
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 leading-snug line-clamp-2 min-h-[44px]">
                  {combo.name}
                </h3>
                
                {/* List of included items */}
                <ul className="space-y-1.5 text-stone-600 text-xs pt-1 border-t border-stone-100">
                  {combo.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400 uppercase font-bold">{isVi ? 'Giá trọn gói' : 'Bundled Price'}</span>
                  <strong className="text-xl font-serif font-black text-[#8C7A5B]">
                    {combo.price.toLocaleString()}đ <span className="text-[10px] font-sans text-stone-500">/{isVi ? 'Khách' : 'Pax'}</span>
                  </strong>
                </div>

                <button
                  onClick={() => handleBookCombo(combo)}
                  className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-md"
                >
                  {isVi ? 'ĐẶT COMBO NGAY' : 'BOOK BUNDLED PACKAGE'}
                </button>

                {successId === combo.id && (
                  <p className="text-[11px] font-bold text-emerald-800 text-center animate-bounce">
                    ✓ {isVi ? 'Đã thêm Combo Trọn gói vào Giỏ hàng!' : 'Combo successfully added to Cart!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ==========================================
// 5. COMPONENT: TRAVEL HANDBOOK / GUIDEBOOK
// ==========================================
export function TravelHandbook({ language }: { language: Language }) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<'history' | 'lantern' | 'culinary' | 'tips' | 'banahills' | 'hue_royal' | 'haivan_pass' | 'tailoring'>('history');

  const content = {
    history: {
      title: isVi ? 'Lịch sử thăng trầm của thương cảng Hội An' : 'Hoi An Historical Footprints',
      img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Hội An, ban đầu là cảng biển Lâm Ấp của Vương quốc Champa cổ, từ thế kỷ XV đã vưu lên thành thương cảng quốc tế sầm uất bậc nhất Đông Nam Á của Đại Việt dưới thời chúa Nguyễn. Nơi đây từng là điểm neo đậu lý tưởng của các thuyền buôn từ Nhật Bản, Trung Hoa, Hà Lan, Bồ Đào Nha tìm kiếm hồ tiêu, gốm sứ và tơ lụa cao cấp.'
        : 'Originally a crucial maritime gateway for the ancient Champa Kingdom known as Lam Ap, Hoi An flourished into one of the busiest international trading ports in Southeast Asia from the 15th to the 19th centuries under the Nguyen Lords, serving merchants from Japan, China, and Europe.',
      p2: isVi
        ? 'Nhờ sự chuyển hướng dòng chảy sông Thu Bồn đầu thế kỷ XIX, Hội An vô tình bị "bỏ quên" khỏi guồng quay đô thị hóa hiện đại. Chính sự cô lập địa lý đó đã giúp bảo tồn nguyên vẹn hơn 1000 ngôi nhà gỗ, đền đài, hội quán gia tộc mang đậm kiến trúc giao thoa đa văn hóa Việt - Nhật - Hoa độc nhất vô nhị.'
        : 'The silting of the Thu Bon river mouth in the early 19th century isolated the town from modern industrialization, preserving over 1,000 wooden heritage houses and assembly halls, leading to its declaration as a UNESCO World Heritage site.'
    },
    lantern: {
      title: isVi ? 'Lễ hội Đèn lồng & Sắc đêm Sông Hoài' : 'Lantern Festival & Sông Hoài Romance',
      img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Nếu có dịp ghé thăm Hội An vào ngày 14 Âm lịch hàng tháng (Đêm rằm phố cổ), du khách sẽ lạc bước vào không gian thần tiên cổ tích khi toàn bộ khu phố cổ tắt hết ánh sáng đèn điện, nhường chỗ cho hàng ngàn cánh đèn lồng lụa vẽ chữ thư pháp rực rỡ sắc màu treo dọc mái ngói rêu phong.'
        : 'Held on the 14th day of every lunar month, the Lantern Festival sees the entire historic old town switch off all fluorescent lights, letting traditional silk lanterns illuminate the ancient houses in warm cosmic glows.',
      p2: isVi
        ? 'Hãy lên một chiếc thuyền gỗ mộc mạc của các cô chú lái đò bên bờ sông Hoài, mua một chiếc đèn hoa đăng làm bằng giấy thủ công với ngọn nến nhỏ chỉ 10,000đ, thắp sáng điều ước lãng mạn của mình và thả trôi bồng bềnh xuôi theo dòng nước lung linh hư ảo.'
        : 'Take a gentle wooden boat ride on Sông Hoài river, buy handcrafted paper candle lanterns, and send your innermost wishes floating along the glittering river waters.'
    },
    culinary: {
      title: isVi ? 'Tinh hoa Ẩm thực: Mì Quảng, Cao Lầu, Nước Mót' : 'Culinary Masterpieces: Cao Lau, My Quang & Mot',
      img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Cao Lầu không chỉ là một món ăn, mà là một lát cắt văn hóa lịch sử Hội An. Sợi mì có màu vàng đục, dai giòn sần sật đặc trưng nhờ được nhào trộn với nước giếng cổ Bá Lễ ngàn năm và tro rơm đốt từ cù lao Chàm, ăn kèm thịt xá xíu thái mỏng, tóp mỡ chiên giòn rụm và rau thơm Trà Quế nồng nàn.'
        : 'Cao Lau represents a physical slice of Hoi An culinary history. The thick noodles must be made with water from the thousand-year-old Ba Well and ash from Cham Island straw, producing an elastic chewiness served with roast pork and local greens.',
      p2: isVi
        ? 'Bên cạnh đó, đừng quên nếm thử Mì Quảng đậm đà nước dùng, bánh mì Phượng lừng danh giòn rụm béo ngậy pate, và nhâm nhi một ly nước thảo mộc Mót mát lạnh được đun từ sả, chanh, cam thảo và trang trí bằng cánh sen lãng mạn.'
        : 'Additionally, make sure to experience a bowl of savory My Quang, a crispy Banh Mi Phượng with fatty liver pâté, and sip on a cup of herbal Mot tea infused with lemongrass, licorice, and fresh lotus petals.'
    },
    tips: {
      title: isVi ? 'Kinh nghiệm dạo bước & Quy tắc ứng xử di sản' : 'Travel Etiquette & Local Insider Secrets',
      img: 'https://images.unsplash.com/photo-1596484552834-6a58bc238517?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? '1. Thời điểm lý tưởng: Buổi sáng sớm khoảng 6h - 8h là lúc phố cổ bình yên nhất, không ồn ào khói xe, rất thích hợp chụp những bức ảnh kiến trúc rêu phong thuần khiết. 2. Trang phục: Vui lòng mặc quần áo kín vai và quá đầu gối khi tham quan các ngôi nhà cổ, hội quán và Chùa Cầu để thể hiện sự tôn trọng tôn nghiêm.'
        : '1. Golden Hour: Wander the streets from 6 AM to 8 AM to enjoy serene, empty ancient lanes under fresh morning light. 2. Heritage Code: Ensure shoulders and knees are modestly covered when entering ancient family houses, shrines, and the historic Japanese Covered Bridge.',
      p2: isVi
        ? '3. Vé tham quan: Hãy mua vé trọn gói tại quầy bán vé của phố cổ để ủng hộ quỹ trùng tu bảo tồn. Chỉ một chiếc vé nhỏ của bạn đã góp phần giữ gìn mái ngói Hội An sừng sững trước mưa bão miền Trung hàng năm.'
        : '3. Conservation Support: Purchasing official entrance tickets directly funds the local artisan renovation teams, protecting these fragile wooden buildings from seasonal typhoons.'
    },
    banahills: {
      title: isVi ? 'Bà Nà Hills & Khám phá Làng Pháp trong sương mây' : 'Bà Nà Hills & French Village in Clouds',
      img: 'https://images.unsplash.com/photo-1583244532610-2a234e7c3ecd?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Tọa lạc trên đỉnh núi Chúa hùng vĩ ở độ cao 1,487m, Bà Nà Hills tựa như một góc châu Âu cổ kính lơ lửng giữa mây ngàn. Khí hậu bốn mùa hội tụ trong cùng một ngày vô cùng mát mẻ sảng khoái kỳ vĩ.'
        : 'Perched on the majestic peak of Mount Chua at 1,487m, Ba Na Hills feels like a piece of vintage Europe floating among high mountain clouds. Experience four distinct seasons in a single day.',
      p2: isVi
        ? 'Biểu tượng không thể bỏ lỡ chính là Cầu Vàng (Golden Bridge) lừng danh thế giới, nâng đỡ bởi đôi bàn tay khổng lồ rêu phong vươn ra từ vách đá cheo leo, tạo nên địa điểm check-in tuyệt mỹ của mọi hành trình.'
        : 'The must-see highlight is the world-renowned Golden Bridge, supported by two mossy stone giant hands stretching from steep cliffs. It serves as an ultimate scenic checkpoint.'
    },
    hue_royal: {
      title: isVi ? 'Nhã nhạc Cung đình Huế: Bản hòa ca vương giả hoàng gia' : 'Hue Royal Court Music: Imperial Harmonies',
      img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Được UNESCO vinh danh là Kiệt tác di sản truyền khẩu và phi vật thể của nhân loại, Nhã nhạc Cung đình Huế là dòng nhạc chính thống quý phái của triều đình phong kiến nhà Nguyễn xưa tấu bởi dàn nhạc nhạc cụ cổ truyền tinh xảo.'
        : 'Inscribed by UNESCO as a Masterpiece of the Oral and Intangible Heritage of Humanity, Nhã nhạc represents the noble, formal court music of the historic Nguyen Dynasty, played with traditional wind, string, and percussion instruments.',
      p2: isVi
        ? 'Hãy lên những chiếc thuyền rồng trôi êm đềm trên dòng sông Hương khi hoàng hôn buông xuống, thả đèn hoa đăng lung linh cầu an lành và thưởng thức những làn điệu dân ca ngọt ngào say đắm lòng người.'
        : 'Board a colorful dragon boat drifting gently on the Perfume River at dusk, light up candle-lit paper lanterns, and listen to these royal and traditional folk melodies.'
    },
    haivan_pass: {
      title: isVi ? 'Kinh nghiệm phượt Đèo Hải Vân bằng xe máy an toàn' : 'Hai Van Pass Scooter Adventure Guide',
      img: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Được mô tả là một trong những con đường ven biển hiểm trở đẹp nhất thế giới, đèo Hải Vân uốn lượn uốn khúc dài 21km ôm trọn eo biển lộng gió hùng vĩ mây phủ bồng bềnh tuyệt đẹp.'
        : 'Hailed as one of the best coastal roads in the world, the 21km winding road over Hai Van Pass offers sweeping ocean panoramas and is best explored on two wheels for ultimate freedom.',
      p2: isVi
        ? 'Mẹo an toàn: Hãy thuê xe máy số hoặc xe côn tay mạnh mẽ, kiểm tra phanh kỹ trước khi leo đèo. Đi chậm ở khúc cua tay áo, tránh phượt lúc trời mưa và dừng chân thưởng thức cà phê ở đỉnh đèo Hải Vân Quan.'
        : 'Safety Guide: Choose a reliable manual bike with serviced brakes. Ride slow around blind hairpin curves, avoid foggy rainy days, and stop at the historic gate "Hải Vân Quan" for photos.'
    },
    tailoring: {
      title: isVi ? 'Nghệ thuật may đo "nóng" lấy liền Hội An nức tiếng' : 'The Art of Hoi An Express Custom Tailoring',
      img: 'https://images.unsplash.com/photo-1596484552834-6a58bc238517?auto=format&fit=crop&w=800&q=80',
      p1: isVi 
        ? 'Hội An nổi tiếng thế giới với dịch vụ may đo váy áo, comple lấy nhanh siêu tốc chỉ trong vài tiếng đồng hồ vừa vặn hoàn hảo, chế tác thủ công tinh xảo dưới bàn tay tài hoa của thợ may bản địa.'
        : 'Hoi An is internationally celebrated for its speed-tailoring shops that craft bespoke dresses, suits, and traditional Ao Dai within just a few hours. Master tailors deliver perfect fits.',
      p2: isVi
        ? 'Kinh nghiệm: Hãy chọn mẫu thiết kế ưa thích trước, chọn chất liệu vải lụa tơ tằm mềm mịn. Thực hiện lấy số đo vào buổi sáng và bạn có thể nhận bộ trang phục lộng lẫy ngay vào buổi chiều cùng ngày.'
        : 'Pro-tip: Browse styles beforehand, select high-grade mulberry silk, take measurements in the morning, and enjoy a final fitting on the very same afternoon!'
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[#4A4A35] space-y-8 bg-white border border-[#E6E2D3] rounded-3xl shadow-xs">
      <div className="text-center space-y-1.5 border-b border-stone-150 pb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 uppercase tracking-tight">
          📖 {isVi ? 'CẨM NANG DU LỊCH & DI SẢN MIỀN TRUNG' : 'CENTRAL VIETNAM HERITAGE HANDBOOK'}
        </h2>
        <p className="text-stone-500 text-xs">
          {isVi ? 'Mọi điều cần biết để hành trình dạo bước di sản của bạn trọn vẹn và an toàn nhất' : 'A beautifully crafted slow-travel guidebook for the modern heritage explorer'}
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-100 pb-4">
        {[
          { id: 'history', label: isVi ? 'Lịch sử Hội An' : 'Hoi An Lore' },
          { id: 'lantern', label: isVi ? 'Lễ rằm Sông Hoài' : 'Lantern Festival' },
          { id: 'culinary', label: isVi ? 'Ẩm thực cổ truyền' : 'Culinary Arts' },
          { id: 'tips', label: isVi ? 'Ứng xử Di sản' : 'Insider Tips' },
          { id: 'banahills', label: isVi ? 'Sương mây Bà Nà' : 'Ba Na Hills' },
          { id: 'hue_royal', label: isVi ? 'Nhã nhạc Ca Huế' : 'Royal Court' },
          { id: 'haivan_pass', label: isVi ? 'Phượt Hải Vân' : 'Hai Van Pass' },
          { id: 'tailoring', label: isVi ? 'May đo lấy liền' : 'Tailoring' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
              activeTab === t.id 
                ? 'bg-[#8C7A5B] text-white shadow-xs' 
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Animated tab content card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
          <img 
            src={content[activeTab].img} 
            alt={content[activeTab].title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-serif font-black text-stone-900 leading-snug">
            {content[activeTab].title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            {content[activeTab].p1}
          </p>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            {content[activeTab].p2}
          </p>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 6. COMPONENT: PARTNERSHIP REGISTRATION WITH STATUS TRACKING
// ==========================================
interface PartnershipFormProps {
  language: Language;
  onRegisterApplication: (app: PartnershipApplication) => void;
  applications: PartnershipApplication[];
}

export function PartnershipForm({ language, onRegisterApplication, applications }: PartnershipFormProps) {
  const isVi = language === 'vi';
  const [brandName, setBrandName] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [type, setType] = React.useState<'hotel' | 'taxi' | 'experience' | 'artisan' | 'guide'>('hotel');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !contactName.trim()) return;

    const trackingId = `VC-PARTNER-${1000 + Math.floor(Math.random() * 8999)}`;
    const newApp: PartnershipApplication = {
      id: trackingId,
      brandName: brandName.trim(),
      contactName: contactName.trim(),
      type,
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    onRegisterApplication(newApp);
    setSubmittedCode(trackingId);

    // Reset fields
    setBrandName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-[#4A4A35] space-y-8">
      <div className="text-center space-y-2">
        <span className="bg-[#8C7A5B] text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full">
          VIETCHARM MERCHANDISE NETWORK
        </span>
        <h2 className="text-3xl font-serif font-black text-stone-900 uppercase">
          {isVi ? 'ĐĂNG KÝ HỢP TÁC KINH DOANH LỮ HÀNH' : 'REGISTER LOCAL PARTNERSHIP & ALLIANCE'}
        </h2>
        <p className="text-stone-500 text-xs max-w-lg mx-auto leading-relaxed">
          {isVi 
            ? 'Liên kết khách sạn của bạn, đội xe taxi, hoặc các làng nghề thủ công để cùng VietCharm xây dựng hệ sinh thái di sản bền vững.'
            : 'Integrate your hotels, taxi transfer fleets, or handcrafted workshops into our unified sustainable portal.'}
        </p>
      </div>

      {submittedCode && (
        <div className="bg-emerald-50 text-emerald-800 border-2 border-dashed border-emerald-300 p-5 rounded-2xl text-xs space-y-2 text-center animate-fade-in">
          <p className="font-bold text-sm">🎉 {isVi ? 'Đăng ký đề xuất hợp tác thành công!' : 'Partnership Submission Success!'}</p>
          <p>{isVi ? 'Hồ sơ đã được mã hóa gửi đến Bộ phận Quản trị VietCharm.' : 'Your request has been securely dispatched to VietCharm vetting desk.'}</p>
          <p className="font-mono text-stone-800 font-black">{isVi ? 'Mã số hồ sơ theo dõi:' : 'Application Tracking Code:'} {submittedCode}</p>
          <p className="text-stone-500 italic text-[10px]">{isVi ? 'Bạn có thể xem trạng thái xét duyệt trực tiếp tại Hồ sơ cá nhân của mình hoặc liên hệ Hotline.' : 'Monitor application status live in your Profile.'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-[#E6E2D3] p-6 rounded-3xl space-y-4 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-[#E6E2D3] pb-2 uppercase flex items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <span>{isVi ? 'Đơn Đăng Ký Đối Tác' : 'Partnership Form'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Tên Đơn vị / Thương hiệu' : 'Brand/Company Name'}</label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ex: Đò gỗ Sông Hoài Lan"
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-[#8C7A5B]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Người đại diện liên hệ' : 'Contact Person'}</label>
              <input 
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Nguyễn Văn A"
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Lĩnh vực hợp tác' : 'Service Domain'}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-2 py-2 outline-none font-bold"
              >
                <option value="hotel">{isVi ? 'Lưu trú / Khách sạn' : 'Hotel Stay'}</option>
                <option value="vehicle">{isVi ? 'Cho thuê xe máy, ô tô tự lái' : 'Vehicle Rentals & Cars'}</option>
                <option value="taxi">{isVi ? 'Vận chuyển / Taxi đưa đón' : 'Taxi & Transfer'}</option>
                <option value="experience">{isVi ? 'Vui chơi / Hoạt động / Tour' : 'Experiences & Tours'}</option>
                <option value="artisan">{isVi ? 'Làng nghề / Thủ công mỹ nghệ' : 'Artisan Workshop'}</option>
                <option value="guide">{isVi ? 'Hướng dẫn viên du lịch' : 'Tour Guide'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Số điện thoại liên hệ' : 'Phone'}</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0905000000"
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Địa chỉ Email chính thức' : 'Email'}</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: partner@brand.com"
                className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mô tả ngắn gọn Đề xuất / Năng lực dịch vụ' : 'Proposal details'}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Chúng tôi cung cấp 15 chiếc xe máy Sirius mới cáu sọc đỏ đen, sẵn sàng phục vụ khách lữ hành tự lái với giá rẻ..."
              rows={4}
              className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white font-bold py-3 rounded-xl uppercase tracking-wider transition shadow-md"
          >
            {isVi ? 'ĐỆ TRÌNH HỒ SƠ HỢP TÁC' : 'SUBMIT PROPOSAL'}
          </button>
        </form>

        {/* Benefits guide sidebar */}
        <div className="bg-[#FAF8F5] border border-[#E6E2D3] p-6 rounded-3xl space-y-5 text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#8C7A5B] uppercase border-b border-[#E6E2D3] pb-2">
              {isVi ? 'Đặc quyền đối tác VietCharm' : 'Merchant Alliance Benefits'}
            </h4>
            <div className="space-y-3 leading-relaxed">
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Quảng bá không biên giới:' : 'Global Visibility:'}</strong> {isVi ? 'Tiếp cận hàng chục ngàn lượt khách du lịch tìm lịch trình AI của VietCharm hàng tháng.' : 'Showcase your local catalog to tech-forward tourists.'}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Phí chiết khấu cực thấp:' : 'Low Commission:'}</strong> {isVi ? 'VietCharm duy trì mức phí sàn chỉ 5-8% hỗ trợ bà con và doanh nghiệp phát triển bền vững.' : 'We cap platform fees at only 5-8% to support regional communities.'}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-500 font-black">✦</span>
                <p><strong>{isVi ? 'Công cụ Quản trị thông minh:' : 'Sleek Dashboard:'}</strong> {isVi ? 'Hệ thống tự động đồng bộ đơn đặt chỗ, thông báo thẻ vé thời gian thực chuẩn xác.' : 'Get instant digital orders with direct verification screens.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200">
            <p className="text-[#8C7A5B] font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" /> {isVi ? 'Cam kết bảo mật:' : 'Data Privacy:'}
            </p>
            <p className="text-stone-500 mt-1 leading-snug">
              {isVi ? 'Mọi thông tin liên hệ và giấy phép được VietCharm bảo mật tối mật theo quy định lữ hành.' : 'Your submission remains strictly confidential.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 7. COMPONENT: ADMIN DATA & SERVICE MANAGEMENT PANEL
// ==========================================
interface AdminDashboardProps {
  language: Language;
  users: UserAccount[];
  onUpdateUserRole: (id: string, role: 'user' | 'admin') => void;
  applications: PartnershipApplication[];
  onUpdateApplicationStatus: (id: string, status: 'approved' | 'rejected') => void;
  bookings: SystemBooking[];
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;
  vouchers: PromoVoucher[];
  onAddNewVoucher: (v: PromoVoucher) => void;
  onDeleteVoucher: (code: string) => void;
}

export function AdminDashboard({
  language,
  users,
  onUpdateUserRole,
  applications,
  onUpdateApplicationStatus,
  bookings,
  onUpdateBookingStatus,
  vouchers,
  onAddNewVoucher,
  onDeleteVoucher,
}: AdminDashboardProps) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<'stats' | 'users' | 'partners' | 'bookings' | 'vouchers'>('stats');

  // Local state for creating new voucher
  const [vCode, setVCode] = React.useState('');
  const [vDesc, setVDesc] = React.useState('');
  const [vType, setVType] = React.useState<'percentage' | 'fixed'>('percentage');
  const [vVal, setVVal] = React.useState(10);
  const [vMin, setVMin] = React.useState(0);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim()) return;

    onAddNewVoucher({
      code: vCode.trim().toUpperCase(),
      description: vDesc.trim() || `${isVi ? 'Giảm giá' : 'Discount'} ${vCode}`,
      discountType: vType,
      value: Number(vVal),
      minSpend: Number(vMin),
      active: true
    });

    setVCode('');
    setVDesc('');
    setVVal(10);
    setVMin(0);
  };

  // Calculate high-fidelity business metrics
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.finalTotal : sum, 0);
  const totalBookingsCount = bookings.length;
  const pendingPartnershipsCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-[#4A4A35]">
      {/* Admin Title Banner */}
      <div className="bg-[#4A4A35] text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="bg-[#E3B04B] text-[#4A4A35] text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full inline-block">
            VIETCHARM ADMIN SUITE
          </span>
          <h2 className="text-2xl font-serif font-black flex items-center gap-2">
            <Database className="w-6 h-6 text-[#E3B04B]" />
            <span>{isVi ? 'HỆ THỐNG QUẢN TRỊ DỮ LIỆU & DỊCH VỤ' : 'CENTRAL SYSTEM DATA CONTROL'}</span>
          </h2>
          <p className="text-xs text-[#F5F2ED]/70">
            {isVi ? 'Phân tích doanh thu, duyệt đối tác, phân quyền người dùng và cấp phát mã voucher ưu đãi' : 'Review live transactions, manage local providers and update vouchers'}
          </p>
        </div>

        <div className="bg-[#F5F2ED]/15 px-4 py-2 rounded-2xl border border-white/10 text-right">
          <p className="text-[10px] text-stone-300 font-bold font-mono">SERVER STATUS: GREEN</p>
          <p className="text-xs font-semibold text-emerald-400 font-mono">DATABASE PERSISTED</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: 'stats', label: isVi ? 'Thống kê & Doanh số' : 'Live Metrics', icon: BarChart3 },
          { id: 'bookings', label: isVi ? 'Quản lý đơn đặt chỗ' : 'Reservations', icon: ClipboardList },
          { id: 'partners', label: isVi ? `Hợp tác đối tác (${pendingPartnershipsCount})` : 'Partnerships', icon: Compass },
          { id: 'users', label: isVi ? 'Quản lý người dùng' : 'User Database', icon: User },
          { id: 'vouchers', label: isVi ? 'Cấu hình Voucher' : 'Coupon Control', icon: Tag },
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                activeTab === tab.id 
                  ? 'bg-[#8C7A5B] text-white shadow-md' 
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-150'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ADMIN TABS PANELS */}

      {/* TAB 1: STATS & ANALYTICS */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E6E2D3] p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Tổng doanh thu thực tế' : 'Total Revenue Confirmed'}</span>
              <h3 className="text-3xl font-serif font-black text-[#8C7A5B] mt-1">
                {totalRevenue.toLocaleString()} đ
              </h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {isVi ? 'Tất cả hóa đơn confirmed hợp lệ' : '100% verified checkouts'}</p>
            </div>

            <div className="bg-white border border-[#E6E2D3] p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Tổng số giao dịch' : 'Total System Orders'}</span>
              <h3 className="text-3xl font-serif font-black text-stone-800 mt-1">
                {totalBookingsCount} {isVi ? 'Hóa đơn' : 'Bookings'}
              </h3>
              <p className="text-[10px] text-stone-500 mt-1">● {isVi ? 'Bao gồm cả vé Chờ xử lý' : 'Includes all pending bookings'}</p>
            </div>

            <div className="bg-white border border-[#E6E2D3] p-5 rounded-3xl shadow-xs">
              <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider block">{isVi ? 'Thành viên đăng ký hệ thống' : 'Registered Users'}</span>
              <h3 className="text-3xl font-serif font-black text-amber-600 mt-1">
                {users.length} {isVi ? 'Tài khoản' : 'Members'}
              </h3>
              <p className="text-[10px] text-[#8C7A5B] font-bold mt-1">★ {users.filter(u => u.role === 'admin').length} Admin, {users.filter(u => u.role === 'user').length} Travelers</p>
            </div>
          </div>

          {/* Quick Mock Visual chart block */}
          <div className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs">
            <h4 className="font-serif font-bold text-base text-stone-800 mb-4 uppercase">
              {isVi ? 'Phân bổ cơ cấu danh mục dịch vụ' : 'Revenue Streams & Booking Shares'}
            </h4>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🏨 {isVi ? 'Khách sạn & Khu nghỉ dưỡng (Hotels)' : 'Hotels Stay'}</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8C7A5B]" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🚗 {isVi ? 'Dịch vụ đưa đón sân bay & Taxi (Transfer)' : 'Taxi & Car Rentals'}</span>
                  <span>20%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>🎟 {isVi ? 'Vé hoạt động tham quan & Lớp học nghệ thuật (Things To Do)' : 'Activities & Sightseeing'}</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: SYSTEM BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Danh sách hóa đơn lữ hành VietCharm' : 'All System Reservations'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] font-black uppercase text-stone-400 tracking-wider">
                  <th className="pb-3">{isVi ? 'Mã đơn' : 'ID'}</th>
                  <th className="pb-3">{isVi ? 'Khách hàng' : 'Traveler'}</th>
                  <th className="pb-3">{isVi ? 'Ngày đặt' : 'Date'}</th>
                  <th className="pb-3">{isVi ? 'Dịch vụ đã đặt' : 'Items'}</th>
                  <th className="pb-3 text-right">{isVi ? 'Doanh thu' : 'Final Total'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Trạng thái' : 'Status'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Hành động' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-3 font-mono font-bold text-[#8C7A5B]">{b.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-stone-800">{b.userName}</div>
                      <div className="text-[10px] text-stone-400">{b.userEmail}</div>
                    </td>
                    <td className="py-3 text-stone-500 font-medium">{b.date}</td>
                    <td className="py-3 max-w-[200px] truncate font-medium text-stone-600">
                      {b.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 text-right font-black text-stone-900">{b.finalTotal.toLocaleString()}đ</td>
                    <td className="py-3 text-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md"
                          title="Confirm / Pay"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md"
                          title="Cancel Booking"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 3: PARTNERSHIPS APPROVALS */}
      {activeTab === 'partners' && (
        <div className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Hồ sơ đề nghị hợp tác của tiểu thương / doanh nghiệp' : 'Regional Partnership Submissions'}
          </h3>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="border border-stone-200 rounded-2xl p-4 space-y-3 hover:shadow-xs transition">
                <div className="flex justify-between items-start flex-wrap gap-2 border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-mono text-[9px] text-stone-400 font-bold">{app.id}</span>
                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">{app.brandName}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : app.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 text-stone-600">
                    <p><strong>{isVi ? 'Liên hệ:' : 'Contact:'}</strong> {app.contactName}</p>
                    <p><strong>{isVi ? 'Điện thoại:' : 'Phone:'}</strong> {app.phone}</p>
                    <p><strong>{isVi ? 'Email:' : 'Email:'}</strong> {app.email}</p>
                    <p><strong>{isVi ? 'Lĩnh vực:' : 'Domain:'}</strong> <span className="uppercase font-bold text-[#8C7A5B]">{app.type}</span></p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3 text-stone-600 italic leading-relaxed border border-stone-100">
                    "{app.description}"
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-[11px] uppercase transition shadow-xs"
                    >
                      {isVi ? 'Phê duyệt hợp tác' : 'Approve Application'}
                    </button>
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'rejected')}
                      className="bg-stone-200 hover:bg-red-100 text-stone-600 hover:text-red-700 font-bold px-4 py-1.5 rounded-lg text-[11px] uppercase transition"
                    >
                      {isVi ? 'Từ chối' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs space-y-4 animate-fade-in text-xs">
          <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
            {isVi ? 'Cơ sở dữ liệu người dùng VietCharm' : 'User Accounts Directory'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[10px] font-black uppercase text-stone-400 tracking-wider">
                  <th className="pb-3">{isVi ? 'Avatar' : 'Profile'}</th>
                  <th className="pb-3">{isVi ? 'Tên đăng nhập' : 'Username'}</th>
                  <th className="pb-3">{isVi ? 'Họ và tên' : 'FullName'}</th>
                  <th className="pb-3">{isVi ? 'Email / SĐT' : 'Contact'}</th>
                  <th className="pb-3">{isVi ? 'Vai trò' : 'System Role'}</th>
                  <th className="pb-3 text-center">{isVi ? 'Chuyển đổi vai trò' : 'Alter Privilege'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="py-3">
                      <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                    </td>
                    <td className="py-3 font-mono font-bold text-stone-700">{u.username}</td>
                    <td className="py-3 font-semibold text-stone-800">{u.fullName}</td>
                    <td className="py-3 text-stone-600">
                      <div>{u.email}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{u.phone}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => onUpdateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                        className="bg-stone-100 hover:bg-[#8C7A5B] hover:text-white border border-stone-200 text-stone-600 font-bold px-3 py-1 rounded-lg text-[10px] uppercase transition"
                      >
                        {u.role === 'admin' ? (isVi ? 'Hạ cấp User' : 'Revoke Admin') : (isVi ? 'Thăng cấp Admin' : 'Make Admin')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* TAB 5: VOUCHERS CONTROL */}
      {activeTab === 'vouchers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start animate-fade-in text-xs">
          
          {/* Create new voucher form */}
          <div className="bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
              {isVi ? 'Tạo mã Voucher mới' : 'Add Promo Coupon'}
            </h3>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mã ưu đãi (viết hoa)' : 'Coupon Code'}</label>
                <input 
                  type="text"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  placeholder="Ex: QUANGNAM30"
                  className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Mô tả nội dung' : 'Coupon Description'}</label>
                <input 
                  type="text"
                  value={vDesc}
                  onChange={(e) => setVDesc(e.target.value)}
                  placeholder="Ex: Giảm giá 30% tối đa 150k"
                  className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Loại chiết khấu' : 'Type'}</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as any)}
                    className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-2 py-2 outline-none font-bold text-stone-800"
                  >
                    <option value="percentage">% {isVi ? 'Phần trăm' : 'Percentage'}</option>
                    <option value="fixed">đ {isVi ? 'Tiền mặt' : 'Fixed Cash'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Giá trị giảm' : 'Value'}</label>
                  <input 
                    type="number"
                    value={vVal}
                    onChange={(e) => setVVal(Number(e.target.value))}
                    className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none font-bold"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 uppercase mb-1">{isVi ? 'Chi tiêu tối thiểu (VND)' : 'Min Spend (VND)'}</label>
                <input 
                  type="number"
                  value={vMin}
                  onChange={(e) => setVMin(Number(e.target.value))}
                  className="w-full border border-[#E6E2D3] bg-[#FAF8F5] rounded-xl px-3 py-2 outline-none font-bold"
                  min={0}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E3B04B] hover:bg-[#c99030] text-[#4A4A35] font-black py-2.5 rounded-xl uppercase tracking-wider transition shadow-md"
              >
                {isVi ? 'CẤP PHÁT VOUCHER' : 'CREATE PROMO CODE'}
              </button>
            </form>
          </div>

          {/* Active vouchers list */}
          <div className="md:col-span-2 bg-white border border-[#E6E2D3] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-800 border-b border-stone-150 pb-2 uppercase">
              {isVi ? 'Các mã Voucher đang hoạt động' : 'Active System Promo Codes'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <div key={v.code} className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-2xl flex justify-between items-center hover:shadow-md transition">
                  <div className="space-y-1">
                    <span className="font-mono font-black text-[#8C7A5B] text-sm tracking-wider block">{v.code}</span>
                    <p className="text-[11px] text-stone-600 leading-normal">{v.description}</p>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {isVi ? 'Chi tiêu từ:' : 'Min Spend:'} {v.minSpend.toLocaleString()}đ
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                    <span className="bg-[#E3B04B] text-[#4A4A35] text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                      {v.discountType === 'percentage' ? `-${v.value}%` : `-${v.value.toLocaleString()}đ`}
                    </span>
                    <button
                      onClick={() => onDeleteVoucher(v.code)}
                      className="text-stone-400 hover:text-red-700 p-1"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
