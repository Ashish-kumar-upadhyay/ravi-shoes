export type ProductCategory = "all" | "popular" | "male" | "female" | "children";
export type CollectionType = "sneaker" | "running" | "formal";

export interface IColor {
  name: string;
  hex: string;
}

export interface IProduct {
  _id: string;
  slug: string;
  name: string;
  price: number;
  img: string;
  description: string;
  category: ProductCategory;
  collection: CollectionType;
  colors: IColor[];
  sizes: number[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  brand: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: string;
  qty: number;
  size?: number;
  color?: string;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  updatedAt: Date;
}

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  img: string;
  qty: number;
  size?: number;
  color?: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  provider?: "local" | "google";
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}
