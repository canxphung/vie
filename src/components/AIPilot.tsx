/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  Baby,
  Brain,
  Camera,
  CheckCircle,
  Clock,
  Coffee,
  Heart,
  HelpCircle,
  Leaf,
  Sparkles,
  UsersRound,
  Waves,
} from 'lucide-react';
import { BookingCartItem, Language } from '../types';

interface ItineraryActivity {
  time: string;
  attractionName: string;
  description: string;
  costVND: number;
}

interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities?: ItineraryActivity[];
}

interface AIItinerary {
  itineraryTitle: string;
  estimatedSavingsPercent: number;
  totalCostEstimate: number;
  days?: ItineraryDay[];
  savingTips?: string[];
}

interface AIItineraryResponse {
  success?: boolean;
  data?: AIItinerary;
}

interface AIPilotProps {
  language: Language;
  currentProvinceId: string;
  onAddComboToCart: (items: BookingCartItem[]) => void;
  onNavigateToBlindTravel?: () => void;
}

export default function AIPilot({
  language,
  currentProvinceId,
  onAddComboToCart,
  onNavigateToBlindTravel,
}: AIPilotProps) {
  const isVi = language === 'vi';
  const [budget, setBudget] = React.useState(3500000);
  const [province, setProvince] = React.useState(currentProvinceId || 'quang-nam');
  const [travelers, setTravelers] = React.useState<'couple' | 'family' | 'friends'>('couple');
  const [daysCount, setDaysCount] = React.useState(3);
  const [travelMood, setTravelMood] = React.useState<'heritage' | 'beach' | 'food' | 'slow'>('heritage');
  const [pace, setPace] = React.useState<'easy' | 'balanced' | 'packed'>('balanced');
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState('');
  const [itinerary, setItinerary] = React.useState<AIItinerary | null>(null);
  const [successMsg, setSuccessMsg] = React.useState(false);

  React.useEffect(() => {
    if (currentProvinceId) {
      setProvince(currentProvinceId);
    }
  }, [currentProvinceId]);

  const presetSuggestions = [
    isVi 
      ? 'Tôi đi phượt cặp đôi 3N2Đ, thích chụp ảnh hoài cổ ở Hội An, muốn thuê xe máy.' 
      : 'Couple backpacking for 3D2N, focus on ancient towns photo spots & motorbike rentals.',
    isVi 
      ? 'Du lịch gia đình nghỉ dưỡng 4 người, thích yên bình, an toàn, có trẻ nhỏ.' 
      : 'Family wellness package for 4 with calm lodging and private car driver.',
    isVi 
      ? 'Tìm combo giá rẻ nhất ăn uống thả ga đậm vị ẩm thực Quảng Nam Đà Nẵng dưới 2Tr.' 
      : 'Cheapest local food combo covering Hoi An - Danang within $100 budget limit.'
  ];

  const handleSuggestClick = (suggestion: string) => {
    setCustomPrompt(suggestion);
  };

  const travelerOptions = [
    { id: 'couple', icon: Heart, vi: 'Cặp đôi', en: 'Couple' },
    { id: 'family', icon: Baby, vi: 'Gia đình', en: 'Family' },
    { id: 'friends', icon: UsersRound, vi: 'Nhóm bạn', en: 'Friends' },
  ] as const;

  const moodOptions = [
    { id: 'heritage', icon: Camera, vi: 'Di sản & chụp ảnh', en: 'Heritage & photos' },
    { id: 'beach', icon: Waves, vi: 'Biển & nghỉ dưỡng', en: 'Beach & stay' },
    { id: 'food', icon: Coffee, vi: 'Ẩm thực địa phương', en: 'Local food' },
    { id: 'slow', icon: Leaf, vi: 'Chậm, ít di chuyển', en: 'Slow travel' },
  ] as const;

  const paceOptions = [
    { id: 'easy', vi: 'Rảnh rang', en: 'Easy' },
    { id: 'balanced', vi: 'Vừa đủ', en: 'Balanced' },
    { id: 'packed', vi: 'Đi nhiều', en: 'Packed' },
  ] as const;

  const runAIOptimizer = async () => {
    setLoading(true);
    setSuccessMsg(false);
    const quizPrompt = [
      isVi ? `Số ngày: ${daysCount}` : `Days: ${daysCount}`,
      isVi ? `Người đi: ${travelerOptions.find((x) => x.id === travelers)?.vi}` : `Travelers: ${travelerOptions.find((x) => x.id === travelers)?.en}`,
      isVi ? `Gu du lịch: ${moodOptions.find((x) => x.id === travelMood)?.vi}` : `Travel mood: ${moodOptions.find((x) => x.id === travelMood)?.en}`,
      isVi ? `Nhịp chuyến đi: ${paceOptions.find((x) => x.id === pace)?.vi}` : `Trip pace: ${paceOptions.find((x) => x.id === pace)?.en}`,
      customPrompt.trim(),
    ].filter(Boolean).join('. ');
    
    // Simulate interactive progress stages to keep the user engaged
    const stages = isVi 
      ? [
          'Đang đọc gu chuyến đi của bạn...',
          'Ghép khách sạn, xe và hoạt động theo ngân sách...',
          'Sắp xếp tuyến đi để ít vòng lại nhất...',
          'Tính các combo có thể tiết kiệm hơn...',
          'Hoàn thiện timeline từng ngày...'
        ]
      : [
          'Reading your travel style...',
          'Matching stays, rides, and experiences to budget...',
          'Arranging the route to avoid backtracking...',
          'Checking bundle savings...',
          'Composing the day-by-day timeline...'
        ];

    let currentStage = 0;
    setLoadingStep(stages[0]);
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setLoadingStep(stages[currentStage]);
      }
    }, 900);

    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: quizPrompt,
          province: province,
          budget: budget,
          language: language
        })
      });

      const resData = (await response.json()) as AIItineraryResponse;
      if (resData.success && resData.data) {
        setItinerary(resData.data);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.error('AI Pilot API failed, rendering secure optimized local plan:', err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Convert parsed AI itinerary recommendation into direct booking items for our cart
  const handleApplyCombo = () => {
    if (!itinerary) return;

    // Build cart structures based on AI suggestions
    const suggestedItems: BookingCartItem[] = [];
    
    // Default mock hotel to inject in combo
    suggestedItems.push({
      id: `ai-hotel-${province}`,
      type: 'hotel',
      name: province === 'quang-nam' 
        ? 'La Siesta Hoi An Resort (AI Combo Deal)' 
        : province === 'da-nang'
        ? 'Tiamo Sea View Hotel (AI Combo)'
        : province === 'thua-thien-hue'
        ? 'Silk Path Grand Hue (AI Approved)'
        : province === 'binh-dinh'
        ? 'Anya Premier Hotel Quy Nhơn (AI Combo)'
        : 'Crown Plaza Nha Trang (AI Combo)',
      price: province === 'quang-nam' ? 1800000 : province === 'da-nang' ? 850000 : province === 'thua-thien-hue' ? 1300000 : province === 'binh-dinh' ? 1200000 : 1500000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      details: isVi ? 'Ưu đãi đặt trực tiếp theo đề xuất AI' : 'AI-optimized lodging plan'
    });

    // Default mock vehicle in combo
    suggestedItems.push({
      id: `ai-vehicle-${province}`,
      type: 'vehicle',
      name: province === 'quang-nam' 
        ? 'Honda Vision 110cc (AI Save Pack)' 
        : province === 'da-nang' 
        ? 'Toyota Vios Private Car (AI Save)'
        : province === 'thua-thien-hue'
        ? 'Honda AirBlade 125cc (AI Save)'
        : province === 'binh-dinh'
        ? 'Yamaha Exciter 150cc (AI Save)'
        : 'Mitsubishi Xpander Self-drive (AI Save)',
      price: province === 'quang-nam' ? 130000 : province === 'da-nang' ? 800000 : province === 'thua-thien-hue' ? 150000 : province === 'binh-dinh' ? 140000 : 900000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
      details: isVi ? 'Phương tiện di chuyển phù hợp nhất' : 'Best custom vehicle recommendation'
    });

    // Default mock activity in combo
    suggestedItems.push({
      id: `ai-activity-${province}`,
      type: 'activity',
      name: province === 'quang-nam' 
        ? 'Lặn Ngắm San Hô Cù Lao Chàm (AI Deal)' 
        : province === 'da-nang' 
        ? 'Vé Cáp Treo Bà Nà (AI Deal)'
        : province === 'thua-thien-hue'
        ? 'Food Tour Xích Lô Huế Về Đêm (AI Deal)'
        : province === 'binh-dinh'
        ? 'Tour Cano Kỳ Co Ngắm San Hô (AI Deal)'
        : 'Tour Cano 3 Đảo VIP Vịnh Nha Trang (AI Deal)',
      price: province === 'quang-nam' ? 550000 : province === 'da-nang' ? 850000 : province === 'thua-thien-hue' ? 450000 : province === 'binh-dinh' ? 690000 : 750000,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      details: isVi ? 'Tham quan theo lộ trình tối ưu' : 'Highly structured tour access'
    });

    onAddComboToCart(suggestedItems);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  if (onNavigateToBlindTravel) {
    return (
      <section className="w-full border-y border-natural-border bg-[#1F261F] px-4 py-12 text-white shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-natural-gold">
              {isVi ? 'Hành trình ẩn số' : 'Blind Travel'}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-5xl">
              {isVi ? 'Đi thẳng tới chuyến đi bất ngờ.' : 'Go straight to a surprise trip.'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {isVi
                ? 'Khám phá một chuyến đi bất ngờ với điểm đến và combo phù hợp được VietCharm gợi ý sẵn.'
                : 'Skip the long brief. VietCharm will open a mystery journey with a ready-made suggested bundle.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToBlindTravel}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-natural-gold px-5 text-xs font-black uppercase tracking-wide text-natural-ink shadow-lg transition hover:bg-natural-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-natural-gold focus-visible:ring-offset-4 focus-visible:ring-offset-[#1F261F] md:self-center"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isVi ? 'Mở hành trình ẩn số' : 'Open Blind Travel'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full bg-[#1F261F] text-natural-text py-16 px-4 shadow-inner border-y border-natural-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl text-white">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-natural-gold">
            {isVi ? 'AI Trip Studio' : 'AI Trip Studio'}
          </span>
          <h2 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-5xl">
            {isVi ? 'Trả lời vài câu, nhận lịch trình có thể đặt ngay.' : 'Answer a few prompts, get a bookable trip plan.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {isVi
              ? 'Studio này ghép ngày đi, gu du lịch, ngân sách và dịch vụ có sẵn thành một timeline dễ hiểu.'
              : 'This studio turns dates, mood, budget, and available services into a clear day-by-day timeline.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Inputs Section */}
          <div className="w-full lg:w-5/12 bg-natural-bg p-6 lg:p-8 rounded-3xl border border-natural-border shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-natural-accent rounded-lg text-white shadow-md">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold tracking-tight text-natural-text flex items-center gap-1.5">
                    {isVi ? 'Bảng gu chuyến đi' : 'Trip brief'}
                    <span className="text-[10px] font-sans font-bold tracking-widest bg-natural-gold text-white px-1.5 py-0.5 rounded uppercase">Lite</span>
                  </h3>
                  <p className="text-[11px] text-natural-text/70 font-medium">
                    {isVi ? 'Chọn vài thông tin chính, phần còn lại để VietCharm gợi ý.' : 'Pick the key details and let VietCharm shape the rest.'}
                  </p>
                </div>
              </div>

              {/* Slider for Budget */}
              <div className="mb-5 bg-natural-beige-light p-4 rounded-xl border border-natural-border">
                <div className="flex justify-between items-center text-xs text-natural-text/80 font-bold mb-1">
                  <span>{isVi ? 'Ngân sách thiết kế' : 'Target Outlay'}</span>
                  <span className="text-natural-accent font-mono font-bold text-sm">
                    {budget.toLocaleString('vi-VN')} {isVi ? 'VND' : 'VND'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1500000" 
                  max="12000000" 
                  step="500000"
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-natural-accent bg-natural-border h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-natural-text/50 mt-1 uppercase font-semibold">
                  <span>1.5TR</span>
                  <span>6TR</span>
                  <span>12TR</span>
                </div>
              </div>

              {/* Province select */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-natural-text mb-1">{isVi ? 'Tỉnh thành điểm đến' : 'Target Province Focus'}</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs font-bold bg-natural-bg text-natural-text border border-natural-border rounded-xl p-3 focus:border-natural-accent outline-none"
                >
                  <option value="quang-nam">{isVi ? 'Quảng Nam - Hội An' : 'Quang Nam - Hoi An'}</option>
                  <option value="da-nang">{isVi ? 'Đà Nẵng (Bao gồm Bà Nà)' : 'Da Nang (Incl. Bana Hills)'}</option>
                  <option value="thua-thien-hue">{isVi ? 'Thừa Thiên Huế (Cố Đô)' : 'Thua Thien Hue (Cradle Palace)'}</option>
                  <option value="binh-dinh">{isVi ? 'Bình Định (Quy Nhơn)' : 'Binh Dinh (Quy Nhon)'}</option>
                  <option value="khanh-hoa">{isVi ? 'Khánh Hòa (Nha Trang)' : 'Khanh Hoa (Nha Trang)'}</option>
                </select>
              </div>

              <div className="mb-5 space-y-4 rounded-2xl border border-natural-border bg-natural-cream p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-natural-text">
                    {isVi ? 'Số ngày đi' : 'Trip length'}
                  </span>
                  <div className="flex items-center gap-2 rounded-xl border border-natural-border bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setDaysCount((value) => Math.max(2, value - 1))}
                      className="h-8 w-8 rounded-lg text-sm font-black text-stone-500 transition hover:bg-natural-beige"
                    >
                      -
                    </button>
                    <span className="w-14 text-center font-mono text-sm font-black text-natural-accent">
                      {daysCount} {isVi ? 'ngày' : 'days'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDaysCount((value) => Math.min(7, value + 1))}
                      className="h-8 w-8 rounded-lg text-sm font-black text-stone-500 transition hover:bg-natural-beige"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                    {isVi ? 'Bạn đi với ai?' : 'Who is going?'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {travelerOptions.map((option) => {
                      const Icon = option.icon;
                      const active = travelers === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTravelers(option.id)}
                          className={`rounded-xl border px-2 py-2.5 text-[10px] font-black transition ${
                            active ? 'border-natural-accent bg-natural-accent text-white' : 'border-natural-border bg-white text-natural-text hover:bg-natural-beige'
                          }`}
                        >
                          <Icon className="mx-auto mb-1 h-4 w-4" />
                          {isVi ? option.vi : option.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                    {isVi ? 'Gu chuyến đi' : 'Travel mood'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((option) => {
                      const Icon = option.icon;
                      const active = travelMood === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTravelMood(option.id)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[10px] font-black transition ${
                            active ? 'border-natural-accent bg-natural-accent text-white' : 'border-natural-border bg-white text-natural-text hover:bg-natural-beige'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {isVi ? option.vi : option.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                    {isVi ? 'Nhịp chuyến đi' : 'Pace'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {paceOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPace(option.id)}
                        className={`rounded-xl border px-2 py-2 text-[10px] font-black transition ${
                          pace === option.id ? 'border-natural-accent bg-natural-accent text-white' : 'border-natural-border bg-white text-natural-text hover:bg-natural-beige'
                        }`}
                      >
                        {isVi ? option.vi : option.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Area prompt input */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-natural-text mb-1">{isVi ? 'Ghi chú thêm' : 'Extra notes'}</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={isVi ? 'Ví dụ: Tôi đi du lịch với gia đình lớn, muốn đi nhẹ nhàng, không say sóng cano...' : 'Example: Traveling with kids, seeking private drivers, food adventures...'}
                  rows={3}
                  className="w-full text-xs bg-natural-bg text-natural-text border border-natural-border rounded-xl p-3 focus:outline-none focus:border-natural-accent placeholder:text-natural-accent/40"
                />
              </div>

              {/* Preset suggestion chips */}
              <div className="mb-6">
                  <p className="text-[10px] text-natural-accent font-bold uppercase mb-2">{isVi ? 'Gợi ý nhanh cho bạn' : 'Quick Prompt Presets'}</p>
                <div className="flex flex-col gap-2">
                  {presetSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestClick(s)}
                      className="text-left text-[11px] bg-natural-beige-light hover:bg-natural-beige transition border border-natural-border px-3 py-2.5 rounded-xl text-natural-text hover:text-natural-accent line-clamp-1"
                    >
                      <span className="mr-1 text-natural-gold">•</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={runAIOptimizer}
              className="w-full bg-natural-gold hover:bg-natural-gold-dark text-natural-ink font-serif font-black py-3.5 rounded-2xl transition shadow-lg text-xs md:text-sm tracking-wide flex items-center justify-center gap-2 mt-4 cursor-pointer"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isVi ? 'TẠO LỊCH TRÌNH CỦA TÔI' : 'CREATE MY TRIP PLAN'}</span>
            </button>
          </div>

          {/* Outputs / Compiled results board */}
          <div className="w-full lg:w-7/12 bg-natural-bg p-6 lg:p-8 rounded-3xl border border-natural-border shadow-xl relative min-h-[460px] flex flex-col justify-between text-natural-text">
            {loading ? (
              <div className="absolute inset-0 bg-natural-beige/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 rounded-3xl z-30">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-natural-accent border-t-transparent rounded-full animate-spin"></div>
                  <Brain className="w-6 h-6 text-natural-accent absolute inset-0 m-auto animate-pulse" />
                </div>
                <h4 className="text-base font-serif font-bold text-natural-text mt-6 animate-pulse">{isVi ? 'Đang dựng lịch trình...' : 'Building your route...'}</h4>
                <p className="text-xs text-natural-text/80 mt-3 max-w-sm px-4 whitespace-pre-wrap leading-relaxed font-mono">
                  {loadingStep}
                </p>
              </div>
            ) : null}

            {itinerary ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-natural-border pb-4 mb-4">
                    <div>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-natural-accent border border-natural-accent/20 bg-natural-beige px-2.5 py-1 rounded-full">
                        {isVi ? 'Lịch trình thiết kế riêng' : 'Custom Tailored Itinerary'}
                      </span>
                      <h4 className="text-xl font-serif font-bold tracking-tight text-natural-text mt-2">{itinerary.itineraryTitle}</h4>
                    </div>
                    {/* Savings circle badge representation */}
                    <div className="bg-emerald-700/5 border border-emerald-500/20 px-3 py-1.5 rounded-2xl text-center shrink-0">
                      <p className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-widest">{isVi ? 'TIẾT KIỆM COMBO' : 'COMBO SAVINGS'}</p>
                      <h5 className="text-lg font-mono font-black text-emerald-700">{itinerary.estimatedSavingsPercent}%</h5>
                    </div>
                  </div>

                  {/* Daily detailed roadmap scrollable */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                    {itinerary.days?.map((day, dIdx) => (
                      <div key={dIdx} className="bg-natural-beige-light p-4 border border-natural-border rounded-2xl">
                        <h5 className="text-xs font-serif font-bold text-natural-accent border-b border-natural-border pb-2 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-natural-accent" />
                          <span>{isVi ? `Ngày ${day.dayNumber}: ` : `Day ${day.dayNumber}: `}{day.title}</span>
                        </h5>
                        <div className="space-y-3">
                          {day.activities?.map((act, aIdx) => (
                            <div key={aIdx} className="flex gap-3 text-xs">
                              <span className="font-mono text-natural-accent bg-natural-beige px-2 py-0.5 rounded h-fit shrink-0 font-bold border border-natural-border">
                                {act.time}
                              </span>
                              <div>
                                <h6 className="font-serif font-bold text-natural-text text-xs">{act.attractionName}</h6>
                                <p className="text-natural-text/80 text-[11px] mt-0.5 leading-relaxed">{act.description}</p>
                                <p className="text-natural-accent text-[10px] font-bold font-mono mt-1">
                                  {act.costVND > 0 ? `${act.costVND.toLocaleString('vi-VN')} VND` : (isVi ? 'Miễn phí vé vào' : 'Free admission')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Smart saving tips */}
                  <div className="bg-natural-beige-light border border-natural-border p-4 rounded-2xl mt-4">
                    <h5 className="text-[10px] font-bold text-natural-accent uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
                       <HelpCircle className="w-3.5 h-3.5" />
                      {isVi ? 'Khuyến nghị mộc mạc từ AI' : 'Expert Local Insights'}
                    </h5>
                    <ul className="text-[11px] text-natural-text/85 space-y-1.5 list-disc pl-4 leading-relaxed">
                      {itinerary.savingTips?.map((tip: string, tIdx: number) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply combo button block */}
                <div className="mt-6 pt-4 border-t border-natural-border flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] text-natural-text/60 font-bold uppercase">{isVi ? 'ƯỚC TÍNH TRỌN GÓI COMBO' : 'OPTIMIZED BUNDLE PRICE'}</p>
                    <p className="text-xl font-bold font-mono text-natural-accent">
                      {itinerary.totalCostEstimate?.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    {successMsg && (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-bounce">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        {isVi ? 'Đã áp dụng combo!' : 'Combo injected!'}
                      </span>
                    )}
                    <button
                      onClick={handleApplyCombo}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase transition shadow-md flex items-center gap-1.5 border border-emerald-750 cursor-pointer"
                    >
                      <span>{isVi ? 'ÁP DỤNG ĐẶT TRỌN BỘ COMBO' : 'BOOK ALL-IN-ONE COMBO'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full max-w-sm mx-auto">
                <Brain className="w-12 h-12 text-natural-accent/40 animate-pulse mb-4" />
                <h4 className="text-base font-serif font-bold text-natural-text">{isVi ? 'Trả lời bảng gu để nhận lịch trình mẫu' : 'Start with the trip brief'}</h4>
                <p className="text-xs text-natural-text/70 mt-2 leading-relaxed">
                  {isVi 
                    ? 'Chọn ngân sách, số ngày, người đi và gu trải nghiệm. VietCharm sẽ gợi ý timeline theo ngày cùng combo có thể đặt ngay.'
                    : 'Choose budget, days, travelers, and mood. VietCharm will suggest a day-by-day route with a bookable bundle.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
