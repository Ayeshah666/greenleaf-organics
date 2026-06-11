'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/context/cartStore';
import toast from 'react-hot-toast';

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

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setAdded(true);
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added`);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product._id}`} className="block product-card group">
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 badge badge-green">{product.badge}</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 badge badge-amber">Low Stock</span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="section-eyebrow mb-1">{product.category}</p>
          <h3 className="font-semibold text-sm leading-snug mb-2 text-gray-900 line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold" style={{ color: 'var(--forest)' }}>
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="btn-primary !px-3 !py-2 !text-xs"
              style={{ borderRadius: '2px' }}
            >
              {added ? <Check size={14} /> : <ShoppingCart size={14} />}
              {added ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
