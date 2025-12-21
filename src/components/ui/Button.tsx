import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "primary" | "secondary" | "precision";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.97]";

        const variants = {
            default: "bg-foreground text-background hover:bg-foreground/90 shadow-sm",
            primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20",
            precision: "bg-background text-foreground border border-border hover:border-primary hover:text-primary shadow-sm",
            outline:
                "border border-border bg-background text-foreground hover:bg-secondary hover:border-foreground/20",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        };

        const sizes = {
            sm: "h-8 px-3 text-[11px] uppercase tracking-wider",
            md: "h-10 px-4 text-sm",
            lg: "h-12 px-6 text-base tracking-tight",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant as keyof typeof variants] || variants.default, sizes[size], className)}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export default Button;
