import { useState } from "react";
import { cn } from "../../../lib/cn";
import { Skeleton } from "./Skeleton";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean; // above-the-fold: eager + fetchpriority=high
  sizes?: string;
  srcSet?: string;
  lqip?: string; // tiny base64 placeholder
};

export function LazyImage({
  src, alt, width, height, className, imgClassName,
  priority = false, sizes, srcSet, lqip,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl bg-charcoal/60", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!loaded && (
        <>
          {lqip ? (
            <img
              src={lqip}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-105 object-cover blur-xl"
            />
          ) : (
            <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          )}
        </>
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  );
}