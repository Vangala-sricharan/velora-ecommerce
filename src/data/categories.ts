import { ProductCategory } from '../types';

export interface CategoryInfo {
  id: ProductCategory;
  name: ProductCategory;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    slug: 'electronics',
    tagline: 'Cutting-edge tech & audio',
    description: 'Immersive sound, smart wearables, and powerful audio companions engineered for modern living.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    slug: 'fashion',
    tagline: 'Contemporary streetwear & essentials',
    description: 'Elevated staples, comfortable oversized drapes, and modern utility wear tailored for effortless confidence.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
  {
    id: 'Home & Living',
    name: 'Home & Living',
    slug: 'home-and-living',
    tagline: 'Serene spaces & smart lifestyle',
    description: 'Minimalist organizers, ambient lighting, and artisanal ceramicware to inspire calm within your sanctuary.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
  {
    id: 'Accessories',
    name: 'Accessories',
    slug: 'accessories',
    tagline: 'Precision craft & everyday carry',
    description: 'Full-grain leather wallets, polarized eyewear, and sleek protective sleeves crafted with exacting standards.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
  {
    id: 'Beauty & Personal Care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-and-personal-care',
    tagline: 'Glow, nourish & elevate your routine',
    description: 'Clean dermatological cleansers, deep-acting gel moisturizers, and signature olfactory fragrances.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
  {
    id: 'Sports & Fitness',
    name: 'Sports & Fitness',
    slug: 'sports-and-fitness',
    tagline: 'Peak performance & active living',
    description: 'High-rebound runners, non-slip alignment yoga mats, and versatile gear engineered to support your movement.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    itemCount: 4,
  },
];
