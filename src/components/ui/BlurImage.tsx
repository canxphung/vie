/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/lib/cn';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper element (e.g. `absolute inset-0`, `h-44`). */
  wrapperClassName?: string;
}

/**
 * Progressive image: shows a soft shimmering placeholder, then fades + de-blurs
 * the photo once it finishes loading. Falls back gracefully for cached images.
 */
export function BlurImage({ className, wrapperClassName, onLoad, alt = '', ...rest }: BlurImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    // Cached images may already be complete before onLoad can fire.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <span className={cn('relative block overflow-hidden bg-natural-beige', wrapperClassName)}>
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br from-natural-beige via-natural-sand to-natural-border transition-opacity duration-700',
          loaded ? 'opacity-0' : 'animate-pulse opacity-100',
        )}
      />
      <img
        ref={ref}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          'transition-[opacity,filter,transform] duration-700 ease-out',
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md',
          className,
        )}
        {...rest}
      />
    </span>
  );
}
