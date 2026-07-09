import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/store";

interface AnimatedAddToCartButtonProps {
  product: Product;
  quantity?: number;
  onAddToCart: (product: Product, quantity: number) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  variant?: "full" | "compact";
}

export function AnimatedAddToCartButton({
  product,
  quantity = 1,
  onAddToCart,
  disabled = false,
  className = "",
  variant = "full",
}: AnimatedAddToCartButtonProps) {
  const [animationState, setAnimationState] = useState<"idle" | "folding" | "success" | "resetting">("idle");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating || disabled) return;

    setIsAnimating(true);
    setAnimationState("folding");

    // First add to cart
    await onAddToCart(product, quantity);

    // Start folding animation
    setTimeout(() => {
      setAnimationState("success");
    }, 1200);

    // Show success state for 2 seconds
    setTimeout(() => {
      setAnimationState("resetting");
    }, 3200);

    // Reset to idle
    setTimeout(() => {
      setAnimationState("idle");
      setIsAnimating(false);
    }, 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isAnimating}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: animationState === "idle" ? (variant === "full" ? "#ffffff" : "#1a1a1a") : "#f5f0e8",
        color: animationState === "idle" ? (variant === "full" ? "#1a1a1a" : "#ffffff") : "#1a1a1a",
        boxShadow: variant === "full" ? "0 4px 12px rgba(0, 0, 0, 0.08)" : undefined,
        border: variant === "full" ? "1px solid rgba(0, 0, 0, 0.08)" : undefined,
        minWidth: variant === "full" ? "180px" : "auto",
        minHeight: variant === "full" ? "48px" : "auto",
        padding: variant === "compact" ? "8px 16px" : undefined,
        fontSize: variant === "compact" ? "10px" : undefined,
      }}
      whileHover={!isAnimating && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isAnimating && !disabled ? { scale: 0.98 } : {}}
      aria-label={`Add ${product.name} to cart`}
    >
      <AnimatePresence mode="wait">
        {animationState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {variant === "full" && (
              <>
                <span>Add to Cart</span>
                <span className="ml-1 text-neutral-500">| ₹{product.price}</span>
              </>
            )}
            {variant === "compact" && <span>Add</span>}
          </motion.div>
        )}

        {animationState === "folding" && (
          <motion.div
            key="folding"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Origami Bag Folding Animation */}
            <svg width="60" height="60" viewBox="0 0 60 60" className="overflow-visible">
              {/* Bag body - folds from flat to 3D */}
              <motion.path
                d="M10 20 L10 50 L50 50 L50 20"
                fill="none"
                stroke="#c9a962"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {/* Bag bottom fold */}
              <motion.path
                d="M10 50 L30 55 L50 50"
                fill="none"
                stroke="#c9a962"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Bag top fold line */}
              <motion.path
                d="M10 20 L50 20"
                fill="none"
                stroke="#c9a962"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
              />

              {/* Left side fold */}
              <motion.path
                d="M10 20 L10 50"
                fill="none"
                stroke="#b8994a"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
              />

              {/* Right side fold */}
              <motion.path
                d="M50 20 L50 50"
                fill="none"
                stroke="#b8994a"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
              />

              {/* Handle - appears after bag is formed */}
              <motion.path
                d="M15 20 Q15 5, 30 5 Q45 5, 45 20"
                fill="none"
                stroke="#d4b86a"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
              />

              {/* Tag - slides onto bag */}
              <motion.g
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8, ease: "easeInOut" }}
              >
                <rect x="25" y="30" width="12" height="16" fill="#f5f0e8" stroke="#c9a962" strokeWidth="1" rx="1" />
                <circle cx="31" cy="34" r="1.5" fill="#c9a962" />
              </motion.g>
            </svg>
          </motion.div>
        )}

        {animationState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut", type: "spring" }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500"
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Added to Cart
            </motion.span>
          </motion.div>
        )}

        {animationState === "resetting" && (
          <motion.div
            key="resetting"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-green-500" />
            <span>Added to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
