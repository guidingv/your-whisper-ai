import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-aurora hover:shadow-whisper",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-card/50 text-foreground hover:bg-card hover:border-primary/30 backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg",
        ghost: "hover:bg-card/50 hover:text-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-aurora text-primary-foreground hover:scale-105 shadow-aurora hover:shadow-whisper font-semibold",
        whisper: "bg-whisper border border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/40 backdrop-blur-md",
        floating: "bg-card/80 text-foreground hover:bg-card hover:-translate-y-1 shadow-card hover:shadow-whisper backdrop-blur-sm border border-border/50",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
