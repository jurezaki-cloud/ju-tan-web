import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  brandAssets,
  footerLogoHeight,
  headerLogoHeight,
} from "@/brand/theme";

const horizontalHeightClass = {
  28: "h-[28px]",
  32: "h-[32px]",
} as const;

const logoDimensions = {
  horizontal: {
    width: 590,
    height: 128,
  },
  symbol: {
    width: 128,
    height: 128,
  },
} as const;

type BrandLogoProps = {
  variant: "header" | "footer";
  asset?: "horizontal" | "symbol";
  alt?: string;
  className?: string;
};

function getHeightClass(
  variant: BrandLogoProps["variant"],
  asset: NonNullable<BrandLogoProps["asset"]>,
) {
  if (asset === "symbol") {
    return variant === "header"
      ? [
          horizontalHeightClass[headerLogoHeight.mobile],
          `md:${horizontalHeightClass[headerLogoHeight.desktop]}`,
        ]
      : horizontalHeightClass[footerLogoHeight];
  }

  return variant === "header"
    ? [
        horizontalHeightClass[headerLogoHeight.mobile],
        `md:${horizontalHeightClass[headerLogoHeight.desktop]}`,
      ]
    : horizontalHeightClass[footerLogoHeight];
}

export default function BrandLogo({
  variant,
  asset = "horizontal",
  alt,
  className,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const { width, height } = logoDimensions[asset];
  const sources =
    asset === "symbol"
      ? brandAssets.logos.symbol
      : brandAssets.logos.horizontal;

  return (
    <span
      className={cn("inline-flex items-center", className)}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={sources.dark}
        alt=""
        aria-hidden
        width={width}
        height={height}
        unoptimized
        priority={isHeader}
        fetchPriority={isHeader ? "high" : "low"}
        className={cn("block w-auto light:hidden", getHeightClass(variant, asset))}
      />
      <Image
        src={sources.light}
        alt=""
        aria-hidden
        width={width}
        height={height}
        unoptimized
        priority={isHeader}
        fetchPriority={isHeader ? "high" : "low"}
        className={cn("hidden w-auto light:block", getHeightClass(variant, asset))}
      />
    </span>
  );
}
