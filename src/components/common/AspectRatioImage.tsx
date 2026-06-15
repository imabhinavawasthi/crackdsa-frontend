import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface AspectRatioImageProps {
  src?: string | null;
  alt: string;
  ratio?: string; // e.g., '16/9', '4/3', '1/1'
  className?: string;
  fallbackIconSize?: number;
}

export default function AspectRatioImage({ 
  src, 
  alt, 
  ratio = '16/9', 
  className = '',
  fallbackIconSize = 32
}: AspectRatioImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const hasValidSrc = typeof src === 'string' && src.trim() !== '';
  const showFallback = error || !hasValidSrc;

  return (
    <div 
      className={`relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Loading Skeleton */}
      {!loaded && !showFallback && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      
      {/* Fallback View */}
      {showFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
          <ImageIcon size={fallbackIconSize} strokeWidth={1.5} />
        </div>
      )}

      {/* Actual Image */}
      {!showFallback && (
        <img
          src={src as string}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
