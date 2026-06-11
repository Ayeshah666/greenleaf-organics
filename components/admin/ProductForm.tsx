'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const CATEGORIES = ['Seeds', 'Soil & Compost', 'Tools', 'Fertilizers', 'Pest Control', 'Planters'];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
  featured: boolean;
  badge: string;
  weight: string;
  benefits: string;
}

interface Props {
  initialData?: Partial<ProductFormData>;
  productId?: string;
  mode: 'new' | 'edit';
}

const EMPTY: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: 'Seeds',
  image: '',
  stock: '',
  featured: false,
  badge: '',
  weight: '',
  benefits: '',
};

export default function ProductForm({ initialData, productId, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({ ...EMPTY, ...initialData });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof ProductFormData, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        benefits: form.benefits
          ? form.benefits.split('\n').map((b) => b.trim()).filter(Boolean)
          : [],
      };

      const url = mode === 'new' ? '/api/products' : `/api/products/${productId}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      toast.success(mode === 'new' ? 'Product created!' : 'Product updated!');
      router.push('/admin/products');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:underline" style={{ color: 'var(--moss)' }}>
        <ArrowLeft size={14} /> Back to products
      </Link>

      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
        {mode === 'new' ? 'Add new product' : 'Edit product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core fields */}
        <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Product info</h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Name *</label>
            <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Heirloom Tomato Seed Collection" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Description *</label>
            <textarea
              className="input-field"
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
              placeholder="Write a detailed, honest description. Customers read this carefully."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Price ($) *</label>
              <input className="input-field" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required placeholder="19.99" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Stock *</label>
              <input className="input-field" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} required placeholder="50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Category *</label>
            <select className="input-field cursor-pointer" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Image</h2>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Image URL *</label>
            <input className="input-field" value={form.image} onChange={(e) => set('image', e.target.value)} required placeholder="https://images.unsplash.com/photo-..." />
            <p className="text-xs text-gray-400 mt-1">Use a high-quality Unsplash or CDN URL. Recommended aspect ratio: 4:3.</p>
          </div>
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="preview" className="w-40 h-32 object-cover rounded-sm border border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
        </div>

        {/* Extra fields */}
        <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Optional details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Badge label</label>
              <input className="input-field" value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="Best Seller, New, Organic…" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Weight / size</label>
              <input className="input-field" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="5 lbs, 16 oz, Set of 3…" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">Benefits (one per line)</label>
            <textarea
              className="input-field"
              rows={3}
              value={form.benefits}
              onChange={(e) => set('benefits', e.target.value)}
              placeholder={"Non-GMO & open-pollinated\nHigh germination rate (90%+)\nSuitable for containers"}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-green-700 cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--forest)' }}>
              Feature on homepage
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={15} />
            {saving ? 'Saving…' : mode === 'new' ? 'Create product' : 'Save changes'}
          </button>
          <Link href="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
