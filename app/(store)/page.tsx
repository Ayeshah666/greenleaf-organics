'use client';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';
import { Leaf, Truck, Shield, RefreshCw, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Seeds', emoji: '🌱', desc: 'Heirloom & open-pollinated', href: '/products?category=Seeds', color: '#e8f5e9' },
  { name: 'Soil & Compost', emoji: '🪱', desc: 'Living soil amendments', href: '/products?category=Soil+%26+Compost', color: '#fff8e1' },
  { name: 'Tools', emoji: '🔨', desc: 'Built to last generations', href: '/products?category=Tools', color: '#f3e5f5' },
  { name: 'Fertilizers', emoji: '💧', desc: 'Feed the soil, not the plant', href: '/products?category=Fertilizers', color: '#e3f2fd' },
  { name: 'Pest Control', emoji: '🌿', desc: 'Natural, chemical-free', href: '/products?category=Pest+Control', color: '#e8f5e9' },
  { name: 'Planters', emoji: '🏺', desc: 'Artisan & sustainable', href: '/products?category=Planters', color: '#fce4ec' },
];

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  badge?: string;
  featured?: boolean;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=4')
      .then((r) => r.json())
      .then((d) => setFeatured(d.products || []));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: 'var(--forest)', minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 8 C55 25 65 45 40 72 C15 45 25 25 40 8Z' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow text-green-400 mb-4">Certified Organic · Non-GMO</p>
            <h1 className="text-white font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Grow something<br />
              <span style={{ color: 'var(--sage)' }}>worth eating.</span>
            </h1>
            <p className="text-green-200 text-lg leading-relaxed mb-8 max-w-md">
              Every seed, tool, and amendment in our shop is chosen with one question: would we use it in our own garden? If not, it doesn&apos;t make the shelf.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary" style={{ background: 'var(--moss)' }}>
                Shop the Collection <ArrowRight size={16} />
              </Link>
              <Link href="/products?featured=true" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                Staff Picks
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: '🌱', text: 'USDA Organic' },
                { icon: '🐝', text: 'Bee-safe formulas' },
                { icon: '♻️', text: 'Zero plastic packaging' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-green-300 text-sm font-medium">
                  <span>{item.icon}</span> {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
              'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&q=80',
              'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80',
              'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80',
            ].map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-sm ${i === 0 ? 'col-span-2' : ''}`}
                style={{ height: i === 0 ? '220px' : '160px' }}>
                <Image src={src} alt="garden" fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: 'var(--cream)', borderBottom: '1px solid var(--mist)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', sub: 'Orders over $60' },
            { icon: Leaf, title: 'Certified Organic', sub: '100% verified inputs' },
            { icon: Shield, title: 'Germination Guaranteed', sub: 'Seeds or we resend' },
            { icon: RefreshCw, title: '30-Day Returns', sub: 'No questions asked' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--mist)' }}>
                <Icon size={18} style={{ color: 'var(--forest)' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--forest)' }}>{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <p className="section-eyebrow mb-2">Browse by category</p>
        <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          What are you growing?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}
              className="group flex flex-col items-center text-center p-4 rounded-sm border border-gray-100 bg-white hover:shadow-md hover:border-green-200 transition-all"
              style={{ background: cat.color }}>
              <span className="text-3xl mb-2">{cat.emoji}</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--forest)' }}>{cat.name}</span>
              <span className="text-xs text-gray-500 mt-0.5">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-eyebrow mb-2">Handpicked</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
              Staff favorites
            </h2>
          </div>
          <Link href="/products" className="btn-outline !py-2 !px-4 text-xs">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* STORY BANNER */}
      <section className="relative overflow-hidden" style={{ background: 'var(--forest-mid)' }}>
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-eyebrow text-green-400 mb-3">Our story</p>
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Started in a 400 sq ft backyard.
            </h2>
            <p className="text-green-200 leading-relaxed mb-6">
              Jordan Miles started GreenLeaf after discovering that most garden centers couldn&apos;t answer basic questions about their inputs. We built the shop we wished existed — one where every product comes with a story, a source, and real growing advice.
            </p>
            <Link href="/about" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              Read our story
            </Link>
          </div>
          <div className="relative h-64 rounded-sm overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80"
              alt="Garden"
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
