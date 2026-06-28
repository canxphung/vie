/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'vi' | 'en';

export interface Province {
  id: string;
  name: string;
  image: string;
  description: string;
  active: boolean;
  tagline: string;
}

export interface Attraction {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviewsCount: string;
  lat: number;
  lng: number;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewsCount: string;
  pricePerNight: number;
  description: string;
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  rating: number;
  reviewsCount: string;
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'motorbike' | 'car';
  pricePerDay: number;
  image: string;
  specs: string;
  rating: number;
}

export interface BookingCartItem {
  id: string;
  type: 'hotel' | 'activity' | 'vehicle';
  name: string;
  price: number;
  quantity: number;
  image: string;
  details?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  locale: 'vi' | 'en';
}
