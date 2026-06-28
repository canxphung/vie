/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Heart, Star } from 'lucide-react';
import { Container } from '@/components/ui';
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
      <div className="flex justify-between items-end border-b border-amber-200/50 pb-4 mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight uppercase">{title}</h3>
          <p className="text-stone-500 text-xs mt-1">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-amber-700 hover:text-stone-900 transition flex items-center gap-1 cursor-pointer"
        >
          {viewAllLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {attractions.map((spot) => {
          const item: ViewableItem = {
            id: spot.id,
            type: 'nearby-place',
            name: spot.name,
            image: spot.image,
            price: 0,
            description: spot.description,
          };

          return (
            <div
              key={spot.id}
              onClick={() => onViewItem(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-150 transition duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
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
                <h4 className="font-bold text-stone-900 text-sm tracking-tight leading-snug line-clamp-1">{spot.name}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">{spot.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
