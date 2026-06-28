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

// 5. COMPONENT: TRAVEL HANDBOOK / GUIDEBOOK
// ==========================================
type HandbookTab = 'history' | 'lantern' | 'culinary' | 'tips' | 'banahills' | 'hue_royal' | 'haivan_pass' | 'tailoring';

export function TravelHandbook({ language }: { language: Language }) {
  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = React.useState<HandbookTab>('history');

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
    <div className="max-w-5xl mx-auto px-4 py-8 text-natural-text space-y-8 bg-white border border-natural-border rounded-3xl shadow-xs">
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
            onClick={() => setActiveTab(t.id as HandbookTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
              activeTab === t.id 
                ? 'bg-natural-accent text-white shadow-xs' 
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
