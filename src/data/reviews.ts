import { ProductReview } from '../types';

export const INITIAL_REVIEWS: Record<number, ProductReview[]> = {
  1: [
    {
      id: 'rev-1',
      name: 'Aditya Verma',
      rating: 5,
      comment: 'The noise cancellation is genuinely astounding at this price bracket. Deep bass without muddying the mids. Commuting by metro is so much more peaceful now.',
      date: '12 Aug 2026',
      productPurchased: 'Pulse X1 Wireless Headphones',
    },
    {
      id: 'rev-2',
      name: 'Pooja Sharma',
      rating: 5,
      comment: 'Super comfortable over-ear cushioning. Wore it throughout an 8-hour shift and zero ear fatigue. Battery lasted nearly 4 full days of regular listening.',
      date: '02 Sep 2026',
      productPurchased: 'Pulse X1 Wireless Headphones',
    },
  ],
  2: [
    {
      id: 'rev-3',
      name: 'Rohan Mehra',
      rating: 5,
      comment: 'Very snug fit during workouts and morning runs. Instant pairing with both my laptop and phone. Charging case is tiny and fits in watch pocket.',
      date: '18 Aug 2026',
      productPurchased: 'AirBeat Pro TWS Earbuds',
    },
  ],
  3: [
    {
      id: 'rev-4',
      name: 'Sneha Kapoor',
      rating: 5,
      comment: 'AMOLED display is sharp and vivid even in bright Indian afternoon sunshine. Battery easily lasts 8-9 days on a single charge. Great value!',
      date: '28 Aug 2026',
      productPurchased: 'NovaFit Smartwatch',
    },
  ],
  5: [
    {
      id: 'rev-5',
      name: 'Kabir Das',
      rating: 5,
      comment: 'The 240 GSM heavy cotton drape is phenomenal. Premium streetwear silhouette that does not look flimsy after repeated washes. Ordered two more colors.',
      date: '22 Aug 2026',
      productPurchased: 'Urban Oversized T-Shirt',
    },
  ],
  9: [
    {
      id: 'rev-6',
      name: 'Meera Nambiar',
      rating: 5,
      comment: 'Aura lamp sits on my bedside table. The warm ambient glow at 2200K is so soothing for nighttime reading. Touch controls work seamlessly.',
      date: '05 Sep 2026',
      productPurchased: 'Aura Smart LED Lamp',
    },
  ],
  13: [
    {
      id: 'rev-7',
      name: 'Vikram Sengupta',
      rating: 5,
      comment: 'True full-grain leather. You can smell the authentic tanning right out of the packaging. Slim profile yet holds all necessary cards cleanly.',
      date: '14 Jul 2026',
      productPurchased: 'Classic Leather Wallet',
    },
  ],
  19: [
    {
      id: 'rev-8',
      name: 'Ananya Roy',
      rating: 5,
      comment: 'Velora Essence is luxurious and subtle. The bergamot opening into warm amber is refined and lasts on clothes till the next day.',
      date: '01 Sep 2026',
      productPurchased: 'Velora Essence Perfume',
    },
  ],
  21: [
    {
      id: 'rev-9',
      name: 'Kunal Singhania',
      rating: 5,
      comment: 'The alignment lines on the FlexCore mat helped my posture tremendously in downward dog. No rubber smell and fantastic non-slip grip on marble tile.',
      date: '19 Aug 2026',
      productPurchased: 'FlexCore Yoga Mat',
    },
  ],
};

export const DEMO_HOME_REVIEWS: ProductReview[] = [
  {
    id: 'rev-home-1',
    name: 'Pooja Sharma',
    rating: 5,
    comment: 'The Pulse X1 headphones exceeded my expectations. Sound clarity is crisp and shipping took just 2 days. VELORA provides an amazingly smooth checkout experience.',
    date: '02 Sep 2026',
    productPurchased: 'Pulse X1 Wireless Headphones',
  },
  {
    id: 'rev-home-2',
    name: 'Kabir Das',
    rating: 5,
    comment: 'Urban Oversized T-Shirt fits exactly how modern streetwear should. Premium fabric thickness, solid stitching, and no shrinkage after machine wash.',
    date: '22 Aug 2026',
    productPurchased: 'Urban Oversized T-Shirt',
  },
  {
    id: 'rev-home-3',
    name: 'Meera Nambiar',
    rating: 5,
    comment: 'The Aura Smart LED Lamp completely upgraded my nightstand aesthetic. Dimmable warm light is gentle on the eyes and the build quality feels luxurious.',
    date: '05 Sep 2026',
    productPurchased: 'Aura Smart LED Lamp',
  },
  {
    id: 'rev-home-4',
    name: 'Ananya Roy',
    rating: 5,
    comment: 'Velora Essence perfume is stunning. Amber and bergamot notes linger throughout the evening. Will definitely be a repeat shopper on VELORA!',
    date: '01 Sep 2026',
    productPurchased: 'Velora Essence Perfume',
  },
];
