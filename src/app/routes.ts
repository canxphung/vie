/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ViewId } from '@/constants/views';

export interface RouteState {
  view: ViewId;
  provinceId?: string;
}

const VIEW_PATHS: Record<Exclude<ViewId, 'province'>, string> = {
  regions: '/',
  provinces: '/discover',
  'ai-explorer': '/ai-explorer',
  'blind-travel': '/blind-travel',
  'trip-room': '/trip-room',
  'group-blind-travel': '/group-trip',
  profile: '/profile',
  taxi: '/taxi',
  tours: '/tours',
  handbook: '/handbook',
  'partnership-register': '/partnership',
  admin: '/admin',
  'recently-viewed': '/recently-viewed',
  'nearby-places': '/nearby-places',
  'all-services': '/services',
  'service-provinces': '/services/provinces',
  cart: '/cart',
  login: '/login',
  register: '/register',
  'forgot-password': '/forgot-password',
  'not-found': '/404',
};

const PATH_VIEWS = new Map<string, ViewId>(
  Object.entries(VIEW_PATHS).map(([view, path]) => [path, view as ViewId]),
);

const PATH_ALIASES: Record<string, ViewId> = {
  '/home': 'regions',
  '/regions': 'regions',
  '/provinces': 'provinces',
  '/services/all': 'all-services',
  '/basket': 'cart',
  '/checkout': 'cart',
  '/partner': 'partnership-register',
  '/partnership-register': 'partnership-register',
  '/signup': 'register',
  '/signin': 'login',
  '/auth/login': 'login',
  '/auth/register': 'register',
  '/auth/forgot-password': 'forgot-password',
  '/forgot': 'forgot-password',
};

function normalizePath(pathname: string): string {
  const path = pathname.split('?')[0].split('#')[0] || '/';
  if (path !== '/' && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function routeToState(pathname: string): RouteState {
  const path = normalizePath(pathname);

  if (path.startsWith('/province/')) {
    const [, , provinceId] = path.split('/');
    return { view: 'province', provinceId: provinceId || 'quang-nam' };
  }

  const directView = PATH_VIEWS.get(path) || PATH_ALIASES[path];
  return { view: directView || 'not-found' };
}

export function viewToPath(view: ViewId, provinceId = 'quang-nam'): string {
  if (view === 'province') return `/province/${provinceId}`;
  return VIEW_PATHS[view] || '/';
}
