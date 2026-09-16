import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  brandAssets,
  footerLogoHeight,
  headerLogoHeight,
} from "@/brand/theme";

const heightClass = {
  38: "h-[38px]",
  40: "h-[40px]",
  44: "md:h-[44px]",
} as const;

type BrandLogoProps = {
  variant: "header" | "footer";
  className?: string;
};

export default function BrandLogo({ variant, className }: BrandLogoProps) {
  const isHeader = variant === "header";

  return (
    <Image
      src={brandAssets.logo}
      alt=""
      width={640}
      height={270}
      unoptimized
      priority={isHeader}
      fetchPriority={isHeader ? "high" : "low"}
      className={cn(
        "block w-auto",
        isHeader
          ? [heightClass[headerLogoHeight.mobile], heightClass[headerLogoHeight.desktop]]
          : heightClass[footerLogoHeight],
        className,
      )}
    />
  );
}
