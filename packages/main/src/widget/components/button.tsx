import * as React from "react";
import { widgetPadding } from "../widger-container";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const getVariantStyles = (variant: ButtonVariant = "default") => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    whiteSpace: "nowrap" as const,
    borderRadius: "0",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    border: "none",
  };

  switch (variant) {
    case "default":
      return {
        ...baseStyles,
        background: "#000000",
        color: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      };
    case "destructive":
      return {
        ...baseStyles,
        background: "#ef4444",
        color: "#ffffff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      };
    case "outline":
      return {
        ...baseStyles,
        background: "transparent",
        color: "inherit",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      };
    case "secondary":
      return {
        ...baseStyles,
        background: "#f3f4f6",
        color: "#374151",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      };
    case "ghost":
      return {
        ...baseStyles,
        background: "transparent",
        color: "inherit",
      };
    case "link":
      return {
        ...baseStyles,
        background: "transparent",
        color: "#000000",
        textDecoration: "underline",
        textUnderlineOffset: "4px",
      };
    default:
      return baseStyles;
  }
};

const getSizeStyles = (size: ButtonSize = "default") => {
  switch (size) {
    case "sm":
      return {
        height: "32px",
        padding: "0 12px",
        gap: "6px",
        fontSize: "14px",
      };
    case "lg":
      return {
        height: "40px",
        padding: "0 24px",
        gap: "8px",
        fontSize: "14px",
      };
    case "icon":
      return {
        width: "36px",
        height: "36px",
        padding: "0",
      };
    default:
      return {
        height: "36px",
        padding: "0 16px",
        gap: "8px",
        fontSize: "14px",
      };
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = getVariantStyles(variant);
    const sizeStyles = getSizeStyles(size);

    const combinedStyles = {
      ...variantStyles,
      ...sizeStyles,
      ...(props.style || {}),
    };

    // Handle disabled state
    if (props.disabled) {
      combinedStyles.opacity = "0.5";
      combinedStyles.pointerEvents = "none";
    }

    // Handle hover effects (simplified for inline styles)
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      const target = e.currentTarget;
      switch (variant) {
        case "default":
          target.style.background = "rgba(0, 0, 0, 0.9)";
          break;
        case "destructive":
          target.style.background = "rgba(239, 68, 68, 0.9)";
          break;
        case "outline":
          target.style.background = "#f3f4f6";
          break;
        case "secondary":
          target.style.background = "rgba(243, 244, 246, 0.8)";
          break;
        case "ghost":
          target.style.background = "#f3f4f6";
          break;
        case "link":
          target.style.textDecoration = "underline";
          break;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) return;

      const target = e.currentTarget;
      const originalStyles = getVariantStyles(variant);
      target.style.background = originalStyles.background as string;
      target.style.textDecoration =
        (originalStyles as any).textDecoration || "none";
    };

    return (
      <button
        ref={ref}
        style={combinedStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
