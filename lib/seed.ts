import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greenleaf';

const products = [
  {
    name: 'Heirloom Tomato Seed Collection',
    description: 'A curated collection of 6 heirloom tomato varieties — Cherokee Purple, Brandywine, Green Zebra, Black Krim, Yellow Pear, and Mortgage Lifter. Open-pollinated, non-GMO seeds selected for flavor-first gardening.',
    price: 18.99,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
    stock: 85,
    featured: true,
    badge: 'Best Seller',
    weight: '12g total (2g per variety)',
    benefits: ['Non-GMO & open-pollinated', 'High germination rate (90%+)', 'Suitable for containers & raised beds'],
  },
  {
    name: 'Premium Worm Castings',
    description: 'Pure vermicompost from red wiggler worms fed a diet of aged manure and vegetable scraps. No fillers, no chemicals — just dense, microbe-rich castings that supercharge soil biology.',
    price: 24.99,
    category: 'Soil & Compost',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    stock: 60,
    featured: true,
    badge: 'Top Rated',
    weight: '5 lbs',
    benefits: ['Improves soil drainage & aeration', 'Feeds plants for up to 6 months', 'Odor-free & pet safe'],
  },
  {
    name: 'Forged Steel Soil Knife',
    description: 'A Japanese-influenced hori hori with a 7-inch stainless blade, graduated depth markings, and a serrated edge. The rosewood handle is sustainably sourced and treated with linseed oil.',
    price: 44.95,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    stock: 35,
    featured: false,
    badge: 'Staff Pick',
    benefits: ['Full-tang construction', 'Lifetime sharpening guarantee', 'Includes leather sheath'],
  },
  {
    name: 'Cold-Processed Neem Oil Concentrate',
    description: 'First-press neem oil with 3000+ ppm azadirachtin content — the highest available in retail. Effective against aphids, spider mites, whitefly, and fungal issues like powdery mildew.',
    price: 21.50,
    category: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&q=80',
    stock: 48,
    featured: false,
    badge: 'Organic',
    weight: '16 oz',
    benefits: ['OMRI listed for organic use', 'Works as spray, soil drench, or preventive', 'Non-toxic to bees when applied at dusk'],
  },
  {
    name: 'Herb Garden Starter Kit',
    description: 'Everything you need to grow six culinary herbs from seed: Genovese basil, flat-leaf parsley, French thyme, chives, cilantro, and oregano. Includes peat pots, organic seed-starting mix, and bamboo labels.',
    price: 34.99,
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
    stock: 42,
    featured: true,
    badge: 'Great Gift',
    benefits: ['Ready to plant in 10 minutes', 'Includes care instruction cards', 'Compostable peat pots'],
  },
  {
    name: 'Kelp & Fish Emulsion Fertilizer',
    description: 'A cold-processed blend of Pacific kelp and wild-caught anchovies. Rich in NPK (4-4-1), trace minerals, and natural cytokinins that promote root development and stress resistance.',
    price: 19.99,
    category: 'Fertilizers',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    stock: 70,
    featured: false,
    badge: 'Organic',
    weight: '32 oz (makes 32 gallons)',
    benefits: ['Feeds within 24 hours', 'Safe for seedlings & transplants', 'Improves soil microbiome'],
  },
  {
    name: 'Recycled Terracotta Planter Set',
    description: 'Set of 3 handcrafted planters (6", 8", 10") made from reclaimed terracotta. Each has a drainage hole and matching saucer. The irregular matte finish gives each piece a distinct character.',
    price: 52.00,
    category: 'Planters',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80',
    stock: 25,
    featured: true,
    badge: 'Eco Made',
    benefits: ['Breathable walls reduce overwatering', 'Frost-resistant to 15°F', 'Each piece is one-of-a-kind'],
  },
  {
    name: 'Biochar Soil Amendment',
    description: 'Activated hardwood biochar charged with compost tea and mycorrhizal fungi. Biochar creates a permanent pore structure in soil — improving water retention, CEC, and microbial habitat for decades.',
    price: 28.00,
    category: 'Soil & Compost',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    stock: 38,
    featured: false,
    weight: '8 lbs',
    benefits: ['Sequesters carbon long-term', 'Reduces watering needs by up to 20%', 'Pre-charged — ready to use'],
  },
  {
    name: 'Copper Watering Can — 1.6 Gallon',
    description: 'Spun copper watering can with a long brass rose and a removable fine mist head. Copper naturally inhibits algae growth in standing water. Develops a living patina over time.',
    price: 68.00,
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    stock: 18,
    featured: false,
    badge: 'Heirloom Quality',
    benefits: ['Anti-algae properties', 'Balanced when full (1.6 gal)', 'Will last 20+ years with care'],
  },
  {
    name: 'Diatomaceous Earth — Food Grade',
    description: 'Freshwater-sourced, food-grade diatomaceous earth — the mechanical insect killer with zero chemical resistance risk. Effective against slugs, root weevils, fungus gnats, and crawling pests.',
    price: 15.99,
    category: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&q=80',
    stock: 90,
    featured: false,
    badge: 'Organic',
    weight: '4 lbs',
    benefits: ['OMRI & USDA certified', 'No resistance buildup', 'Safe around children & pets when dry'],
  },
];

const adminUser = {
  name: 'Jordan Miles',
  email: 'admin@greenleaf.com',
  password: 'admin123',
  role: 'admin' as const,
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await mongoose.connection.collection('products').deleteMany({});
  await mongoose.connection.collection('users').deleteMany({});
  console.log('Cleared existing data');

  // Insert products
  await mongoose.connection.collection('products').insertMany(products);
  console.log(`Inserted ${products.length} products`);

  // Insert admin user
  const hashedPassword = await bcrypt.hash(adminUser.password, 12);
  await mongoose.connection.collection('users').insertOne({
    ...adminUser,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('Created admin user: admin@greenleaf.com / admin123');

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
