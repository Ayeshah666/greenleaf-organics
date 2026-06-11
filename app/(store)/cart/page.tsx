'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/context/cartStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = total >= 60 ? 0 : 8.95;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products" className="btn-primary">
          Browse products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
        Your cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-sm p-4 flex gap-4 items-start">
              <div className="relative w-20 h-20 rounded-sm overflow-hidden flex-shrink-0" style={{ background: 'var(--cream)' }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--forest)' }}>
                  ${item.price.toFixed(2)} each
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border" style={{ borderColor: 'var(--mist)', borderRadius: '2px' }}>
                    <button className="qty-btn !w-7 !h-7 text-xs" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button className="qty-btn !w-7 !h-7 text-xs" onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-sm flex-shrink-0" style={{ color: 'var(--forest)' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--forest)', fontFamily: 'var(--font-display)' }}>
              Order summary
            </h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-green-600">
                  Add ${(60 - total).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span style={{ color: 'var(--forest)' }}>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full justify-center">
              Proceed to checkout <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="block text-center text-sm mt-3" style={{ color: 'var(--moss)' }}>
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
