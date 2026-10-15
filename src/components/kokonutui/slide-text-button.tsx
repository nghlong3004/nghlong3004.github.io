"use client";

/**
 * @author: @kokonut-labs
 * @description: Slide Text Button with animated vertical text transition
 * @version: 1.0.0
 * @date: 2025-11-02
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface SlideTextButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text?: React.ReactNode;
  hoverText?: React.ReactNode;
  icon?: React.ReactNode;
  hoverIcon?: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "ghost";
  /** Fades and slides the button in when it mounts. */
  animateIn?: boolean;
}

export default function SlideTextButton({
  text = "Browse Components",
  hoverText,
  icon,
  hoverIcon,
  href = "#",
  className,
  variant = "default",
  animateIn = false,
  ...props
}: SlideTextButtonProps) {
  const slideText = hoverText ?? text;
  const slideIcon = hoverIcon ?? icon;
  const variantStyles =
    variant === "ghost"
      ? "border border-line-strong/80 hover:border-foreground text-foreground hover:bg-foreground/5"
      : "bg-foreground text-background hover:bg-foreground/90";

  return (
    <a
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3.5 font-sans text-xs sm:text-sm font-medium tracking-wide uppercase transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 active:scale-95 motion-reduce:active:scale-100 shadow-sm cursor-pointer",
        animateIn &&
          "starting:translate-x-2 starting:opacity-0 motion-reduce:starting:translate-x-0",
        variantStyles,
        className
      )}
      href={href}
      {...props}
    >
      {/* Both labels share one grid cell, so the wider one sets the width
          and both stay centred; the hover label waits one row below. */}
      <span className="grid justify-items-center transition-transform duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none">
        <span className="col-start-1 row-start-1 flex items-center gap-2.5 opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0">
          <span>{text}</span>
          {icon}
        </span>
        <span
          aria-hidden="true"
          className="col-start-1 row-start-1 flex translate-y-full items-center gap-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span>{slideText}</span>
          {slideIcon}
        </span>
      </span>
    </a>
  );
}
