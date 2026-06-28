import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  MapPin, 
  Shirt, 
  Gift, 
  Eye, 
  CheckCircle, 
  Plane, 
  Calendar, 
  Timer,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { BookingCartItem } from '../types';

interface MysteryDestination {
  regionVi: string;
  regionEn: string;
  airportCode: string;
  hotelVi: string;
  hotelEn: string;
  packingVi: string;
  packingEn: string;
  itineraryVi: string[];
  itineraryEn: string[];
}

interface BlindTravelProps {
  language: 'vi' | 'en';
  onAddComboToCart: (items: BookingCartItem[]) => void;
  onNavigateHome: () => void;
}

export default function BlindTravel({ language, onAddComboToCart, onNavigateHome }: BlindTravelProps) {
  const isVi = language === 'vi';

  // State configurations
  const [budget, setBudget] = useState(3800000);
  const [days, setDays] = useState(3);
  const [departureDate, setDepartureDate] = useState('2026-07-10');
  const [departureTime, setDepartureTime] = useState('Sáng Sớm (05:00 - 08:00)');
  const [vibe, setVibe] = useState('chill');
  const [dislikes, setDislikes] = useState('climbing');

  // Animation & simulation states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [revealStage, setRevealStage] = useState<'idle' | 'loading' | 'sealed-box' | 'opened-gift'>('idle');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Surprise outcome variables
  const [mysteryDest, setMysteryDest] = useState<MysteryDestination | null>(null);

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleRunMysteryAI = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRevealStage('loading');

    const steps = isVi 
      ? [
          '🔮 Phân tích tâm lý & gu du lịch thế hệ mới...',
          '✈️ Đang thương lượng với các hãng hàng không chặng bay vàng...',
          '🏨 Gửi mã đặt chỗ kín tới hệ thống Resort Di sản 5 sao đối tác...',
          '🎁 Đóng gói phong thư bất ngờ chứa mã đặt chỗ độc bản...'
        ]
      : [
          '🔮 Analyzing psychological desires & generational taste...',
          '✈️ Sourcing exclusive charter flight corridors...',
          '🏨 Securing hidden inventory at boutique heritage villas...',
          '🎁 Packing your mystery oracle card in the lockbox...'
        ];

    let currentStepIdx = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
      }
    }, 850);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);

      // Program the custom surprise content based on inputs
      const possibleDestinations: MysteryDestination[] = [
        {
          regionVi: 'Phố Cổ Hội An & Đầm nước Rừng dừa dật',
          regionEn: 'Ancient Town Hoi An & Secret Coconut Marshes',
          airportCode: 'DAD (Sân bay Đà Nẵng)',
          hotelVi: 'Resort boutique Di sản 5 sao biệt lập bên sông Thu Bồn',
          hotelEn: 'Secluded 5-star Heritage Boutique Riverside Resort',
          packingVi: 'Chuẩn bị váy áo lụa tơ tằm bồng bềnh, dép xỏ ngón mộc, đồ bơi rực rỡ và máy ảnh lấy ngay. VietCharm tặng kèm một nón lá cao cấp thêu tên bạn đặt sẵn tại sảnh.',
          packingEn: 'Pack flowy silk dresses, rustic slide sandals, bright swimsuits, and an instant camera. A custom-embroidered conical hat will be waiting at the reception.',
          itineraryVi: [
            'Ngày 1: Xe riêng đón sân bay & Thả hoa đăng cầu bình an sông Hoài dưới ngàn đèn lồng.',
            'Ngày 2: Sáng sớm chèo thuyền thúng len lỏi rừng dừa nước, chiều học nấu mâm cơm di sản tại vườn rau hữu cơ.',
            'Ngày 3: Thư giãn trị liệu thảo mộc truyền thống, ăn trưa ẩm thực Cao Lầu trứ danh & Tiễn bay.'
          ],
          itineraryEn: [
            'Day 1: Private airport transfer & Lantern-releasing boat trip on Hoai River beneath thousands of silk lanterns.',
            'Day 2: Sunrise spinning basket boat ride through coconut forests; afternoon heritage cooking class in an organic farm.',
            'Day 3: Signature herbal wellness spa session, farewell lunch featuring local Cao Lau noodles, and private airport drop-off.'
          ]
        },
        {
          regionVi: 'Biển xanh Quy Nhơn & Tháp Chăm Di sản ngàn năm',
          regionEn: 'Emerald Quy Nhon Beach & Ancient Thousand-Year Cham Towers',
          airportCode: 'UIH (Sân bay Phù Cát)',
          hotelVi: 'Biệt thự hướng biển vách đá hoang sơ Kỳ Co',
          hotelEn: 'Private Cliffside Oceanfront Villa in Ky Co',
          packingVi: 'Chuẩn bị quần áo linen thoáng mát, mũ cói rộng vành, kem chống nắng thân thiện rạn san hô, kính râm sành điệu. Gợi ý mang thêm trang phục màu trắng/be cổ điển để check-in Tháp Bánh Ít.',
          packingEn: 'Bring breathable linen outfits, wide-brim straw hats, reef-safe sunscreen, and retro sunglasses. We suggest classic white or beige attire for the Banh It Cham towers.',
          itineraryVi: [
            'Ngày 1: Đón rước về biệt thự vách đá, tối nghe nhạc jazz mộc mạc bên sóng biển vỗ rì rào.',
            'Ngày 2: Cano riêng đi đảo Kỳ Co lặn ngắm san hô, chiều viếng quần thể Tháp Chăm linh thiêng rực nắng vàng.',
            'Ngày 3: Đón bình minh tuyệt đỉnh Eo Gió, trưa thưởng thức lẩu cua huỳnh đế di sản & Tiễn sân bay.'
          ],
          itineraryEn: [
            'Day 1: Private ride to the cliffside villa, cozy candlelight evening listening to beachside jazz acoustic rhythms.',
            'Day 2: Private boat trip to Ky Co marine sanctuary; afternoon sun-drenched exploration of sacred Cham towers.',
            'Day 3: Magical sunrise viewing at Eo Gio bay, signature local Curlew Crab hotpot feast, and airport transfer.'
          ]
        }
      ];

      const selected = (vibe === 'sea' || vibe === 'glamping' || vibe === 'adventure' || vibe === 'fisherman') ? possibleDestinations[1] : possibleDestinations[0];
      setMysteryDest(selected);
      setRevealStage('sealed-box');
      triggerAlert(isVi ? '✓ Đã tạo thành công Lá Số Hành Trình Ẩn Số!' : '✓ Mystery Journey Oracle compiled successfully!');
    }, 3500);
  };

  const handleOpenGiftBox = () => {
    setRevealStage('opened-gift');
    triggerAlert(isVi ? '🎁 Mở tung chiếc hộp quà - Hành trình ẩn số hiển lộ!' : '🎁 Surprise box unlocked! Unveiling your destination!');
  };

  const handleBookMysteryPackage = () => {
    if (!mysteryDest) return;

    const vibeLabel = {
      chill: isVi ? 'Thảnh thơi & Chill di sản' : 'Chill & Heritage Oasis',
      sea: isVi ? 'Biển xanh hoang sơ' : 'Wild Beach & Secret Shorelines',
      culture: isVi ? 'Văn hóa cổ truyền' : 'Heritage & Artisanal Villages',
      adventure: isVi ? 'Phiêu lưu mạo hiểm' : 'Adventure, Hiking & Exploration',
      foodie: isVi ? 'Ẩm thực bản địa' : 'Authentic Street Food Safaris',
      healing: isVi ? 'Chữa lành & Thiền' : 'Mindfulness & Yoga',
      photography: isVi ? 'Chụp ảnh sống ảo' : 'Insta-Worthy Architecture Hunt',
      nature: isVi ? 'Sinh thái xanh' : 'Eco-Green Cycle & Countryside',
      glamping: isVi ? 'Glamping cắm trại' : 'Starlit Luxury Glamping',
      luxury: isVi ? 'Du thuyền sang chảnh' : 'Bespoke Yacht Cruise',
      art: isVi ? 'Lịch sử kiến trúc' : 'Classic Museum & Art Walk',
      cozy: isVi ? 'Cà phê & Sách cổ' : 'Hidden Coffee Shops',
      fisherman: isVi ? 'Làm ngư dân bản địa' : 'Local Fishing Experience',
      heritage: isVi ? 'Mặc Việt phục cổ' : 'Traditional Attire Dress-up',
      nightlife: isVi ? 'Chợ đêm đèn lồng' : 'Lantern Street & Night Markets'
    }[vibe] || vibe;

    const priceTag = budget;
    const item: BookingCartItem = {
      id: `blind-travel-mystery-${Date.now()}`,
      type: 'activity',
      name: isVi ? `[Hành trình Ẩn Số] Vé máy bay khứ hồi & Resort bí mật` : `[Mystery Escape] Roundtrip Flight & 5-Star Secret Stay`,
      price: priceTag,
      quantity: 1,
      image: (vibe === 'sea' || vibe === 'glamping' || vibe === 'adventure' || vibe === 'fisherman')
        ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'
        : 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=500&q=80',
      details: isVi 
        ? `Thời gian: ${days} ngày. Khởi hành ngày ${departureDate} (${departureTime}). Gu: ${vibeLabel}. Chi tiết điểm đến được niêm phong cho đến khi ra sân bay.`
        : `Duration: ${days} Days. Depart on ${departureDate} (${departureTime}). Vibe: ${vibeLabel}. Exact itinerary sealed until airport arrival.`
    };

    onAddComboToCart([item]);
    triggerAlert(isVi ? '✓ Đã đóng gói chuyến đi bất ngờ vào giỏ hành lý!' : '✓ Loaded surprise getaway pack into your travel bundle!');
  };

  return (
    <div className="w-full bg-natural-sand text-natural-text py-12 px-4 md:px-8 border-y border-natural-border relative overflow-hidden">
      
      {/* Notifications */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-natural-text text-natural-sand px-6 py-3 rounded-full text-xs font-bold shadow-2xl z-50 border border-natural-border/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-natural-gold" />
            <span>{alertMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-natural-border-light text-natural-accent text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{isVi ? 'HÀNH TRÌNH TRẢI NGHIỆM ẨN SỐ' : 'BLIND TRAVEL ESCAPADE'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-natural-text">
            {isVi ? 'Hành Trình Ẩn Số – Nhận Quà Từ Tương Lai' : 'Blind Travel – Unbox Your Surprise Escape'}
          </h2>
          <p className="text-xs md:text-sm text-natural-text/80 leading-relaxed font-sans max-w-2xl mx-auto">
            {isVi 
              ? 'Thay vì tốn hàng chục tiếng so sánh giá phòng và đau đầu lên lịch trình, hãy nhập ngân sách, số ngày nghỉ và gu tận hưởng của bạn. Trí tuệ nhân tạo của VietCharm sẽ tự động tối ưu hóa chuyến bay khứ hồi cùng phòng Resort Heritage ẩn danh.'
              : 'Appealing to adventure-seekers and busy people tired of planning. Input your budget, length of stay, and preference guidelines. Our AI reserves optimized roundtrip flights and premium heritage secret stays.'}
          </p>
        </div>

        {/* Outer Layout Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 5 COLUMNS: USER REQUEST SETUP */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-natural-border shadow-lg flex flex-col justify-between">
            <form onSubmit={handleRunMysteryAI} className="space-y-5">
              <h3 className="text-xs font-serif font-black uppercase text-natural-text tracking-widest border-b border-natural-sand pb-2">
                {isVi ? 'Thiết Lập Chuyến Đi Bất Ngờ' : 'Configure Your Surprises'}
              </h3>

              {/* Slider Budget */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-natural-text">
                  <span>{isVi ? 'Ngân Sách Tối Đa (VNĐ)' : 'Max Budget Cap'}</span>
                  <span className="text-natural-accent font-mono font-black">{budget.toLocaleString('vi-VN')}đ</span>
                </div>
                <input 
                  type="range"
                  min="2500000"
                  max="10000000"
                  step="500000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-natural-accent h-1.5 bg-natural-sand rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-natural-accent">
                  <span>2.5 TR</span>
                  <span>6.2 TR</span>
                  <span>10.0 TR</span>
                </div>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Duration */}
                <div>
                  <label className="block text-[11px] font-bold text-natural-accent uppercase mb-1">{isVi ? 'Số ngày nghỉ' : 'Duration'}</label>
                  <select 
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full text-xs font-bold bg-natural-sand text-natural-text border border-natural-border rounded-xl p-2.5 outline-none"
                  >
                    <option value="1">1 {isVi ? 'ngày tinh gọn' : 'Day (Daytrip)'}</option>
                    <option value="2">2 {isVi ? 'ngày 1 đêm' : 'Days 1 Night'}</option>
                    <option value="3">3 {isVi ? 'ngày 2 đêm' : 'Days 2 Nights'}</option>
                    <option value="4">4 {isVi ? 'ngày 3 đêm' : 'Days 3 Nights'}</option>
                    <option value="5">5 {isVi ? 'ngày 4 đêm' : 'Days 4 Nights'}</option>
                    <option value="6">6 {isVi ? 'ngày 5 đêm' : 'Days 5 Nights'}</option>
                    <option value="7">7 {isVi ? 'ngày 6 đêm' : 'Days 6 Nights'}</option>
                    <option value="8">8 {isVi ? 'ngày 7 đêm' : 'Days 7 Nights'}</option>
                    <option value="9">9 {isVi ? 'ngày 8 đêm' : 'Days 8 Nights'}</option>
                    <option value="10">10 {isVi ? 'ngày 9 đêm' : 'Days 9 Nights'}</option>
                    <option value="11">11 {isVi ? 'ngày 10 đêm' : 'Days 10 Nights'}</option>
                    <option value="12">12 {isVi ? 'ngày 11 đêm' : 'Days 11 Nights'}</option>
                    <option value="13">13 {isVi ? 'ngày 12 đêm' : 'Days 12 Nights'}</option>
                    <option value="14">14 {isVi ? 'ngày 13 đêm' : 'Days 13 Nights'}</option>
                    <option value="15">15 {isVi ? 'ngày trở lên' : 'Days or more'}</option>
                  </select>
                </div>

                {/* Departure date */}
                <div>
                  <label className="block text-[11px] font-bold text-natural-accent uppercase mb-1">{isVi ? 'Ngày đi dự kiến' : 'Target Date'}</label>
                  <input 
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full text-xs font-bold bg-natural-sand text-natural-text border border-natural-border rounded-xl p-2.5 focus:border-natural-accent outline-none"
                    required
                  />
                </div>
              </div>

              {/* Departure window preference */}
              <div>
                <label className="block text-[11px] font-bold text-natural-accent uppercase mb-1">{isVi ? 'Thời gian cất cánh ưa thích' : 'Departure window'}</label>
                <select 
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full text-xs font-bold bg-natural-sand text-natural-text border border-natural-border rounded-xl p-2.5 outline-none"
                >
                  <option value="Sáng Sớm (05:00 - 08:00)">🌅 {isVi ? 'Sáng Sớm (05:00 - 08:00) - Ngắm bình minh' : 'Early Morning (05:00 - 08:00)'}</option>
                  <option value="Sáng (08:00 - 11:00)">☀️ {isVi ? 'Sáng (08:00 - 11:00) - Giờ đẹp thong thả' : 'Morning (08:00 - 11:00)'}</option>
                  <option value="Trưa (11:00 - 13:00)">🕛 {isVi ? 'Trưa (11:00 - 13:00) - Tiện ăn trưa' : 'Noon (11:00 - 13:00)'}</option>
                  <option value="Đầu Chiều (13:00 - 15:00)">☕ {isVi ? 'Đầu Chiều (13:00 - 15:00) - Check-in vừa kịp' : 'Early Afternoon (13:00 - 15:00)'}</option>
                  <option value="Chiều Muộn (15:00 - 17:00)">🌇 {isVi ? 'Chiều Muộn (15:00 - 17:00) - Tránh nắng' : 'Late Afternoon (15:00 - 17:00)'}</option>
                  <option value="Hoàng Hôn (17:00 - 19:00)">🌆 {isVi ? 'Hoàng Hôn (17:00 - 19:00) - Ngắm hoàng hôn' : 'Sunset Hours (17:00 - 19:00)'}</option>
                  <option value="Tối (19:00 - 22:00)">🌙 {isVi ? 'Tối (19:00 - 22:00) - Sau giờ tan làm' : 'Evening (19:00 - 22:00)'}</option>
                  <option value="Đêm Khuya (22:00 - 01:00)">🦉 {isVi ? 'Đêm Khuya (22:00 - 01:00) - Bay tiết kiệm' : 'Late Night (22:00 - 01:00)'}</option>
                  <option value="Bay Đêm (01:00 - 05:00)">✈️ {isVi ? 'Bay Đêm/Red-eye (01:00 - 05:00) - Ngủ trên máy bay' : 'Red-eye Flight (01:00 - 05:00)'}</option>
                  <option value="Chuyến bay sớm nhất">🥇 {isVi ? 'Chuyến sớm nhất trong ngày' : 'Earliest Flight of Day'}</option>
                  <option value="Chuyến bay muộn nhất">🏁 {isVi ? 'Chuyến muộn nhất trong ngày' : 'Latest Flight of Day'}</option>
                  <option value="Tránh giờ cao điểm">⚡ {isVi ? 'Tránh giờ cao điểm kẹt xe' : 'Avoid Rush Hours'}</option>
                  <option value="Giờ hoàng gia">👑 {isVi ? 'Giờ hoàng gia thong thả' : 'Royal Premium Hours'}</option>
                  <option value="Tối ưu giá vé tốt nhất">💎 {isVi ? 'Linh hoạt tối ưu giá rẻ nhất' : 'Cheapest Flexi Fare Option'}</option>
                  <option value="Tàu hỏa/Xe giường nằm đêm">🚂 {isVi ? 'Xe giường nằm/Tàu hỏa đêm' : 'Overnight Sleeper Train/Bus'}</option>
                </select>
              </div>

              {/* Travel style (likes beach, dislikes climbing, etc) */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-natural-accent uppercase mb-1">
                    {isVi ? 'Gu du lịch ưa thích (Vibe)' : 'Your Travel Vibe'}
                  </label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full text-xs font-bold bg-natural-sand text-natural-text border border-natural-border rounded-xl p-2.5 outline-none"
                  >
                    <option value="chill">🌾 {isVi ? 'Thảnh thơi & Chill di sản' : 'Chill & Heritage Oasis'}</option>
                    <option value="sea">🌊 {isVi ? 'Biển xanh hoang sơ ít người biết' : 'Wild Beach & Secret Shorelines'}</option>
                    <option value="culture">🏺 {isVi ? 'Văn hóa cổ truyền & Làng nghề di sản' : 'Heritage & Artisanal Villages'}</option>
                    <option value="adventure">🧗‍♂️ {isVi ? 'Phiêu lưu mạo hiểm, khám phá tự nhiên' : 'Adventure, Hiking & Exploration'}</option>
                    <option value="foodie">🍲 {isVi ? 'Thiên đường ẩm thực đường phố bản địa' : 'Authentic Street Food Safaris'}</option>
                    <option value="healing">🧘‍♀️ {isVi ? 'Chữa lành, Yoga & Thiền tịnh tâm' : 'Mindfulness, Wellness & Yoga'}</option>
                    <option value="photography">📸 {isVi ? 'Chụp ảnh sống ảo nghệ thuật góc độc bản' : 'Insta-Worthy Architecture Hunt'}</option>
                    <option value="nature">🚲 {isVi ? 'Sinh thái xanh thẳm, chèo thuyền đạp xe' : 'Eco-Green Cycle & Countryside Country'}</option>
                    <option value="glamping">⛺ {isVi ? 'Glamping cắm trại ngủ dưới trời sao' : 'Starlit Luxury Glamping'}</option>
                    <option value="luxury">🛥️ {isVi ? 'Sang chảnh du thuyền & Tiệc tối hoàng gia' : 'Bespoke Yacht Cruise & Royal Dining'}</option>
                    <option value="art">🎨 {isVi ? 'Lịch sử, Kiến trúc cổ kính & Bảo tàng xưa' : 'Classic Museum, Gallery & Art Walk'}</option>
                    <option value="cozy">☕ {isVi ? 'Săn quán cà phê mộc mạc và sách cổ' : 'Hidden Coffee Shops & Antique Bookshops'}</option>
                    <option value="fisherman">🎣 {isVi ? 'Trải nghiệm làm ngư dân, chèo thuyền thúng' : 'Local Fishing & Bamboo Basket Row'}</option>
                    <option value="heritage">👘 {isVi ? 'Cổ phục Việt phục, nhập vai ngược dòng cổ xưa' : 'Traditional Attire Heritage Dress-up'}</option>
                    <option value="nightlife">🏮 {isVi ? 'Phố cổ rực rỡ đèn lồng, chợ đêm lãng mạn' : 'Lantern Street & Romantic Night Markets'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-700 uppercase mb-1">
                    {isVi ? 'Điểm bạn KHÔNG muốn làm' : 'What you strongly DISLIKE'}
                  </label>
                  <select
                    value={dislikes}
                    onChange={(e) => setDislikes(e.target.value)}
                    className="w-full text-xs font-bold bg-natural-sand text-rose-800 border border-rose-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="climbing">🧗‍♀️ {isVi ? 'Không thích leo núi cao dốc mệt' : 'No exhausting mountain hikes'}</option>
                    <option value="crowds">👥 {isVi ? 'Tránh bãi tắm thương mại xô bồ' : 'No overcrowded tourist traps'}</option>
                    <option value="shopping">🛍️ {isVi ? 'Ghét đi tour ép mua sắm bắt buộc' : 'No forced commercial shopping stops'}</option>
                    <option value="walking">🥵 {isVi ? 'Không thích đi bộ quá nhiều dưới trời nắng' : 'No heavy walking under the hot sun'}</option>
                    <option value="noise">🔊 {isVi ? 'Tránh xa bar/vũ trường ồn ào náo nhiệt' : 'No noisy bars & clubs'}</option>
                    <option value="spicy">🌶️ {isVi ? 'Không ăn được đồ quá cay nóng' : 'No extremely spicy/hot food'}</option>
                    <option value="seafood">🦐 {isVi ? 'Dị ứng/Ngại ăn đồ sống, hải sản gỏi' : 'No raw seafood/sashimi'}</option>
                    <option value="rowing">🚣‍♀️ {isVi ? 'Sợ chèo thuyền thúng, say sóng nước' : 'No spinning baskets or seasickness'}</option>
                    <option value="museums">🏛️ {isVi ? 'Ngại tham quan bảo tàng, di tích khô khan' : 'No boring historical museum tours'}</option>
                    <option value="rain">☔ {isVi ? 'Tránh hoạt động ngoài trời lúc mưa gió' : 'No rainy outdoor activities'}</option>
                    <option value="photos">📷 {isVi ? 'Ngại xếp hàng chụp ảnh sống ảo mệt mỏi' : 'No queuing for visual poses'}</option>
                    <option value="morning">🛌 {isVi ? 'Không muốn thức dậy sớm trước 7h sáng' : 'No waking up early before 7 AM'}</option>
                    <option value="kids">👶 {isVi ? 'Tránh xa khu vui chơi trẻ em ồn ào' : 'No noisy children playground areas'}</option>
                    <option value="animals">🦟 {isVi ? 'Sợ côn trùng, động vật hoang dã' : 'No wild bugs or exotic animals'}</option>
                    <option value="driving">🚗 {isVi ? 'Không thích tự lái xe đường dài mệt mỏi' : 'No tedious long-distance driving'}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-natural-accent hover:bg-natural-olive text-white font-serif font-black py-4 rounded-2xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer duration-300 disabled:opacity-50"
                >
                  <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-spin-slow" />
                  <span>{isVi ? 'LẬP TRÌNH CHUYẾN ĐI BẤT NGỜ' : 'COMPILE SURPRISE ORACLE'}</span>
                </button>
              </div>
            </form>

            {/* Hint Box */}
            <div className="mt-5 p-3.5 bg-amber-50/50 border border-amber-200/40 rounded-2xl text-[10px] text-amber-900 leading-relaxed">
              💡 <strong>{isVi ? 'Yếu tố lôi cuốn thế hệ trẻ:' : 'Why young explorers love this:'}</strong>{' '}
              {isVi 
                ? 'Bạn sẽ không biết chính xác điểm đến của mình là đâu cho đến khi ra sân bay! Tuy nhiên, hệ thống sẽ gửi gợi ý chuẩn bị quần áo/trang phục trước 3 ngày để bạn chủ động chuẩn bị.'
                : 'You will remain blind to the exact city and airport path until check-in time! Rest easy: a smart packaging guide arrives 3 days early to prepare your wardrobe perfectly.'}
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: ANIMATED SURPRISE UNBOXING */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-natural-border shadow-lg flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-natural-accent/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-natural-gold/5 rounded-full blur-2xl pointer-events-none" />

            {/* STAGE 0: IDLE STATE */}
            {revealStage === 'idle' && (
              <div className="text-center space-y-4 max-w-sm">
                <div className="w-20 h-20 bg-natural-sand rounded-full flex items-center justify-center mx-auto border border-natural-border">
                  <Gift className="w-10 h-10 text-natural-accent animate-bounce" />
                </div>
                <h4 className="text-base font-serif font-black text-natural-text">
                  {isVi ? 'Hòm Quà Hành Trình Đang Chờ Đợi' : 'Mystery Escape Chest Awaiting'}
                </h4>
                <p className="text-xs text-natural-text/70 leading-relaxed font-sans">
                  {isVi 
                    ? 'Hãy điền ngân sách và sở thích ở khung bên trái. Hệ thống AI VietCharm sẽ gói gọn lộ trình bay & nghỉ dưỡng hoàn mỹ trong hộp quà bí mật!'
                    : 'Set your budget cap and preferred taste on the left. The AI compiler will seal your flight & luxury stay inside a glowing surprise envelope!'}
                </p>
              </div>
            )}

            {/* STAGE 1: LOADING STATE */}
            {revealStage === 'loading' && (
              <div className="text-center space-y-6 max-w-md">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-natural-accent/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-natural-accent animate-spin" />
                  <Compass className="w-6 h-6 text-natural-accent absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-serif font-black uppercase text-natural-accent tracking-widest animate-pulse">
                    {isVi ? 'Đang mã hóa dữ liệu & giữ chỗ khách sạn...' : 'Securing airline spots & boutique codes...'}
                  </h4>
                  <p className="text-[11px] font-mono text-natural-text/90 bg-natural-sand px-4 py-2.5 rounded-xl border border-natural-border">
                    {loadingStep}
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 2: SEALED GIFT/ORACLE BOX (READY TO OPEN) */}
            {revealStage === 'sealed-box' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6 max-w-sm"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: [0, -3, 3, -3, 3, 0], scale: [1, 1.03, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="w-28 h-28 bg-natural-accent text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl cursor-pointer"
                    onClick={handleOpenGiftBox}
                  >
                    <Gift className="w-14 h-14 text-amber-300 animate-pulse" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-bounce">
                    Ready!
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-serif font-black text-natural-text">
                    {isVi ? '🎁 Hộp Quà Ẩn Số Đã Khóa!' : '🎁 Your Secret Box is Sealed!'}
                  </h4>
                  <p className="text-xs text-natural-text/70 leading-relaxed font-sans">
                    {isVi 
                      ? 'Lá số chuyến đi bất ngờ đã được niêm phong an toàn. Hãy nhấp chuột vào chiếc hộp để mở bung và chiêm ngưỡng hành trình dành riêng cho bạn!'
                      : 'The heritage algorithm has locked your special getaway. Click/Tap the unboxing envelope to tear open your golden surprise ticket!'}
                  </p>
                </div>

                <button
                  onClick={handleOpenGiftBox}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs py-3.5 px-8 rounded-2xl transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  {isVi ? '💥 MỞ TUNG QUÀ BẤT NGỜ' : '💥 TEAR OPEN SURPRISE GIFT'}
                </button>
              </motion.div>
            )}

            {/* STAGE 3: OPENED REVEALED RESULTS */}
            {revealStage === 'opened-gift' && mysteryDest && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="w-full space-y-5"
              >
                {/* Oracle Golden Card Header */}
                <div className="border-2 border-dashed border-natural-accent/40 bg-gradient-to-br from-natural-bg to-natural-sand rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
                  
                  {/* Subtle Stamp Visual representation */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-emerald-700/10 flex items-center justify-center rotate-12 pointer-events-none">
                    <span className="text-[10px] font-mono font-bold text-emerald-800/20 uppercase tracking-widest">
                      VietCharm Verified
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>{isVi ? 'ĐÃ ĐỊNH VỊ THÀNH CÔNG!' : 'SECURED DESTINATION!'}</span>
                      </span>
                      <h4 className="text-lg md:text-xl font-serif font-black text-natural-text mt-1.5 leading-tight">
                        {isVi ? mysteryDest.regionVi : mysteryDest.regionEn}
                      </h4>
                      <p className="text-[10px] text-natural-accent font-mono font-bold mt-0.5">
                        🛫 {isVi ? 'Đường bay khứ hồi khép kín:' : 'Curated flights:'} {mysteryDest.airportCode}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-black text-natural-accent uppercase block">{isVi ? 'TRỌN GÓI / KHÁCH' : 'NET BUNDLE PRICE'}</span>
                      <span className="text-base font-mono font-black text-emerald-700">{budget.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  {/* Accommodation locked but peeked */}
                  <div className="mt-4 pt-3 border-t border-natural-border grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-natural-accent uppercase block">
                        🏨 {isVi ? 'Resort 5 Sao Ẩn Danh' : 'Luxury Stay Sealed'}
                      </span>
                      <p className="text-xs text-natural-text/90 font-bold leading-relaxed">
                        {isVi ? mysteryDest.hotelVi : mysteryDest.hotelEn}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-amber-700 uppercase block">
                        📆 {isVi ? 'Lịch Bay' : 'Time Slot'}
                      </span>
                      <p className="text-xs text-natural-text/90 font-bold leading-relaxed">
                        {days} {isVi ? 'Ngày 2 Đêm' : 'Days'} • {departureDate} ({departureTime})
                      </p>
                    </div>
                  </div>

                  {/* Wardrobe Suggestions */}
                  <div className="mt-4 p-3 bg-natural-border-light/50 border border-natural-border rounded-2xl flex gap-3">
                    <Shirt className="w-5 h-5 text-natural-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-black text-natural-accent uppercase block">
                        👗 {isVi ? 'Gợi Ý Chuẩn Bị Trang Phục (3 ngày trước bay)' : 'Apparel Guidance (Sent 3 Days Early)'}
                      </span>
                      <p className="text-[11px] text-natural-text/80 leading-relaxed mt-0.5">
                        {isVi ? mysteryDest.packingVi : mysteryDest.packingEn}
                      </p>
                    </div>
                  </div>

                  {/* Curated Itinerary */}
                  <div className="mt-4 pt-3 border-t border-natural-border space-y-2">
                    <span className="text-[9px] font-black text-natural-accent uppercase block">
                      🔮 {isVi ? 'Lộ Trình Bất Ngờ Thiết Kế' : 'Surprise Itinerary Highlight Node'}
                    </span>
                    <ul className="space-y-1.5 font-sans text-xs">
                      {mysteryDest[isVi ? 'itineraryVi' : 'itineraryEn'].map((day: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-natural-text/95">
                          <span className="w-1.5 h-1.5 rounded-full bg-natural-accent shrink-0 mt-1.5" />
                          <span>{day}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => {
                      setRevealStage('idle');
                      setMysteryDest(null);
                    }}
                    className="bg-white hover:bg-natural-sand border border-natural-border text-natural-accent text-xs font-bold py-3 px-5 rounded-xl transition cursor-pointer"
                  >
                    🔄 {isVi ? 'Thiết lập lại' : 'Try Another'}
                  </button>
                  <button
                    onClick={onNavigateHome}
                    className="bg-slate-100 hover:bg-slate-200 text-natural-text text-xs font-bold py-3 px-5 rounded-xl transition cursor-pointer"
                  >
                    {isVi ? 'Quay lại' : 'Back Home'}
                  </button>
                  <button
                    onClick={handleBookMysteryPackage}
                    className="bg-natural-accent hover:bg-natural-olive text-white text-xs font-serif font-black py-3 px-6 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isVi ? 'Gói Cất Cánh Ngay' : 'Book Surprises Now'}</span>
                    <Plane className="w-4 h-4 text-amber-300 animate-pulse" />
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
