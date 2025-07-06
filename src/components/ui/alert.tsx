// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const alertVariants = cva(
//   "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
//   {
//     variants: {
//       variant: {
//         default: "bg-background text-foreground",
//         destructive:
//           "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// )

// const Alert = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
// >(({ className, variant, ...props }, ref) => (
//   <div
//     ref={ref}
//     role="alert"
//     className={cn(alertVariants({ variant }), className)}
//     {...props}
//   />
// ))
// Alert.displayName = "Alert"

// const AlertTitle = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLHeadingElement>
// >(({ className, ...props }, ref) => (
//   <h5
//     ref={ref}
//     className={cn("mb-1 font-medium leading-none tracking-tight", className)}
//     {...props}
//   />
// ))
// AlertTitle.displayName = "AlertTitle"

// const AlertDescription = React.forwardRef<
//   HTMLParagraphElement,
//   React.HTMLAttributes<HTMLParagraphElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("text-sm [&_p]:leading-relaxed", className)}
//     {...props}
//   />
// ))
// AlertDescription.displayName = "AlertDescription"

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-6 py-4 text-base shadow-2xl flex items-start gap-3 animate-fade-in-up transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#23235b]/90 via-[#29295e]/90 to-[#23235b]/90 text-white border-[#3a3a6a]",
        success:
          "bg-gradient-to-r from-green-400/20 via-blue-500/20 to-blue-400/20 text-green-300 border-green-400/40",
        destructive:
          "bg-gradient-to-r from-pink-500/20 via-yellow-400/20 to-red-500/20 text-pink-400 border-pink-400/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-bold text-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base text-white/90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
