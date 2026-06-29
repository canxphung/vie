import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wind, 
  Compass, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Gift, 
  RefreshCcw, 
  MapPin, 
  Flame,
  Heart,
  Music,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks';

interface HeritageOracleProps {
  language: 'vi' | 'en';
  onApplyVoucher?: (code: string, discount: number) => void;
}

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

interface TravelCard {
  id: string;
  nameVi: string;
  nameEn: string;
  elementVi: string;
  elementEn: string;
  poemVi: string;
  poemEn: string;
  foodRemedyVi: string;
  foodRemedyEn: string;
  goldenHour: string;
  secretSpotVi: string;
  secretSpotEn: string;
  voucherCode: string;
  discount: number;
  bgGradient: string;
  iconColor: string;
}

const ORACLE_CARDS: TravelCard[] = [
  {
    id: 'hoian-amber',
    nameVi: 'Thẻ Hổ Phách Phố Cổ',
    nameEn: 'The Golden Amber Card',
    elementVi: 'Mộc & Hỏa dịu',
    elementEn: 'Warm Wood & Fire',
    poemVi: 'Tường vàng nắng quẩy gánh sương thu / Chùa Cầu nghiêng bóng nước sông Hoài.',
    poemEn: 'Yellow walls bathed in autumn golden mist / Ancient Bridge reflects on still waterways.',
    foodRemedyVi: 'Một bát Cao Lầu sáo thịt mộc mạc bên hẻm Giếng Bá Lễ',
    foodRemedyEn: 'Authentic Cao Lau noodles deep inside Ba Le alley',
    goldenHour: '16:45 - 17:30',
    secretSpotVi: 'Góc hẻm 60 Lê Lợi (Nơi ánh nắng xiên hẻm hẹp đẹp nhất)',
    secretSpotEn: 'Alley 60 Le Loi (Best golden hour light penetration)',
    voucherCode: 'THANHOIAN15',
    discount: 15,
    bgGradient: 'from-amber-900/90 via-stone-900 to-natural-text',
    iconColor: 'text-natural-gold'
  },
  {
    id: 'hue-mist',
    nameVi: 'Thẻ Tử Sa Cố Đô',
    nameEn: 'The Imperial Amethyst',
    elementVi: 'Thủy & Trầm hương',
    elementEn: 'Sacred Water & Incense',
    poemVi: 'Tiếng chuông Thiên Mụ rọi dòng Hương / Khói trầm lãng đãng quyện mái đình.',
    poemEn: 'Temple bells echo across Perfume River / Sacred incense rises over royal roofs.',
    foodRemedyVi: 'Bún bò Huế giò heo mắm ruốc chuẩn vị mợ Tôn Nữ',
    foodRemedyEn: 'Royal spicy beef lemongrass soup by Madame Ton Nu',
    goldenHour: '05:30 - 06:15',
    secretSpotVi: 'Đồi Vọng Cảnh nhìn xuống khúc quanh sông Hương lúc bình minh',
    secretSpotEn: 'Vong Canh Hill overlooking river bend at dawn',
    voucherCode: 'CODOVIBE20',
    discount: 20,
    bgGradient: 'from-purple-950/90 via-stone-900 to-natural-ink-soft',
    iconColor: 'text-purple-300'
  },
  {
    id: 'danang-emerald',
    nameVi: 'Thẻ Bích Ngọc Hà Hải',
    nameEn: 'The Coastal Emerald',
    elementVi: 'Kim & Phong Thủy',
    elementEn: 'Precious Metal & Wind',
    poemVi: 'Sơn Trà vách dựng đón mây khơi / Mỹ Khê cát trắng gột ưu phiền.',
    poemEn: 'Cliffs of Son Tra embrace open ocean clouds / Pristine white sands wash worries away.',
    foodRemedyVi: 'Gỏi cá Nam Ô dọn kèm lá rừng hái tươi bên suối',
    foodRemedyEn: 'Raw herring salad wrapped in wild mountain herbs',
    goldenHour: '17:15 - 18:00',
    secretSpotVi: 'Bãi Bụt phía sau lưng tượng Phật Bà Quan Âm Sơn Trà',
    secretSpotEn: 'Bai But secluded shore behind Lady Buddha statue',
    voucherCode: 'BIENxanh10',
    discount: 10,
    bgGradient: 'from-teal-950/90 via-stone-900 to-[#1F2E2B]',
    iconColor: 'text-emerald-400'
  }
];

