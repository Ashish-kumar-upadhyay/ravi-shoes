import type { Product } from "./store";
import heroShoe from "@/assets/hero-shoe.png";
import shoeRed from "@/assets/shoe-red.png";
import shoeWhite from "@/assets/shoe-white.png";
import shoeGreen from "@/assets/shoe-green.png";
import shoeRed2 from "@/assets/shoe-red2.png";
import shoeYellow from "@/assets/shoe-yellow.png";
import shoeFlame from "@/assets/shoe-flame.png";
import shoeRetro from "@/assets/shoe-retro.png";
import shoeBlue from "@/assets/shoe-blue.png";
import shoeGreen2 from "@/assets/shoe-green2.png";
import shoeMint from "@/assets/shoe-mint.png";

export const allProducts: Product[] = [
  { id: "p1", name: "Air M32 Pro Runner", price: 560, img: shoeRed },
  { id: "p2", name: "Nike Zoom Fly", price: 560, img: shoeWhite },
  { id: "p3", name: "Volt Neon Racer", price: 560, img: shoeGreen },
  { id: "p4", name: "NB Fresh Foam", price: 560, img: shoeRed2 },
  { id: "p5", name: "Asics Gel Streak", price: 560, img: shoeYellow },
  { id: "p6", name: "Blaze Flame Low", price: 560, img: shoeFlame },
  { id: "p7", name: "Court Retro '92", price: 560, img: shoeRetro },
  { id: "p8", name: "Adidas Cloudfoam", price: 560, img: shoeBlue },
  { id: "p9", name: "Hoka Volt Trail", price: 560, img: shoeGreen2 },
  { id: "b1", name: "Mint Rush Pro", price: 560, img: shoeMint },
  { id: "b2", name: "AeroStep Onyx", price: 560, img: heroShoe },
];

export const productColors = [
  { name: "Crimson", hex: "#ef4444" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Sky", hex: "#3b82f6" },
  { name: "Violet", hex: "#8b5cf6" },
];

export const productSizes = [40, 41, 42, 43, 44, 45];

export const productReviews = [
  { id: 1, name: "Ravi K.", rating: 5, text: "Super comfy, feels like walking on clouds. Perfect fit!", date: "2 days ago" },
  { id: 2, name: "Amelia S.", rating: 4, text: "Great design and quality. Runs a half size small.", date: "1 week ago" },
  { id: 3, name: "Jordan M.", rating: 5, text: "Bought them for daily gym use — holding up amazingly.", date: "3 weeks ago" },
];

export const getProduct = (id: string) => allProducts.find((p) => p.id === id);
