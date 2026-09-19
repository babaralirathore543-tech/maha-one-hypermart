// src/components/common/CloudinaryImage.tsx
import React, { useState } from 'react';

// ✅ Detect Cloudinary URL
const isCloudinaryUrl = (url: string): boolean => {
  return url?.includes('res.cloudinary.com') || false;
};

/**
 * ✅ Build optimized Cloudinary URL
 */
const buildCloudinaryUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    effect?: string;
  } = {}
): string => {
  if (!url || !isCloudinaryUrl(url)) return url;

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    effect,
  } = options;

  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  if (effect) parts.push(`e_${effect}`);

  const transformation = parts.join(',');

  return url.replace('/image/upload/', `/image/upload/${transformation}/`);
};

interface CloudinaryImageProps {
  src: string | string[];
  alt: string;
  /** 'small' | 'medium' | 'large' | 'hero' | 'thumbnail' */
  size?: 'small' | 'medium' | 'large' | 'hero' | 'thumbnail';
  className?: string;
  onClick?: () => void;
  lazy?: boolean;
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  onClick,
  lazy = true,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // ✅ Handle array or string
  const getUrl = (): string => {
    if (Array.isArray(src)) {
      return src[0] || '';
    }
    return src || '';
  };

  const imageUrl = getUrl();

  // ✅ Size presets
  const sizePresets = {
    thumbnail: { width: 100, height: 100, crop: 'thumb', quality: 'auto:low' },
    small: { width: 300, height: 300, crop: 'fill', quality: 'auto' },
    medium: { width: 600, height: 600, crop: 'fill', quality: 'auto' },
    large: { width: 1000, height: 1000, crop: 'fill', quality: 'auto:good' },
    hero: { width: 1600, height: 600, crop: 'fill', quality: 'auto:good' },
  };

  const preset = sizePresets[size];

  // ✅ Main optimized URL
  const optimizedUrl = isCloudinaryUrl(imageUrl)
    ? buildCloudinaryUrl(imageUrl, preset)
    : imageUrl;

  // ✅ Placeholder (tiny blurred image)
  const placeholderUrl = isCloudinaryUrl(imageUrl)
    ? buildCloudinaryUrl(imageUrl, {
        width: 20,
        quality: 'auto:low',
        format: 'auto',
        effect: 'blur:2000',
      })
    : '';

  // ✅ Responsive srcset
  const getSrcSet = (): string => {
    if (!isCloudinaryUrl(imageUrl)) return '';

    const sizes = [320, 640, 960, 1280, 1920];
    return sizes
      .map((w) => {
        const transformed = buildCloudinaryUrl(imageUrl, {
          width: w,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        });
        return `${transformed} ${w}w`;
      })
      .join(', ');
  };

  // ✅ Fallback
  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {/* ✅ Placeholder — blurred tiny image */}
      {!loaded && placeholderUrl && (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
          aria-hidden="true"
        />
      )}

      {/* ✅ Main Image */}
      <img
        src={optimizedUrl}
        srcSet={getSrcSet()}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default CloudinaryImage;