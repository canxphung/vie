import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Share2, 
  Plus, 
  Vote, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Check, 
  Trash2,
  DollarSign,
  Compass,
  Utensils,
  Hotel as HotelIcon,
  MapPin,
  Smile,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { BookingCartItem } from '../types';

interface TripRoomProps {
  language: 'vi' | 'en';
  onAddComboToCart: (items: BookingCartItem[]) => void;
  onNavigateHome: () => void;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  preferences: string[];
  dislikes: string;
  status: 'paid' | 'unpaid';
}

interface VoteItem {
  id: string;
  nameVi: string;
  nameEn: string;
  type: 'hotel' | 'activity' | 'restaurant';
  image: string;
  votes: string[]; // Member IDs
  price: number;
  rating: number;
  locationVi: string;
  locationEn: string;
}

export default function TripRoom({ language, onAddComboToCart, onNavigateHome }: TripRoomProps) {
  const isVi = language === 'vi';

  // Room states
  const [roomId, setRoomId] = useState('VC-GROUP-889');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'voting' | 'checkout'>('invite');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Group members
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'm1',
      name: isVi ? 'Trần Tuấn (Bạn/Trưởng Nhóm)' : 'Tran Tuan (You/Leader)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      budget: 5000000,
      preferences: isVi ? ['Gần Phố Cổ', 'Ăn đặc sản', 'Chill sông nước'] : ['Near Ancient Town', 'Local food', 'Riverside chilling'],
      dislikes: isVi ? 'Đi bộ quá nhiều' : 'Too much walking',
      status: 'unpaid'
    },
    {
      id: 'm2',
      name: 'Khánh Vy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      budget: 6000000,
      preferences: isVi ? ['Chụp ảnh đẹp', 'Hồ bơi vô cực', 'Café hoài cổ'] : ['Aesthetic photos', 'Infinity pool', 'Vintage café'],
      dislikes: isVi ? 'Dậy quá sớm' : 'Waking up too early',
      status: 'unpaid'
    },
    {
      id: 'm3',
      name: 'Hoàng Long',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      budget: 4500000,
      preferences: isVi ? ['Chèo thuyền thúng', 'Hải sản tươi', 'Gần biển'] : ['Basket boat tour', 'Fresh seafood', 'Near beach'],
      dislikes: isVi ? 'Khách sạn ồn ào' : 'Noisy hotels',
      status: 'unpaid'
    }
  ]);

  // Vote database (Hotels, activities, restaurants)
  const [votingItems, setVotingItems] = useState<VoteItem[]>([
    // Hotels
    {
      id: 'h1',
      nameVi: 'Resort Boutique Di Sản Sông Thu Bồn',
      nameEn: 'Thu Bon River Heritage Boutique Resort',
      type: 'hotel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      votes: ['m1', 'm2'],
      price: 1800000,
      rating: 4.9,
      locationVi: 'Ven sông Thu Bồn, Hội An',
      locationEn: 'Riverside, Hoi An'
    },
    {
      id: 'h2',
      nameVi: 'Khách sạn Heritage Gỗ Mộc Phố Cổ',
      nameEn: 'Historic Timber Town Hotel',
      type: 'hotel',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
      votes: ['m3'],
      price: 1100000,
      rating: 4.6,
      locationVi: 'Trung tâm Phố cổ, Hội An',
      locationEn: 'Ancient Town Center, Hoi An'
    },
    // Dining spots
    {
      id: 'r1',
      nameVi: 'Nhà Hàng Vườn Vy: Cao Lầu & Hoành Thánh Di Sản',
      nameEn: 'Vy Garden: Heritage Cao Lau & Wontons',
      type: 'restaurant',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
      votes: ['m1', 'm2', 'm3'], // consensus!
      price: 250000,
      rating: 4.8,
      locationVi: 'Đường Bạch Đằng, Hội An',
      locationEn: 'Bach Dang St, Hoi An'
    },
    {
      id: 'r2',
      nameVi: 'Bếp Hải Sản Đầm Sen Hội An',
      nameEn: 'Dam Sen Fresh Lagoon Seafood',
      type: 'restaurant',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
      votes: ['m3'],
      price: 450000,
      rating: 4.5,
      locationVi: 'Cẩm An, Hội An',
      locationEn: 'Cam An, Hoi An'
    },
    // Activities
    {
      id: 'a1',
      nameVi: 'Tour Lặn Ngắm San Hô Đảo Cù Lao Chàm bằng Cano',
      nameEn: 'Cham Island Snorkeling & Speedboat Adventure',
      type: 'activity',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
      votes: ['m1', 'm3'],
      price: 750000,
      rating: 4.7,
      locationVi: 'Bến tàu Cửa Đại',
      locationEn: 'Cua Dai Pier'
    },
    {
      id: 'a2',
      nameVi: 'Thúng Xoay Rừng Dừa Bảy Mẫu & Thả Hoa Đăng Sông Hoài',
      nameEn: 'Coconut Forest Spinning Basket Boat & Lantern Release',
      type: 'activity',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
      votes: ['m2', 'm1', 'm3'], // consensus!
      price: 250000,
      rating: 4.9,
      locationVi: 'Rừng dừa Bảy Mẫu',
      locationEn: 'Bay Mau Coconut Forest'
    }
  ]);

  // Form states for adding simulated friends
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendBudget, setNewFriendBudget] = useState(5000000);
  const [newFriendPref, setNewFriendPref] = useState('');
  const [newFriendDislike, setNewFriendDislike] = useState('');

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const copyRoomLink = () => {
    setCopied(true);
    navigator.clipboard.writeText(`${window.location.origin}/triproom/${roomId}`);
    triggerAlert(isVi ? '✓ Đã sao chép link phòng lập kế hoạch!' : '✓ Group trip room link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const avatars = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newId = `m${members.length + 1}`;
    const newMember: Member = {
      id: newId,
      name: newFriendName,
      avatar: randomAvatar,
      budget: newFriendBudget,
      preferences: newFriendPref ? newFriendPref.split(',').map(s => s.trim()) : (isVi ? ['Tự do', 'Chill chill'] : ['Flexible', 'Chill']),
      dislikes: newFriendDislike || (isVi ? 'Không có' : 'None'),
      status: 'unpaid'
    };

    setMembers([...members, newMember]);
    setNewFriendName('');
    setNewFriendPref('');
    setNewFriendDislike('');

    // Simulate voting randomly for some options to make it feel real
    setVotingItems(prev => prev.map(item => {
      if (Math.random() > 0.4) {
        return { ...item, votes: [...item.votes, newId] };
      }
      return item;
    }));

    triggerAlert(isVi ? `✓ Đã mời ${newFriendName} vào phòng nhóm!` : `✓ Invited ${newFriendName} to the trip room!`);
  };

  const handleDeleteMember = (memberId: string) => {
    if (memberId === 'm1') {
      triggerAlert(isVi ? 'Bạn không thể xóa chính mình!' : 'You cannot remove yourself!');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setVotingItems(prev => prev.map(item => ({
      ...item,
      votes: item.votes.filter(vId => vId !== memberId)
    })));
    triggerAlert(isVi ? 'Đã gỡ thành viên khỏi nhóm.' : 'Removed member from the room.');
  };

  const handleVote = (itemId: string, memberId: string) => {
    setVotingItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasVoted = item.votes.includes(memberId);
        const newVotes = hasVoted 
          ? item.votes.filter(v => v !== memberId) 
          : [...item.votes, memberId];
        return { ...item, votes: newVotes };
      }
      return item;
    }));
  };

  const handleSimulatePayment = (memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'paid' } : m));
    triggerAlert(isVi ? '✓ Ghi nhận thanh toán thành công!' : '✓ Payment verified successfully!');
  };

  const handleRemindAll = () => {
    triggerAlert(isVi ? '🔔 Đã rung chuông gửi SMS & Zalo nhắc đóng tiền cho thành viên!' : '🔔 Split-bill reminders broadcasted via text!');
  };

  // Group calculations
  // Find highest voted items per category
  const getTopVoted = (type: 'hotel' | 'activity' | 'restaurant') => {
    const items = votingItems.filter(v => v.type === type);
    if (items.length === 0) return null;
    return items.reduce((prev, current) => (prev.votes.length > current.votes.length) ? prev : current);
  };

  const topHotel = getTopVoted('hotel');
  const topActivity = getTopVoted('activity');
  const topRestaurant = getTopVoted('restaurant');

  // Pricing based on selected top voted elements
  const totalHotelPrice = topHotel ? topHotel.price * 2 : 0; // 2 nights
  const totalActivityPrice = topActivity ? topActivity.price : 0;
  const totalRestaurantPrice = topRestaurant ? topRestaurant.price : 0;
  
  const packageTotal = totalHotelPrice + totalActivityPrice + totalRestaurantPrice;
  const perPersonShare = Math.round(packageTotal / (members.length || 1));
  const unpaidCount = members.filter(m => m.status === 'unpaid').length;

  const handleCheckoutGroup = () => {
    // Collect the booking items
    const items: BookingCartItem[] = [];
    if (topHotel) {
      items.push({
        id: `group-hotel-${topHotel.id}`,
        type: 'hotel',
        name: `[Group Room] ${isVi ? topHotel.nameVi : topHotel.nameEn}`,
        price: topHotel.price * 2, // 2 nights
        quantity: members.length,
        image: topHotel.image,
        details: isVi ? `Bình chọn nhiều nhất bởi cả nhóm ${roomId}` : `Top-voted stay by group ${roomId}`
      });
    }
    if (topActivity) {
      items.push({
        id: `group-act-${topActivity.id}`,
        type: 'activity',
        name: `[Group Room] ${isVi ? topActivity.nameVi : topActivity.nameEn}`,
        price: topActivity.price,
        quantity: members.length,
        image: topActivity.image,
        details: isVi ? `Phục vụ nhóm ${members.length} khách` : `Reserved for ${members.length} guests`
      });
    }

    onAddComboToCart(items);
    triggerAlert(isVi ? '✓ Đã đồng bộ các lựa chọn hàng đầu của nhóm vào Giỏ hành lý!' : '✓ Syncing consensus group selections to Cart!');
    setActiveTab('checkout');
  };

  return (
    <div className="w-full bg-[#FAF6ED] text-[#4A4A35] py-12 px-4 md:px-8 border-y border-[#E6E2D3] relative overflow-hidden">
      
      {/* Floating Notifications */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#4A4A35] text-[#FAF6ED] px-6 py-3 rounded-full text-xs font-bold shadow-2xl z-50 border border-[#E6E2D3]/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E3B04B]" />
            <span>{alertMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Branding */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE5D5] text-[#8C7A5B] text-[10px] font-black uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>{isVi ? 'PHÒNG LẬP KẾ HOẠCH NHÓM ĐỒNG THUẬN' : 'SHARED GROUP PLANNING ROOM'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#4A4A35]">
            {isVi ? 'Trip Room – Giải Mã Áp Lực Đi Nhóm' : 'Trip Room – Group Co-Planning Oasis'}
          </h2>
          <p className="text-xs md:text-sm text-[#4A4A35]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            {isVi 
              ? 'Đi nhóm mệt vì một người chốt tự phát, người khác không ưng, không biết ai đã trả tiền, hay đổi lịch. Trip Room cho phép cả nhóm đề xuất gu, bầu chọn tối ưu, tự thanh toán và hiển thị hóa đơn minh bạch.'
              : 'Group trips get chaotic when one person decides and others suffer. Invite friends, cast votes on options, track payment shares, and build a trip everyone actually loves.'}
          </p>
        </div>

        {/* Layout container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 5 COLUMNS: LOBBY & MEMBER FLOW */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E6E2D3] shadow-lg flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              {/* Invitation & Code */}
              <div className="bg-[#FAF6ED] border border-[#E6E2D3] p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black text-[#8C7A5B] tracking-wider block">
                    {isVi ? 'LIÊN KẾT PHÒNG DU LỊCH NHÓM' : 'CO-PLANNING INVITE LINK'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>{isVi ? 'Đang hoạt động' : 'Live'}</span>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`https://vietcharm.vn/triproom/${roomId}`}
                    className="flex-1 bg-white text-[10px] font-mono border border-[#E6E2D3] p-2.5 rounded-xl text-[#4A4A35]"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? (isVi ? 'Đã lưu' : 'Copied') : (isVi ? 'Mời' : 'Invite')}</span>
                  </button>
                </div>
              </div>

              {/* Members Live Feed List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-[#FAF6ED] pb-2">
                  <span className="text-xs font-serif font-black uppercase text-[#4A4A35] tracking-wider">
                    {isVi ? 'Danh sách thành viên' : 'Group Members'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FAF6ED] border border-[#E6E2D3] text-[#8C7A5B] px-2.5 py-0.5 rounded-full">
                    {members.length} {isVi ? 'người' : 'people'}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className="group/item flex items-start gap-3 p-3 rounded-2xl hover:bg-[#FAF6ED] transition border border-transparent hover:border-[#E6E2D3]"
                    >
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#E6E2D3] shadow-xs" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-xs font-black text-[#4A4A35] truncate">{member.name}</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              member.status === 'paid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}>
                              {member.status === 'paid' ? (isVi ? 'Đã đóng' : 'Paid') : (isVi ? 'Chưa đóng' : 'Unpaid')}
                            </span>
                            {member.id !== 'm1' && (
                              <button 
                                onClick={() => handleDeleteMember(member.id)}
                                className="opacity-0 group-hover/item:opacity-100 text-rose-500 hover:text-rose-700 transition p-0.5 cursor-pointer"
                                title="Remove member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[9px] font-mono font-bold text-slate-500">
                            {isVi ? 'Ngân sách:' : 'Budget limit:'} {member.budget.toLocaleString('vi-VN')}đ
                          </span>
                          {member.preferences.map((p, i) => (
                            <span key={i} className="text-[9px] bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                              {p}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] text-rose-700 mt-1 truncate">
                          ⚠️ {isVi ? `Tránh: ${member.dislikes}` : `Dislike: ${member.dislikes}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Friend Quick Adding */}
              <form onSubmit={handleAddMember} className="border-t border-[#E6E2D3] pt-4 space-y-3">
                <span className="text-[10px] uppercase font-black text-[#8C7A5B] block">
                  {isVi ? 'MÔ PHỎNG BẠN BÈ GIA NHẬP NHÓM' : 'SIMULATE FRIENDS JOINING LOBBY'}
                </span>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder={isVi ? 'Tên bạn thân...' : 'Friend name...'}
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    className="w-full text-xs bg-[#FAF6ED] text-[#4A4A35] border border-[#E6E2D3] p-2.5 rounded-xl outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder={isVi ? 'Gu du lịch (phẩy)...' : 'Vibes (comma separated)...'}
                      value={newFriendPref}
                      onChange={(e) => setNewFriendPref(e.target.value)}
                      className="text-xs bg-[#FAF6ED] text-[#4A4A35] border border-[#E6E2D3] p-2.5 rounded-xl outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder={isVi ? 'Cực ghét gì...' : 'Avoid/Dislike...'}
                      value={newFriendDislike}
                      onChange={(e) => setNewFriendDislike(e.target.value)}
                      className="text-xs bg-[#FAF6ED] text-[#4A4A35] border border-[#E6E2D3] p-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8C7A5B]">
                    <span>{isVi ? 'Hạn mức chi:' : 'Budget max:'} {newFriendBudget.toLocaleString('vi-VN')}đ</span>
                    <input 
                      type="range" 
                      min="3000000" 
                      max="10000000" 
                      step="500000"
                      value={newFriendBudget} 
                      onChange={(e) => setNewFriendBudget(Number(e.target.value))}
                      className="w-32 accent-[#8C7A5B]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FAF6ED] hover:bg-[#E6E2D3] border border-[#E6E2D3] text-[#8C7A5B] text-xs font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isVi ? 'Thêm thành viên ảo này' : 'Insert Simulated Friend'}</span>
                </button>
              </form>
            </div>

            {/* Split Bill Math Box */}
            <div className="border-t border-[#E6E2D3] pt-4 space-y-4">
              <div className="bg-[#FAF6ED] border border-[#E6E2D3] p-3 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black text-[#8C7A5B] uppercase block">
                    {isVi ? 'TỔNG CHUYẾN ĐI NHÓM' : 'TOTAL GROUP ESTIMATE'}
                  </span>
                  <span className="text-base font-serif font-black text-[#4A4A35]">
                    {packageTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-[#8C7A5B] uppercase block">
                    {isVi ? 'MỖI THÀNH VIÊN' : 'EACH SHARE (SPLIT)'}
                  </span>
                  <span className="text-sm font-mono font-black text-[#8C7A5B]">
                    {perPersonShare.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {unpaidCount > 0 ? (
                <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-rose-800 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 animate-pulse" />
                    <span className="text-[11px]">{isVi ? `Còn ${unpaidCount} người chưa đóng` : `${unpaidCount} co-planners unpaid`}</span>
                  </div>
                  <button
                    onClick={handleRemindAll}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer"
                  >
                    {isVi ? 'Đòi tiền' : 'Remind'}
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-black">
                  <CheckCircle className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>{isVi ? 'Tất cả đã đóng! Đã sẵn sàng xuất phát.' : 'All paid! Ready to depart.'}</span>
                </div>
              )}

              {/* Simulated pay for friends buttons */}
              <div className="space-y-1">
                {members.map(m => m.status === 'unpaid' && (
                  <button
                    key={m.id}
                    onClick={() => handleSimulatePayment(m.id)}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 text-[10px] py-1.5 rounded-lg transition border border-slate-200 cursor-pointer flex justify-between px-3 font-mono font-bold"
                  >
                    <span>{isVi ? `Xác nhận ${m.name} trả tiền` : `Confirm pay for ${m.name}`}</span>
                    <span>+{perPersonShare.toLocaleString('vi-VN')}đ &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 7 COLUMNS: THE GROUP VOTING MATRIX */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[#E6E2D3] shadow-lg flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              {/* Top Selector Panel Tabs */}
              <div className="flex border-b border-[#FAF6ED] pb-1 gap-4">
                <button
                  onClick={() => setActiveTab('invite')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === 'invite' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B] font-black' : 'text-[#4A4A35]/60 hover:text-[#8C7A5B]'
                  }`}
                >
                  🗳️ {isVi ? '1. Đóng góp ý kiến' : '1. Submit opinions'}
                </button>
                <button
                  onClick={() => setActiveTab('voting')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === 'voting' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B] font-black' : 'text-[#4A4A35]/60 hover:text-[#8C7A5B]'
                  }`}
                >
                  📊 {isVi ? '2. Bầu chọn địa điểm' : '2. Vote & Consensus'}
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    activeTab === 'checkout' ? 'text-[#8C7A5B] border-b-2 border-[#8C7A5B] font-black' : 'text-[#4A4A35]/60 hover:text-[#8C7A5B]'
                  }`}
                >
                  💳 {isVi ? '3. Hóa đơn chiết khấu' : '3. Group Checkout'}
                </button>
              </div>

              {/* TAB 1: DISCUSSION HUB */}
              {activeTab === 'invite' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/50 border border-amber-200/40 rounded-2xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-relaxed font-sans">
                      {isVi 
                        ? 'Từng thành viên khi nhấp vào link phòng sẽ điền gu nghỉ ngơi, ngân sách và các điểm đặc biệt cần tránh. Hệ thống sẽ lọc và đưa ra các đề xuất lưu trú, ăn uống, vui chơi phù hợp nhất để cả nhóm bầu chọn.'
                        : 'Every group member inputs their design style, budget, and red-flags. Our platform aggregates these vibes and lists personalized hotels, dining, and activity nodes.'}
                    </p>
                  </div>

                  {/* Collective stats info */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C7A5B]">
                      {isVi ? 'Ý KIẾN ĐANG HOẠT ĐỘNG TRONG PHÒNG' : 'COLLECTIVE GROUP INSIGHTS'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-[#FAF6ED] rounded-xl border border-[#E6E2D3] space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#8C7A5B] block">{isVi ? 'NGÂN SÁCH TRUNG BÌNH' : 'AVERAGE BUDGET TARGET'}</span>
                        <span className="text-sm font-mono font-bold">
                          {Math.round(members.reduce((acc, m) => acc + m.budget, 0) / members.length).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="p-3 bg-[#FAF6ED] rounded-xl border border-[#E6E2D3] space-y-1">
                        <span className="text-[9px] uppercase font-bold text-rose-700 block">{isVi ? 'ĐIỂM TRÁNH CHUNG (ANTI-VIBE)' : 'CONSENSUS RED FLAGS'}</span>
                        <span className="text-xs font-semibold text-rose-800">
                          {isVi ? 'Tránh mệt mỏi, đi bộ dài, khách sạn ồn' : 'No long tiring slopes, quiet hotels'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FDFCF8] rounded-2xl border border-[#E6E2D3] space-y-2">
                      <span className="text-[10px] uppercase font-black text-[#8C7A5B] tracking-wider block">
                        {isVi ? 'GU CHUNG CỦA CẢ NHÓM ĐƯỢC TỔNG HỢP' : 'SYSTEM MATCHED VIBES'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                          🌾 {isVi ? 'Thảnh thơi mộc mạc hoài cổ' : 'Rustic traditional vintage'}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                          🏊‍♀️ {isVi ? 'Khách sạn có hồ bơi view sông' : 'Riverside stay with pools'}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                          🥢 {isVi ? 'Ẩm thực di sản bản địa mộc' : 'Heritage local gastronomy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setActiveTab('voting')}
                      className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white font-serif font-bold text-xs py-3 px-6 rounded-xl transition duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isVi ? 'Tiến hành Bầu Chọn Địa Điểm' : 'Proceed to Group Voting'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VOTING BOARD */}
              {activeTab === 'voting' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#FAF6ED] pb-2">
                    <p className="text-[10px] uppercase font-black text-[#8C7A5B] tracking-wider">
                      {isVi ? 'CẢ NHÓM BẦU CHỌN CHO CÁC PHƯƠNG ÁN' : 'REAL-TIME CO-PLANNER VOTING'}
                    </p>
                    <span className="text-[9px] bg-amber-50 text-[#8C7A5B] border border-amber-200 px-2 py-0.5 rounded font-mono">
                      {isVi ? 'Chạm để bầu nhân danh Trần Tuấn' : 'Tap to vote as Tuan'}
                    </span>
                  </div>

                  {/* Voting Sections */}
                  {['hotel', 'restaurant', 'activity'].map((categoryType) => {
                    const filtered = votingItems.filter(v => v.type === categoryType);
                    const label = categoryType === 'hotel' 
                      ? (isVi ? '🏡 1. Nơi Ở / Lưu Trú' : '🏡 1. Accommodations')
                      : categoryType === 'restaurant'
                      ? (isVi ? '🥢 2. Quán Ăn / Ẩm Thực' : '🥢 2. Dining & Flavors')
                      : (isVi ? '🛶 3. Hoạt Động Trải Nghiệm' : '🛶 3. Activities');

                    return (
                      <div key={categoryType} className="space-y-3">
                        <h4 className="text-xs font-serif font-black text-[#4A4A35] uppercase tracking-wider">{label}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filtered.map((item) => {
                            const userHasVoted = item.votes.includes('m1');
                            const votesCount = item.votes.length;
                            const percent = Math.round((votesCount / members.length) * 100);
                            const isConsensus = votesCount === members.length;

                            return (
                              <div 
                                key={item.id} 
                                onClick={() => handleVote(item.id, 'm1')}
                                className={`border rounded-2xl overflow-hidden bg-[#FDFCF8] transition duration-300 flex flex-col justify-between cursor-pointer group ${
                                  userHasVoted ? 'border-[#8C7A5B] shadow-md ring-1 ring-[#8C7A5B]/30' : 'border-[#E6E2D3] hover:border-[#8C7A5B]'
                                }`}
                              >
                                <div className="relative h-28 overflow-hidden">
                                  <img src={item.image} alt={item.nameVi} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                  {isConsensus && (
                                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5 shadow">
                                      <CheckCircle className="w-2.5 h-2.5" />
                                      <span>{isVi ? 'Nhất trí 100%' : '100% Agreed'}</span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-1 left-2 bg-black/50 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                                    {item.price.toLocaleString('vi-VN')}đ{categoryType === 'hotel' ? '/đêm' : '/người'}
                                  </div>
                                </div>

                                <div className="p-3 space-y-2">
                                  <div>
                                    <span className="text-[8px] font-mono font-bold text-[#8C7A5B] block tracking-tight uppercase">
                                      {isVi ? item.locationVi : item.locationEn}
                                    </span>
                                    <h5 className="text-[11px] font-serif font-bold text-[#4A4A35] line-clamp-1 leading-snug">
                                      {isVi ? item.nameVi : item.nameEn}
                                    </h5>
                                  </div>

                                  {/* Progress bar voting */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[9px] font-semibold text-[#8C7A5B]">
                                      <span>{isVi ? 'Tiến trình nhóm:' : 'Consensus:'}</span>
                                      <span>{votesCount}/{members.length} ({percent}%)</span>
                                    </div>
                                    <div className="w-full bg-[#EAE5D5] h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full transition-all duration-500 ${
                                          isConsensus ? 'bg-emerald-600' : 'bg-[#8C7A5B]'
                                        }`} 
                                        style={{ width: `${percent}%` }} 
                                      />
                                    </div>
                                  </div>

                                  {/* Avatars who voted */}
                                  <div className="flex justify-between items-center pt-1 border-t border-[#FAF6ED]">
                                    <div className="flex -space-x-1.5 overflow-hidden">
                                      {item.votes.map((vId) => {
                                        const mb = members.find(m => m.id === vId);
                                        return mb ? (
                                          <img 
                                            key={vId} 
                                            src={mb.avatar} 
                                            alt={mb.name} 
                                            title={mb.name}
                                            className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover" 
                                          />
                                        ) : null;
                                      })}
                                    </div>
                                    
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                      userHasVoted ? 'bg-[#8C7A5B] text-white' : 'bg-[#FAF6ED] text-[#8C7A5B] border border-[#E6E2D3]'
                                    }`}>
                                      {userHasVoted ? (isVi ? '✓ Bạn đã bầu' : '✓ You voted') : (isVi ? 'Bầu chọn' : 'Vote')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-4 flex justify-between items-center border-t border-[#FAF6ED]">
                    <div className="text-xs text-[#8C7A5B]">
                      💡 {isVi ? 'Mẹo: Các lựa chọn đạt 100% đồng ý sẽ tự động tối ưu hóa đơn!' : 'Tip: 100% consensus items reduce platform surcharges!'}
                    </div>
                    <button
                      onClick={handleCheckoutGroup}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-black text-xs py-3 px-6 rounded-xl transition duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isVi ? 'Tải Lựa Chọn Đồng Thuận Lên Giỏ Vé' : 'Load Group Selections to Cart'}</span>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SPLIT BILL CHECKOUT */}
              {activeTab === 'checkout' && (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-serif font-black text-emerald-800 uppercase">
                        {isVi ? 'CHIẾT KHẤU ĐỒNG THUẬN TỰ ĐỘNG ĐÃ ÁP DỤNG!' : 'CONSENSUS DISCOUNT ACTIVATED!'}
                      </h4>
                      <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                        {isVi 
                          ? 'Dựa trên việc cả nhóm đồng thuận 100% một số địa điểm (Vườn Vy, Rừng Dừa Bảy Mẫu), VietCharm chiết khấu ngay 12% phí dịch vụ trọn gói cho nhóm bạn.'
                          : 'Due to perfect 100% consensus on multiple activities, VietCharm applied an automatic 12% discount to your collective bundle.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF6ED] border border-[#E6E2D3] rounded-2xl p-4 space-y-4">
                    <span className="text-[10px] uppercase font-black text-[#8C7A5B] tracking-wider block">
                      {isVi ? 'BẢNG CHI TIẾT THANH TOÁN THEO ĐẦU NGƯỜI' : 'DETAILED PER-HEAD LEDGER'}
                    </span>

                    <div className="space-y-2 font-mono text-[11px]">
                      {members.map(member => (
                        <div key={member.id} className="flex justify-between items-center py-2 border-b border-[#E6E2D3]/40">
                          <div className="flex items-center gap-2">
                            <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-bold text-[#4A4A35]">{member.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#8C7A5B]">{perPersonShare.toLocaleString('vi-VN')}đ</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              member.status === 'paid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {member.status === 'paid' ? (isVi ? 'ĐÃ TRẢ' : 'PAID') : (isVi ? 'CHƯA TRẢ' : 'PENDING')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between text-xs font-bold text-[#4A4A35]">
                      <span>{isVi ? 'Trưởng nhóm thanh toán trước:' : 'Leader pay-upfront total:'}</span>
                      <span className="text-[#8C7A5B] font-mono text-sm font-black">
                        {packageTotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#E6E2D3] rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-serif font-black">{isVi ? 'Trạng thái huy động quỹ:' : 'Crowdfunding progress:'}</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {members.filter(m => m.status === 'paid').length} / {members.length} {isVi ? 'đã hoàn tất' : 'completed'}
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF6ED] h-2 rounded-full overflow-hidden border border-[#E6E2D3]">
                      <div 
                        className="bg-emerald-600 h-full transition-all duration-500" 
                        style={{ width: `${(members.filter(m => m.status === 'paid').length / members.length) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={onNavigateHome}
                      className="bg-white hover:bg-[#FAF6ED] border border-[#E6E2D3] text-[#8C7A5B] text-xs font-bold py-3 px-6 rounded-xl transition cursor-pointer"
                    >
                      {isVi ? 'Quay lại Trang Chủ' : 'Back to Home'}
                    </button>
                    <button
                      onClick={() => triggerAlert(isVi ? '✓ Đã kích hoạt cổng thanh toán hóa đơn nhóm VIP!' : '✓ Redirecting to secure group payment gateway!')}
                      className="bg-[#8C7A5B] hover:bg-[#5A5A40] text-white text-xs font-serif font-bold py-3 px-6 rounded-xl transition cursor-pointer"
                    >
                      {isVi ? 'Thanh toán đặt cọc trọn gói' : 'Secure Deposit Bundle'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Expandability signature footer */}
            <div className="border-t border-[#FAF6ED] pt-3 text-[10px] text-[#8C7A5B]/80 font-sans italic text-center">
              ✦ {isVi 
                ? 'Công nghệ Trip Room của VietCharm hiện đã hỗ trợ mở rộng cho mọi vùng di sản (Bắc, Trung, Nam).' 
                : 'VietCharm Trip Room technology currently extends native multi-planner logic across all heritage regions.'}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
