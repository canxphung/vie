/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Heart, Star } from 'lucide-react';
import { Container, Reveal } from '@/components/ui';
import type { Attraction, Language, ViewableItem } from '@/types';

interface FeaturedAttractionsProps {
  language: Language;
  title: string;
  subtitle: string;
  viewAllLabel: string;
  attractions: Attraction[];
  favorites: ViewableItem[];
  onViewAll: () => void;
  onViewItem: (item: ViewableItem) => void;
  onToggleFavorite: (item: ViewableItem) => void;
}

export function FeaturedAttractions({
  language,
  title,
  subtitle,
  viewAllLabel,
  attractions,
  favorites,
  onViewAll,
  onViewItem,
  onToggleFavorite,
}: FeaturedAttractionsProps) {
  return (
    <Container id="featured-attractions-section" className="py-16">
      <Reveal>
        <div className="flex justify-between items-end border-b border-amber-200/50 pb-4 mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-gold-gradient">
              {language === 'vi' ? 'Tuyển chọn nổi bật' : 'Handpicked'}
            </span>
            <h3 className="text-xl md:text-3xl font-serif font-black text-stone-900 tracking-tight uppercase mt-1">{title}</h3>
            <p className="text-stone-500 text-xs mt-1">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="group text-xs font-bold text-amber-700 hover:text-stone-900 transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            {viewAllLabel}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {attractions.map((spot, index) => {
          const item: ViewableItem = {
            id: spot.id,
            type: 'nearby-place',
            name: spot.name,
            image: spot.image,
            price: 0,
            description: spot.description,
          };

          return (
            <Reveal key={spot.id} delay={Math.min(index, 4) * 0.08}>
            <div
              onClick={() => onViewItem(item)}
              className="group h-full bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-luxe-lg border border-stone-150 hover:border-natural-gold/45 transition duration-300 ease-out transform hover:-translate-y-1.5 cursor-pointer"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover transition duration-[600ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item);
                  }}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-natural-bg/95 backdrop-blur-md flex items-center justify-center shadow-sm border border-natural-border hover:scale-110 transition group/fav z-10"
                  title={language === 'vi' ? 'Thêm vào yêu thích' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-4 h-4 transition duration-200 ${
                      favorites.some((x) => x.id === spot.id)
                        ? 'text-rose-600 fill-rose-600'
                        : 'text-stone-400 group-hover/fav:text-rose-500'
                    }`}
                  />
                </button>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-stone-800 flex items-center gap-0.5 border border-stone-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{spot.rating} ({spot.reviewsCount})</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-stone-900 text-sm tracking-tight leading-snug line-clamp-1 transition-colors group-hover:text-natural-accent">{spot.name}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">{spot.description}</p>
              </div>
            </div>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
