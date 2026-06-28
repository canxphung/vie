import React from 'react';
import { MapPin, Search, Star, Heart, Compass, Navigation, Eye, MessageSquare, ChevronLeft, ChevronRight, X, PlusCircle } from 'lucide-react';
import { Language } from '../types';

interface NearbyPlacesProps {
  language: Language;
  onBackToHome: () => void;
  onViewItem?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
  favorites?: any[];
  onToggleFavorite?: (item: { id: string; type: string; name: string; image: string; price: number; description?: string }) => void;
}

interface PlaceReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface Place {
  id: string;
  nameVi: string;
  nameEn: string;
  categoryVi: 'Di sản văn hóa' | 'Bãi biển & Thiên nhiên' | 'Trải nghiệm sinh thái' | 'Làng nghề truyền thống';
  categoryEn: 'Cultural Heritage' | 'Beach & Nature' | 'Eco-experience' | 'Traditional Craft';
  descriptionVi: string;
  descriptionEn: string;
  distance: string; // from VietCharm Hoi An
  duration: string; // travel duration
  coordinates: { x: number; y: number }; // simulated SVG coordinate positions
  images: string[];
  reviews: PlaceReview[];
  rating: number;
  totalReviews: number;
  historyVi: string;
  historyEn: string;
}

const INITIAL_PLACES: Place[] = [
  {
    id: 'pho-co-hoi-an',
    nameVi: 'Phố Cổ Hội An',
    nameEn: 'Hoi An Ancient Town',
    categoryVi: 'Di sản văn hóa',
    categoryEn: 'Cultural Heritage',
    descriptionVi: 'Phố cổ Hội An là một đô thị cổ nằm ở hạ lưu sông Thu Bồn, thuộc đồng bằng ven biển tỉnh Quảng Nam, Việt Nam, cách thành phố Đà Nẵng khoảng 30 km về phía Nam. Nhờ những yếu tố địa lý và khí hậu thuận lợi, Hội An từng là một thương cảng quốc tế sầm uất.',
    descriptionEn: 'Hoi An Ancient Town is an exceptionally well-preserved example of a South-East Asian trading port from the 15th to the 19th century. Its buildings and its street plan reflect the influences, both indigenous and foreign, that have combined to produce this unique heritage site.',
    distance: '1.2 km',
    duration: '5 phút đi bộ / 5 mins walk',
    coordinates: { x: 120, y: 150 },
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    totalReviews: 128,
    historyVi: 'Được UNESCO công nhận là Di sản văn hóa thế giới vào năm 1999. Nổi tiếng với những dãy nhà cổ sơn vàng, lồng đèn lung linh về đêm và các hội quán kiến trúc Hoa - Nhật hòa quyện.',
    historyEn: 'Designated as a UNESCO World Heritage Site in 1999. Famed for its golden-painted heritage houses, glowing lanterns at night, and an exquisite architectural fusion of Chinese, Japanese, and Vietnamese styles.',
    reviews: [
      { id: 'r1', author: 'Lê Minh', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-20', comment: 'Không gian cổ kính tuyệt vời, đặc biệt là vào buổi tối khi đèn lồng được thắp sáng rực rỡ.' },
      { id: 'r2', author: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-18', comment: 'An absolute masterpiece of historic preservation. The food here is outstanding too!' }
    ]
  },
  {
    id: 'chua-cau',
    nameVi: 'Chùa Cầu (Cầu Nhật Bản)',
    nameEn: 'The Japanese Covered Bridge',
    categoryVi: 'Di sản văn hóa',
    categoryEn: 'Cultural Heritage',
    descriptionVi: 'Chùa Cầu là chiếc cầu cổ trong khu phố cổ Hội An. Chiếc cầu này còn có tên là Cầu Nhật Bản hoặc Lai Viễn Kiều. Công trình này được các thương nhân Nhật Bản khởi dựng vào khoảng đầu thế kỷ XVII, mang đậm nét kiến trúc độc đáo giao thoa.',
    descriptionEn: 'The Japanese Covered Bridge is one of Hoi An\'s most iconic attractions. Built in the early 17th century by Japanese merchants, it features a unique combination of bridge and temple architecture, symbolizing historical friendship.',
    distance: '0.8 km',
    duration: '3 phút đi bộ / 3 mins walk',
    coordinates: { x: 100, y: 160 },
    images: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    totalReviews: 95,
    historyVi: 'Cây cầu lịch sử này được in trên tờ tiền polymer 20.000 VND của Việt Nam. Đây là biểu tượng văn hóa vô giá của vùng đất di sản Hội An.',
    historyEn: 'This historic bridge is featured on Vietnam\'s 20,000 VND polymer banknote. It represents the priceless cultural soul of the Hoi An heritage region.',
    reviews: [
      { id: 'r3', author: 'Nguyễn Thảo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', rating: 4, date: '2026-06-15', comment: 'Kiến trúc gỗ rất tinh xảo, địa điểm check-in không thể bỏ qua.' }
    ]
  },
  {
    id: 'rung-dua-bay-mau',
    nameVi: 'Rừng Dừa Bảy Mẫu',
    nameEn: 'Bay Mau Coconut Forest',
    categoryVi: 'Trải nghiệm sinh thái',
    categoryEn: 'Eco-experience',
    descriptionVi: 'Rừng dừa Bảy Mẫu thuộc xã Cẩm Thanh, thành phố Hội An. Trải nghiệm bơi thuyền thúng len lỏi trong rừng dừa nước bạt ngàn và thưởng thức màn múa thúng xoay vòng ngoạn mục từ những người dân chài mộc mạc địa phương.',
    descriptionEn: 'Located in Cam Thanh village, Bay Mau Coconut Forest offers an immersive experience of rowing traditional bamboo basket boats through emerald waterways flanked by coconut palms, alongside high-energy spinning performances.',
    distance: '4.5 km',
    duration: '10 phút taxi / 10 mins taxi',
    coordinates: { x: 320, y: 280 },
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    totalReviews: 210,
    historyVi: 'Là căn cứ địa cách mạng kiên cường trong kháng chiến chống Mỹ cứu nước, ngày nay rừng dừa đã trở thành một điểm du lịch sinh thái sông nước độc nhất vô nhị vùng Duyên hải miền Trung.',
    historyEn: 'Once a strategic revolutionary base in wartime history, it has transformed into a globally renowned river eco-tourism destination highlighting Hoi An\'s rustic maritime hospitality.',
    reviews: [
      { id: 'r4', author: 'Quốc Bảo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-22', comment: 'Cực kỳ vui nhộn! Trải nghiệm múa thúng xoay vòng rất đáng tiền và phấn khích.' }
    ]
  },
  {
    id: 'bai-bien-an-bang',
    nameVi: 'Bãi Biển An Bàng',
    nameEn: 'An Bang Beach',
    categoryVi: 'Bãi biển & Thiên nhiên',
    categoryEn: 'Beach & Nature',
    descriptionVi: 'Bãi biển An Bàng nằm trong top những bãi biển đẹp nhất Châu Á. Nơi đây giữ được vẻ hoang sơ, bãi cát trắng mịn màng và nước biển trong xanh, thích hợp cho việc tắm nắng, thưởng thức hải sản và nghe tiếng sóng vỗ bình yên.',
    descriptionEn: 'An Bang Beach is celebrated as one of Asia\'s most tranquil and beautiful coastal sanctuaries. Characterized by white soft sand, clean breaking waves, and trendy beachfront restaurants serving delicious fresh seafood.',
    distance: '3.8 km',
    duration: '8 phút xe máy / 8 mins ride',
    coordinates: { x: 260, y: 70 },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    totalReviews: 180,
    historyVi: 'Từng lọt top 50 bãi biển đẹp nhất hành tinh do CNNGo bình chọn, An Bàng đem lại sự kết hợp tuyệt vời giữa dịch vụ nghỉ dưỡng ven biển bình yên và ẩm thực bản địa ngon miệng.',
    historyEn: 'Previously voted as one of CNNGo\'s top 50 best beaches in the world, An Bang offers an unhurried, serene escape with spectacular sunrise views over the East Sea.',
    reviews: [
      { id: 'r5', author: 'Elena Petrova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-19', comment: 'Super clean beach, very relaxed atmosphere compared to Da Nang. Love the beach bars!' }
    ]
  },
  {
    id: 'lang-gom-thanh-ha',
    nameVi: 'Làng Gốm Thanh Hà',
    nameEn: 'Thanh Ha Pottery Village',
    categoryVi: 'Làng nghề truyền thống',
    categoryEn: 'Traditional Craft',
    descriptionVi: 'Làng gốm Thanh Hà hình thành từ cuối thế kỷ XV bên dòng sông Thu Bồn ấm áp phù sa. Đến đây, du khách được tận mắt chiêm ngưỡng các nghệ nhân tạo hình đất sét điêu luyện và tự tay làm một sản phẩm gốm đất nung mộc mạc của riêng mình.',
    descriptionEn: 'Dating back to the late 15th century, Thanh Ha Pottery Village is located along the Thu Bon River. Visitors can observe heritage artisans sculpting wet clay on rotating pottery wheels using ancestral techniques and craft their own souvenirs.',
    distance: '3.0 km',
    duration: '7 phút đi xe / 7 mins drive',
    coordinates: { x: 50, y: 220 },
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595231712426-63e2672722af?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    totalReviews: 76,
    historyVi: 'Nổi tiếng với các sản phẩm đất nung màu đỏ gạch tự nhiên siêu bền, từng dâng tiến lên triều đình nhà Nguyễn. Có công viên đất nung Thanh Hà lớn nhất cả nước trưng bày hàng ngàn tác phẩm độc đáo.',
    historyEn: 'Famous for its resilient, natural reddish terracotta vessels which were once tribute objects for the Royal Court of the Nguyen Dynasty. Home to the largest clay-based architectural park in Vietnam.',
    reviews: [
      { id: 'r6', author: 'Trần Hòa', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-12', comment: 'Trải nghiệm tự tay xoay gốm rất thú vị, giá vé hợp lý và người dân vô cùng thân thiện.' }
    ]
  },
  {
    id: 'lang-rau-tra-que',
    nameVi: 'Làng Rau Trà Quế',
    nameEn: 'Tra Que Vegetable Village',
    categoryVi: 'Làng nghề truyền thống',
    categoryEn: 'Traditional Craft',
    descriptionVi: 'Làng rau Trà Quế nức tiếng với phương pháp trồng rau hữu cơ truyền thống sử dụng rong biển vớt từ đầm Trà Quế để bón. Bạn sẽ được nhập vai làm nông dân thực thụ, học cách xới đất, gieo hạt, tưới nước bằng quang gánh và thưởng thức món Tam Hữu thơm lừng.',
    descriptionEn: 'Tra Que Vegetable Village is worldwide famous for organic, soil-fertilized herbs nourished with natural pond algae. Visitors can dress in farmer clothes, try manual watering using shoulder poles, and enjoy fresh cooking masterclasses.',
    distance: '3.2 km',
    duration: '6 phút đi xe / 6 mins drive',
    coordinates: { x: 200, y: 90 },
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    totalReviews: 89,
    historyVi: 'Rau Trà Quế thơm lừng tự nhiên nhờ thổ nhưỡng và quy trình sạch khép kín, là nguyên liệu quan trọng tạo nên linh hồn cho món Cao Lầu, Mì Quảng Hội An huyền thoại.',
    historyEn: 'Tra Que herbs carry a distinctive sharp aroma due to pristine soil and unique organic seaweed fertilizers, providing the essential aroma that acts as the soul for Hoi An\'s legendary Cao Lau noodles.',
    reviews: [
      { id: 'r7', author: 'Mai Vy', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 5, date: '2026-06-14', comment: 'Rau rất sạch và thơm phức, được trải nghiệm tưới nước như nông dân xưa vô cùng ý nghĩa.' }
    ]
  }
];

export default function NearbyPlaces({ 
  language, 
  onBackToHome, 
  onViewItem,
  favorites = [],
  onToggleFavorite
}: NearbyPlacesProps) {
  const [places, setPlaces] = React.useState<Place[]>(() => {
    const saved = localStorage.getItem('vc_nearby_places');
    return saved ? JSON.parse(saved) : INITIAL_PLACES;
  });

  const isVi = language === 'vi';
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [activePlace, setActivePlace] = React.useState<Place | null>(null);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  
  // Review inputs
  const [reviewerName, setReviewerName] = React.useState('');
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');

  const savePlaces = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
    localStorage.setItem('vc_nearby_places', JSON.stringify(newPlaces));
  };

  const categories = [
    { value: 'All', labelVi: 'Tất cả địa điểm', labelEn: 'All places' },
    { value: 'Di sản văn hóa', labelVi: 'Di sản văn hóa', labelEn: 'Cultural Heritage' },
    { value: 'Bãi biển & Thiên nhiên', labelVi: 'Bãi biển & Thiên nhiên', labelEn: 'Beach & Nature' },
    { value: 'Trải nghiệm sinh thái', labelVi: 'Trải nghiệm sinh thái', labelEn: 'Eco-experience' },
    { value: 'Làng nghề truyền thống', labelVi: 'Làng nghề truyền thống', labelEn: 'Traditional Craft' },
  ];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      place.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.descriptionVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || 
      place.categoryVi === selectedCategory || 
      place.categoryEn === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim() || !activePlace) return;

    const newReview: PlaceReview = {
      id: `review-${Date.now()}`,
      author: reviewerName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment
    };

    const updatedReviews = [newReview, ...activePlace.reviews];
    const newAverageRating = Number(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    const updatedPlaces = places.map(p => {
      if (p.id === activePlace.id) {
        return {
          ...p,
          reviews: updatedReviews,
          rating: newAverageRating,
          totalReviews: updatedReviews.length
        };
      }
      return p;
    });

    savePlaces(updatedPlaces);
    
    // Update local state for active place view
    const updatedActive = updatedPlaces.find(p => p.id === activePlace.id);
    if (updatedActive) {
      setActivePlace(updatedActive);
    }

    // Reset form
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div id="nearby-places-container" className="w-full bg-[#FAF8F5] text-[#4A4A35] min-h-screen py-12 px-4 md:px-8">
      {/* Header section with branding */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E6E2D3] pb-6 gap-4">
          <div>
            <span className="text-[#8C7A5B] font-mono font-bold tracking-widest text-xs uppercase flex items-center gap-1.5 mb-1">
              <Compass className="w-4 h-4 text-[#E3B04B] animate-spin-slow" />
              {isVi ? 'Hệ thống khám phá lân cận Hội An' : 'Hoi An Nearby Discovery System'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 leading-tight">
              {isVi ? 'Khám Phá Địa Điểm Lân Cận' : 'Explore Nearby Places'}
            </h2>
            <p className="text-xs text-stone-500 max-w-xl mt-1.5">
              {isVi 
                ? 'Tìm kiếm và khám phá các địa danh, thắng cảnh và làng nghề cổ truyền xung quanh hệ thống VietCharm Hội An với ước tính quãng đường cụ thể.'
                : 'Search and discover legendary landmarks, sandy beaches, and traditional craft villages around VietCharm Hoi An.'}
            </p>
          </div>
          <button 
            onClick={onBackToHome}
            className="self-start md:self-center px-5 py-2.5 rounded-full border border-[#E6E2D3] bg-white text-stone-600 hover:text-[#8C7A5B] hover:border-[#8C7A5B] transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            &larr; {isVi ? 'Quay lại Trang chủ' : 'Back to Home'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Search, Categories & Place Cards Directory (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Search and Category Filter hub */}
          <div className="bg-white border border-[#E6E2D3] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder={isVi ? 'Tìm tên địa điểm, làng nghề, bãi biển...' : 'Search landmark name, village, beach...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E6E2D3] focus:border-[#8C7A5B] focus:outline-none rounded-2xl py-3 pl-11 pr-4 text-xs font-medium placeholder-stone-400 transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                    selectedCategory === cat.value
                      ? 'bg-[#8C7A5B] text-white border-[#8C7A5B]'
                      : 'bg-[#FAF8F5] text-stone-500 hover:text-[#8C7A5B] border-[#E6E2D3] hover:border-[#8C7A5B]'
                  }`}
                >
                  {isVi ? cat.labelVi : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => {
                const isActive = activePlace?.id === place.id;
                return (
                  <div 
                    key={place.id}
                    onClick={() => {
                      setActivePlace(place);
                      setActiveImageIdx(0);
                    }}
                    className={`bg-white border rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                      isActive 
                        ? 'ring-2 ring-[#8C7A5B] border-transparent shadow-md' 
                        : 'border-[#E6E2D3] hover:border-[#8C7A5B] hover:shadow-md'
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <img 
                        src={place.images[0]} 
                        alt={isVi ? place.nameVi : place.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite({
                              id: place.id,
                              type: 'nearby-place',
                              name: isVi ? place.nameVi : place.nameEn,
                              image: place.images[0],
                              price: 0,
                              description: isVi ? place.descriptionVi : place.descriptionEn
                            });
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition group/fav cursor-pointer z-10"
                          title={isVi ? 'Thêm vào yêu thích' : 'Add to favorites'}
                        >
                          <Heart 
                            className={`w-4 h-4 transition duration-200 ${
                              favorites.some(x => x.id === place.id) 
                                ? 'text-rose-600 fill-rose-600' 
                                : 'text-stone-400 group-hover/fav:text-rose-500'
                            }`} 
                          />
                        </button>
                      )}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider text-[#8C7A5B] shadow-xs">
                        {isVi ? place.categoryVi : place.categoryEn}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#8C7A5B]/90 text-white px-2 py-0.5 rounded-md text-[9px] font-mono">
                        📍 {place.distance}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-serif font-black text-stone-800 text-sm group-hover:text-[#8C7A5B] transition-colors leading-tight">
                          {isVi ? place.nameVi : place.nameEn}
                        </h3>
                        <div className="flex items-center gap-0.5 text-amber-500 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {isVi ? place.descriptionVi : place.descriptionEn}
                      </p>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-[#8C7A5B]" />
                          <span>{place.duration}</span>
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewItem) {
                              onViewItem({
                                id: place.id,
                                type: 'nearby-place',
                                name: isVi ? place.nameVi : place.nameEn,
                                image: place.images[0],
                                price: 0,
                                description: isVi ? place.descriptionVi : place.descriptionEn,
                                rating: place.rating,
                                reviewsCount: `${place.totalReviews}`,
                                duration: place.duration,
                                distance: place.distance,
                                history: isVi ? place.historyVi : place.historyEn,
                                coordinates: place.coordinates
                              } as any);
                            }
                          }}
                          className="text-[#8C7A5B] hover:text-[#5A5A40] font-bold uppercase tracking-wider text-[9px] hover:underline cursor-pointer"
                        >
                          {isVi ? 'Xem chi tiết &' : 'Details &'} &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white border border-[#E6E2D3] rounded-3xl p-12 text-center">
                <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-400 font-bold text-xs uppercase tracking-wider">
                  {isVi ? 'Không tìm thấy địa điểm nào' : 'No places found'}
                </p>
                <p className="text-stone-400 text-[10px] mt-1">
                  {isVi ? 'Thử tìm với từ khóa khác xem nhé!' : 'Try searching with another keyword!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Showcase & Map Navigation (5 cols) */}
        <div className="lg:col-span-5">
          {activePlace ? (
            <div className="bg-white border border-[#E6E2D3] rounded-3xl shadow-lg sticky top-6 overflow-hidden">
              {/* Image slideshow with controls */}
              <div className="relative h-64 bg-stone-900">
                <img 
                  src={activePlace.images[activeImageIdx]} 
                  alt={isVi ? activePlace.nameVi : activePlace.nameEn}
                  className="w-full h-full object-cover opacity-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Close Button */}
                <button 
                  onClick={() => setActivePlace(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Banner overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-300 mb-1">
                    {isVi ? activePlace.categoryVi : activePlace.categoryEn}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-white leading-tight">
                    {isVi ? activePlace.nameVi : activePlace.nameEn}
                  </h3>
                </div>

                {/* Image Navigator dots */}
                {activePlace.images.length > 1 && (
                  <div className="absolute top-4 left-4 flex gap-1 bg-black/40 px-2 py-1 rounded-full">
                    {activePlace.images.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${activeImageIdx === i ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Scrollable details wrapper */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-340px)] overflow-y-auto custom-scrollbar">
                
                {/* Distance & Duration badge board */}
                <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] border border-[#E6E2D3] p-3 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider block">{isVi ? 'Quãng đường' : 'Distance'}</span>
                    <span className="text-sm font-serif font-black text-[#8C7A5B]">📍 {activePlace.distance}</span>
                  </div>
                  <div className="border-l border-[#E6E2D3] text-center">
                    <span className="text-[9px] uppercase text-stone-400 font-bold tracking-wider block">{isVi ? 'Thời gian di chuyển' : 'Travel Time'}</span>
                    <span className="text-[11px] font-semibold text-stone-700 block mt-0.5">{activePlace.duration}</span>
                  </div>
                </div>

                {/* Core description text */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                    <Compass className="w-4 h-4 text-[#8C7A5B]" />
                    {isVi ? 'Giới thiệu chung' : 'Overview'}
                  </h4>
                  <p className="text-[11px] text-stone-600 leading-relaxed text-justify">
                    {isVi ? activePlace.descriptionVi : activePlace.descriptionEn}
                  </p>
                </div>

                {/* Historical Trivia box */}
                <div className="bg-amber-50/40 border border-dashed border-amber-300 rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase text-[#8C7A5B] tracking-wider flex items-center gap-1.5">
                    💡 {isVi ? 'Có thể bạn chưa biết?' : 'Did you know?'}
                  </h4>
                  <p className="text-[11px] text-[#4A4A35]/90 italic leading-relaxed">
                    {isVi ? activePlace.historyVi : activePlace.historyEn}
                  </p>
                </div>

                {/* Explore Full Immersive details action */}
                <button
                  onClick={() => {
                    if (onViewItem) {
                      onViewItem({
                        id: activePlace.id,
                        type: 'nearby-place',
                        name: isVi ? activePlace.nameVi : activePlace.nameEn,
                        image: activePlace.images[0],
                        price: 0,
                        description: isVi ? activePlace.descriptionVi : activePlace.descriptionEn,
                        rating: activePlace.rating,
                        reviewsCount: `${activePlace.totalReviews}`,
                        duration: activePlace.duration,
                        distance: activePlace.distance,
                        history: isVi ? activePlace.historyVi : activePlace.historyEn,
                        coordinates: activePlace.coordinates
                      } as any);
                    }
                  }}
                  className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
                  <span>{isVi ? 'Xem Chi Tiết Lớn & Trải Nghiệm' : 'Immersive Details & Experiences'}</span>
                </button>

                {/* Map position coordinate simulation (Requirement: "Xem vị trí trên bản đồ") */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {isVi ? 'Vị trí trên sơ đồ VietCharm' : 'Sitemap Navigation Location'}
                    </h4>
                    <span className="text-[9px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                      X: {activePlace.coordinates.x} | Y: {activePlace.coordinates.y}
                    </span>
                  </div>
                  
                  {/* Simulated Dynamic Sitemap Visualizer */}
                  <div className="relative h-44 bg-emerald-50/50 border border-emerald-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                    {/* SVG grid lines */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    {/* Simplified Map Paths illustration */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Connection Route */}
                      <path 
                        d={`M 180 100 L ${activePlace.coordinates.x} ${activePlace.coordinates.y}`} 
                        fill="none" 
                        stroke="#8C7A5B" 
                        strokeWidth="2.5" 
                        strokeDasharray="5,4" 
                        className="animate-pulse"
                      />
                      
                      {/* Central Vietnam Coast Line (Decorative mock curve) */}
                      <path 
                        d="M 50 10 Q 150 110 320 220" 
                        fill="none" 
                        stroke="rgba(14,116,144,0.15)" 
                        strokeWidth="8" 
                      />
                    </svg>

                    {/* Anchor 1: VietCharm Hoi An resort headquarters */}
                    <div 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                      style={{ left: '180px', top: '100px' }}
                    >
                      <div className="relative">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                        <div className="w-4 h-4 bg-amber-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </div>
                      </div>
                      <span className="mt-1 bg-amber-950 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md uppercase whitespace-nowrap shadow-xs">
                        🏨 VietCharm Resort
                      </span>
                    </div>

                    {/* Anchor 2: Target landmark position */}
                    <div 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                      style={{ left: `${activePlace.coordinates.x}px`, top: `${activePlace.coordinates.y}px` }}
                    >
                      <div className="relative">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                          <MapPin className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="mt-1 bg-red-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-xs">
                        📍 {isVi ? activePlace.nameVi : activePlace.nameEn}
                      </span>
                    </div>

                    {/* Map Labels */}
                    <div className="absolute top-2 left-2 text-[8px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {isVi ? 'Đường thủy Thu Bồn' : 'Thu Bon Waterway System'}
                    </div>
                  </div>
                </div>

                {/* Reviews List & interactive rating form (Requirement: "Xem đánh giá địa điểm") */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#8C7A5B]" />
                      {isVi ? 'Đánh giá từ du khách' : 'Traveler Reviews'} ({activePlace.reviews.length})
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded">
                      ★ {activePlace.rating}
                    </span>
                  </h4>

                  {/* Render Review Items */}
                  <div className="space-y-3">
                    {activePlace.reviews.map(review => (
                      <div key={review.id} className="bg-stone-50 p-3 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-2">
                            <img src={review.avatar} alt={review.author} className="w-5 h-5 rounded-full object-cover" />
                            <span className="font-bold text-stone-700">{review.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-stone-400">
                            <span className="text-amber-500 font-bold text-[9px]">{'★'.repeat(review.rating)}</span>
                            <span>• {review.date}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed pl-7 italic">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add review form */}
                  <form onSubmit={handleAddReview} className="bg-[#FAF8F5] border border-[#E6E2D3] p-4 rounded-2xl space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                      ✍️ {isVi ? 'Để lại trải nghiệm của bạn' : 'Write a review'}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder={isVi ? 'Tên của bạn...' : 'Your name...'}
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="bg-white border border-[#E6E2D3] text-xs px-3 py-2 rounded-xl focus:border-[#8C7A5B] focus:outline-none"
                      />
                      <div className="flex items-center gap-1.5 bg-white border border-[#E6E2D3] px-3 py-2 rounded-xl">
                        <span className="text-[10px] text-stone-400 font-bold uppercase">{isVi ? 'Điểm:' : 'Rating:'}</span>
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
                      placeholder={isVi ? 'Bạn thích điều gì nhất tại địa điểm này? Chia sẻ cảm nghĩ nhé...' : 'What did you enjoy most about this place?...'}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white border border-[#E6E2D3] text-xs p-3 rounded-xl focus:border-[#8C7A5B] focus:outline-none resize-none leading-relaxed"
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#8C7A5B] hover:bg-[#5A5A40] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition cursor-pointer"
                    >
                      {isVi ? 'Gửi đánh giá' : 'Submit Review'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] border border-dashed border-[#E6E2D3] rounded-3xl p-16 text-center sticky top-6">
              <Compass className="w-16 h-16 text-stone-300 mx-auto mb-4 animate-bounce-slow" />
              <h4 className="font-serif font-black text-stone-800 text-sm uppercase tracking-wider">
                {isVi ? 'Chưa chọn địa điểm' : 'No Place Selected'}
              </h4>
              <p className="text-[11px] text-stone-400 max-w-xs mx-auto mt-2 leading-relaxed">
                {isVi 
                  ? 'Vui lòng nhấn chọn một địa điểm trong danh sách bên trái để khám phá hình ảnh, lịch sử truyền kỳ, toạ độ di chuyển và đánh giá chi tiết.'
                  : 'Please select a place on the left to inspect stunning images, historical trivia, localized routes, and traveler testimonials.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
