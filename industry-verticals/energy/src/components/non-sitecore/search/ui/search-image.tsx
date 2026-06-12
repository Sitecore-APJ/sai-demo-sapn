type SearchImageProps = {
  src: string;
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
};

/** Use native img for external Sitecore Search URLs (avoids Next.js /_next/image proxy). */
export function SearchImage({ src, alt, className = '', fit = 'cover' }: SearchImageProps) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full ${fitClass} ${className}`.trim()}
    />
  );
}

type SearchImageFixedProps = SearchImageProps & {
  width?: number;
  height?: number;
};

export function SearchImageFixed({
  src,
  alt,
  className = '',
  fit = 'cover',
  width,
  height,
}: SearchImageFixedProps) {
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={`${fitClass} ${className}`.trim()}
    />
  );
}
