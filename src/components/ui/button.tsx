import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

/**
 * Horizon Button — shadcn/ui Button restyled for the Horizon design system.
 *
 * Variants
 *  default     Main action. Brand blue on Day, white on Night (follows --primary).
 *  brand       Always brand blue (hero CTA "Enroll in the intensive").
 *  white       Always white with dark text (hero nav, account icon button).
 *  secondary   Raised control: white on Day, navy-800 on Night, with a hairline.
 *  outline     Transparent with a border.
 *  ghost       Text only; tints on hover.
 *  glass       Translucent navy pill for the hero ("Intensive Course" style).
 *  ai          White pill with blue glow, for AI actions ("Ask AI").
 *  destructive, link — kept from shadcn.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium tracking-[-0.01em] whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        brand: "bg-blue-600 text-white hover:bg-blue-700",
        white: "bg-white text-slate-950 shadow-sm hover:bg-slate-100",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:border-muted-foreground/40 aria-expanded:bg-muted",
        outline:
          "border-border bg-transparent text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        ghost: "text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        glass:
          "border-white/20 bg-blue-950/70 text-white backdrop-blur-md hover:bg-blue-950/85",
        ai: "rounded-full bg-white text-blue-600 font-normal shadow-glow hover:bg-blue-50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-accent-foreground underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-[13px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-13 gap-3 rounded-full px-8 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-1.5",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-13 rounded-full [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      {
        variant: "ai",
        size: "sm",
        className: "pr-3 has-data-[icon=inline-start]:pl-1",
      },
      {
        variant: "ai",
        size: "default",
        className: "pr-5 has-data-[icon=inline-start]:pl-1",
      },
      { variant: "ai", size: "lg", className: "pr-6 text-[17px]" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

/** The blue orb that leads an AI button: <Button variant="ai"><AIOrb />Ask AI</Button> */
function AIOrb({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-icon="inline-start"
      className={cn(
        "bg-orb inline-flex aspect-square h-[calc(100%-8px)] items-center justify-center rounded-full text-white [&_svg]:size-3.5",
        className,
      )}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c.7 5.6 3.4 8.3 10 10-6.6 1.7-9.3 4.4-10 10-.7-5.6-3.4-8.3-10-10 6.6-1.7 9.3-4.4 10-10z" />
        </svg>
      )}
    </span>
  );
}

export { Button, AIOrb, buttonVariants };
