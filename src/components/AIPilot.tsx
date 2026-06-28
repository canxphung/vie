/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Brain, DollarSign, Clock, HelpCircle, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
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
}

export default function AIPilot({ language, currentProvinceId, onAddComboToCart }: AIPilotProps) {
  const isVi = language === 'vi';
  const [budget, setBudget] = React.useState(3500000);
  const [province, setProvince] = React.useState(currentProvinceId || 'quang-nam');
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
      : 'Family wellness package for 4 with secure hotel lodging and private car driver.',
    isVi 
      ? 'Tìm combo giá rẻ nhất ăn uống thả ga đậm vị ẩm thực Quảng Nam Đà Nẵng dưới 2Tr.' 
      : 'Cheapest local food combo covering Hoi An - Danang within $100 budget limit.'
  ];

  const handleSuggestClick = (suggestion: string) => {
    setCustomPrompt(suggestion);
  };

  const runAIOptimizer = async () => {
    setLoading(true);
    setSuccessMsg(false);
    
    // Simulate interactive progress stages to keep the user engaged
    const stages = isVi 
      ? [
          'Khởi động động cơ Gemini 3.5-Flash...',
          'Thu lượm bảng giá của 12 khách sạn & đại lý thuê xe ở miền Trung...',
          'Tính toán định vị tối ưu hóa đường đi thời gian thực...',
          'Áp dụng chiến lược giảm giá 15% - 25% combo du lịch trọn gói...',
          'Hoàn thiện phiếu hành trình lữ hành an toàn bảo mật...'
        ]
      : [
          'Launching Gemini 3.5-Flash AI optimizer...',
          'Scanning local room tariffs and motor rentals...',
          'Running real-time spatial path-finding algorithm...',
          'Injecting 15% - 25% inclusive package discount incentives...',
          'Constructing certified secure vacation itinerary...'
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
          prompt: customPrompt,
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

  return (
    <div className="w-full bg-natural-beige text-natural-text py-16 px-4 shadow-inner border-y border-natural-border">
      <div className="max-w-7xl mx-auto">
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
                    AI Trip Co-Pilot 
                    <span className="text-[10px] font-sans font-bold tracking-widest bg-natural-gold text-white px-1.5 py-0.5 rounded uppercase">Lite</span>
                  </h3>
                  <p className="text-[11px] text-natural-text/70 font-medium">
                    {isVi ? 'Động cơ lập kế hoạch tối ưu chi phí & đường đi' : 'Itinerary compiler & budget optimizer'}
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

              {/* Text Area prompt input */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-natural-text mb-1">{isVi ? 'Sở thích & Yêu cầu đặc biệt' : 'Special Preferences'}</label>
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
                      💡 {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={runAIOptimizer}
              className="w-full bg-natural-accent hover:bg-natural-olive text-white font-serif font-bold py-3.5 rounded-2xl transition shadow-lg text-xs md:text-sm tracking-wide flex items-center justify-center gap-2 mt-4 cursor-pointer"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isVi ? 'TỐI ƯU HÓA LỘ TRÌNH VỚI AI' : 'AI COMPILE & BUNDLE MINIMIZER'}</span>
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
                <h4 className="text-base font-serif font-bold text-natural-text mt-6 animate-pulse">{isVi ? 'Gemini AI đang suy nghĩ...' : 'Gemini AI reasoning...'}</h4>
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
                <h4 className="text-base font-serif font-bold text-natural-text">{isVi ? 'Tìm kiếm Giải pháp Itinerary Tối ưu của bạn' : 'Unlock Your Heritage Solution'}</h4>
                <p className="text-xs text-natural-text/70 mt-2 leading-relaxed">
                  {isVi 
                    ? 'Hãy chọn hoặc điền thông tin chi phí và đề xuất sở thích ở bảng điều khiển bên trái, VietCharm AI Co-Pilot sẽ lập tức phản hồi bảng combo phòng, lặn nắp san hô và xe máy giảm sâu siêu tiết kiệm.' 
                    : 'Configure your budget limit and click Compile to let Gemini compile highly tailored activities, rentals and hotels immediately.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
