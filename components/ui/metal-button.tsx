"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ColorVariant = "default" | "primary" | "success" | "gold";

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}

const colorVariants: Record<
  ColorVariant,
  { outer: string; inner: string; button: string; textColor: string; textShadow: string }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#a3e635] via-[#3e8f4a] to-[#0a0a0b]",
    button: "bg-gradient-to-b from-[#a3e635] to-[#3e8f4a]",
    textColor: "text-black",
    textShadow: "[text-shadow:_0_-1px_0_rgb(163_230_53_/_100%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#3a2d00]",
    textShadow: "[text-shadow:_0_1px_0_rgba(255,255,255,0.4)]",
  },
};

const metalVariants = (
  variant: ColorVariant,
  isPressed: boolean,
  isHovered: boolean,
  isTouch: boolean,
) => {
  const c = colorVariants[variant];
  const trans = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";
  return {
    wrapper: cn("relative inline-flex transform-gpu rounded-md p-[1.25px] will-change-transform", c.outer),
    wrapperStyle: {
      transform: isPressed ? "translateY(2.5px) scale(0.99)" : "translateY(0) scale(1)",
      boxShadow: isPressed
        ? "0 1px 2px rgba(0, 0, 0, 0.15)"
        : isHovered && !isTouch
          ? "0 6px 18px rgba(0, 0, 0, 0.2)"
          : "0 3px 8px rgba(0, 0, 0, 0.08)",
      transition: trans,
      transformOrigin: "center center",
    },
    inner: cn("absolute inset-[1px] transform-gpu rounded-md will-change-transform", c.inner),
    innerStyle: {
      transition: trans,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouch ? "brightness(1.05)" : "none",
    },
    button: cn(
      "relative z-10 m-[1px] rounded-md inline-flex h-11 transform-gpu cursor-pointer items-center justify-center overflow-hidden px-6 py-2 text-sm leading-none font-semibold will-change-transform outline-none",
      c.button,
      c.textColor,
      c.textShadow,
    ),
    buttonStyle: {
      transform: isPressed ? "scale(0.97)" : "scale(1)",
      transition: trans,
      transformOrigin: "center center",
      filter: isHovered && !isPressed && !isTouch ? "brightness(1.02)" : "none",
    },
  };
};

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTouch, setIsTouch] = React.useState(false);

    React.useEffect(() => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    const v = metalVariants(variant, isPressed, isHovered, isTouch);

    return (
      <div className={v.wrapper} style={v.wrapperStyle}>
        <div className={v.inner} style={v.innerStyle} />
        <button
          ref={ref}
          className={cn(v.button, className)}
          style={v.buttonStyle}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => {
            setIsPressed(false);
            setIsHovered(false);
          }}
          onMouseEnter={() => !isTouch && setIsHovered(true)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
          {...props}
        >
          {children}
          {isHovered && !isPressed && !isTouch && (
            <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-t from-transparent to-white/15" />
          )}
        </button>
      </div>
    );
  },
);

MetalButton.displayName = "MetalButton";
