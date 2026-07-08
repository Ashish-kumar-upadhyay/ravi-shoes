import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1).optional().default(1),
  size: z.number().optional(),
  color: z.string().optional(),
});

export const cartSyncSchema = z.object({
  items: z.array(cartItemSchema).max(50),
});

export const orderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(3),
  }),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5, "Review must be at least 5 characters"),
});
