import React from 'react';
import { 
  ArrowLeft, Star, MapPin, ShieldCheck, Heart, Share2, 
  Calendar, Clock, ShoppingCart, CreditCard, MessageSquare, 
  CheckCircle, Landmark, Sparkles, Navigation, Info, ChevronRight, Check
} from 'lucide-react';
import { Language, BookingCartItem, BookingSearchCriteria, ViewableItem } from '../types';
import { DateField } from '@/components/ui';

type ServiceDetailsItem = ViewableItem & {
  rating?: number;
  reviewsCount?: string;
  specs?: string;
  inclusions?: string[];
  duration?: string;
  distance?: string;
  highlights?: string[];
  history?: string;
  coordinates?: { x: number; y: number };
};

interface ServiceDetailsProps {
  language: Language;
  item: ServiceDetailsItem;
  onBack: () => void;
  onAddToCart: (item: BookingCartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  isItemInCart: (id: string) => boolean;
  bookingSearch?: BookingSearchCriteria;
}

interface UserReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const MOCK_REVIEWS_POOL: Record<string, UserReview[]> = {
  general: [
    { id: '1', author: 'Nguyễn Văn Hải', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-21', comment: 'Dịch vụ vô cùng đẳng cấp và chuyên nghiệp. Nhân viên chu đáo, nhiệt tình.' },
    { id: '2', author: 'Trần Thị Mai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-19', comment: 'Trải nghiệm tuyệt vời vượt ngoài mong đợi! Rất xứng đáng số tiền bỏ ra.' },
    { id: '3', author: 'David Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', rating: 4, date: '2026-06-15', comment: 'Excellent service and great attention to detail. Highly recommend to everyone!' }
  ]
};

export default function ServiceDetails({
  language,
  item,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  isItemInCart,
  bookingSearch,
}: ServiceDetailsProps) {
  const isVi = language === 'vi';
  const [quantity, setQuantity] = React.useState(1);
  const [successMsg, setSuccessMsg] = React.useState(false);

  // New States for Date and Package selection
  const [selectedDate, setSelectedDate] = React.useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return bookingSearch?.checkInDate || tomorrow.toISOString().split('T')[0];
  });
  const [checkInDate, setCheckInDate] = React.useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return bookingSearch?.checkInDate || tomorrow.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = React.useState(() => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return bookingSearch?.checkOutDate || dayAfterTomorrow.toISOString().split('T')[0];
  });
  const [selectedPackage, setSelectedPackage] = React.useState<'standard' | 'premium' | 'luxury'>('standard');

  // Separate quantities for Adults and Children (for activities/tours/nearby-places)
  const [adultsCount, setAdultsCount] = React.useState(() => Math.max(1, bookingSearch?.guestsCount || 1));
  const [childrenCount, setChildrenCount] = React.useState(0);
  const [roomsCount, setRoomsCount] = React.useState(() => Math.max(1, bookingSearch?.roomsCount || 1));

  React.useEffect(() => {
    if (!bookingSearch) return;
    setSelectedDate(bookingSearch.checkInDate);
    setCheckInDate(bookingSearch.checkInDate);
    setCheckOutDate(bookingSearch.checkOutDate);
    setAdultsCount(Math.max(1, bookingSearch.guestsCount));
    setRoomsCount(Math.max(1, bookingSearch.roomsCount));
  }, [
    bookingSearch?.checkInDate,
    bookingSearch?.checkOutDate,
    bookingSearch?.guestsCount,
    bookingSearch?.roomsCount,
    item.id,
  ]);

  // Review state
  const [reviews, setReviews] = React.useState<UserReview[]>(() => {
    return MOCK_REVIEWS_POOL.general;
  });
  const [reviewerName, setReviewerName] = React.useState('');
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newReview: UserReview = {
      id: `review-details-${Date.now()}`,
      author: reviewerName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment
    };

    setReviews([newReview, ...reviews]);
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
  };

  const getPackageModifier = () => {
    if (selectedPackage === 'premium') return 1.3;
    if (selectedPackage === 'luxury') return 1.6;
    return 1.0;
  };

  const packagesInfo = {
    standard: {
      name: isVi ? 'Gói Tiêu Chuẩn (Cơ bản)' : 'Standard Package',
      desc: isVi 
        ? 'Dịch vụ tham quan cơ bản đầy đủ tiện ích và bảo hiểm du lịch.'
        : 'Full standard admission/service and complimentary travel insurance.',
    },
    premium: {
      name: isVi ? 'Gói Cao Cấp (Premium VIP)' : 'Premium VIP Experience',
      desc: isVi 
        ? 'Có đưa đón riêng biệt, lối đi VIP không chờ đợi, tặng voucher ẩm thực 200k.'
        : 'Private pickup, VIP fast-track entry, 200k VND dining voucher included.',
    },
    luxury: {
      name: isVi ? 'Gói Sang Trọng (All-Inclusive)' : 'Luxury All-Inclusive',
      desc: isVi 
        ? 'Dịch vụ thượng lưu trọn gói: HDV riêng, ăn ngự thiện cung đình, tặng đèn lồng lụa cao cấp.'
        : 'Royal package: Private local guide, luxury traditional dinner, and handmade silk gift.',
    }
  };

  const calculatedPricePerUnit = Math.round(item.price * getPackageModifier());
  const childPricePerUnit = Math.round(item.price * getPackageModifier() * 0.7);
  
  const isActivityLike = item.type === 'activity' || item.type === 'tour';
  const isBookable = item.price > 0 && (item.type === 'hotel' || item.type === 'vehicle' || isActivityLike);
  
  const getDaysDiff = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const hotelNights = getDaysDiff();
  const effectiveQuantity = item.type === 'hotel'
    ? hotelNights * roomsCount
    : item.type === 'vehicle'
      ? hotelNights
      : quantity;

  const finalTotalPrice = isActivityLike 
    ? Math.round(calculatedPricePerUnit * adultsCount + childPricePerUnit * childrenCount)
    : Math.round(calculatedPricePerUnit * effectiveQuantity);

  const buildSelection = () => {
    const packageName = packagesInfo[selectedPackage].name;
    const dateStr = (item.type === 'hotel' || item.type === 'vehicle')
      ? `${checkInDate} -> ${checkOutDate}`
      : selectedDate;
    
    let detailsStr = '';
    if (isActivityLike) {
      detailsStr = isVi 
        ? `Gói: ${packageName} | Ngày: ${dateStr} | Vé: ${adultsCount} Người lớn, ${childrenCount} Trẻ em`
        : `Package: ${packageName} | Date: ${dateStr} | Tickets: ${adultsCount} Adults, ${childrenCount} Children`;
    } else {
      detailsStr = isVi
        ? `Gói: ${packageName} | Ngày: ${dateStr} | ${item.type === 'hotel' ? `Phòng: ${roomsCount} | Đêm: ${hotelNights}` : `Số ngày thuê: ${hotelNights}`}`
        : `Package: ${packageName} | Date: ${dateStr} | ${item.type === 'hotel' ? `Rooms: ${roomsCount} | Nights: ${hotelNights}` : `Rental days: ${hotelNights}`}`;
    }

    const cartType: BookingCartItem['type'] =
      item.type === 'hotel' || item.type === 'vehicle' ? item.type : 'activity';

    const cartKey = [
      item.id,
      selectedPackage,
      dateStr,
      isActivityLike ? `adults-${adultsCount}` : `qty-${effectiveQuantity}`,
      isActivityLike ? `children-${childrenCount}` : item.type === 'hotel' ? `rooms-${roomsCount}` : 'single-vehicle',
    ].join('__');

    return { cartKey, cartType, detailsStr };
  };

  const { cartKey: currentCartKey, cartType: currentCartType, detailsStr: currentDetails } = buildSelection();
  const inCart = isItemInCart(currentCartKey);

  const handleAdd = () => {
    if (!isBookable) return;

    onAddToCart({
      cartKey: currentCartKey,
      id: item.id,
      type: currentCartType,
      name: item.type === 'tour' ? `[Combo] ${item.name}` : item.name,
      price: finalTotalPrice,
      quantity: 1, // Store as a unified single package item with computed total price
      image: item.image,
      details: currentDetails
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const generatedHighlights = item.highlights || [
    isVi ? 'Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng 24/7 phục vụ quý khách.' : '24/7 Professional support staff ready to assist you.',
    isVi ? 'Bao gồm bảo hiểm lữ hành toàn diện theo chuẩn quốc tế.' : 'Comprehensive international standard travel insurance included.',
    isVi ? 'Hỗ trợ thay đổi lịch trình hoặc hủy dịch vụ miễn phí trước 24 giờ.' : 'Free rescheduling or cancellation up to 24 hours in advance.',
    isVi ? 'Cam kết chất lượng dịch vụ chính hãng VietCharm uy tín hàng đầu.' : 'VietCharm certified genuine high-quality service guaranteed.'
  ];

  return (
    <div id="service-details-root" className="w-full bg-natural-cream text-natural-text min-h-screen py-10 px-4 md:px-8">
      {/* Back & Share Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-natural-border rounded-full text-xs font-bold text-stone-600 hover:text-natural-accent hover:border-natural-accent transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Quay lại danh sách' : 'Back to Listings'}</span>
        </button>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border border-natural-border rounded-full hover:bg-stone-50 transition cursor-pointer">
            <Heart className="w-4 h-4 text-natural-accent" />
          </button>
          <button className="p-2.5 bg-white border border-natural-border rounded-full hover:bg-stone-50 transition cursor-pointer">
            <Share2 className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Showcase Content & Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Image Banner */}
          <div className="relative h-96 bg-stone-900 rounded-3xl overflow-hidden shadow-md">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            
            <div className="absolute top-4 left-4 bg-natural-accent text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
              {item.type === 'hotel' && (isVi ? 'Khách sạn / Resort' : 'Hotel / Resort')}
              {item.type === 'activity' && (isVi ? 'Hoạt động trải nghiệm' : 'Excursion Activity')}
              {item.type === 'vehicle' && (isVi ? 'Phương tiện di chuyển' : 'Transport Rental')}
              {item.type === 'tour' && (isVi ? 'Combo Tour Trọn Gói' : 'Heritage Tour Combo')}
              {item.type === 'nearby-place' && (isVi ? 'Địa điểm tham quan lân cận' : 'Nearby Landmark')}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h1 className="text-2xl md:text-3xl font-serif font-black leading-tight uppercase">
                {item.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-amber-200">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span className="text-white font-bold">{item.rating || 4.9}</span>
                  <span className="opacity-75">({item.reviewsCount || '1.2k'} {isVi ? 'đánh giá' : 'reviews'})</span>
                </span>
                {item.distance && (
                  <span className="flex items-center gap-1 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>Cách trung tâm {item.distance}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Core Information Section */}
          <div className="bg-white border border-natural-border rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold uppercase text-stone-800 border-b border-natural-border pb-2">
                {isVi ? 'Mô tả chi tiết' : 'Detailed Description'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed text-justify">
                {item.description}
              </p>
            </div>

            {/* Specifications / Inclusions */}
            {item.specs && (
              <div className="space-y-3 bg-natural-cream border border-natural-border p-4 rounded-2xl">
                <h4 className="text-xs font-bold uppercase text-stone-700">
                  {isVi ? 'Thông số kỹ thuật & Tiện nghi' : 'Specs & Facilities'}
                </h4>
                <p className="text-xs text-natural-accent font-mono font-medium">
                  ⚡ {item.specs}
                </p>
              </div>
            )}

            {item.inclusions && item.inclusions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-800">
                  {isVi ? 'Dịch vụ bao gồm trong gói' : 'What is included in this pack'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.inclusions.map((inc, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            <div className="space-y-3">
              <h3 className="text-base font-bold uppercase text-stone-800">
                {isVi ? 'Điểm nổi bật của dịch vụ' : 'Key Highlights'}
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {generatedHighlights.map((hl, index) => (
                  <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-natural-gold mt-1.5 shrink-0"></span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map representation for locations */}
            {item.coordinates && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase text-stone-800 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-red-500" />
                  {isVi ? 'Vị trí bản đồ hành trình' : 'Route Sitemap Location'}
                </h4>
                <div className="relative h-48 bg-emerald-50 border border-emerald-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d={`M 150 100 L ${item.coordinates.x} ${item.coordinates.y}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5,4" className="animate-pulse text-natural-accent" />
                  </svg>
                  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '150px', top: '100px' }}>
                    <div className="w-3.5 h-3.5 bg-amber-600 border border-white rounded-full"></div>
                    <span className="bg-amber-950 text-white text-[7px] px-1 py-0.5 rounded uppercase font-black tracking-widest mt-1">🏨 VietCharm HQ</span>
                  </div>
                  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${item.coordinates.x}px`, top: `${item.coordinates.y}px` }}>
                    <MapPin className="w-5 h-5 text-red-500 animate-bounce" />
                    <span className="bg-red-950 text-white text-[7px] px-1 py-0.5 rounded font-bold mt-0.5">{item.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews List & Forms Section (Requirement: "Xem đánh giá") */}
          <div className="bg-white border border-natural-border rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-base font-bold uppercase text-stone-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-natural-accent" />
              {isVi ? 'Nhận xét & Đánh giá từ khách hàng' : 'Customer Reviews'}
            </h3>

            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-natural-cream border border-stone-100 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <img src={r.avatar} alt={r.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-stone-700">{r.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <span className="text-amber-500">{'★'.repeat(r.rating)}</span>
                      <span>• {r.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 italic leading-relaxed pl-8">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Create review form */}
            <form onSubmit={handleAddReview} className="bg-natural-cream border border-natural-border p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                ✍️ {isVi ? 'Viết đánh giá của riêng bạn' : 'Leave your feedback'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  required
                  placeholder={isVi ? 'Tên của bạn...' : 'Your name...'}
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="bg-white border border-natural-border text-xs px-3 py-2.5 rounded-xl focus:border-natural-accent focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-white border border-natural-border px-3 py-2.5 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">{isVi ? 'Điểm:' : 'Stars:'}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setReviewRating(num)}
                        className="text-xs focus:outline-none"
                      >
                        <Star className={`w-3.5 h-3.5 ${num <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea 
                required
                rows={2}
                placeholder={isVi ? 'Chia sẻ trải nghiệm khách quan của bạn về dịch vụ...' : 'Write an honest feedback on how we can improve...'}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-natural-border text-xs p-3 rounded-xl focus:border-natural-accent focus:outline-none resize-none leading-relaxed"
              />

              <button
                type="submit"
                className="w-full bg-natural-accent hover:bg-natural-olive text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer"
              >
                {isVi ? 'Đăng đánh giá' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Pricing, Checkout & Reservation Hub (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white border border-natural-border rounded-3xl p-6 md:p-8 shadow-lg space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-natural-accent block">
                {isVi ? 'GIÁ NIÊM YẾT CHÍNH HÃNG' : 'GENUINE RETAIL PRICE'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-black text-2xl md:text-3xl text-natural-accent">
                  {item.price > 0 ? `${item.price.toLocaleString('vi-VN')}đ` : (isVi ? 'Miễn phí' : 'Free Entry')}
                </span>
                {item.price > 0 && (
                  <span className="text-xs text-stone-500">
                    /{item.type === 'hotel' ? (isVi ? 'đêm' : 'night') : (item.type === 'vehicle' ? (isVi ? 'ngày' : 'day') : (isVi ? 'khách' : 'guest'))}
                  </span>
                )}
              </div>
            </div>

            {/* Inclusions features list */}
            <div className="bg-natural-cream border border-stone-150 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isVi ? 'Cam kết độc quyền VietCharm' : 'VietCharm Exclusives'}</span>
              </div>
              <div className="space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isVi ? 'Không phát sinh phụ phí ẩn' : 'No hidden fees or taxes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isVi ? 'Xác nhận hóa đơn đỏ tức thì' : 'Instant red invoice & booking code'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isVi ? 'Tích lũy 5% điểm thưởng thành viên' : 'Accumulate 5% member points'}</span>
                </div>
              </div>
            </div>

            {/* Date & Package selection section (Requirement: "Vui lòng chọn ngày & gói dịch vụ") */}
            {isBookable ? (
            <div className="space-y-4 border-t border-stone-150 pt-4">
              {/* Date Selector */}
              {(item.type === 'hotel' || item.type === 'vehicle') ? (
                <div className="grid grid-cols-2 gap-3 bg-natural-cream border border-natural-border rounded-3xl p-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-natural-accent" />
                      <span>{item.type === 'hotel' ? (isVi ? 'Ngày Check-in:' : 'Check-in Date:') : (isVi ? 'Ngày nhận xe:' : 'Pickup Date:')}</span>
                    </label>
                    <DateField
                      value={checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      isVi={isVi}
                      showIcon={false}
                      onChange={(newCheckIn) => {
                        setCheckInDate(newCheckIn);
                        // Ensure check-out is at least the day after check-in
                        const nextDay = new Date(newCheckIn);
                        nextDay.setDate(nextDay.getDate() + 1);
                        const nextDayStr = nextDay.toISOString().split('T')[0];
                        if (checkOutDate <= newCheckIn) {
                          setCheckOutDate(nextDayStr);
                        }
                      }}
                      className="flex w-full items-center bg-white border border-natural-border rounded-xl p-2.5 text-xs font-bold text-stone-700 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-natural-accent" />
                      <span>{item.type === 'hotel' ? (isVi ? 'Ngày Check-out:' : 'Check-out Date:') : (isVi ? 'Ngày trả xe:' : 'Return Date:')}</span>
                    </label>
                    <DateField
                      value={checkOutDate}
                      align="right"
                      min={checkInDate ? (() => {
                        const nextDay = new Date(checkInDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        return nextDay.toISOString().split('T')[0];
                      })() : new Date().toISOString().split('T')[0]}
                      isVi={isVi}
                      showIcon={false}
                      onChange={(value) => {
                        if (value > checkInDate) setCheckOutDate(value);
                      }}
                      className="flex w-full items-center bg-white border border-natural-border rounded-xl p-2.5 text-xs font-bold text-stone-700 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-stone-500 block uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-natural-accent" />
                    <span>{isVi ? 'Vui lòng chọn ngày khởi hành:' : 'Please Select Departure Date:'}</span>
                  </label>
                  <DateField
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    isVi={isVi}
                    showIcon={false}
                    onChange={setSelectedDate}
                    className="flex w-full items-center bg-natural-cream border border-natural-border rounded-2xl p-3 text-xs font-bold text-stone-700 cursor-pointer"
                  />
                </div>
              )}

              {/* Package Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-stone-500 block uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-natural-accent" />
                  <span>{isVi ? 'Vui lòng chọn gói dịch vụ:' : 'Please Select Service Package:'}</span>
                </label>
                <div className="space-y-2">
                  {(Object.keys(packagesInfo) as Array<keyof typeof packagesInfo>).map((pkgKey) => {
                    const info = packagesInfo[pkgKey];
                    const isActive = selectedPackage === pkgKey;
                    return (
                      <button
                        type="button"
                        key={pkgKey}
                        onClick={() => setSelectedPackage(pkgKey)}
                        className={`w-full text-left p-3 rounded-2xl border transition flex flex-col gap-1 ${
                          isActive 
                            ? 'bg-natural-accent/5 border-natural-accent shadow-xs' 
                            : 'bg-white border-stone-200 hover:border-natural-accent/50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-xs font-bold ${isActive ? 'text-natural-accent' : 'text-stone-800'}`}>
                            {info.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-stone-500">
                            {pkgKey === 'standard' ? '100%' : pkgKey === 'premium' ? '+30%' : '+60%'}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-normal">
                          {info.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-natural-border bg-natural-cream p-4 text-xs leading-relaxed text-stone-600">
                {isVi
                  ? 'Đây là địa điểm tham khảo miễn phí, không cần thêm vào giỏ hay thanh toán. Bạn có thể lưu yêu thích hoặc quay lại để xem dịch vụ đặt chỗ.'
                  : 'This is a free reference place, so it does not need cart or checkout. Save it or go back to browse bookable services.'}
              </div>
            )}

            {/* Ticket split (Adult vs Child) or Standard quantity selector (Requirement: "vé người lớn và vé trẻ em") */}
            {item.price > 0 && (
              isActivityLike ? (
                <div className="space-y-4 border-t border-dashed border-natural-border pt-4">
                  {/* Adults Ticket */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-700 block">{isVi ? 'Vé Người Lớn' : 'Adult Ticket'}</span>
                      <span className="text-[10px] font-mono text-natural-accent block">{calculatedPricePerUnit.toLocaleString('vi-VN')}đ/{isVi ? 'vé' : 'ticket'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-natural-cream border border-natural-border rounded-xl p-1.5 w-max">
                      <button 
                        type="button"
                        onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-black text-stone-800">
                        {adultsCount}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setAdultsCount(adultsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children Ticket */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-700 block">{isVi ? 'Vé Trẻ Em' : 'Child Ticket'}</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase px-1 py-0.5 rounded leading-none">{isVi ? '-30% Giảm' : '30% Off'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-natural-accent block">{childPricePerUnit.toLocaleString('vi-VN')}đ/{isVi ? 'vé' : 'ticket'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-natural-cream border border-natural-border rounded-xl p-1.5 w-max">
                      <button 
                        type="button"
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-black text-stone-800">
                        {childrenCount}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Hotel or Vehicle */
                (item.type === 'hotel' || item.type === 'vehicle') ? (
                  <div className="space-y-2 border-t border-dashed border-natural-border pt-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                      {item.type === 'hotel' 
                        ? (isVi ? 'Thời gian & số phòng:' : 'Stay duration & rooms:') 
                        : (isVi ? 'Số lượng ngày thuê xe:' : 'Number of rental days:')}
                    </span>
                    <div className="bg-natural-cream border border-natural-border rounded-2xl px-4 py-2 text-sm font-black text-natural-accent">
                      {item.type === 'hotel'
                        ? `${hotelNights} ${isVi ? 'đêm' : 'nights'} · ${roomsCount} ${isVi ? 'phòng' : 'rooms'}`
                        : `${hotelNights} ${isVi ? 'ngày' : 'days'}`}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 border-t border-dashed border-natural-border pt-4">
                    <label className="text-xs font-bold text-stone-600 block uppercase tracking-wider">
                      {isVi ? 'Số lượng ngày thuê xe:' : 'Number of rental days:'}
                    </label>
                    <div className="flex items-center gap-2 bg-natural-cream border border-natural-border rounded-xl p-2 w-max">
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-xs font-mono font-black text-stone-800">
                        {quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-natural-border flex items-center justify-center text-xs font-black text-stone-500 hover:text-natural-accent hover:border-natural-accent transition select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )
            )}

            {/* Price Estimator subtotal */}
            {item.price > 0 && (
              <div className="border-t border-b border-dashed border-natural-border py-4 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-600 uppercase">{isVi ? 'Tổng tiền dự tính' : 'Estimated Subtotal'}</span>
                <span className="font-mono font-black text-xl text-natural-accent">
                  {finalTotalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}

            {/* CTA action cluster */}
            <div className="space-y-3">
              {isBookable ? (
                <>
                  {inCart ? (
                    <button
                      onClick={() => onRemoveFromCart(currentCartKey)}
                      className="w-full bg-natural-cream hover:bg-stone-100 text-natural-text py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition border border-natural-border cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{isVi ? 'Đã thêm lựa chọn này - Hủy' : 'This selection is in cart - Remove'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className="w-full bg-natural-accent hover:bg-natural-olive text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isVi ? 'Thêm lựa chọn vào giỏ' : 'Add Selection to Cart'}</span>
                    </button>
                  )}

                  {successMsg && (
                    <div className="text-center py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl animate-fade-in">
                      ✓ {isVi ? 'Đã thêm lựa chọn vào giỏ hàng!' : 'Selection added to cart!'}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!inCart) {
                        handleAdd();
                      }
                      onCheckout();
                    }}
                    className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-text py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isVi ? 'Thanh toán ngay' : 'Checkout & Pay Now'}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full bg-natural-accent hover:bg-natural-olive text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-md cursor-pointer"
                >
                  {isVi ? 'Xem dịch vụ có thể đặt' : 'Browse Bookable Services'}
                </button>
              )}
            </div>
          </div>

          {/* Guidelines info badge */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-natural-accent shrink-0" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-natural-accent uppercase block">
                {isVi ? 'Chính sách đặt chỗ an toàn' : 'Secure Booking Policy'}
              </span>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                {isVi 
                  ? 'VietCharm liên kết trực tiếp với các hãng hàng không, resort chuẩn 5 sao và đội ngũ kiểm duyệt chất lượng cao để đảm bảo mọi chuyến đi diễn ra an toàn nhất.'
                  : 'We work directly with luxury resorts, premium local guides, and secure transport carriers to provide seamless experiences.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