export const HeritageOracle: React.FC<HeritageOracleProps> = ({ language, onApplyVoucher }) => {
  const isVi = language === 'vi';
  const { showToast } = useToast();
  const [selectedCard, setSelectedCard] = useState<TravelCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundType, setSoundType] = useState<'wave' | 'bell' | 'rain' | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [pulsingVibe, setPulsingVibe] = useState(48); // bpm vibe

  // Web Audio Synthesizer for pure zen ambient sounds (Zero heavy network mp3 files needed)
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsingVibe(prev => (prev === 48 ? 52 : prev === 52 ? 46 : 48));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const triggerZenTone = (type: 'wave' | 'bell' | 'rain') => {
    try {
      const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = audioCtx || new AudioContextCtor();
      if (!audioCtx) setAudioCtx(ctx);

      if (isPlayingSound && soundType === type) {
        setIsPlayingSound(false);
        setSoundType(null);
        ctx.suspend();
        return;
      }

      ctx.resume();
      setIsPlayingSound(true);
      setSoundType(type);

      if (type === 'bell') {
        // Singing bowl chime effect
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 note
        osc.frequency.exponentialRampToValueAtTime(164.81, ctx.currentTime + 3.5);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3.5);
        
        setTimeout(() => {
          setIsPlayingSound(false);
          setSoundType(null);
        }, 3500);
      } else if (type === 'wave') {
        // Pink noise ocean wave simulation
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(120, ctx.currentTime + 2);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setTimeout(() => {
          setIsPlayingSound(false);
          setSoundType(null);
        }, 2000);
      } else {
        // Soft rain drops
        setIsPlayingSound(false);
        setSoundType(null);
      }
    } catch (e) {
      console.log('Audio Context suppressed or unavailable');
    }
  };

  const handleDrawOracle = () => {
    setIsFlipping(true);
    setSelectedCard(null);
    triggerZenTone('bell');

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ORACLE_CARDS.length);
      setSelectedCard(ORACLE_CARDS[randomIndex]);
      setIsFlipping(false);
    }, 1200);
  };

  return (
    <section className="w-full bg-natural-cream py-16 px-4 border-y border-natural-border relative overflow-hidden text-natural-text">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-natural-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-natural-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-natural-beige border border-natural-border text-xs font-bold uppercase tracking-widest text-natural-accent shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-natural-gold animate-spin" />
            <span>{isVi ? 'Độc quyền trên thế giới du lịch' : 'World First Sensory Feature'}</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-natural-text">
            {isVi ? 'Trạm Lữ Hành Đa Giác Quan & Gieo Quẻ Thần Khí' : 'Sensory Heritage Oracle & Mood Compass'}
          </h2>
          
          <p className="text-xs md:text-sm text-natural-text/80 leading-relaxed max-w-2xl mx-auto font-sans">
            {isVi 
              ? 'Không chỉ là đặt phòng, hãy để tâm hồn bạn chạm vào nhịp riêng của từng vùng trước chuyến đi. Bốc một thẻ quẻ để nhận thông điệp lữ hành kèm bí kíp ẩm thực chữa lành và mã ưu đãi riêng tư.'
              : 'Immerse your senses before traveling. Draw a mystic heritage card to reveal your trip element, healing culinary secret, and members-only discount codes.'}
          </p>
        </div>

        {/* Live Heritage Vibe Dashboard Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-5 border border-natural-border shadow-md mb-12 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-natural-beige text-natural-accent border border-natural-border">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-natural-text">{isVi ? 'Chỉ số Thần Khí Hội An' : 'Hoi An Heritage Pulse'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs font-mono text-natural-accent mt-0.5">
                {isVi ? `Mùng 8 Âm Lịch • Nhịp phố tĩnh mộc ${pulsingVibe} BPM` : `Lunar Day 8 • Zen Town Pulse ${pulsingVibe} BPM`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-natural-border w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-medium text-natural-text/70 mr-1">{isVi ? 'Chạm nghe thanh âm xưa:' : 'Soundscapes:'}</span>
            <button
              onClick={() => triggerZenTone('bell')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                isPlayingSound && soundType === 'bell'
                  ? 'bg-natural-accent text-white border-natural-accent'
                  : 'bg-natural-beige-light text-natural-text border-natural-border hover:border-natural-accent'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-natural-gold" />
              <span>{isVi ? 'Chuông Thiên Mụ' : 'Temple Bell'}</span>
            </button>

            <button
              onClick={() => triggerZenTone('wave')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                isPlayingSound && soundType === 'wave'
                  ? 'bg-natural-accent text-white border-natural-accent'
                  : 'bg-natural-beige-light text-natural-text border-natural-border hover:border-natural-accent'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sky-600" />
              <span>{isVi ? 'Sóng biển Mỹ Khê' : 'My Khe Ocean'}</span>
            </button>
          </div>
        </div>

        {/* Oracle Deck Stage */}
        <div className="max-w-2xl mx-auto text-center relative min-h-[420px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!selectedCard && !isFlipping && (
              <motion.div
                key="deck"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  whileHover={{ y: -8, rotate: 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDrawOracle}
                  className="w-64 h-96 rounded-3xl bg-gradient-to-br from-natural-accent via-natural-text to-[#2B2B1E] p-1.5 shadow-2xl cursor-pointer border-2 border-natural-gold/40 relative group"
                >
                  <div className="w-full h-full rounded-[20px] border border-white/20 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden bg-black/20 backdrop-blur-2xs">
                    {/* Card back mystic pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E3B04B_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="p-4 rounded-full border border-natural-gold/50 bg-natural-gold/10 mb-6 group-hover:scale-110 transition duration-500">
                      <Eye className="w-10 h-10 text-natural-gold" />
                    </div>

                    <h4 className="font-serif text-xl font-bold tracking-wider text-natural-bg">
                      {isVi ? 'BỐC THẺ THẦN KHÍ' : 'DRAW ORACLE CARD'}
                    </h4>
                    
                    <p className="text-[10px] text-natural-gold uppercase tracking-[0.2em] mt-3 font-mono">
                      {isVi ? 'Chạm để rút thẻ ngẫu nhiên' : 'Click to reveal destiny'}
                    </p>

                    <div className="absolute bottom-6 flex gap-1 items-center opacity-60 text-[9px] uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-natural-gold" />
                      <span>VietCharm AI Heritage</span>
                    </div>
                  </div>
                </motion.div>
                
                <p className="text-xs text-natural-text/60 mt-6 italic font-serif">
                  {isVi ? '*Mỗi thẻ ẩn chứa một bí mật ẩm thực & mã giảm giá thật áp dụng ngay hôm nay' : '*Each card unlocks true hidden offers valid for immediate bookings'}
                </p>
              </motion.div>
            )}

            {isFlipping && (
              <motion.div
                key="flipping"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="w-64 h-96 rounded-3xl bg-natural-accent border-4 border-natural-gold shadow-2xl flex items-center justify-center text-white"
              >
                <Sparkles className="w-12 h-12 animate-ping text-natural-gold" />
              </motion.div>
            )}

            {selectedCard && !isFlipping && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-lg bg-white rounded-3xl border-2 border-natural-accent/30 shadow-2xl overflow-hidden text-left"
              >
                <div className={`p-6 md:p-8 bg-gradient-to-r ${selectedCard.bgGradient} text-white relative`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                        {isVi ? selectedCard.elementVi : selectedCard.elementEn}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold mt-3 text-natural-bg">
                        {isVi ? selectedCard.nameVi : selectedCard.nameEn}
                      </h3>
                    </div>
                    <Flame className={`w-8 h-8 ${selectedCard.iconColor}`} />
                  </div>

                  <blockquote className="mt-4 pt-4 border-t border-white/20 font-serif italic text-sm md:text-base text-stone-200 leading-relaxed">
                    "{isVi ? selectedCard.poemVi : selectedCard.poemEn}"
                  </blockquote>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Prescription */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-natural-beige text-natural-accent shrink-0 mt-0.5">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-natural-text tracking-wider">{isVi ? 'Món ăn thanh tẩy buồn phiền:' : 'Culinary Soul Remedy:'}</h5>
                        <p className="text-xs md:text-sm font-medium text-natural-text/90 mt-1">{isVi ? selectedCard.foodRemedyVi : selectedCard.foodRemedyEn}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-natural-beige text-natural-accent shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-natural-text tracking-wider">{isVi ? 'Tọa độ bí mật dành riêng cho bạn:' : 'Secret Member Spot:'}</h5>
                        <p className="text-xs md:text-sm font-medium text-natural-text/90 mt-1">{isVi ? selectedCard.secretSpotVi : selectedCard.secretSpotEn}</p>
                        <p className="text-[10px] font-mono text-natural-accent mt-0.5">⏰ {isVi ? 'Giờ ánh sáng thiên thần:' : 'Golden Hour:'} {selectedCard.goldenHour}</p>
                      </div>
                    </div>
                  </div>

                  {/* Voucher Reward Box */}
                  <div className="bg-natural-cream border-2 border-dashed border-natural-accent/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-natural-gold text-white">
                        <Gift className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-natural-accent uppercase tracking-wider block">{isVi ? 'Phần thưởng lữ hành bốc được' : 'Divination Reward'}</span>
                        <span className="text-lg font-mono font-black text-natural-text tracking-widest">{selectedCard.voucherCode}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onApplyVoucher) onApplyVoucher(selectedCard.voucherCode, selectedCard.discount);
                        showToast({
                          type: 'success',
                          title: isVi ? 'Đã lưu mã giảm giá' : 'Voucher saved',
                          message: isVi
                            ? `Mã ${selectedCard.voucherCode} giảm ${selectedCard.discount}% đã sẵn sàng cho giỏ combo.`
                            : `${selectedCard.voucherCode} gives ${selectedCard.discount}% off your bundle.`,
                        });
                      }}
                      className="bg-natural-accent hover:bg-natural-olive text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer ml-auto"
                    >
                      {isVi ? `Nhận giảm ${selectedCard.discount}%` : `Claim ${selectedCard.discount}% Off`}
                    </button>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="text-xs font-bold text-natural-accent hover:text-natural-text flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Gieo quẻ lại lần nữa' : 'Draw another card'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
