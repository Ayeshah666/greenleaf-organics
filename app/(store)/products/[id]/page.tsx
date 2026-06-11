'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Check, Package, Leaf } from 'lucide-react';
import { useCartStore } from '@/context/cartStore';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  badge?: string;
  weight?: string;
  benefits?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product));
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: 'var(--moss)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product._id, name: product.name, price: product.price, image: product.image, stock: product.stock });
    }
    setAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:underline" style={{ color: 'var(--moss)' }}>
        <ArrowLeft size={14} /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio: '1', background: 'var(--cream)' }}>
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="600px" />
          {product.badge && (
            <span className="absolute top-4 left-4 badge badge-green">{product.badge}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="section-eyebrow mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold" style={{ color: 'var(--forest)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.weight && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.weight}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-6 p-4 rounded-sm" style={{ background: 'var(--cream)' }}>
              <p className="font-semibold text-sm mb-3" style={{ color: 'var(--forest)' }}>Why it works</p>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Leaf size={13} style={{ color: 'var(--moss)' }} className="flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {product.stock > 5 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border" style={{ borderColor: 'var(--mist)', borderRadius: '2px' }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1">
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                {added ? 'Added to cart!' : 'Add to cart'}
              </button>
            </div>
          )}

          <Link href="/cart" className="btn-outline w-full text-center justify-center">
            View cart
          </Link>

          {/* Shipping note */}
          <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
            <Package size={14} />
            <span>Free shipping on orders over $60. Usually ships in 1–2 business days.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
