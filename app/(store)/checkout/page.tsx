'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';
import { Check, Package, CreditCard, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [payment, setPayment] = useState({
    card: '4242 4242 4242 4242',
    expiry: '12/27',
    cvv: '123',
    name: user?.name || '',
  });

  const shippingCost = total >= 60 ? 0 : 8.95;
  const orderTotal = total + shippingCost;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          Sign in to checkout
        </h2>
        <p className="text-gray-500 mb-6">You need to be signed in to complete your order.</p>
        <Link href="/login?redirect=/checkout" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          Your cart is empty
        </h2>
        <Link href="/products" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.id,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: shipping,
          subtotal: total,
          shipping: shippingCost,
          total: orderTotal,
          paymentMethod: 'card',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      toast.success('Order placed! 🌱');
      router.push(`/account?order=${data.order._id}`);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Order failed';
      toast.error(err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? 'text-white' : i === step ? 'text-white' : 'bg-gray-200 text-gray-500'
              }`} style={i <= step ? { background: 'var(--forest)' } : {}}>
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className="text-xs mt-1 font-medium" style={{ color: i === step ? 'var(--forest)' : '#9ca3af' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-20 h-0.5 mx-1 mb-4" style={{ background: i < step ? 'var(--moss)' : '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} style={{ color: 'var(--moss)' }} />
                <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
                  Shipping address
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Full name</label>
                  <input className="input-field" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Street address</label>
                  <input className="input-field" placeholder="123 Garden Lane" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">City</label>
                  <input className="input-field" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">State</label>
                  <input className="input-field" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">ZIP code</label>
                  <input className="input-field" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Country</label>
                  <input className="input-field" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!shipping.name || !shipping.street || !shipping.city}
                className="btn-primary mt-6"
              >
                Continue to payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} style={{ color: 'var(--moss)' }} />
                <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
                  Payment details
                </h2>
              </div>
              <div className="rounded-sm p-3 mb-5 text-sm" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                🔒 This is a demo checkout. No real payment is processed. Use any card details.
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Cardholder name</label>
                  <input className="input-field" value={payment.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Card number</label>
                  <input className="input-field font-mono" value={payment.card} onChange={(e) => setPayment({ ...payment, card: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Expiry</label>
                    <input className="input-field font-mono" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">CVV</label>
                    <input className="input-field font-mono" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-outline">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary">Review order →</button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="bg-white border border-gray-100 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Package size={18} style={{ color: 'var(--moss)' }} />
                <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
                  Review your order
                </h2>
              </div>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center py-2 border-b border-gray-100">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-sm p-3 text-sm mb-5" style={{ background: 'var(--cream)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--forest)' }}>Shipping to:</p>
                <p className="text-gray-600">{shipping.name}, {shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
                <button onClick={placeOrder} disabled={placing} className="btn-primary flex-1 justify-center">
                  {placing ? 'Placing order...' : `Place order · $${orderTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white border border-gray-100 rounded-sm p-5 h-fit sticky top-24">
          <h3 className="font-bold mb-4" style={{ color: 'var(--forest)', fontFamily: 'var(--font-display)' }}>Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span style={{ color: 'var(--forest)' }}>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>🌱 Carbon-neutral shipping</p>
            <p>📦 Plastic-free packaging</p>
            <p>🔒 Secure checkout simulation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
